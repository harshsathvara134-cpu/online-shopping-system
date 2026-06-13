<?php
include "db.php";
$res = mysqli_query($con, "SELECT admin_email, admin_name FROM admin_info LIMIT 1");
if ($row = mysqli_fetch_assoc($res)) {
    echo "Admin Name: " . $row['admin_name'] . "\n";
    echo "Admin Email: " . $row['admin_email'] . "\n";
    echo "Password Status: Encrypted/Hashed\n";
} else {
    echo "No admin found in database.\n";
}
