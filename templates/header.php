<?php
require_once __DIR__ . "/../includes/bootstrap.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php echo defined('PAGE_TITLE') ? e(PAGE_TITLE) . ' - ' . APP_NAME : APP_NAME . ' | ' . APP_TAGLINE; ?></title>

	<!-- Google Fonts -->
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

	<!-- Core Stylesheets -->
	<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css" />
	<link type="text/css" rel="stylesheet" href="css/slick.css" />
	<link type="text/css" rel="stylesheet" href="css/slick-theme.css" />
	<link type="text/css" rel="stylesheet" href="css/nouislider.min.css" />
	<link rel="stylesheet" href="css/font-awesome.min.css">
	<link type="text/css" rel="stylesheet" href="css/style.css?v=3.0.0" />

	<!-- PWA Manifest & Meta -->
	<link rel="manifest" href="manifest.json">
	<meta name="theme-color" content="#2563eb">
	<meta name="description" content="NexusMart Enterprise - Next-generation e-commerce store with electronics, fashion, and home supplies.">

	<style>
		#navigation { background: #ffffff; border-bottom: 1px solid #e2e8f0; }
		#header { background: #ffffff; border-bottom: 1px solid #e2e8f0; }
		#footer { background: #0f172a; color: #f8fafc; border-top: 4px solid #2563eb; }
		#bottom-footer { background: #020617; color: #94a3b8; }
		.footer-links li a { color: #94a3b8; }
		.footer-links li a:hover { color: #38bdf8; }
		
		/* Amazon/Nexus Sidebar Styles */
		#amazon-sidebar {
			height: 100%; width: 280px; position: fixed; z-index: 9999; top: 0; left: -280px;
			background-color: #fff; overflow-x: hidden; transition: 0.3s; box-shadow: 4px 0 20px rgba(0,0,0,0.15);
		}
		#amazon-sidebar.open { left: 0; }
		.amz-sidebar-header {
			background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff; padding: 16px 20px;
			font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; position: relative;
		}
		.amz-sidebar-close { position: absolute; right: 15px; top: 12px; font-size: 28px; color: white; cursor: pointer; }
		.amz-sidebar-content h3 { margin: 18px 20px 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
		.amz-sidebar-content ul { list-style: none; padding: 0; margin: 0; }
		.amz-sidebar-content ul li a { display: block; padding: 12px 20px; color: #334155; text-decoration: none; font-size: 14px; font-weight: 500; transition: 0.2s; }
		.amz-sidebar-content ul li a:hover { background-color: #f1f5f9; color: #2563eb; }
		#amz-overlay { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0,0,0,0.6); z-index: 9998; backdrop-filter: blur(2px); }
		#amz-overlay.show { display: block; }

		/* Side Cart Styles */
		#side-cart {
			height: 100%; width: 300px; position: fixed; z-index: 10001; top: 0; right: -300px;
			background-color: #fff; transition: 0.3s; box-shadow: -4px 0 20px rgba(0,0,0,0.15); display: flex; flex-direction: column;
		}
		#side-cart.open { right: 0; }
		.side-cart-header { padding: 15px 20px; border-bottom: 1px solid #e2e8f0; background: #fff; }
		.side-cart-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
		.side-cart-subtotal div { font-size: 12px; color: #64748b; font-weight: 500; }
		.side-cart-subtotal h4 { font-size: 18px; color: #2563eb; margin: 2px 0; font-weight: 700; }
		.side-cart-btn-go {
			display: block; width: 100%; background: #2563eb; border: none; border-radius: 6px; padding: 10px;
			text-align: center; color: #fff !important; font-weight: 600; font-size: 14px; text-decoration: none; transition: 0.2s;
		}
		.side-cart-btn-go:hover { background: #1d4ed8; }
		.side-cart-content { flex: 1; overflow-y: auto; padding: 15px; }
		.side-cart-item { display: flex; gap: 12px; padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; align-items: flex-start; }
		.side-cart-item-img-container { width: 60px; height: 60px; flex-shrink: 0; border-radius: 6px; border: 1px solid #e2e8f0; padding: 4px; }
		.side-cart-item-img { width: 100%; height: 100%; object-fit: contain; }
		.side-cart-item-info { flex: 1; }
		.side-cart-item-title { font-size: 13px; color: #1e293b; font-weight: 600; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; }
		.side-cart-item-price { font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 6px; }
		.side-qty-controls { display: inline-flex; align-items: center; border: 1px solid #cbd5e1; background: #fff; border-radius: 20px; padding: 2px 6px; }
		.side-qty-btn { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; color: #334155; background: transparent; border: none; }
		.side-qty-val { width: 26px; text-align: center; font-weight: 700; font-size: 13px; color: #0f172a; }
		.side-qty-trash { color: #ef4444; font-size: 14px; cursor: pointer; padding: 4px 8px; border-right: 1px solid #cbd5e1; }
		#side-cart-overlay { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0,0,0,0.5); z-index: 10000; backdrop-filter: blur(2px); }
		#side-cart-overlay.show { display: block; }

		/* Dropdown Menu */
		.fk-login-wrapper { position: relative; display: inline-block; }
		.fk-login-btn {
			background: #2563eb; color: #fff !important; padding: 8px 18px; border-radius: 6px;
			font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; transition: 0.2s;
		}
		.fk-login-btn:hover { background: #1d4ed8; }
		.fk-login-wrapper:hover .fk-dropdown-menu { display: block; }
		.fk-dropdown-menu {
			display: none; position: absolute; top: 42px; left: 50%; transform: translateX(-50%); width: 260px;
			background: #fff; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 10000; padding: 0; border: 1px solid #e2e8f0;
		}
		.fk-dropdown-top { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
		.fk-new-cust { font-size: 13px; color: #64748b; font-weight: 500; }
		.fk-signup-link { font-size: 13px; color: #2563eb; font-weight: 700; text-decoration: none; }
		.fk-dropdown-list { list-style: none; margin: 0; padding: 6px 0; }
		.fk-dropdown-list a { display: flex; align-items: center; padding: 10px 18px; color: #334155 !important; font-size: 13px; font-weight: 500; text-decoration: none; transition: 0.2s; gap: 12px; }
		.fk-dropdown-list a i { font-size: 15px; color: #2563eb; width: 16px; text-align: center; }
		.fk-dropdown-list a:hover { background-color: #f8fafc; color: #2563eb !important; }
	</style>
	<script>
		function openNav() {
			document.getElementById("amazon-sidebar").classList.add("open");
			document.getElementById("amz-overlay").classList.add("show");
		}
		function closeNav() {
			document.getElementById("amazon-sidebar").classList.remove("open");
			document.getElementById("amz-overlay").classList.remove("show");
		}
	</script>
</head>
<body>
	<!-- Amazon / Nexus Sidebar -->
	<div id="amazon-sidebar">
		<div class="amz-sidebar-header">
			<i class="fa fa-user-circle" style="font-size: 24px;"></i>
			<span><?php echo isset($_SESSION["name"]) ? "Hello, " . e($_SESSION["name"]) : "Hello, Sign In"; ?></span>
			<span class="amz-sidebar-close" id="close-sidebar" onclick="closeNav()">&times;</span>
		</div>
		<div class="amz-sidebar-content">
			<h3>Explore NexusMart</h3>
			<ul>
				<li><a href="index.php">Best Sellers</a></li>
				<li><a href="store.php">New Releases</a></li>
				<li><a href="store.php">Featured Products</a></li>
			</ul>
			<hr style="margin: 10px 0; border-color:#e2e8f0;">
			<h3>Shop By Category</h3>
			<ul id="sidebar-categories-list">
				<li><a href="store.php?cat_id=1">Electronics</a></li>
				<li><a href="store.php?cat_id=2">Ladies Wears</a></li>
				<li><a href="store.php?cat_id=3">Mens Wear</a></li>
				<li><a href="store.php?cat_id=4">Kids Wear</a></li>
				<li><a href="store.php?cat_id=5">Furnitures</a></li>
				<li><a href="store.php?cat_id=6">Home Appliances</a></li>
				<li><a href="store.php?cat_id=7">Sports</a></li>
			</ul>
		</div>
	</div>
	<div id="amz-overlay"></div>

	<!-- Side Cart -->
	<div id="side-cart-overlay"></div>
	<div id="side-cart">
		<div class="side-cart-header">
			<div class="side-cart-top">
				<div class="side-cart-subtotal" id="side-cart-subtotal-header"></div>
				<span style="cursor:pointer; font-size:24px; color:#64748b;" onclick="closeSideCart()">&times;</span>
			</div>
			<a href="cart.php" class="side-cart-btn-go">Go to Shopping Cart</a>
		</div>
		<div class="side-cart-content" id="side-cart-items"></div>
	</div>

	<!-- HEADER -->
	<header>
		<div id="header">
			<div class="container">
				<div class="row header-flex-row" style="display:flex; align-items:center;">
					<!-- LOGO -->
					<div class="col-md-3 col-xs-6">
						<div class="header-logo">
							<a href="index.php" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
								<i class="fa fa-shopping-bag" style="font-size:24px; color:#2563eb;"></i>
								<span style="font-size:22px; font-weight:800; color:#0f172a; letter-spacing:-0.5px;"><?php echo APP_NAME; ?></span>
							</a>
						</div>
					</div>

					<!-- SEARCH BAR -->
					<?php if (!isset($clean_header) || !$clean_header): ?>
						<div class="col-md-5 mobile-search">
							<div class="fk-search-container" style="position:relative;">
								<form action="store.php" method="GET" style="display:flex;">
									<input class="fk-input" id="search" name="search" type="text" placeholder="Search products, brands and keywords..." style="width:100%; border:1px solid #cbd5e1; border-radius:20px 0 0 20px; padding:10px 18px; outline:none; font-size:14px;">
									<button id="search_btn" type="submit" class="fk-search-btn" style="background:#2563eb; border:none; color:#fff; padding:0 20px; border-radius:0 20px 20px 0; cursor:pointer;"><i class="fa fa-search"></i></button>
								</form>
							</div>
						</div>
					<?php endif; ?>

					<!-- RIGHT NAV -->
					<div class="col-md-4 mobile-right-nav" style="display:flex; justify-content:flex-end;">
						<div class="header-ctn fk-nav" style="display:flex; align-items:center; gap:20px;">
							<?php
							if (isset($_SESSION["uid"])) {
								$uid = intval($_SESSION["uid"]);
								$sql = "SELECT first_name FROM user_info WHERE user_id = $uid";
								$query = mysqli_query($con, $sql);
								$user_row = $query ? mysqli_fetch_assoc($query) : null;
								$first_name = $user_row ? e($user_row["first_name"]) : "Account";

								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="myprofile.php" class="fk-login-btn">
                                        <i class="fa fa-user-circle-o"></i>
                                        <span>' . $first_name . '</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <ul class="fk-dropdown-list">
                                            <li><a href="myprofile.php"><i class="fa fa-user-circle-o"></i> My Profile</a></li>
                                            <li><a href="myorders.php"><i class="fa fa-cube"></i> My Orders</a></li>
                                            <li><a href="wishlist.php"><i class="fa fa-heart-o"></i> Wishlist</a></li>
                                            <li><a href="logout.php"><i class="fa fa-sign-out"></i> Logout</a></li>
                                        </ul>
                                   </div>
                                </div>';
							} elseif (isset($_SESSION["admin_id"])) {
								$admin_name = isset($_SESSION["admin_name"]) ? e($_SESSION["admin_name"]) : "Admin";
								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="admin/index.php" class="fk-login-btn" style="background:#0f172a;">
                                        <i class="fa fa-user-shield"></i>
                                        <span>' . $admin_name . '</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <ul class="fk-dropdown-list">
                                            <li><a href="admin/index.php"><i class="fa fa-dashboard"></i> Dashboard</a></li>
                                            <li><a href="admin/products_list.php"><i class="fa fa-box"></i> Products</a></li>
                                            <li><a href="admin/settings.php"><i class="fa fa-gear"></i> Settings</a></li>
                                            <li><a href="logout.php"><i class="fa fa-sign-out"></i> Logout</a></li>
                                        </ul>
                                   </div>
                                </div>';
							} else {
								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="signin_form.php" class="fk-login-btn">
                                        <i class="fa fa-user-circle-o"></i>
                                        <span>Sign In</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <div class="fk-dropdown-top">
                                            <span class="fk-new-cust">New customer?</span>
                                            <a href="signup_form.php" class="fk-signup-link">Sign Up</a>
                                        </div>
                                        <ul class="fk-dropdown-list">
                                            <li><a href="myprofile.php"><i class="fa fa-user-circle-o"></i> My Profile</a></li>
                                            <li><a href="myorders.php"><i class="fa fa-cube"></i> Orders</a></li>
                                            <li><a href="wishlist.php"><i class="fa fa-heart-o"></i> Wishlist</a></li>
                                        </ul>
                                   </div>
                                </div>';
							}
							?>

							<!-- Wishlist -->
							<?php if (!isset($clean_header) || !$clean_header): ?>
								<div class="fk-nav-item">
									<a href="wishlist.php" style="color:#334155; font-weight:600; display:flex; align-items:center; gap:6px; text-decoration:none;">
										<i class="fa fa-heart-o" style="font-size:18px; color:#ef4444;"></i>
										<span>Wishlist</span>
									</a>
								</div>

								<!-- Cart -->
								<div class="fk-nav-item">
									<a onclick="openSideCart()" style="display:flex; align-items:center; cursor:pointer; gap:8px; color:#334155; font-weight:600; text-decoration:none;">
										<div style="position:relative;">
											<i class="fa fa-shopping-cart" style="font-size:20px; color:#2563eb;"></i>
											<div class="badge qty fk-cart-badge" style="position:absolute; top:-8px; right:-10px; background:#ef4444; color:#fff; border-radius:50%; width:18px; height:18px; font-size:11px; display:flex; align-items:center; justify-content:center;"><?php echo get_cart_count($con); ?></div>
										</div>
										<span>Cart</span>
									</a>
								</div>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<?php if (!isset($clean_header) || !$clean_header): ?>
		<nav id='navigation'>
			<div class="container" id="get_category_home">
				<div id="responsive-nav">
					<ul class="main-nav nav navbar-nav" style="display:flex; gap:10px;">
						<li class="active"><a href="index.php">Home</a></li>
						<li class="category" cid="1"><a href="store.php?cat_id=1">Electronics</a></li>
						<li class="category" cid="2"><a href="store.php?cat_id=2">Ladies Wears</a></li>
						<li class="category" cid="3"><a href="store.php?cat_id=3">Mens Wear</a></li>
						<li class="category" cid="4"><a href="store.php?cat_id=4">Kids Wear</a></li>
						<li class="category" cid="5"><a href="store.php?cat_id=5">Furnitures</a></li>
						<li class="category" cid="6"><a href="store.php?cat_id=6">Home Appliances</a></li>
						<li class="category" cid="7"><a href="store.php?cat_id=7">Sports</a></li>
					</ul>
				</div>
			</div>
		</nav>
	<?php endif; ?>
