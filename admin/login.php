<?php
require_once dirname(__DIR__) . "/session_bootstrap.php";
if (isset($_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "../db.php";
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql_admin = "SELECT * FROM admin_info WHERE admin_email = ? LIMIT 1";
    $stmt_admin = mysqli_prepare($con, $sql_admin);
    if ($stmt_admin) {
        mysqli_stmt_bind_param($stmt_admin, "s", $email);
        mysqli_stmt_execute($stmt_admin);
        $res_admin = mysqli_stmt_get_result($stmt_admin);

        if (mysqli_num_rows($res_admin) == 1) {
            $row = mysqli_fetch_assoc($res_admin);
            $admin_pass = $row["admin_password"];
            if (password_verify($password, $admin_pass) || md5($password) === $admin_pass || $password === $admin_pass) {
                $_SESSION["admin_id"] = $row["admin_id"];
                $_SESSION["admin_name"] = $row["admin_name"];
                header("Location: index.php");
                exit();
            }
            else {
                $error = "Invalid password.";
            }
        }
        else {
            $error = "No admin found with that email.";
        }
    }
    else {
        $error = "Database error.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - JAYVEER Commerce</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #20c96c;
            --bg-dark: #0a0e17;
            --text-dark: #1e293b;
            --border-color: #eaeaea;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { 
            background: #f4f7f6;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .login-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
        }
        .logo i { font-size: 32px; color: var(--primary); }
        .logo h2 { font-size: 20px; font-weight: 700; color: var(--text-dark); line-height: 1; }
        .logo p { font-size: 11px; letter-spacing: 2px; color: #888; margin-top: 5px; font-weight: 600;}
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 8px;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 14px;
            transition: 0.3s;
            outline: none;
        }
        .form-group input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(32, 201, 108, 0.1);
        }
        .btn-login {
            background: var(--primary);
            color: white;
            border: none;
            width: 100%;
            padding: 14px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 10px;
        }
        .btn-login:hover {
            background: #1aa056;
        }
        .error {
            background: #ffe3e3;
            color: #d13030;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

<div class="login-box">
    <div class="logo">
        <i class="fa-brands fa-envira"></i>
        <div>
            <h2>JAYVEER</h2>
            <p>COMMERCE</p>
        </div>
    </div>
    
    <?php if ($error): ?>
    <div class="error"><?php echo htmlspecialchars($error); ?></div>
    <?php
endif; ?>

    <form method="POST" action="login.php">
        <div class="form-group">
            <label>Admin Email</label>
            <input type="email" name="email" required placeholder="admin@example.com">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn-login">Secure Login</button>
    </form>
</div>

</body>
</html>
