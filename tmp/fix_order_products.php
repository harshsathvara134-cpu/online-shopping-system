<?php
include "c:/xampp/htdocs/online-shopping-system/db.php";

echo "Fixing 'order_products' table - enabling AUTO_INCREMENT on 'order_pro_id'...\n";

// Check if any row has ID 0 which might cause issues with AUTO_INCREMENT setup in some versions
$res = mysqli_query($con, "SELECT COUNT(*) as count FROM order_products WHERE order_pro_id = 0");
$row = mysqli_fetch_array($res);
if ($row['count'] > 0) {
    echo "Found rows with ID 0, remapping them...\n";
    // We increment everything to avoid conflict if we just change 0 to something else
    mysqli_query($con, "UPDATE order_products SET order_pro_id = order_pro_id + (SELECT MAX(order_pro_id) FROM order_products) + 1 WHERE order_pro_id = 0");
}

// Alter table to add AUTO_INCREMENT
$sql = "ALTER TABLE order_products MODIFY order_pro_id INT(10) NOT NULL AUTO_INCREMENT";
if (mysqli_query($con, $sql)) {
    echo "SUCCESS: AUTO_INCREMENT enabled.\n";
} else {
    echo "ERROR: " . mysqli_error($con) . "\n";
    
    // Plan B: If it fails because of duplicate 0s or something, try to drop and recreate PK
    echo "Attempting Plan B: Rebuilding primary key...\n";
    // This is more invasive, let's try a safer Plan B first: update all to 1,2,3...
    mysqli_query($con, "SET @count = 0;");
    mysqli_query($con, "UPDATE order_products SET order_pro_id = (@count:= @count + 1);");
    if (mysqli_query($con, $sql)) {
        echo "SUCCESS (Plan B): AUTO_INCREMENT enabled.\n";
    } else {
        echo "FATAL: Could not fix table.\n";
    }
}

echo "Done.\n";
?>
