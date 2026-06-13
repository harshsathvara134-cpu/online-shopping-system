<?php
include "c:/xampp/htdocs/online-shopping-system/db.php";

function fix_table($con, $table, $column, $definition) {
    echo "Checking table '$table' for AUTO_INCREMENT on '$column'...\n";
    $result = mysqli_query($con, "DESCRIBE $table");
    $has_ai = false;
    while ($row = mysqli_fetch_array($result)) {
        if ($row['Field'] == $column && strpos($row['Extra'], 'auto_increment') !== false) {
            $has_ai = true;
            break;
        }
    }

    if (!$has_ai) {
        echo "Adding AUTO_INCREMENT to $table.$column...\n";
        mysqli_query($con, "UPDATE $table SET $column = 1 WHERE $column = 0 LIMIT 1");
        $sql = "ALTER TABLE $table MODIFY $column $definition AUTO_INCREMENT";
        if (mysqli_query($con, $sql)) {
            echo "SUCCESS: AUTO_INCREMENT enabled for $table.\n";
        } else {
            echo "ERROR for $table: " . mysqli_error($con) . "\n";
        }
    } else {
        echo "$table already has AUTO_INCREMENT on $column.\n";
    }
    echo "-----------------------------------\n";
}

fix_table($con, 'email_info', 'email_id', 'INT(100) NOT NULL');
fix_table($con, 'reviews', 'review_id', 'INT(100) NOT NULL');

echo "Database extended check complete.\n";
?>
