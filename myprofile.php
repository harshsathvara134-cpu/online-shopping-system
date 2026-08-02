<?php
require_once __DIR__ . "/session_bootstrap.php";
include "db.php";

if (!isset($_SESSION["uid"])) {
    header("Location: signin_form.php");
    exit();
}

$user_id = intval($_SESSION["uid"]);
$msg = "";
$error = "";

// Handle Profile Update
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["update_profile"])) {
    $first_name = trim(mysqli_real_escape_string($con, $_POST["first_name"]));
    $last_name = trim(mysqli_real_escape_string($con, $_POST["last_name"]));
    $mobile = trim(mysqli_real_escape_string($con, $_POST["mobile"]));
    $address1 = trim(mysqli_real_escape_string($con, $_POST["address1"]));
    $address2 = trim(mysqli_real_escape_string($con, $_POST["address2"]));

    if (empty($first_name) || empty($last_name) || empty($mobile) || empty($address1)) {
        $error = "Please fill in all required fields.";
    } elseif (!preg_match("/^[0-9]{10}$/", $mobile)) {
        $error = "Mobile number must be exactly 10 digits.";
    } else {
        $update_sql = "UPDATE user_info SET first_name=?, last_name=?, mobile=?, address1=?, address2=? WHERE user_id=?";
        $stmt = mysqli_prepare($con, $update_sql);
        mysqli_stmt_bind_param($stmt, "sssssi", $first_name, $last_name, $mobile, $address1, $address2, $user_id);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION["name"] = $first_name;
            $msg = "Profile updated successfully!";
        } else {
            $error = "Failed to update profile. Please try again.";
        }
    }
}

// Fetch User Data
$sql = "SELECT * FROM user_info WHERE user_id = '$user_id' LIMIT 1";
$query = mysqli_query($con, $sql);
$user = mysqli_fetch_assoc($query);

if (!$user) {
    header("Location: logout.php");
    exit();
}

include "header.php";
?>

<div class="section main main-raised" style="padding: 40px 0; background: #f5f7fa;">
    <div class="container">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3">
                <div style="background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 20px; text-align: center; margin-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: #2874f0; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 15px;">
                        <i class="fa fa-user"></i>
                    </div>
                    <h4 style="font-weight: 700; margin-bottom: 5px; color: #333;"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></h4>
                    <p style="color: #777; font-size: 13px; margin-bottom: 15px;"><?php echo htmlspecialchars($user['email']); ?></p>
                    <span class="badge" style="background: #e8f0fe; color: #2874f0; font-weight: 600; padding: 6px 14px; border-radius: 20px;">JAYVEER Member</span>
                </div>

                <div style="background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); overflow: hidden;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="border-bottom: 1px solid #eee;"><a href="myprofile.php" style="display: block; padding: 14px 20px; color: #2874f0; font-weight: 600; text-decoration: none; background: #f0f5ff;"><i class="fa fa-user-circle-o" style="margin-right: 10px;"></i> My Profile</a></li>
                        <li style="border-bottom: 1px solid #eee;"><a href="myorders.php" style="display: block; padding: 14px 20px; color: #444; font-weight: 500; text-decoration: none;"><i class="fa fa-cube" style="margin-right: 10px;"></i> My Orders</a></li>
                        <li style="border-bottom: 1px solid #eee;"><a href="wishlist.php" style="display: block; padding: 14px 20px; color: #444; font-weight: 500; text-decoration: none;"><i class="fa fa-heart-o" style="margin-right: 10px;"></i> Wishlist</a></li>
                        <li><a href="logout.php" style="display: block; padding: 14px 20px; color: #d9534f; font-weight: 500; text-decoration: none;"><i class="fa fa-sign-out" style="margin-right: 10px;"></i> Logout</a></li>
                    </ul>
                </div>
            </div>

            <!-- Profile Details Form -->
            <div class="col-md-9">
                <div style="background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 30px;">
                    <h3 style="font-weight: 700; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; color: #222;">Personal Information & Delivery Address</h3>

                    <?php if (!empty($msg)): ?>
                        <div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><?php echo $msg; ?></div>
                    <?php endif; ?>

                    <?php if (!empty($error)): ?>
                        <div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert">&times;</a><?php echo $error; ?></div>
                    <?php endif; ?>

                    <form method="POST" action="myprofile.php">
                        <div class="row">
                            <div class="col-md-6 form-group" style="margin-bottom: 20px;">
                                <label style="font-weight: 600; color: #555;">First Name *</label>
                                <input type="text" name="first_name" class="form-control" value="<?php echo htmlspecialchars($user['first_name']); ?>" required style="border-radius: 4px; padding: 10px 14px; height: 42px;">
                            </div>
                            <div class="col-md-6 form-group" style="margin-bottom: 20px;">
                                <label style="font-weight: 600; color: #555;">Last Name *</label>
                                <input type="text" name="last_name" class="form-control" value="<?php echo htmlspecialchars($user['last_name']); ?>" required style="border-radius: 4px; padding: 10px 14px; height: 42px;">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 form-group" style="margin-bottom: 20px;">
                                <label style="font-weight: 600; color: #555;">Email Address (Read-only)</label>
                                <input type="email" class="form-control" value="<?php echo htmlspecialchars($user['email']); ?>" readonly style="background: #f8f9fa; border-radius: 4px; padding: 10px 14px; height: 42px;">
                            </div>
                            <div class="col-md-6 form-group" style="margin-bottom: 20px;">
                                <label style="font-weight: 600; color: #555;">Mobile Number *</label>
                                <input type="text" name="mobile" class="form-control" value="<?php echo htmlspecialchars($user['mobile']); ?>" required pattern="^[0-9]{10}$" style="border-radius: 4px; padding: 10px 14px; height: 42px;">
                            </div>
                        </div>

                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-weight: 600; color: #555;">Primary Address *</label>
                            <input type="text" name="address1" class="form-control" value="<?php echo htmlspecialchars($user['address1']); ?>" required style="border-radius: 4px; padding: 10px 14px; height: 42px;" placeholder="House / Flat / Street Name">
                        </div>

                        <div class="form-group" style="margin-bottom: 25px;">
                            <label style="font-weight: 600; color: #555;">City / Secondary Address</label>
                            <input type="text" name="address2" class="form-control" value="<?php echo htmlspecialchars($user['address2']); ?>" style="border-radius: 4px; padding: 10px 14px; height: 42px;" placeholder="City or Area">
                        </div>

                        <button type="submit" name="update_profile" class="btn" style="background: #fb641b; color: #fff; font-weight: 600; padding: 12px 35px; border-radius: 4px; font-size: 15px; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include "newsletter.php";
include "footer.php";
?>
