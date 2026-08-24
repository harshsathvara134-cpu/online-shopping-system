import { Product, Category, Brand, User, Order, Review, CartItem, WishlistItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_USER, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_ADMIN } from './initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'nexusmart_products',
  CATEGORIES: 'nexusmart_categories',
  BRANDS: 'nexusmart_brands',
  ORDERS: 'nexusmart_orders',
  REVIEWS: 'nexusmart_reviews',
  USERS: 'nexusmart_users',
  CURRENT_USER: 'nexusmart_current_user',
  CART: 'nexusmart_cart',
  WISHLIST: 'nexusmart_wishlist',
};

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

export const mockDb = {
  getProducts: (): Product[] => getStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
  saveProducts: (products: Product[]): void => setStorageItem(STORAGE_KEYS.PRODUCTS, products),

  getCategories: (): Category[] => getStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
  saveCategories: (categories: Category[]): void => setStorageItem(STORAGE_KEYS.CATEGORIES, categories),

  getBrands: (): Brand[] => getStorageItem(STORAGE_KEYS.BRANDS, INITIAL_BRANDS),
  saveBrands: (brands: Brand[]): void => setStorageItem(STORAGE_KEYS.BRANDS, brands),

  getOrders: (): Order[] => getStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  saveOrders: (orders: Order[]): void => setStorageItem(STORAGE_KEYS.ORDERS, orders),

  getReviews: (): Review[] => getStorageItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]): void => setStorageItem(STORAGE_KEYS.REVIEWS, reviews),

  getUsers: (): User[] => getStorageItem(STORAGE_KEYS.USERS, [INITIAL_USER, INITIAL_ADMIN]),
  saveUsers: (users: User[]): void => setStorageItem(STORAGE_KEYS.USERS, users),

  getCurrentUser: (): User | null => getStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USER),
  saveCurrentUser: (user: User | null): void => setStorageItem(STORAGE_KEYS.CURRENT_USER, user),

  getCart: (): CartItem[] => getStorageItem(STORAGE_KEYS.CART, []),
  saveCart: (cart: CartItem[]): void => setStorageItem(STORAGE_KEYS.CART, cart),

  getWishlist: (): WishlistItem[] => getStorageItem(STORAGE_KEYS.WISHLIST, []),
  saveWishlist: (wishlist: WishlistItem[]): void => setStorageItem(STORAGE_KEYS.WISHLIST, wishlist),

  resetToDefault: (): void => {
    localStorage.clear();
    setStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStorageItem(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    setStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStorageItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setStorageItem(STORAGE_KEYS.USERS, [INITIAL_USER, INITIAL_ADMIN]);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
  },
};
