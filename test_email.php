<?php
include "mail_helper.php";

echo "<h2>Email Delivery Test</h2>";
echo "Sending test email to your Gmail account...<br>";

// Test sending to self
$to = "harshsathvara134@gmail.com"; 
$subject = "JAYVEER Commerce - Mail Test Successful!";
$message = "<h1>It Works!</h1><p>Aapke website se email delivery ab chalu ho gayi hai.</p>";

if (send_system_email($to, $subject, $message)) {
    echo "<h3 style='color:green;'>SUCCESS! Email successfully sent.</h3>";
    echo "Ab aap check kar sakte hain apni Gmail inbox ya spam folder.";
} else {
    echo "<h3 style='color:red;'>FAILED! Email nahi gaya.</h3>";
    echo "Kripya check karein:<br>";
    echo "1. Gmail ID sahi hai ya nahi.<br>";
    echo "2. App Password sahi hai ya nahi.<br>";
    echo "3. Internet connection active hai.<br>";
}
?>
