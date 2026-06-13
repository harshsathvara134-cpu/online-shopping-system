<?php
require_once __DIR__ . "/session_bootstrap.php";
include "db.php";

#Login script is begin here
#If user given credential matches successfully with the data available in database then we will echo string login_success
#login_success string will go back to called Anonymous funtion $("#login").click() 

if(isset($_POST["email"]) && isset($_POST["password"])){
	$email = $_POST["email"];
	$password = $_POST["password"];
	
	/* User login */
	$sql = "SELECT * FROM user_info WHERE email = ? LIMIT 1";
	$stmt = mysqli_prepare($con, $sql);
	mysqli_stmt_bind_param($stmt, "s", $email);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);
	
	if(mysqli_num_rows($result) == 1){
		$row = mysqli_fetch_assoc($result);
		$db_password = $row["password"];
		
		/* Check hashed password or fallback to plaintext (for transition) */
		if (password_verify($password, $db_password) || $password === $db_password) {
			
			/* If plaintext, re-hash for security */
			if ($password === $db_password && !password_get_info($db_password)['algo']) {
				$new_hash = password_hash($password, PASSWORD_BCRYPT);
				$update_sql = "UPDATE user_info SET password = ? WHERE user_id = ?";
				$u_stmt = mysqli_prepare($con, $update_sql);
				mysqli_stmt_bind_param($u_stmt, "si", $new_hash, $row["user_id"]);
				mysqli_stmt_execute($u_stmt);
			}

			session_regenerate_id(true);
			$_SESSION["uid"] = $row["user_id"];
			$_SESSION["name"] = $row["first_name"];
			$ip_add = getenv("REMOTE_ADDR");
			
			if (isset($_COOKIE["product_list"])) {
				$p_list = stripcslashes($_COOKIE["product_list"]);
				$product_list = json_decode($p_list,true);
				for ($i=0; $i < count($product_list); $i++) { 
					$verify_cart = "SELECT id FROM cart WHERE user_id = ? AND p_id = ?";
					$v_stmt = mysqli_prepare($con, $verify_cart);
					mysqli_stmt_bind_param($v_stmt, "ii", $_SESSION["uid"], $product_list[$i]);
					mysqli_stmt_execute($v_stmt);
					$v_res = mysqli_stmt_get_result($v_stmt);
					if(mysqli_num_rows($v_res) < 1){
						$update_cart = "UPDATE cart SET user_id = ? WHERE ip_add = ? AND user_id = -1";
						$uc_stmt = mysqli_prepare($con, $update_cart);
						mysqli_stmt_bind_param($uc_stmt, "is", $_SESSION["uid"], $ip_add);
						mysqli_stmt_execute($uc_stmt);
					}else{
						$del_cart = "DELETE FROM cart WHERE user_id = -1 AND ip_add = ? AND p_id = ?";
						$d_stmt = mysqli_prepare($con, $del_cart);
						mysqli_stmt_bind_param($d_stmt, "si", $ip_add, $product_list[$i]);
						mysqli_stmt_execute($d_stmt);
					}
				}
				setcookie("product_list","",strtotime("-1 day"),"/");
				echo "cart_login";
				exit();
			}

			$sql_cart = "UPDATE cart SET user_id = ? WHERE ip_add=? AND user_id = -1";
			$stmt_cart = mysqli_prepare($con, $sql_cart);
			mysqli_stmt_bind_param($stmt_cart, "is", $_SESSION["uid"], $ip_add);
			mysqli_stmt_execute($stmt_cart);

			$sql_wish = "UPDATE wishlist SET user_id = ? WHERE ip_add=? AND user_id = -1";
			$stmt_wish = mysqli_prepare($con, $sql_wish);
			mysqli_stmt_bind_param($stmt_wish, "is", $_SESSION["uid"], $ip_add);
			mysqli_stmt_execute($stmt_wish);

			echo "login_success";
			exit;
		}
	}
	
	/* Admin login check */
	$sql_admin = "SELECT * FROM admin_info WHERE admin_email = ? LIMIT 1";
	$stmt_admin = mysqli_prepare($con, $sql_admin);
	mysqli_stmt_bind_param($stmt_admin, "s", $email);
	mysqli_stmt_execute($stmt_admin);
	$res_admin = mysqli_stmt_get_result($stmt_admin);
	
	if(mysqli_num_rows($res_admin) == 1){
		$row = mysqli_fetch_assoc($res_admin);
		$admin_pass = $row["admin_password"];
		
		if (password_verify($password, $admin_pass) || md5($password) === $admin_pass || $password === $admin_pass) {
			if (!password_get_info($admin_pass)['algo']) {
				$new_hash = password_hash($password, PASSWORD_BCRYPT);
				$u_admin_sql = "UPDATE admin_info SET admin_password = ? WHERE admin_id = ?";
				$ua_stmt = mysqli_prepare($con, $u_admin_sql);
				mysqli_stmt_bind_param($ua_stmt, "si", $new_hash, $row["admin_id"]);
				mysqli_stmt_execute($ua_stmt);
			}

			session_regenerate_id(true);
			$_SESSION["admin_id"] = $row["admin_id"];
			$_SESSION["admin_name"] = $row["admin_name"];
			echo "admin_login_success";
			exit;
		}
	}

	echo "<span style='color:red;'>Invalid email or password..!</span>";
	exit();
}
?>
