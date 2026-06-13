<footer id="footer">
	<style>
		#toast {
			visibility: hidden;
			max-width: 50px;
			height: 50px;
			/*margin-left: -125px;*/
			margin: auto;
			background-color: #fff;
			color: #333;
			text-align: center;
			border-radius: 4px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

			position: fixed;
			z-index: 10;
			left: 0;
			right: 0;
			bottom: 30px;
			font-size: 17px;
			white-space: nowrap;
		}

		#toast #img {
			width: 50px;
			height: 50px;

			float: left;

			padding-top: 16px;
			padding-bottom: 16px;

			box-sizing: border-box;


			background-color: #f0f0f0;
			color: #333;
		}

		#toast #desc {


			color: #333;

			padding: 16px;

			overflow: hidden;
			white-space: nowrap;
		}

		#toast.show {
			visibility: visible;
			-webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s, fadeout 0.5s 2.5s;
			animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s, fadeout 0.5s 4.5s;
		}

		@-webkit-keyframes fadein {
			from {
				bottom: 0;
				opacity: 0;
			}

			to {
				bottom: 30px;
				opacity: 1;
			}
		}

		@keyframes fadein {
			from {
				bottom: 0;
				opacity: 0;
			}

			to {
				bottom: 30px;
				opacity: 1;
			}
		}

		@-webkit-keyframes expand {
			from {
				min-width: 50px
			}

			to {
				min-width: 350px
			}
		}

		@keyframes expand {
			from {
				min-width: 50px
			}

			to {
				min-width: 350px
			}
		}

		@-webkit-keyframes stay {
			from {
				min-width: 350px
			}

			to {
				min-width: 350px
			}
		}

		@keyframes stay {
			from {
				min-width: 350px
			}

			to {
				min-width: 350px
			}
		}

		@-webkit-keyframes shrink {
			from {
				min-width: 350px;
			}

			to {
				min-width: 50px;
			}
		}

		@keyframes shrink {
			from {
				min-width: 350px;
			}

			to {
				min-width: 50px;
			}
		}

		@-webkit-keyframes fadeout {
			from {
				bottom: 30px;
				opacity: 1;
			}

			to {
				bottom: 60px;
				opacity: 0;
			}
		}

		@keyframes fadeout {
			from {
				bottom: 30px;
				opacity: 1;
			}

			to {
				bottom: 60px;
				opacity: 0;
			}
		}
	</style>
	<div id="toast">
		<div id="desc"> login desc</div>
	</div>

	<!-- ========== AI CHATBOT UPGRADED ========== -->
	<style>
		#chatbot-btn {
			position: fixed;
			bottom: 30px;
			right: 30px;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: #fff;
			border: none;
			cursor: pointer;
			box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
			transition: transform 0.3s, box-shadow 0.3s;
			animation: chatbot-bounce 2s infinite;
		}

		#chatbot-btn:hover {
			transform: scale(1.12);
			box-shadow: 0 10px 32px rgba(102, 126, 234, 0.7);
			animation: none;
		}

		@keyframes chatbot-bounce {

			0%,
			100% {
				transform: translateY(0)
			}

			50% {
				transform: translateY(-7px)
			}
		}

		#chatbot-btn .chatbot-badge {
			position: absolute;
			top: -4px;
			right: -4px;
			background: #ff4757;
			color: #fff;
			border-radius: 50%;
			width: 20px;
			height: 20px;
			font-size: 11px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 700;
		}

		#chatbot-window {
			position: fixed;
			bottom: 105px;
			right: 30px;
			width: 380px;
			max-height: 560px;
			background: #fff;
			border-radius: 20px;
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
			z-index: 9998;
			display: none;
			flex-direction: column;
			overflow: hidden;
			animation: chatbot-slidein 0.3s ease;
			transition: width 0.3s, max-height 0.3s, bottom 0.3s, right 0.3s, border-radius 0.3s;
		}

		#chatbot-window.maximized {
			width: 98vw;
			max-height: 90dvh;
			bottom: 10px;
			right: 1vw;
			border-radius: 16px;
		}

		@keyframes chatbot-slidein {
			from {
				opacity: 0;
				transform: translateY(20px)
			}

			to {
				opacity: 1;
				transform: translateY(0)
			}
		}

		#chatbot-header {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: #fff;
			padding: 14px 18px;
			display: flex;
			align-items: center;
			gap: 10px;
			flex-shrink: 0;
		}

		#chatbot-header .bot-avatar {
			width: 42px;
			height: 42px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.25);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 20px;
		}

		#chatbot-header .bot-info h4 {
			margin: 0;
			font-size: 15px;
			font-weight: 700;
		}

		#chatbot-header .bot-info span {
			font-size: 12px;
			opacity: 0.85;
		}

		#chatbot-header .bot-online {
			width: 9px;
			height: 9px;
			background: #4ade80;
			border-radius: 50%;
			display: inline-block;
			margin-right: 4px;
			animation: pulse-green 1.5s infinite;
		}

		@keyframes pulse-green {

			0%,
			100% {
				opacity: 1
			}

			50% {
				opacity: 0.4
			}
		}

		.chatbot-header-actions {
			margin-left: auto;
			display: flex;
			gap: 8px;
			align-items: center;
		}

		.chatbot-header-actions button {
			background: none;
			border: none;
			color: #fff;
			font-size: 16px;
			cursor: pointer;
			opacity: 0.8;
			transition: opacity 0.2s;
			padding: 2px 5px;
			border-radius: 4px;
		}

		.chatbot-header-actions button:hover {
			opacity: 1;
			background: rgba(255, 255, 255, 0.15);
		}

		#chatbot-messages {
			flex: 1;
			overflow-y: auto;
			padding: 16px;
			display: flex;
			flex-direction: column;
			gap: 12px;
			background: #f7f8fc;
			min-height: 0;
		}

		#chatbot-messages::-webkit-scrollbar {
			width: 4px;
		}

		#chatbot-messages::-webkit-scrollbar-track {
			background: #f1f1f1;
		}

		#chatbot-messages::-webkit-scrollbar-thumb {
			background: #ccc;
			border-radius: 4px;
		}

		.chat-msg {
			display: flex;
			gap: 8px;
			align-items: flex-end;
		}

		.chat-msg.user {
			flex-direction: row-reverse;
		}

		.chat-bubble {
			max-width: 78%;
			padding: 10px 14px;
			border-radius: 18px;
			font-size: 13px;
			line-height: 1.5;
			word-break: break-word;
		}

		.chat-msg.bot .chat-bubble {
			background: #fff;
			color: #333;
			border-bottom-left-radius: 4px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		}

		.chat-msg.user .chat-bubble {
			background: linear-gradient(135deg, #667eea, #764ba2);
			color: #fff;
			border-bottom-right-radius: 4px;
		}

		.chat-time {
			font-size: 10px;
			color: #aaa;
			margin-top: 4px;
			display: block;
		}

		.chat-avatar-sm {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			background: linear-gradient(135deg, #667eea, #764ba2);
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 13px;
			flex-shrink: 0;
		}

		.typing-indicator span {
			display: inline-block;
			width: 8px;
			height: 8px;
			background: #bbb;
			border-radius: 50%;
			margin: 0 2px;
			animation: typing 1.2s infinite;
		}

		.typing-indicator span:nth-child(2) {
			animation-delay: 0.2s;
		}

		.typing-indicator span:nth-child(3) {
			animation-delay: 0.4s;
		}

		@keyframes typing {

			0%,
			60%,
			100% {
				transform: translateY(0)
			}

			30% {
				transform: translateY(-6px)
			}
		}

		.bot-products {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-top: 8px;
		}

		.bot-product-card {
			display: flex;
			gap: 10px;
			align-items: center;
			background: #f8f9ff;
			border-radius: 10px;
			padding: 8px;
			text-decoration: none;
			color: #333;
			border: 1px solid #e8ecff;
			transition: background 0.2s, transform 0.15s;
		}

		.bot-product-card:hover {
			background: #eef0ff;
			color: #333;
			transform: translateX(3px);
		}

		.bot-product-card img {
			width: 48px;
			height: 48px;
			object-fit: contain;
			border-radius: 6px;
			background: #fff;
			border: 1px solid #eee;
		}

		.bot-product-card div {
			display: flex;
			flex-direction: column;
		}

		.bot-product-card strong {
			font-size: 12px;
			color: #333;
			line-height: 1.3;
		}

		.bot-product-card span {
			font-size: 13px;
			color: #ff6000;
			font-weight: 700;
			margin-top: 2px;
		}

		.quick-replies {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
		}

		.quick-reply-btn {
			background: #f0f2ff;
			color: #667eea;
			border: 1px solid #d0d4ff;
			border-radius: 20px;
			padding: 5px 12px;
			font-size: 12px;
			cursor: pointer;
			transition: all 0.2s;
		}

		.quick-reply-btn:hover {
			background: #667eea;
			color: #fff;
			border-color: #667eea;
		}

		#chatbot-input-area {
			padding: 10px 14px;
			background: #fff;
			display: flex;
			flex-direction: column;
			gap: 6px;
			border-top: 1px solid #f0f0f0;
			flex-shrink: 0;
		}

		.chatbot-input-row {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		#chatbot-input {
			flex: 1;
			border: 1.5px solid #e8eaf0;
			border-radius: 25px;
			padding: 10px 16px;
			font-size: 13px;
			outline: none;
			transition: border 0.2s;
		}

		#chatbot-input:focus {
			border-color: #667eea;
		}

		#chatbot-send {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: linear-gradient(135deg, #667eea, #764ba2);
			color: #fff;
			border: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 15px;
			transition: transform 0.2s, opacity 0.2s;
			flex-shrink: 0;
		}

		#chatbot-send:hover:not(:disabled) {
			transform: scale(1.1);
		}

		#chatbot-send:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.char-counter {
			font-size: 10px;
			color: #bbb;
			text-align: right;
			padding-right: 4px;
		}

		.char-counter.warn {
			color: #ff6000;
		}

		@media(max-width:560px) {
			#chatbot-window {
				width: calc(100vw - 16px);
				right: 8px;
				bottom: 80px;
				max-height: 85dvh;
				border-radius: 16px;
			}

			#chatbot-btn {
				bottom: 75px;
				right: 16px;
				width: 52px;
				height: 52px;
				font-size: 20px;
			}
		}
	</style>

	<!-- Chatbot Toggle Button -->
	<button id="chatbot-btn" onclick="toggleChatbot()" title="Chat with us!">
		<i class="fa fa-comments"></i>
		<span class="chatbot-badge">1</span>
	</button>

	<!-- Chatbot Window -->
	<div id="chatbot-window">
		<div id="chatbot-header">
			<div class="bot-avatar">🤖</div>
			<div class="bot-info">
				<h4>JAYVEER Assistant</h4>
				<span><span class="bot-online"></span>Online · Ready to help</span>
			</div>
			<div class="chatbot-header-actions">
				<button onclick="toggleMaximize()" title="Maximize" id="chatbot-maximize-btn">⛶</button>
				<button onclick="clearChat()" title="Clear Chat">🗑</button>
				<button onclick="toggleChatbot()" title="Close">✕</button>
			</div>
		</div>
		<div id="chatbot-messages"></div>
		<div id="chatbot-input-area">
			<div class="chatbot-input-row">
				<input type="text" id="chatbot-input" placeholder="Ask me anything..." autocomplete="off"
					maxlength="200">
				<button id="chatbot-send"><i class="fa fa-paper-plane"></i></button>
			</div>
			<div class="char-counter" id="char-counter">0 / 200</div>
		</div>
	</div>

	<script>
		var chatOpen = false;
		var chatMaximized = false;
		var SESSION_KEY = 'jayveer_chat_history';

		function toggleChatbot() {
			chatOpen = !chatOpen;
			var win = document.getElementById('chatbot-window');
			var badge = document.querySelector('.chatbot-badge');
			if (chatOpen) {
				win.style.display = 'flex';
				if (badge) badge.style.display = 'none';
				loadHistory();
				var msgs = document.getElementById('chatbot-messages');
				if (msgs.children.length === 0) {
					setTimeout(function () {
						addBotMessage("👋 Hi! I'm your <b>JAYVEER AI Assistant</b>! How can I help you today?", null, false);
						setTimeout(function () {
							var qr = '<div class="quick-replies">' +
								'<button class="quick-reply-btn" onclick="sendQuick(\'Show New Arrivals\')">🆕 New Arrivals</button>' +
								'<button class="quick-reply-btn" onclick="sendQuick(\'Show Categories\')">📂 Categories</button>' +
								'<button class="quick-reply-btn" onclick="sendQuick(\'Find Budget Products\')">💰 Budget Picks</button>' +
								'<button class="quick-reply-btn" onclick="sendQuick(\'Delivery Info\')">🚚 Delivery</button>' +
								'<button class="quick-reply-btn" onclick="sendQuick(\'Return Policy\')">🔄 Returns</button>' +
								'</div>';
							addBotMessage("Quick options:", null, false);
							var lastBubble = document.querySelectorAll('#chatbot-messages .chat-bubble');
							lastBubble[lastBubble.length - 1].innerHTML += qr;
							saveHistory();
						}, 600);
					}, 400);
				}
				document.getElementById('chatbot-input').focus();
			} else {
				win.style.display = 'none';
			}
		}

		function toggleMaximize() {
			chatMaximized = !chatMaximized;
			var win = document.getElementById('chatbot-window');
			var btn = document.getElementById('chatbot-maximize-btn');
			if (chatMaximized) {
				win.classList.add('maximized');
				btn.textContent = '⛶';
				btn.title = 'Restore';
			} else {
				win.classList.remove('maximized');
				btn.textContent = '⛶';
				btn.title = 'Maximize';
			}
		}

		function clearChat() {
			if (confirm('Clear chat history?')) {
				document.getElementById('chatbot-messages').innerHTML = '';
				sessionStorage.removeItem(SESSION_KEY);
			}
		}

		function saveHistory() {
			var msgs = document.getElementById('chatbot-messages');
			sessionStorage.setItem(SESSION_KEY, msgs.innerHTML);
		}

		function loadHistory() {
			var saved = sessionStorage.getItem(SESSION_KEY);
			if (saved) {
				document.getElementById('chatbot-messages').innerHTML = saved;
				scrollToBottom();
			}
		}

		function scrollToBottom() {
			var msgs = document.getElementById('chatbot-messages');
			msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
		}

		function getTime() {
			var now = new Date();
			return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
		}

		function addUserMessage(text) {
			var msgs = document.getElementById('chatbot-messages');
			var div = document.createElement('div');
			div.className = 'chat-msg user';
			div.innerHTML = '<div><div class="chat-bubble">' + escapeHtml(text) + '</div><span class="chat-time">' + getTime() + '</span></div>';
			msgs.appendChild(div);
			scrollToBottom();
			saveHistory();
		}

		function addBotMessage(html, productsHtml, doSave) {
			if (doSave === undefined) doSave = true;
			var msgs = document.getElementById('chatbot-messages');
			var div = document.createElement('div');
			div.className = 'chat-msg bot';
			var content = '<div class="chat-avatar-sm">🤖</div>' +
				'<div><div class="chat-bubble">' + html + (productsHtml || '') + '</div>' +
				'<span class="chat-time">' + getTime() + '</span></div>';
			div.innerHTML = content;
			msgs.appendChild(div);
			scrollToBottom();
			if (doSave) saveHistory();
		}

		function showTyping() {
			var msgs = document.getElementById('chatbot-messages');
			var div = document.createElement('div');
			div.className = 'chat-msg bot';
			div.id = 'typing-indicator';
			div.innerHTML = '<div class="chat-avatar-sm">🤖</div><div class="chat-bubble" style="padding:12px 16px;"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
			msgs.appendChild(div);
			scrollToBottom();
		}

		function removeTyping() {
			var el = document.getElementById('typing-indicator');
			if (el) el.remove();
		}

		function escapeHtml(text) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(text));
			return div.innerHTML;
		}

		function setSendDisabled(val) {
			document.getElementById('chatbot-send').disabled = val;
			document.getElementById('chatbot-input').disabled = val;
		}

		function sendMessage() {
			var input = document.getElementById('chatbot-input');
			var msg = input.value.trim();
			if (!msg) return;
			input.value = '';
			document.getElementById('char-counter').textContent = '0 / 200';
			document.getElementById('char-counter').classList.remove('warn');
			addUserMessage(msg);
			showTyping();
			setSendDisabled(true);

			fetch('chatbot_api.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: msg })
			})
				.then(function (r) { return r.json(); })
				.then(function (data) {
					removeTyping();
					addBotMessage(data.reply || 'Sorry, I could not understand that.', data.products || '');
					setSendDisabled(false);
					document.getElementById('chatbot-input').focus();
				})
				.catch(function () {
					removeTyping();
					addBotMessage('😔 Sorry, I\'m having trouble connecting. Please try again!');
					setSendDisabled(false);
				});
		}

		function sendQuick(text) {
			document.getElementById('chatbot-input').value = text;
			sendMessage();
		}

		document.getElementById('chatbot-send').addEventListener('click', sendMessage);
		document.getElementById('chatbot-input').addEventListener('keydown', function (e) {
			if (e.key === 'Enter' && !e.shiftKey) sendMessage();
		});
		document.getElementById('chatbot-input').addEventListener('input', function () {
			var len = this.value.length;
			var counter = document.getElementById('char-counter');
			counter.textContent = len + ' / 200';
			counter.classList.toggle('warn', len > 170);
		});
	</script>
	<!-- ========== END CHATBOT ========== -->
	<!-- top footer -->
	<div class="section">
		<!-- container -->
		<div class="container">
			<!-- row -->
			<div class="row">
				<div class="col-md-3 col-xs-6">
					<div class="footer">
						<h3 class="footer-title">About Us</h3>
						<p>This is my Small Database Management System mini project</p>
						<ul class="footer-links">
							<li><a href="#"><i class="fa fa-map-marker"></i>indian</a></li>
							<li><a href="#"><i class="fa fa-phone"></i>+1-12344465767</a></li>
							<li><a href="#"><i class="fa fa-envelope-o"></i> harshsathvara@gmail.com </a></li>
						</ul>
					</div>
				</div>
				<div class="col-md-6 text-center" style="margin-top:80px;">
					<ul class="footer-payments">
						<li><a href="#"><i class="fa fa-cc-visa"></i></a></li>
						<li><a href="#"><i class="fa fa-credit-card"></i></a></li>
						<li><a href="#"><i class="fa fa-cc-paypal"></i></a></li>
						<li><a href="#"><i class="fa fa-cc-mastercard"></i></a></li>
						<li><a href="#"><i class="fa fa-cc-discover"></i></a></li>
						<li><a href="#"><i class="fa fa-cc-amex"></i></a></li>
					</ul>
					<span class="copyright">
						<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
						Copyright &copy;
						<script>document.write(new Date().getFullYear());</script> All rights reserved | This template
						is made with <i class="fa fa-heart-o" aria-hidden="true"></i> by <a href="#"
							target="_blank">Harsh Sathvara 226260332020</a>
						<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
					</span>
				</div>

				<div class="col-md-3 col-xs-6">
					<div class="footer">
						<h3 class="footer-title">Categories</h3>
						<ul class="footer-links">
							<li><a href="#">Mobiles</a></li>
							<li><a href="#">Men</a></li>
							<li><a href="#">Women</a></li>
							<li><a href="#">Kids</a></li>
							<li><a href="#">Accessories</a></li>
						</ul>
					</div>
				</div>

				<div class="clearfix visible-xs"></div>


			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /top footer -->


	<!-- bottom footer -->

	<!-- /bottom footer -->
</footer>
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/slick.min.js"></script>
<script src="js/nouislider.min.js"></script>
<script src="js/jquery.zoom.min.js"></script>
<script src="js/main.js?v=20260520"></script>
<script src="js/actions.js?v=20260520"></script>
<script src="js/sweetalert.min.js"></script>
<script src="js/jquery.payform.min.js" charset="utf-8"></script>
<script src="js/script.js?v=20260520"></script>
<script>var c = 0;
	function menu() {
		if (c % 2 == 0) {
			document.querySelector('.cont_drobpdown_menu').className = "cont_drobpdown_menu active";
			document.querySelector('.cont_icon_trg').className = "cont_icon_trg active";
			c++;
		} else {
			document.querySelector('.cont_drobpdown_menu').className = "cont_drobpdown_menu disable";
			document.querySelector('.cont_icon_trg').className = "cont_icon_trg disable";
			c++;
		}
	}


</script>
<script type="text/javascript">
	$('.block2-btn-addcart').each(function () {
		var nameProduct = $(this).parent().parent().parent().find('.block2-name').html();
		$(this).on('click', function () {
			swal(nameProduct, "is added to cart !", "success");
		});
	});

	$('.block2-btn-addwishlist').each(function () {
		var nameProduct = $(this).parent().parent().parent().find('.block2-name').html();
		$(this).on('click', function () {
			swal(nameProduct, "is added to wishlist !", "success");
		});
	});
</script>

<!-- Mobile Bottom Nav -->
<div class="mobile-bottom-nav">
	<a href="index.php" class="nav-item">
		<i class="fa fa-home"></i>
		<span>Home</span>
	</a>
	<a href="javascript:void(0)" onclick="openNav()" class="nav-item">
		<i class="fa fa-th-large"></i>
		<span>Categories</span>
	</a>
	<?php
	if (isset($_SESSION["uid"])) {
		echo '<a href="myorders.php" class="nav-item"><i class="fa fa-user"></i><span>Account</span></a>';
	} else {
		echo '<a href="signin_form.php" class="nav-item"><i class="fa fa-user"></i><span>Account</span></a>';
	}
	?>
	<a href="cart.php" class="nav-item">
		<i class="fa fa-shopping-cart"></i>
		<span>Cart</span>
	</a>
</div>
<!-- /Mobile Bottom Nav -->
</body>
