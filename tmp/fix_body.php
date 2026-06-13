<?php
$files = [
    'c:/xampp/htdocs/online-shopping-system/body.php',
    'c:/xampp/htdocs/online-shopping-system/action.php',
    'c:/xampp/htdocs/online-shopping-system/homeaction.php'
];

foreach ($files as $file) {
    if (!file_exists($file)) continue;
    $content = file_get_contents($file);
    
    // Fix pattern: <a href='product.php?p=$pro_id'> wrapping <div class='product-img'>
    $pattern = '/<a\\s+href=[\'"]product\\.php\\?p=\\$pro_id[\'"]>\\s*<div\\s+class=[\'"]product-img[\'"]>(.*?)<\\/div>\\s*<\\/a>/is';
    
    $replacement = '<div class="product-img"><a href="product.php?p=$pro_id">$1</a></div>';
    
    $new_content = preg_replace($pattern, $replacement, $content);
    
    // Fallback: If no closing </a> is found after </div> for some reason, fix the missing anchor ones specifically
    $pattern2 = '/<a\\s+href=[\'"]product\\.php\\?p=\\$pro_id[\'"]>\\s*<div\\s+class=[\'"]product-img[\'"]>\\s*<img\\s+src=[\'"]\\$img_src[\'"]\\s+alt=[\'"][\'"]>\\s*<\\/div>/is';
    $replacement2 = '<div class="product-img"><a href="product.php?p=$pro_id"><img src="$img_src" alt=""></a></div>';
    $new_content = preg_replace($pattern2, $replacement2, $new_content);

    // Also fix cases where $product_id is used instead of $pro_id
    $pattern3 = '/<a\\s+href=[\'"]product\\.php\\?p=\\$product_id[\'"]>\\s*<div\\s+class=[\'"]product-img[\'"]>(.*?)<\\/div>\\s*<\\/a>/is';
    $replacement3 = '<div class="product-img"><a href="product.php?p=$product_id">$1</a></div>';
    $new_content = preg_replace($pattern3, $replacement3, $new_content);

    file_put_contents($file, $new_content);
    echo "Fixed $file\n";
}
?>
