<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

$product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$p_title = "";
$p_desc = "";
$p_price = "";
$p_qty = 1;
$p_cat = "";
$p_brand = "";
$p_keywords = "";

// Fetch logic
if ($product_id > 0) {
    $sql = "SELECT p.*, c.cat_title, b.brand_title FROM products p 
            LEFT JOIN categories c ON p.product_cat = c.cat_id 
            LEFT JOIN brands b ON p.product_brand = b.brand_id 
            WHERE p.product_id = ?";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "i", $product_id);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    if ($row = mysqli_fetch_assoc($res)) {
        $p_title = $row['product_title'];
        $p_desc = $row['product_desc'];
        $p_price = $row['product_price'];
        $p_qty = $row['product_qty'];
        $p_cat = $row['product_cat']; // Store ID instead of string now
        $p_brand = $row['product_brand']; // Store ID instead of string now
        $p_keywords = $row['product_keywords'];
        $p_image = $row['product_image'];
        $p_image2 = $row['product_image2'];
        $p_image3 = $row['product_image3'];
    }
}

// Save/Add product logic
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['save_product'])) {
    $p_title = mysqli_real_escape_string($con, $_POST['p_title']);
    $p_desc = mysqli_real_escape_string($con, $_POST['p_desc']);
    $p_price = mysqli_real_escape_string($con, $_POST['p_price']);
    $p_cat = intval($_POST['p_cat']);
    $p_brand = intval($_POST['p_brand']);
    $p_keywords = mysqli_real_escape_string($con, $_POST['p_keywords']);
    
    // Handle images upload
    $images = [];
    $image_fields = ['p_image', 'p_image2', 'p_image3'];
    
    foreach ($image_fields as $field) {
        $img_name = "";
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] == 0) {
            $img_name = time() . "_" . $field . "_" . $_FILES[$field]['name'];
            move_uploaded_file($_FILES[$field]['tmp_name'], "../product_images/" . $img_name);
        }
        $images[$field] = $img_name;
    }
    
    $p_qty = intval($_POST['p_qty']);
    
    if ($product_id > 0) {
        // Update product
        $update_parts = [
            "product_title='$p_title'",
            "product_desc='$p_desc'",
            "product_price='$p_price'",
            "product_cat='$p_cat'",
            "product_brand='$p_brand'",
            "product_keywords='$p_keywords'",
            "product_qty='$p_qty'"
        ];
        
        if (!empty($images['p_image'])) $update_parts[] = "product_image='{$images['p_image']}'";
        if (!empty($images['p_image2'])) $update_parts[] = "product_image2='{$images['p_image2']}'";
        if (!empty($images['p_image3'])) $update_parts[] = "product_image3='{$images['p_image3']}'";
        
        $sql = "UPDATE products SET " . implode(", ", $update_parts) . " WHERE product_id=$product_id";
        mysqli_query($con, $sql) or die(mysqli_error($con));
        header("Location: products_list.php");
        exit();
    } else {
        // Add new product
        $img1 = $images['p_image'];
        $img2 = $images['p_image2'];
        $img3 = $images['p_image3'];
        $sql = "INSERT INTO products (product_cat, product_brand, product_title, product_price, product_desc, product_image, product_image2, product_image3, product_keywords, product_qty) 
                VALUES ('$p_cat', '$p_brand', '$p_title', '$p_price', '$p_desc', '$img1', '$img2', '$img3', '$p_keywords', '$p_qty')";
        mysqli_query($con, $sql) or die(mysqli_error($con));
        header("Location: products_list.php");
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $product_id ? 'Edit' : 'Add'; ?> Product - JAYVEER Commerce</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .page-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            overflow: hidden;
            margin-bottom: 20px;
        }
        .card-header-gradient {
            background: linear-gradient(90deg, #7b61ff, #5171ff);
            color: #fff;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: 500;
        }
        .form-layout {
            display: flex;
            gap: 20px;
            padding: 20px;
            max-width: 1100px;
            margin: 40px auto;
        }
        .col-main { flex: 2; }
        .col-side { flex: 1.4; } /* Increased from 1.3 */
        .card-body { padding: 25px; } /* Increased from 20px */
        .form-group { margin-bottom: 20px; } /* Increased from 15px */
        .form-group label {
            display: block;
            font-size: 14px;
            color: #888;
            margin-bottom: 5px;
            font-weight: 500;
        }
        .form-control, .form-select {
            width: 100%;
            border: 1px solid #ddd;
            padding: 12px 15px;
            border-radius: 4px;
            font-family: inherit;
            font-size: 15px;
            color: #333;
            outline: none;
            transition: 0.3s;
        }
        .form-control:focus, .form-select:focus {
            border-color: #7b61ff;
            box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.1);
        }
        .form-group label {
            font-size: 15px; /* Slightly bigger labels */
        }
        textarea.form-control {
            min-height: 100px;
            resize: vertical;
        }
        .btn-pink {
            background: #e94dd4;
            color: #fff;
            border: none;
            padding: 14px 24px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            text-transform: uppercase;
            width: 100%;
        }
        .btn-pink:hover {
            background: #d13bbc;
        }
        .file-upload-wrapper {
            display: flex;
            align-items: center;
            background: #50b85a;
            color: #fff;
            border-radius: 4px;
            padding: 10px;
            width: fit-content;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }
        .file-upload-wrapper input[type="file"] {
            display: none;
        }
        .file-upload-wrapper .btn {
            background: #fff;
            color: #333;
            padding: 4px 8px;
            border-radius: 2px;
            margin-right: 10px;
            font-size: 11px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <i class="fa-brands fa-envira text-green logo-icon"></i>
                <div><h2>JAYVEER</h2><p>COMMERCE</p></div>
            </div>

            <div class="nav-section">
                <p class="nav-title">Home Menu</p>
                <ul class="nav-list">
                    <li><a href="index.php"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
                    <li><a href="analytics.php"><i class="fa-solid fa-chart-line"></i> Analytics</a></li>
                    <li><a href="settings.php"><i class="fa-solid fa-gear"></i> Settings</a></li>
                </ul>
            </div>

            <div class="nav-section">
                <p class="nav-title">All Page</p>
                <ul class="nav-list">
                    <li class="has-child">
                        <a href="#"><i class="fa-solid fa-file-invoice"></i> Orders <span class="toggle-icon">+</span></a>
                        <ul class="sub-menu" style="display:none;"><li><span class="dot empty"></span> All Orders</li></ul>
                    </li>
                    <li class="active has-child">
                        <a href="#"><i class="fa-solid fa-box"></i> Products <span class="toggle-icon">-</span></a>
                        <ul class="sub-menu">
                            <li><a href="products_list.php" style="padding:0; color:inherit;"><span class="dot empty"></span> All Products</a></li>
                            <li class="active-sub"><span class="dot"></span> <?php echo $product_id ? 'Edit' : 'Add'; ?> Product</li>
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
                <h2>Products</h2>
                <div class="header-actions">
                    <button class="btn-icon notification"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>
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

            <div class="content-wrapper" style="padding:0; overflow-y:auto; background:#f4f7f6;">
                <form method="POST" action="edit_product.php<?php echo $product_id ? '?id='.$product_id : ''; ?>" enctype="multipart/form-data" class="form-layout">
                    <!-- Left Column -->
                    <div class="col-main">
                        <div class="page-card">
                            <div class="card-header-gradient">
                                <?php echo $product_id ? 'Edit' : 'Add New'; ?> Product
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label>Product Title</label>
                                    <input type="text" name="p_title" class="form-control" value="<?php echo htmlspecialchars($p_title); ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Product Images</label>
                                    <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                                        <label class="file-upload-wrapper" style="width: 100%;">
                                            <span class="btn">Image 1</span> NO FILE CHOSEN
                                            <input type="file" name="p_image" <?php echo $product_id ? '' : 'required'; ?>>
                                        </label>
                                        <label class="file-upload-wrapper" style="width: 100%;">
                                            <span class="btn">Image 2</span> NO FILE CHOSEN
                                            <input type="file" name="p_image2">
                                        </label>
                                        <label class="file-upload-wrapper" style="width: 100%;">
                                            <span class="btn">Image 3</span> NO FILE CHOSEN
                                            <input type="file" name="p_image3">
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea name="p_desc" class="form-control" required><?php echo htmlspecialchars($p_desc); ?></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Pricing</label>
                                    <input type="text" name="p_price" class="form-control" value="<?php echo htmlspecialchars($p_price); ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Quantity (Stock)</label>
                                    <input type="text" name="p_qty" class="form-control" value="<?php echo htmlspecialchars($p_qty); ?>">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="col-side">
                        <div class="page-card">
                            <div class="card-header-gradient">Categories</div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label>Product Category</label>
                                    <select name="p_cat" class="form-select" required>
                                        <option value="">Select Category</option>
                                        <?php
                                        $cat_q = mysqli_query($con, "SELECT * FROM categories");
                                        while($cat_r = mysqli_fetch_assoc($cat_q)){
                                            $sel = ($cat_r['cat_id'] == $p_cat) ? 'selected' : '';
                                            echo "<option value='{$cat_r['cat_id']}' {$sel}>{$cat_r['cat_title']}</option>";
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Product Brand</label>
                                    <select name="p_brand" class="form-select" required>
                                        <option value="">Select Brand</option>
                                        <?php
                                        $brnd_q = mysqli_query($con, "SELECT * FROM brands");
                                        while($brnd_r = mysqli_fetch_assoc($brnd_q)){
                                            $sel = ($brnd_r['brand_id'] == $p_brand) ? 'selected' : '';
                                            echo "<option value='{$brnd_r['brand_id']}' {$sel}>{$brnd_r['brand_title']}</option>";
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Product Keywords</label>
                                    <input type="text" name="p_keywords" class="form-control" value="<?php echo htmlspecialchars($p_keywords); ?>" required>
                                </div>
                            </div>
                        </div>
                        <button type="submit" name="save_product" class="btn-pink"><?php echo $product_id ? 'UPDATE' : 'SAVE'; ?> PRODUCT</button>
                    </div>
                </form>
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
            
            // Dynamic text update for file input labels
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.addEventListener('change', function() {
                    if(this.files && this.files.length > 0) {
                        this.parentElement.childNodes[2].nodeValue = " " + this.files[0].name;
                    }
                });
            });
        });
    </script>
</body>
</html>
