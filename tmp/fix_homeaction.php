<?php
$file = 'c:/xampp/htdocs/online-shopping-system/homeaction.php';
$content = file_get_contents($file);

$content = preg_replace(
    '/<a href=\'product\.php\?p=\\$pro_id\'>\s*<div class=\'product-img\'>\s*<img src=\'\\$img_src\' alt=\'\'>\s*<\/div>/is',
    '<div class=\'product-img\'> <a href=\'product.php?p=$pro_id\'> <img src=\'$img_src\' alt=\'\'> </a> </div>',
    $content
);

file_put_contents($file, $content);
echo "Regex replacement done.\n";
?>
