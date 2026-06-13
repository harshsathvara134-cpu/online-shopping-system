<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Note: You must download PHPMailer and put it in 'phpmailer' folder for this to work
// Download from: https://github.com/PHPMailer/PHPMailer

if (file_exists('phpmailer/src/PHPMailer.php')) {
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';
}

function send_system_email($to, $subject, $message)
{
    // If PHPMailer is not found, fallback to native mail() for live production
    if (!file_exists('phpmailer/src/PHPMailer.php')) {
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: JAYVEER Commerce <support@jayveer.com>" . "\r\n";
        return @mail($to, $subject, $message, $headers);
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'harshsathvara134@gmail.com';               // Step 3: YAHAN APNI GMAIL DAALEIN
        $mail->Password = 'ofbc tgai pvtw tgcz';                  // Step 3: YAHAN APNA APP PASSWORD DAALEIN
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        //Recipients
        $mail->setFrom('harshsathvara134@gmail.com', 'JAYVEER Commerce');
        $mail->addAddress($to);

        //Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>