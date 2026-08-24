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
