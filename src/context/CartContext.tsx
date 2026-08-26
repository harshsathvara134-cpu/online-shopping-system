import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { mockDb } from '../data/mockDb';
import { AVAILABLE_COUPONS } from '../utils/formatters';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  mergeGuestCart: (userCart: CartItem[]) => void;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => mockDb.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    mockDb.saveCart(cartItems);
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (product: Product, qty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.p_id === product.product_id);
      if (existing) {
        return prev.map(item =>
          item.p_id === product.product_id
            ? { ...item, qty: Math.min(item.qty + qty, product.product_qty) }
            : item
        );
      }
      const newItem: CartItem = {
        id: `cart_${product.product_id}_${Date.now()}`,
        p_id: product.product_id,
        product,
        qty: Math.min(qty, product.product_qty),
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const maxQty = item.product.product_qty || 99;
          return { ...item, qty: Math.min(qty, maxQty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.product_price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99; // Free shipping above ₹1000

  // Auto recalculate discount if coupon applied
  useEffect(() => {
    if (couponCode && AVAILABLE_COUPONS[couponCode]) {
      const coupon = AVAILABLE_COUPONS[couponCode];
      if (subtotal >= coupon.minOrder) {
        const discount = Math.round((subtotal * coupon.discountPercent) / 100);
        setDiscountAmount(discount);
      } else {
        setDiscountAmount(0);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, couponCode]);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: 'Invalid promo code. Try JAYVEER10, SUPER20, or WELCOME500.' };
    }

    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `This coupon requires a minimum cart subtotal of ₹${coupon.minOrder.toLocaleString('en-IN')}.`,
      };
    }

    setCouponCode(cleanCode);
    const discount = Math.round((subtotal * coupon.discountPercent) / 100);
    setDiscountAmount(discount);
    return { success: true, message: `Coupon ${cleanCode} applied! Saved ₹${discount.toLocaleString('en-IN')}.` };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const mergeGuestCart = (userCart: CartItem[]) => {
    setCartItems((currentGuest) => {
      const mergedMap = new Map<number, CartItem>();

      // First add authenticated user's existing items
      userCart.forEach((item) => {
        mergedMap.set(item.p_id, { ...item });
      });

      // Then merge guest items
      currentGuest.forEach((guestItem) => {
        const existing = mergedMap.get(guestItem.p_id);
        if (existing) {
          existing.qty = Math.min(existing.qty + guestItem.qty, guestItem.product.product_qty);
        } else {
          mergedMap.set(guestItem.p_id, { ...guestItem });
        }
      });

      const finalCart = Array.from(mergedMap.values());
      mockDb.saveCart(finalCart);
      return finalCart;
    });
  };

  const total = Math.max(0, subtotal + tax + shipping - discountAmount);
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        mergeGuestCart,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        subtotal,
        tax,
        shipping,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
