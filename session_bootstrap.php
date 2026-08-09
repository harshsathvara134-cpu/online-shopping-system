<?php
if (session_status() === PHP_SESSION_NONE) {
    $savePath = session_save_path();

    if ($savePath === "" || !is_dir($savePath) || !is_writable($savePath)) {
        $localSavePath = __DIR__ . DIRECTORY_SEPARATOR . "tmp" . DIRECTORY_SEPARATOR . "sessions";
        if (!is_dir($localSavePath)) {
            @mkdir($localSavePath, 0775, true);
        }

        if (is_dir($localSavePath) && is_writable($localSavePath)) {
            session_save_path($localSavePath);
        }
    }

    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => '',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_start();
}

// Generate CSRF Token
if (!function_exists('generate_csrf_token')) {
    function generate_csrf_token() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
}

// Verify CSRF Token
if (!function_exists('verify_csrf_token')) {
    function verify_csrf_token() {
        $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (empty($token) || empty($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
}

// HTML Escaping Helper
if (!function_exists('e')) {
    function e($string) {
        return htmlspecialchars((string) $string, ENT_QUOTES, 'UTF-8');
    }
}
?>
