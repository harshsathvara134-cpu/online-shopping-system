<?php
require_once __DIR__ . "/session_bootstrap.php";
header('Content-Type: application/json');
include "db.php";

$input = json_decode(file_get_contents('php://input'), true);
$message = isset($input['message']) ? trim($input['message']) : '';
$msg_lower = strtolower($message);

if (empty($message)) {
    echo json_encode(['reply' => 'Please type a message!']);
    exit();
}

// ===== HELPERS =====

function searchProducts($con, $keyword, $limit = 6) {
    $keyword = mysqli_real_escape_string($con, $keyword);
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products 
            WHERE product_title LIKE '%$keyword%' OR product_desc LIKE '%$keyword%' OR product_keywords LIKE '%$keyword%' 
            LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    return $products;
}

function getCategories($con) {
    $result = mysqli_query($con, "SELECT cat_id, cat_title FROM categories");
    $cats = [];
    while ($row = mysqli_fetch_assoc($result)) { $cats[] = $row; }
    return $cats;
}

function getProductsByCategory($con, $cat_id, $limit = 6) {
    $cat_id = (int)$cat_id;
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products WHERE product_cat=$cat_id LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    return $products;
}

function getNewArrivals($con, $limit = 6) {
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products ORDER BY product_id DESC LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    return $products;
}

function getCheapProducts($con, $limit = 6) {
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products ORDER BY product_price ASC LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    return $products;
}

function getPremiumProducts($con, $limit = 6) {
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products ORDER BY product_price DESC LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    return $products;
}

function formatProducts($products) {
    if (empty($products)) return null;
    $html = '<div class="bot-products">';
    foreach ($products as $p) {
        $price = rupee($p['product_price']);
        $title = htmlspecialchars($p['product_title']);
        $img = $p['product_image'];
        
        $img_src = "product_images/$img";
        if(!file_exists($img_src)) $img_src = "img/$img";
        
        $html .= '<a href="product.php?p=' . $p['product_id'] . '" class="bot-product-card" target="_blank">';
        $html .= '<img src="' . $img_src . '" alt="' . $title . '">';
        $html .= '<div><strong>' . $title . '</strong><span>' . $price . '</span></div>';
        $html .= '</a>';
    }
    $html .= '</div>';
    return $html;
}

function detectHinglish($msg) {
    $hinglish = ['kya', 'mujhe', 'chahiye', 'batao', 'dikhao', 'lena', 'karo', 'hai', 'nahi', 'price', 'kitna', 'acha', 'accha', 'wala', 'sasta', 'mahenga', 'naya'];
    $words = explode(' ', strtolower($msg));
    foreach ($hinglish as $hw) {
        if (in_array($hw, $words)) return true;
    }
    return false;
}

function extractKeyword($msg_lower) {
    $stop_words = ['find', 'search', 'looking', 'for', 'show', 'me', 'i', 'want', 'to', 'buy', 'get', 'need', 'suggest', 'a', 'an', 'the', 'some', 'please', 'can', 'you', 'have', 'any', 'do', 'is', 'are', 'my', 'best'];
    $words = explode(' ', $msg_lower);
    $keywords = array_filter(array_diff($words, $stop_words));
    return implode(' ', $keywords);
}

// ===== CATEGORY KEYWORD MAP =====
$cat_keywords = [
    'phone'      => 1, 'mobile'     => 1, 'smartphone' => 1,
    'laptop'     => 2, 'computer'   => 2, 'pc'         => 2,
    'fashion'    => 3, 'cloth'      => 3, 'shirt'      => 3, 'dress'  => 3, 'wear' => 3,
    'furniture'  => 4, 'sofa'       => 4, 'table'      => 4, 'chair'  => 4,
    'appliance'  => 5, 'kitchen'    => 5, 'fridge'     => 5, 'washing' => 5,
    'sport'      => 6, 'fitness'    => 6, 'gym'        => 6,
    'electronic' => 7, 'gadget'     => 7, 'camera'     => 7, 'headphone' => 7, 'earphone' => 7,
];

// ===== INTENT DETECTION & REPLIES =====
$reply = '';
$products_html = '';

// --- Hinglish ---
if (detectHinglish($message)) {
    if (preg_match('/sasta|cheap|budget|affordable/', $msg_lower)) {
        $products = getCheapProducts($con);
        $reply = "🛒 Yahan kuch saste aur best products hain! Here are some budget-friendly picks for you:";
        $products_html = formatProducts($products);
    } elseif (preg_match('/naya|new|latest|nayi/', $msg_lower)) {
        $products = getNewArrivals($con);
        $reply = "✨ Yahan naye products hain! Check out our latest arrivals:";
        $products_html = formatProducts($products);
    } else {
        $kw = extractKeyword($msg_lower);
        $products = !empty($kw) ? searchProducts($con, $kw) : [];
        if (!empty($products)) {
            $reply = "🔍 Aapke liye kuch results mile! Here's what I found:";
            $products_html = formatProducts($products);
        } else {
            $reply = "Namaste! 🙏 Kya main aapki help kar sakta hoon? Aap mujhe product ka naam bataiye, main dhundh dunga! <br><br>You can type a product name and I'll find it for you!";
        }
    }
}

function checkStock($con, $keyword) {
    $keyword = mysqli_real_escape_string($con, $keyword);
    $sql = "SELECT product_title, product_qty FROM products 
            WHERE product_title LIKE '%$keyword%' LIMIT 1";
    $result = mysqli_query($con, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        return ['title' => $row['product_title'], 'qty' => $row['product_qty']];
    }
    return null;
}

// --- Greetings & AI Personality ---
if (preg_match('/\b(hi|hello|hey|hola|namaste|sup|greetings|good morning|good evening|good afternoon)\b/', $msg_lower)) {
    $replies = [
        "👋 Hello! I'm your <b>JAYVEER Intelligence</b> Assistant! I can help you find products, track orders, and more. 🛒 What's on your mind?",
        "Hi there! 😊 I'm trained to help you find the best deals at <b>JAYVEER</b>. Looking for a smartphone, laptop, or maybe some fashion?",
        "Namaste! 🙏 Welcome! I'm your dedicated shopping sidekick. How can I make your day easier today?",
        "Hey! Great to see you! ⚡ Did you know we have new arrivals every day? Want to see them?"
    ];
    $reply = $replies[array_rand($replies)];
}

// --- Stock Inquiries ---
elseif (preg_match('/stock|available|mil jayega|hai kya|lena hai|delivery kab/', $msg_lower)) {
    $kw = extractKeyword($msg_lower);
    if (!empty($kw)) {
        $stockInfo = checkStock($con, $kw);
        if ($stockInfo) {
            if ($stockInfo['qty'] > 0) {
                $reply = "✅ Yes! <b>" . $stockInfo['title'] . "</b> is currently in stock (Available: " . $stockInfo['qty'] . "). Would you like to view it?";
                $products = searchProducts($con, $kw, 1);
                $products_html = formatProducts($products);
            } else {
                $reply = "😔 I'm sorry, <b>" . $stockInfo['title'] . "</b> is currently out of stock. We expect more soon! Want me to suggest something similar?";
            }
        } else {
            $reply = "I'm not sure which product you're asking about. Can you give me the full name? I'll check the stock for you!";
        }
    } else {
         $reply = "Are you looking for a specific item's availability? Just type the name of the product!";
    }
}

// --- How are you ---
elseif (preg_match('/how are you|how r u|how do you do|you doing/', $msg_lower)) {
    $reply = "I'm doing great, thanks for asking! 😄 I'm always ready to help you find amazing products. What are you shopping for today?";
}

// --- Goodbye ---
elseif (preg_match('/\b(bye|goodbye|see you|later|cya|take care)\b/', $msg_lower)) {
    $reply = "👋 Goodbye! Happy shopping! Come back anytime — I'm always here to help. 😊";
}

// --- Thank you ---
elseif (preg_match('/thank|thanks|thx|ty\b|shukriya|dhanyawad/', $msg_lower)) {
    $reply = "You're most welcome! 😊 It was a pleasure helping you. Is there anything else you need?";
}

// --- Help ---
elseif (preg_match('/\b(help|what can you do|features|assist|commands)\b/', $msg_lower)) {
    $reply = "Here's everything I can help with:<br><br>
    🛒 <b>Find Products</b> - Type any product name<br>
    🆕 <b>New Arrivals</b> - Ask 'show latest products'<br>
    🔥 <b>Popular Products</b> - Ask 'what is trending'<br>
    💰 <b>Budget Picks</b> - Ask 'show cheap products'<br>
    📂 <b>Browse Categories</b> - Ask 'show categories'<br>
    📦 <b>Track Orders</b> - Ask 'my orders'<br>
    💳 <b>Payment Info</b> - Ask 'payment methods'<br>
    🚚 <b>Delivery Info</b> - Ask 'delivery info'<br>
    🔄 <b>Returns</b> - Ask 'return policy'<br>
    📞 <b>Contact Us</b> - Ask 'contact support'<br><br>
    <i>Tip: I also understand Hinglish! 🇮🇳</i>";
}

// --- New Arrivals ---
elseif (preg_match('/new arrival|latest|just arrived|newly added|fresh stock|naya|nayi/', $msg_lower)) {
    $products = getNewArrivals($con);
    $reply = "🆕 <b>Hot New Arrivals!</b> Check out our freshest additions:";
    $products_html = formatProducts($products);
    if (empty($products)) $reply = "No new products found right now. Check back soon!";
}

// --- Trending / Popular ---
elseif (preg_match('/trending|popular|best seller|top rated|most sold|hot product/', $msg_lower)) {
    $products = searchProducts($con, 'Samsung');
    $p2 = searchProducts($con, 'Apple');
    $all = array_slice(array_unique(array_merge($products, $p2), SORT_REGULAR), 0, 6);
    if (empty($all)) $all = getNewArrivals($con, 6);
    $reply = "🔥 <b>Trending Now!</b> Here are our most popular picks:";
    $products_html = formatProducts($all);
}

// --- Categories ---
elseif (preg_match('/categor|department|section|browse|all section/', $msg_lower)) {
    $cats = getCategories($con);
    $reply = "📂 <b>Our Product Categories:</b><br><br>";
    foreach ($cats as $c) {
        $reply .= "🏷️ <a href='store.php' style='color:#667eea;font-weight:500;'>" . htmlspecialchars($c['cat_title']) . "</a><br>";
    }
    $reply .= "<br>Which category interests you?";
}

// --- Category-specific product search ---
elseif (preg_match('/show|find|search|browse|give|get/', $msg_lower)) {
    $matched_cat = null;
    foreach ($cat_keywords as $kw => $cat_id) {
        if (strpos($msg_lower, $kw) !== false) {
            $matched_cat = $cat_id;
            break;
        }
    }
    if ($matched_cat) {
        $products = getProductsByCategory($con, $matched_cat);
        $reply = "🛍️ Here are products from that category:";
        $products_html = formatProducts($products);
        if (empty($products)) $reply = "No products found in that category yet. Try browsing our <a href='store.php' style='color:#667eea;'>store</a>!";
    } else {
        $kw = extractKeyword($msg_lower);
        $products = !empty(trim($kw)) ? searchProducts($con, trim($kw)) : [];
        if (!empty($products)) {
            $reply = "🔍 Here's what I found for \"<b>" . htmlspecialchars($kw) . "</b>\":";
            $products_html = formatProducts($products);
        } else {
            $reply = "What would you like to browse? Try 'show phones' or 'find laptops'!";
        }
    }
}

// --- Budget / Cheap ---
elseif (preg_match('/cheap|affordable|budget|low price|under \d+/', $msg_lower)) {
    $products = getCheapProducts($con);
    $reply = "💰 <b>Budget Picks!</b> Best value products for you:";
    $products_html = formatProducts($products);
}

// --- Premium / Expensive ---
elseif (preg_match('/premium|luxury|expensive|high end|best quality|top of the line/', $msg_lower)) {
    $products = getPremiumProducts($con);
    $reply = "✨ <b>Premium Collection!</b> Our finest products:";
    $products_html = formatProducts($products);
}

// --- Orders ---
elseif (preg_match('/order|my order|track order|order status|delivery status/', $msg_lower)) {
    if (isset($_SESSION['uid'])) {
        $reply = "📦 You can view and track all your orders here:<br><br>👉 <a href='myorders.php' style='color:#667eea;font-weight:600;'>My Orders</a><br><br>Need help with a specific order?";
    } else {
        $reply = "📦 Please <a href='signin_form.php' style='color:#667eea;font-weight:600;'>log in</a> first to view your orders.";
    }
}

// --- Cart ---
elseif (preg_match('/cart|basket|bag|add to cart|checkout/', $msg_lower)) {
    $reply = "🛒 Your cart is ready! <a href='cart.php' style='color:#667eea;font-weight:600;'>View Cart</a><br><br>Would you like me to help you find more products to add?";
}

// --- Wishlist ---
elseif (preg_match('/wishlist|wish list|saved|favourite|favorite|save for later/', $msg_lower)) {
    $reply = "❤️ View your saved items here: <a href='wishlist.php' style='color:#667eea;font-weight:600;'>My Wishlist</a><br><br>Want me to find something new to add?";
}

// --- Payment ---
elseif (preg_match('/payment|pay|cod|cash on delivery|credit|debit|card|upi/', $msg_lower)) {
    $reply = "💳 <b>We Accept:</b><br><br>
    💵 <b>Cash on Delivery (COD)</b> — Pay on arrival<br>
    💳 <b>Credit Card</b> — Visa, MasterCard, Amex<br>
    💳 <b>Debit Card</b> — All major banks<br>
    📱 <b>UPI</b> — PhonePe, GPay, Paytm<br><br>
    🔒 All payments are 100% secure & encrypted!";
}

// --- Delivery ---
elseif (preg_match('/deliver|shipping|dispatch|how long|when will|arrives|arrival|shipment/', $msg_lower)) {
    $reply = "🚚 <b>Delivery Information:</b><br><br>
    ⏱️ Standard: <b>5–7 business days</b><br>
    ⚡ Express: <b>2–3 business days</b><br>
    🆓 <b>Free shipping</b> on all orders!<br>
    🔍 Track your order: <a href='myorders.php' style='color:#667eea;'>My Orders</a><br><br>
    Orders placed before midnight qualify for next-day dispatch!";
}

// --- Returns ---
elseif (preg_match('/return|refund|exchange|replace|send back|policy/', $msg_lower)) {
    $reply = "🔄 <b>Return & Refund Policy:</b><br><br>
    ✅ <b>7-day easy returns</b><br>
    💰 Full refund guaranteed<br>
    📦 Item must be unused, in original packaging<br>
    📞 We arrange free pickup at your doorstep<br><br>
    To initiate a return: <a href='myorders.php' style='color:#667eea;'>My Orders</a>";
}

// --- Offers / Discounts ---
elseif (preg_match('/discount|offer|sale|deal|coupon|promo|off|cashback/', $msg_lower)) {
    $products = getCheapProducts($con, 6);
    $reply = "🎉 <b>🔥 Hot Deals Right Now!</b><br><br>
    🛍️ Up to <b>30% off</b> storewide!<br>
    🆓 Free shipping on every order<br>
    ⚡ New flash deals every day<br><br>
    Here are some great deals:";
    $products_html = formatProducts($products);
}

// --- Store hours ---
elseif (preg_match('/open|timing|hours|when are you|store hour|working hour/', $msg_lower)) {
    $reply = "🕐 <b>We're Online 24/7!</b><br><br>
    🛒 You can shop anytime, day or night!<br>
    📦 Orders are processed: <b>Mon–Sat, 9 AM – 9 PM</b><br>
    📞 Customer support: <b>9 AM – 9 PM (Mon–Sat)</b><br><br>
    Orders placed after hours ship the next business day!";
}

// --- Contact ---
elseif (preg_match('/contact|support|help desk|customer service|email|phone number|call us|reach/', $msg_lower)) {
    $reply = "📞 <b>Contact & Support:</b><br><br>
    📧 Email: <a href='mailto:harshsathvara@gmail.com' style='color:#667eea;'>harshsathvara@gmail.com</a><br>
    📱 Phone: +91-12344465767<br>
    🕐 Hours: Mon–Sat, 9 AM – 9 PM<br><br>
    We typically respond within <b>24 hours</b>! 😊";
}

// --- Login / Account ---
elseif (preg_match('/login|log in|sign in|signin|account|register|signup|sign up|profile/', $msg_lower)) {
    if (isset($_SESSION['uid'])) {
        $reply = "✅ You're already logged in! Manage your <a href='myorders.php' style='color:#667eea;font-weight:600;'>Account & Orders here</a>.";
    } else {
        $reply = "👤 <a href='signin_form.php' style='color:#667eea;font-weight:600;'>Sign In</a> to your account or <a href='signup_form.php' style='color:#667eea;font-weight:600;'>Create a free account</a> to start shopping!";
    }
}

// --- Compare ---
elseif (preg_match('/compare|vs|versus|difference between|which is better/', $msg_lower)) {
    $reply = "🤔 <b>Product Comparison:</b> To compare two products, please search for each one individually and visit their product pages.<br><br>
    💡 Tip: Try typing the product name to see its full details and price!";
}

// --- Upgrade Inquiry ---
elseif (preg_match('/upgrade|new feature|what is new|v2|version/', $msg_lower)) {
    $reply = "🚀 <b>JAYVEER Intelligence Assistant v2.0 is Here!</b><br><br>
    I've been upgraded with:<br>
    ✅ <b>Real-time Inventory Tracking</b> - Ask me 'Is [Product] in stock?'<br>
    ✅ <b>Smarter AI Conversations</b> - I understand you better now!<br>
    ✅ <b>Enhanced Hinglish</b> - Better support for local languages.<br>
    ✅ <b>Proactive Help</b> - I can suggest similar products if something is out of stock.<br><br>
    What would you like to try first?";
}

// --- Generic fallback (product search) ---
else {
    // Check category keywords first
    $matched_cat = null;
    foreach ($cat_keywords as $kw => $cat_id) {
        if (strpos($msg_lower, $kw) !== false) {
            $matched_cat = $cat_id;
            break;
        }
    }
    if ($matched_cat) {
        $products = getProductsByCategory($con, $matched_cat);
        $reply = "🛍️ Here are some products that might interest you:";
        $products_html = formatProducts($products);
    } else {
        $products = searchProducts($con, $message);
        if (!empty($products)) {
            $reply = "🔍 I found these products matching \"<b>" . htmlspecialchars($message) . "</b>\":";
            $products_html = formatProducts($products);
        } else {
            $fallbacks = [
                "🤔 I'm not sure I understood that. Try: 'find phones', 'show laptops', or 'delivery info'!",
                "😊 I'm here to help! Ask me about products, delivery, payment, or returns.",
                "💡 <b>Tip:</b> Type a product name like 'Samsung phone' or 'Nike shoes' and I'll find it for you!"
            ];
            $reply = $fallbacks[array_rand($fallbacks)];
        }
    }
}

// Build response
$response = ['reply' => $reply];
if (!empty($products_html)) {
    $response['products'] = $products_html;
}

echo json_encode($response);
?>
