-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 15, 2018 at 01:09 PM
-- Server version: 5.5.60-0+deb8u1
-- PHP Version: 5.6.36-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE IF NOT EXISTS `addresses` (
`id` int(11) NOT NULL,
  `street` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pc` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `street`, `city`, `state`, `pc`, `_users`) VALUES
(23, 'hhh', '', '', '9222', 1),
(24, '', '', '', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `domelements`
--

CREATE TABLE IF NOT EXISTS `domelements` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `_domelements` int(11) DEFAULT NULL,
  `_domelements_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domelements`
--

INSERT INTO `domelements` (`id`, `name`, `_domelements`, `_domelements_position`) VALUES
(9, 'ctgbxtt', 60, 0),
(14, 'title', 63, 0),
(15, 'title', 64, 0),
(19, 'username', 64, 0),
(20, 'status', 64, 0),
(23, 'status', 63, 0),
(25, 'crtbxtt', 65, 0),
(27, 'ckouttt', 65, 0),
(32, 'license', 61, 0),
(33, 'designed', 61, 0),
(36, 'addcarttt', 60, 0),
(38, 'lgintt', 182, 0),
(41, 'headtitle', 59, 0),
(42, 'headsubtitle', 59, 0),
(43, 'username', 63, 0),
(44, 'emptyvallabel', 73, 0),
(58, 'root', NULL, 0),
(59, 'top', 71, 0),
(60, 'middle', 71, 0),
(61, 'bottom', 71, 0),
(62, 'logbox', 60, 0),
(63, 'logboxin', 62, 0),
(64, 'logboxout', 62, 0),
(65, 'cartbox', 60, 0),
(66, 'nav', 72, 0),
(71, 'labels', 58, 2),
(72, 'texts', 58, 1),
(73, 'not located', 71, 0),
(97, 'TABLE_ADDRESSES', 60, 3),
(98, 'street', 97, 3),
(99, 'city', 97, 4),
(100, 'state', 97, 2),
(102, 'pc', 97, 1),
(103, 'TABLE_USERSDATA', 60, 2),
(104, 'name', 103, 4),
(105, 'surname', 103, 3),
(106, 'email', 103, 2),
(107, 'phonenumber', 103, 1),
(108, 'langboxtt', 60, 1),
(109, 'checkout', 60, 4),
(110, 'chkt1next', 109, 1),
(111, 'chkt1add', 109, 2),
(182, 'logform', 60, 0),
(183, 'userName', 182, 0),
(184, 'password', 182, 0),
(185, 'login', 182, 0),
(186, 'pwdCharError', 182, 0),
(187, 'userCharError', 182, 0),
(188, 'userError', 182, 0),
(189, 'pwdError', 182, 0),
(190, 'loginOk', 182, 0),
(191, 'emailError', 182, 0),
(192, 'userExistsError', 182, 0),
(193, 'signIn', 182, 0),
(194, 'signedIn', 182, 0),
(195, 'loginBack', 182, 0),
(196, 'emptyCart', 65, 0),
(197, 'chkt2add', 109, 0),
(198, 'chkt2next', 109, 0),
(275, 'loadImgError', 60, 0),
(277, 'backToLoginLb', 279, 0),
(278, 'addresstt', 279, 0),
(279, 'loggedin', 60, 0),
(280, 'archived', 279, 0),
(281, 'new', 279, 0),
(282, 'btShowOrd', 279, 0),
(283, 'btShowAdd', 279, 0),
(284, 'TABLE_ORDERITEMS', 60, 0),
(285, 'quantity', 284, 0),
(286, 'name', 284, 0),
(287, 'price', 284, 0),
(314, '', 66, 2),
(315, '', 314, 1),
(316, 'currency', 60, 0),
(317, 'signuptt', 182, 0),
(318, '', 66, 3),
(319, '', 318, 1),
(320, '', 318, 2),
(321, '', 66, 1),
(322, '', 321, 1),
(323, '', 321, 2),
(324, '', 321, 3),
(325, 'currencyNote', 316, 0);

-- --------------------------------------------------------

--
-- Table structure for table `domelementsdata`
--

CREATE TABLE IF NOT EXISTS `domelementsdata` (
`id` int(11) NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `_domelements` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domelementsdata`
--

INSERT INTO `domelementsdata` (`id`, `value`, `_domelements`, `_languages`) VALUES
(9, 'Catalog', 9, 1),
(14, 'Log out', 14, 1),
(15, 'Log in', 15, 1),
(19, 'Guest', 19, 1),
(20, 'Not connected', 20, 1),
(23, 'Connected', 23, 1),
(25, 'shopping cart', 25, 1),
(27, 'Check out', 27, 1),
(32, '<a href="LICENSE.txt">License</a>', 32, 1),
(33, 'Powered by <a href="https://sourceforge.net/projects/youronlineshop/">YourOnlineShop</a>', 33, 1),
(36, '+ 1 to the cart', 36, 1),
(38, 'Insert you account details or create a new account.', 38, 1),
(41, 'tienda de ropa', 41, 1),
(42, 'Hello my friends', 42, 1),
(43, 'the user name', 43, 1),
(44, 'Not any value', 44, 1),
(58, '', 58, 1),
(59, '', 59, 1),
(60, '', 60, 1),
(61, '', 61, 1),
(62, '', 62, 1),
(63, '', 63, 1),
(64, '', 64, 1),
(65, '', 65, 1),
(66, '', 66, 1),
(71, '', 71, 1),
(72, '', 72, 1),
(73, '', 73, 1),
(97, ' ', 97, 1),
(98, 'street, num...', 98, 1),
(99, 'city', 99, 1),
(100, 'state', 100, 1),
(102, 'postal code', 102, 1),
(103, '', 103, 1),
(104, 'name', 104, 1),
(105, '<div><span style="font-size: 0.875rem;">surname</span><br></div>', 105, 1),
(106, 'email', 106, 1),
(107, 'phone number', 107, 1),
(108, 'language', 108, 1),
(109, 'Continue &raquo;', 110, 1),
(110, 'Check if your order is ok and then click on Continue to get to the next step.', 111, 1),
(180, 'User Name', 183, 1),
(181, 'Password', 184, 1),
(182, 'Log in', 185, 1),
(183, '"Password between " + min + " and " + max + " characters!"', 186, 1),
(184, '"User name between " + min + " and " + max + " characters!"', 187, 1),
(185, 'User Name Incorrect', 188, 1),
(186, 'Password Incorrect', 189, 1),
(187, 'Login Ok', 190, 1),
(188, 'Incorrect Email', 191, 1),
(189, 'User Name aready taken', 192, 1),
(190, 'Sign up', 193, 1),
(191, 'Signed In correctly', 194, 1),
(192, '&laquo; Back to Log in', 195, 1),
(193, 'Cart is Empty', 196, 1),
(194, 'Just one last thing.<br>Check if your address is ok, change it or fill it.<br>Use street field to write also street number and so on.<br>pc is postal code.', 197, 1),
(195, 'Finish Order', 198, 1),
(270, 'Error loading image', 275, 1),
(272, 'Back to login', 277, 1),
(273, 'Address', 278, 1),
(274, 'Show archived orders', 280, 1),
(275, 'Show new orders', 281, 1),
(276, 'Show Orders', 282, 1),
(277, 'Show Address', 283, 1),
(278, 'Quantity', 285, 1),
(279, 'Name', 286, 1),
(280, 'Price', 287, 1),
(307, 'first menu', 314, 1),
(308, 'Some text', 315, 1),
(309, '€', 316, 1),
(310, 'Insert the required data to create new user.', 317, 1),
(311, 'about us', 318, 1),
(312, 'Some paragraph<div>&nbsp;bla bla</div>', 319, 1),
(313, 'text from us<div>haha</div>', 320, 1),
(314, 'third', 321, 1),
(315, 'third content<div>sss</div>', 322, 1),
(316, '', 323, 1),
(317, '<div>kkkk</div>mor text.<div>hh</div><div><br></div><div><br></div><div>kk</div>', 324, 1),
(318, 'Edit Symbol', 325, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE IF NOT EXISTS `itemcategories` (
`id` int(11) NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategories`
--

INSERT INTO `itemcategories` (`id`, `_itemcategories`, `_itemcategories_position`) VALUES
(1, NULL, 0),
(6, 1, 3),
(11, 6, 1),
(12, 1, 1),
(13, 12, 2),
(14, 6, 3),
(15, 6, 2),
(16, 1, 2),
(17, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategoriesdata`
--

CREATE TABLE IF NOT EXISTS `itemcategoriesdata` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategoriesdata`
--

INSERT INTO `itemcategoriesdata` (`id`, `name`, `_itemcategories`, `_languages`) VALUES
(1, 'root', NULL, 1),
(6, 'first category', 6, 1),
(11, 'First subcategory', 11, 1),
(12, 'second category', 12, 1),
(13, 'subcategory name', 13, 1),
(14, 'subcat 2', 14, 1),
(15, 'name sub', 15, 1),
(16, '', 16, 1),
(17, '', 17, 1);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
`id` int(11) NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `_itemcategories`, `_itemcategories_position`) VALUES
(11, 13, 1),
(12, 13, 2),
(13, 13, 3),
(14, 14, 1),
(15, 14, 3),
(16, 14, 2),
(17, 15, 1),
(18, 15, 2),
(19, 15, 3),
(20, 11, 2),
(21, 17, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemsdata`
--

CREATE TABLE IF NOT EXISTS `itemsdata` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_items` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemsdata`
--

INSERT INTO `itemsdata` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `image`, `price`, `_items`, `_languages`) VALUES
(11, 'product tit', '', 'jjj', '', 7.00, 11, 1),
(12, 'my p examle', '', '', '', 0.00, 12, 1),
(13, 'product tit', '', '', 'file_13.png', 0.00, 13, 1),
(14, '', '', '', '', 0.00, 14, 1),
(15, '', '', '', '', 0.00, 15, 1),
(16, '', '', '', '', 0.00, 16, 1),
(17, 'p name', '', '', '', 0.00, 17, 1),
(18, '', '', '', '', 0.00, 18, 1),
(19, 'p name', '', '', '', 0.00, 19, 1),
(20, '', '', '', '', 7.00, 20, 1),
(21, 'kk', '', '', '', 980.00, 21, 1);

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE IF NOT EXISTS `languages` (
`id` int(11) NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `code`) VALUES
(1, 'en');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE IF NOT EXISTS `orderitems` (
`id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`id`, `quantity`, `name`, `price`, `_orders`) VALUES
(106, 1, 'casa', 98.99, 7),
(107, 1, 'kkkkkkkkkkkkkkkkkkkkfire place', 43.00, 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
`id` int(11) NOT NULL,
  `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '0',
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `creationdate`, `modificationdate`, `status`, `_users`) VALUES
(7, '2018-06-27 05:43:47', '0000-00-00 00:00:00', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_userstypes` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`, `_userstypes`) VALUES
(1, 'webadmin', 'webadmin', 7),
(2, 'ordersadmin', 'ordersadmin', 3);

-- --------------------------------------------------------

--
-- Table structure for table `usersdata`
--

CREATE TABLE IF NOT EXISTS `usersdata` (
`id` int(11) NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` int(11) NOT NULL,
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersdata`
--

INSERT INTO `usersdata` (`id`, `name`, `surname`, `email`, `phonenumber`, `_users`) VALUES
(1, 'fsmy pa', 'pep', 'kkpjjjjj', 666, 1),
(2, '', '', '', 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `userstypes`
--

CREATE TABLE IF NOT EXISTS `userstypes` (
`id` int(11) NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userstypes`
--

INSERT INTO `userstypes` (`id`, `type`) VALUES
(3, 'orders administrator'),
(7, 'web administrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
 ADD PRIMARY KEY (`id`), ADD KEY `_users` (`_users`);

--
-- Indexes for table `domelements`
--
ALTER TABLE `domelements`
 ADD PRIMARY KEY (`id`), ADD KEY `_domelementsstructure` (`_domelements`);

--
-- Indexes for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_domelementsstructure` (`_domelements`), ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `itemcategories`
--
ALTER TABLE `itemcategories`
 ADD PRIMARY KEY (`id`), ADD KEY `_itemcategories` (`_itemcategories`);

--
-- Indexes for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_itemcategories` (`_itemcategories`,`_languages`), ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
 ADD PRIMARY KEY (`id`), ADD KEY `_itemcategories` (`_itemcategories`);

--
-- Indexes for table `itemsdata`
--
ALTER TABLE `itemsdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_groups` (`_items`), ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id` (`id`), ADD KEY `_orders` (`_orders`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
 ADD PRIMARY KEY (`id`), ADD KEY `_users` (`_users`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD KEY `_userstypes` (`_userstypes`);

--
-- Indexes for table `usersdata`
--
ALTER TABLE `usersdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_users` (`_users`);

--
-- Indexes for table `userstypes`
--
ALTER TABLE `userstypes`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `domelements`
--
ALTER TABLE `domelements`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=326;
--
-- AUTO_INCREMENT for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=319;
--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `itemsdata`
--
ALTER TABLE `itemsdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=108;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `usersdata`
--
ALTER TABLE `usersdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `userstypes`
--
ALTER TABLE `userstypes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
ADD CONSTRAINT `addresses_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `domelements`
--
ALTER TABLE `domelements`
ADD CONSTRAINT `domelements_ibfk_1` FOREIGN KEY (`_domelements`) REFERENCES `domelements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
ADD CONSTRAINT `domelementsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `domelementsdata_ibfk_3` FOREIGN KEY (`_domelements`) REFERENCES `domelements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itemcategories`
--
ALTER TABLE `itemcategories`
ADD CONSTRAINT `itemcategories_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
ADD CONSTRAINT `itemcategoriesdata_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `itemcategoriesdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itemsdata`
--
ALTER TABLE `itemsdata`
ADD CONSTRAINT `itemsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `itemsdata_ibfk_3` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
ADD CONSTRAINT `orderitems_orders` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
ADD CONSTRAINT `orders_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
ADD CONSTRAINT `users_userstypes` FOREIGN KEY (`_userstypes`) REFERENCES `userstypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `usersdata`
--
ALTER TABLE `usersdata`
ADD CONSTRAINT `usersdata_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
