<?php

require_once __DIR__ . "/session_bootstrap.php";
session_destroy();

$BackToMyPage = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'index.php';
header('Location: ' . $BackToMyPage);
exit();
?>
