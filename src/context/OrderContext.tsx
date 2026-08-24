import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { mockDb } from '../data/mockDb';

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'order_id' | 'created_at' | 'status'>) => Promise<Order>;
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

  const placeOrder = async (orderData: Omit<Order, 'order_id' | 'created_at' | 'status'>): Promise<Order> => {
    const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.order_id)) + 1 : 1001;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      order_id: newOrderId,
      status: 'Pending',
      created_at: formattedDate,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: number) => orders.find(o => o.order_id === orderId);

  const getUserOrders = (userId: number) => orders.filter(o => o.user_id === userId);

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: number) => {
    setOrders(prev => prev.filter(o => o.order_id !== orderId));
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
