<?php
include "db.php";
$res = mysqli_query($con, "SHOW CREATE TABLE order_products");
$row = mysqli_fetch_row($res);
echo $row[1];
echo "\n\n";
$res = mysqli_query($con, "SHOW CREATE TABLE products");
$row = mysqli_fetch_row($res);
echo $row[1];
