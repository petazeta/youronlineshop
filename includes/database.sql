-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 11, 2019 at 10:54 AM
-- Server version: 5.5.62-0+deb8u1
-- PHP Version: 5.6.39-0+deb8u2

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `street`, `city`, `state`, `pc`, `_users`) VALUES
(23, 'hhh', '', '', '9222', 2),
(24, 'ffff', 'jjjj', 'oooo', '4444', 1),
(25, '', '', '', '', 3);

-- --------------------------------------------------------

--
-- Table structure for table `domelements`
--

CREATE TABLE IF NOT EXISTS `domelements` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `_domelements` int(11) DEFAULT NULL,
  `_domelements_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(110, 'chkt1next', 109, 3),
(111, 'chkt1add', 109, 4),
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
(316, 'currency', 60, 0),
(317, 'signuptt', 182, 0),
(337, 'chkt3next', 109, 1),
(338, 'chkt3add', 109, 2),
(339, 'order', 109, 9),
(340, 'total', 339, 1),
(341, 'chkt4add', 109, 5),
(342, 'chkt4userarea', 109, 6),
(343, 'subtotal', 339, 2),
(344, 'chktback', 109, 8),
(357, 'extraEdition', 60, 5),
(359, '', 66, 1),
(360, '', 66, 2);

-- --------------------------------------------------------

--
-- Table structure for table `domelementsdata`
--

CREATE TABLE IF NOT EXISTS `domelementsdata` (
`id` int(11) NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `_domelements` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=811 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(25, 'Shoping cart', 25, 1),
(27, 'Check out', 27, 1),
(32, '<a href="LICENSE.txt">License</a>', 32, 1),
(33, 'Powered by <a href="https://sourceforge.net/projects/youronlineshop/">YourOnlineShop</a>', 33, 1),
(36, '+ 1 to the cart', 36, 1),
(38, 'Insert you account details or create a new account.', 38, 1),
(41, 'title', 41, 1),
(42, 'subtitle', 42, 1),
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
(105, 'Surname', 105, 1),
(106, 'email', 106, 1),
(107, 'phone number', 107, 1),
(108, 'language', 108, 1),
(109, 'Continue »', 110, 1),
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
(194, 'Check if your address is ok, change it or fill it.<br>Use street field to write also street number and so on.<br>pc is postal code.', 197, 1),
(195, 'Continue »', 198, 1),
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
(309, '$', 316, 1),
(310, 'Insert the required data to create new user.', 317, 1),
(702, 'Continue »', 337, 1),
(703, 'Please select your preferred shipping type', 338, 1),
(704, 'Total', 340, 1),
(705, 'The order has been successfully created', 341, 1),
(706, 'Go to my user area', 342, 1),
(707, 'SubTotal', 343, 1),
(708, 'Go back', 344, 1),
(807, 'Extra Elements', 357, 1),
(809, '', 359, 1),
(810, '', 360, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE IF NOT EXISTS `itemcategories` (
`id` int(11) NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategories`
--

INSERT INTO `itemcategories` (`id`, `_itemcategories`, `_itemcategories_position`) VALUES
(1, NULL, 0),
(59, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategoriesdata`
--

CREATE TABLE IF NOT EXISTS `itemcategoriesdata` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategoriesdata`
--

INSERT INTO `itemcategoriesdata` (`id`, `name`, `_itemcategories`, `_languages`) VALUES
(1, 'root', NULL, 1),
(56, '', 59, 1);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
`id` int(11) NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itemsdata`
--

CREATE TABLE IF NOT EXISTS `itemsdata` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_items` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
`id` int(11) NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `miscelaneous`
--

CREATE TABLE IF NOT EXISTS `miscelaneous` (
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ordershippingtypes`
--

CREATE TABLE IF NOT EXISTS `ordershippingtypes` (
`id` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access` int(10) DEFAULT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shippingtypes`
--

CREATE TABLE IF NOT EXISTS `shippingtypes` (
`id` int(11) NOT NULL,
  `image` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_shippingtypes` int(11) DEFAULT NULL,
  `_shippingtypes_position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingtypes`
--

INSERT INTO `shippingtypes` (`id`, `image`, `delay_hours`, `price`, `_shippingtypes`, `_shippingtypes_position`) VALUES
(1, '', 0, '0.00', NULL, 0),
(2, '', 24, '10.00', 1, 1),
(3, '', 72, '3.00', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `shippingtypesdata`
--

CREATE TABLE IF NOT EXISTS `shippingtypesdata` (
`id` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_shippingtypes` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingtypesdata`
--

INSERT INTO `shippingtypesdata` (`id`, `name`, `description`, `_shippingtypes`, `_languages`) VALUES
(5, 'ship1', 'des ship1', 2, 1),
(6, 'ship2', 'des ship2', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `_userstypes` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`, `status`, `_userstypes`) VALUES
(1, 'webadmin', '$2y$10$u79thpxBIp5qH5IoZqSjXe9CqKSPVYKlZrzRalQLze3FXAIgfSO3u', 0, 7),
(2, 'ordersadmin', '$2y$10$PlqpvA9Oafxu9UA6tbF67OL86oqDjFgY9IPUuSHoPXl3LQ12J8wHu', 0, 3),
(3, 'prueba', '$2y$10$nUgRBdrgyL3uKGtyTDI0CepiPuEHb2pbHWtx5oLiXw3/7vlMlwse.', 0, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersdata`
--

INSERT INTO `usersdata` (`id`, `name`, `surname`, `email`, `phonenumber`, `_users`) VALUES
(1, 'fsmy pa', 'kkkkkkkkkkkkkkkupep', 'kkpjjjjj@caca.com', 666, 1),
(2, 'order', '', '', 0, 2),
(3, '', '', '', 0, 3);

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
 ADD PRIMARY KEY (`id`), ADD KEY `_languages` (`_languages`), ADD KEY `_itemcategories` (`_itemcategories`);

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
-- Indexes for table `logs`
--
ALTER TABLE `logs`
 ADD PRIMARY KEY (`id`), ADD KEY `_users` (`_users`);

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
-- Indexes for table `ordershippingtypes`
--
ALTER TABLE `ordershippingtypes`
 ADD PRIMARY KEY (`id`), ADD KEY `_orders` (`_orders`);

--
-- Indexes for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
 ADD PRIMARY KEY (`id`), ADD KEY `_shippingtypes` (`_shippingtypes`);

--
-- Indexes for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_shipmenttypes` (`_shippingtypes`), ADD KEY `_language` (`_languages`);

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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `domelements`
--
ALTER TABLE `domelements`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=361;
--
-- AUTO_INCREMENT for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=811;
--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `itemsdata`
--
ALTER TABLE `itemsdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ordershippingtypes`
--
ALTER TABLE `ordershippingtypes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `usersdata`
--
ALTER TABLE `usersdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
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
-- Constraints for table `logs`
--
ALTER TABLE `logs`
ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `ordershippingtypes`
--
ALTER TABLE `ordershippingtypes`
ADD CONSTRAINT `ordershippingtypes_ibfk_1` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
ADD CONSTRAINT `shippingtypes_ibfk_1` FOREIGN KEY (`_shippingtypes`) REFERENCES `shippingtypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
ADD CONSTRAINT `shippingtypesdata_ibfk_3` FOREIGN KEY (`_shippingtypes`) REFERENCES `shippingtypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `shippingtypesdata_ibfk_4` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
