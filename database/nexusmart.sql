-- ========================================================
-- JAYVEERMart Enterprise E-Commerce Database Schema
-- Version: 3.0.0
-- Encoding: UTF-8 (utf8mb4_unicode_ci)
-- ========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for table `admin_info`
-- --------------------------------------------------------

CREATE TABLE `admin_info` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(100) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_email` (`admin_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_info` (`admin_id`, `admin_name`, `admin_email`, `admin_password`) VALUES
(1, 'Administrator', 'admin@jayveermart.com', '$2y$10$dGELF/HVK9aQ3Z.Fy977vOEtSH/B52f/F8/FJpD34qjCYaYrAARga');

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------

CREATE TABLE `categories` (
  `cat_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_title` varchar(255) NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`cat_id`, `cat_title`) VALUES
(1, 'Electronics'),
(2, 'Ladies Wears'),
(3, 'Mens Wear'),
(4, 'Kids Wear'),
(5, 'Furnitures'),
(6, 'Home Appliances'),
(7, 'Sports');

-- --------------------------------------------------------
-- Table structure for table `brands`
-- --------------------------------------------------------

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_title` varchar(255) NOT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`brand_id`, `brand_title`) VALUES
(1, 'HP'),
(2, 'Samsung'),
(3, 'Apple'),
(4, 'Motorola'),
(5, 'LG'),
(6, 'JAYVEER Fashion'),
(7, 'Generic');

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_cat` int(11) NOT NULL,
  `product_brand` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_price` int(11) NOT NULL,
  `product_desc` text NOT NULL,
  `product_image` varchar(255) NOT NULL,
  `product_image2` varchar(255) DEFAULT NULL,
  `product_image3` varchar(255) DEFAULT NULL,
  `product_keywords` text NOT NULL,
  `product_qty` int(11) NOT NULL DEFAULT 10,
  PRIMARY KEY (`product_id`),
  KEY `product_cat` (`product_cat`),
  KEY `product_brand` (`product_brand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` VALUES 
(5,1,2,'Samsung Galaxy S25 Ultra',124999,'The ultimate smartphone with AI capabilities and pro-grade camera.','1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png',NULL,NULL,'samsung s25 ultra galaxy mobile',15),
(6,1,4,'Motorola G85 5G',18999,'Sleek design with 5G speed and powerful performance.','1772203498_1770813172_motorola-g85-5g-pdp-ecom-render-6-gadget-gray-z2wh5m54a.png',NULL,NULL,'motorola g85 5g mobile moto',25),
(7,1,1,'HP Pavilion 15.6 Laptop',65000,'Powerful HP laptop engineered for productivity and computing.','1772203508_1770813469_669025df1d73a44bd21c762c-hp-pavilion-15-6-fhd-touchscreen.png',NULL,NULL,'hp pavilion laptop',10),
(9,2,6,'Red Designer Ladies Dress',999,'Premium designer dress crafted for special occasions.','1778173878_p_image_1773469710_71STpNvDT+L._SY741_.jpg','','','Red ladies dress fashion',10),
(10,5,7,'Modern Living Furniture Set',999,'Elegant wooden furniture set for living spaces.','1778173948_p_image_1773549974_furniture-design-service.jpeg','','','Furnitures home decor',8),
(11,3,6,'Lymio Casual Hoodie',999,'Comfortable cotton fleece hoodie for everyday wear.','1778174079_p_image_1773469889_71GaH2nLQ6L._SY741_.jpg','','','Lymio Hoodie men sweater',12),
(12,1,1,'Acer Nitro Lite 16 Gaming Laptop',999,'High-performance gaming laptop with Intel core processor.','1778174153_p_image_1772203547_1770878716_download (2).jpg','','','Acer Nitro Lite 16 Intel gaming',14),
(13,1,3,'iPhone 15 Pro Titanium',999,'Aeronautical-grade titanium design with A17 Pro chip.','1778174214_p_image_1772203517_1770876478_download.jpg','','','iPhone 15 Pro apple mobile',10),
(14,7,7,'Professional Sports Equipment Kit',999,'All-in-one athletic gear kit for outdoor activities.','1778174287_p_image_1773509623_istockphoto-949190756-612x612.jpg','','','sports fitness equipment',20),
(15,1,1,'HP Omen Gaming Laptop',999,'Next-gen gaming laptop with advanced cooling architecture.','1778174359_p_image_1772203537_1770877413_download (1).jpg','','','HP gaming laptop omen',10),
(16,1,1,'Galaxy Book4 Ultra',999,'Ultra-lightweight premium laptop with AMOLED touch display.','1778174413_p_image_1772203526_1770876884_images (1).jpg','','','Galaxy Book4 Ultra laptop',7),
(17,6,7,'Smart Inverter Refrigerator',999,'Energy-efficient double door refrigerator.','1778174523_p_image_1773507628_81MA5zD2oPL._AC_UF350,350_QL80_.jpg','','','Refrigerator kitchen appliance',5);

-- --------------------------------------------------------
-- Table structure for table `user_info`
-- --------------------------------------------------------

CREATE TABLE `user_info` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address1` varchar(300) NOT NULL,
  `address2` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `user_info_backup`
-- --------------------------------------------------------

CREATE TABLE `user_info_backup` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address1` varchar(300) NOT NULL,
  `address2` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger to backup user insertion
DELIMITER $$
CREATE TRIGGER `after_user_info_insert` AFTER INSERT ON `user_info` FOR EACH ROW BEGIN 
INSERT INTO user_info_backup VALUES(new.user_id,new.first_name,new.last_name,new.email,new.password,new.mobile,new.address1,new.address2);
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Table structure for table `cart`
-- --------------------------------------------------------

CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `p_id` int(11) NOT NULL,
  `ip_add` varchar(250) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `p_id` (`p_id`),
  KEY `user_id` (`user_id`),
  KEY `ip_add` (`ip_add`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `wishlist`
-- --------------------------------------------------------

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `p_id` int(11) NOT NULL,
  `ip_add` varchar(250) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `p_id` (`p_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `orders_info`
-- --------------------------------------------------------

CREATE TABLE `orders_info` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zip` varchar(20) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'COD',
  `cardname` varchar(255) NOT NULL DEFAULT '',
  `cardnumber` varchar(50) NOT NULL DEFAULT '',
  `expdate` varchar(50) NOT NULL DEFAULT '',
  `prod_count` int(11) DEFAULT 0,
  `total_amt` int(11) DEFAULT 0,
  `cvv` int(5) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `order_products`
-- --------------------------------------------------------

CREATE TABLE `order_products` (
  `order_pro_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) DEFAULT 1,
  `amt` int(11) DEFAULT 0,
  PRIMARY KEY (`order_pro_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `reviews`
-- --------------------------------------------------------

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `review` text NOT NULL,
  `datetime` datetime NOT NULL,
  `rating` int(1) NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `logs`
-- --------------------------------------------------------

CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Constraints & Foreign Keys
-- --------------------------------------------------------

ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`product_cat`) REFERENCES `categories` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_brand` FOREIGN KEY (`product_brand`) REFERENCES `brands` (`brand_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders_info`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `order_products`
  ADD CONSTRAINT `fk_order_products_order` FOREIGN KEY (`order_id`) REFERENCES `orders_info` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

COMMIT;
