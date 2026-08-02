<footer id="footer">
	<style>
		#toast {
			visibility: hidden; max-width: 350px; margin: auto; background-color: #0f172a; color: #fff; text-align: center;
			border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); position: fixed; z-index: 10005;
			left: 50%; bottom: 30px; font-size: 15px; transform: translateX(-50%); padding: 14px 20px; font-weight: 500;
		}
		#toast.show {
			visibility: visible;
			animation: toast-fadein 0.4s, toast-fadeout 0.4s 3.6s;
		}
		@keyframes toast-fadein { from { bottom: 0; opacity: 0; } to { bottom: 30px; opacity: 1; } }
		@keyframes toast-fadeout { from { bottom: 30px; opacity: 1; } to { bottom: 0; opacity: 0; } }

		/* AI Chatbot Styles */
		#chatbot-btn {
			position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px; border-radius: 50%;
			background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; cursor: pointer;
			box-shadow: 0 8px 24px rgba(37,99,235,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center;
			font-size: 22px; transition: transform 0.2s, box-shadow 0.2s;
		}
		#chatbot-btn:hover { transform: scale(1.08); box-shadow: 0 12px 30px rgba(37,99,235,0.6); }
		#chatbot-window {
			position: fixed; bottom: 100px; right: 30px; width: 360px; max-height: 520px; background: #fff;
			border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); z-index: 9998; display: none;
			flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0;
		}
		#chatbot-header {
			background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; padding: 14px 18px;
			display: flex; align-items: center; gap: 10px; flex-shrink: 0;
		}
		#chatbot-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8fafc; }
		.chat-msg { display: flex; gap: 8px; align-items: flex-end; }
		.chat-msg.user { flex-direction: row-reverse; }
		.chat-bubble { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; }
		.chat-msg.bot .chat-bubble { background: #fff; color: #1e293b; border-bottom-left-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
		.chat-msg.user .chat-bubble { background: #2563eb; color: #fff; border-bottom-right-radius: 4px; }
		#chatbot-input-area { padding: 10px 14px; background: #fff; display: flex; gap: 8px; border-top: 1px solid #f1f5f9; }
		#chatbot-input { flex: 1; border: 1px solid #cbd5e1; border-radius: 20px; padding: 8px 14px; font-size: 13px; outline: none; }
		#chatbot-send { width: 36px; height: 36px; border-radius: 50%; background: #2563eb; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
	</style>

	<div id="toast"><div id="desc">Notification</div></div>

	<!-- AI Chatbot Launcher -->
	<button id="chatbot-btn" onclick="toggleChatbot()" title="Chat with Assistant">
		<i class="fa fa-comments"></i>
	</button>

	<!-- Chatbot Window -->
	<div id="chatbot-window">
		<div id="chatbot-header">
			<div style="font-size:20px;">🤖</div>
			<div style="flex:1;">
				<h4 style="margin:0; font-size:14px; font-weight:700; color:#fff;"><?php echo APP_NAME; ?> Assistant</h4>
				<span style="font-size:11px; opacity:0.9;">Online · Ready to help</span>
			</div>
			<button onclick="toggleChatbot()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">✕</button>
		</div>
		<div id="chatbot-messages"></div>
		<div id="chatbot-input-area">
			<input type="text" id="chatbot-input" placeholder="Ask anything..." autocomplete="off">
			<button id="chatbot-send"><i class="fa fa-paper-plane"></i></button>
		</div>
	</div>

	<script>
		var chatOpen = false;
		function toggleChatbot() {
			chatOpen = !chatOpen;
			var win = document.getElementById('chatbot-window');
			if (chatOpen) {
				win.style.display = 'flex';
				var msgs = document.getElementById('chatbot-messages');
				if (msgs.children.length === 0) {
					addBotMessage("👋 Hello! Welcome to <b><?php echo APP_NAME; ?></b>. How can I help you today?");
				}
				document.getElementById('chatbot-input').focus();
			} else {
				win.style.display = 'none';
			}
		}

		function addBotMessage(html) {
			var msgs = document.getElementById('chatbot-messages');
			var div = document.createElement('div');
			div.className = 'chat-msg bot';
			div.innerHTML = '<div style="font-size:16px;">🤖</div><div class="chat-bubble">' + html + '</div>';
			msgs.appendChild(div);
			msgs.scrollTop = msgs.scrollHeight;
		}

		function addUserMessage(text) {
			var msgs = document.getElementById('chatbot-messages');
			var div = document.createElement('div');
			div.className = 'chat-msg user';
			div.innerHTML = '<div class="chat-bubble">' + escapeHtml(text) + '</div>';
			msgs.appendChild(div);
			msgs.scrollTop = msgs.scrollHeight;
		}

		function escapeHtml(text) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(text));
			return div.innerHTML;
		}

		function sendBotMessage() {
			var input = document.getElementById('chatbot-input');
			var msg = input.value.trim();
			if (!msg) return;
			input.value = '';
			addUserMessage(msg);

			fetch('api/chatbot.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: msg })
			})
			.then(function(r) { return r.json(); })
			.then(function(data) {
				addBotMessage(data.reply + (data.products || ''));
			})
			.catch(function() {
				addBotMessage('Sorry, I am having trouble connecting right now.');
			});
		}

		document.getElementById('chatbot-send').addEventListener('click', sendBotMessage);
		document.getElementById('chatbot-input').addEventListener('keydown', function(e) {
			if (e.key === 'Enter') sendBotMessage();
		});
	</script>

	<!-- Footer Content -->
	<div class="section" style="padding: 50px 0 30px;">
		<div class="container">
			<div class="row">
				<div class="col-md-4 col-xs-12" style="margin-bottom:20px;">
					<div class="footer">
						<h3 class="footer-title" style="color:#fff; font-size:18px; font-weight:700; margin-bottom:15px;"><?php echo APP_NAME; ?></h3>
						<p style="color:#94a3b8; font-size:13px; line-height:1.6; margin-bottom:15px;"><?php echo APP_TAGLINE; ?>. Premium quality products with fast and secure delivery.</p>
						<ul class="footer-links" style="list-style:none; padding:0; line-height:2;">
							<li><i class="fa fa-map-marker" style="color:#2563eb; width:20px;"></i> <?php echo STORE_ADDRESS; ?></li>
							<li><i class="fa fa-phone" style="color:#2563eb; width:20px;"></i> <?php echo SUPPORT_PHONE; ?></li>
							<li><i class="fa fa-envelope-o" style="color:#2563eb; width:20px;"></i> <?php echo SUPPORT_EMAIL; ?></li>
						</ul>
					</div>
				</div>

				<div class="col-md-4 col-xs-6" style="margin-bottom:20px;">
					<div class="footer">
						<h3 class="footer-title" style="color:#fff; font-size:18px; font-weight:700; margin-bottom:15px;">Categories</h3>
						<ul class="footer-links" style="list-style:none; padding:0; line-height:2;">
							<li><a href="store.php?cat_id=1">Electronics</a></li>
							<li><a href="store.php?cat_id=2">Ladies Wears</a></li>
							<li><a href="store.php?cat_id=3">Mens Wear</a></li>
							<li><a href="store.php?cat_id=4">Kids Wear</a></li>
							<li><a href="store.php?cat_id=5">Furnitures</a></li>
							<li><a href="store.php?cat_id=6">Home Appliances</a></li>
							<li><a href="store.php?cat_id=7">Sports</a></li>
						</ul>
					</div>
				</div>

				<div class="col-md-4 col-xs-6" style="margin-bottom:20px;">
					<div class="footer">
						<h3 class="footer-title" style="color:#fff; font-size:18px; font-weight:700; margin-bottom:15px;">Quick Links</h3>
						<ul class="footer-links" style="list-style:none; padding:0; line-height:2;">
							<li><a href="myprofile.php">My Profile</a></li>
							<li><a href="myorders.php">Order History</a></li>
							<li><a href="wishlist.php">Wishlist</a></li>
							<li><a href="cart.php">View Cart</a></li>
							<li><a href="signin_form.php">Account Login</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="bottom-footer" class="section" style="padding: 20px 0; border-top:1px solid #1e293b;">
		<div class="container">
			<div class="row" style="display:flex; align-items:center; flex-wrap:wrap;">
				<div class="col-md-6 col-xs-12">
					<span class="copyright" style="font-size:13px;">
						Copyright &copy; <?php echo date('Y'); ?> <strong><?php echo APP_NAME; ?></strong>. All rights reserved.
					</span>
				</div>
				<div class="col-md-6 col-xs-12" style="text-align:right;">
					<ul class="footer-payments" style="list-style:none; padding:0; margin:0; display:inline-flex; gap:12px; font-size:22px; color:#64748b;">
						<li><i class="fa fa-cc-visa"></i></li>
						<li><i class="fa fa-credit-card"></i></li>
						<li><i class="fa fa-cc-paypal"></i></li>
						<li><i class="fa fa-cc-mastercard"></i></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</footer>

<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/slick.min.js"></script>
<script src="js/nouislider.min.js"></script>
<script src="js/main.js"></script>
<script src="js/actions.js"></script>
<script src="js/sweetalert.min.js"></script>
</body>
</html>
