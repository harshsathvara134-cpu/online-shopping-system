<?php
/**
 * NexusMart Enterprise - AJAX Cart & Wishlist API
 */

require_once __DIR__ . '/../includes/bootstrap.php';

header('Content-Type: application/json');

$ip_add = get_client_ip();
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'count':
        echo json_encode([
            'cart_count' => get_cart_count($con),
            'wishlist_count' => get_wishlist_count($con)
        ]);
        exit();

    case 'get_side_cart':
        $uid = isset($_SESSION["uid"]) ? intval($_SESSION["uid"]) : 0;
        if ($uid > 0) {
            $sql = "SELECT a.product_id, a.product_title, a.product_price, a.product_image, b.id, b.qty 
                    FROM products a, cart b 
                    WHERE a.product_id = b.p_id AND b.user_id = $uid";
        } else {
            $sql = "SELECT a.product_id, a.product_title, a.product_price, a.product_image, b.id, b.qty 
                    FROM products a, cart b 
                    WHERE a.product_id = b.p_id AND b.ip_add = '$ip_add' AND b.user_id < 0";
        }

        $query = mysqli_query($con, $sql);
        $total_price = 0;
        $total_qty = 0;
        $items_html = "";

        if ($query && mysqli_num_rows($query) > 0) {
            while ($row = mysqli_fetch_assoc($query)) {
                $p_id = $row["product_id"];
                $title = e($row["product_title"]);
                $price = (float)$row["product_price"];
                $img = get_product_image_url($row["product_image"]);
                $qty = (int)$row["qty"];

                $total_qty += $qty;
                $total_price += ($price * $qty);

                $items_html .= '
                <div class="side-cart-item">
                    <div class="side-cart-item-img-container">
                        <img src="' . $img . '" class="side-cart-item-img" alt="' . $title . '">
                    </div>
                    <div class="side-cart-item-info">
                        <h5 class="side-cart-item-title">' . $title . '</h5>
                        <div class="side-cart-item-price">' . rupee($price) . '</div>
                        <div class="side-qty-controls">
                            <i class="fa fa-trash side-qty-trash side-remove" remove_id="' . $p_id . '"></i>
                            <button class="side-qty-btn side-update" update_id="' . $p_id . '" op="minus">-</button>
                            <div class="side-qty-val">' . $qty . '</div>
                            <button class="side-qty-btn side-update" update_id="' . $p_id . '" op="plus">+</button>
                        </div>
                    </div>
                </div>';
            }

            $header_html = '
                <div>Subtotal (' . $total_qty . ' items)</div>
                <h4>' . rupee($total_price) . '</h4>';
        } else {
            $header_html = '<h4>Your cart is empty</h4>';
            $items_html = '
                <div style="text-align:center; padding:50px 0;">
                    <i class="fa fa-shopping-basket" style="font-size:48px; color:#cbd5e1; margin-bottom:15px;"></i>
                    <p style="color:#64748b;">No items in your cart</p>
                </div>';
        }

        echo json_encode([
            'header' => $header_html,
            'items' => $items_html,
            'count' => $total_qty
        ]);
        exit();

    default:
        echo json_encode(['error' => 'Invalid action']);
        exit();
}
?>
