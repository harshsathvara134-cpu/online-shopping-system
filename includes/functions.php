<?php
/**
 * NexusMart Enterprise - Business Functions & Template Utilities
 */

// Resolve Image Src path with fallback
if (!function_exists('get_product_image_url')) {
    function get_product_image_url($image_name) {
        if (empty($image_name)) {
            return 'assets/img/placeholder.png';
        }
        
        $path1 = "uploads/product_images/$image_name";
        $path2 = "product_images/$image_name";
        $path3 = "img/$image_name";

        if (file_exists(__DIR__ . "/../" . $path1)) return $path1;
        if (file_exists(__DIR__ . "/../" . $path2)) return $path2;
        if (file_exists(__DIR__ . "/../" . $path3)) return $path3;

        return 'assets/img/placeholder.png';
    }
}

// Format Star Rating HTML
if (!function_exists('render_star_rating')) {
    function render_star_rating($rating) {
        $rating = round((float)$rating, 1);
        $html = '<div class="product-rating">';
        $full_stars = round($rating);
        for ($i = 1; $i <= $full_stars; $i++) {
            $html .= '<i class="fa fa-star"></i>';
        }
        for ($i = 1; $i <= (5 - $full_stars); $i++) {
            $html .= '<i class="fa fa-star-o empty"></i>';
        }
        $html .= '</div>';
        return $html;
    }
}

// Fetch Cart Count for logged-in user or guest
if (!function_exists('get_cart_count')) {
    function get_cart_count($con) {
        $ip_add = get_client_ip();
        if (isset($_SESSION["uid"])) {
            $uid = intval($_SESSION["uid"]);
            $sql = "SELECT COUNT(*) AS count_item FROM cart WHERE user_id = $uid";
        } else {
            $sql = "SELECT COUNT(*) AS count_item FROM cart WHERE ip_add = '$ip_add' AND user_id < 0";
        }
        $query = mysqli_query($con, $sql);
        if ($query && $row = mysqli_fetch_assoc($query)) {
            return intval($row['count_item']);
        }
        return 0;
    }
}

// Fetch Wishlist Count
if (!function_exists('get_wishlist_count')) {
    function get_wishlist_count($con) {
        $ip_add = get_client_ip();
        if (isset($_SESSION["uid"])) {
            $uid = intval($_SESSION["uid"]);
            $sql = "SELECT COUNT(*) AS count_item FROM wishlist WHERE user_id = $uid AND p_id > 0";
        } else {
            $sql = "SELECT COUNT(*) AS count_item FROM wishlist WHERE ip_add = '$ip_add' AND user_id < 0 AND p_id > 0";
        }
        $query = mysqli_query($con, $sql);
        if ($query && $row = mysqli_fetch_assoc($query)) {
            return intval($row['count_item']);
        }
        return 0;
    }
}
?>
