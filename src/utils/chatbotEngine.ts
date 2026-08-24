import { Product } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  products?: Product[];
  actionLinks?: { label: string; url: string }[];
  quickReplies?: string[];
}

export const processChatMessage = (
  userText: string,
  products: Product[],
  userName?: string
): ChatMessage => {
  const query = userText.toLowerCase().trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const greetingName = userName ? ` ${userName}` : '';

  // 1. Greetings
  if (/^(hi|hello|hey|namaste|hola|good morning|good evening|kem cho)/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `Hello${greetingName}! 👋 I'm **NexusAI**, your 24/7 intelligent shopping assistant. How can I help you today?`,
      timestamp: time,
      quickReplies: ['🔥 Trending Deals', '💻 Browse Laptops', '📱 Latest Phones', '📦 Track My Order', '🎟️ Available Coupons'],
    };
  }

  // 2. Coupons and Discounts
  if (/coupon|discount|offer|promo|code|bachat|voucher/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🎉 Here are today's exclusive discount coupons you can apply at checkout:\n\n• **NEXUS10** — 10% OFF on orders over ₹1,000\n• **SUPER20** — 20% OFF on orders over ₹5,000\n• **WELCOME500** — 15% OFF for new customers\n\nSimply copy and paste any coupon code on the cart or checkout page!`,
      timestamp: time,
      actionLinks: [{ label: 'Go to Store', url: '/store' }],
      quickReplies: ['Browse Phones', 'Check Cart', 'How to Pay?'],
    };
  }

  // 3. Order Tracking
  if (/track|order status|kahan hai|mera order|shipping status|delivery date/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📦 You can track all your active orders with real-time milestone timelines directly from your **My Orders** page.`,
      timestamp: time,
      actionLinks: [{ label: 'View My Orders', url: '/my-orders' }],
      quickReplies: ['Delivery Times', 'Return Policy', 'Contact Support'],
    };
  }

  // 4. Shipping and Returns Policy
  if (/delivery|shipping|charge|charges|free delivery|kab aayega/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🚚 **Shipping Policy Summary**:\n\n• **Free Express Delivery** on all orders above ₹1,000.\n• Standard flat rate of ₹99 for orders under ₹1,000.\n• Metro deliveries arrive in 2–3 business days, other locations in 3–5 days.`,
      timestamp: time,
      quickReplies: ['Return Policy', 'Payment Options', 'Browse Catalog'],
    };
  }

  if (/return|refund|exchange|wapas|replace/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🔄 **7-Day Hassle-Free Return Policy**:\n\nWe offer a 7-day return/replacement window on all eligible electronics and fashion products. Items must be in original condition with tags and packaging intact.`,
      timestamp: time,
      quickReplies: ['Contact Support', 'View Orders', 'Continue Shopping'],
    };
  }

  // 5. Payment Methods
  if (/payment|cod|cash on delivery|upi|card|emi|gpay|paytm/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💳 **Accepted Payment Methods**:\n\n• **Cash on Delivery (COD)** (Zero extra charges)\n• **Credit / Debit Cards** (Visa, MasterCard, RuPay)\n• **Instant UPI & QR Scan** (GPay, PhonePe, Paytm)\n• **Net Banking** (All major Indian banks)`,
      timestamp: time,
      quickReplies: ['Available Coupons', 'Go to Checkout', 'Browse Products'],
    };
  }

  // 6. Product Search / Recommendations
  const laptopKeywords = ['laptop', 'notebook', 'macbook', 'gaming laptop', 'omen', 'nitro', 'pavilion'];
  const phoneKeywords = ['phone', 'mobile', 'samsung', 'iphone', 'motorola', 'smartphone', 'galaxy'];
  const fashionKeywords = ['dress', 'clothes', 'hoodie', 'wear', 'ladies', 'men'];

  if (laptopKeywords.some(k => query.includes(k))) {
    const laptops = products.filter(p => p.product_cat === 1 && p.product_title.toLowerCase().includes('laptop') || p.product_keywords.toLowerCase().includes('laptop')).slice(0, 3);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💻 Here are top-rated laptops available in our store right now:`,
      timestamp: time,
      products: laptops,
      actionLinks: [{ label: 'View All Electronics', url: '/store?cat=1' }],
    };
  }

  if (phoneKeywords.some(k => query.includes(k))) {
    const phones = products.filter(p => p.product_keywords.toLowerCase().includes('mobile') || p.product_title.toLowerCase().includes('phone') || p.product_title.toLowerCase().includes('galaxy')).slice(0, 3);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📱 Here are our bestselling flagship and budget smartphones:`,
      timestamp: time,
      products: phones,
      actionLinks: [{ label: 'View Smartphone Catalog', url: '/store?cat=1' }],
    };
  }

  if (fashionKeywords.some(k => query.includes(k))) {
    const fashion = products.filter(p => [2, 3, 4].includes(p.product_cat)).slice(0, 3);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `👗 Check out these trending fashion and apparel items:`,
      timestamp: time,
      products: fashion,
      actionLinks: [{ label: 'Explore Fashion Store', url: '/store' }],
    };
  }

  // Generic keyword match
  const matches = products.filter(p =>
    p.product_title.toLowerCase().includes(query) ||
    p.product_desc.toLowerCase().includes(query) ||
    p.product_keywords.toLowerCase().includes(query)
  ).slice(0, 3);

  if (matches.length > 0) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🔍 I found ${matches.length} matching product(s) for "${userText}":`,
      timestamp: time,
      products: matches,
      actionLinks: [{ label: `Search '${userText}' in Store`, url: `/store?search=${encodeURIComponent(userText)}` }],
    };
  }

  // 7. Fallback Response
  return {
    id: `bot_${Date.now()}`,
    sender: 'bot',
    text: `I'm here to help! You can ask me to find products (e.g. *"Show HP laptops"*), check discount coupons (*"What are today's offers?"*), track an order (*"Where is my order?"*), or learn about payment methods.`,
    timestamp: time,
    quickReplies: ['🔥 Trending Deals', '💻 Laptops', '📱 Smartphones', '🎟️ Coupons', '📦 Track Order'],
  };
};
