<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_id = $_SESSION['admin_id'];
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

$success = '';
$error = '';

// Fetch current admin info
$sql = "SELECT admin_email FROM admin_info WHERE admin_id = ?";
$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "i", $admin_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$admin_data = mysqli_fetch_assoc($result);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $new_email = $_POST['admin_email'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    if (!empty($new_password)) {
        if ($new_password !== $confirm_password) {
            $error = "Passwords do not match.";
        } else {
            // Update both email and password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $update_sql = "UPDATE admin_info SET admin_email = ?, admin_password = ? WHERE admin_id = ?";
            $update_stmt = mysqli_prepare($con, $update_sql);
            mysqli_stmt_bind_param($update_stmt, "ssi", $new_email, $hashed_password, $admin_id);
            if (mysqli_stmt_execute($update_stmt)) {
                $success = "Settings updated successfully.";
                $admin_data['admin_email'] = $new_email;
            } else {
                $error = "Failed to update settings.";
            }
        }
    } else {
        // Update only email
        $update_sql = "UPDATE admin_info SET admin_email = ? WHERE admin_id = ?";
        $update_stmt = mysqli_prepare($con, $update_sql);
        mysqli_stmt_bind_param($update_stmt, "si", $new_email, $admin_id);
        if (mysqli_stmt_execute($update_stmt)) {
            $success = "Email updated successfully.";
            $admin_data['admin_email'] = $new_email;
        } else {
            $error = "Failed to update email.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - NexusMart Enterprise</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .settings-form {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            max-width: 600px;
            margin: 20px 0;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            outline: none;
            transition: 0.3s;
        }
        .form-group input:focus {
            border-color: #20c96c;
        }
        .btn-submit {
            background: #20c96c;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
        }
        .btn-submit:hover {
            background: #1aa056;
        }
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-success {
            background: #e6fffa;
            color: #2c7a7b;
            border: 1px solid #b2f5ea;
        }
        .alert-error {
            background: #fff5f5;
            color: #c53030;
            border: 1px solid #feb2b2;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <i class="fa-solid fa-bag-shopping text-green logo-icon"></i>
                <div>
                    <h2>NexusMart</h2>
                    <p>ENTERPRISE</p>
                </div>
            </div>

            <div class="nav-section">
                <p class="nav-title">Home Menu</p>
                <ul class="nav-list">
                    <li><a href="index.php"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
                    <li><a href="analytics.php"><i class="fa-solid fa-chart-line"></i> Analytics</a></li>
                    <li class="active"><a href="settings.php"><i class="fa-solid fa-gear"></i> Settings</a></li>
                </ul>
            </div>

            <div class="nav-section">
                <p class="nav-title">All Page</p>
                <ul class="nav-list">
                    <li class="has-child">
                        <a href="#"><i class="fa-solid fa-file-invoice"></i> Orders <span class="toggle-icon">+</span></a>
                        <ul class="sub-menu" style="display:none;">
                            <li><span class="dot empty"></span> All Orders</li>
                        </ul>
                    </li>
                    <li class="has-child">
                        <a href="#"><i class="fa-solid fa-box"></i> Products <span class="toggle-icon">+</span></a>
                        <ul class="sub-menu" style="display:none;">
                            <li><a href="products_list.php" style="padding:0; color:inherit;"><span class="dot empty"></span> All Products</a></li>
                            <li><a href="edit_product.php" style="padding:0; color:inherit;"><span class="dot empty"></span> Add Product</a></li>
                        </ul>
                    </li>
                    <li><a href="#"><i class="fa-solid fa-ticket"></i> Coupon</a></li>
                    <li><a href="brands.php"><i class="fa-solid fa-tags"></i> Brands</a></li>
                    <li><a href="categories.php"><i class="fa-solid fa-layer-group"></i> Category</a></li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <h2>Settings</h2>
                <div class="header-actions">
                    <div class="user-profile">
                        <img src="https://i.pravatar.cc/100?img=11" alt="<?php echo htmlspecialchars($admin_name); ?>">
                        <div class="user-info">
                            <h4><?php echo htmlspecialchars($admin_name); ?></h4>
                            <p>Admin</p>
                        </div>
                    </div>
                    <a href="logout.php" class="btn-icon" style="text-decoration:none; color:inherit; color:#ff4d4f;" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
                </div>
            </header>

            <div class="content-wrapper" style="display: block; overflow-y: auto; background:#f4f7f6; padding: 20px;">
                <div class="settings-form">
                    <?php if ($success): ?>
                        <div class="alert alert-success"><?php echo $success; ?></div>
                    <?php endif; ?>
                    <?php if ($error): ?>
                        <div class="alert alert-error"><?php echo $error; ?></div>
                    <?php endif; ?>

                    <form method="POST">
                        <div class="form-group">
                            <label>Admin Email</label>
                            <input type="email" name="admin_email" value="<?php echo htmlspecialchars($admin_data['admin_email']); ?>" required>
                        </div>
                        <div class="form-group">
                            <label>New Password (leave blank to keep current)</label>
                            <input type="password" name="new_password" placeholder="Enter new password">
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm_password" placeholder="Confirm new password">
                        </div>
                        <button type="submit" class="btn-submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const hasChildLinks = document.querySelectorAll('.has-child > a');
            hasChildLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const li = link.parentElement;
                    const subMenu = li.querySelector('.sub-menu');
                    const toggleIcon = link.querySelector('.toggle-icon');
                    if (li.classList.contains('active')) {
                        li.classList.remove('active');
                        if(subMenu) subMenu.style.display = 'none';
                        if(toggleIcon) toggleIcon.innerText = '+';
                    } else {
                        li.classList.add('active');
                        if(subMenu) subMenu.style.display = 'block';
                        if(toggleIcon) toggleIcon.innerText = '-';
                    }
                });
            });
            // Initial sidebar state
            document.querySelectorAll('.sub-menu').forEach(menu => menu.style.display = 'none');
        });
    </script>
</body>
</html>
