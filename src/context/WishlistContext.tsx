import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, WishlistItem } from '../types';
import { mockDb } from '../data/mockDb';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => mockDb.getWishlist());

  useEffect(() => {
    mockDb.saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.product_id)) {
      const newItem: WishlistItem = {
        id: `wish_${product.product_id}_${Date.now()}`,
        p_id: product.product_id,
        product,
        added_at: new Date().toISOString(),
      };
      setWishlistItems(prev => [...prev, newItem]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prev => prev.filter(item => item.p_id !== productId));
  };

  const toggleWishlist = (product: Product): boolean => {
    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.p_id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        itemCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
