<?php
include "db.php";

include "header.php";


                         
?>

<link href="css/myorders.css" rel="stylesheet"/>					
<section class="section main main-raised">       
	<div class="container-fluid ">
		<div class="wrap cf">
            <h1 class="projTitle">All Your Orders</h1>
            <div class="heading cf">
                <h1>My Orders</h1>
                <h1 style="margin-left:55%">qty</h1>
                <a href="store.php" class="continue">Continue Shopping</a>
            </div>
            <div class="cart">
                <ul class="cartWrap">
                <?php
                if (isset($_SESSION["uid"])) {
                    $uid = intval($_SESSION["uid"]);
                    $sql = "SELECT c.order_id, c.payment_method, a.product_id, a.product_title, a.product_price, a.product_image, b.qty, b.amt, c.total_amt 
                            FROM products a 
                            JOIN order_products b ON a.product_id = b.product_id 
                            JOIN orders_info c ON b.order_id = c.order_id 
                            WHERE c.user_id = ? 
                            ORDER BY c.order_id DESC";
                    $stmt_ord = mysqli_prepare($con, $sql);
                    mysqli_stmt_bind_param($stmt_ord, "i", $uid);
                    mysqli_stmt_execute($stmt_ord);
                    $query = mysqli_stmt_get_result($stmt_ord);
                    //display cart item in dropdown menu
                    
                    if (mysqli_num_rows($query) > 0) {
                        $prev_old = 0;
                        $prev_total = 0;
                        $i = 1;
                        $numRows = mysqli_num_rows($query);
                        while ($row=mysqli_fetch_array($query)) {
                            
                            $product_id = $row["product_id"];
                            $product_title = $row["product_title"];
                            $product_price = $row["product_price"];
                            $product_image = $row["product_image"];
                            $qty = $row["qty"];
                            $amt=$row["amt"];
                            $total_amt=$row["total_amt"];
                            $order_id=$row["order_id"];
                            $payment_method=$row["payment_method"];
                            
                            if ($prev_old==0 || $prev_old==$order_id){
                                $prev_old=$order_id;
                                $prev_total = $total_amt;
                                $i++;
                                echo '<li class="items even">
                                    <div class="infoWrap"> 
                                        <div class="cartSection">
                                        <img src="product_images/'.$product_image.'" alt="'.$product_title.'" class="itemImg" />
                                        <p class="itemNumber">#'.$product_id.'</p>
                                        <h3>'.$product_title.'</h3>
                                        
                                        <p> '.$qty.' x &#x20B9; '.$product_price.'</p>
                                        
                                        <p class="stockStatus"> Delivered</p>
                                        </div>  
                                    
                                        <div class="prodTotal cartSection"><p>'.$qty.'</p></div>
                                        <div class="prodTotal cartSection">
                                        <p>&#x20B9; '.$product_price.'</p>
                                        </div>
                                        <div class="cartSection removeWrap">
                                            <a href="#" class="remove">x</a>
                                        </div>
                                    </div>
                            </li>';
                            
                            
                            }else{
                                $prev_old=$order_id;
                                $i++;
                                echo'
                            </ul>
                        </div>  
                        <div class="special"><div class="specialContent">
                                Thanks for Using our Platform
                        </div></div>
                        <div class="subtotal cf">
                            <ul>
                            <li class="totalRow"><span class="label">Subtotal</span><span class="value">&#x20B9; '.$prev_total.'</span></li>
                            
                                <li class="totalRow"><span class="label">Shipping</span><span class="value">&#x20B9; 0.00</span></li>
                            
                                    <li class="totalRow"><span class="label">Tax</span><span class="value">&#x20B9; 0.00</span></li>
                                    <li class="totalRow final"><span class="label">Total</span><span class="value">&#x20B9;'.$prev_total.'</span></li>
                            
                            </ul>
                        </div>
            
                        
                        <div class="cart">
                            <ul class="cartWrap">
                                <li class="items even">
                                    <div class="infoWrap"> 
                                        <div class="cartSection">
                                        <img src="product_images/'.$product_image.'" alt="'.$product_title.'" class="itemImg" />
                                        <p class="itemNumber">#'.$product_id.'</p>
                                        <h3>'.$product_title.'</h3>
                                        
                                        <p> '.$qty.' x &#x20B9; '.$product_price.'</p>
                                        
                                        <p class="stockStatus out"> Shipping</p>
                                        </div>  
                                    
                                        <div class="prodTotal cartSection"><p>'.$qty.'</p></div>
                                        <div class="prodTotal cartSection">
                                        <p>&#x20B9; '.$product_price.'</p>
                                        </div>
                                        <div class="cartSection removeWrap">
                                            <a href="#" class="remove">x</a>
                                        </div>
                                    </div>
                                </li>
                                ';
                                $prev_total = $total_amt;
                            }
                            if($i==$numRows+1){
                                echo '
                                 
                                    <div class="special"><div class="specialContent">
                                            Thanks for Using our Platform
                                    </div></div>
                                    <div class="subtotal cf">
                                        <ul>
                                        <li class="totalRow"><span class="label">Subtotal</span><span class="value">&#x20B9; '.$prev_total.'</span></li>
                                        
                                            <li class="totalRow"><span class="label">Shipping</span><span class="value">&#x20B9; 0.00</span></li>
                                        
                                                <li class="totalRow"><span class="label">Tax</span><span class="value">&#x20B9; 0.00</span></li>
                                                <li class="totalRow final"><span class="label">Total</span><span class="value">&#x20B9;'.$prev_total.'</span></li>
                                     <li class="totalRow" style="margin-top:10px;"><span class="label">Payment Method</span><span class="value" style="color:#2196F3; font-weight:bold;">'.$payment_method.'</span></li>
                                        
                                        </ul>
                                    </div>
                                ';
                            }
                            
                            
                        }
                    }else{
                        echo '<div style="text-align:center; padding:60px 20px;">
                            <i class="fa fa-cube" style="font-size:64px; color:#ccc; margin-bottom:20px;"></i>
                            <h3 style="color:#555;">No orders found!</h3>
                            <p style="color:#888;">You haven\'t placed any orders yet.</p>
                            <a href="store.php" class="btn btn-primary" style="margin-top:15px; padding:10px 30px; background:#2874f0; border:none; color:#fff; border-radius:4px; text-decoration:none; display:inline-block;">Explore Products</a>
                        </div>';
                    }
                } else {
                    echo '<div style="text-align:center; padding:60px 20px;">
                        <i class="fa fa-user-circle-o" style="font-size:64px; color:#ccc; margin-bottom:20px;"></i>
                        <h3 style="color:#555;">Please Sign In</h3>
                        <p style="color:#888;">Log in to view your orders and track delivery status.</p>
                        <a href="signin_form.php" class="btn btn-primary" style="margin-top:15px; padding:10px 30px; background:#2874f0; border:none; color:#fff; border-radius:4px; text-decoration:none; display:inline-block;">Sign In Now</a>
                    </div>';
                }
                ?>
                
                
                </ul>
            </div> 
                <!--<li class="items even">Item 2</li>-->
            
                
        </div>
    </div>
 </section>

<?php
include "footer.php";
?>