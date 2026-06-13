<?php
include_once 'db.php';

$product_id = isset($_GET['p']) ? intval($_GET['p']) : 0;
if ($product_id <= 0) {
	header("Location: store.php");
	exit();
}

$product_check = mysqli_query($con, "SELECT product_id FROM products WHERE product_id = $product_id LIMIT 1");
if (!$product_check || mysqli_num_rows($product_check) === 0) {
	header("Location: store.php");
	exit();
}

include "header.php";
?>
<!-- /BREADCRUMB -->
<script type="text/javascript">
	jQuery(document).ready(function ($) {
		$(".scroll").click(function (event) {
			event.preventDefault();
			$('html,body').animate({ scrollTop: $(this.hash).offset().top }, 900);
		});
	});
</script>
<script>

	(function (global) {
		if (typeof (global) === "undefined") {
			throw new Error("window is undefined");
		}
		var _hash = "!";
		var noBackPlease = function () {
			global.location.href += "#";
			// making sure we have the fruit available for juice....
			// 50 milliseconds for just once do not cost much (^__^)
			global.setTimeout(function () {
				global.location.href += "!";
			}, 50);
		};
		// Earlier we had setInerval here....
		global.onhashchange = function () {
			if (global.location.hash !== _hash) {
				global.location.hash = _hash;
			}
		};
		global.onload = function () {
			noBackPlease();
			// disables backspace on page except on input fields and textarea..
			document.body.onkeydown = function (e) {
				var elm = e.target.nodeName.toLowerCase();
				if (e.which === 8 && (elm !== 'input' && elm !== 'textarea')) {
					e.preventDefault();
				}
				// stopping event bubbling up the DOM tree..
				e.stopPropagation();
			};
		};
	})(window);
</script>

<!-- SECTION -->
<div class="section main main-raised">
	<!-- container -->
	<div class="container">
		<!-- row -->
		<div class="row">
			<!-- Product main img -->

			<?php
			include_once 'db.php';

			$sql = " SELECT *, P.product_qty FROM products AS P,categories AS C WHERE P.product_cat = C.cat_id  AND P.product_id = '$product_id'";
			if (!$con) {
				die("Connection failed: " . mysqli_connect_error());
			}
			$result = mysqli_query($con, $sql);
			if (mysqli_num_rows($result) > 0) {
				while ($row = mysqli_fetch_assoc($result)) {
					echo '
									
                                    
                                
                                <div class="col-md-5 col-md-push-2">
                                <div id="product-main-img">
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image'] . '" alt="">
                                    </div>
                                    ' . (!empty($row['product_image2']) ? '
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image2'] . '" alt="">
                                    </div>' : '') . '
                                    ' . (!empty($row['product_image3']) ? '
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image3'] . '" alt="">
                                    </div>' : '') . '
                                </div>
                            </div>
                                
                                <div class="col-md-2  col-md-pull-5">
                                <div id="product-imgs">
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image'] . '" alt="">
                                    </div>
                                    ' . (!empty($row['product_image2']) ? '
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image2'] . '" alt="">
                                    </div>' : '') . '
                                    ' . (!empty($row['product_image3']) ? '
                                    <div class="product-preview">
                                        <img src="product_images/' . $row['product_image3'] . '" alt="">
                                    </div>' : '') . '
                                </div>
                            </div>

                                 
									';

					?>
					<!-- FlexSlider -->

					<?php
					echo '
									
                                    
                                   
							<div class="col-md-5">
								<div class="product-details">
									<h2 class="product-name">' . $row['product_title'] . '</h2>
									<div id = "rating_reviews">
										
									</div>
									<div>
										<h3 class="product-price">' . rupee($row['product_price']) . ' <del class="product-old-price">' . rupee($row['product_price'] * 1.25) . '</del></h3>
										<span class="product-available">' . ($row['product_qty'] > 0 ? 'In Stock ('.$row['product_qty'].')' : '<span style="color:red;">Out of Stock</span>') . '</span>
									</div>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

									<div class="product-options">
										<label>
											Size
											<select class="input-select">
												<option value="0">X</option>
											</select>
										</label>
										<label>
											Color
											<select class="input-select">
												<option value="0">Red</option>
											</select>
										</label>
									</div>

									<div class="add-to-cart">
										<div class="qty-label">
											Qty
											<div class="input-number">
												
												<span class="qty-up">+</span>
												<span class="qty-down">-</span>
											</div>
										</div>
										<div class="btn-group" style="margin-left: 25px; margin-top: 15px">
										';
					if ($row['product_qty'] > 0) {
						echo '<button class="add-to-cart-btn" pid="' . $row['product_id'] . '"  id="product" ><i class="fa fa-shopping-cart"></i> add to cart</button>';
					} else {
						echo '<button class="add-to-cart-btn" style="background: #ccc; cursor: not-allowed;" disabled><i class="fa fa-ban"></i> Out of Stock</button>';
					}
					echo '
										</div>
										
										
									</div>


									<ul class="product-links">
										<li>Category:</li>
										<li><a href="#">' . $row["cat_title"] . '</a></li>
									</ul>

									<ul class="product-links">
								<li>Share:</li>
								<li><a href="#"><i class="fa fa-facebook"></i></a></li>
								<li><a href="#"><i class="fa fa-twitter"></i></a></li>
								<li><a href="#"><i class="fa fa-google-plus"></i></a></li>
								<li><a href="#"><i class="fa fa-envelope"></i></a></li>
							</ul>

								<div class="delivery-details-box" style="margin-top:20px; border:1px solid #e0e0e0; border-radius:8px; padding:16px; background:#fff;">
									<h5 style="font-weight:700; margin-bottom:12px; font-size:15px;">Delivery details</h5>
									<div style="background:#f0f5ff; border-radius:6px; padding:10px 14px; margin-bottom:10px; display:flex; align-items:center; gap:10px;">
										<i class="fa fa-map-marker" style="color:#555; font-size:16px;"></i>
										<span style="color:#555; font-size:13px;">Location not set &nbsp;<a href="#" style="color:#2874f0; font-weight:600;">Select delivery location &rsaquo;</a></span>
									</div>
									<div style="display:flex; align-items:flex-start; gap:12px; padding:8px 0; border-bottom:1px solid #f0f0f0;">
										<i class="fa fa-truck" style="color:#444; font-size:17px; margin-top:3px;"></i>
										<div>
											<strong style="font-size:13px;" id="delivery-date-label">Calculating...</strong><br>
											<span style="color:#ff6000; font-size:12px; font-weight:600;">Order in <span id="delivery-countdown">--:--:--</span></span>
										</div>
									</div>
									<div style="display:flex; align-items:flex-start; gap:12px; padding-top:10px;">
										<i class="fa fa-building" style="color:#444; font-size:17px; margin-top:3px;"></i>
										<div>
											<span style="font-size:13px;">Fulfilled by <strong>RetailNet</strong></span><br>
											<span style="font-size:12px; color:#777;">4.3 &#9733; &bull; 10 years with JAYVEER</span>
										</div>
									</div>
								</div>

						</div>
					</div>
					';
					?> 
					<script>
					(function() {
						var deliveryDate = new Date();
						deliveryDate.setDate(deliveryDate.getDate() + 7);
						var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
						var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
						var el = document.getElementById("delivery-date-label");
						if(el) el.textContent = "Delivery by " + deliveryDate.getDate() + " " + months[deliveryDate.getMonth()] + ", " + days[deliveryDate.getDay()];

						function updateCountdown() {
							var now = new Date();
							var midnight = new Date();
							midnight.setHours(23, 59, 59, 0);
							var diff = Math.max(0, midnight - now);
							var h = Math.floor(diff / 3600000);
							var m = Math.floor((diff % 3600000) / 60000);
							var s = Math.floor((diff % 60000) / 1000);
							var el2 = document.getElementById("delivery-countdown");
							if(el2) el2.textContent = String(h).padStart(2,"0") + "h " + String(m).padStart(2,"0") + "m " + String(s).padStart(2,"0") + "s";
						}
						updateCountdown();
						setInterval(updateCountdown, 1000);
					})();
					</script>
					<?php
							echo '</div>
							';
					$_SESSION['product_id'] = $row['product_id'];
				}
			}
			?>


			<div class="col-md-12">
				<div id="product-tab">
					<!-- product tab nav -->
					<ul class="tab-nav">
						<?php
						include_once 'db.php';
						$product_id = isset($product_id) ? $product_id : intval($_GET['p']);

						$product_query = "SELECT COUNT(*) AS count FROM reviews WHERE product_id='$product_id'";
						$run_query = mysqli_query($con, $product_query);
						$row = mysqli_fetch_array($run_query);
						$reviews_count = $row["count"];
						echo '<li class="active"><a data-toggle="tab" href="#tab3">Reviews (' . $reviews_count . ')</a></li>';
						?>
						<li><a data-toggle="tab" href="#tab1">Description</a></li>
						<li><a data-toggle="tab" href="#tab2">Details</a></li>

					</ul>
					<!-- /product tab nav -->

					<!-- product tab content -->
					<div class="tab-content">
						<!-- tab3  -->
						<div id="tab3" class="tab-pane fade in active">
							<div class="row">
								<!-- Rating -->
								<div class="col-md-9" id="review_action" pid='<?php echo "$product_id"; ?>'></div>

								<!-- Review Form -->
								<div class="col-md-3 mainn">
									<div id="review-form">
										<form class="review-form" onsubmit="return false" id="review_form" required>
											<input class="input" type="text" name="name" placeholder="Your Name"
												required>
											<input class="input" type="email" name="email" placeholder="Your Email"
												required>
											<?php
											$product_id = isset($product_id) ? $product_id : intval($_GET['p']);
											echo '<input  name="product_id" value="' . $product_id . '" hidden required>'
												?>

											<textarea class="input" name="review" placeholder="Your Review"></textarea>
											<div class="input-rating">
												<span>Your Rating: </span>
												<div class="stars">
													<input id="star5" name="rating" value="5" type="radio"
														required><label for="star5"></label>
													<input id="star4" name="rating" value="4" type="radio"
														required><label for="star4"></label>
													<input id="star3" name="rating" value="3" type="radio"
														required><label for="star3"></label>
													<input id="star2" name="rating" value="2" type="radio"
														required><label for="star2"></label>
													<input id="star1" name="rating" value="1" type="radio"
														required><label for="star1"></label>
												</div>
											</div>
											<button class="primary-btn" name="review_submit">Submit</button>
										</form>
									</div>
								</div>
								<!-- /Review Form -->
							</div>
						</div>
						<!-- /tab3  -->

						<!-- tab1  -->
						<div id="tab1" class="tab-pane fade">
							<div class="row">
								<div class="col-md-12">
									<p>Welcome to JAYVEER Store, your one-stop destination for the latest
										products at affordable prices. We provide a wide range of items including
										electronics, fashion, accessories, and daily essentials. Our goal is to deliver
										high-quality products with fast and secure delivery service.</p>
								</div>
							</div>
						</div>
						<!-- /tab1  -->

						<!-- tab2  -->
						<div id="tab2" class="tab-pane fade">
							<div class="row">
								<div class="col-md-12">
									<p>Customer satisfaction is our top priority. We offer secure payment options, easy
										returns, and 24/7 customer support to ensure a smooth shopping experience. With
										our simple interface and quick checkout system, shopping becomes easy and
										convenient for everyone.</p>
								</div>
							</div>
						</div>
						<!-- /tab2  -->
					</div>
					<!-- /product tab content  -->
				</div>
			</div>
			<!-- /product tab -->
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
</div>
<!-- /SECTION -->

<!-- Section -->
<div class="section main main-raised">
	<!-- container -->
	<div class="container">
		<!-- row -->
		<div class="row flex-row">

			<div class="col-md-12">
				<div class="section-title text-center">
					<h3 class="title">Related Products</h3>

				</div>
			</div>

			<?php
			include 'db.php';
			$product_id = isset($product_id) ? $product_id : intval($_GET['p']);

			$product_query = "SELECT * FROM products  JOIN categories ON product_cat = cat_id WHERE product_id != $product_id LIMIT 4";
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
<div class='col-md-3 col-xs-6'>
								<div class='product'>
									<a href='product.php?p=$pro_id'>
										<div class='product-img'>
											<img src='$img_src' style='max-height: 170px;' alt=''>
											<div class='product-label'>
												<span class='sale'>-30%</span>
												<span class='new'>NEW</span>
											</div>
										</div>
									</a>
									<div class='product-body'>
										<p class='product-category'>$cat_name</p>
										<h3 class='product-name header-cart-item-name'><a href='product.php?p=$pro_id'>$pro_title</a></h3>
										<h4 class='product-price header-cart-item-info'>" . rupee($pro_price) . " <del class='product-old-price'>" . rupee($pro_price * 1.25) . "</del></h4>
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
							</div>
			";
				}
				;

			}
			?>
			<!-- product -->

			<!-- /product -->

		</div>
		<!-- /row -->

	</div>
	<!-- /container -->
</div>
<!-- /Section -->

<!-- NEWSLETTER -->

<!-- /NEWSLETTER -->

<!-- FOOTER -->
<?php
include "newsletter.php";
include "footer.php";

?>
