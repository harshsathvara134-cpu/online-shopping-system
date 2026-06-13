<?php
include "db.php";
$res = mysqli_query($con, "SELECT admin_email FROM admin_info LIMIT 1");
$row = mysqli_fetch_assoc($res);
echo "Admin Email in Database: " . ($row['admin_email'] ?? 'NOT FOUND');
?>
