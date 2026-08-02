<?php
/**
 * NexusMart Enterprise - Application Configuration
 */

// Application Metadata
define('APP_NAME', 'NexusMart Enterprise');
define('APP_TAGLINE', 'Next-Generation E-Commerce Store');
define('APP_URL', 'http://localhost/online-shopping-system');
define('APP_VERSION', '3.0.0');

// Contact & Support Configuration
define('SUPPORT_EMAIL', 'support@nexusmart.com');
define('SUPPORT_PHONE', '+1 (800) 555-NEXUS');
define('STORE_ADDRESS', 'Enterprise Commerce Park, Suite 500, Tech City');

// Session & Security Settings
define('SESSION_LIFETIME', 86400); // 24 hours
define('CSRF_TOKEN_NAME', 'nexusmart_csrf');
define('MAX_LOGIN_ATTEMPTS', 5);

// File Upload Constraints
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
define('UPLOAD_DIR', __DIR__ . '/../uploads/product_images/');

// Currency & Localisation
define('CURRENCY_SYMBOL', '₹');
define('CURRENCY_CODE', 'INR');
define('DEFAULT_TIMEZONE', 'Asia/Kolkata');

date_default_timezone_set(DEFAULT_TIMEZONE);
?>
