<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include "../db.php";
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Admin';

// Fetch real stats
$sales_res = mysqli_query($con, "SELECT SUM(total_amt) as total FROM orders_info");
$sales_row = mysqli_fetch_assoc($sales_res);
$total_sales = $sales_row['total'] ?? 0;

$cust_res = mysqli_query($con, "SELECT COUNT(*) as total FROM user_info");
$cust_row = mysqli_fetch_assoc($cust_res);
$total_customers = $cust_row['total'] ?? 0;

$prod_res = mysqli_query($con, "SELECT COUNT(*) as total FROM products");
$prod_row = mysqli_fetch_assoc($prod_res);
$total_products = $prod_row['total'] ?? 0;

$order_res = mysqli_query($con, "SELECT COUNT(*) as total FROM orders_info");
$order_row = mysqli_fetch_assoc($order_res);
$total_orders = $order_row['total'] ?? 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - JAYVEER Commerce</title>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="analytics.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <i class="fa-brands fa-envira text-green logo-icon"></i>
                <div>
                    <h2>JAYVEER</h2>
                    <p>COMMERCE</p>
                </div>
            </div>

            <div class="nav-section">
                <p class="nav-title">Home Menu</p>
                <ul class="nav-list">
                    <li><a href="index.php"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
                    <li class="active"><a href="analytics.php"><i class="fa-solid fa-chart-line"></i> Analytics</a></li>
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
                    <li><a href="categories.php"><i class="fa-solid fa-layer-group"></i> Category</a></li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <h2>Analytics Overview</h2>
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

            <div class="analytics-content">
                <!-- Top Row Cards -->
                <div class="analytics-grid top-row">
                    <!-- Ratings Card -->
                    <div class="card ratings-card">
                        <div class="card-body">
                            <div class="card-info">
                                <h3>Ratings</h3>
                                <div class="stat-value">13k <span class="trend positive">+38%</span></div>
                                <span class="badge-pill">Year of 2021</span>
                            </div>
                            <div class="card-image">
                                <img src="https://demos.themeselection.com/materio-bootstrap-html-admin-template/assets/img/illustrations/illustration-john-2.png" alt="illustration">
                            </div>
                        </div>
                    </div>

                    <!-- Sessions Card -->
                    <div class="card sessions-card">
                        <div class="card-body">
                            <div class="card-info">
                                <h3>Sessions</h3>
                                <div class="stat-value">24.5k <span class="trend negative">-22%</span></div>
                                <span class="badge-pill">Last Week</span>
                            </div>
                            <div class="card-image">
                                <img src="https://demos.themeselection.com/materio-bootstrap-html-admin-template/assets/img/illustrations/illustration-john-1.png" alt="illustration">
                            </div>
                        </div>
                    </div>

                    <!-- Statistics Card -->
                    <div class="card stats-main-card">
                        <div class="card-header">
                            <h3>Statistics Card</h3>
                            <p>Total 48.5% growth 😍 this month</p>
                            <button class="btn-more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <div class="stats-row">
                            <div class="stat-item sales">
                                <div class="icon-box"><i class="fa-solid fa-chart-line"></i></div>
                                <div class="stat-details">
                                    <span class="label">Sales</span>
                                    <span class="value"><?php echo number_format($total_sales / 1000, 1); ?>k</span>
                                </div>
                            </div>
                            <div class="stat-item customers">
                                <div class="icon-box"><i class="fa-solid fa-user"></i></div>
                                <div class="stat-details">
                                    <span class="label">Customers</span>
                                    <span class="value"><?php echo number_format($total_customers / 1000, 1); ?>k</span>
                                </div>
                            </div>
                            <div class="stat-item products">
                                <div class="icon-box"><i class="fa-solid fa-box"></i></div>
                                <div class="stat-details">
                                    <span class="label">Product</span>
                                    <span class="value"><?php echo $total_products; ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Middle Row Charts -->
                <div class="analytics-grid middle-row">
                    <!-- Total Sales Graph -->
                    <div class="card chart-card">
                        <div class="card-header">
                            <h3>Total Sales</h3>
                            <div class="stat-value"><?php echo rupee($total_sales); ?> <span class="trend positive">25.8%</span></div>
                            <button class="btn-more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <div class="chart-container">
                            <canvas id="totalSalesChart"></canvas>
                        </div>
                    </div>

                    <!-- Revenue Report -->
                    <div class="card chart-card">
                        <div class="card-header">
                            <h3>Revenue Report</h3>
                            <span class="badge-pill">This Year</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="revenueReportChart"></canvas>
                        </div>
                        <div class="chart-legend">
                            <span class="legend-item"><span class="dot earning"></span> Earning</span>
                            <span class="legend-item"><span class="dot expense"></span> Expense</span>
                        </div>
                    </div>

                    <!-- Sales Overview -->
                    <div class="card chart-card sales-overview">
                        <div class="card-header">
                            <h3>Sales Overview</h3>
                            <button class="btn-more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <div class="overview-content">
                            <div class="donut-container">
                                <canvas id="salesOverviewChart"></canvas>
                                <div class="donut-label">
                                    <span class="val">104.5k</span>
                                    <span class="txt">Weekly Visits</span>
                                </div>
                            </div>
                            <div class="overview-stats">
                                <div class="total-sales-amount">
                                    <div class="icon-box-small"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                                    <div class="details">
                                        <p>Total Revenue</p>
                                        <h3><?php echo rupee($total_sales); ?></h3>
                                    </div>
                                </div>
                                <div class="category-breakdown">
                                    <?php
                                    $cat_breakdown = mysqli_query($con, "SELECT c.cat_title, COUNT(p.product_id) as count FROM categories c LEFT JOIN products p ON c.cat_id = p.product_cat GROUP BY c.cat_id LIMIT 4");
                                    $colors = ['apparel', 'electronics', 'fmcg', 'other'];
                                    $i = 0;
                                    while($cb = mysqli_fetch_assoc($cat_breakdown)) {
                                        $color = $colors[$i % 4];
                                        echo "<div class='cat-item'><span class='dot $color'></span> {$cb['cat_title']} <span>{$cb['count']} Products</span></div>";
                                        $i++;
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Row -->
                <div class="analytics-grid bottom-row">
                    <!-- Activity Timeline -->
                    <div class="card activity-card">
                        <div class="card-header">
                            <h3>Activity Timeline</h3>
                            <button class="btn-more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <div class="timeline">
                            <div class="timeline-item">
                                <span class="timeline-dot red"></span>
                                <div class="timeline-content">
                                    <div class="timeline-header">
                                        <h4>8 Invoices have been paid</h4>
                                        <span class="time">Wednesday</span>
                                    </div>
                                    <p>Invoices have been paid to the company.</p>
                                    <div class="file-attachment">
                                        <i class="fa-solid fa-file-pdf"></i>
                                        <span>invoice.pdf</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Weekly Sales -->
                    <div class="card weekly-sales-card">
                        <div class="card-header">
                            <h3>Weekly Sales</h3>
                            <p>Total 85.4k Sales</p>
                            <button class="btn-more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <div class="chart-container-small">
                            <canvas id="weeklySalesChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card mini-chart-card">
                        <div class="card-body">
                           <div class="val">42.5k</div>
                           <div class="chart-mini">
                               <canvas id="tinyChart"></canvas>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Charts Initialization
        const ctxSales = document.getElementById('totalSalesChart').getContext('2d');
        new Chart(ctxSales, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: [10, 18, 12, 19, 15, 22],
                    borderColor: '#9155fd',
                    backgroundColor: 'rgba(145, 85, 253, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: true }, y: { display: false } }
            }
        });

        const ctxRev = document.getElementById('revenueReportChart').getContext('2d');
        new Chart(ctxRev, {
            type: 'bar',
            data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [
                    { label: 'Earning', data: [12, 19, 3, 5, 2, 3, 9], backgroundColor: '#56ca00' },
                    { label: 'Expense', data: [8, 11, 5, 8, 3, 7, 5], backgroundColor: '#8a8d93' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: true }, y: { display: false } }
            }
        });

        const ctxOverview = document.getElementById('salesOverviewChart').getContext('2d');
        new Chart(ctxOverview, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [30, 20, 25, 25],
                    backgroundColor: ['#9155fd', '#56ca00', '#16b1ff', '#ffb400'],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        // Weekly Sales
        const ctxWeekly = document.getElementById('weeklySalesChart').getContext('2d');
        new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                datasets: [{
                    data: [40, 60, 50, 90, 70, 80, 100],
                    backgroundColor: '#9155fd',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });

        const ctxTiny = document.getElementById('tinyChart').getContext('2d');
        new Chart(ctxTiny, {
            type: 'line',
            data: {
                labels: [1, 2, 3, 4, 5],
                datasets: [{
                    data: [5, 10, 8, 15, 12],
                    borderColor: '#56ca00',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });

        // Toggle Sidebar menus
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
    </script>
</body>
</html>
