<?php
/**
 * NexusMart Enterprise - Intelligence Assistant Chatbot API
 */

require_once __DIR__ . '/../includes/bootstrap.php';

header('Content-Type: application/json');

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
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    }
    return $products;
}

function getCategories($con) {
    $result = mysqli_query($con, "SELECT cat_id, cat_title FROM categories");
    $cats = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) { $cats[] = $row; }
    }
    return $cats;
}

function getProductsByCategory($con, $cat_id, $limit = 6) {
    $cat_id = (int)$cat_id;
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products WHERE product_cat=$cat_id LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    }
    return $products;
}

function getNewArrivals($con, $limit = 6) {
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products ORDER BY product_id DESC LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    }
    return $products;
}

function getCheapProducts($con, $limit = 6) {
    $sql = "SELECT product_id, product_title, product_price, product_image FROM products ORDER BY product_price ASC LIMIT $limit";
    $result = mysqli_query($con, $sql);
    $products = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) { $products[] = $row; }
    }
    return $products;
}

function formatProducts($products) {
    if (empty($products)) return null;
    $html = '<div class="bot-products">';
    foreach ($products as $p) {
        $price = rupee($p['product_price']);
        $title = e($p['product_title']);
        $img_src = get_product_image_url($p['product_image']);
        
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

// Category Keyword Map matched with NexusMart DB Schema
// 1: Electronics, 2: Ladies Wears, 3: Mens Wear, 4: Kids Wear, 5: Furnitures, 6: Home Appliances, 7: Sports
$cat_keywords = [
    'electronic' => 1, 'electronics' => 1, 'gadget' => 1, 'phone' => 1, 'mobile' => 1, 'smartphone' => 1, 'laptop' => 1, 'computer' => 1, 'pc' => 1, 'camera' => 1, 'headphone' => 1, 'earphone' => 1,
    'ladies'     => 2, 'women'       => 2, 'dress'  => 2, 'saree' => 2,
    'men'        => 3, 'mens'        => 3, 'shirt'  => 3, 'pant'  => 3, 'hoodie' => 3,
    'kids'       => 4, 'kid'         => 4, 'toy'    => 4, 'baby'  => 4,
    'furniture'  => 5, 'furnitures'  => 5, 'sofa'   => 5, 'table' => 5, 'chair'  => 5, 'bed' => 5,
    'appliance'  => 6, 'appliances'  => 6, 'fridge' => 6, 'kitchen' => 6, 'washing' => 6, 'refrigerator' => 6,
    'sport'      => 7, 'sports'      => 7, 'fitness' => 7, 'gym'   => 7, 'ball'  => 7,
];

$reply = '';
$products_html = '';

// --- Greetings ---
if (preg_match('/\b(hi|hello|hey|hola|namaste|sup|greetings|good morning|good evening|good afternoon)\b/', $msg_lower)) {
    $reply = "👋 Welcome to <b>NexusMart Assistant</b>! I can help you find products, track orders, and discover active promotions. How may I assist you today?";
}
// --- Categories ---
elseif (preg_match('/categor|department|section|browse|all section/', $msg_lower)) {
    $cats = getCategories($con);
    $reply = "📂 <b>Product Categories:</b><br><br>";
    foreach ($cats as $c) {
        $reply .= "🏷️ <a href='store.php?cat_id=" . $c['cat_id'] . "' style='color:#2563eb; font-weight:500;'>" . e($c['cat_title']) . "</a><br>";
    }
    $reply .= "<br>Which category would you like to explore?";
}
// --- New Arrivals ---
elseif (preg_match('/new arrival|latest|just arrived|newly added|fresh stock|naya|nayi/', $msg_lower)) {
    $products = getNewArrivals($con);
    $reply = "🆕 <b>Latest Additions at NexusMart:</b>";
    $products_html = formatProducts($products);
}
// --- Orders ---
elseif (preg_match('/order|my order|track order|order status|delivery status/', $msg_lower)) {
    if (isset($_SESSION['uid'])) {
        $reply = "📦 View and track your orders here: <a href='myorders.php' style='color:#2563eb; font-weight:600;'>My Orders Dashboard</a>";
    } else {
        $reply = "📦 Please <a href='signin_form.php' style='color:#2563eb; font-weight:600;'>Sign In</a> to view your order history.";
    }
}
// --- Generic Search ---
else {
    $matched_cat = null;
    foreach ($cat_keywords as $kw => $cat_id) {
        if (strpos($msg_lower, $kw) !== false) {
            $matched_cat = $cat_id;
            break;
        }
    }
    if ($matched_cat) {
        $products = getProductsByCategory($con, $matched_cat);
        $reply = "🛍️ Here are top products from that category:";
        $products_html = formatProducts($products);
    } else {
        $kw = extractKeyword($msg_lower);
        $products = !empty(trim($kw)) ? searchProducts($con, trim($kw)) : [];
        if (!empty($products)) {
            $reply = "🔍 Here is what I found for \"<b>" . e($kw) . "</b>\":";
            $products_html = formatProducts($products);
        } else {
            $reply = "😊 I am here to help! Try searching for product names like 'laptop', 'smartphone', or 'hoodie'!";
        }
    }
}

$response = ['reply' => $reply];
if (!empty($products_html)) {
    $response['products'] = $products_html;
}

echo json_encode($response);
?>
