import {
  Product,
  Category,
  Brand,
  User,
  Order,
  Review,
  CartItem,
  WishlistItem,
  StoreSettings,
  AdminSession,
  CustomerSession,
  CustomerAddress,
  SavedPaymentMethod,
  OtpVerificationToken,
  DeviceFingerprint,
  PasswordResetToken,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_ADMIN, INITIAL_USER } from './initialData';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'JAYVEERMart Enterprise',
  supportEmail: 'support@jayveermart.com',
  supportPhone: '+91 1800 123 4567',
  storeAddress: 'JAYVEER Tech Park, Sector 5, Bengaluru, Karnataka 560100',
  currency: 'INR (₹)',
  freeShippingThreshold: 1000,
  standardShippingFee: 99,
  taxRatePercent: 18,
  maintenanceMode: false,
  autoConfirmOrders: true,
  orderPrefix: 'JVM',
};

const STORAGE_KEYS = {
  PRODUCTS: 'jayveermart_products',
  CATEGORIES: 'jayveermart_categories',
  BRANDS: 'jayveermart_brands',
  ORDERS: 'jayveermart_orders',
  REVIEWS: 'jayveermart_reviews',
  USERS: 'jayveermart_users',
  CURRENT_USER: 'jayveermart_current_user',
  CART: 'jayveermart_cart',
  WISHLIST: 'jayveermart_wishlist',
  STORE_SETTINGS: 'jayveermart_store_settings',
  ADMIN_SESSIONS: 'jayveermart_admin_sessions',
  CURRENT_ADMIN_SESSION: 'jayveermart_current_admin_session',
  CUSTOMER_SESSIONS: 'jayveermart_customer_sessions',
  CURRENT_CUSTOMER_SESSION: 'jayveermart_current_customer_session',
  CUSTOMER_ADDRESSES: 'jayveermart_customer_addresses',
  SAVED_PAYMENTS: 'jayveermart_saved_payments',
  KNOWN_DEVICES: 'jayveermart_known_devices',
  OTP_TOKENS: 'jayveermart_otp_tokens',
  RESET_TOKENS: 'jayveermart_admin_reset_tokens',
};

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key) || localStorage.getItem(key.replace('jayveermart_', 'nexusmart_'));
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

  getStoreSettings: (): StoreSettings => getStorageItem(STORAGE_KEYS.STORE_SETTINGS, INITIAL_STORE_SETTINGS),
  saveStoreSettings: (settings: StoreSettings): void => setStorageItem(STORAGE_KEYS.STORE_SETTINGS, settings),

  getUsers: (): User[] => {
    return getStorageItem<User[]>(STORAGE_KEYS.USERS, [INITIAL_USER, INITIAL_ADMIN]);
  },
  saveUsers: (users: User[]): void => setStorageItem(STORAGE_KEYS.USERS, users),

  getCurrentUser: (): User | null => getStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USER),
  saveCurrentUser: (user: User | null): void => setStorageItem(STORAGE_KEYS.CURRENT_USER, user),

  getCart: (): CartItem[] => getStorageItem(STORAGE_KEYS.CART, []),
  saveCart: (cart: CartItem[]): void => setStorageItem(STORAGE_KEYS.CART, cart),

  getWishlist: (): WishlistItem[] => getStorageItem(STORAGE_KEYS.WISHLIST, []),
  saveWishlist: (wishlist: WishlistItem[]): void => setStorageItem(STORAGE_KEYS.WISHLIST, wishlist),

  // ─── Sessions & Profile Compatibility ─────────────────────────────────────
  getAdminSessions: (): AdminSession[] => [],
  saveAdminSessions: (): void => {},
  getCurrentAdminSession: (): AdminSession | null => null,
  saveCurrentAdminSession: (): void => {},
  terminateAdminSession: (): void => {},
  terminateAllAdminSessions: (): void => {},
  getCustomerSessions: (): CustomerSession[] => [],
  saveCustomerSessions: (): void => {},
  getCurrentCustomerSession: (): CustomerSession | null => null,
  saveCurrentCustomerSession: (): void => {},
  terminateCustomerSession: (): void => {},
  terminateAllCustomerSessions: (): void => {},

  // ─── Customer Addresses ────────────────────────────────────────────────────
  getCustomerAddresses: (userId?: number): CustomerAddress[] => {
    const all = getStorageItem<CustomerAddress[]>(STORAGE_KEYS.CUSTOMER_ADDRESSES, []);
    return userId ? all.filter((a) => a.userId === userId) : all;
  },
  saveCustomerAddresses: (addresses: CustomerAddress[]): void => setStorageItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, addresses),

  addCustomerAddress: (address: CustomerAddress): void => {
    const all = getStorageItem<CustomerAddress[]>(STORAGE_KEYS.CUSTOMER_ADDRESSES, []);
    if (address.isDefault) {
      all.forEach((a) => {
        if (a.userId === address.userId) a.isDefault = false;
      });
    }
    all.push(address);
    setStorageItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, all);
  },

  updateCustomerAddress: (updated: CustomerAddress): void => {
    const all = getStorageItem<CustomerAddress[]>(STORAGE_KEYS.CUSTOMER_ADDRESSES, []);
    const index = all.findIndex((a) => a.id === updated.id);
    if (index !== -1) {
      if (updated.isDefault) {
        all.forEach((a) => {
          if (a.userId === updated.userId) a.isDefault = false;
        });
      }
      all[index] = updated;
      setStorageItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, all);
    }
  },

  deleteCustomerAddress: (id: string): void => {
    const all = getStorageItem<CustomerAddress[]>(STORAGE_KEYS.CUSTOMER_ADDRESSES, []);
    setStorageItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, all.filter((a) => a.id !== id));
  },

  // ─── Saved Payment Methods (Tokenized, No Raw CVV) ─────────────────────────
  getSavedPaymentMethods: (userId?: number): SavedPaymentMethod[] => {
    const all = getStorageItem<SavedPaymentMethod[]>(STORAGE_KEYS.SAVED_PAYMENTS, []);
    return userId ? all.filter((p) => p.userId === userId) : all;
  },
  saveSavedPaymentMethods: (methods: SavedPaymentMethod[]): void => setStorageItem(STORAGE_KEYS.SAVED_PAYMENTS, methods),

  addSavedPaymentMethod: (method: SavedPaymentMethod): void => {
    const all = getStorageItem<SavedPaymentMethod[]>(STORAGE_KEYS.SAVED_PAYMENTS, []);
    if (method.isDefault) {
      all.forEach((p) => {
        if (p.userId === method.userId) p.isDefault = false;
      });
    }
    all.push(method);
    setStorageItem(STORAGE_KEYS.SAVED_PAYMENTS, all);
  },

  deleteSavedPaymentMethod: (id: string): void => {
    const all = getStorageItem<SavedPaymentMethod[]>(STORAGE_KEYS.SAVED_PAYMENTS, []);
    setStorageItem(STORAGE_KEYS.SAVED_PAYMENTS, all.filter((p) => p.id !== id));
  },

  // ─── Known Device Fingerprints ────────────────────────────────────────────
  getKnownDevices: (): DeviceFingerprint[] => getStorageItem(STORAGE_KEYS.KNOWN_DEVICES, []),
  addKnownDevice: (device: DeviceFingerprint): void => {
    const all = getStorageItem<DeviceFingerprint[]>(STORAGE_KEYS.KNOWN_DEVICES, []);
    const existingIndex = all.findIndex((d) => d.userId === device.userId && d.fingerprint === device.fingerprint);
    if (existingIndex !== -1) {
      all[existingIndex].lastSeenAt = new Date().toISOString();
      all[existingIndex].ip = device.ip;
    } else {
      all.push(device);
    }
    setStorageItem(STORAGE_KEYS.KNOWN_DEVICES, all);
  },

  // ─── Verification & OTP Tokens ────────────────────────────────────────────
  getOtpTokens: (): OtpVerificationToken[] => getStorageItem(STORAGE_KEYS.OTP_TOKENS, []),
  saveOtpTokens: (tokens: OtpVerificationToken[]): void => setStorageItem(STORAGE_KEYS.OTP_TOKENS, tokens),

  // ─── Password Reset Tokens ────────────────────────────────────────────────
  getResetTokens: (): PasswordResetToken[] => getStorageItem(STORAGE_KEYS.RESET_TOKENS, []),
  saveResetTokens: (tokens: PasswordResetToken[]): void => setStorageItem(STORAGE_KEYS.RESET_TOKENS, tokens),

  clearOrders: (): void => {
    setStorageItem(STORAGE_KEYS.ORDERS, []);
  },

  resetToDefault: (): void => {
    localStorage.clear();
    setStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStorageItem(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    setStorageItem(STORAGE_KEYS.ORDERS, []);
    setStorageItem(STORAGE_KEYS.REVIEWS, []);
    setStorageItem(STORAGE_KEYS.USERS, [INITIAL_USER, INITIAL_ADMIN]);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
    setStorageItem(STORAGE_KEYS.STORE_SETTINGS, INITIAL_STORE_SETTINGS);
    setStorageItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, []);
    setStorageItem(STORAGE_KEYS.SAVED_PAYMENTS, []);
  },
};
