<?php
include "db.php";
$tables = ['orders_info', 'products', 'user_info', 'cart', 'order_products'];
foreach ($tables as $table) {
    echo "Table: $table\n";
    $res = mysqli_query($con, "DESC $table");
    while ($row = mysqli_fetch_assoc($res)) {
        echo "  " . $row['Field'] . " (" . $row['Type'] . ")\n";
    }
}
