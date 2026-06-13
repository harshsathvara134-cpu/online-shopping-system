<?php
require_once __DIR__ . "/session_bootstrap.php";
if(isset($_SESSION["uid"])){
	header('Location:index.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Register Page</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Google font -->
<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet"/>
<!-- Bootstrap -->
<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css"/>
<!-- Font Awesome Icon -->
<link rel="stylesheet" href="css/font-awesome.min.css">

<style>
    body {
        margin: 0;
        padding: 0;
        background-color: #f1f3f6;
        font-family: 'Roboto', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }
    .fk-login-container {
        display: flex;
        width: 800px;
        min-height: 520px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.25);
        border-radius: 4px;
        overflow: hidden;
        margin: 20px 0;
    }
    .fk-left-panel {
        background-color: #2874f0;
        width: 40%;
        padding: 40px 33px;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .fk-left-panel h2 {
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 15px;
        margin-top: 0;
    }
    .fk-left-panel p {
        font-size: 18px;
        line-height: 1.5;
        color: #dbdbdb;
    }
    .fk-left-panel .illustration {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 30px;
        left: 0;
    }
    .fk-right-panel {
        width: 60%;
        padding: 50px 35px 30px;
        position: relative;
        overflow-y: auto;
        max-height: 80vh;
    }
    .fk-input-group {
        margin-bottom: 25px;
        position: relative;
    }
    .fk-input {
        width: 100%;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        padding: 10px 0;
        font-size: 15px;
        outline: none;
        color: #000;
        background: transparent;
    }
    .fk-input:focus {
        border-bottom: 1px solid #2874f0;
    }
    .fk-terms {
        font-size: 12px;
        color: #878787;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .fk-terms a {
        color: #2874f0;
        text-decoration: none;
    }
    .fk-btn {
        background: #fb641b;
        color: #fff;
        width: 100%;
        border: none;
        padding: 14px;
        font-weight: 500;
        font-size: 15px;
        cursor: pointer;
        border-radius: 2px;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.2);
        margin-bottom: 15px;
        text-transform: uppercase;
    }
    .fk-btn:hover {
        background: #f75d10;
    }
    .fk-btn-white {
        background: #fff;
        color: #2874f0;
        width: 100%;
        border: 1px solid #dbdbdb;
        padding: 14px;
        font-weight: 500;
        font-size: 15px;
        cursor: pointer;
        border-radius: 2px;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
        display: block;
        text-align: center;
        text-decoration: none;
    }
    .fk-btn-white:hover {
        text-decoration: none;
        color: #2874f0;
        background: #fcfcfc;
    }
    .row-inputs {
        display: flex;
        gap: 15px;
    }
    .row-inputs .fk-input-group {
        flex: 1;
    }
    
    #toast {
        visibility: hidden;
        min-width: 250px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 2px;
        padding: 16px;
        position: fixed;
        z-index: 1000;
        left: 50%;
        bottom: 30px;
        font-size: 17px;
        transform: translateX(-50%);
    }
    #toast.show {
        visibility: visible;
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
    @-webkit-keyframes fadein {
        from {bottom: 0; opacity: 0;} 
        to {bottom: 30px; opacity: 1;}
    }
    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }
    @-webkit-keyframes fadeout {
        from {bottom: 30px; opacity: 1;} 
        to {bottom: 0; opacity: 0;}
    }
    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
</style>
</head>
<body>
    <div id="toast"><div id="desc">login desc</div></div>
    
    <div class="fk-login-container">
        <!-- Left Panel -->
        <div class="fk-left-panel">
            <div>
                <h2>Looks like you're new here!</h2>
                <p>Sign up in a few simple steps to get started</p>
            </div>
            
            <div class="illustration">
                <!-- Using a generic placeholder image block for the illustration -->
                <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="50" width="100" height="70" rx="4" fill="#fff" opacity="0.9"/>
                    <rect x="60" y="60" width="80" height="45" fill="#e0e0e0"/>
                    <circle cx="100" cy="82" r="10" fill="#a0a0a0"/>
                    <path d="M85 105 Q100 90 115 105" stroke="#a0a0a0" stroke-width="4" fill="none" stroke-linecap="round"/>
                    <rect x="40" y="120" width="120" height="5" fill="#f0f0f0"/>
                    <circle cx="40" cy="40" r="12" fill="#ffc107"/> <!-- Sun icon -->
                    <path d="M45 45 Q50 35 60 35 Q70 35 75 45 Q85 45 85 55 L35 55 Q35 45 45 45" fill="#205bbb"/> <!-- Cloud -->
                </svg>
            </div>
        </div>
        
        <!-- Right Panel -->
        <div class="fk-right-panel">
            <form id="signup_form" onsubmit="return false">
                <div class="row-inputs">
                    <div class="fk-input-group">
                        <input class="fk-input" type="text" name="f_name" id="f_name" placeholder="First Name" required>
                    </div>
                    <div class="fk-input-group">
                        <input class="fk-input" type="text" name="l_name" id="l_name" placeholder="Last Name" required>
                    </div>
                </div>

                <div class="fk-input-group">
                    <input class="fk-input" type="email" name="email" placeholder="Enter Email Address" required>
                </div>

                <div class="fk-input-group">
                    <input class="fk-input" type="text" name="mobile" id="mobile" placeholder="Enter Mobile Number" required>
                </div>

                <div class="row-inputs">
                    <div class="fk-input-group">
                        <input class="fk-input" type="password" name="password" id="password" placeholder="Create Password" required>
                    </div>
                    <div class="fk-input-group">
                        <input class="fk-input" type="password" name="repassword" id="repassword" placeholder="Repeat Password" required>
                    </div>
                </div>

                <div class="row-inputs">
                    <div class="fk-input-group">
                        <input class="fk-input" type="text" name="address1" id="address1" placeholder="Address" required>
                    </div>
                    <div class="fk-input-group">
                        <input class="fk-input" type="text" name="address2" id="address2" placeholder="City" required>
                    </div>
                </div>
                
                <p class="fk-terms">
                    By continuing, you agree to Website's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
                
                <button class="fk-btn" type="submit">CONTINUE</button>
                <a href="signin_form.php" class="fk-btn-white">Existing User? Log in</a>

                <div class="alert alert-danger" style="display:none; margin-top:10px;" id="error_alert">
                    <h4 id="signup_msg" style="font-size:14px; margin:0;"></h4>
                </div>
                
                <a href="index.php" style="display:block; text-align:center; margin-top:20px; color:#878787; text-decoration:none; font-size:14px;">Skip SignUp</a>
            </form>
        </div>
    </div>

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/actions.js"></script>
    <script>
        $(document).ready(function(){
            // The actions.js handles the signup_form submit event and populates #signup_msg
            // We'll observe the #signup_msg for changes to show/hide the alert gracefully
            const targetNode = document.getElementById('signup_msg');
            const config = { childList: true, characterData: true, subtree: true };
            const callback = function(mutationsList, observer) {
                if(targetNode.innerHTML.trim() !== "") {
                    $("#error_alert").show();
                } else {
                    $("#error_alert").hide();
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        });
    </script>
</body>
</html>
