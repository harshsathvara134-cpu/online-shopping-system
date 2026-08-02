<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

// Handle Add Category
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_category'])) {
    $cat_title = mysqli_real_escape_string($con, $_POST['cat_title']);
    if (!empty($cat_title)) {
        mysqli_query($con, "INSERT INTO categories (cat_title) VALUES ('$cat_title')");
    }
    header("Location: categories.php");
    exit();
}

// Handle Update Category
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_category'])) {
    $cat_id = intval($_POST['cat_id']);
    $cat_title = mysqli_real_escape_string($con, $_POST['cat_title']);
    if (!empty($cat_title) && $cat_id > 0) {
        mysqli_query($con, "UPDATE categories SET cat_title = '$cat_title' WHERE cat_id = $cat_id");
    }
    header("Location: categories.php");
    exit();
}

// Handle Delete Category
if (isset($_GET['delete'])) {
    $cat_id = intval($_GET['delete']);
    mysqli_query($con, "DELETE FROM categories WHERE cat_id = $cat_id");
    header("Location: categories.php");
    exit();
}

// Fetch Categories
$sql = "SELECT * FROM categories ORDER BY cat_id DESC";
$result = mysqli_query($con, $sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categories - NexusMart Enterprise</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .page-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            overflow: hidden;
            margin: 20px;
            width: calc(100% - 40px);
        }
        .card-header-gradient {
            background: linear-gradient(90deg, #7b61ff, #5171ff);
            color: #fff;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: 500;
        }
        .card-body {
            padding: 20px;
        }
        /* Add Form */
        .add-category-form {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .add-category-form .form-control {
            flex: 1;
            border: 1px solid #eaeaea;
            padding: 12px 15px;
            border-radius: 4px;
            outline: none;
            font-family: inherit;
            font-size: 14px;
            color: #555;
            transition: 0.3s;
        }
        .add-category-form .form-control:focus {
            border-color: #7b61ff;
        }
        .btn-pink {
            background: #e94dd4;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            text-transform: uppercase;
        }
        .btn-pink:hover {
            background: #d13bbc;
        }
        /* Table */
        .category-table {
            width: 100%;
            border-collapse: collapse;
        }
        .category-table th, .category-table td {
            padding: 15px 20px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
        }
        .category-table th {
            color: #888;
            font-weight: 500;
            font-size: 14px;
        }
        .category-table td {
            font-size: 14px;
            color: #555;
        }
        
        .update-form {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .update-input {
            border: 1px solid #eaeaea;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: inherit;
            font-size: 14px;
            color: #555;
            width: 250px;
            outline: none;
        }
        .update-input:focus {
            border-color: #0dcaf0;
        }
        .btn-cyan {
            background: #50b85a;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 800;
            font-size: 11px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .btn-cyan:hover {
            background: #43a04b;
        }
        .btn-red {
            background: #f44336;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 800;
            font-size: 11px;
            cursor: pointer;
            text-decoration: none;
            text-transform: uppercase;
            display: inline-block;
            letter-spacing: 0.5px;
        }
        .btn-red:hover {
            background: #e53935;
        }
        .actions-cell {
            text-align: right;
        }
        .category-table th.actions-col {
            text-align: right;
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
                    <li class="has-child">
                        <a href="#"><i class="fa-solid fa-box"></i> Products <span class="toggle-icon">+</span></a>
                        <ul class="sub-menu" style="display:none;">
                            <li><a href="products_list.php" style="padding:0; color:inherit;"><span class="dot empty"></span> All Products</a></li>
                            <li><a href="edit_product.php" style="padding:0; color:inherit;"><span class="dot empty"></span> Add Product</a></li>
                        </ul>
                    </li>
                    <li><a href="#"><i class="fa-solid fa-ticket"></i> Coupon</a></li>
                    <li><a href="brands.php"><i class="fa-solid fa-tags"></i> Brands</a></li>
                    <li class="active"><a href="categories.php"><i class="fa-solid fa-layer-group"></i> Category</a></li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <h2>Categories</h2>
                <div class="header-actions">
                    <button class="btn-icon btn-green"><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="btn-icon"><i class="fa-solid fa-border-all"></i></button>
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

            <div class="content-wrapper" style="padding:0; overflow-y:auto; background:#f4f7f6; display: block;">
                <!-- Add New Category Form -->
                <div class="page-card">
                    <div class="card-header-gradient">
                        Add New Category
                    </div>
                    <div class="card-body">
                        <form method="POST" action="categories.php" class="add-category-form">
                            <input type="text" name="cat_title" class="form-control" placeholder="Category Name" required>
                            <button type="submit" name="add_category" class="btn-pink">ADD CATEGORY</button>
                        </form>
                    </div>
                </div>

                <!-- Categories List -->
                <div class="page-card">
                    <div class="card-header-gradient">
                        Categories List
                    </div>
                    <table class="category-table">
                        <thead>
                            <tr>
                                <th width="10%">ID</th>
                                <th width="60%">Category Name</th>
                                <th width="30%" class="actions-col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $id = $row['cat_id'];
        $title = htmlspecialchars($row['cat_title']);
        echo "<tr>";
        echo "<td>{$id}</td>";
        echo "<td>
                                            <form method='POST' action='categories.php' class='update-form'>
                                                <input type='hidden' name='cat_id' value='{$id}'>
                                                <input type='text' name='cat_title' value='{$title}' class='update-input' required>
                                                                                                 <button type='submit' name='update_category' class='btn-cyan'>EDIT</button>
                                            </form>
                                          </td>";
        echo "<td class='actions-cell'>
                                            <a href='categories.php?delete={$id}' onclick='return confirm(\"Are you sure you want to delete this category?\");' class='btn-red'>DELETE</a>
                                          </td>";
        echo "</tr>";
    }
}
else {
    echo "<tr><td colspan='3'>No categories found</td></tr>";
}
?>
                        </tbody>
                    </table>
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
