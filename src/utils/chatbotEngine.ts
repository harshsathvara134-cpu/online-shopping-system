import { Product, Order } from '../types';
import { formatCurrency } from './formatters';

export interface ProductComparison {
  product1: Product;
  product2: Product;
  verdict: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  products?: Product[];
  order?: Order;
  comparison?: ProductComparison;
  couponToApply?: string;
  actionLinks?: { label: string; url: string }[];
  quickReplies?: string[];
}

export const processChatMessage = (
  userText: string,
  products: Product[],
  orders: Order[] = [],
  userName?: string
): ChatMessage => {
  const query = userText.toLowerCase().trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const greetingName = userName ? ` ${userName}` : '';

  // Helper to extract numbers (e.g. budgets like "under 70000", "under 70k", "in 25k", "under 1.5 lakh")
  const extractBudget = (text: string): number | null => {
    // Check for "k" (e.g. 70k -> 70000)
    const kMatch = text.match(/(?:under|below|less than|within|in|budget|upto|max|se kam)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
    if (kMatch) return parseFloat(kMatch[1]) * 1000;

    // Check for "lakh" or "lac" (e.g. 1.5 lakh -> 150000)
    const lakhMatch = text.match(/(?:under|below|less than|within|in|budget|upto|max|se kam)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs)\b/i);
    if (lakhMatch) return parseFloat(lakhMatch[1]) * 100000;

    // Check for numeric budget (e.g. under 50000)
    const numMatch = text.match(/(?:under|below|less than|within|in|budget|upto|max|se kam)\s*(?:₹|rs\.?|inr)?\s*(\d{3,7})/i);
    if (numMatch) return parseInt(numMatch[1], 10);

    return null;
  };

  const budget = extractBudget(query);

  // 1. Order Tracking by ID or general request (e.g. "Track order 1004", "order #1002", "mera order status")
  const orderIdMatch = query.match(/(?:order\s*#?|#)(\d{4,6})/i) || query.match(/track\s*(\d{4,6})/i);
  if (orderIdMatch) {
    const searchId = parseInt(orderIdMatch[1], 10);
    const foundOrder = orders.find(o => o.order_id === searchId);

    if (foundOrder) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `📦 **Live Order Tracking for #${foundOrder.order_id}**\n\n• **Current Status**: **${foundOrder.status.toUpperCase()}**\n• **Customer**: ${foundOrder.f_name}\n• **Total Value**: ${formatCurrency(foundOrder.total_amt)} (${foundOrder.payment_method})\n• **Placed On**: ${foundOrder.created_at}\n\nHere is your live shipment summary:`,
        timestamp: time,
        order: foundOrder,
        actionLinks: [{ label: 'View Full Timeline', url: '/my-orders' }],
        quickReplies: ['Track Another Order', 'Need Help with Delivery', 'Return Policy'],
      };
    } else {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `🔍 I searched for Order **#${searchId}**, but couldn't find a matching record in your account.\n\nPlease check your order number in your **My Orders** page or ask me to list your recent orders.`,
        timestamp: time,
        actionLinks: [{ label: 'View All My Orders', url: '/my-orders' }],
        quickReplies: ['Check Latest Order', 'Talk to Support', 'Browse Store'],
      };
    }
  }

  // General Order Tracking Request without ID
  if (/track|kahan hai|order status|mera order|shipping status|delivery date|package update/i.test(query)) {
    if (orders.length > 0) {
      const latestOrder = orders[0];
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `📦 Found your most recent order **#${latestOrder.order_id}**!\n\n• **Status**: **${latestOrder.status.toUpperCase()}**\n• **Items**: ${latestOrder.items.map(i => i.product_title).join(', ')}\n• **Total**: ${formatCurrency(latestOrder.total_amt)}\n\nTrack the 5-stage milestone progress below:`,
        timestamp: time,
        order: latestOrder,
        actionLinks: [{ label: 'View All Orders', url: '/my-orders' }],
        quickReplies: ['Return Policy', 'Shipping Timeline', 'Explore New Deals'],
      };
    } else {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `📦 You can track all your active shipments with live milestone status updates on your **My Orders** page.`,
        timestamp: time,
        actionLinks: [{ label: 'Go to My Orders', url: '/my-orders' }],
        quickReplies: ['Delivery Time', 'Shipping Charges', 'Available Offers'],
      };
    }
  }

  // 2. Product Comparison (e.g. "Compare Samsung and iPhone", "Compare S25 Ultra vs iPhone 15 Pro", "Compare laptops")
  if (/compare|vs|difference|kisme accha hai|better|which is better/i.test(query)) {
    // Check if asking for specific models
    const s25 = products.find(p => p.product_id === 5);
    const iphone = products.find(p => p.product_id === 13);
    const omen = products.find(p => p.product_id === 15);
    const nitro = products.find(p => p.product_id === 12);
    const moto = products.find(p => p.product_id === 6);

    if (query.includes('samsung') || query.includes('s25') || query.includes('iphone') || query.includes('apple')) {
      if (s25 && iphone) {
        return {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `⚡ **Head-to-Head Flagship Comparison**:\n\n• **Samsung Galaxy S25 Ultra**: Snapdragon 8 Elite, 200MP AI Pro-camera, built-in S-Pen, and 5000mAh battery (${formatCurrency(s25.product_price)}).\n• **iPhone 15 Pro Titanium**: Aerospace-grade Titanium, A17 Pro chip, Action Button, and ProRes video (${formatCurrency(iphone.product_price)}).\n\n💡 **AI Verdict**: Choose **Samsung S25 Ultra** for maximum AI camera versatility & display size, or **iPhone 15 Pro** for compact premium titanium build & iOS ecosystem synergy.`,
          timestamp: time,
          comparison: {
            product1: s25,
            product2: iphone,
            verdict: 'Both are top-tier flagships. S25 Ultra leads in AI camera zoom; iPhone 15 Pro leads in titanium compactness.',
          },
          products: [s25, iphone],
          quickReplies: ['Add S25 Ultra to Cart', 'Add iPhone 15 Pro to Cart', 'Show Phones Under 25k'],
        };
      }
    }

    if (query.includes('omen') || query.includes('nitro') || query.includes('gaming') || query.includes('laptop')) {
      if (omen && nitro) {
        return {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `💻 **Gaming Laptop Comparison**:\n\n• **HP Omen 16**: Intel Core i7 14th Gen, RTX 4070 GPU, Tempest Cooling, Per-key RGB (${formatCurrency(omen.product_price)}).\n• **Acer Nitro Lite 16**: Intel Core i7 13th Gen, RTX 4050 GPU, 144Hz IPS display (${formatCurrency(nitro.product_price)}).\n\n💡 **AI Verdict**: Choose **Acer Nitro** for outstanding budget-to-performance value, or **HP Omen** for enthusiast-grade RTX 4070 AAA gaming at ultra settings.`,
          timestamp: time,
          comparison: {
            product1: omen,
            product2: nitro,
            verdict: 'HP Omen delivers ~35% higher GPU graphical horsepower with RTX 4070; Acer Nitro offers incredible value under ₹75k.',
          },
          products: [omen, nitro],
          quickReplies: ['Show Laptops Under 70k', 'Compare Battery Life', 'View All Electronics'],
        };
      }
    }
  }

  // 3. Budget Queries (e.g. "phone under 20k", "laptops under 70000", "dress under 3000")
  if (budget !== null) {
    let matchedProducts = products.filter(p => p.product_price <= budget);

    if (query.includes('laptop') || query.includes('computer') || query.includes('pc')) {
      matchedProducts = matchedProducts.filter(p => p.product_cat === 1 && (p.product_title.toLowerCase().includes('laptop') || p.product_keywords.toLowerCase().includes('laptop')));
    } else if (query.includes('phone') || query.includes('mobile') || query.includes('smartphone')) {
      matchedProducts = matchedProducts.filter(p => p.product_cat === 1 && (p.product_keywords.toLowerCase().includes('mobile') || p.product_title.toLowerCase().includes('phone') || p.product_title.toLowerCase().includes('galaxy') || p.product_title.toLowerCase().includes('motorola')));
    } else if (query.includes('dress') || query.includes('fashion') || query.includes('cloth') || query.includes('wear') || query.includes('hoodie')) {
      matchedProducts = matchedProducts.filter(p => [2, 3, 4].includes(p.product_cat));
    }

    if (matchedProducts.length > 0) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `🎯 Found **${matchedProducts.length} high-rated product(s)** within your budget of **${formatCurrency(budget)}**:\n\nTap any item below to view specifications or add it straight to your cart:`,
        timestamp: time,
        products: matchedProducts.slice(0, 4),
        actionLinks: [{ label: `View all products under ${formatCurrency(budget)}`, url: `/store?maxPrice=${budget}` }],
        quickReplies: ['Apply 20% Coupon', 'Compare Top 2', 'Show Free Delivery Items'],
      };
    } else {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `We don't have items strictly under **${formatCurrency(budget)}** in that specific category, but here are our closest best-value deals with instant coupons available:`,
        timestamp: time,
        products: products.slice(0, 3),
        quickReplies: ['Available Coupons', 'Browse Full Catalog', 'Filter by Category'],
      };
    }
  }

  // 4. Coupons, Discounts, Offers & Auto-Apply
  if (/coupon|discount|offer|promo|code|bachat|voucher|loot|sale/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🎉 **Today's Active Store Coupons**:\n\n• **SUPER20** — ⚡ **Flat 20% OFF** on orders above ₹5,000\n• **NEXUS10** — **10% OFF** on orders above ₹1,000\n• **WELCOME500** — **15% Welcome Discount** for new shoppers\n\nClick the 1-click apply button below to auto-apply **SUPER20** to your cart!`,
      timestamp: time,
      couponToApply: 'SUPER20',
      actionLinks: [{ label: 'View Shopping Cart', url: '/cart' }],
      quickReplies: ['🔥 Apply SUPER20', 'Apply NEXUS10', 'Browse Trending Products'],
    };
  }

  // 5. Specific Product Categories / Queries
  if (/laptop|macbook|gaming laptop|notebook|pavilion|nitro|omen/i.test(query)) {
    const laptops = products.filter(p => p.product_cat === 1 && (p.product_title.toLowerCase().includes('laptop') || p.product_keywords.toLowerCase().includes('laptop')));
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💻 **Top Recommended Laptops & Ultrabooks**:\n\nFrom high-refresh gaming powerhouses to ultra-slim OLED notebooks, here are our top-rated laptops with official manufacturer warranty:`,
      timestamp: time,
      products: laptops,
      actionLinks: [{ label: 'Open Laptops Catalog', url: '/store?cat=1' }],
      quickReplies: ['Laptops Under 70k', 'Compare HP vs Acer', 'Apply Promo Code'],
    };
  }

  if (/phone|mobile|samsung|iphone|apple|motorola|galaxy|smartphone/i.test(query)) {
    const phones = products.filter(p => p.product_keywords.toLowerCase().includes('mobile') || p.product_title.toLowerCase().includes('phone') || p.product_title.toLowerCase().includes('ultra') || p.product_title.toLowerCase().includes('motorola'));
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📱 **Flagship & Budget Smartphones**:\n\nFeaturing pro-grade camera systems, 120Hz AMOLED displays, 5G speeds, and all-day fast-charging batteries:`,
      timestamp: time,
      products: phones,
      actionLinks: [{ label: 'Explore All Smartphones', url: '/store?cat=1' }],
      quickReplies: ['Compare S25 vs iPhone', 'Phones Under 20k', 'Check Exchange Offers'],
    };
  }

  if (/dress|fashion|clothes|hoodie|kapde|ladies|mens|wear|outfit|cotton/i.test(query)) {
    const fashion = products.filter(p => [2, 3, 4].includes(p.product_cat));
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `👗 **Trending Designer Fashion & Streetwear**:\n\nPremium fabrics, comfortable daily fleece wear, and elegant occasion gowns crafted for all seasons:`,
      timestamp: time,
      products: fashion,
      actionLinks: [{ label: 'View Fashion Collection', url: '/store?cat=2' }],
      quickReplies: ['Fashion Under 2000', 'Size Guide', '7-Day Easy Returns'],
    };
  }

  if (/furniture|sofa|table|chair|living room|home decor/i.test(query)) {
    const furniture = products.filter(p => p.product_cat === 5);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🛋️ **Luxury Living & Solid Wood Furniture**:\n\nHandcrafted Sheesham wood ensembles with plush cushioning, durable finishes, and doorstep assembly:`,
      timestamp: time,
      products: furniture,
      actionLinks: [{ label: 'View Furniture Catalog', url: '/store?cat=5' }],
      quickReplies: ['Delivery Time for Furniture', 'Payment Methods', 'Coupons'],
    };
  }

  if (/fridge|refrigerator|appliance|kitchen|tv/i.test(query)) {
    const appliances = products.filter(p => p.product_cat === 6);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🧊 **Smart Inverter Home & Kitchen Appliances**:\n\n5-star energy efficient cooling, multi-directional air vents, and smart frost-free technology:`,
      timestamp: time,
      products: appliances,
      actionLinks: [{ label: 'View Appliances', url: '/store?cat=6' }],
      quickReplies: ['Warranty Details', 'Free Delivery Policy', 'EMI Options'],
    };
  }

  // 6. Hinglish & Conversational Queries
  if (/^(hi|hello|hey|namaste|kem cho|kya haal|wassup|yo|good)/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `Namaste${greetingName}! 🙏 I am **NexusAI**, your 24/7 personal shopping assistant.\n\nI can help you:\n• 🔍 Find products matching your exact budget\n• ⚖️ Compare laptops and smartphones side-by-side\n• 📦 Track orders with live milestone timelines\n• 🎟️ Auto-apply exclusive discount coupons\n\nWhat would you like to explore?`,
      timestamp: time,
      quickReplies: ['🔥 Trending Deals', '💻 Gaming Laptops', '📱 Flagship Phones', '📦 Track My Order', '🎟️ Available Coupons'],
    };
  }

  if (/kya khareedu|suggest|recommend|kuch accha|best item|top product/i.test(query)) {
    const bestSellers = products.filter(p => (p.rating || 0) >= 4.7).slice(0, 3);
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🌟 **Our Top 3 Customer-Favorite Bestsellers Right Now**:\n\nThese items have 4.7+ ★ customer ratings and highest satisfaction:`,
      timestamp: time,
      products: bestSellers,
      quickReplies: ['Compare Top 2', 'Show Electronics', 'Check Available Offers'],
    };
  }

  // 7. Policy, Delivery, Returns & Payment Inquiries
  if (/delivery|shipping|charge|free delivery|kab aayega|speed|time/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🚚 **Express Shipping & Delivery Overview**:\n\n• **FREE Delivery** on all orders above ₹1,000.\n• Flat ₹99 for smaller orders.\n• Metro cities: **1–3 business days**.\n• Rest of India: **3–5 business days**.\n• All items packaged in tamper-evident secured boxing.`,
      timestamp: time,
      quickReplies: ['Return Policy', 'Payment Options', 'Track My Order'],
    };
  }

  if (/return|refund|exchange|replace|wapas|damage|broken/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🔄 **7-Day Hassle-Free Return Guarantee**:\n\n• 100% money-back or free instant replacement within 7 days of delivery.\n• Free doorstep pickup by courier partner.\n• Instant refund initiation to original payment method or UPI.`,
      timestamp: time,
      quickReplies: ['Contact Customer Support', 'Track My Order', 'View Orders'],
    };
  }

  if (/payment|cod|cash|upi|card|emi|gpay|phonepe|paytm/i.test(query)) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💳 **Accepted Payment Methods (100% Secure SSL)**:\n\n• **Cash on Delivery (COD)** (Zero extra charges)\n• **Credit / Debit Cards** (Visa, MasterCard, RuPay)\n• **Instant UPI & QR Scan** (GPay, PhonePe, Paytm, BHIM)\n• **Net Banking** (All major Indian banks)`,
      timestamp: time,
      quickReplies: ['Apply 20% Coupon', 'Go to Checkout', 'Browse Products'],
    };
  }

  // 8. General Search Keyword Fallback
  const matches = products.filter(p =>
    p.product_title.toLowerCase().includes(query) ||
    p.product_desc.toLowerCase().includes(query) ||
    p.product_keywords.toLowerCase().includes(query)
  ).slice(0, 4);

  if (matches.length > 0) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🔍 Found **${matches.length} matching product(s)** for "${userText}":\n\nTap any product to view details or add directly to your cart:`,
      timestamp: time,
      products: matches,
      actionLinks: [{ label: `Search in Store`, url: `/store?search=${encodeURIComponent(userText)}` }],
      quickReplies: ['Compare Specs', 'Apply Discount', 'Check Cart'],
    };
  }

  // 9. Intelligent Contextual Fallback
  return {
    id: `bot_${Date.now()}`,
    sender: 'bot',
    text: `I understand! You can ask me anything about:\n\n• 📱 **Phones & Laptops** (e.g. *"Show phones under 25k"* or *"Compare Samsung vs iPhone"*)\n• 📦 **Live Order Tracking** (e.g. *"Track order 1004"* or *"Where is my package?"*)\n• 🎟️ **Discounts & Offers** (e.g. *"What coupons can I use?"*)\n• 🚚 **Policies** (*"Is COD available?"*, *"Return policy"*)\n\nTry one of the quick options below:`,
    timestamp: time,
    quickReplies: ['🔥 Trending Deals', '📱 Phones Under 25k', '💻 Gaming Laptops', '🎟️ Available Coupons', '📦 Track My Order'],
  };
};
