<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

// Handle Delete Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_product_id'])) {
    $product_id = intval($_POST['delete_product_id']);
    $stmt1 = mysqli_prepare($con, "DELETE FROM wishlist WHERE p_id = ?");
    mysqli_stmt_bind_param($stmt1, "i", $product_id);
    mysqli_stmt_execute($stmt1);

    $stmt2 = mysqli_prepare($con, "DELETE FROM cart WHERE p_id = ?");
    mysqli_stmt_bind_param($stmt2, "i", $product_id);
    mysqli_stmt_execute($stmt2);

    $stmt3 = mysqli_prepare($con, "DELETE FROM reviews WHERE product_id = ?");
    mysqli_stmt_bind_param($stmt3, "i", $product_id);
    mysqli_stmt_execute($stmt3);

    $stmt4 = mysqli_prepare($con, "DELETE FROM products WHERE product_id = ?");
    mysqli_stmt_bind_param($stmt4, "i", $product_id);
    mysqli_stmt_execute($stmt4);

    header("Location: products_list.php");
    exit();
}

// Fetch categories for filter
$cat_res = mysqli_query($con, "SELECT * FROM categories");

// Filter logic
$where_clause = "";
$cat_filter = isset($_GET['cat']) ? intval($_GET['cat']) : 0;
$search_filter = isset($_GET['search']) ? mysqli_real_escape_string($con, $_GET['search']) : "";

if ($cat_filter > 0) {
    $where_clause .= " AND p.product_cat = $cat_filter";
}
if (!empty($search_filter)) {
    $where_clause .= " AND p.product_title LIKE '%$search_filter%'";
}

// Fetch products
$sql = "SELECT p.*, c.cat_title, b.brand_title FROM products p 
        LEFT JOIN categories c ON p.product_cat = c.cat_id 
        LEFT JOIN brands b ON p.product_brand = b.brand_id 
        WHERE 1=1 $where_clause
        ORDER BY p.product_id DESC";
$result = mysqli_query($con, $sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products List - NexusMart Enterprise</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .list-container {
            padding: 24px;
            background: #fff;
            margin: 20px;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
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
                    <li><a href="settings.php"><i class="fa-solid fa-gear"></i> Settings</a></li>
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
                    <li class="active has-child">
                        <a href="#"><i class="fa-solid fa-box"></i> Products <span class="toggle-icon">-</span></a>
                        <ul class="sub-menu">
                            <li class="active-sub"><span class="dot"></span> All Products</li>
                            <li><a href="edit_product.php" style="padding:0; color:inherit; display:inline;"><span class="dot empty"></span> Add Product</a></li>
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
                <h2>Products List</h2>
                <div class="header-actions">
                    <button class="btn-icon notification"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>
                    <div class="user-profile">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Admin">
                        <div class="user-info">
                            <h4><?php echo htmlspecialchars($admin_name); ?></h4>
                            <p>Admin</p>
                        </div>
                    </div>
                    <a href="logout.php" class="btn-icon" style="text-decoration:none; color:inherit; color:#ff4d4f;" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
                </div>
            </header>

            <div class="content-wrapper" style="display: block; overflow-y: auto;">
                <div class="list-container">
                    <div class="filters" style="margin-bottom: 30px;">
                        <div class="filter-tabs" style="display: flex; align-items: center; gap: 15px;">
                            <button class="tab active">All Products</button>
                            <button class="tab">Newest</button>
                            <button class="tab">Recent Sales</button>
                            
                            <!-- Category Filter Dropdown -->
                            <select onchange="location.href='products_list.php?cat='+this.value+'&search=<?php echo urlencode($search_filter); ?>'" style="padding: 8px 12px; border-radius: 20px; border: 1px solid #ddd; outline: none; font-family: inherit; color: #555; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer;">
                                <option value="0">All Categories</option>
                                <?php 
                                mysqli_data_seek($cat_res, 0);
                                while($c_row = mysqli_fetch_assoc($cat_res)) {
                                    $selected = ($cat_filter == $c_row['cat_id']) ? "selected" : "";
                                    echo "<option value='{$c_row['cat_id']}' $selected>{$c_row['cat_title']}</option>";
                                }
                                ?>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <form action="products_list.php" method="GET" class="search-bar">
                                <input type="text" name="search" placeholder="Search" value="<?php echo htmlspecialchars($search_filter); ?>">
                                <button type="submit" style="background:transparent; border:none;"><i class="fa-solid fa-search"></i></button>
                            </form>
                            <a href="edit_product.php" class="btn-grid-green" style="padding: 10px 20px; border-radius: 20px; white-space: nowrap;"><i class="fa-solid fa-plus"></i> ADD NEW</a>
                        </div>
                    </div>

                    <div class="product-grid">
                        <?php
                        if($result && mysqli_num_rows($result) > 0) {
                            while($p_row = mysqli_fetch_assoc($result)) {
                                $img = $p_row['product_image'];
                                $img_path = "../product_images/{$img}";
                                if(!file_exists($img_path)) $img_path = "../img/{$img}";
                                
                                $price = number_format($p_row['product_price'], 0);
                                $title = $p_row['product_title'];
                                if(strlen($title) > 25) $title = substr($title, 0, 22) . "...";
                                ?>
                                <div class="product-card">
                                    <button class="view-btn"><i class="fa-regular fa-eye"></i></button>
                                    <img src="<?php echo $img_path; ?>" alt="Product" class="product-img">
                                    <h4 class="product-title"><?php echo $title; ?></h4>
                                    <p class="stock-info"><span class="in-stock">In Stock : <?php echo $p_row['product_qty']; ?></span> <?php echo $p_row['brand_title']; ?></p>
                                    <div class="colors">
                                        <span class="color" style="background: red;"></span>
                                        <span class="color" style="background: blue;"></span>
                                        <span class="color" style="background: green;"></span>
                                        <span class="color" style="background: black;"></span>
                                    </div>
                                    
                                    <div class="card-actions-hover">
                                        <a href="edit_product.php?id=<?php echo $p_row['product_id']; ?>" class="btn-grid-green">EDIT</a>
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this product?');">
                                            <input type="hidden" name="delete_product_id" value="<?php echo $p_row['product_id']; ?>">
                                            <button type="submit" class="btn-grid-red" style="border:none; cursor:pointer;">DELETE</button>
                                        </form>
                                    </div>
                                </div>
                                <?php
                            }
                        } else {
                            echo "<p>No products found in database.</p>";
                        }
                        ?>
                    </div>
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
        });
    </script>
</body>
</html>
