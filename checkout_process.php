<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . "/session_bootstrap.php";
include_once "db.php";
include "mail_helper.php";

if (!isset($_SESSION["uid"])) {
    header("Location: index.php");
    exit();
}

$required = ["firstname", "email", "address", "city", "state", "zip", "payment_method", "total_count"];
foreach ($required as $field) {
    if (!isset($_POST[$field]) || trim((string) $_POST[$field]) === "") {
        http_response_code(400);
        echo "<div class='alert alert-danger'>Missing checkout field: " . htmlspecialchars($field) . "</div>";
        exit();
    }
}

$user_id = intval($_SESSION["uid"]);
$f_name = trim($_POST["firstname"]);
$email = trim($_POST["email"]);
$address = trim($_POST["address"]);
$city = trim($_POST["city"]);
$state = trim($_POST["state"]);
$zip = trim($_POST["zip"]);
$payment_method = $_POST["payment_method"] === "Card" ? "Card" : "COD";
$total_count = max(0, intval($_POST["total_count"]));

if ($total_count <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "<div class='alert alert-danger'>Please review your cart and checkout details.</div>";
    exit();
}

$cardname = "";
$cardnumberstr = "";
$expdate = "";
$cvv = 0;

if ($payment_method === "Card") {
    $cardname = trim($_POST["cardname"] ?? "");
    $cardDigits = preg_replace("/\D+/", "", $_POST["cardNumber"] ?? "");
    $cardnumberstr = strlen($cardDigits) >= 4 ? "****-****-****-" . substr($cardDigits, -4) : "";
    $expdate = trim($_POST["expdate"] ?? "");
}

mysqli_begin_transaction($con);

try {
    $items = [];
    $prod_total = 0;

    $select_product = mysqli_prepare($con, "SELECT product_id, product_title, product_price, product_qty FROM products WHERE product_id = ? FOR UPDATE");
    if (!$select_product) {
        throw new Exception("Unable to prepare product lookup.");
    }

    for ($i = 1; $i <= $total_count; $i++) {
        $prod_id = intval($_POST["prod_id_$i"] ?? 0);
        $prod_qty = max(1, intval($_POST["prod_qty_$i"] ?? 1));

        mysqli_stmt_bind_param($select_product, "i", $prod_id);
        mysqli_stmt_execute($select_product);
        $product_result = mysqli_stmt_get_result($select_product);
        $product = mysqli_fetch_assoc($product_result);

        if (!$product) {
            throw new Exception("One of the products in your cart is no longer available.");
        }

        if (intval($product["product_qty"]) < $prod_qty) {
            throw new Exception($product["product_title"] . " has only " . intval($product["product_qty"]) . " item(s) left.");
        }

        $line_total = intval($product["product_price"]) * $prod_qty;
        $prod_total += $line_total;
        $items[] = [
            "id" => intval($product["product_id"]),
            "title" => $product["product_title"],
            "price" => intval($product["product_price"]),
            "qty" => $prod_qty,
            "line_total" => $line_total,
        ];
    }

    if (!$items) {
        throw new Exception("Your cart is empty.");
    }

    $sql = "INSERT INTO `orders_info`
    (`user_id`, `f_name`, `email`, `address`, `city`, `state`, `zip`, `payment_method`, `cardname`, `cardnumber`, `expdate`, `prod_count`, `total_amt`, `cvv`)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($con, $sql);
    if (!$stmt) {
        throw new Exception("Unable to prepare order.");
    }

    $types = "i" . str_repeat("s", 10) . "iii";
    mysqli_stmt_bind_param(
        $stmt,
        $types,
        $user_id,
        $f_name,
        $email,
        $address,
        $city,
        $state,
        $zip,
        $payment_method,
        $cardname,
        $cardnumberstr,
        $expdate,
        $total_count,
        $prod_total,
        $cvv
    );

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Unable to save your order.");
    }

    $order_id = mysqli_insert_id($con);
    $stock_alerts = [];

    $item_stmt = mysqli_prepare($con, "INSERT INTO order_products (order_id, product_id, qty, amt) VALUES (?, ?, ?, ?)");
    $stock_stmt = mysqli_prepare($con, "UPDATE products SET product_qty = product_qty - ? WHERE product_id = ? AND product_qty >= ?");
    $check_stmt = mysqli_prepare($con, "SELECT product_title, product_qty FROM products WHERE product_id = ?");

    if (!$item_stmt || !$stock_stmt || !$check_stmt) {
        throw new Exception("Unable to prepare order items.");
    }

    foreach ($items as $item) {
        mysqli_stmt_bind_param($item_stmt, "iiii", $order_id, $item["id"], $item["qty"], $item["line_total"]);
        if (!mysqli_stmt_execute($item_stmt)) {
            throw new Exception("Unable to save order item.");
        }

        mysqli_stmt_bind_param($stock_stmt, "iii", $item["qty"], $item["id"], $item["qty"]);
        if (!mysqli_stmt_execute($stock_stmt) || mysqli_stmt_affected_rows($stock_stmt) !== 1) {
            throw new Exception($item["title"] . " stock changed before checkout. Please review your cart.");
        }

        mysqli_stmt_bind_param($check_stmt, "i", $item["id"]);
        mysqli_stmt_execute($check_stmt);
        $stock_row = mysqli_fetch_assoc(mysqli_stmt_get_result($check_stmt));
        if ($stock_row && intval($stock_row["product_qty"]) <= 0) {
            $stock_alerts[] = $stock_row["product_title"];
        }
    }

    $del_sql = "DELETE FROM cart WHERE user_id = ?";
    $stmt_del = mysqli_prepare($con, $del_sql);
    mysqli_stmt_bind_param($stmt_del, "i", $user_id);
    if (!mysqli_stmt_execute($stmt_del)) {
        throw new Exception("Unable to clear cart after order.");
    }

    mysqli_commit($con);

    $order_items_html = "";
    foreach ($items as $item) {
        $order_items_html .= "
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #eee;'>" . htmlspecialchars($item["title"]) . "</td>
                <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>{$item["qty"]}</td>
                <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>&#8377; " . number_format($item["line_total"], 2) . "</td>
            </tr>";
    }

    $safe_name = htmlspecialchars($f_name);
    $safe_address = htmlspecialchars($address);
    $safe_city = htmlspecialchars($city);
    $safe_state = htmlspecialchars($state);
    $safe_zip = htmlspecialchars($zip);
    $subject = "Order Confirmation - JAYVEER Commerce Order #$order_id";

    $message = "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;'>
                <div style='text-align: center; border-bottom: 2px solid #20c96c; padding-bottom: 20px; margin-bottom: 20px;'>
                    <h2 style='color: #20c96c;'>JAYVEER COMMERCE</h2>
                    <p style='font-size: 18px; font-weight: bold;'>Order Confirmation</p>
                </div>
                <p>Hello <strong>$safe_name</strong>,</p>
                <p>Thank you for your order. We have received your request and are processing it.</p>
                <div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;'>
                    <p style='margin: 0;'><strong>Order ID:</strong> #$order_id</p>
                    <p style='margin: 0;'><strong>Date:</strong> " . date('d M Y, h:i A') . "</p>
                    <p style='margin: 0;'><strong>Payment Method:</strong> $payment_method</p>
                </div>
                <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
                    <thead>
                        <tr style='background: #f2f2f2;'>
                            <th style='padding: 10px; text-align: left;'>Product</th>
                            <th style='padding: 10px; text-align: center;'>Qty</th>
                            <th style='padding: 10px; text-align: right;'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>$order_items_html</tbody>
                    <tfoot>
                        <tr>
                            <td colspan='2' style='padding: 10px; text-align: right; font-weight: bold;'>Total Amount:</td>
                            <td style='padding: 10px; text-align: right; font-weight: bold; color: #20c96c;'>&#8377; " . number_format($prod_total, 2) . "</td>
                        </tr>
                    </tfoot>
                </table>
                <div style='margin-bottom: 20px;'>
                    <h4 style='border-bottom: 1px solid #eee; padding-bottom: 5px;'>Shipping Address</h4>
                    <p style='margin: 0;'>$safe_address</p>
                    <p style='margin: 0;'>$safe_city, $safe_state - $safe_zip</p>
                </div>
                <p>We will notify you once your order is shipped.</p>
            </div>
        </body>
        </html>";

    if (!send_system_email($email, $subject, $message)) {
        error_log("Customer email failed for order #$order_id");
    }

    $admin_sql = "SELECT admin_email FROM admin_info LIMIT 1";
    $admin_result = mysqli_query($con, $admin_sql);
    if ($admin_row = mysqli_fetch_assoc($admin_result)) {
        $admin_to = $admin_row['admin_email'];
        $admin_subject = "New Order Received - Order #$order_id";
        $admin_message = "
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>New Order Received</h2>
                <p><strong>Order ID:</strong> #$order_id</p>
                <p><strong>Customer:</strong> " . htmlspecialchars($f_name) . " (" . htmlspecialchars($email) . ")</p>
                <p><strong>Total Amount:</strong> &#8377; " . number_format($prod_total, 2) . "</p>
                <p><strong>Payment Method:</strong> $payment_method</p>
                <p><a href='http://" . $_SERVER['HTTP_HOST'] . "/online-shopping-system/admin/'>Open admin dashboard</a></p>
            </body>
            </html>";
        if (!send_system_email($admin_to, $admin_subject, $admin_message)) {
            error_log("Admin order email failed for order #$order_id");
        }

        foreach ($stock_alerts as $title) {
            $alert_subject = "STOCK ALERT: $title is out of stock";
            $alert_message = "The product '$title' has just run out of stock. Please restock it soon.";
            send_system_email($admin_to, $alert_subject, $alert_message);
        }
    }

    header("Location: order_successful.php?m=" . urlencode($payment_method));
    exit();
} catch (Throwable $e) {
    mysqli_rollback($con);
    error_log("Checkout failed: " . $e->getMessage());
    http_response_code(400);
    echo "<div class='alert alert-danger' style='margin:20px;'>"
        . htmlspecialchars($e->getMessage())
        . " <a href='cart.php'>Return to cart</a></div>";
    exit();
}
?>
