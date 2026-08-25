export interface Product {
  product_id: number;
  product_cat: number;
  product_brand: number;
  product_title: string;
  product_price: number;
  product_desc: string;
  product_image: string;
  product_image2?: string | null;
  product_image3?: string | null;
  product_keywords: string;
  product_qty: number;
  featured?: boolean;
  trending?: boolean;
  rating?: number;
  review_count?: number;
}

export interface Category {
  cat_id: number;
  cat_title: string;
  icon?: string;
  badge?: string;
}

export interface Brand {
  brand_id: number;
  brand_title: string;
}

export interface CartItem {
  id: string; // unique item id
  p_id: number;
  product: Product;
  qty: number;
}

export interface WishlistItem {
  id: string;
  p_id: number;
  product: Product;
  added_at: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  order_pro_id?: number;
  product_id: number;
  product_title: string;
  product_image: string;
  qty: number;
  amt: number;
}

export interface Order {
  order_id: number;
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
  expdate?: string;
  prod_count: number;
  total_amt: number;
  discount_amt?: number;
  coupon_code?: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  address1: string;
  address2: string;
  role: 'customer' | 'admin';
  password_hash?: string;
  password_salt?: string;
  email_verified?: boolean;
  mobile_verified?: boolean;
  created_at?: string;
  two_factor_enabled?: boolean;
  two_factor_secret?: string;
  recovery_codes?: string[];
}

export interface CustomerSession {
  sessionId: string;
  userId: number;
  email: string;
  name: string;
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export interface CustomerAddress {
  id: string;
  userId: number;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  addressType: 'Home' | 'Work' | 'Other';
}

export interface SavedPaymentMethod {
  id: string;
  userId: number;
  type: 'CARD' | 'UPI';
  cardBrand?: 'Visa' | 'Mastercard' | 'RuPay' | 'Amex';
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardHolderName?: string;
  upiId?: string;
  isDefault: boolean;
  token: string;
  createdAt: string;
}

export interface OtpVerificationToken {
  token: string;
  emailOrMobile: string;
  otp: string;
  purpose: 'REGISTER' | 'EMAIL_CHANGE' | 'MOBILE_CHANGE' | 'LOGIN_OTP' | 'PASSWORD_RESET';
  createdAt: number;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  consumed: boolean;
  payload?: Record<string, unknown>;
}

export interface DeviceFingerprint {
  id: string;
  userId: number;
  fingerprint: string;
  browser: string;
  os: string;
  ip: string;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface Review {
  review_id: number;
  product_id: number;
  name: string;
  email: string;
  review: string;
  rating: number;
  datetime: string;
}

export interface AdminInfo {
  admin_id: number;
  admin_name: string;
  admin_email: string;
}

export interface FilterState {
  cat_id: number | null;
  brand_id: number | null;
  min_price: number;
  max_price: number;
  search_query: string;
  sort_by: 'default' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  in_stock_only: boolean;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  maintenanceMode: boolean;
  autoConfirmOrders: boolean;
  orderPrefix: string;
}

export interface AdminSession {
  sessionId: string;
  userId: number;
  email: string;
  name: string;
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  rememberMe: boolean;
  is2faVerified: boolean;
  isCurrent?: boolean;
}

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_LOGOUT_ALL'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_REGISTER_SUCCESS'
  | 'AUTH_UNAUTHORIZED_ACCESS'
  | 'AUTH_2FA_CHALLENGE'
  | 'AUTH_2FA_VERIFIED'
  | 'AUTH_2FA_FAILURE'
  | 'AUTH_2FA_ENABLED'
  | 'AUTH_2FA_DISABLED'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'EMAIL_VERIFICATION_SENT'
  | 'EMAIL_VERIFIED'
  | 'NEW_DEVICE_DETECTED'
  | 'PROFILE_UPDATED'
  | 'ADDRESS_UPDATED'
  | 'PAYMENT_METHOD_UPDATED'
  | 'SESSION_TERMINATED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'SETTINGS_UPDATED'
  | 'DATABASE_RESET'
  | 'AUTHORIZATION_DENIED'
  | 'ORDER_STOCK_DEFICIT'
  | 'ORDER_PLACED_SECURELY'
  | 'ADMIN_ACTION_EXECUTED';

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  userId?: number;
  email?: string;
  action: string;
  resource?: string;
  resourceId?: string | number;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  ip: string;
  userAgent: string;
  details?: Record<string, unknown>;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  consumed: boolean;
}

export interface CaptchaChallenge {
  token: string;
  question: string;
  answer: number;
  expiresAt: number;
}

