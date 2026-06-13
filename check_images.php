<?php
include "db.php";
$res = mysqli_query($con, "SELECT product_id, product_title, product_image FROM products");
$broken_images = [];
while ($row = mysqli_fetch_assoc($res)) {
    $img = $row['product_image'];
    $path1 = "product_images/$img";
    $path2 = "img/$img";
    if (!file_exists($path1) && !file_exists($path2)) {
        $broken_images[] = $row;
    }
}

if (empty($broken_images)) {
    echo "All product images are present.\n";
} else {
    echo "Found " . count($broken_images) . " products with missing images:\n";
    print_r($broken_images);
}
