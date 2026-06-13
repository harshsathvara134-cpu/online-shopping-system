<?php
require_once __DIR__ . "/session_bootstrap.php";

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

	<title>JAYVEER</title>

	<!-- Google font -->
	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700" rel="stylesheet" />

	<!-- Bootstrap -->
	<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css" />

	<!-- Slick -->
	<link type="text/css" rel="stylesheet" href="css/slick.css" />
	<link type="text/css" rel="stylesheet" href="css/slick-theme.css" />

	<!-- nouislider -->
	<link type="text/css" rel="stylesheet" href="css/nouislider.min.css" />

	<!-- Font Awesome Icon -->
	<link rel="stylesheet" href="css/font-awesome.min.css">

	<!-- Custom stylesheet -->
	<link type="text/css" rel="stylesheet" href="css/style.css" />

	<!-- PWA Manifest -->
	<link rel="manifest" href="manifest.json">
	<meta name="theme-color" content="#2874f0">
	<link rel="apple-touch-icon" href="img/nova_banner.png">








	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
		  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	<style>
		#navigation {
			background: #ffffff;
			border-bottom: 1px solid #e4e7ed;
		}

		#header {
			background: #ffffff;
			border-bottom: 1px solid #e4e7ed;
		}


		#footer {
			background: #ffffff;
			color: #333;
			border-top: 5px solid #febd69;
		}

		#bottom-footer {
			background: #f5f5f5;
		}

		.footer-links li a {
			color: #666;
		}

		.mainn-raised {
			margin: 20px 0px 0px;
			border-radius: 8px;
			box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
		}

		.glyphicon {
			display: inline-block;
			font: normal normal normal 14px/1 FontAwesome;
			font-size: inherit;
			text-rendering: auto;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}

		.glyphicon-chevron-left:before {
			content: "\f053"
		}

		.glyphicon-chevron-right:before {
			content: "\f054"
		}

		/* Amazon Sidebar Styles */
		#amazon-sidebar {
			height: 100%;
			width: 280px;
			position: fixed;
			z-index: 9999;
			top: 0;
			left: -280px;
			background-color: #fff;
			overflow-x: hidden;
			transition: 0.3s;
			box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
		}

		#amazon-sidebar.open {
			left: 0;
		}

		.amz-sidebar-header {
			background-color: #232f3e;
			color: #fff;
			border-bottom: 1px solid #e4e7ed;
			padding: 12px 20px;
			font-size: 16px;
			font-weight: 700;
			display: flex;
			align-items: center;
			gap: 10px;
			position: relative;
		}

		.amz-sidebar-close {
			position: absolute;
			right: -45px;
			top: 15px;
			font-size: 36px;
			color: white;
			cursor: pointer;
		}

		.amz-sidebar-content h3 {
			margin: 15px 20px 8px;
			font-size: 15px;
			font-weight: 700;
			color: #111;
		}

		.amz-sidebar-content ul {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		.amz-sidebar-content ul li a {
			display: block;
			padding: 10px 20px;
			color: #444;
			text-decoration: none;
			transition: 0.2s;
			font-size: 13px;
		}

		.amz-sidebar-content ul li a:hover {
			background-color: #f2f2f2;
		}

		#amz-overlay {
			display: none;
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.7);
			z-index: 9998;
		}

		#amz-overlay.show {
			display: block;
		}

		/* Mobile Header Flex Rules & Flipkart Layout */
		@media (max-width: 991px) {
			#header .row.header-flex-row {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
			}

			.mobile-logo {
				width: 50%;
				order: 1;
				text-align: left;
				display: flex;
				align-items: center;
			}

			.mobile-menu-toggle {
				width: 50%;
				order: 1;
				display: flex !important;
				justify-content: flex-end;
				align-items: center;
				padding: 15px 0;
			}

			.mobile-right-nav {
				display: none !important;
			}

			.mobile-location {
				width: 100%;
				order: 2;
				margin-top: 5px;
				padding-top: 0 !important;
				display: flex;
				justify-content: flex-start;
				background: #f9f9f9;
				padding: 8px 15px !important;
				border-bottom: 1px solid #eee;
			}

			.mobile-search {
				width: 100%;
				order: 3;
				margin-top: 5px;
				padding: 0 15px 10px !important;
			}

			.mobile-menu-btn {
				background: transparent;
				border: none;
				font-size: 20px;
				color: #333;
				display: flex;
				align-items: center;
				gap: 5px;
				cursor: pointer;
			}


			/* Bottom Navigation */
			.mobile-bottom-nav {
				display: flex !important;
				justify-content: space-around;
				align-items: center;
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				background: #fff;
				box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
				z-index: 9999;
				padding: 10px 0;
			}

			.mobile-bottom-nav .nav-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #666;
				text-decoration: none;
				font-size: 12px;
				font-weight: 500;
			}

			.mobile-bottom-nav .nav-item i {
				font-size: 20px;
				margin-bottom: 3px;
			}

			.mobile-bottom-nav .nav-item:hover,
			.mobile-bottom-nav .nav-item:active {
				color: #0066c0;
			}

			body {
				padding-bottom: 60px;
				/* Space for bottom nav */
			}
		}

		.mobile-menu-toggle {
			display: none;
		}

		.mobile-bottom-nav {
			display: none;
		}

		/* Side Cart Styles (Compact Amazon Style) */
		#side-cart {
			height: 100%;
			width: 280px;
			position: fixed;
			z-index: 10001;
			top: 0;
			right: -280px;
			background-color: #fff;
			transition: 0.3s;
			box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			font-family: inherit;
		}

		#side-cart.open {
			right: 0;
		}

		.side-cart-header {
			padding: 8px 12px;
			border-bottom: 1px solid #f0f0f0;
			background: #fff;
		}

		.side-cart-top {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;
			position: relative;
		}

		.side-cart-subtotal {
			text-align: center;
			width: 100%;
		}

		.side-cart_subtotal div {
			font-size: 11px;
			color: #111;
			font-weight: 500;
		}

		.side-cart-subtotal h4 {
			font-size: 16px;
			color: #B12704;
			margin: 2px 0;
			font-weight: 700;
		}

		.side-cart-btn-go {
			display: block;
			width: 100%;
			background: #fff;
			border: 1px solid #dcdfe1;
			border-radius: 15px;
			padding: 4px 10px;
			text-align: center;
			color: #111 !important;
			font-weight: 500;
			box-shadow: 0 2px 5px rgba(213, 217, 217, .5);
			font-size: 12px;
			margin-bottom: 5px;
		}

		.side-cart-content {
			flex: 1;
			overflow-y: auto;
			padding: 10px;
		}

		.side-cart-item {
			display: flex;
			gap: 10px;
			padding-bottom: 15px;
			margin-bottom: 15px;
			border-bottom: 1px solid #f2f2f2;
			align-items: flex-start;
		}

		.side-cart-item-img-container {
			width: 70px;
			height: 70px;
			flex-shrink: 0;
		}

		.side-cart-item-img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		.side-cart-item-info {
			flex: 1;
		}

		.side-cart-item-title {
			font-size: 12px;
			color: #111;
			font-weight: 500;
			margin: 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			line-height: 1.3;
		}

		.side-cart-item-price {
			font-weight: 700;
			font-size: 14px;
			margin: 4px 0 6px;
			color: #111;
		}

		.side-qty-controls {
			display: inline-flex;
			align-items: center;
			border: 1px solid #FFD814;
			background: #fff;
			border-radius: 20px;
			padding: 0 4px;
			box-shadow: 0 1px 3px rgba(213, 217, 217, .5);
		}

		.side-qty-btn {
			width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			font-size: 14px;
			color: #111;
			background: transparent;
			border: none;
		}

		.side-qty-val {
			width: 30px;
			text-align: center;
			font-weight: 700;
			font-size: 13px;
			color: #111;
		}

		.side-qty-trash {
			color: #111;
			font-size: 14px;
			cursor: pointer;
			padding: 5px 8px;
			border-right: 1px solid #FFD814;
		}

		#side-cart-overlay {
			display: none;
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 10000;
		}

		#side-cart-overlay.show {
			display: block;
		}

		/* Flipkart Style Dropdown */
		.fk-login-wrapper {
			position: relative;
			display: inline-block;
		}

		.fk-login-btn {
			background: #2874f0;
			color: #fff !important;
			padding: 6px 16px;
			border: 1px solid #dbdbdb;
			font-weight: 600;
			text-decoration: none;
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 14px;
			cursor: pointer;
			transition: 0.2s;
			border-radius: 2px;
			min-width: 100px;
			justify-content: center;
		}

		.fk-login-btn:hover,
		.fk-login-wrapper:hover .fk-login-btn {
			background: #fff;
			color: #2874f0 !important;
			border-radius: 2px;
		}

		.fk-login-wrapper:hover .fk-dropdown-menu {
			display: block;
		}

		.fk-dropdown-menu {
			display: none;
			position: absolute;
			top: 40px;
			left: 50%;
			transform: translateX(-50%);
			width: 280px;
			background: #fff;
			border-radius: 4px;
			box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .2);
			z-index: 10000;
			padding: 0;
			animation: fadeIn 0.15s ease-in-out;
		}

		/* Triangle pointer */
		.fk-dropdown-menu::before {
			content: '';
			position: absolute;
			top: -8px;
			left: 50%;
			transform: translateX(-50%);
			border-left: 8px solid transparent;
			border-right: 8px solid transparent;
			border-bottom: 8px solid #fff;
		}

		.fk-dropdown-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px 20px;
			border-bottom: 1px solid #f0f0f0;
		}

		.fk-new-cust {
			font-size: 14px;
			color: #111;
			font-weight: 500;
		}

		.fk-signup-link {
			font-size: 14px;
			color: #2874f0;
			font-weight: 600;
			text-decoration: none;
		}

		.fk-signup-link:hover {
			text-decoration: underline;
		}

		.fk-dropdown-list {
			list-style: none;
			margin: 0;
			padding: 5px 0 10px;
		}

		.fk-dropdown-list li {
			position: relative;
		}

		.fk-dropdown-list a {
			display: flex;
			align-items: center;
			padding: 12px 20px;
			color: #333 !important;
			font-size: 14px;
			font-weight: 500;
			text-decoration: none;
			transition: 0.2s;
			gap: 15px;
		}

		.fk-dropdown-list a i {
			font-size: 16px;
			color: #2874f0;
			width: 16px;
			text-align: center;
		}

		.fk-dropdown-list a:hover {
			background-color: #f0f0f0;
			color: #111 !important;
		}

		.fk-dropdown-list li:not(:last-child) {
			border-bottom: 1px solid #f0f0f0;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
				top: 45px;
			}

			to {
				opacity: 1;
				top: 40px;
			}
		}
	</style>
	<script>
		function openNav() {
			document.getElementById("amazon-sidebar").classList.add("open");
			document.getElementById("amz-overlay").classList.add("show");

			// Dynamically populate categories from main nav if not already done
			const sidebarList = document.getElementById("sidebar-categories-list");
			if (sidebarList && sidebarList.children.length === 0) {
				const mainNavLinks = document.querySelectorAll("#responsive-nav .main-nav li:not(.active) a");
				mainNavLinks.forEach(link => {
					const li = document.createElement("li");
					const newLink = link.cloneNode(true);
					li.appendChild(newLink);
					sidebarList.appendChild(li);
				});
			}
		}

		function closeNav() {
			document.getElementById("amazon-sidebar").classList.remove("open");
			document.getElementById("amz-overlay").classList.remove("show");
		}


		document.addEventListener("DOMContentLoaded", function () {
			let savedLoc = localStorage.getItem("delivery_location");
			if (savedLoc) {
				let locStatus = document.getElementById("loc-status");
				let locText = document.getElementById("loc-text");
				if (locStatus) locStatus.innerText = "Deliver to";
				if (locText) locText.innerHTML = savedLoc + ' <i class="fa fa-angle-right"></i>';
			}

			let locInput = document.getElementById("loc-pincode");
			if (locInput) {
				locInput.addEventListener("keypress", function (event) {
					if (event.key === "Enter") {
						event.preventDefault();
						saveLocation();
					}
				});
			}
		});

		function saveLocation() {
			let pincode = document.getElementById("loc-pincode").value;
			if (pincode.trim() !== "") {
				localStorage.setItem("delivery_location", pincode);
				document.getElementById("loc-status").innerText = "Deliver to";
				document.getElementById("loc-text").innerHTML = pincode + ' <i class="fa fa-angle-right"></i>';
				$('#locationModal').modal('hide');
			}
		}

		function getCurrentLocation() {
			if (navigator.geolocation) {
				let btnText = document.getElementById("curr-loc-text");
				let btnIcon = document.getElementById("curr-loc-icon");

				if (btnText) btnText.innerText = "Detecting your location...";
				if (btnIcon) btnIcon.className = "fa fa-spinner fa-spin";

				document.getElementById("loc-status").innerText = "Detecting...";
				document.getElementById("loc-text").innerHTML = "Locating... <i class='fa fa-angle-right'></i>";

				navigator.geolocation.getCurrentPosition(function (position) {
					let lat = position.coords.latitude;
					let lon = position.coords.longitude;

					fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
						headers: { 'Accept-Language': 'en-US,en;q=0.9' }
					})
						.then(response => response.json())
						.then(data => {
							let address = data.address;
							let displayLoc = address.suburb || address.neighbourhood || address.city_district || address.city || address.town || address.county || "Current Location";
							let pincode = address.postcode || "";
							if (pincode && displayLoc !== "Current Location") {
								displayLoc += " " + pincode;
							} else if (pincode) {
								displayLoc = pincode;
							}

							localStorage.setItem("delivery_location", displayLoc);
							document.getElementById("loc-status").innerText = "Deliver to";
							document.getElementById("loc-text").innerHTML = displayLoc + ' <i class="fa fa-angle-right"></i>';

							if (btnText) btnText.innerText = "Use my current location";
							if (btnIcon) btnIcon.className = "fa fa-crosshairs";
							$('#locationModal').modal('hide');
						})
						.catch(err => {
							let currentLoc = "Located";
							localStorage.setItem("delivery_location", currentLoc);
							document.getElementById("loc-status").innerText = "Deliver to";
							document.getElementById("loc-text").innerHTML = currentLoc + ' <i class="fa fa-angle-right"></i>';

							if (btnText) btnText.innerText = "Use my current location";
							if (btnIcon) btnIcon.className = "fa fa-crosshairs";
							$('#locationModal').modal('hide');
						});
				}, function (error) {
					if (btnText) btnText.innerText = "Use my current location";
					if (btnIcon) btnIcon.className = "fa fa-crosshairs";

					if (error.code === error.PERMISSION_DENIED) {
						alert("Location access was denied. Please allow it in browser settings.");
					} else {
						alert("Please allow location access or check your connection.");
					}
					document.getElementById("loc-status").innerText = "Location not set";
					document.getElementById("loc-text").innerHTML = "Select delivery location <i class='fa fa-angle-right'></i>";
				}, { timeout: 10000 });
			} else {
				alert("Geolocation is not supported by this browser.");
			}
		}

		function toggleHeaderMenu(e) {
			e.preventDefault();
			e.stopPropagation();
			const parent = e.currentTarget.closest('.c') || e.currentTarget.closest('.dropdown');

			// Close other open menus first
			document.querySelectorAll('.c.active, .dropdown.active').forEach(m => {
				if (m !== parent) m.classList.remove('active');
			});

			parent.classList.toggle('active');
		}

		window.onclick = function (event) {
			const overlay = document.getElementById("amz-overlay");
			const sideOverlay = document.getElementById("side-cart-overlay");
			if (event.target == overlay) {
				closeNav();
			}
			if (event.target == sideOverlay) {
				closeSideCart();
			}

			// Close headerr dropdowns if clicking outside
			const activeDrop = document.querySelector('.c.active, .dropdown.active');
			if (activeDrop && !activeDrop.contains(event.target)) {
				activeDrop.classList.remove('active');
			}
		}

		// Register Service Worker for PWA
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('sw.js')
					.then(reg => console.log('Service Worker registered'))
					.catch(err => console.log('Service Worker registration failed', err));
			});
		}
	</script>

</head>

<body>
	<!-- Amazon Sidebar -->
	<div id="amazon-sidebar">
		<div class="amz-sidebar-header">
			<i class="fa fa-user-circle" style="font-size: 24px;"></i>
			<span><?php echo isset($_SESSION["name"]) ? "Hello, " . $_SESSION["name"] : "Hello, Sign In"; ?></span>
			<span class="amz-sidebar-close" id="close-sidebar" onclick="closeNav()">&times;</span>
		</div>
		<div class="amz-sidebar-content">
			<h3>Trending</h3>
			<ul>
				<li><a href="index.php">Best Sellers</a></li>
				<li><a href="index.php">New Releases</a></li>
				<li><a href="index.php">Movers & Shakers</a></li>
			</ul>
			<hr style="margin: 10px 0;">
			<h3>Shop By Category</h3>
			<ul id="sidebar-categories-list">
				<!-- Categories will be cloned here for mobile/sidebar access -->
			</ul>
		</div>
	</div>
	<div id="amz-overlay"></div>

	<!-- Side Cart -->
	<div id="side-cart-overlay"></div>
	<div id="side-cart">
		<div class="side-cart-header">
			<div class="side-cart-top">
				<div class="side-cart-subtotal" id="side-cart-subtotal-header">
					<!-- Dynamically populated -->
				</div>
				<span style="cursor:pointer; font-size:24px;" onclick="closeSideCart()">&times;</span>
			</div>
			<a href="cart.php" class="side-cart-btn-go">Go to Cart</a>
		</div>
		<div class="side-cart-content" id="side-cart-items">
			<!-- Dynamically populated -->
		</div>
	</div>

	<!-- HEADER -->
	<header>

		<!-- MAIN HEADER -->
		<div id="header">
			<!-- container -->
			<div class="container">
				<!-- row -->
				<div class="row header-flex-row">
					<!-- LOGO -->
					<div class="col-md-2 col-xs-6 mobile-logo">
						<div class="header-logo">
							<a href="index.php" class="fk-logo-box">
								<i class="" style="font-size:20px;"></i>
								<span class="fk-logo-text">JAYVEER</span>
							</a>
						</div>
					</div>
					<!-- /LOGO -->

					<!-- MOBILE MENU TOGGLE -->
					<div class="col-xs-6 mobile-menu-toggle">
						<button class="mobile-menu-btn" onclick="openNav()">
							<span style="font-size: 14px; font-weight: 600;">Menu</span>
							<i class="fa fa-bars"></i>
						</button>
					</div>
					<!-- /MOBILE MENU TOGGLE -->


					<!-- LOCATION -->
					<?php if (!isset($clean_header) || !$clean_header): ?>
						<div class="col-md-2 mobile-location" style="cursor:pointer;" data-toggle="modal"
							data-target="#locationModal">
							<div style="display:flex; align-items:center;">
								<i class="fa fa-map-marker" style="font-size: 20px; line-height: 1;"></i>
								<div style="margin-left:5px; line-height:1.2;">
									<div style="font-size:12px; color:#666;" id="loc-status">Location not set</div>
									<div style="font-size:14px; color:#0066c0; font-weight:500;" id="loc-text">Select
										delivery location <i class="fa fa-angle-right"></i></div>
								</div>
							</div>
						</div>
					<?php endif; ?>
					<!-- /LOCATION -->

					<!-- SEARCH BAR -->
					<?php if (!isset($clean_header) || !$clean_header): ?>
						<div class="col-md-4 mobile-search">
							<div class="fk-search-container">
								<form onsubmit="return false">
									<input class="fk-input" id="search" name="search" type="text"
										placeholder="Search for Products, Brands and More">
									<button id="search_btn" class="fk-search-btn"><i class="fa fa-search"></i></button>
								</form>
							</div>
						</div>
					<?php endif; ?>
					<!-- /SEARCH BAR -->

					<!-- RIGHT NAV -->
					<div class="col-md-4 mobile-right-nav">
						<div class="header-ctn fk-nav">
							<?php
							include_once "db.php";
							if (isset($_SESSION["uid"])) {
								$sql = "SELECT first_name FROM user_info WHERE user_id='$_SESSION[uid]'";
								$query = mysqli_query($con, $sql);
								$row = mysqli_fetch_array($query);

								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="myprofile.php" class="fk-login-btn">
                                        <i class="fa fa-user-circle-o"></i>
                                        <span>' . $row["first_name"] . '</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <ul class="fk-dropdown-list">
                                            <li><a href="myprofile.php"><i class="fa fa-user-circle-o"></i> My Profile</a></li>
                                            <li><a href="#"><i class="fa fa-star"></i> JAYVEER Plus Zone</a></li>
                                            <li><a href="myorders.php"><i class="fa fa-cube"></i> Orders</a></li>
                                            <li><a href="wishlist.php"><i class="fa fa-heart-o"></i> Wishlist</a></li>
                                            <li><a href="#"><i class="fa fa-inr"></i> Become a Seller</a></li>
                                            <li><a href="#"><i class="fa fa-gift"></i> Rewards</a></li>
                                            <li><a href="#"><i class="fa fa-credit-card"></i> Gift Cards</a></li>
                                            <li><a href="#"><i class="fa fa-bell-o"></i> Notification Preferences</a></li>
                                            <li><a href="#"><i class="fa fa-headphones"></i> 24x7 Customer Care</a></li>
                                            <li><a href="#"><i class="fa fa-line-chart"></i> Advertise</a></li>
                                            <li><a href="#"><i class="fa fa-download"></i> Download App</a></li>
                                            <li><a href="logout.php"><i class="fa fa-sign-out"></i> Logout</a></li>
                                        </ul>
                                   </div>
                                </div>';

							} elseif (isset($_SESSION["admin_id"])) {
								$admin_name = isset($_SESSION["admin_name"]) ? $_SESSION["admin_name"] : "Admin";
								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="admin/index.php" class="fk-login-btn">
                                        <i class="fa fa-user-shield"></i>
                                        <span>' . $admin_name . '</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <ul class="fk-dropdown-list">
                                            <li><a href="admin/index.php"><i class="fa fa-gauge"></i> Dashboard</a></li>
                                            <li><a href="admin/settings.php"><i class="fa fa-gear"></i> Settings</a></li>
                                            <li><a href="#"><i class="fa fa-inr"></i> Become a Seller</a></li>
                                            <li><a href="#"><i class="fa fa-credit-card"></i> Gift Cards</a></li>
                                            <li><a href="#"><i class="fa fa-headphones"></i> 24x7 Customer Care</a></li>
                                            <li><a href="#"><i class="fa fa-download"></i> Download App</a></li>
                                            <li><a href="logout.php"><i class="fa fa-sign-out"></i> Logout</a></li>
                                        </ul>
                                   </div>
                                </div>';
							} else {

								echo '
                                <div class="fk-nav-item fk-login-wrapper">
                                   <a href="signin_form.php" class="fk-login-btn">
                                        <i class="fa fa-user-circle-o"></i>
                                        <span>Login</span>
                                        <i class="fa fa-angle-down" style="font-size:12px;"></i>
                                   </a>
                                   <div class="fk-dropdown-menu">
                                        <div class="fk-dropdown-top">
                                            <span class="fk-new-cust">New customer?</span>
                                            <a href="signup_form.php" class="fk-signup-link">Sign Up</a>
                                        </div>
                                        <ul class="fk-dropdown-list">
                                            <li><a href="myprofile.php"><i class="fa fa-user-circle-o"></i> My Profile</a></li>
                                            <li><a href="#"><i class="fa fa-star"></i> JAYVEER Plus Zone</a></li>
                                            <li><a href="myorders.php"><i class="fa fa-cube"></i> Orders</a></li>
                                            <li><a href="wishlist.php"><i class="fa fa-heart-o"></i> Wishlist</a></li>
                                            <li><a href="#"><i class="fa fa-inr"></i> Become a Seller</a></li>
                                            <li><a href="#"><i class="fa fa-gift"></i> Rewards</a></li>
                                            <li><a href="#"><i class="fa fa-credit-card"></i> Gift Cards</a></li>
                                            <li><a href="#"><i class="fa fa-bell-o"></i> Notification Preferences</a></li>
                                            <li><a href="#"><i class="fa fa-headphones"></i> 24x7 Customer Care</a></li>
                                            <li><a href="#"><i class="fa fa-line-chart"></i> Advertise</a></li>
                                            <li><a href="#"><i class="fa fa-download"></i> Download App</a></li>
                                        </ul>
                                   </div>
                                </div>';

							}
							?>

							<!-- Wishlist -->
							<?php if (!isset($clean_header) || !$clean_header): ?>
								<div class="fk-nav-item">
									<a href="wishlist.php"
										style="color:#333; font-weight:500; display:flex; align-items:center; gap:5px;">
										<span>Wishlist</span>
										<i class="fa fa-heart"></i>
									</a>
								</div>

								<!-- Cart -->
								<div class="fk-nav-item">
									<a onclick="openSideCart()"
										style="display:flex; align-items:center; cursor:pointer; gap:8px; color:#333; font-weight:500;">
										<div style="position:relative;">
											<i class="fa fa-shopping-cart" style="font-size:20px;"></i>
											<div class="badge qty fk-cart-badge">0</div>
										</div>
										<span>Cart</span>
									</a>
								</div>
							<?php endif; ?>

							<!-- Menu Toogle -->
							<div class="fk-nav-item hidden-md hidden-lg">
								<a href="javascript:void(0)" onclick="openNav()"
									style="display:flex; align-items:center; cursor:pointer; gap:8px; color:#333; font-weight:500;">
									<div style="position:relative;">
										<i class="fa fa-bars" style="font-size:20px;"></i>
									</div>
									<span>Menu</span>
								</a>
							</div>
							<!-- /Menu Toogle -->
						</div>
					</div>
					<!-- /RIGHT NAV -->
					<!-- row -->
				</div>
				<!-- container -->
			</div>
			<!-- /MAIN HEADER -->
	</header>
	<!-- /HEADER -->


	<?php if (!isset($clean_header) || !$clean_header): ?>
		<nav id='navigation'>
			<!-- container -->

			<div class="container" id="get_category_home">
				<div id="responsive-nav">

					<ul class="main-nav nav navbar-nav">
						<li class="active"><a href="index.php">Home</a></li>
						<li class="category" cid="1"><a href="store.php">Electronics</a></li>
						<li class="category" cid="2"><a href="store.php">Ladies Wears</a></li>
						<li class="category" cid="3"><a href="store.php">Mens Wear</a></li>
						<li class="category" cid="4"><a href="store.php">Kids Wear</a></li>
						<li class="category" cid="5"><a href="store.php">Furnitures</a></li>
						<li class="category" cid="6"><a href="store.php">Home Appliances</a></li>
						<li class="category" cid="7"><a href="store.php">Sports</a></li>

					</ul>

				</div>
			</div>
			<!-- /container -->
		</nav>
	<?php endif; ?>


	<!-- NAVIGATION -->



	<!-- Location Modal -->
	<div class="modal fade" id="locationModal" role="dialog">
		<div class="modal-dialog" style="width: 450px; max-width: 95%;">
			<div class="modal-content" style="border-radius: 12px; padding: 10px;">
				<div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
					<button type="button" class="close" data-dismiss="modal"
						style="font-size: 28px; font-weight: 300;">&times;</button>
					<h4 class="modal-title" style="font-weight: 600; font-size: 18px;">Select delivery address</h4>
				</div>
				<div class="modal-body">
					<div class="form-group" style="position: relative; margin-top: 5px;">
						<i class="fa fa-search" onclick="saveLocation()"
							style="position: absolute; left: 15px; top: 15px; color: #777; cursor: pointer; z-index: 5;"></i>
						<input type="text" class="form-control" id="loc-pincode"
							placeholder="Search by area, street name, pin code"
							style="border-radius: 8px; padding-left: 40px; height: 45px; box-shadow: none; border-color: #ddd;">
					</div>

					<div onclick="getCurrentLocation()"
						style="display: flex; align-items: center; padding: 15px 0; cursor: pointer; transition: background-color 0.2s; border-radius: 8px;">
						<div
							style="background: rgba(40, 116, 240, 0.05); width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; margin-right: 15px; border: 1px solid #ebf0fa;">
							<i id="curr-loc-icon" class="fa fa-crosshairs" style="color: #2874f0; font-size: 20px;"></i>
						</div>
						<div>
							<div id="curr-loc-text" style="color: #2874f0; font-weight: 600; font-size: 15px;">Use my
								current location</div>
							<div style="color: #777; font-size: 13px;">Allow access to location</div>
						</div>
					</div>

					<hr style="border-top: 1px dashed #ddd; margin: 15px 0;">

					<div style="margin-top: 20px;">
						<h5 style="font-weight: 600; margin-bottom: 15px; color: #333; font-size: 15px;">Saved addresses
						</h5>

						<?php if (isset($_SESSION['uid'])): ?>
							<div style="display: flex; align-items: center;">
								<i class="fa fa-map-marker"
									style="font-size: 20px; color: #2874f0; margin-right: 15px;"></i>
								<div>
									<a href="myprofile.php" style="color: #2874f0; font-weight: 500;">View saved addresses
										in profile</a>
								</div>
							</div>
						<?php else: ?>
							<div style="display: flex; align-items: center;">
								<i class="fa fa-user-circle-o"
									style="font-size: 24px; color: #2874f0; margin-right: 15px;"></i>
								<div>
									<a href="signin_form.php"
										style="color: #2874f0; font-weight: 500; font-size: 14px;">Login to see saved
										addresses</a>
								</div>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</div>
