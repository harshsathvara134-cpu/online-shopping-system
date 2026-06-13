<?php
include "db.php";
$res = mysqli_query($con, "DESC orders_info");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . "\n";
}
echo "----\n";
$res = mysqli_query($con, "SELECT * FROM orders_info LIMIT 1");
$row = mysqli_fetch_assoc($res);
if ($row) print_r(array_keys($row));
else echo "No data in orders_info";
