<?php
require_once __DIR__ . "/session_bootstrap.php";
include "db.php";
if (isset($_POST["review"])) {

	$name = mysqli_real_escape_string($con, $_POST["name"]);
	$email = mysqli_real_escape_string($con, $_POST["email"]);
	$review = mysqli_real_escape_string($con, $_POST['review']);
	$rating = intval($_POST['rating']);
	$product_id = intval($_POST['product_id']);
    $datetime =  date('Y-m-d H:i:s');
		
		$sql = "SELECT review_id FROM reviews WHERE email = '$email' AND product_id = '$product_id' ";
		$check_query = mysqli_query($con,$sql);
		$count_email = mysqli_num_rows($check_query);
		if($count_email > 0){
			echo "
				<div class='alert alert-danger'>
					<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
					<b>Multiple reviews are not Allowed</b>
				</div>
			";
			exit();
		}else{
			$sql = "INSERT INTO `reviews` (`review_id`, `product_id`, `name`, `email`, `review`, `datetime`, `rating`) 
			VALUES  (NULL, '$product_id','$name', '$email', 
			'$review','$datetime', '$rating')";
			
			if(mysqli_query($con,$sql)){
				echo "<div class='alert alert-success'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>Thank you for your review!</b></div>";
				exit();
			}else {
				echo "<div class='alert alert-danger'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>Something went wrong. Please try again!</b></div>";
				exit();
			}
		}
	
}



?>





















































