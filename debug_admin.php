<?php
include "db.php";
$res = mysqli_query($con, "SHOW TABLES LIKE 'admin_info'");
if (mysqli_num_rows($res) == 0) {
    echo "Table 'admin_info' does not exist.";
} else {
    echo "Table 'admin_info' exists.\n";
    $res = mysqli_query($con, "SELECT * FROM admin_info");
    echo "Rows in 'admin_info': " . mysqli_num_rows($res) . "\n";
    while ($row = mysqli_fetch_assoc($res)) {
        print_r($row);
    }
}
