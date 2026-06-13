<?php
$files = [
    'c:/xampp/htdocs/online-shopping-system/body.php',
    'c:/xampp/htdocs/online-shopping-system/action.php',
    'c:/xampp/htdocs/online-shopping-system/homeaction.php'
];

foreach ($files as $file) {
    if (!file_exists($file)) continue;
    $content = file_get_contents($file);
    
    // Replace double quotes with single quotes inside the injected HTML wrapper to fix the `echo "` breakages
    $content = str_replace(
        '<div class="product-img"><a href="product.php?p=$pro_id">', 
        '<div class=\'product-img\'><a href=\'product.php?p=$pro_id\'>', 
        $content
    );

    $content = str_replace(
        '<div class="product-img"><a href="product.php?p=$product_id">', 
        '<div class=\'product-img\'><a href=\'product.php?p=$product_id\'>', 
        $content
    );

    $content = str_replace(
        '<img src="$img_src" alt="">', 
        '<img src=\'$img_src\' alt=\'\'>', 
        $content
    );

    file_put_contents($file, $content);
    echo "Fixed quotes in $file\n";
}
?>
