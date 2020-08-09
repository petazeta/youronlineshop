-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 09, 2020 at 05:32 PM
-- Server version: 5.7.21-1ubuntu1
-- PHP Version: 7.2.3-1ubuntu1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `street` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pc` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `street`, `city`, `state`, `pc`, `_users`) VALUES
(23, '5555555555', 'asdfasdf', 'asdfasdf', '9222', 2),
(24, 'asdfasdf', 'jjjj', 'oooo', '444436', 1),
(25, '', '', '', '', 4),
(26, '', '', '', '', 6),
(27, '', '', '', '', 7);

-- --------------------------------------------------------

--
-- Table structure for table `domelements`
--

CREATE TABLE `domelements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `_domelements` int(11) DEFAULT NULL,
  `_domelements_position` int(11) DEFAULT NULL
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
(108, 'langbox', 60, 1),
(109, 'checkout', 60, 4),
(110, 'chkt1next', 109, 5),
(111, 'chkt1add', 109, 6),
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
(337, 'chkt3next', 109, 2),
(338, 'chkt3add', 109, 4),
(339, 'order', 109, 13),
(340, 'total', 339, 1),
(341, 'chkt4add', 109, 7),
(342, 'chkt4userarea', 109, 10),
(343, 'subtotal', 339, 2),
(344, 'chktback', 109, 12),
(357, 'extraEdition', 60, 5),
(361, 'online', 62, 1),
(362, 'chkt5add', 109, 8),
(363, 'chkt4next', 109, 3),
(389, 'nav2', 66, 2),
(391, '', 389, 1),
(392, 'expimp', 60, 6),
(393, 'titexp', 392, 1),
(394, 'butexp', 392, 4),
(395, 'butimp', 392, 5),
(396, 'titimp', 392, 3),
(397, '', 389, 2),
(419, 'nav1', 66, 1),
(424, 'btLogOut', 279, 2),
(425, '', 419, 1),
(426, 'hours', 60, 9),
(427, 'save', 73, 1),
(428, 'saved', 73, 2),
(429, 'userdataform', 60, 10),
(430, 'fieldCharError', 429, 1),
(431, 'emailCharError', 429, 2),
(432, 'textEdit', 60, 8),
(433, 'advice', 432, 1),
(434, 'imploadingmsg', 392, 6),
(435, 'expmenus', 392, 9),
(436, 'expcatg', 392, 10),
(437, 'noselection', 392, 7),
(438, 'exptit', 392, 12),
(441, 'expusers', 392, 13),
(442, 'newuserbt', 182, 1),
(443, 'implangerror', 392, 14),
(444, 'expimplang', 60, 7),
(445, 'tit', 444, 1),
(446, 'butexp', 444, 2),
(447, 'titexp', 444, 3),
(448, 'titimp', 444, 4),
(449, 'butimp', 444, 5),
(450, 'butload', 444, 6),
(451, 'nolangsalert', 444, 7),
(452, 'loadedlangs', 444, 8),
(453, 'errornolangs', 444, 9),
(454, 'errornolangssel', 444, 11),
(455, 'errornodata', 444, 10),
(456, 'waitimp', 444, 12),
(457, 'deletealert', 60, 11),
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
(481, 'changelangwait', 108, 3);

-- --------------------------------------------------------

--
-- Table structure for table `domelementsdata`
--

CREATE TABLE `domelementsdata` (
  `id` int(11) NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `_domelements` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
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
(33, 'Powered by <a href=\"http://youronlineshop.net/\">YourOnlineShop</a>', 33, 2),
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
(98, 'street, num...', 98, 2),
(99, 'city', 99, 2),
(100, 'state', 100, 2),
(102, 'postal code', 102, 2),
(103, '', 103, 2),
(104, 'name', 104, 2),
(105, 'Surname', 105, 2),
(106, 'email', 106, 2),
(107, 'phone number', 107, 2),
(109, 'Continue ', 110, 2),
(110, 'Check if your order is ok and then click on Continue to get to the next step.', 111, 2),
(180, 'User Name', 183, 2),
(181, 'Password', 184, 2),
(182, 'Log in', 185, 2),
(183, '\"Password between \" + min + \" and \" + max + \" characters!\"', 186, 2),
(184, '\"User name between \" + min + \" and \" + max + \" characters!\"', 187, 2),
(185, 'User Name Incorrect', 188, 2),
(186, 'Password Incorrect', 189, 2),
(187, 'Login Ok', 190, 2),
(188, 'Incorrect Email', 191, 2),
(189, 'User Name aready taken', 192, 2),
(190, 'Sign in', 193, 2),
(191, 'Signed In correctly', 194, 2),
(192, '&laquo; Back to Log in', 195, 2),
(193, 'Cart is Empty', 196, 2),
(194, 'Check if your address is ok, change it or fill it.<br>Use street field to write also street number and so on.<br>pc is postal code.', 197, 2),
(195, 'Continue ', 198, 2),
(270, 'Error loading image', 275, 2),
(272, 'Back to Dashboard', 277, 2),
(273, 'Address', 278, 2),
(274, 'Show archived orders', 280, 2),
(275, 'Show new orders', 281, 2),
(276, 'Show Orders', 282, 2),
(277, 'Show Address', 283, 2),
(278, 'Quantity', 285, 2),
(279, 'Name', 286, 2),
(280, 'Price', 287, 2),
(309, '€', 316, 2),
(310, 'Insert the required data to create new user.', 317, 2),
(702, 'Continue ', 337, 2),
(703, 'Please select your preferred shipping type', 338, 2),
(704, 'Total', 340, 2),
(705, 'Please select your preferred payment type', 341, 2),
(706, 'Go to Dashboard', 342, 2),
(707, 'SubTotal', 343, 2),
(708, 'Go back', 344, 2),
(807, 'Extra Elements', 357, 2),
(811, 'Users online', 361, 2),
(812, 'The order has been successfully created', 362, 2),
(813, 'Continue ', 363, 2),
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
(1063, '\"Error: Not enought characters at \" + errorkey + \".\" + \" Enter at least \" + minchar + \" characters.\"', 430, 2),
(1064, 'Error: Email not correct', 431, 2),
(1065, 'Text Edition Tool', 432, 2),
(1066, 'You can use the text box below to create html formated text. Once you have created the content you can copy / paste into the text content of the actual elements you need to edit.', 433, 2),
(1067, 'Performing some operations please wait...', 434, 2),
(1068, 'Menus / Pages', 435, 2),
(1069, 'Catalog (Text only)', 436, 2),
(1070, 'Please select an option', 437, 2),
(1071, 'Site title', 438, 2),
(1073, '', 284, 2),
(1074, '', 279, 2),
(1075, '', 182, 2),
(1076, '', 109, 2),
(1077, '', 429, 2),
(1078, '', 339, 2),
(1079, 'Users', 441, 2),
(1080, 'Create new account', 442, 2),
(1081, 'Languages don\'t match', 443, 2),
(1082, 'Export and Import System Languages', 445, 2),
(1083, 'System Languages Export/Import', 444, 2),
(1084, 'Export', 446, 2),
(1085, 'Export Area', 447, 2),
(1086, 'Import Area', 448, 2),
(1087, 'Import', 449, 2),
(1088, 'Load', 450, 2),
(1089, 'Error: Not any languages', 451, 2),
(1090, 'Select langs to be imported:', 452, 2),
(1091, 'No languages loaded', 453, 2),
(1092, 'Error: Please select some language', 454, 2),
(1093, 'Error: No data to be loaded, please paste.', 455, 2),
(1094, 'Please wait... Importing...', 456, 2),
(1095, 'DELETE', 458, 2),
(1096, 'ATENTION: This element and its descedants will be removed.', 459, 2),
(1097, 'Language', 460, 2),
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
(1109, 'Password successful changed', 471, 2),
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
(1120, 'Changing language data ...', 481, 2);

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE `itemcategories` (
  `id` int(11) NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int(11) DEFAULT NULL,
  `_itemusers` int(11) DEFAULT NULL,
  `_itemcategories_position` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_items` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemsdata`
--

INSERT INTO `itemsdata` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `price`, `_items`, `_languages`) VALUES
(41, 'p1', '', 'p1 description', '10.00', 41, 2);

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` int(11) NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_languages` int(11) DEFAULT NULL,
  `_languages_position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `code`, `_languages`, `_languages_position`) VALUES
(1, 'root', NULL, NULL),
(2, 'English', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
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

CREATE TABLE `miscelaneous` (
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderpaymenttypes`
--

CREATE TABLE `orderpaymenttypes` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `details` text NOT NULL,
  `succeed` tinyint(1) NOT NULL DEFAULT '0',
  `_orders` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
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

CREATE TABLE `ordershippingtypes` (
  `id` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymenttypes`
--

CREATE TABLE `paymenttypes` (
  `id` int(11) NOT NULL,
  `image` varchar(60) NOT NULL,
  `vars` text,
  `template` varchar(60) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `_paymenttypes` int(11) DEFAULT NULL,
  `_paymenttypes_position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paymenttypes`
--

INSERT INTO `paymenttypes` (`id`, `image`, `vars`, `template`, `active`, `_paymenttypes`, `_paymenttypes_position`) VALUES
(1, '', '', NULL, 0, NULL, 0),
(2, '', '{\"merchantId\":\"Your client id\", \"currencyCode\":\"USD\"}', 'templates/paymentbuttons/paypal.php', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `paymenttypesdata`
--

CREATE TABLE `paymenttypesdata` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `description` varchar(200) NOT NULL,
  `_paymenttypes` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paymenttypesdata`
--

INSERT INTO `paymenttypesdata` (`id`, `name`, `description`, `_paymenttypes`, `_languages`) VALUES
(1, 'Paypal', 'Paypal payment system', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `sesid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access` int(10) DEFAULT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shippingtypes`
--

CREATE TABLE `shippingtypes` (
  `id` int(11) NOT NULL,
  `image` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_shippingtypes` int(11) DEFAULT NULL,
  `_shippingtypes_position` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_shippingtypes` int(11) DEFAULT NULL,
  `_languages` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `access` int(11) NOT NULL,
  `_userstypes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`, `status`, `access`, `_userstypes`) VALUES
(1, 'webadmin', '$2y$10$NKXLi/BalpfosYj2btEkjO7KZxvIX/bBJx1uPVieALynD/LUEP3pe', 0, 1595877656, 7),
(2, 'ordersadmin', '$2y$10$PlqpvA9Oafxu9UA6tbF67OL86oqDjFgY9IPUuSHoPXl3LQ12J8wHu', 0, 1595753912, 3),
(4, 'productsadmin', '$2y$10$gaaoUP8s7iE5QF0HgLTBOut3AL8HhHT4UXhcQ.3mnc42JzM3O/opq', 0, 1587837411, 9),
(6, 'usersadmin', '$2y$10$W4KkiELlafJWyHHamXko/.lzcc0cvRvYSCpqBNt9sbQXB9NVVq3kq', 0, 1590327417, 11),
(7, 'systemadmin', '$2y$10$ImHVY1dgkuB4RMWE8PYd0u7Y3S9TO1mwkJUl6rjeMhwuSpRBbjJue', 0, 1595881693, 13);

-- --------------------------------------------------------

--
-- Table structure for table `usersdata`
--

CREATE TABLE `usersdata` (
  `id` int(11) NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` int(11) NOT NULL,
  `_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersdata`
--

INSERT INTO `usersdata` (`id`, `name`, `surname`, `email`, `phonenumber`, `_users`) VALUES
(1, 'nana', 'kkupep', 'admn@dmin.com', 666, 1),
(2, 'order', 'llll', 'oadmn@dd.com', 220, 2),
(3, '', '', '', 0, 4),
(4, '', '', '', 0, 6),
(5, '', '', '', 0, 7);

-- --------------------------------------------------------

--
-- Table structure for table `userstypes`
--

CREATE TABLE `userstypes` (
  `id` int(11) NOT NULL,
  `type` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL
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
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_languages` (`_languages`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_users` (`_users`);

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
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `domelements`
--
ALTER TABLE `domelements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=482;
--
-- AUTO_INCREMENT for table `domelementsdata`
--
ALTER TABLE `domelementsdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1121;
--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT for table `itemcategoriesdata`
--
ALTER TABLE `itemcategoriesdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `itemsdata`
--
ALTER TABLE `itemsdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
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
-- AUTO_INCREMENT for table `orderpaymenttypes`
--
ALTER TABLE `orderpaymenttypes`
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
-- AUTO_INCREMENT for table `paymenttypes`
--
ALTER TABLE `paymenttypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `paymenttypesdata`
--
ALTER TABLE `paymenttypesdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `shippingtypes`
--
ALTER TABLE `shippingtypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `shippingtypesdata`
--
ALTER TABLE `shippingtypesdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `usersdata`
--
ALTER TABLE `usersdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `userstypes`
--
ALTER TABLE `userstypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
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
-- Constraints for table `languages`
--
ALTER TABLE `languages`
  ADD CONSTRAINT `languages_ibfk_1` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

