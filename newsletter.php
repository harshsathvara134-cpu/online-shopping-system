<div id="newsletter" class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="newsletter">
					<p>Subscribe for Exclusive <strong>DEALS & UPDATES</strong></p>
					<form id="offer_form" onsubmit="return false">
						<?php if (function_exists('csrf_field')) echo csrf_field(); ?>
						<input class="input" type="email" id="email" name="email" placeholder="Enter Your Email Address" required>
						<button class="newsletter-btn" value="Sign Up" name="signup_button" type="submit"><i class="fa fa-envelope"></i> Subscribe</button>
					</form>
					<div id="offer_msg"></div>
					<ul class="newsletter-follow">
						<li><a href="#"><i class="fa fa-facebook"></i></a></li>
						<li><a href="#"><i class="fa fa-twitter"></i></a></li>
						<li><a href="#"><i class="fa fa-instagram"></i></a></li>
						<li><a href="#"><i class="fa fa-linkedin"></i></a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>