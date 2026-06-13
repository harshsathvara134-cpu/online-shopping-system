<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
session_destroy();
header("Location: login.php");
exit();
?>
