<?php
require_once __DIR__ . "/session_bootstrap.php";
$ip_add = getenv("REMOTE_ADDR");
include "db.php";

if(isset($_POST["categoryhome"])){
	
	echo "
		
				<!-- responsive-nav -->
				<div id='responsive-nav' style='display:flex; align-items:center;'>
					<!-- NAV -->
					<ul class='main-nav nav navbar-nav' style='display:flex; flex-direction:row; margin:0; align-items:center;'>
						<li class='active'><a href='index.php' style='padding: 8px 15px; font-weight: 500;'>Home</a></li>";
						$category_query = "SELECT * FROM categories";
						$run_query = mysqli_query($con,$category_query) or die(mysqli_error($con));
						if(mysqli_num_rows($run_query) > 0){
							while($row = mysqli_fetch_array($run_query)){
								
								$cid = $row["cat_id"];
								$cat_name = $row["cat_title"];

								echo"<li><a href='products.php?cat_id=".$cid."'>$cat_name</a></li>";
							}
						}


                    
				 echo"</ul>
					<!-- /NAV -->
				</div>
				<!-- /responsive-nav -->
               
			";

}


if(isset($_POST["page"])){
	$sql = "SELECT * FROM products";
	$run_query = mysqli_query($con,$sql);
	$count = mysqli_num_rows($run_query);
	$pageno = ceil($count/2);
	for($i=1;$i<=$pageno;$i++){
		echo "
			<li><a href='#product-row' page='$i' id='page'>$i</a></li>
            
            
		";
	}
}
if(isset($_POST["getProducthome"])){
	$limit = 3;
    $type = isset($_POST["type"]) ? $_POST["type"] : 1;
	$start = 0;
    
    if($type == 1) {
        // Top Selling by Quantity
        $product_query = "SELECT p.*, c.cat_title, COALESCE(SUM(op.qty), 0) as total_sold
        FROM products p
        JOIN categories c ON p.product_cat = c.cat_id
        LEFT JOIN order_products op ON p.product_id = op.product_id
        GROUP BY p.product_id
        ORDER BY total_sold DESC, p.product_id DESC
        LIMIT $start,$limit";
    } else if($type == 2) {
        // Newest Arrivals
        $product_query = "SELECT p.*, c.cat_title FROM products p JOIN categories c ON p.product_cat = c.cat_id ORDER BY product_id DESC LIMIT $start,$limit";
    } else if($type == 3) {
        // Random / Featured
        $product_query = "SELECT p.*, c.cat_title FROM products p JOIN categories c ON p.product_cat = c.cat_id ORDER BY RAND() LIMIT $start,$limit";
    } else {
        // Hot Deals (Type 4)
        $product_query = "SELECT p.*, c.cat_title FROM products p JOIN categories c ON p.product_cat = c.cat_id ORDER BY product_id ASC LIMIT $start,$limit";
    }
	
	$run_query = mysqli_query($con,$product_query);
	if(mysqli_num_rows($run_query) > 0){
		while($row = mysqli_fetch_array($run_query)){
			$pro_id    = $row['product_id'];
			$pro_title = $row['product_title'];
			$pro_price = $row['product_price'];
			$pro_image = $row['product_image'];
            $cat_name  = $row["cat_title"];

            // Image path check
            $img_src = "product_images/$pro_image";
            if(!file_exists($img_src)) $img_src = "img/$pro_image";

			echo "
                       <div class='product-widget'>
                                <div class='product-img'> <a href='product.php?p=$pro_id'> <img src='$img_src' alt=''> </a> </div>
									<div class='product-body'>
										<p class='product-category'>$cat_name</p>
										<h3 class='product-name'><a href='product.php?p=$pro_id'>$pro_title</a></h3>
										<h4 class='product-price'>".rupee($pro_price)."<del class='product-old-price'>".rupee($pro_price * 1.2, true)."</del></h4>
									</div>
								</div>
			";
		}
	}
}


    
