<?php

$server_name = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';

// Default Credentials (Local XAMPP)
$servername = "127.0.0.1";
$username = "root";
$password = "";
$db = "onlineshop";
$port = 3307;

mysqli_report(MYSQLI_REPORT_OFF);

// Create connection if not already established
if (!isset($con) || !$con) {
    $con = @mysqli_connect($servername, $username, $password, $db, $port);

    // Check connection
    if (!$con) {
        // Try fallback port 3306 if 3307 fails
        $con = @mysqli_connect($servername, $username, $password, $db, 3306);
        if (!$con) {
            http_response_code(503);
            die("Database connection failed. Please start MySQL in XAMPP and confirm the 'onlineshop' database exists.");
        }
    }

    mysqli_set_charset($con, "utf8mb4");
}


// Currency helper following Indian Numbering System
if (!function_exists('rupee')) {
    function rupee($amount, $nosymbol = false)
    {
        if ($amount === null || $amount === "") {
            return $nosymbol ? "0.00" : "&#8377; 0.00";
        }
        $amount = round((float) $amount, 2);
        $arr = explode('.', $amount);
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
        return $nosymbol ? $formatted : "&#8377; " . $formatted;
    }
}
?>
