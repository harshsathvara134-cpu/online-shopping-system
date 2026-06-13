document.addEventListener('DOMContentLoaded', function() {
  // Mobile dropdown toggle - Account dropdown
  const accountBtn = document.querySelector('.c');
  const accountDropdown = document.querySelector('.dropdownn-content');
  
  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      accountBtn.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function() {
      accountBtn.classList.remove('active');
    });
  }
  
  // Mobile dropdown toggle - Cart dropdown
  const cartBtn = document.querySelector('.dropdown'); // Assuming .dropdown is the cart button class
  const cartDropdown = document.querySelector('.cart-dropdown');
  
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      cartBtn.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function() {
      cartBtn.classList.remove('active');
    });
  }
  
  // Prevent dropdown content from closing itself
  if (accountDropdown) {
    accountDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  if (cartDropdown) {
    cartDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
