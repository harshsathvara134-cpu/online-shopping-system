<div class="main main-raised">
	<div class="container mainn-raised">

		<div id="myCarousel" class="carousel slide" data-ride="carousel">
			<!-- Indicators -->


			<!-- Wrapper for slides -->
			<div class="carousel-inner">

				<div class="item active">
					<img src="img/banner3.jpg" alt="Los Angeles" style="width:100%;">

				</div>

				<div class="item">
					<img src="img/banner2.jpg" style="width:100%;">

				</div>

				<div class="item">
					<img src="img/banner4.jpg" alt="New York" style="width:100%;">

				</div>
				<div class="item">
					<img src="img/banner1.jpg" alt="New York" style="width:100%;">

				</div>
				<div class="item">
					<img src="img/banner3.jpg" alt="New York" style="width:100%;">

				</div>

			</div>

			<!-- Left and right controls -->
			<a class="left carousel-control _26sdfg" href="#myCarousel" data-slide="prev">
				<span class="glyphicon glyphicon-chevron-left"></span>
				<span class="sr-only">Previous</span>
			</a>
			<a class="right carousel-control _26sdfg" href="#myCarousel" data-slide="next">
				<span class="glyphicon glyphicon-chevron-right"></span>
				<span class="sr-only">Next</span>
			</a>
		</div>
	</div>



	<!-- SECTION -->
	<div class="section mainn mainn-raised">


		<!-- container -->
		<div class="container">

			<!-- row -->
			<div class="row">
				<!-- shop -->
				<div class="col-md-3 col-xs-6">
					<a href="store.php?search=laptop">
						<div class="shop">
							<div class="shop-img">
								<img src="./img/shop0.png" alt="Laptop collection">
							</div>
							<div class="shop-body">
								<h3>Laptop<br>Collection</h3>
								<a href="store.php?search=laptop" class="cta-btn">Shop now <i
										class="fa fa-arrow-circle-right"></i></a>
							</div>
						</div>
					</a>
				</div>
				<div class="col-md-3 col-xs-6">
					<a href="store.php?search=mobile">
						<div class="shop">
							<div class="shop-img">
								<img src="./img/product02 (2).png" alt="Smartphone collection">
							</div>
							<div class="shop-body">
								<h3>Mobile<br>Collection</h3>
								<a href="store.php?search=mobile" class="cta-btn">Shop now <i
										class="fa fa-arrow-circle-right"></i></a>
							</div>
						</div>
					</a>
				</div>
				<div class="col-md-3 col-xs-6">
					<a href="store.php?search=dress">
						<div class="shop">
							<div class="shop-img">
								<img src="./img/dress_shirt_PNG.png" alt="Fashion collection">
							</div>
							<div class="shop-body">
								<h3>Fashion<br>Collection</h3>
								<a href="store.php?search=dress" class="cta-btn">Shop now <i
										class="fa fa-arrow-circle-right"></i></a>
							</div>
						</div>
					</a>
				</div>
				<div class="col-md-3 col-xs-6">
					<a href="store.php">
						<div class="shop">
							<div class="shop-img">
								<img src="./img/shop05.png" alt="New collection">
							</div>
							<div class="shop-body">
								<h3>New<br>Collection</h3>
								<a href="store.php" class="cta-btn">Shop now <i
										class="fa fa-arrow-circle-right"></i></a>
							</div>
						</div>
					</a>
				</div>
				<!-- /shop -->
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /SECTION -->



	<!-- SECTION -->
	<div class="section">
		<!-- container -->
		<div class="container">
			<!-- row -->
			<div class="row">

				<!-- section title -->
				<div class="col-md-12">
					<div class="section-title">
						<h3 class="title">New Products</h3>
						<div class="section-nav">
							<ul class="section-tab-nav tab-nav">
								<li class="active"><a data-toggle="tab" href="#tab1">Laptops</a></li>
								<li><a data-toggle="tab" href="#tab1">Smartphones</a></li>
								<li><a data-toggle="tab" href="#tab1">Cameras</a></li>
								<li><a data-toggle="tab" href="#tab1">Accessories</a></li>
							</ul>
						</div>
					</div>
				</div>
				<!-- /section title -->

				<!-- Products tab & slick -->
				<div class="col-md-12">
					<div class="products-tabs">
						<!-- tab -->
						<div id="tab1" class="tab-pane active">
							<div class="products-slick" data-nav="#slick-nav-1">

									<?php
									include_once 'db.php';


									$product_query = "SELECT * FROM products 
JOIN categories ON products.product_cat = categories.cat_id 
ORDER BY product_id DESC LIMIT 10";
									$run_query = mysqli_query($con, $product_query);
									if (mysqli_num_rows($run_query) > 0) {

										while ($row = mysqli_fetch_array($run_query)) {
											$pro_id = $row['product_id'];
											$pro_cat = $row['product_cat'];
											$pro_brand = $row['product_brand'];
											$pro_title = $row['product_title'];
											$pro_price = $row['product_price'];
											$pro_image = $row['product_image'];

											$cat_name = $row["cat_title"];

											// Image path check
											$img_src = "product_images/$pro_image";
											if(!file_exists($img_src)) $img_src = "img/$pro_image";

											echo "
								<div class='product'>
									<div class='product-img'><a href='product.php?p=$pro_id'>
											<img src='$img_src' alt=''>
											<div class='product-label'>
												<span class='sale'>-30%</span>
												<span class='new'>NEW</span>
											</div>
										</a></div>
									<div class='product-body'>
										<p class='product-category'>$cat_name</p>
										<h3 class='product-name header-cart-item-name'><a href='product.php?p=$pro_id'>$pro_title</a></h3>
										<h4 class='product-price header-cart-item-info'>".rupee($pro_price)."<del class='product-old-price'>".rupee($pro_price * 1.2, true)."</del></h4>
										<div class='product-rating'>";
											$rating_query = "SELECT ROUND(AVG(rating),1) AS avg_rating  FROM reviews WHERE product_id='$pro_id'";
											$run_review_query = mysqli_query($con, $rating_query);
											$review_row = mysqli_fetch_array($run_review_query);

											if ($review_row && $review_row["avg_rating"] > 0) {
												$avg_count = $review_row["avg_rating"];
												$i = 1;
												while ($i <= round($avg_count)) {
													$i++;
													echo '
													<i class="fa fa-star"></i>';
												}
												$i = 1;
												while ($i <= 5 - round($avg_count)) {
													$i++;
													echo '
													<i class="fa fa-star-o empty"></i>';
												}

											}
										echo "</div>
									</div>
								</div>
			";
										}
										;

									}
									?>
									<!-- product -->


									<!-- /product -->


									<!-- /product -->
								</div>
								<div id="slick-nav-1" class="products-slick-nav"></div>
							</div>
							<!-- /tab -->
					</div>
				</div>
				<!-- Products tab & slick -->
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /SECTION -->

	<!-- HOT DEAL SECTION -->
	<div id="hot-deal" class="section mainn mainn-raised">
		<!-- container -->
		<div class="container">
			<!-- row -->
			<div class="row">
				<div class="col-md-12">
					<div class="hot-deal">
						<ul class="hot-deal-countdown">
							<li>
								<div>
									<h3>02</h3>
									<span>Days</span>
								</div>
							</li>
							<li>
								<div>
									<h3>10</h3>
									<span>Hours</span>
								</div>
							</li>
							<li>
								<div>
									<h3>34</h3>
									<span>Mins</span>
								</div>
							</li>
							<li>
								<div>
									<h3>60</h3>
									<span>Secs</span>
								</div>
							</li>
						</ul>
						<h2 class="text-uppercase">hot deal this week</h2>
						<p>New Collection Up to 50% OFF</p>
						<a class="primary-btn cta-btn" href="store.php">Shop now</a>
					</div>
				</div>
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /HOT DEAL SECTION -->
    <script>
        // Hot Deal Countdown
        function updateCountdown() {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 2); // Set to 2 days from now
            endDate.setHours(23, 59, 59);

            const timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = endDate - now;

                if (distance < 0) {
                    clearInterval(timer);
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const counts = document.querySelectorAll('.hot-deal-countdown li h3');
                if (counts.length >= 4) {
                    counts[0].innerHTML = days < 10 ? '0' + days : days;
                    counts[1].innerHTML = hours < 10 ? '0' + hours : hours;
                    counts[2].innerHTML = minutes < 10 ? '0' + minutes : minutes;
                    counts[3].innerHTML = seconds < 10 ? '0' + seconds : seconds;
                }
            }, 1000);
        }
        document.addEventListener('DOMContentLoaded', updateCountdown);
    </script>


	<!-- SECTION -->
	<div class="section">
		<!-- container -->
		<div class="container">
			<!-- row -->
			<div class="row">

				<!-- section title -->
				<div class="col-md-12">
					<div class="section-title">
						<h3 class="title">Top selling</h3>
						<div class="section-nav">
							<ul class="section-tab-nav tab-nav">
								<li class="active"><a data-toggle="tab" href="#tab2">Formals</a></li>
								<li><a data-toggle="tab" href="#tab2">Shirts</a></li>
								<li><a data-toggle="tab" href="#tab2">T-Shirts</a></li>
								<li><a data-toggle="tab" href="#tab2">Pants</a></li>
							</ul>
						</div>
					</div>
				</div>
				<!-- /section title -->

				<!-- Products tab & slick -->
				<div class="col-md-12">
					<div class="products-tabs">
						<!-- tab -->
						<div id="tab2" class="tab-pane fade in active">
							<div class="products-slick" data-nav="#slick-nav-2">
									<!-- product -->
									<?php
									include_once 'db.php';


									$product_query = "SELECT p.*, c.cat_title, COALESCE(SUM(op.qty), 0) as total_sold
									FROM products p
									JOIN categories c ON p.product_cat = c.cat_id
									LEFT JOIN order_products op ON p.product_id = op.product_id
									GROUP BY p.product_id
									ORDER BY total_sold DESC, p.product_id DESC
									LIMIT 8";
									$run_query = mysqli_query($con, $product_query);
									if (mysqli_num_rows($run_query) > 0) {

										while ($row = mysqli_fetch_array($run_query)) {
											$pro_id = $row['product_id'];
											$pro_cat = $row['product_cat'];
											$pro_brand = $row['product_brand'];
											$pro_title = $row['product_title'];
											$pro_price = $row['product_price'];
											$pro_image = $row['product_image'];

											$cat_name = $row["cat_title"];

											// Image path check
											$img_src = "product_images/$pro_image";
											if(!file_exists($img_src)) $img_src = "img/$pro_image";

											echo "
								<div class='product'>
									<div class='product-img'><a href='product.php?p=$pro_id'>
											<img src='$img_src' alt=''>
											<div class='product-label'>
												<span class='sale'>-30%</span>
												<span class='new'>NEW</span>
											</div>
										</a></div>
									<div class='product-body'>
										<p class='product-category'>$cat_name</p>
										<h3 class='product-name header-cart-item-name'><a href='product.php?p=$pro_id'>$pro_title</a></h3>
										<h4 class='product-price header-cart-item-info'>".rupee($pro_price)."<del class='product-old-price'>".rupee($pro_price * 1.2, true)."</del></h4>
										<div class='product-rating'>";
		$rating_query = "SELECT ROUND(AVG(rating),1) AS avg_rating FROM reviews WHERE product_id='$pro_id'";
		$run_review_query = mysqli_query($con, $rating_query);
		$review_row = mysqli_fetch_array($run_review_query);
		if ($review_row && $review_row["avg_rating"] > 0) {
			$avg_count = $review_row["avg_rating"];
			$i = 1;
			while ($i <= round($avg_count)) {
				$i++;
				echo '
													<i class="fa fa-star"></i>';
			}
			$i = 1;
			while ($i <= 5 - round($avg_count)) {
				$i++;
				echo '
													<i class="fa fa-star-o empty"></i>';
			}

		}
		echo "</div>
									</div>
								</div>
			";
										}
										;

									}
									?>

									<!-- /product -->
								</div>
								<div id="slick-nav-2" class="products-slick-nav"></div>
							</div>
							<!-- /tab -->
					</div>
				</div>
				<!-- Products tab & slick -->
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /SECTION -->

	<!-- SECTION -->
	<div class="section">
		<!-- container -->
		<div class="container">
			<!-- row -->
			<div class="row">
				<div class="col-md-3 col-xs-6">
					<div class="section-title">
						<h4 class="title">Top Selling</h4>
						<div class="section-nav">
							<div id="slick-nav-3" class="products-slick-nav"></div>
						</div>
					</div>
					<div class="products-widget-slick" data-nav="#slick-nav-3">
						<div id="get_product_home"></div>
					</div>
				</div>

				<div class="col-md-3 col-xs-6">
					<div class="section-title">
						<h4 class="title">New Arrivals</h4>
						<div class="section-nav">
							<div id="slick-nav-4" class="products-slick-nav"></div>
						</div>
					</div>
					<div class="products-widget-slick" data-nav="#slick-nav-4">
						<div id="get_product_home2"></div>
					</div>
				</div>

				<div class="col-md-3 col-xs-6">
					<div class="section-title">
						<h4 class="title">Featured</h4>
						<div class="section-nav">
							<div id="slick-nav-5" class="products-slick-nav"></div>
						</div>
					</div>
					<div class="products-widget-slick" data-nav="#slick-nav-5">
						<div id="get_product_home3"></div>
					</div>
				</div>

				<div class="col-md-3 col-xs-6">
					<div class="section-title">
						<h4 class="title">Hot Deals</h4>
						<div class="section-nav">
							<div id="slick-nav-6" class="products-slick-nav"></div>
						</div>
					</div>
					<div class="products-widget-slick" data-nav="#slick-nav-6">
						<div id="get_product_home4"></div>
					</div>
				</div>

				<div class="clearfix visible-sm visible-xs"></div>

			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /SECTION -->
</div>
