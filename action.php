<?php
require_once __DIR__ . "/session_bootstrap.php";
$ip_add = getenv("REMOTE_ADDR");
include "db.php";

if (isset($_POST["category"])) {
	$category_query = "SELECT * FROM categories";

	$run_query = mysqli_query($con, $category_query) or die(mysqli_error($con));
	echo "
		
            
            <div class='aside'>
							<h3 class='aside-title'>Categories</h3>
							<div class='btn-group-vertical'>
	";
	if (mysqli_num_rows($run_query) > 0) {
		$i = 1;
		while ($row = mysqli_fetch_array($run_query)) {

			$cid = $row["cat_id"];
			$cat_name = $row["cat_title"];
			$sql = "SELECT COUNT(*) AS count_items FROM products WHERE product_cat='$cid'";
			$query = mysqli_query($con, $sql);
			$row = mysqli_fetch_array($query);
			$count = $row["count_items"];

			echo "
					
                    <div type='button' class='btn navbar-btn category' cid='$cid'>
									
									<a href='#'>
										<span  ></span>
										$cat_name
										<small class='qty'>($count)</small>
									</a>
								</div>
                    
			";

		}


		echo "</div>";
	}
}
if (isset($_POST["brand"])) {
	$brand_query = "SELECT * FROM brands";
	$run_query = mysqli_query($con, $brand_query);
	echo "
		<div class='aside'>
							<h3 class='aside-title'>Brand</h3>
							<div class='btn-group-vertical'>
	";
	if (mysqli_num_rows($run_query) > 0) {
		$i = 1;
		while ($row = mysqli_fetch_array($run_query)) {

			$bid = $row["brand_id"];
			$brand_name = $row["brand_title"];
			$sql = "SELECT COUNT(*) AS count_items FROM products WHERE product_brand='$bid'";
			$query = mysqli_query($con, $sql);
			$row = mysqli_fetch_array($query);
			$count = $row["count_items"];
			$i++;
			echo "
					
                    
                    <div type='button' class='btn navbar-btn selectBrand' bid='$bid'>
									
									<a href='#'>
										<span ></span>
										$brand_name
										<small >($count)</small>
									</a>
								</div>
			";
		}
		echo "</div>";
	}
}
if (isset($_POST["page"])) {

	if (isset($_POST["cid"])) {
		$cid = $_POST["cid"];
	} else {
		$cid = 0;
	}

	if ($cid == 0) {
		$sql = "SELECT * FROM products";
	} else {
		$sql = "SELECT * FROM products WHERE product_cat='$cid'";
	}
	$run_query = mysqli_query($con, $sql);
	$count = mysqli_num_rows($run_query);
	$pageno = ceil($count / 9);
	for ($i = 1; $i <= $pageno; $i++) {
		echo "
			<li><a href='#product-row' page='$i' id='page' cid='$cid'  class='active'>$i</a></li>
            
            
		";
	}
}
if (isset($_POST["getProduct"])) {
	$limit = 9;
	if (isset($_POST["setPage"])) {
		$pageno = $_POST["pageNumber"];
		$start = ($pageno * $limit) - $limit;
	} else {
		$start = 0;
	}
	$cat_id = 0;

	if (isset($_POST["cid"])) {
		$cat_id = $_POST["cid"];
	}

	if (isset($_POST["cat_id"])) {
		$cat_id = $_POST["cat_id"];
	}

	if ($cat_id == 0) {
		$product_query = "SELECT * FROM products,categories WHERE product_cat=cat_id ORDER BY product_id DESC LIMIT $start,$limit";
	} else {
		$product_query = "SELECT * FROM products,categories WHERE product_cat='$cat_id' AND product_cat=cat_id ORDER BY product_id DESC LIMIT $start,$limit";
	}
	$run_query = mysqli_query($con, $product_query);
	if (mysqli_num_rows($run_query) > 0) {
		while ($row = mysqli_fetch_array($run_query)) {
			$pro_id = $row['product_id'];
			$pro_cat = $row['product_cat'];
			$pro_brand = $row['product_brand'];
			$pro_title = $row['product_title'];
			$pro_price = $row['product_price'];
			$pro_image = $row['product_image'];
			$pro_stock = $row['product_qty'];

			$cat_name = $row["cat_title"];
										// Image path check
										$img_src = "product_images/$pro_image";
										if(!file_exists($img_src)) $img_src = "img/$pro_image";

										echo "
<div class='col-md-4 col-xs-6'>
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
			if ($review_row['avg_rating'] > 0) {
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
	}
}


if (isset($_POST["get_seleted_Category"]) || isset($_POST["selectBrand"]) || isset($_POST["search"]) || isset($_POST["priceFilter"])) {

	if (isset($_POST["get_seleted_Category"])) {
		$id = intval($_POST["cat_id"]);
		$sql = "SELECT * FROM products,categories WHERE product_cat = '$id' AND product_cat=cat_id ";

	} else if (isset($_POST["selectBrand"])) {
		$id = intval($_POST["brand_id"]);
		$sql = "SELECT * FROM products,categories WHERE product_brand = '$id' AND product_cat=cat_id ORDER BY product_id DESC";
	} else if (isset($_POST["priceFilter"])) {
		$min = intval($_POST["price_min"]);
		$max = intval($_POST["price_max"]);
		$sql = "SELECT * FROM products,categories WHERE product_price BETWEEN $min AND $max AND product_cat=cat_id";
	} else {

		$keyword = mysqli_real_escape_string($con,$_POST["keyword"]);
		$sql = "SELECT * FROM products,categories WHERE product_cat=cat_id AND product_keywords LIKE '%$keyword%' ORDER BY product_id DESC";

	}

	$run_query = mysqli_query($con, $sql);
	while ($row = mysqli_fetch_array($run_query)) {
		$pro_id = $row['product_id'];
		$pro_cat = $row['product_cat'];
		$pro_brand = $row['product_brand'];
		$pro_title = $row['product_title'];
		$pro_price = $row['product_price'];
		$pro_image = $row['product_image'];
		$pro_stock = $row['product_qty'];
		$cat_name = $row["cat_title"];

										// Image path check
										$img_src = "product_images/$pro_image";
										if(!file_exists($img_src)) $img_src = "img/$pro_image";

										echo "
<div class='col-md-4 col-xs-6'>
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
							</div>
			";
	}
}



if (isset($_POST["addToCart"])) {

	$p_id = isset($_POST["proId"]) ? intval($_POST["proId"]) : 0;
	if ($p_id <= 0) {
		echo "
			<div class='alert alert-danger'>
					<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
					<b>Invalid product selected.</b>
			</div>";
		exit();
	}

	/* Check stock before adding to cart */
	$stock_sql = "SELECT product_qty FROM products WHERE product_id = $p_id";
	$stock_query = mysqli_query($con, $stock_sql);
	$stock_row = mysqli_fetch_array($stock_query);
	if (!$stock_row || intval($stock_row['product_qty']) <= 0) {
		echo "
			<div class='alert alert-danger'>
					<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
					<b>Sorry, this product is currently Out of Stock!</b>
			</div>";
		exit();
	}


	if (isset($_SESSION["uid"])) {

		$user_id = $_SESSION["uid"];

		$sql = "SELECT * FROM cart WHERE p_id = '$p_id' AND user_id = '$user_id'";
		$run_query = mysqli_query($con, $sql);
		$count = mysqli_num_rows($run_query);
		if ($count > 0) {
			echo "
				<div class='alert alert-warning'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>Product is already added into the cart Continue Shopping..!</b>
				</div>
			";//not in video
		} else {
			$sql = "INSERT INTO `cart`
			(`p_id`, `ip_add`, `user_id`, `qty`) 
			VALUES ('$p_id','$ip_add','$user_id','1')";
			if (mysqli_query($con, $sql)) {
				$sql = "DELETE FROM wishlist WHERE p_id = '$p_id' AND user_id = '$_SESSION[uid]'";

				if (mysqli_query($con, $sql)) {
					if (mysqli_affected_rows($con) > 0) {
						echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is removed from wishlist and added to cart</b>
								</div>";
					} else {
						echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is added to cart</b>
								</div>";
					}
				}
			}
		}
	} else {
		$sql = "SELECT id FROM cart WHERE ip_add = '$ip_add' AND p_id = '$p_id' AND user_id = -1";
		$query = mysqli_query($con, $sql);
		if (mysqli_num_rows($query) > 0) {
			echo "
					<div class='alert alert-warning'>
							<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
							<b>Product is already added into the cart Continue Shopping..!</b>
					</div>";
			exit();
		}
		$sql = "INSERT INTO `cart`
			(`p_id`, `ip_add`, `user_id`, `qty`) 
			VALUES ('$p_id','$ip_add','-1','1')";
		if (mysqli_query($con, $sql)) {

			$sql = "DELETE FROM wishlist WHERE p_id = '$p_id' AND ip_add = '$ip_add'";

			if (mysqli_query($con, $sql)) {
				if (mysqli_affected_rows($con) > 0) {
					echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is removed from wishlist and added to cart</b>
								</div>";
				} else {
					echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is added to cart</b>
								</div>";
				}
				exit();
			}
		}

	}

}

if (isset($_POST["addToWishlist"])) {


	$p_id = mysqli_real_escape_string($con, $_POST["proId"]);


	if (isset($_SESSION["uid"])) {

		$user_id = $_SESSION["uid"];

		$sql = "SELECT * FROM wishlist WHERE p_id = '$p_id' AND user_id = '$user_id'";
		$run_query = mysqli_query($con, $sql);
		$count = mysqli_num_rows($run_query);
		if ($count > 0) {
			echo "
				<div class='alert alert-warning'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>Product is already added into the wishlist Continue Shopping..!</b>
				</div>
			";//not in video
		} else {
			$sql = "INSERT INTO `wishlist`
			(`p_id`, `ip_add`, `user_id`) 
			VALUES ('$p_id','$ip_add','$user_id')";
			if (mysqli_query($con, $sql)) {
				$sql = "DELETE FROM cart WHERE p_id = '$p_id' AND user_id = '$_SESSION[uid]'";

				if (mysqli_query($con, $sql)) {
					if (mysqli_affected_rows($con) > 0) {
						echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is removed from cart and added to wishlist</b>
								</div>";
					} else {
						echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is added to wishlist</b>
								</div>";
					}
				}
			}
		}
	} else {
		$sql = "SELECT id FROM wishlist WHERE ip_add = '$ip_add' AND p_id = '$p_id' AND user_id = -1";
		$query = mysqli_query($con, $sql);
		if (mysqli_num_rows($query) > 0) {
			echo "
					<div class='alert alert-warning'>
							<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
							<b>Product is already added into the wishlist Continue Shopping..!</b>
					</div>";
			exit();
		}
		$sql = "INSERT INTO `wishlist`
			(`p_id`, `ip_add`, `user_id`) 
			VALUES ('$p_id','$ip_add','-1')";
		if (mysqli_query($con, $sql)) {
			$sql = "DELETE FROM cart WHERE p_id = '$p_id' AND ip_add = '$ip_add'";

			if (mysqli_query($con, $sql)) {
				if (mysqli_affected_rows($con) > 0) {
					echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is removed from cart and added to wishlist</b>
								</div>";
				} else {
					echo "<div class='alert alert-success'>
										<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
										<b>Product is added to wishlist</b>
								</div>";
				}
				exit();
			}
		}

	}




}
//Count User cart item
if (isset($_POST["count_item"])) {
	//When user is logged in then we will count number of item in cart by using user session id
	if (isset($_SESSION["uid"])) {
		$sql = "SELECT COUNT(*) AS count_item FROM cart WHERE user_id = $_SESSION[uid]";
	} else {
		//When user is not logged in then we will count number of item in cart by using users unique ip address
		$sql = "SELECT COUNT(*) AS count_item FROM cart WHERE ip_add = '$ip_add' AND user_id < 0";
	}
	$query = mysqli_query($con, $sql);
	$row = mysqli_fetch_array($query);
	echo $row["count_item"];
	exit();
}
//Count User cart item
if (isset($_POST["count_Wishlist_item"])) {
	//When user is logged in then we will count number of item in cart by using user session id
	if (isset($_SESSION["uid"])) {
		$sql = "SELECT COUNT(*) AS count_wishlist_item FROM wishlist WHERE user_id = $_SESSION[uid] AND p_id > 0";
	} else {
		//When user is not logged in then we will count number of item in cart by using users unique ip address
		$sql = "SELECT COUNT(*) AS count_wishlist_item FROM wishlist WHERE ip_add = '$ip_add' AND user_id < 0 AND p_id > 0";
	}
	$query = mysqli_query($con, $sql);
	$row = mysqli_fetch_array($query);
	echo $row["count_wishlist_item"];
	exit();
}
//Get Cart Item From Database to Dropdown menu
if (isset($_POST["Common"])) {

	if (isset($_SESSION["uid"])) {
		//When user is logged in this query will execute
		$sql = "SELECT a.product_id,a.product_title,a.product_price,a.product_desc,a.product_image,b.id,b.qty FROM products a,cart b WHERE a.product_id=b.p_id AND b.user_id='$_SESSION[uid]'";
	} else {
		//When user is not logged in this query will execute
		$sql = "SELECT a.product_id,a.product_title,a.product_price,a.product_image,a.product_desc,b.id,b.qty FROM products a,cart b WHERE a.product_id=b.p_id AND b.ip_add='$ip_add' AND b.user_id < 0";
	}
	$query = mysqli_query($con, $sql);
	if (isset($_POST["getSideCartItem"])) {
		$total_price = 0;
		$item_count_unique = 0;
		$total_qty = 0;
		$items_html = "";
		if (mysqli_num_rows($query) > 0) {
			while ($row = mysqli_fetch_array($query)) {
				$item_count_unique++;
				$p_id = $row["product_id"];
				$title = $row["product_title"];
				$price = $row["product_price"];
				$img = $row["product_image"];
				$qty = $row["qty"];
				$total_qty += $qty;
				$total_price += ($price * $qty);

				$items_html .= '
				<div class="side-cart-item">
					<div class="side-cart-item-img-container">
						<img src="product_images/'.$img.'" class="side-cart-item-img">
					</div>
					<div class="side-cart-item-info">
						<h5 class="side-cart-item-title">'.$title.'</h5>
						<div class="side-cart-item-price">'.rupee($price).'</div>
						<div class="side-qty-controls">
							<i class="fa fa-trash side-qty-trash side-remove" remove_id="'.$p_id.'"></i>
							<button class="side-qty-btn side-update" update_id="'.$p_id.'" op="minus">-</button>
							<div class="side-qty-val">'.$qty.'</div>
							<button class="side-qty-btn side-update" update_id="'.$p_id.'" op="plus">+</button>
						</div>
					</div>
				</div>';
			}
			$header_html = '
				<div>Subtotal('.$total_qty.' items)</div>
				<h4>'.rupee($total_price).'</h4>';
		} else {
			$header_html = '<h4>Your cart is empty</h4>';
			$items_html = '<div style="text-align:center; padding:50px 0;">
				<i class="fa fa-shopping-basket" style="font-size:48px; color:#ddd; margin-bottom:15px;"></i>
				<p style="color:#666;">No items in your cart</p>
			</div>';
		}
		
		echo json_encode([
			"header" => $header_html,
			"items" => $items_html
		]);
		exit();
	}

	if (isset($_POST["getCartItem"])) {
		//display cart item in dropdown menu
		if (mysqli_num_rows($query) > 0) {
			$n = 0;
			$total_price = 0;
			while ($row = mysqli_fetch_array($query)) {

				$n++;
				$product_id = $row["product_id"];
				$product_title = $row["product_title"];
				$product_price = $row["product_price"];
				$product_image = $row["product_image"];
				$cart_item_id = $row["id"];
				$qty = $row["qty"];
				$total_price = $total_price + ($product_price * $qty);
				echo '
					
                    
                    <div class="product-widget">
												<div class="product-img">
													<img src="product_images/' . $product_image . '" alt="">
												</div>
												<div class="product-body">
													<h3 class="product-name"><a href="product.php?p=' . $product_id . '">' . $product_title . '</a></h3>
													<h4 class="product-price"><span class="qty">' . $qty . '</span>' . rupee($product_price) . '</h4>
												</div>
												
											</div>'


				;

			}

			echo '<div class="cart-summary">
				    <small class="qty">' . $n . ' Item(s) selected</small>
				    <h5>' . rupee($total_price) . '</h5>
				</div>'
				?>


			<?php

			exit();
		}
	}



	if (isset($_POST["checkOutDetails"])) {
		if (mysqli_num_rows($query) > 0) {
			//display user cart item with "Ready to checkout" button if user is not login
			echo '<div class="main ">
			<div class="table-responsive">
			<form method="post" action="login_form.php">
			
	               <table id="cart" class="table table-hover table-condensed" id="">
    				<thead>
						<tr>
							<th style="width:40%">Product</th>
							<th style="width:15%">Price</th>
							<th style="width:8%">Quantity</th>
							<th style="width:15%" class="text-center">Subtotal</th>
							<th style="width:10%"></th>
						</tr>
					</thead>
					<tbody>
                    ';
			$n = 0;
			while ($row = mysqli_fetch_array($query)) {
				$n++;
				$product_id = $row["product_id"];
				$product_title = $row["product_title"];
				$product_price = $row["product_price"];
				$product_desc = $row["product_desc"];
				$product_image = $row["product_image"];
				$cart_item_id = $row["id"];
				$qty = $row["qty"];

				echo
					'
                             
						<tr>
							<td data-th="Product" >
								<div class="row">
								
									<div class="col-sm-4 "><img src="product_images/' . $product_image . '" style="height: 70px;width:75px;"/>
									<h4 class="nomargin product-name header-cart-item-name"><a href="product.php?p=' . $product_id . '">' . $product_title . '</a></h4>
									</div>
									<div class="col-sm-6">
										<div style="max-width=50px;">
										<p>' . $product_desc . '</p>
										</div>
									</div>
									
									
								</div>
							</td>
                            <input type="hidden" name="product_id[]" value="' . $product_id . '"/>
				            <input type="hidden" name="" value="' . $cart_item_id . '"/>
							<td data-th="Price"><input type="text" class="form-control price" value="' . rupee($product_price) . '" readonly="readonly"></td>
							<td data-th="Quantity">
								<input type="text" class="form-control qty" value="' . $qty . '" >
							</td>
							<td data-th="Subtotal" class="text-center"><input type="text" class="form-control total" value="' . rupee($product_price * $qty) . '" readonly="readonly"></td>
							<td class="actions" data-th="">
							<div class="btn-group">
								<a href="#" class="btn btn-info btn-sm update" update_id="' . $product_id . '"><i class="fa fa-refresh"></i></a>
								
								<a href="#" class="btn btn-danger btn-sm remove" remove_id="' . $product_id . '"><i class="fa fa-trash-o"></i></a>		
							</div>							
							</td>
							<td>
								<a href="#" id="wishlist" pid="' . $product_id . '" class="btn btn-warning">Move to Wishlist <i class="fa fa-angle-right"></i> </a>
							</td>
						</tr>
					
                            
                            ';
			}

			echo '</tbody>
				<tfoot>
					
					<tr>
						<td><a href="store.php" class="btn btn-warning"><i class="fa fa-angle-left"></i> Continue Shopping</a></td>
						<td colspan="2" class="hidden-xs"></td>
						<td class="hidden-xs text-center"><b class="net_total" ></b></td>
						<div id="issessionset"></div>
                        <td>
							
							';
			if (!isset($_SESSION["uid"])) {
				echo '
					
							<a href="signup_form.php" class="btn btn-success">Ready to Checkout</a></td>
								</tr>
							</tfoot>
				
							</table></div></div>';
			} else if (isset($_SESSION["uid"])) {
				//Paypal checkout form
				echo '
					</form>
					
						<form action="checkout.php" method="post">
							<input type="hidden" name="cmd" value="_cart">
							<input type="hidden" name="business" value="shoppingcart@support.com">
							<input type="hidden" name="upload" value="1">';

				$x = 0;
				$sql = "SELECT a.product_id,a.product_title,a.product_price,a.product_image,b.id,b.qty FROM products a,cart b WHERE a.product_id=b.p_id AND b.user_id='$_SESSION[uid]'";
				$query = mysqli_query($con, $sql);
				while ($row = mysqli_fetch_array($query)) {
					$x++;
					echo

						'<input type="hidden" name="total_count" value="' . $x . '">
									<input type="hidden" name="item_name_' . $x . '" value="' . $row["product_title"] . '">
								  	 <input type="hidden" name="item_number_' . $x . '" value="' . $row["product_id"] . '">
								     <input type="hidden" name="amount_' . $x . '" value="' . $row["product_price"] . '">
								     <input type="hidden" name="quantity_' . $x . '" value="' . $row["qty"] . '">';
				}

				echo
					'<input type="hidden" name="return" value="http://localhost/myfiles/public_html/payment_success.php"/>
					                <input type="hidden" name="notify_url" value="http://localhost/myfiles/public_html/payment_success.php">
									<input type="hidden" name="cancel_return" value="http://localhost/myfiles/public_html/cancel.php"/>
									<input type="hidden" name="currency_code" value="INR"/>
									<input type="hidden" name="custom" value="' . $_SESSION["uid"] . '"/>
									<input type="submit" id="submit" name="login_user_with_product" name="submit" class="btn btn-success" value="Ready to Checkout">
									</form></td>
									
									</tr>
									
									</tfoot>
									
							</table></div></div>    
								';
			}
		} else {
            // Cart is empty
            echo '<div class="container" style="text-align: center; padding: 60px 20px; margin: 20px auto; max-width: 800px;">
                    <div style="margin-bottom: 30px;">
                        <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background elements -->
                            <rect x="40" y="80" width="40" height="2" fill="#f0f0f0" />
                            <rect x="180" y="80" width="20" height="2" fill="#f0f0f0" />
                            <!-- Blue Item -->
                            <rect x="115" y="42" width="16" height="28" rx="2" fill="#2874f0" />
                            <rect x="119" y="38" width="8" height="6" rx="1" fill="#2874f0" />
                            <!-- Cart body -->
                            <path d="M40 50 L60 50 L80 120 L160 120 L180 70 L70 70" fill="none" stroke="#d0d0d0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                            <!-- Face -->
                            <rect x="110" y="85" width="4" height="12" rx="2" fill="#d0d0d0" />
                            <rect x="135" y="85" width="4" height="12" rx="2" fill="#d0d0d0" />
                            <rect x="115" y="105" width="18" height="4" rx="2" fill="#d0d0d0" />
                            <!-- Wheels -->
                            <circle cx="95" cy="135" r="8" fill="#d0d0d0" />
                            <circle cx="145" cy="135" r="8" fill="#d0d0d0" />
                        </svg>
                    </div>';
            
            if (!isset($_SESSION["uid"])) {
                // Not logged in
                echo '<div style="margin-bottom: 30px;">
						<h3 style="font-weight: 500; font-size:24px; color: #000; margin-bottom: 25px;">Missing Cart items?</h3>
                    	<a href="signin_form.php" class="btn" style="background-color: #2874f0; color: #fff; padding: 12px 60px; font-weight: 500; font-size: 16px; border-radius: 2px; margin-bottom: 15px; border: none; box-shadow: 0 1px 2px rgba(0,0,0,.2);">Login</a>
                    	<br>
                    	<a href="store.php" style="color: #2874f0; font-size: 13px; text-decoration: none; display: inline-block;">Continue Shopping</a>
					</div>';
            } else {
                // Logged in
                echo '<h3 style="font-weight: 500; font-size:24px; color: #000; margin-bottom: 15px;">Your cart is empty!</h3>
                    <p style="color: #000; font-size: 14px; margin-bottom: 20px;">Explore our wide selection and find something you like</p>
                    <a href="store.php" class="btn" style="background-color: #2874f0; color: #fff; padding: 12px 60px; font-weight: 500; font-size: 16px; border-radius: 2px; border: none; box-shadow: 0 1px 2px rgba(0,0,0,.2);">Shop Now</a>';
            }
            
            echo '</div>';
        }
	}




}

if (isset($_POST["wishListCommon"])) {

	if (isset($_SESSION["uid"])) {
		//When user is logged in this query will execute
		$sql = "SELECT a.product_id,a.product_title,a.product_price,a.product_image,a.product_desc,b.id FROM products a,wishlist b WHERE a.product_id=b.p_id AND b.user_id='$_SESSION[uid]'";
	} else {
		//When user is not logged in this query will execute
		$sql = "SELECT a.product_id,a.product_title,a.product_price,a.product_image,a.product_desc,b.id FROM products a,wishlist b WHERE a.product_id=b.p_id AND b.ip_add='$ip_add' AND b.user_id < 0";
	}
	$query = mysqli_query($con, $sql);



	if (isset($_POST["wishlistDetails"])) {
		if (mysqli_num_rows($query) > 0) {
			//display user cart item with "Ready to checkout" button if user is not login
			echo '<div class="main ">
			<div class="table-responsive">
			<form method="post" action="login_form.php">
			
	               <table id="wishlist" class="table table-hover table-condensed" id="">
    				<thead>
						<tr>
							<th style="width:50%">Product</th>
							<th style="width:10%">Price</th>
							<th style="width:7%" class="text-center">Subtotal</th>
							<th style="width:10%"></th>
						</tr>
					</thead>
					<tbody>
                    ';
			$n = 0;
			while ($row = mysqli_fetch_array($query)) {
				$n++;
				$product_id = $row["product_id"];
				$product_title = $row["product_title"];
				$product_desc = $row["product_desc"];
				$product_price = $row["product_price"];
				$product_image = $row["product_image"];
				$wishlist_item_id = $row["id"];

				echo
					'
                             
						<tr>
							<td data-th="Product" >
								<div class="row">
								
									<div class="col-sm-4 "><img src="product_images/' . $product_image . '" style="height: 70px;width:75px;"/>
									<h4 class="nomargin product-name header-cart-item-name"><a href="product.php?p=' . $product_id . '">' . $product_title . '</a></h4>
									</div>
									<div class="col-sm-6">
										<div style="max-width=50px;">
										<p>' . $product_desc . '</p>
										</div>
									</div>
									
									
								</div>
							</td>
                            <input type="hidden" name="product_id[]" value="' . $product_id . '"/>
				            <input type="hidden" name="" value="' . $wishlist_item_id . '"/>
							<td data-th="Price"><input type="text" class="form-control price" value="' . $product_price . '" readonly="readonly"></td>
							
							<td data-th="Subtotal" class="text-center"><input type="text" class="form-control total" value="' . $product_price . '" readonly="readonly"></td>
							<td class="actions" data-th="">
							<div class="btn-group">
								
								<a href="#" class="btn btn-danger btn-sm wishlist-remove" remove_id="' . $product_id . '"><i class="fa fa-trash-o"></i></a>	
									
							</div>							
							</td>
							<td class="actions" data-th="">
							<a href="#" id="product" pid="' . $product_id . '" class="btn btn-success">Move to Cart</a>
							</td>
						</tr>
					
                            
                            ';
			}

			echo '</tbody>
				<tfoot>
					
					<tr>
						<td><a href="store.php" class="btn btn-warning"><i class="fa fa-angle-left"></i> Continue Shopping</a></td>
						<td colspan="2" class="hidden-xs"></td>
						<td class="hidden-xs text-center"><b class="net_total" ></b></td>
						</tfoot>
				
						</table></div></div>
							
							';

		}
	}


}
//Remove Item From cart
if (isset($_POST["removeItemFromCart"])) {
	$remove_id = $_POST["rid"];
	if (isset($_SESSION["uid"])) {
		$sql = "DELETE FROM cart WHERE p_id = '$remove_id' AND user_id = '$_SESSION[uid]'";
	} else {
		$sql = "DELETE FROM cart WHERE p_id = '$remove_id' AND ip_add = '$ip_add'";
	}
	if (mysqli_query($con, $sql)) {
		echo "<div class='alert alert-danger'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>Product is removed from cart</b>
				</div>";
		exit();
	}
}

if (isset($_POST["removeItemFromwishList"])) {
	$remove_id = $_POST["rid"];
	if (isset($_SESSION["uid"])) {
		$sql = "DELETE FROM wishlist WHERE p_id = '$remove_id' AND user_id = '$_SESSION[uid]'";
	} else {
		$sql = "DELETE FROM wishlist WHERE p_id = '$remove_id' AND ip_add = '$ip_add'";
	}
	if (mysqli_query($con, $sql)) {
		echo "<div class='alert alert-danger'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>Product is removed from wishlist</b>
				</div>";
		exit();
	}
}
//Update Item From cart
if (isset($_POST["updateCartItem"])) {
	$update_id = isset($_POST["update_id"]) ? intval($_POST["update_id"]) : 0;
	$qty = isset($_POST["qty"]) ? intval($_POST["qty"]) : 1;
	$qty = max(1, $qty);

	$stock_query = mysqli_query($con, "SELECT product_qty FROM products WHERE product_id = $update_id LIMIT 1");
	$stock_row = $stock_query ? mysqli_fetch_assoc($stock_query) : null;
	if (!$stock_row || intval($stock_row["product_qty"]) <= 0) {
		echo "<div class='alert alert-danger'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>This product is out of stock.</b>
				</div>";
		exit();
	}

	$available_qty = intval($stock_row["product_qty"]);
	if ($qty > $available_qty) {
		$qty = $available_qty;
	}

	if (isset($_SESSION["uid"])) {
		$sql = "UPDATE cart SET qty='$qty' WHERE p_id = '$update_id' AND user_id = '$_SESSION[uid]'";
	} else {
		$sql = "UPDATE cart SET qty='$qty' WHERE p_id = '$update_id' AND ip_add = '$ip_add'";
	}
	if (mysqli_query($con, $sql)) {
		$message = $qty === $available_qty && isset($_POST["qty"]) && intval($_POST["qty"]) > $available_qty
			? "Quantity adjusted to available stock ($available_qty)"
			: "Product is updated";
		echo "<div class='alert alert-info'>
						<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
						<b>$message</b>
				</div>";
		exit();
	}
}




?>
