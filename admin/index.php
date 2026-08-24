<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

// Handle Delete from Grid
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_product_id'])) {
    $pid = intval($_POST['delete_product_id']);
    $stmt1 = mysqli_prepare($con, "DELETE FROM wishlist WHERE p_id = ?");
    mysqli_stmt_bind_param($stmt1, "i", $pid);
    mysqli_stmt_execute($stmt1);

    $stmt2 = mysqli_prepare($con, "DELETE FROM cart WHERE p_id = ?");
    mysqli_stmt_bind_param($stmt2, "i", $pid);
    mysqli_stmt_execute($stmt2);

    $stmt3 = mysqli_prepare($con, "DELETE FROM reviews WHERE product_id = ?");
    mysqli_stmt_bind_param($stmt3, "i", $pid);
    mysqli_stmt_execute($stmt3);

    $stmt4 = mysqli_prepare($con, "DELETE FROM products WHERE product_id = ?");
    mysqli_stmt_bind_param($stmt4, "i", $pid);
    mysqli_stmt_execute($stmt4);

    header("Location: index.php");
    exit();
}

// Fetch Stats
$revenue_res = mysqli_query($con, "SELECT SUM(total_amt) as total FROM orders_info");
$rev_row = mysqli_fetch_assoc($revenue_res);
$total_rev = $rev_row['total'] ?? 0;

$orders_res = mysqli_query($con, "SELECT COUNT(*) as total FROM orders_info");
$ord_row = mysqli_fetch_assoc($orders_res);
$total_ords = $ord_row['total'] ?? 0;

$oos_res = mysqli_query($con, "SELECT COUNT(*) as total FROM products WHERE product_qty <= 0");
$oos_row = mysqli_fetch_assoc($oos_res);
$oos_count = $oos_row['total'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusMart Enterprise - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
                    <li class="active has-child">
                        <a href="#"><i class="fa-solid fa-file-invoice"></i> Orders <span class="toggle-icon">-</span></a>
                        <ul class="sub-menu">
                            <li class="active-sub"><span class="dot"></span> All Orders</li>
                            <li><span class="dot empty"></span> Order Placed <span class="badge">10</span></li>
                            <li><span class="dot empty"></span> Packaging <span class="badge warning">10</span></li>
                            <li><span class="dot empty"></span> Shipping <span class="badge primary">10</span></li>
                            <li><span class="dot empty"></span> Delivered <span class="badge success">10</span></li>
                            <li><span class="dot empty"></span> Cancel <span class="badge danger">10</span></li>
                            <li><span class="dot empty"></span> Returned <span class="badge danger">10</span></li>
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

        <!-- Main Content (Left column) -->
        <main class="main-content">
            <header class="top-header">
                <h2>Dashboard</h2>
                <div class="header-actions">
                    <button class="btn-icon btn-green"><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="btn-icon"><i class="fa-solid fa-border-all"></i></button>
                    <button class="btn-icon notification" title="<?php echo $oos_count; ?> Out of Stock Items">
                        <i class="fa-regular fa-bell"></i>
                        <?php if ($oos_count > 0): ?>
                            <span class="dot" style="width:16px; height:16px; background:#ff4d4f; color:white; font-size:10px; display:flex; align-items:center; justify-content:center; top:-5px; right:-5px; font-weight:bold;"><?php echo $oos_count; ?></span>
                        <?php endif; ?>
                    </button>
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

            <div class="content-wrapper" style="display:block; overflow-y:auto; padding:30px;">
                
                <!-- Quick Stats -->
                <div style="display:flex; gap:20px; margin-bottom:30px;">
                    <div style="flex:1; background:white; padding:20px; border-radius:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-left: 5px solid #20c96c;">
                        <p style="font-size:12px; font-weight:600; color:#888; text-transform:uppercase; margin-bottom:5px;">Total Earnings</p>
                        <h2 style="color:#111; font-weight:700;"><?php echo rupee($total_rev); ?></h2>
                    </div>
                    <div style="flex:1; background:white; padding:20px; border-radius:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-left: 5px solid #3b82f6;">
                        <p style="font-size:12px; font-weight:600; color:#888; text-transform:uppercase; margin-bottom:5px;">Total Orders</p>
                        <h2 style="color:#111; font-weight:700;"><?php echo $total_ords; ?></h2>
                    </div>
                </div>

                <?php if ($oos_count > 0): ?>
                <!-- Stock Alerts -->
                <div style="background: #fff5f5; padding: 20px; border-radius: 15px; border: 1px solid #ffcccc; margin-bottom: 30px;">
                    <h4 style="color: #c53030; margin-bottom: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> Stock Alerts</h4>
                    <ul style="list-style:none; padding:0; font-size:14px; color:#c53030;">
                        <?php
                        $oos_list = mysqli_query($con, "SELECT product_id, product_title FROM products WHERE product_qty <= 0 LIMIT 5");
                        while($item = mysqli_fetch_assoc($oos_list)) {
                            echo "<li>• <a href='edit_product.php?id={$item['product_id']}' style='color:#c53030; text-decoration:underline;'><strong>{$item['product_title']}</strong></a> is out of stock!</li>";
                        }
                        ?>
                    </ul>
                </div>
                <?php endif; ?>

                <!-- Products Grid Section -->
                <div class="products-section" style="box-shadow:none; padding:0;">
                    <div class="filters">
                        <div class="filter-tabs">
                            <button class="tab active">All Products</button>
                            <button class="tab">Newest</button>
                            <button class="tab">Recent Sales</button>
                        </div>
                        <div class="search-bar">
                            <input type="text" placeholder="Search">
                            <i class="fa-solid fa-search"></i>
                        </div>
                    </div>

                    <div class="product-grid">
                        <?php
                        $p_sql = "SELECT p.*, c.cat_title, b.brand_title FROM products p 
                                 LEFT JOIN categories c ON p.product_cat = c.cat_id 
                                 LEFT JOIN brands b ON p.product_brand = b.brand_id 
                                 ORDER BY p.product_id DESC LIMIT 12";
                        $p_res = mysqli_query($con, $p_sql);
                        if($p_res && mysqli_num_rows($p_res) > 0) {
                            while($p_row = mysqli_fetch_assoc($p_res)) {
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

    <!-- Interactive scripts -->
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
            
            // Set initial state based on active classes
            document.querySelectorAll('.has-child').forEach(li => {
                const subMenu = li.querySelector('.sub-menu');
                const toggleIcon = li.querySelector('.toggle-icon');
                if (!li.classList.contains('active')) {
                    if(subMenu) subMenu.style.display = 'none';
                    if(toggleIcon) toggleIcon.innerText = '+';
                } else {
                    if(subMenu) subMenu.style.display = 'block';
                    if(toggleIcon) toggleIcon.innerText = '-';
                }
            });
        });
    </script>
</body>
</html>
