import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, OrderItem } from '../types';
import { mockDb } from '../data/mockDb';
import { AVAILABLE_COUPONS } from '../utils/formatters';
import { sanitizeInput } from '../utils/security';
import { logSecurityEvent } from '../utils/securityLogger';

interface PlaceOrderParams {
  user_id: number;
  f_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  payment_method: 'COD' | 'Card' | 'UPI' | 'NetBanking';
  cardname?: string;
  cardnumber?: string;
  coupon_code?: string;
  items: { product_id: number; qty: number }[];
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: PlaceOrderParams) => Promise<Order>;
  getOrderById: (orderId: number) => Order | undefined;
  getUserOrders: (userId: number) => Order[];
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  deleteOrder: (orderId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => mockDb.getOrders());

  useEffect(() => {
    mockDb.saveOrders(orders);
  }, [orders]);

  /**
   * Authoritative server-style order calculation & placement
   * - Cross-references each item with the catalog database
   * - Enforces authentic database prices (neutralizes frontend price tampering)
   * - Checks stock availability and updates inventory
   * - Recalculates tax, shipping, and coupon rules independently
   */
  const placeOrder = async (orderData: PlaceOrderParams): Promise<Order> => {
    const catalogProducts = mockDb.getProducts();
    const validatedItems: OrderItem[] = [];
    let authoritativeSubtotal = 0;
    let totalItemsCount = 0;

    // 1. Authoritative Item & Price Verification
    for (const item of orderData.items) {
      const dbProduct = catalogProducts.find((p) => p.product_id === item.product_id);
      if (!dbProduct) {
        throw new Error(`Product with ID #${item.product_id} is no longer available.`);
      }

      const requestedQty = Math.max(1, Math.floor(Number(item.qty) || 1));
      if (dbProduct.product_qty < requestedQty) {
        logSecurityEvent('ORDER_STOCK_DEFICIT', {
          userId: orderData.user_id,
          email: orderData.email,
          details: { productId: dbProduct.product_id, available: dbProduct.product_qty, requested: requestedQty },
        });
        throw new Error(`Insufficient stock for "${dbProduct.product_title}". Available: ${dbProduct.product_qty}`);
      }

      const itemAmount = dbProduct.product_price * requestedQty;
      authoritativeSubtotal += itemAmount;
      totalItemsCount += requestedQty;

      validatedItems.push({
        product_id: dbProduct.product_id,
        product_title: dbProduct.product_title,
        product_image: dbProduct.product_image,
        qty: requestedQty,
        amt: itemAmount,
      });
    }

    if (validatedItems.length === 0) {
      throw new Error('Order must contain at least one valid product.');
    }

    // 2. Authoritative Tax, Shipping, & Coupon Calculation
    const tax = Math.round(authoritativeSubtotal * 0.05); // 5% GST
    const shipping = authoritativeSubtotal > 1000 || authoritativeSubtotal === 0 ? 0 : 99;

    let discountAmount = 0;
    let verifiedCouponCode: string | undefined = undefined;

    if (orderData.coupon_code) {
      const cleanCoupon = orderData.coupon_code.trim().toUpperCase();
      const couponRule = AVAILABLE_COUPONS[cleanCoupon];
      if (couponRule && authoritativeSubtotal >= couponRule.minOrder) {
        discountAmount = Math.round((authoritativeSubtotal * couponRule.discountPercent) / 100);
        verifiedCouponCode = cleanCoupon;
      }
    }

    const authoritativeTotal = Math.max(0, authoritativeSubtotal + tax + shipping - discountAmount);

    // 3. Deduct Stock in Database
    const updatedCatalog = catalogProducts.map((p) => {
      const ordered = validatedItems.find((i) => i.product_id === p.product_id);
      if (ordered) {
        return { ...p, product_qty: Math.max(0, p.product_qty - ordered.qty) };
      }
      return p;
    });
    mockDb.saveProducts(updatedCatalog);

    // 4. Construct Secure Order Model
    const newOrderId = orders.length > 0 ? Math.max(...orders.map((o) => o.order_id)) + 1 : 1001;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newOrder: Order = {
      order_id: newOrderId,
      user_id: Number(orderData.user_id),
      f_name: sanitizeInput(orderData.f_name.trim()),
      email: sanitizeInput(orderData.email.trim().toLowerCase()),
      address: sanitizeInput(orderData.address.trim()),
      city: sanitizeInput(orderData.city.trim()),
      state: sanitizeInput(orderData.state.trim()),
      zip: sanitizeInput(orderData.zip.trim()),
      payment_method: orderData.payment_method,
      cardname: orderData.cardname ? sanitizeInput(orderData.cardname) : undefined,
      cardnumber: orderData.cardnumber ? sanitizeInput(orderData.cardnumber) : undefined,
      prod_count: totalItemsCount,
      total_amt: authoritativeTotal,
      discount_amt: discountAmount > 0 ? discountAmount : undefined,
      coupon_code: verifiedCouponCode,
      status: 'Pending',
      created_at: formattedDate,
      items: validatedItems,
    };

    setOrders((prev) => [newOrder, ...prev]);
    logSecurityEvent('ORDER_PLACED_SECURELY', {
      userId: newOrder.user_id,
      email: newOrder.email,
      details: { orderId: newOrder.order_id, total: newOrder.total_amt, itemsCount: totalItemsCount },
    });

    return newOrder;
  };

  const getOrderById = (orderId: number) => orders.find((o) => o.order_id === orderId);

  const getUserOrders = (userId: number) => orders.filter((o) => o.user_id === userId);

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
    );
    logSecurityEvent('ADMIN_ACTION_EXECUTED', {
      details: { action: 'UPDATE_ORDER_STATUS', orderId, newStatus: status },
    });
  };

  const deleteOrder = (orderId: number) => {
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    logSecurityEvent('ADMIN_ACTION_EXECUTED', {
      details: { action: 'DELETE_ORDER', orderId },
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
