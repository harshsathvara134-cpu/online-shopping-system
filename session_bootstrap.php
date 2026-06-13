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

    session_start();
}
?>
