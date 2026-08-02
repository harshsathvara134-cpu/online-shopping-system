<?php
/**
 * NexusMart Enterprise - Database Connection Manager
 */

require_once __DIR__ . '/app.php';

$db_host     = "127.0.0.1";
$db_user     = "root";
$db_pass     = "";
$db_name     = "onlineshop";
$db_port_1   = 3307;
$db_port_2   = 3306;

mysqli_report(MYSQLI_REPORT_OFF);

if (!isset($con) || !$con) {
    // Attempt Primary Port (3307)
    $con = @mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port_1);

    // Fallback to Standard Port (3306)
    if (!$con) {
        $con = @mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port_2);
    }

    // Connection failure handler
    if (!$con) {
        http_response_code(503);
        die("
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 80px auto; padding: 30px; border: 1px solid #f87171; border-radius: 12px; background: #fef2f2; color: #991b1b; text-align: center;'>
                <h2 style='margin-top:0;'>Service Temporarily Unavailable</h2>
                <p>Database connection could not be established. Please verify MySQL service status and database configurations.</p>
            </div>
        ");
    }

    mysqli_set_charset($con, "utf8mb4");
}

// Global Currency Formatter
if (!function_exists('rupee')) {
    function rupee($amount, $nosymbol = false) {
        if ($amount === null || $amount === "") {
            return $nosymbol ? "0.00" : CURRENCY_SYMBOL . " 0.00";
        }
        $amount = round((float) $amount, 2);
        $arr = explode('.', (string)$amount);
        $num = $arr[0];
        $decimal = isset($arr[1]) ? '.' . str_pad($arr[1], 2, '0', STR_PAD_RIGHT) : '.00';

        if (strlen($num) > 3) {
            $lastThree = substr($num, -3);
            $rest = substr($num, 0, -3);
            $rest = strrev($rest);
            $chunks = str_split($rest, 2);
            $formattedRest = strrev(implode(',', $chunks));
            $num = $formattedRest . ',' . $lastThree;
        }
        $formatted = $num . $decimal;
        return $nosymbol ? $formatted : CURRENCY_SYMBOL . " " . $formatted;
    }
}
?>
