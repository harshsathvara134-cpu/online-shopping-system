<?php
include "c:/xampp/htdocs/online-shopping-system/db.php";

echo "Adding 'payment_method' column to 'orders_info'...\n";
$check = mysqli_query($con, "SHOW COLUMNS FROM orders_info LIKE 'payment_method'");
if (mysqli_num_rows($check) == 0) {
    $alt = mysqli_query($con, "ALTER TABLE orders_info ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Card Payment' AFTER cardname");
    if ($alt) {
        echo "SUCCESS: Column added.\n";
    } else {
        echo "ERROR: " . mysqli_error($con) . "\n";
    }
} else {
    echo "Column already exists.\n";
}

echo "Updating card fields to allow NULLs (for COD)...\n";
mysqli_query($con, "ALTER TABLE orders_info MODIFY cardnumber VARCHAR(20) DEFAULT NULL");
mysqli_query($con, "ALTER TABLE orders_info MODIFY expdate VARCHAR(255) DEFAULT NULL");
mysqli_query($con, "ALTER TABLE orders_info MODIFY cvv INT(5) DEFAULT NULL");
mysqli_query($con, "ALTER TABLE orders_info MODIFY cardname VARCHAR(255) DEFAULT NULL");

echo "Done.\n";
?>
