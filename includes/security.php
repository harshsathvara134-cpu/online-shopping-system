<?php
/**
 * NexusMart Enterprise - Security Helper Module
 */

// HTML Escaping Helper (XSS Protection)
if (!function_exists('e')) {
    function e($data) {
        if ($data === null) return '';
        return htmlspecialchars((string)$data, ENT_QUOTES, 'UTF-8');
    }
}

// Generate CSRF Token
if (!function_exists('csrf_token')) {
    function csrf_token() {
        if (empty($_SESSION[CSRF_TOKEN_NAME])) {
            $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
        }
        return $_SESSION[CSRF_TOKEN_NAME];
    }
}

// CSRF HTML Input Generator
if (!function_exists('csrf_field')) {
    function csrf_field() {
        return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
    }
}

// Verify CSRF Token
if (!function_exists('verify_csrf_token')) {
    function verify_csrf_token($token = null) {
        $token = $token ?? $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!$token || empty($_SESSION[CSRF_TOKEN_NAME])) {
            return false;
        }
        return hash_equals($_SESSION[CSRF_TOKEN_NAME], $token);
    }
}

// Input Sanitization Helpers
if (!function_exists('sanitize_input')) {
    function sanitize_input($data) {
        $data = trim((string)$data);
        $data = stripslashes($data);
        return $data;
    }
}

// Secure Client IP Resolver
if (!function_exists('get_client_ip')) {
    function get_client_ip() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ipList[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? getenv("REMOTE_ADDR") ?? '127.0.0.1';
    }
}

// Secure Image File Upload Processor
if (!function_exists('secure_upload_image')) {
    function secure_upload_image($file_array, $target_dir = UPLOAD_DIR) {
        if (!isset($file_array['error']) || $file_array['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        if ($file_array['size'] > MAX_UPLOAD_SIZE) {
            return false;
        }

        // Verify MIME type using Fileinfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $finfo->file($file_array['tmp_name']);

        if (!in_array($mime_type, ALLOWED_IMAGE_TYPES)) {
            return false;
        }

        // Generate sanitized unique filename
        $ext = strtolower(pathinfo($file_array['name'], PATHINFO_EXTENSION));
        $new_name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        
        if (!is_dir($target_dir)) {
            @mkdir($target_dir, 0775, true);
        }

        $destination = rtrim($target_dir, '/\\') . DIRECTORY_SEPARATOR . $new_name;

        if (move_uploaded_file($file_array['tmp_name'], $destination)) {
            return $new_name;
        }

        return false;
    }
}
?>
