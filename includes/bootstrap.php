<?php
/**
 * NexusMart Enterprise - Master Bootstrap File
 */

if (session_status() === PHP_SESSION_NONE) {
    // Custom Session Save Path Defense
    $savePath = session_save_path();
    if ($savePath === "" || !is_dir($savePath) || !is_writable($savePath)) {
        $localSavePath = __DIR__ . "/../tmp/sessions";
        if (!is_dir($localSavePath)) {
            @mkdir($localSavePath, 0775, true);
        }
        if (is_dir($localSavePath) && is_writable($localSavePath)) {
            session_save_path($localSavePath);
        }
    }

    // Configure Secure Session Parameters
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');

    session_start();
}

require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/functions.php';
?>
