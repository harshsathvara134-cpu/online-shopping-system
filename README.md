# NexusMart Enterprise - Next-Generation PHP E-Commerce Platform

![Version](https://img.shields.io/badge/Version-3.0.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4%20%7C%208.x-purple.svg)
![Database](https://img.shields.io/badge/MySQL-utf8mb4-orange.svg)
![Security](https://img.shields.io/badge/Security-Prepared%20Statements%20%7C%20CSRF%20%7C%20XSS-green.svg)

NexusMart Enterprise is a modern, secure, professional, and fully refactored PHP e-commerce platform. Designed with clean architecture, strict parameter binding, CSRF token validation, XSS output escaping, and responsive UI components.

---

## 🚀 Key Features

* **Modernized UI & Responsive Design**: Custom Vanilla CSS Design System with CSS variables (`:root`), glassmorphic navigation, animated side-cart drawer, and mobile bottom navigation.
* **Security Hardening**:
  * **100% Parameterized Queries**: All database queries use prepared statements.
  * **CSRF Token Defense**: Token generation and validation for form submissions.
  * **XSS Output Escaping**: Context-aware escaping across template views (`e()`).
  * **Secure Sessions**: HTTP-Only cookies, `SameSite=Lax`, and session fixation regeneration.
  * **Password Security**: Password hashing via `PASSWORD_BCRYPT`.
  * **File Upload Defense**: MIME-type verification, extension whitelist, and randomized filename generation.
* **AI Intelligence Assistant Chatbot**: Integrated customer support bot supporting product search, order tracking links, stock availability, and Hinglish queries.
* **Admin Control Center**:
  * Sales & Earnings metrics.
  * Inventory tracking and automated low-stock alerts.
  * Product catalog manager with image uploading and quantity controls.
  * Category and Brand CRUD interfaces.
* **Customer Self-Service**:
  * Real-time cart updates and wishlist management.
  * Multi-method Checkout (Cash on Delivery / Credit Card).
  * Personal profile management & address management ([myprofile.php](file:///d:/HARSH/online-shopping-system/myprofile.php)).
  * Order tracking timeline ([myorders.php](file:///d:/HARSH/online-shopping-system/myorders.php)).

---

## 📁 System Architecture & Directory Map

```
online-shopping-system/
├── api/                       # RESTful JSON APIs (Cart, Chatbot)
├── assets/                    # Static Assets (CSS Design System, JS, Images)
│   ├── css/style.css
│   └── js/
├── config/                    # Global Configuration & Environment
│   ├── app.php                # App metadata, branding & constants
│   └── db.php                 # Database connection singleton
├── database/                  # SQL Schemas & Migrations
│   └── nexusmart.sql          # Cleaned, normalized database schema
├── includes/                  # Security, Helpers & Bootstrap
│   ├── bootstrap.php          # Session initialization & environment
│   ├── functions.php          # Currency, ratings & utility helpers
│   └── security.php           # CSRF, XSS & upload security
├── templates/                 # Reusable View Components
│   ├── header.php             # Modern site header & navigation
│   └── footer.php             # Footer & scripts
├── uploads/                   # Product upload repository
├── admin/                     # Refactored Admin Control Center
│   ├── index.php              # Dashboard
│   ├── products_list.php      # Products Manager
│   ├── edit_product.php       # Product Add/Edit Form
│   ├── categories.php         # Category Manager
│   ├── brands.php             # Brand Manager
│   ├── analytics.php          # Sales Analytics
│   └── settings.php           # Admin Account Settings
├── index.php                  # Storefront Homepage
├── store.php                  # Product Catalog / Filter Page
├── product.php                # Product Details Page
├── cart.php                   # Shopping Cart
├── wishlist.php               # Customer Wishlist
├── checkout.php               # Checkout Page
├── myorders.php               # Customer Orders Page
├── myprofile.php              # Customer Profile Page
└── README.md                  # System Documentation
```

---

## 🛠️ Installation & Setup Guide

### 1. Requirements
* **PHP**: 7.4 or 8.x
* **Database**: MySQL 5.7+ or MariaDB 10.2+
* **Web Server**: Apache / Nginx / XAMPP / WAMP

### 2. Database Import
1. Open **phpMyAdmin** or MySQL CLI.
2. Create a database named `onlineshop`.
3. Import the clean database schema:
   ```bash
   mysql -u root -p onlineshop < database/nexusmart.sql
   ```

### 3. Application Configuration
Update database credentials in `config/db.php` if required:
```php
$db_host = "127.0.0.1";
$db_user = "root";
$db_pass = "";
$db_name = "onlineshop";
```

### 4. Running the Store Locally

#### Option A: Using XAMPP
Place the project inside `htdocs/online-shopping-system` and visit:
`http://localhost/online-shopping-system/`

#### Option B: Using PHP Built-in Web Server
Open terminal in the project directory and run:
```bash
php -S 127.0.0.1:8000
```
Then visit: `http://127.0.0.1:8000`

---

## 🔐 Administrative Credentials

Default Administrator login details:
* **URL**: `http://localhost/online-shopping-system/admin/`
* **Email**: `admin@nexusmart.com`
* **Password**: `admin123` *(Can be updated under Admin Settings)*

---

## 🛡️ Security Highlights

1. **Prepared Statements**: Zero raw SQL string concatenation; all input parameters are bound using `mysqli_stmt_bind_param`.
2. **CSRF Validation**: Form submissions validate cryptographically random CSRF tokens.
3. **Strict Output Escaping**: All user-supplied values pass through `e()` (`htmlspecialchars`) before HTML rendering.
4. **File Upload Security**: Uploaded product images pass MIME-type detection (`finfo`) and size checks, and are saved with randomized unique filenames.

---

## 📄 License & Attribution

NexusMart Enterprise is released under the MIT License. Developed as a modern, standalone PHP e-commerce platform.
