<?php
require_once __DIR__ . "/session_bootstrap.php";
include "db.php";
if (isset($_POST["f_name"])) {

	$f_name = mysqli_real_escape_string($con, $_POST["f_name"]);
	$l_name = mysqli_real_escape_string($con, $_POST["l_name"]);
	$email = mysqli_real_escape_string($con, $_POST['email']);
	$password = mysqli_real_escape_string($con, $_POST['password']);
	$repassword = mysqli_real_escape_string($con, $_POST['repassword']);
	$mobile = mysqli_real_escape_string($con, $_POST['mobile']);
	$address1 = mysqli_real_escape_string($con, $_POST['address1']);
	$address2 = mysqli_real_escape_string($con, $_POST['address2']);
	$name = "/^[a-zA-Z ]+$/";
	$emailValidation = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9]+(\.[a-z]{2,4})$/";
	$number = "/^[0-9]+$/";

if(empty($f_name) || empty($l_name) || empty($email) || empty($password) || empty($repassword) ||
	empty($mobile) || empty($address1) || empty($address2)){
		
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>PLease Fill all fields..!</b>
			</div>
		";
		exit();
	} else {
		if(!preg_match($name,$f_name)){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>this $f_name is not valid..!</b>
			</div>
		";
		exit();
	}
	if(!preg_match($name,$l_name)){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>this $l_name is not valid..!</b>
			</div>
		";
		exit();
	}
	if(!preg_match($emailValidation,$email)){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>this $email is not valid..!</b>
			</div>
		";
		exit();
	}
	if(strlen($password) < 9 ){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>Password is weak</b>
			</div>
		";
		exit();
	}
	if(strlen($repassword) < 9 ){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>Password is weak</b>
			</div>
		";
		exit();
	}
	if($password != $repassword){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>password is not same</b>
			</div>
		";
		exit();
	}
	if(!preg_match($number,$mobile)){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>Mobile number $mobile is not valid</b>
			</div>
		";
		exit();
	}
	if(!(strlen($mobile) == 10)){
		echo "
			<div class='alert alert-warning'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>Mobile number must be 10 digit</b>
			</div>
		";
		exit();
	}
	//existing email address in our database
	$sql = "SELECT user_id FROM user_info WHERE email = ? LIMIT 1" ;
	$stmt = mysqli_prepare($con, $sql);
	mysqli_stmt_bind_param($stmt, "s", $email);
	mysqli_stmt_execute($stmt);
	$check_query = mysqli_stmt_get_result($stmt);
	$count_email = mysqli_num_rows($check_query);
	
	if($count_email > 0){
		echo "
			<div class='alert alert-danger'>
				<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
				<b>Email Address is already available Try Another email address</b>
			</div>
		";
		exit();
	} else {
		/* Hashing password for security */
		$password = password_hash($password, PASSWORD_BCRYPT);
		
		$sql = "INSERT INTO `user_info` 
		(`first_name`, `last_name`, `email`, 
		`password`, `mobile`, `address1`, `address2`) 
		VALUES (?, ?, ?, ?, ?, ?, ?)";
		
		$stmt = mysqli_prepare($con, $sql);
		mysqli_stmt_bind_param($stmt, "sssssss", $f_name, $l_name, $email, $password, $mobile, $address1, $address2);
		
		if(mysqli_stmt_execute($stmt)){
			$_SESSION["uid"] = mysqli_insert_id($con);
			$_SESSION["name"] = $f_name;
			$ip_add = $_SERVER['REMOTE_ADDR'] ?? getenv("REMOTE_ADDR") ?? '127.0.0.1';
			
			$update_cart = "UPDATE cart SET user_id = ? WHERE ip_add=? AND user_id = -1";
			$stmt_cart = mysqli_prepare($con, $update_cart);
			mysqli_stmt_bind_param($stmt_cart, "is", $_SESSION["uid"], $ip_add);
			mysqli_stmt_execute($stmt_cart);
			
			echo "register_success";
            exit;
		} else {
			echo "
				<div class='alert alert-danger'>
					<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
					<b>Error in registration: " . mysqli_error($con) . "</b>
				</div>
			";
		}
	}
	}
	
}



?>
