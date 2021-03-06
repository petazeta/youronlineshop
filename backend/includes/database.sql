-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_users` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_users` (`_users`),
  CONSTRAINT `addresses_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (23,'','','','',2),(24,'','','','',1),(25,'','','','',4),(26,'','','','',6),(27,'','','','',7);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domelements`
--

DROP TABLE IF EXISTS `domelements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domelements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `_domelements` int DEFAULT NULL,
  `_domelements_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_domelementsstructure` (`_domelements`),
  CONSTRAINT `domelements_ibfk_1` FOREIGN KEY (`_domelements`) REFERENCES `domelements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domelements`
--

LOCK TABLES `domelements` WRITE;
/*!40000 ALTER TABLE `domelements` DISABLE KEYS */;
INSERT INTO `domelements` VALUES (9,'ctgbxtt',60,0),(14,'title',63,0),(15,'title',64,0),(25,'crtbxtt',65,0),(27,'ckouttt',65,0),(33,'designed',61,0),(36,'addcarttt',60,0),(38,'lgintt',182,0),(41,'headtitle',59,0),(42,'headsubtitle',59,0),(44,'emptyvallabel',73,0),(58,'root',NULL,0),(59,'top',71,0),(60,'middle',71,0),(61,'bottom',71,0),(62,'logbox',60,0),(63,'logboxin',62,0),(64,'logboxout',62,0),(65,'cartbox',60,0),(66,'nav',72,0),(71,'labels',58,2),(72,'texts',58,1),(73,'not located',71,0),(97,'TABLE_ADDRESSES',60,4),(98,'street',97,3),(99,'city',97,4),(100,'state',97,2),(102,'pc',97,1),(103,'TABLE_USERSDATA',60,3),(104,'name',103,4),(105,'surname',103,3),(106,'email',103,2),(107,'phonenumber',103,1),(108,'langbox',60,2),(109,'checkout',60,5),(110,'chkt1next',109,5),(111,'chkt1add',109,6),(182,'logform',60,0),(183,'userName',182,0),(184,'password',182,0),(185,'login',182,0),(186,'pwdCharError',182,0),(187,'userCharError',182,0),(188,'userError',182,0),(189,'pwdError',182,0),(190,'loginOk',182,0),(191,'emailError',182,0),(192,'userExistsError',182,0),(193,'signIn',182,0),(194,'signedIn',182,0),(195,'loginBack',182,0),(196,'emptyCart',65,0),(197,'chkt2add',109,0),(198,'chkt2next',109,0),(277,'backToLoginLb',279,0),(278,'addresstt',279,0),(279,'loggedin',60,0),(282,'btShowOrd',279,0),(283,'btShowAdd',279,0),(284,'TABLE_ORDERITEMS',60,0),(285,'quantity',284,0),(286,'name',284,0),(287,'price',284,0),(316,'currency',60,0),(317,'signuptt',182,0),(337,'chkt3next',109,2),(338,'chkt3add',109,4),(339,'order',109,14),(340,'total',339,1),(341,'chkt4add',109,8),(342,'chkt4userarea',109,11),(343,'subtotal',339,2),(344,'chktback',109,13),(357,'extraEdition',60,6),(361,'online',62,1),(362,'chkt5add',109,9),(363,'chkt4next',109,3),(389,'nav2',66,2),(391,'',389,1),(392,'expimp',60,7),(393,'titexp',392,1),(394,'butexp',392,4),(395,'butimp',392,5),(396,'titimp',392,3),(397,'',389,2),(419,'nav1',66,1),(424,'btLogOut',279,2),(425,'',419,1),(426,'hours',60,10),(427,'save',73,1),(428,'saved',73,2),(429,'userdataform',60,11),(430,'fieldCharError',429,1),(431,'emailCharError',429,2),(432,'textEdit',60,9),(433,'advice',432,1),(434,'imploadingmsg',392,6),(435,'chkgeneral',392,9),(436,'chkcatg',392,10),(437,'noselection',392,7),(441,'chkusers',392,13),(442,'newuserbt',182,1),(443,'implangerror',392,15),(457,'deletealert',60,12),(458,'titalert',457,1),(459,'textalert',457,2),(460,'langboxtt',108,1),(461,'newlangwait',108,2),(462,'paysucceed',339,3),(463,'dashboardtit',279,3),(464,'btChangePwd',279,1),(465,'changepwd',279,4),(466,'titmsg',465,1),(467,'newpwd',465,2),(468,'repeatpwd',465,3),(469,'btsmt',465,4),(470,'pwdDoubleError',465,5),(471,'pwdChangeOk',465,6),(472,'pwdChangeError',465,7),(473,'mails',109,1),(474,'newordercustomer',473,1),(475,'neworderadmin',473,2),(476,'subject',474,1),(477,'message',474,2),(478,'subject',475,1),(479,'message',475,2),(480,'impnocontent',392,8),(481,'changelangwait',108,3),(482,'loadImg',60,1),(483,'headNote',482,1),(484,'file',482,2),(485,'loadError',482,3),(486,'dontdelbutton',457,3),(487,'delbutton',457,4),(488,'discardtt',65,1),(490,'chktDiscard',109,7),(491,'showOrd',279,5),(492,'new',491,1),(493,'archived',491,2),(496,'date',491,3),(497,'name',491,4),(498,'order',491,5),(499,'actions',491,6),(500,'cancel',482,4),(501,'send',482,5),(502,'pagTit',73,3),(503,'rememberme',182,2),(504,'chklang',392,14);
/*!40000 ALTER TABLE `domelements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domelementsdata`
--

DROP TABLE IF EXISTS `domelementsdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domelementsdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_domelements` int DEFAULT NULL,
  `_languages` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_domelementsstructure` (`_domelements`),
  KEY `_languages` (`_languages`),
  CONSTRAINT `domelementsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `domelementsdata_ibfk_3` FOREIGN KEY (`_domelements`) REFERENCES `domelements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domelementsdata`
--

LOCK TABLES `domelementsdata` WRITE;
/*!40000 ALTER TABLE `domelementsdata` DISABLE KEYS */;
INSERT INTO `domelementsdata` VALUES (9,'My Catalog',9,2),(14,'My Account',14,2),(15,'Log in',15,2),(25,'Shopping Cart',25,2),(27,'Check out',27,2),(33,'Powered by <a href=\"https://www.youronlineshop.net/\">YourOnlineShop</a>',33,2),(36,'+ 1 to the cart',36,2),(38,'Insert you account details or create a new account.',38,2),(41,'Shop example name',41,2),(42,'Several products and presents',42,2),(44,'Not any value',44,2),(58,'',58,2),(59,'',59,2),(60,'',60,2),(61,'',61,2),(62,'',62,2),(63,'',63,2),(64,'',64,2),(65,'',65,2),(66,'',66,2),(71,'',71,2),(72,'',72,2),(73,'',73,2),(97,'',97,2),(98,'street, num...',98,2),(99,'city',99,2),(100,'state',100,2),(102,'postal code',102,2),(103,'',103,2),(104,'name',104,2),(105,'Surname',105,2),(106,'email',106,2),(107,'phone number',107,2),(109,'Continue ',110,2),(110,'Check if your order is ok and then click on Continue to get to the next step.',111,2),(180,'User Name',183,2),(181,'Password',184,2),(182,'Log in',185,2),(183,'Password is not long enough',186,2),(184,'User name is not long enough',187,2),(185,'User Name Incorrect',188,2),(186,'Password Incorrect',189,2),(187,'Login Ok',190,2),(188,'Incorrect Email',191,2),(189,'User Name aready taken',192,2),(190,'Sign up',193,2),(191,'Signed In correctly',194,2),(192,'&laquo; Back to Log in',195,2),(193,'Cart is Empty',196,2),(194,'Check if your address is ok, change it or fill it.<br>Use street field to write also street number and so on.<br>pc is postal code.',197,2),(195,'Continue ',198,2),(272,'Back to Dashboard',277,2),(273,'Address',278,2),(276,'Show Orders',282,2),(277,'Show Address',283,2),(278,'Quantity',285,2),(279,'Name',286,2),(280,'Price',287,2),(309,'€',316,2),(310,'Insert the required data to create new user.',317,2),(702,'Continue ',337,2),(703,'Please select your preferred shipping type',338,2),(704,'Total',340,2),(705,'Please select your preferred payment type',341,2),(706,'Go to Dashboard',342,2),(707,'SubTotal',343,2),(708,'Go back',344,2),(807,'Extra Elements',357,2),(811,'Users online',361,2),(812,'The order has been successfully created',362,2),(813,'Continue ',363,2),(922,'Contact',389,2),(924,'Contact information:',391,2),(925,'Export Area',393,2),(926,'Export',394,2),(927,'Export/Import',392,2),(928,'Import',395,2),(929,'Import Area',396,2),(930,'<div>shop@smsss.net</div><div><br></div>Avenue 21.<div><br>425256 Sginy</div><div><br></div><div>Mont rel</div>',397,2),(1051,'About',419,2),(1058,'Log Out',424,2),(1059,'We are shop... :)',425,2),(1060,'h',426,2),(1061,'Save',427,2),(1062,'Record saved',428,2),(1063,'Error: Not enough characters.',430,2),(1064,'Error: Email not correct.',431,2),(1065,'Text Edition Tool',432,2),(1066,'You can use the text box below to create html formated text. Once you have created the content you can copy / paste into the text content of the actual elements you need to edit.',433,2),(1067,'Performing some operations please wait...',434,2),(1068,'Other Content',435,2),(1069,'Catalog',436,2),(1070,'Please select an option',437,2),(1073,'',284,2),(1074,'',279,2),(1075,'',182,2),(1076,'',109,2),(1077,'',429,2),(1078,'',339,2),(1079,'Users',441,2),(1080,'Or create a new account',442,2),(1081,'Languages don\'t match',443,2),(1095,'DELETE',458,2),(1096,'ATENTION: This element and its descedants will be removed.',459,2),(1097,'Language',460,2),(1098,'Performing language data copy... Please wait...',461,2),(1099,'',108,2),(1100,'',457,2),(1101,'Payment transaction completed',462,2),(1102,'Dashboard from user:',463,2),(1103,'Change Password',464,2),(1104,'Change Password',466,2),(1105,'Repeat Password',468,2),(1106,'New Password',467,2),(1107,'Change',469,2),(1108,'The passwords written doesn\'t match',470,2),(1109,'Password successful changed',471,2),(1110,'Password Change Error',472,2),(1111,'',465,2),(1112,'',473,2),(1113,'',474,2),(1114,'',475,2),(1115,'About your new order',476,2),(1116,'A new order has been registered. Thank you.',477,2),(1117,'New order registered',478,2),(1118,'A new order has been registered.',479,2),(1119,'There is no content to import',480,2),(1120,'Changing language data ...',481,2),(1121,'Error loading image',485,2),(1122,'Image file:',484,2),(1123,'Image File Selection',483,2),(1124,'Don\'t Remove',486,2),(1125,'Remove',487,2),(1126,'<b>&times;</b> Discard',488,2),(1128,'Discard Order',490,2),(1129,'new',492,2),(1130,'archived',493,2),(1131,'Date',496,2),(1132,'Name',497,2),(1133,'Order',498,2),(1134,'Actions',499,2),(1135,'Cancel',500,2),(1136,'Send',501,2),(1137,'',502,2),(1138,'',482,2),(1139,'',491,2),(1140,'Remember me',503,2),(1141,'Language',504,2);
/*!40000 ALTER TABLE `domelementsdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemcategories`
--

DROP TABLE IF EXISTS `itemcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `_itemcategories` int DEFAULT NULL,
  `_itemcategories_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_itemcategories` (`_itemcategories`),
  CONSTRAINT `itemcategories_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemcategories`
--

LOCK TABLES `itemcategories` WRITE;
/*!40000 ALTER TABLE `itemcategories` DISABLE KEYS */;
INSERT INTO `itemcategories` VALUES (1,NULL,0),(54,1,1),(55,54,1);
/*!40000 ALTER TABLE `itemcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemcategoriesdata`
--

DROP TABLE IF EXISTS `itemcategoriesdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemcategoriesdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int DEFAULT NULL,
  `_languages` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_languages` (`_languages`),
  KEY `_itemcategories` (`_itemcategories`),
  CONSTRAINT `itemcategoriesdata_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `itemcategoriesdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemcategoriesdata`
--

LOCK TABLES `itemcategoriesdata` WRITE;
/*!40000 ALTER TABLE `itemcategoriesdata` DISABLE KEYS */;
INSERT INTO `itemcategoriesdata` VALUES (1,'root',1,2),(62,'First category',54,2),(63,'First subcategory',55,2);
/*!40000 ALTER TABLE `itemcategoriesdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_itemcategories` int DEFAULT NULL,
  `_itemusers` int DEFAULT NULL,
  `_itemcategories_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_itemcategories` (`_itemcategories`),
  KEY `_itemusers` (`_itemusers`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`_itemcategories`) REFERENCES `itemcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`_itemusers`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (41,'',55,1,1);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemsdata`
--

DROP TABLE IF EXISTS `itemsdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemsdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_items` int DEFAULT NULL,
  `_languages` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_groups` (`_items`),
  KEY `_languages` (`_languages`),
  CONSTRAINT `itemsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `itemsdata_ibfk_3` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemsdata`
--

LOCK TABLES `itemsdata` WRITE;
/*!40000 ALTER TABLE `itemsdata` DISABLE KEYS */;
INSERT INTO `itemsdata` VALUES (41,'p1','','p1 description',10.00,41,2);
/*!40000 ALTER TABLE `itemsdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_languages` int DEFAULT NULL,
  `_languages_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_languages` (`_languages`),
  CONSTRAINT `languages_ibfk_1` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'root',NULL,NULL),(2,'English',1,1);
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_users` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_users` (`_users`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `miscelaneous`
--

DROP TABLE IF EXISTS `miscelaneous`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `miscelaneous` (
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `miscelaneous`
--

LOCK TABLES `miscelaneous` WRITE;
/*!40000 ALTER TABLE `miscelaneous` DISABLE KEYS */;
/*!40000 ALTER TABLE `miscelaneous` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `_orders` (`_orders`),
  CONSTRAINT `orderitems_orders` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderpaymenttypes`
--

DROP TABLE IF EXISTS `orderpaymenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderpaymenttypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `succeed` tinyint(1) NOT NULL DEFAULT '0',
  `_orders` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_orders` (`_orders`),
  CONSTRAINT `orderpaymenttypes_ibfk_1` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderpaymenttypes`
--

LOCK TABLES `orderpaymenttypes` WRITE;
/*!40000 ALTER TABLE `orderpaymenttypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderpaymenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int NOT NULL DEFAULT '0',
  `_users` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_users` (`_users`),
  CONSTRAINT `orders_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordershippingtypes`
--

DROP TABLE IF EXISTS `ordershippingtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordershippingtypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_orders` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_orders` (`_orders`),
  CONSTRAINT `ordershippingtypes_ibfk_1` FOREIGN KEY (`_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordershippingtypes`
--

LOCK TABLES `ordershippingtypes` WRITE;
/*!40000 ALTER TABLE `ordershippingtypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordershippingtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymenttypes`
--

DROP TABLE IF EXISTS `paymenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymenttypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vars` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `template` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `_paymenttypes` int DEFAULT NULL,
  `_paymenttypes_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_paymenttypes` (`_paymenttypes`),
  CONSTRAINT `paymenttypes_ibfk_1` FOREIGN KEY (`_paymenttypes`) REFERENCES `paymenttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymenttypes`
--

LOCK TABLES `paymenttypes` WRITE;
/*!40000 ALTER TABLE `paymenttypes` DISABLE KEYS */;
INSERT INTO `paymenttypes` VALUES (1,'','',NULL,0,NULL,0),(2,'','{\"merchantId\":\"Your client id\", \"currencyCode\":\"USD\"}','templates/paypal.html',1,1,1);
/*!40000 ALTER TABLE `paymenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymenttypesdata`
--

DROP TABLE IF EXISTS `paymenttypesdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymenttypesdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_paymenttypes` int DEFAULT NULL,
  `_languages` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_paymenttypes` (`_paymenttypes`),
  KEY `_languages` (`_languages`),
  CONSTRAINT `paymenttypesdata_ibfk_1` FOREIGN KEY (`_paymenttypes`) REFERENCES `paymenttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `paymenttypesdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymenttypesdata`
--

LOCK TABLES `paymenttypesdata` WRITE;
/*!40000 ALTER TABLE `paymenttypesdata` DISABLE KEYS */;
INSERT INTO `paymenttypesdata` VALUES (1,'Paypal','Paypal payment system',2,2);
/*!40000 ALTER TABLE `paymenttypesdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingtypes`
--

DROP TABLE IF EXISTS `shippingtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippingtypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delay_hours` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `_shippingtypes` int DEFAULT NULL,
  `_shippingtypes_position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_shippingtypes` (`_shippingtypes`),
  CONSTRAINT `shippingtypes_ibfk_1` FOREIGN KEY (`_shippingtypes`) REFERENCES `shippingtypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingtypes`
--

LOCK TABLES `shippingtypes` WRITE;
/*!40000 ALTER TABLE `shippingtypes` DISABLE KEYS */;
INSERT INTO `shippingtypes` VALUES (1,'',0,0.00,NULL,0),(2,'',24,10.00,1,1),(3,'',72,3.00,1,2);
/*!40000 ALTER TABLE `shippingtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingtypesdata`
--

DROP TABLE IF EXISTS `shippingtypesdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippingtypesdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `_shippingtypes` int DEFAULT NULL,
  `_languages` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_shipmenttypes` (`_shippingtypes`),
  KEY `_language` (`_languages`),
  CONSTRAINT `shippingtypesdata_ibfk_3` FOREIGN KEY (`_shippingtypes`) REFERENCES `shippingtypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shippingtypesdata_ibfk_4` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingtypesdata`
--

LOCK TABLES `shippingtypesdata` WRITE;
/*!40000 ALTER TABLE `shippingtypesdata` DISABLE KEYS */;
INSERT INTO `shippingtypesdata` VALUES (5,'ship1','des ship1',2,2),(6,'ship2','des ship2',3,2);
/*!40000 ALTER TABLE `shippingtypesdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL,
  `access` int NOT NULL,
  `_userstypes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_userstypes` (`_userstypes`),
  CONSTRAINT `users_userstypes` FOREIGN KEY (`_userstypes`) REFERENCES `userstypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'webadmin','$2y$10$NKXLi/BalpfosYj2btEkjO7KZxvIX/bBJx1uPVieALynD/LUEP3pe',0,1599758910,7),(2,'ordersadmin','$2y$10$PlqpvA9Oafxu9UA6tbF67OL86oqDjFgY9IPUuSHoPXl3LQ12J8wHu',0,1603212168,3),(4,'productsadmin','$2y$10$gaaoUP8s7iE5QF0HgLTBOut3AL8HhHT4UXhcQ.3mnc42JzM3O/opq',0,1587837411,9),(6,'usersadmin','$2y$10$W4KkiELlafJWyHHamXko/.lzcc0cvRvYSCpqBNt9sbQXB9NVVq3kq',0,1590327417,11),(7,'systemadmin','$2y$10$ImHVY1dgkuB4RMWE8PYd0u7Y3S9TO1mwkJUl6rjeMhwuSpRBbjJue',0,1617353579,13);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersdata`
--

DROP TABLE IF EXISTS `usersdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` int NOT NULL,
  `_users` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_users` (`_users`),
  CONSTRAINT `usersdata_users` FOREIGN KEY (`_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersdata`
--

LOCK TABLES `usersdata` WRITE;
/*!40000 ALTER TABLE `usersdata` DISABLE KEYS */;
INSERT INTO `usersdata` VALUES (1,'','','',0,1),(2,'','','',0,2),(3,'','','',0,4),(4,'','','',0,6),(5,'','','',0,7);
/*!40000 ALTER TABLE `usersdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userstypes`
--

DROP TABLE IF EXISTS `userstypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userstypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userstypes`
--

LOCK TABLES `userstypes` WRITE;
/*!40000 ALTER TABLE `userstypes` DISABLE KEYS */;
INSERT INTO `userstypes` VALUES (3,'orders administrator'),(7,'web administrator'),(9,'product administrator'),(10,'product seller'),(11,'user administrator'),(12,'customer'),(13,'system administrator');
/*!40000 ALTER TABLE `userstypes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-04 20:56:45
