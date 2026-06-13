<?php
include "db.php";
$email = "admin@gmail.com";
$password = "admin123";
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$sql = "UPDATE admin_info SET admin_password = ? WHERE admin_email = ?";
$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "ss", $hashed_password, $email);

if (mysqli_stmt_execute($stmt)) {
    echo "Admin password reset successfully!\n";
    echo "Email: $email\n";
    echo "New Password: $password\n";
} else {
    echo "Failed to reset password: " . mysqli_error($con) . "\n";
}
