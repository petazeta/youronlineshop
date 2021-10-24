-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2021 at 03:58 PM
-- Server version: 8.0.26-0ubuntu0.20.04.3
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `latest`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `streetaddress` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipcode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_users` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `streetaddress`, `city`, `state`, `zipcode`, `country`, `_users`) VALUES
(23, '', '', '', '', NULL, 2),
(24, '', '', '', '', NULL, 1),
(25, '', '', '', '', NULL, 4),
(26, '', '', '', '', NULL, 6),
(27, '', '', '', '', NULL, 7);

-- --------------------------------------------------------

--
-- Table structure for table `domelements`
--

CREATE TABLE `domelements` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_domelements` int DEFAULT NULL,
  `_domelements_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domelements`
--

INSERT INTO `domelements` (`id`, `name`, `_domelements`, `_domelements_position`) VALUES
(9, 'ctgbxtt', 60, 0),
(14, 'title', 63, 0),
(15, 'title', 64, 0),
(25, 'crtbxtt', 65, 0),
(27, 'ckouttt', 65, 0),
(33, 'designed', 61, 0),
(36, 'addcarttt', 60, 0),
(38, 'lgintt', 182, 0),
(41, 'headtitle', 59, 0),
(42, 'headsubtitle', 59, 0),
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
(97, 'TABLE_ADDRESSES', 60, 4),
(98, 'streetaddress', 97, 3),
(99, 'city', 97, 4),
(100, 'state', 97, 2),
(102, 'zipcode', 97, 1),
(103, 'TABLE_USERSDATA', 60, 3),
(104, 'fullname', 103, 4),
(106, 'emailaddress', 103, 2),
(107, 'phonenumber', 103, 1),
(108, 'langbox', 60, 2),
(109, 'checkout', 60, 5),
(111, 'orderTit', 109, 6),
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
(197, 'addressTit', 109, 0),
(277, 'btShowInfo', 279, 0),
(278, 'addresstt', 279, 0),
(279, 'dashboard', 60, 0),
(282, 'btShowOrd', 279, 0),
(283, 'btShowAdd', 279, 0),
(284, 'TABLE_ORDERITEMS', 60, 0),
(285, 'quantity', 284, 0),
(286, 'name', 284, 0),
(287, 'price', 284, 0),
(316, 'currency', 60, 0),
(317, 'signuptt', 182, 0),
(338, 'shippingTit', 109, 4),
(339, 'order', 109, 15),
(340, 'total', 339, 1),
(341, 'paymentTit', 109, 8),
(343, 'subtotal', 339, 2),
(357, 'extraEdition', 279, 6),
(361, 'online', 62, 1),
(362, 'successTit', 109, 9),
(363, 'confirmButLabel', 109, 3),
(389, 'nav2', 66, 2),
(391, '', 389, 1),
(392, 'expimp', 279, 7),
(393, 'titexp', 392, 1),
(394, 'butexp', 392, 4),
(395, 'butimp', 392, 5),
(396, 'titimp', 392, 3),
(397, '', 389, 2),
(419, 'nav1', 66, 1),
(424, 'btLogOut', 279, 2),
(425, '', 419, 1),
(426, 'hours', 60, 10),
(427, 'save', 73, 1),
(428, 'saved', 73, 2),
(429, 'userdataform', 60, 11),
(430, 'fieldCharError', 429, 1),
(431, 'emailCharError', 429, 2),
(432, 'textEdit', 279, 9),
(433, 'advice', 432, 1),
(434, 'imploadingmsg', 392, 6),
(435, 'chkgeneral', 392, 9),
(436, 'chkcatg', 392, 10),
(437, 'noselection', 392, 7),
(441, 'chkusers', 392, 13),
(442, 'newuserbt', 182, 1),
(443, 'implangerror', 392, 16),
(457, 'deletealert', 60, 12),
(458, 'titalert', 457, 1),
(459, 'textalert', 457, 2),
(460, 'langboxtt', 108, 1),
(461, 'newlangwait', 108, 2),
(462, 'paysucceed', 339, 3),
(463, 'dashboardtit', 279, 3),
(464, 'btChangePwd', 279, 1),
(465, 'changepwd', 279, 4),
(466, 'titmsg', 465, 1),
(467, 'newpwd', 465, 2),
(468, 'repeatpwd', 465, 3),
(469, 'btsmt', 465, 4),
(470, 'pwdDoubleError', 465, 5),
(471, 'pwdChangeOk', 465, 6),
(472, 'pwdChangeError', 465, 7),
(473, 'mails', 109, 1),
(474, 'newordercustomer', 473, 1),
(475, 'neworderadmin', 473, 2),
(476, 'subject', 474, 1),
(477, 'message', 474, 2),
(478, 'subject', 475, 1),
(479, 'message', 475, 2),
(480, 'impnocontent', 392, 8),
(481, 'changelangwait', 108, 3),
(482, 'loadImg', 60, 1),
(483, 'headNote', 482, 1),
(484, 'file', 482, 2),
(485, 'loadError', 482, 3),
(486, 'dontdelbutton', 457, 3),
(487, 'delbutton', 457, 4),
(488, 'discardtt', 65, 1),
(490, 'discardButLabel', 109, 7),
(491, 'showOrd', 279, 5),
(492, 'new', 491, 1),
(493, 'archived', 491, 2),
(496, 'date', 491, 3),
(497, 'name', 491, 4),
(498, 'order', 491, 5),
(499, 'actions', 491, 6),
(500, 'cancel', 482, 4),
(501, 'send', 482, 5),
(502, 'pagTit', 73, 3),
(503, 'rememberme', 182, 2),
(504, 'chklang', 392, 15),
(505, 'checkoutTit', 109, 12),
(506, 'country', 97, 5),
(507, 'details', 435, 1),
(508, 'details', 436, 1),
(509, 'chkcheckout', 392, 14),
(510, 'details', 509, 1),
(511, 'details', 504, 1),
(512, 'details', 441, 1),
(513, 'uploadingWait', 482, 6);

-- --------------------------------------------------------

--
-- Table structure for table `domelementsdata`
--

CREATE TABLE `domelementsdata` (
  `id` int NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `_domelements` int DEFAULT NULL,
  `_languages` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domelementsdata`
--

INSERT INTO `domelementsdata` (`id`, `value`, `_domelements`, `_languages`) VALUES
(9, 'My Catalog', 9, 2),
(14, 'My Account', 14, 2),
(15, 'Log in', 15, 2),
(25, 'Shopping Cart', 25, 2),
(27, 'Check out', 27, 2),
(33, 'Powered by <a href=\"https://www.youronlineshop.net/\">YourOnlineShop</a>', 33, 2),
(36, '+ 1 to the cart', 36, 2),
(38, 'Insert you account details or create a new account.', 38, 2),
(41, 'Shop example name', 41, 2),
(42, 'Several products and presents', 42, 2),
(44, 'Not any value', 44, 2),
(58, '', 58, 2),
(59, '', 59, 2),
(60, '', 60, 2),
(61, '', 61, 2),
(62, '', 62, 2),
(63, '', 63, 2),
(64, '', 64, 2),
(65, '', 65, 2),
(66, '', 66, 2),
(71, '', 71, 2),
(72, '', 72, 2),
(73, '', 73, 2),
(97, '', 97, 2),
(98, 'Street address', 98, 2),
(99, 'City', 99, 2),
(100, 'State', 100, 2),
(102, 'ZIP code', 102, 2),
(103, '', 103, 2),
(104, 'Full name', 104, 2),
(106, 'Email address', 106, 2),
(107, 'Phone number', 107, 2),
(110, 'Order', 111, 2),
(180, 'User Name', 183, 2),
(181, 'Password', 184, 2),
(182, 'Log in', 185, 2),
(183, 'Password is not long enough', 186, 2),
(184, 'User name is not long enough', 187, 2),
(185, 'User Name Incorrect', 188, 2),
(186, 'Password Incorrect', 189, 2),
(187, 'Login Ok', 190, 2),
(188, 'Incorrect Email', 191, 2),
(189, 'User Name aready taken', 192, 2),
(190, 'Sign up', 193, 2),
(191, 'Signed In correctly', 194, 2),
(192, '&laquo; Back to Log in', 195, 2),
(193, 'Cart is Empty', 196, 2),
(194, 'Address', 197, 2),
(272, 'User Info', 277, 2),
(273, 'Address', 278, 2),
(276, 'Show Orders', 282, 2),
(277, 'Show Address', 283, 2),
(278, 'Quantity', 285, 2),
(279, 'Name', 286, 2),
(280, 'Price', 287, 2),
(309, '€', 316, 2),
(310, 'Insert the required data to create new user.', 317, 2),
(703, 'Shipping', 338, 2),
(704, 'Total', 340, 2),
(705, 'Payment', 341, 2),
(707, 'SubTotal', 343, 2),
(807, 'Extra Elements Edition', 357, 2),
(811, 'Users online', 361, 2),
(812, 'The order has been successfully created', 362, 2),
(813, 'Continue Order&nbsp;', 363, 2),
(922, 'Contact', 389, 2),
(924, 'Contact information:', 391, 2),
(925, 'Export Area', 393, 2),
(926, 'Export', 394, 2),
(927, 'Export/Import', 392, 2),
(928, 'Import', 395, 2),
(929, 'Import Area', 396, 2),
(930, '<div>shop@smsss.net</div><div><br></div>Avenue 21.<div><br>425256 Sginy</div><div><br></div><div>Mont rel</div>', 397, 2),
(1051, 'About', 419, 2),
(1058, 'Log Out', 424, 2),
(1059, 'We are shop... :)', 425, 2),
(1060, 'h', 426, 2),
(1061, 'Save', 427, 2),
(1062, 'Record saved', 428, 2),
(1063, 'Error: Not enough characters.', 430, 2),
(1064, 'Error: Email not correct.', 431, 2),
(1065, 'Text Edition Tool', 432, 2),
(1066, 'You can use the text box below to create html formated text. Once you have created the content you can copy / paste into the text content of the actual elements you need to edit.', 433, 2),
(1067, 'Performing some operations please wait...', 434, 2),
(1068, 'Other Content', 435, 2),
(1069, 'Catalog', 436, 2),
(1070, 'Please select an option', 437, 2),
(1073, '', 284, 2),
(1074, '', 279, 2),
(1075, '', 182, 2),
(1076, '', 109, 2),
(1077, '', 429, 2),
(1078, '', 339, 2),
(1079, 'Users', 441, 2),
(1080, 'Or create a new account', 442, 2),
(1081, 'Languages don\'t match', 443, 2),
(1095, 'DELETE', 458, 2),
(1096, 'ATENTION: This element and its descedants will be removed.', 459, 2),
(1097, 'Languages', 460, 2),
(1098, 'Performing language data copy... Please wait...', 461, 2),
(1099, '', 108, 2),
(1100, '', 457, 2),
(1101, 'Payment transaction completed', 462, 2),
(1102, 'Dashboard from user:', 463, 2),
(1103, 'Change Password', 464, 2),
(1104, 'Change Password', 466, 2),
(1105, 'Repeat Password', 468, 2),
(1106, 'New Password', 467, 2),
(1107, 'Change', 469, 2),
(1108, 'The passwords written doesn\'t match', 470, 2),
(1109, 'Password successfully changed', 471, 2),
(1110, 'Password Change Error', 472, 2),
(1111, '', 465, 2),
(1112, '', 473, 2),
(1113, '', 474, 2),
(1114, '', 475, 2),
(1115, 'About your new order', 476, 2),
(1116, 'A new order has been registered. Thank you.', 477, 2),
(1117, 'New order registered', 478, 2),
(1118, 'A new order has been registered.', 479, 2),
(1119, 'There is no content to import', 480, 2),
(1120, 'Changing language data ...', 481, 2),
(1121, 'Error loading image', 485, 2),
(1122, 'Image file:', 484, 2),
(1123, 'Image File Selection', 483, 2),
(1124, 'Don\'t Remove', 486, 2),
(1125, 'Remove', 487, 2),
(1126, '<b>&times;</b> Discard', 488, 2),
(1128, 'Discard Order', 490, 2),
(1129, 'new', 492, 2),
(1130, 'archived', 493, 2),
(1131, 'Date', 496, 2),
(1132, 'Name', 497, 2),
(1133, 'Order', 498, 2),
(1134, 'Actions', 499, 2),
(1135, 'Cancel', 500, 2),
(1136, 'Send', 501, 2),
(1137, '', 502, 2),
(1138, '', 482, 2),
(1139, '', 491, 2),
(1140, 'Remember me', 503, 2),
(1141, 'Languages', 504, 2),
(1142, 'Please ckeck your Order data below and then click in Confirm Order', 505, 2),
(1143, 'Country', 506, 2),
(1144, 'It exports these custom site content: title and subtitle and menus and its content', 507, 2),
(1145, 'It exports this custom site content: Catalog content, that is, categories, subcategories and products', 508, 2),
(1146, 'Checkout shipping &amp; payment methods', 509, 2),
(1147, 'It exports this custom site content: shipping methods and payment methods', 510, 2),
(1148, 'It exports general languages content of the app that is not relationed with custom elements like menus, articles, products, ect...', 511, 2),
(1149, 'It exports users and its data', 512, 2),
(1150, 'Uploading Image ...', 513, 2);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE `itemcategories` (
  `id` int NOT NULL,
  `_itemcategories` int DEFAULT NULL,
  `_itemcategories_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategories`
--

INSERT INTO `itemcategories` (`id`, `_itemcategories`, `_itemcategories_position`) VALUES
(1, NULL, 0),
(54, 1, 1),
(55, 54, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategoriesdata`
--

CREATE TABLE `itemcategoriesdata` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_itemcategories` int DEFAULT NULL,
  `_languages` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemcategoriesdata`
--

INSERT INTO `itemcategoriesdata` (`id`, `name`, `_itemcategories`, `_languages`) VALUES
(1, 'root', 1, 2),
(62, 'First category', 54, 2),
(63, 'First subcategory', 55, 2);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int NOT NULL,
  `image` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_itemcategories` int DEFAULT NULL,
  `_itemusers` int DEFAULT NULL,
  `_itemcategories_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `image`, `_itemcategories`, `_itemusers`, `_itemcategories_position`) VALUES
(41, '', 55, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itemsdata`
--

CREATE TABLE `itemsdata` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descriptionlarge` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `descriptionshort` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `_items` int DEFAULT NULL,
  `_languages` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemsdata`
--

INSERT INTO `itemsdata` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `price`, `_items`, `_languages`) VALUES
(41, 'p1', '', 'p1 description', '10.00', 41, 2);

-- --------------------------------------------------------

--
-- Table structure for table `itemsimages`
--

CREATE TABLE `itemsimages` (
  `id` int NOT NULL,
  `imagename` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_items` int DEFAULT NULL,
  `_items_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` int NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_languages` int DEFAULT NULL,
  `_languages_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `code`, `_languages`, `_languages_position`) VALUES
(1, 'root', NULL, NULL),
(2, 'en', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `_orders` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderpaymenttypes`
--

CREATE TABLE `orderpaymenttypes` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `succeed` tinyint(1) DEFAULT NULL,
  `_orders` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `creationdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationdate` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `_users` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ordershippingtypes`
--

CREATE TABLE `ordershippingtypes` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delay_hours` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `_orders` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymenttypes`
--

CREATE TABLE `paymenttypes` (
  `id` int NOT NULL,
  `image` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vars` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `template` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `_paymenttypes` int DEFAULT NULL,
  `_paymenttypes_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `paymenttypes`
--

INSERT INTO `paymenttypes` (`id`, `image`, `vars`, `template`, `active`, `_paymenttypes`, `_paymenttypes_position`) VALUES
(1, '', '', NULL, 0, NULL, 0),
(2, '', '{\"merchantId\":\"test\", \"currencyCode\":\"USD\"}', 'paypal', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `paymenttypesdata`
--

CREATE TABLE `paymenttypesdata` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `_paymenttypes` int DEFAULT NULL,
  `_languages` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `paymenttypesdata`
--

INSERT INTO `paymenttypesdata` (`id`, `name`, `description`, `_paymenttypes`, `_languages`) VALUES
(1, 'Paypal', 'Paypal payment system', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `shippingtypes`
--

CREATE TABLE `shippingtypes` (
  `id` int NOT NULL,
  `image` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delay_hours` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `_shippingtypes` int DEFAULT NULL,
  `_shippingtypes_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `shippingtypesdata` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `_shippingtypes` int DEFAULT NULL,
  `_languages` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingtypesdata`
--

INSERT INTO `shippingtypesdata` (`id`, `name`, `description`, `_shippingtypes`, `_languages`) VALUES
(5, 'ship1', 'des ship1', 2, 2),
(6, 'ship2', 'des ship2', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pwd` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `access` int DEFAULT NULL,
  `_userstypes` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`, `status`, `access`, `_userstypes`) VALUES
(1, 'webadmin', '$2y$10$NKXLi/BalpfosYj2btEkjO7KZxvIX/bBJx1uPVieALynD/LUEP3pe', 0, 1624207745, 7),
(2, 'ordersadmin', '$2y$10$PlqpvA9Oafxu9UA6tbF67OL86oqDjFgY9IPUuSHoPXl3LQ12J8wHu', 0, 1603212168, 3),
(4, 'productsadmin', '$2y$10$gaaoUP8s7iE5QF0HgLTBOut3AL8HhHT4UXhcQ.3mnc42JzM3O/opq', 0, 1626969881, 9),
(6, 'usersadmin', '$2y$10$W4KkiELlafJWyHHamXko/.lzcc0cvRvYSCpqBNt9sbQXB9NVVq3kq', 0, 1590327417, 11),
(7, 'systemadmin', '$2y$10$ImHVY1dgkuB4RMWE8PYd0u7Y3S9TO1mwkJUl6rjeMhwuSpRBbjJue', 0, 1626969877, 13);

-- --------------------------------------------------------

--
-- Table structure for table `usersdata`
--

CREATE TABLE `usersdata` (
  `id` int NOT NULL,
  `fullname` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailaddress` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phonenumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `_users` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersdata`
--

INSERT INTO `usersdata` (`id`, `fullname`, `emailaddress`, `phonenumber`, `_users`) VALUES
(1, '', '', '0', 1),
(2, '', '', '0', 2),
(3, '', '', '0', 4),
(4, '', '', '0', 6),
(5, '', '', '0', 7);

-- --------------------------------------------------------

--
-- Table structure for table `userstypes`
--

CREATE TABLE `userstypes` (
  `id` int NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userstypes`
--

INSERT INTO `userstypes` (`id`, `type`) VALUES
(3, 'orders administrator'),
(7, 'web administrator'),
(9, 'product administrator'),
(10, 'product seller'),
(11, 'user administrator'),
(12, 'customer'),
(13, 'system administrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_users` (`_users`);

--
-- Indexes for table `domelements`
--
ALTER TABLE `domelements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_domelementsstructure` (`_domelements`);

--
-- Indexes for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_domelementsstructure` (`_domelements`),
  ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `itemcategories`
--
ALTER TABLE `itemcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_itemcategories` (`_itemcategories`);

--
-- Indexes for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_languages` (`_languages`),
  ADD KEY `_itemcategories` (`_itemcategories`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_itemcategories` (`_itemcategories`),
  ADD KEY `_itemusers` (`_itemusers`);

--
-- Indexes for table `itemsdata`
--
ALTER TABLE `itemsdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_groups` (`_items`),
  ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `itemsimages`
--
ALTER TABLE `itemsimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itemsimages_ibfk_1` (`_items`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `_orders` (`_orders`);

--
-- Indexes for table `orderpaymenttypes`
--
ALTER TABLE `orderpaymenttypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_orders` (`_orders`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_users` (`_users`);

--
-- Indexes for table `ordershippingtypes`
--
ALTER TABLE `ordershippingtypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_orders` (`_orders`);

--
-- Indexes for table `paymenttypes`
--
ALTER TABLE `paymenttypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_paymenttypes` (`_paymenttypes`);

--
-- Indexes for table `paymenttypesdata`
--
ALTER TABLE `paymenttypesdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_paymenttypes` (`_paymenttypes`),
  ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_shippingtypes` (`_shippingtypes`);

--
-- Indexes for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_shipmenttypes` (`_shippingtypes`),
  ADD KEY `_language` (`_languages`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_userstypes` (`_userstypes`);

--
-- Indexes for table `usersdata`
--
ALTER TABLE `usersdata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_users` (`_users`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `domelements`
--
ALTER TABLE `domelements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=514;

--
-- AUTO_INCREMENT for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1151;

--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `itemsdata`
--
ALTER TABLE `itemsdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `itemsimages`
--
ALTER TABLE `itemsimages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderpaymenttypes`
--
ALTER TABLE `orderpaymenttypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ordershippingtypes`
--
ALTER TABLE `ordershippingtypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymenttypes`
--
ALTER TABLE `paymenttypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `paymenttypesdata`
--
ALTER TABLE `paymenttypesdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usersdata`
--
ALTER TABLE `usersdata`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userstypes`
--
ALTER TABLE `userstypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`_itemusers`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itemsdata`
--
ALTER TABLE `itemsdata`
  ADD CONSTRAINT `itemsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `itemsdata_ibfk_3` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itemsimages`
--
ALTER TABLE `itemsimages`
  ADD CONSTRAINT `itemsimages_ibfk_1` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `languages`
--
ALTER TABLE `languages`
  ADD CONSTRAINT `languages_ibfk_1` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_orders` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderpaymenttypes`
--
ALTER TABLE `orderpaymenttypes`
  ADD CONSTRAINT `orderpaymenttypes_ibfk_1` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `paymenttypes`
--
ALTER TABLE `paymenttypes`
  ADD CONSTRAINT `paymenttypes_ibfk_1` FOREIGN KEY (`_paymenttypes`) REFERENCES `paymenttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `paymenttypesdata`
--
ALTER TABLE `paymenttypesdata`
  ADD CONSTRAINT `paymenttypesdata_ibfk_1` FOREIGN KEY (`_paymenttypes`) REFERENCES `paymenttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymenttypesdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
COMMIT;

