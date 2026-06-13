<?php
include 'db.php';
$res = mysqli_query($con, 'SELECT product_id, product_title, product_image FROM products ORDER BY product_id DESC LIMIT 10');
while($row = mysqli_fetch_assoc($res)) {
    echo "ID: " . $row['product_id'] . " | Title: " . $row['product_title'] . " | Image: " . $row['product_image'] . PHP_EOL;
}
?>
