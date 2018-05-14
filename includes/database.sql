-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 14, 2018 at 02:45 AM
-- Server version: 5.5.58-0+deb8u1
-- PHP Version: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

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
  `pc` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `street`, `city`, `state`, `pc`) VALUES
(23, '', '', '', ''),
(24, '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `domelements`
--

CREATE TABLE IF NOT EXISTS `domelements` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `innerHTML` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domelements`
--

INSERT INTO `domelements` (`id`, `name`, `innerHTML`) VALUES
(9, 'ctgbxtt', 'Shop'),
(14, 'title', 'Log out'),
(15, 'title', 'Log in'),
(19, 'username', 'Guest'),
(20, 'status', 'Not connected'),
(23, 'status', 'Connected'),
(25, 'crtbxtt', 'Shopping cart'),
(27, 'ckouttt', 'Check out'),
(32, 'license', '<a href="LICENSE.txt">License</a>'),
(33, 'designed', 'Powered by <a href="https://sourceforge.net/projects/youronlineshop/">YourOnlineShop</a>'),
(36, 'addcarttt', '+1 to the cart'),
(38, 'lgintt', 'Insert you account details or create a new account.'),
(41, 'headtitle', 'Shop Title'),
(42, 'headsubtitle', 'This is my first shop'),
(43, 'username', 'the user name'),
(44, 'emptyvallabel', 'Not any value'),
(46, '', '<div>There are two already created users: "webadmin" and "ordersadmin".&nbsp;</div><div><br></div><div>These are the users names, and users passwords are the same as users names.</div><div><br></div><div>User "ordersadmin" is order administrator and can watch and edit all the orders. Once you log in with this user click at "Show orders" button.</div><div><br></div><div>User "webadmin" is web administrator and can edit the web page content and the catalog (categories and items).<br></div>'),
(47, '', 'This software implements a smart customizable WYSIWYG (What You See Is What You Get) online ordering system (also known as ecommerce, e-commerce CMS, online store or shopping cart).<br>'),
(48, '', 'Continue at [&nbsp;<a href="">How to</a>&nbsp;]\r\n<script>\r\n  thisElement.onclick=function(){\r\n    document.querySelector("nav").querySelectorAll("a")[1].click();\r\n    return false;\r\n  }\r\n</script>'),
(49, '', 'To start: log in with one of the users or create a new one.'),
(50, '', 'More information at: <a href="https://github.com/petazeta/youronlineshop/wiki">Project Docs</a>&nbsp;and <a href="https://sourceforge.net/p/youronlineshop/discussion/">Project Forums</a>'),
(56, '', 'DbManager is a tool for editing ORM database records.<div><br></div><div>Get more information at: <a href="http://youronlineshop.sourceforge.net/dbmanager/">Dbmanager Home</a></div>'),
(57, '', 'Once finish editing content click outside of the editable area to save changes. Use Intro for new line.'),
(58, 'root', ''),
(59, 'top', ''),
(60, 'middle', ''),
(61, 'bottom', ''),
(62, 'logbox', ''),
(63, 'logboxin', ''),
(64, 'logboxout', ''),
(65, 'cartbox', ''),
(66, 'nav', ''),
(67, 'menu', 'About'),
(68, 'menu', 'How to'),
(69, 'More Info', 'More Info'),
(70, 'menu', 'Additional Apps'),
(71, 'labels', ''),
(72, 'texts', ''),
(73, 'not located', '');

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE IF NOT EXISTS `itemcategories` (
`id` int(11) NOT NULL,
  `cname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategories`
--

INSERT INTO `itemcategories` (`id`, `cname`) VALUES
(1, 'root');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `image`, `price`) VALUES
(21, '', '', '', '', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE IF NOT EXISTS `links` (
`id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '1',
  `relationships_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=918 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `links`
--

INSERT INTO `links` (`id`, `parent_id`, `child_id`, `sort_order`, `relationships_id`) VALUES
(71, 4, 5, 1, 17),
(72, 4, 6, 2, 17),
(73, 4, 7, 3, 17),
(128, 1, 2, 2, 18),
(129, 1, 3, 3, 18),
(133, 33, 34, 2, 17),
(134, 33, 35, 1, 17),
(272, 1, 6, 1, 18),
(482, 1, 23, 2, 26),
(583, 2, 7, 1, 18),
(591, 7, 8, 1, 18),
(592, 7, 9, 2, 18),
(600, 2, 10, 2, 18),
(698, 33, 8, 1, 15),
(699, 32, 9, 1, 15),
(740, 14, 21, 1, 14),
(787, 1, 30, 1, 26),
(818, 14, 3, 1, 4),
(819, 15, 7, 1, 4),
(823, 1, 31, 3, 26),
(839, 52, 83, 1, 21),
(840, 1, 32, 4, 26),
(849, 59, 41, 2, 17),
(850, 59, 42, 1, 17),
(851, 60, 36, 5, 17),
(852, 60, 38, 4, 17),
(853, 60, 9, 3, 17),
(854, 60, 62, 1, 17),
(855, 62, 63, 1, 17),
(856, 62, 64, 2, 17),
(857, 63, 23, 3, 17),
(858, 63, 14, 2, 17),
(859, 63, 43, 1, 17),
(860, 64, 20, 3, 17),
(861, 64, 19, 2, 17),
(862, 64, 15, 1, 17),
(863, 60, 65, 2, 17),
(864, 65, 27, 2, 17),
(865, 65, 25, 1, 17),
(866, 61, 33, 2, 17),
(867, 61, 32, 1, 17),
(869, 66, 67, 1, 17),
(870, 66, 68, 2, 17),
(871, 66, 69, 3, 17),
(872, 66, 70, 4, 17),
(874, 67, 48, 2, 17),
(875, 68, 46, 1, 17),
(876, 68, 57, 2, 17),
(877, 68, 49, 3, 17),
(878, 69, 50, 1, 17),
(879, 70, 56, 1, 17),
(880, 58, 71, 1, 17),
(881, 58, 72, 2, 17),
(883, 71, 59, 3, 17),
(884, 71, 60, 2, 17),
(885, 71, 61, 1, 17),
(886, 72, 66, 1, 17),
(887, 71, 73, 4, 17),
(888, 73, 44, 1, 17),
(889, 67, 47, 1, 17),
(891, 53, 84, 1, 21),
(893, 54, 85, 1, 21),
(895, 55, 86, 1, 21),
(897, 56, 87, 1, 21),
(900, 57, 88, 2, 21),
(901, 57, 89, 1, 21),
(905, 58, 90, 3, 21),
(906, 58, 91, 2, 21),
(907, 58, 92, 1, 21),
(910, 16, 33, 1, 10),
(911, 16, 23, 1, 29),
(912, 17, 34, 1, 10),
(913, 17, 24, 1, 29),
(914, 16, 7, 1, 4),
(915, 17, 3, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE IF NOT EXISTS `orderitems` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`id`, `name`, `price`, `quantity`) VALUES
(83, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 2),
(84, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 2),
(85, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 1),
(86, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 1),
(87, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 1),
(88, 'Peeling + morera', 20.00, 1),
(89, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 1),
(90, 'Regenerador Cutáneo 200ml', 714.00, 1),
(91, 'Peeling + morera', 20.00, 2),
(92, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
`id` int(11) NOT NULL,
  `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relationships`
--

CREATE TABLE IF NOT EXISTS `relationships` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parenttablename` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentunique` tinyint(1) NOT NULL DEFAULT '1',
  `childtablename` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childunique` tinyint(1) NOT NULL DEFAULT '0',
  `childtablelocked` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relationships`
--

INSERT INTO `relationships` (`id`, `name`, `parenttablename`, `parentunique`, `childtablename`, `childunique`, `childtablelocked`) VALUES
(4, 'userstypes', 'TABLE_USERS', 0, 'TABLE_USERSTYPES', 1, 1),
(10, 'usersdata', 'TABLE_USERS', 1, 'TABLE_USERSDATA', 1, 0),
(13, 'itemcategories', 'TABLE_ITEMCATEGORIES', 1, 'TABLE_ITEMCATEGORIES', 0, 0),
(14, 'items', 'TABLE_ITEMCATEGORIES', 1, 'TABLE_ITEMS', 0, 0),
(17, 'domelements', 'TABLE_DOMELEMENTS', 1, 'TABLE_DOMELEMENTS', 0, 0),
(20, 'orders', 'TABLE_USERS', 1, 'TABLE_ORDERS', 0, 0),
(21, 'orderitems', 'TABLE_ORDERS', 1, 'TABLE_ORDERITEMS', 0, 0),
(22, 'items', 'TABLE_ORDERITEMS', 1, 'TABLE_ITEMS', 1, 1),
(29, 'addresses', 'TABLE_USERS', 1, 'TABLE_ADDRESSES', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`) VALUES
(16, 'webadmin', 'webadmin'),
(17, 'ordersadmin', 'ordersadmin');

-- --------------------------------------------------------

--
-- Table structure for table `usersdata`
--

CREATE TABLE IF NOT EXISTS `usersdata` (
`id` int(11) NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersdata`
--

INSERT INTO `usersdata` (`id`, `name`, `surname`, `email`, `phonenumber`) VALUES
(33, '', '', '', 0),
(34, '', '', '', 0);

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
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domelements`
--
ALTER TABLE `domelements`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itemcategories`
--
ALTER TABLE `itemcategories`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relationships`
--
ALTER TABLE `relationships`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersdata`
--
ALTER TABLE `usersdata`
 ADD PRIMARY KEY (`id`);

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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=78;
--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=918;
--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=93;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `relationships`
--
ALTER TABLE `relationships`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `usersdata`
--
ALTER TABLE `usersdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `userstypes`
--
ALTER TABLE `userstypes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
