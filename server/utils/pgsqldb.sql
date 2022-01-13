-- Adminer 4.8.1 PostgreSQL 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1) dump

DROP TABLE IF EXISTS "addresses";
DROP SEQUENCE IF EXISTS addresses_id_seq;
CREATE SEQUENCE addresses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."addresses" (
    "id" integer DEFAULT nextval('addresses_id_seq') NOT NULL,
    "streetaddress" character varying(100),
    "city" character varying(50),
    "state" character varying(50),
    "zipcode" character varying(20),
    "country" character varying(50),
    "_users" integer,
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "addresses__users" ON "public"."addresses" USING btree ("_users");

INSERT INTO "addresses" ("id", "streetaddress", "city", "state", "zipcode", "country", "_users") VALUES
(23,	'',	'',	'',	'',	NULL,	2),
(24,	'',	'',	'',	'',	NULL,	1),
(25,	'',	'',	'',	'',	NULL,	4),
(26,	'',	'',	'',	'',	NULL,	6),
(27,	'',	'',	'',	'',	NULL,	7),
(1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL);

DROP TABLE IF EXISTS "itemcategories";
DROP SEQUENCE IF EXISTS itemcategories_id_seq;
CREATE SEQUENCE itemcategories_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."itemcategories" (
    "id" integer DEFAULT nextval('itemcategories_id_seq') NOT NULL,
    "_itemcategories" integer,
    "_itemcategories_position" integer,
    CONSTRAINT "itemcategories_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "itemcategories__itemcategories" ON "public"."itemcategories" USING btree ("_itemcategories");

INSERT INTO "itemcategories" ("id", "_itemcategories", "_itemcategories_position") VALUES
(1,	NULL,	NULL),
(2,	1,	1),
(3,	2,	1);

DROP TABLE IF EXISTS "itemcategoriesdata";
DROP SEQUENCE IF EXISTS itemcategoriesdata_id_seq;
CREATE SEQUENCE itemcategoriesdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."itemcategoriesdata" (
    "id" integer DEFAULT nextval('itemcategoriesdata_id_seq') NOT NULL,
    "name" character varying(50),
    "_itemcategories" integer,
    "_languages" integer,
    CONSTRAINT "itemcategoriesdata_id" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "itemcategoriesdata__itemcategories" ON "public"."itemcategoriesdata" USING btree ("_itemcategories");

CREATE INDEX "itemcategoriesdata__languages" ON "public"."itemcategoriesdata" USING btree ("_languages");

INSERT INTO "itemcategoriesdata" ("id", "name", "_itemcategories", "_languages") VALUES
(1,	'First Category',	2,	1),
(2,	'First Subcategory',	3,	1);

DROP TABLE IF EXISTS "items";
DROP SEQUENCE IF EXISTS items_id_seq;
CREATE SEQUENCE items_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."items" (
    "id" integer DEFAULT nextval('items_id_seq') NOT NULL,
    "_itemcategories" integer,
    "_itemusers" integer,
    "_itemcategories_position" integer,
    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "items__itemcategories" ON "public"."items" USING btree ("_itemcategories");

CREATE INDEX "items__itemusers" ON "public"."items" USING btree ("_itemusers");

INSERT INTO "items" ("id", "_itemcategories", "_itemusers", "_itemcategories_position") VALUES
(1,	2,	NULL,	1),
(3,	3,	NULL,	1);

DROP TABLE IF EXISTS "itemsdata";
DROP SEQUENCE IF EXISTS itemsdata_id_seq;
CREATE SEQUENCE itemsdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."itemsdata" (
    "id" integer DEFAULT nextval('itemsdata_id_seq') NOT NULL,
    "name" character varying(50),
    "descriptionlarge" text,
    "descriptionshort" text,
    "price" integer,
    "_items" integer,
    "_languages" integer,
    CONSTRAINT "itemsdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "itemsdata" ("id", "name", "descriptionlarge", "descriptionshort", "price", "_items", "_languages") VALUES
(1,	'P1',	NULL,	'p1 des',	1000,	1,	1),
(3,	'product',	NULL,	'p description',	1000,	3,	1);

DROP TABLE IF EXISTS "itemsimages";
DROP SEQUENCE IF EXISTS itemsimages_id_seq;
CREATE SEQUENCE itemsimages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."itemsimages" (
    "id" integer DEFAULT nextval('itemsimages_id_seq') NOT NULL,
    "imagename" character varying(50),
    "_items" integer,
    "_items_position" integer,
    CONSTRAINT "itemsimages_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "itemsimages__items" ON "public"."itemsimages" USING btree ("_items");


DROP TABLE IF EXISTS "languages";
DROP SEQUENCE IF EXISTS languages_id_seq;
CREATE SEQUENCE languages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."languages" (
    "id" integer DEFAULT nextval('languages_id_seq') NOT NULL,
    "code" character varying(50),
    "_languages_position" integer,
    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "languages" ("id", "code", "_languages_position") VALUES
(1,	'en',	1);

DROP TABLE IF EXISTS "orderitems";
DROP SEQUENCE IF EXISTS orderitems_id_seq;
CREATE SEQUENCE orderitems_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."orderitems" (
    "id" integer DEFAULT nextval('orderitems_id_seq') NOT NULL,
    "quantity" integer,
    "name" character varying(100),
    "price" integer,
    "_orders" integer,
    CONSTRAINT "orderitems_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "orderitems__orders" ON "public"."orderitems" USING btree ("_orders");


DROP TABLE IF EXISTS "orderpaymenttypes";
DROP SEQUENCE IF EXISTS orderpaymenttypes_id_seq;
CREATE SEQUENCE orderpaymenttypes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."orderpaymenttypes" (
    "id" integer DEFAULT nextval('orderpaymenttypes_id_seq') NOT NULL,
    "name" character varying(100),
    "details" text,
    "succed" smallint,
    "_orders" integer,
    CONSTRAINT "orderpaymenttypes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "orderpaymenttypes__orders" ON "public"."orderpaymenttypes" USING btree ("_orders");


DROP TABLE IF EXISTS "orders";
DROP SEQUENCE IF EXISTS orders_id_seq;
CREATE SEQUENCE orders_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."orders" (
    "id" integer DEFAULT nextval('orders_id_seq') NOT NULL,
    "creationdate" timestamp,
    "modificationdate" timestamp,
    "status" smallint,
    "_users" integer,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "orders__users" ON "public"."orders" USING btree ("_users");


DROP TABLE IF EXISTS "ordershippingtypes";
DROP SEQUENCE IF EXISTS ordershippingtypes_id_seq;
CREATE SEQUENCE ordershippingtypes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."ordershippingtypes" (
    "id" integer DEFAULT nextval('ordershippingtypes_id_seq') NOT NULL,
    "name" character varying,
    "delay_hours" integer,
    "price" integer,
    "_orders" integer,
    CONSTRAINT "ordershippingtypes_id" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "ordershippingtypes__orders" ON "public"."ordershippingtypes" USING btree ("_orders");


DROP TABLE IF EXISTS "pageelements";
DROP SEQUENCE IF EXISTS pageelements_id_seq;
CREATE SEQUENCE pageelements_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."pageelements" (
    "id" integer DEFAULT nextval('pageelements_id_seq') NOT NULL,
    "name" character varying(50),
    "_pageelements" integer,
    "_pageelements_position" integer,
    CONSTRAINT "pageelements_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "pageelements__pageelements" ON "public"."pageelements" USING btree ("_pageelements");

INSERT INTO "pageelements" ("id", "name", "_pageelements", "_pageelements_position") VALUES
(3,	'root',	NULL,	1),
(4,	NULL,	3,	1),
(5,	NULL,	4,	1);

DROP TABLE IF EXISTS "pageelementsdata";
DROP SEQUENCE IF EXISTS pageelementsdata_id_seq;
CREATE SEQUENCE pageelementsdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."pageelementsdata" (
    "id" integer DEFAULT nextval('pageelementsdata_id_seq') NOT NULL,
    "value" text,
    "_pageelements" integer,
    "_languages" integer,
    CONSTRAINT "pageelementsdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "pageelementsdata__languages" ON "public"."pageelementsdata" USING btree ("_languages");

CREATE INDEX "pageelementsdata__pageelements" ON "public"."pageelementsdata" USING btree ("_pageelements");

INSERT INTO "pageelementsdata" ("id", "value", "_pageelements", "_languages") VALUES
(2,	NULL,	3,	NULL),
(3,	'menu 1',	4,	1),
(4,	'paragraph 1',	5,	1);

DROP TABLE IF EXISTS "paymenttypes";
DROP SEQUENCE IF EXISTS paymenttypes_id_seq;
CREATE SEQUENCE paymenttypes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."paymenttypes" (
    "id" integer DEFAULT nextval('paymenttypes_id_seq') NOT NULL,
    "image" character varying(60),
    "vars" text,
    "template" character varying(60),
    "active" smallint,
    "_paymenttypes_position" integer,
    CONSTRAINT "paymenttypes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "paymenttypes" ("id", "image", "vars", "template", "active", "_paymenttypes_position") VALUES
(1,	'',	'{"merchantId":"test"}',	'paypal',	1,	1);

DROP TABLE IF EXISTS "paymenttypesdata";
DROP SEQUENCE IF EXISTS paymenttypesdata_id_seq;
CREATE SEQUENCE paymenttypesdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."paymenttypesdata" (
    "id" integer DEFAULT nextval('paymenttypesdata_id_seq') NOT NULL,
    "name" character varying(100),
    "description" text,
    "_paymenttypes" integer,
    "_languages" integer,
    CONSTRAINT "paymenttypesdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "paymenttypesdata__languages" ON "public"."paymenttypesdata" USING btree ("_languages");

CREATE INDEX "paymenttypesdata__paymenttypes" ON "public"."paymenttypesdata" USING btree ("_paymenttypes");

INSERT INTO "paymenttypesdata" ("id", "name", "description", "_paymenttypes", "_languages") VALUES
(1,	'Paypal',	'Paypal payment system',	1,	1);

DROP TABLE IF EXISTS "shippingtypes";
DROP SEQUENCE IF EXISTS shippingtypes_id_seq;
CREATE SEQUENCE shippingtypes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."shippingtypes" (
    "id" integer DEFAULT nextval('shippingtypes_id_seq') NOT NULL,
    "image" character varying(50),
    "delay_hours" integer,
    "price" integer,
    "_shippingtypes_position" integer,
    CONSTRAINT "shippingtypes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "shippingtypes" ("id", "image", "delay_hours", "price", "_shippingtypes_position") VALUES
(1,	'',	24,	100,	1),
(2,	'',	72,	3000,	2);

DROP TABLE IF EXISTS "shippingtypesdata";
DROP SEQUENCE IF EXISTS shippingtypesdata_id_seq;
CREATE SEQUENCE shippingtypesdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."shippingtypesdata" (
    "id" integer DEFAULT nextval('shippingtypesdata_id_seq') NOT NULL,
    "name" character varying,
    "description" text,
    "_shippingtypes" integer,
    "_languages" integer,
    CONSTRAINT "shippingtypesdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "shippingtypesdata__languages" ON "public"."shippingtypesdata" USING btree ("_languages");

CREATE INDEX "shippingtypesdata__shippingtypes" ON "public"."shippingtypesdata" USING btree ("_shippingtypes");

INSERT INTO "shippingtypesdata" ("id", "name", "description", "_shippingtypes", "_languages") VALUES
(5,	'ship1',	'des ship1',	1,	1),
(6,	'ship2',	'des ship2',	2,	1);

DROP TABLE IF EXISTS "siteelements";
DROP SEQUENCE IF EXISTS siteelements_id_seq;
CREATE SEQUENCE siteelements_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."siteelements" (
    "id" integer DEFAULT nextval('siteelements_id_seq') NOT NULL,
    "name" character varying(50),
    "_siteelements" integer,
    "_siteelements_position" integer,
    CONSTRAINT "siteelements_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "siteelements__siteelements" ON "public"."siteelements" USING btree ("_siteelements");

INSERT INTO "siteelements" ("id", "name", "_siteelements", "_siteelements_position") VALUES
(1,	'root',	NULL,	0),
(9,	'ctgbxtt',	1,	0),
(14,	'title',	63,	0),
(15,	'title',	64,	0),
(25,	'crtbxtt',	65,	0),
(27,	'ckouttt',	65,	0),
(33,	'designed',	61,	0),
(36,	'addcarttt',	1,	0),
(38,	'lgintt',	182,	0),
(41,	'page_head_title',	1,	0),
(42,	'page_head_subtitle',	1,	0),
(44,	'emptyvallabel',	73,	0),
(61,	'bottom',	1,	0),
(62,	'logbox',	1,	0),
(63,	'logboxin',	62,	0),
(64,	'logboxout',	62,	0),
(65,	'cartbox',	1,	0),
(73,	'not located',	1,	0),
(97,	'TABLE_ADDRESSES',	1,	4),
(98,	'streetaddress',	97,	3),
(99,	'city',	97,	4),
(100,	'state',	97,	2),
(102,	'zipcode',	97,	1),
(103,	'TABLE_USERSDATA',	1,	3),
(104,	'fullname',	103,	4),
(106,	'emailaddress',	103,	2),
(107,	'phonenumber',	103,	1),
(108,	'langbox',	1,	2),
(109,	'checkout',	1,	5),
(111,	'orderTit',	109,	6),
(182,	'logform',	1,	0),
(183,	'userName',	182,	0),
(184,	'password',	182,	0),
(185,	'login',	182,	0),
(186,	'pwdCharError',	182,	0),
(187,	'userCharError',	182,	0),
(188,	'userError',	182,	0),
(189,	'pwdError',	182,	0),
(190,	'loginOk',	182,	0),
(191,	'emailError',	182,	0),
(192,	'userExistsError',	182,	0),
(193,	'signIn',	182,	0),
(194,	'signedIn',	182,	0),
(195,	'loginBack',	182,	0),
(196,	'emptyCart',	65,	0),
(197,	'addressTit',	109,	0),
(277,	'btShowInfo',	279,	0),
(278,	'addresstt',	279,	0),
(279,	'dashboard',	1,	0),
(282,	'btShowOrd',	279,	0),
(283,	'btShowAdd',	279,	0),
(284,	'TABLE_ORDERITEMS',	1,	0),
(285,	'quantity',	284,	0),
(286,	'name',	284,	0),
(287,	'price',	284,	0),
(317,	'signuptt',	182,	0),
(338,	'shippingTit',	109,	4),
(339,	'order',	109,	15),
(340,	'total',	339,	1),
(341,	'paymentTit',	109,	8),
(343,	'subtotal',	339,	2),
(357,	'extraEdition',	279,	6),
(361,	'online',	62,	1),
(362,	'successTit',	109,	9),
(363,	'confirmButLabel',	109,	3),
(392,	'expimp',	279,	7),
(393,	'titexp',	392,	1),
(394,	'butexp',	392,	4),
(395,	'butimp',	392,	5),
(396,	'titimp',	392,	3),
(424,	'btLogOut',	279,	2),
(426,	'hours',	1,	10),
(427,	'save',	73,	1),
(428,	'saved',	73,	2),
(429,	'userdataform',	1,	11),
(430,	'fieldCharError',	429,	1),
(431,	'emailCharError',	429,	2),
(432,	'textEdit',	279,	9),
(433,	'advice',	432,	1),
(434,	'imploadingmsg',	392,	6),
(435,	'chkgeneral',	392,	9),
(436,	'chkcatg',	392,	10),
(437,	'noselection',	392,	7),
(441,	'chkusers',	392,	13),
(442,	'newuserbt',	182,	1),
(443,	'implangerror',	392,	16),
(457,	'deletealert',	1,	12),
(458,	'titalert',	457,	1),
(459,	'textalert',	457,	2),
(460,	'langboxtt',	108,	1),
(461,	'newlangwait',	108,	2),
(462,	'paysucceed',	339,	3),
(463,	'dashboardtit',	279,	3),
(464,	'btChangePwd',	279,	1),
(465,	'changepwd',	279,	4),
(466,	'titmsg',	465,	1),
(467,	'newpwd',	465,	2),
(468,	'repeatpwd',	465,	3),
(469,	'btsmt',	465,	4),
(470,	'pwdDoubleError',	465,	5),
(471,	'pwdChangeOk',	465,	6),
(472,	'pwdChangeError',	465,	7),
(473,	'mails',	109,	1),
(474,	'newordercustomer',	473,	1),
(475,	'neworderadmin',	473,	2),
(476,	'subject',	474,	1),
(477,	'message',	474,	2),
(478,	'subject',	475,	1),
(479,	'message',	475,	2),
(480,	'impnocontent',	392,	8),
(481,	'changelangwait',	108,	3),
(482,	'loadImg',	1,	1),
(483,	'headNote',	482,	1),
(484,	'file',	482,	2),
(485,	'loadError',	482,	3),
(486,	'dontdelbutton',	457,	3),
(487,	'delbutton',	457,	4),
(488,	'discardtt',	65,	1),
(490,	'discardButLabel',	109,	7),
(491,	'showOrd',	279,	5),
(492,	'new',	491,	1),
(493,	'archived',	491,	2),
(496,	'date',	491,	3),
(497,	'name',	491,	4),
(498,	'order',	491,	5),
(499,	'actions',	491,	6),
(500,	'cancel',	482,	4),
(501,	'send',	482,	5),
(502,	'pagTit',	73,	3),
(503,	'rememberme',	182,	2),
(504,	'chklang',	392,	15),
(505,	'checkoutTit',	109,	12),
(506,	'country',	97,	5),
(507,	'details',	435,	1),
(508,	'details',	436,	1),
(509,	'chkcheckout',	392,	14),
(510,	'details',	509,	1),
(511,	'details',	504,	1),
(512,	'details',	441,	1),
(513,	'uploadingWait',	482,	6);

DROP TABLE IF EXISTS "siteelementsdata";
DROP SEQUENCE IF EXISTS siteelementsdata_id_seq;
CREATE SEQUENCE siteelementsdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."siteelementsdata" (
    "id" integer DEFAULT nextval('siteelementsdata_id_seq') NOT NULL,
    "value" text,
    "_siteelements" integer,
    "_languages" integer,
    CONSTRAINT "siteelementsdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "siteelementsdata__languages" ON "public"."siteelementsdata" USING btree ("_languages");

CREATE INDEX "siteelementsdata__siteelements" ON "public"."siteelementsdata" USING btree ("_siteelements");

INSERT INTO "siteelementsdata" ("id", "value", "_siteelements", "_languages") VALUES
(9,	'My Catalog',	9,	1),
(14,	'My Account',	14,	1),
(15,	'Log in',	15,	1),
(25,	'Shopping Cart',	25,	1),
(27,	'Check out',	27,	1),
(33,	'Powered by <a href="https://www.youronlineshop.net/">YourOnlineShop</a>',	33,	1),
(36,	'+ 1 to the cart',	36,	1),
(38,	'Insert you account details or create a new account.',	38,	1),
(41,	'Shop example name',	41,	1),
(42,	'Several products and presents',	42,	1),
(44,	'Not any value',	44,	1),
(61,	'',	61,	1),
(62,	'',	62,	1),
(63,	'',	63,	1),
(64,	'',	64,	1),
(65,	'',	65,	1),
(73,	'',	73,	1),
(97,	'',	97,	1),
(98,	'Street address',	98,	1),
(99,	'City',	99,	1),
(100,	'State',	100,	1),
(102,	'ZIP code',	102,	1),
(103,	'',	103,	1),
(104,	'Full name',	104,	1),
(106,	'Email address',	106,	1),
(107,	'Phone number',	107,	1),
(110,	'Order',	111,	1),
(180,	'User Name',	183,	1),
(181,	'Password',	184,	1),
(182,	'Log in',	185,	1),
(183,	'Password is not long enough',	186,	1),
(184,	'User name is not long enough',	187,	1),
(185,	'User Name Incorrect',	188,	1),
(186,	'Password Incorrect',	189,	1),
(187,	'Login Ok',	190,	1),
(188,	'Incorrect Email',	191,	1),
(189,	'User Name aready taken',	192,	1),
(190,	'Sign up',	193,	1),
(191,	'Signed In correctly',	194,	1),
(192,	'&laquo; Back to Log in',	195,	1),
(193,	'Cart is Empty',	196,	1),
(194,	'Address',	197,	1),
(272,	'User Info',	277,	1),
(273,	'Address',	278,	1),
(276,	'Show Orders',	282,	1),
(277,	'Show Address',	283,	1),
(278,	'Quantity',	285,	1),
(279,	'Name',	286,	1),
(280,	'Price',	287,	1),
(310,	'Insert the required data to create new user.',	317,	1),
(703,	'Shipping',	338,	1),
(704,	'Total',	340,	1),
(705,	'Payment',	341,	1),
(707,	'SubTotal',	343,	1),
(807,	'Extra Elements Edition',	357,	1),
(811,	'Users online',	361,	1),
(812,	'The order has been successfully created',	362,	1),
(813,	'Continue Order&nbsp;',	363,	1),
(925,	'Export Area',	393,	1),
(926,	'Export',	394,	1),
(927,	'Export/Import',	392,	1),
(928,	'Import',	395,	1),
(929,	'Import Area',	396,	1),
(1058,	'Log Out',	424,	1),
(1060,	'h',	426,	1),
(1061,	'Save',	427,	1),
(1062,	'Record saved',	428,	1),
(1063,	'Error: Not enough characters.',	430,	1),
(1064,	'Error: Email not correct.',	431,	1),
(1065,	'Text Edition Tool',	432,	1),
(1066,	'You can use the text box below to create html formated text. Once you have created the content you can copy / paste into the text content of the actual elements you need to edit.',	433,	1),
(1067,	'Performing some operations please wait...',	434,	1),
(1068,	'Other Content',	435,	1),
(1069,	'Catalog',	436,	1),
(1070,	'Please select an option',	437,	1),
(1073,	'',	284,	1),
(1074,	'',	279,	1),
(1075,	'',	182,	1),
(1076,	'',	109,	1),
(1077,	'',	429,	1),
(1078,	'',	339,	1),
(1079,	'Users',	441,	1),
(1080,	'Or create a new account',	442,	1),
(1081,	'Languages don''t match',	443,	1),
(1095,	'DELETE',	458,	1),
(1096,	'ATENTION: This element and its descedants will be removed.',	459,	1),
(1097,	'Languages',	460,	1),
(1098,	'Performing language data copy... Please wait...',	461,	1),
(1099,	'',	108,	1),
(1100,	'',	457,	1),
(1101,	'Payment transaction completed',	462,	1),
(1102,	'Dashboard from user:',	463,	1),
(1103,	'Change Password',	464,	1),
(1104,	'Change Password',	466,	1),
(1105,	'Repeat Password',	468,	1),
(1106,	'New Password',	467,	1),
(1107,	'Change',	469,	1),
(1108,	'The passwords written doesn''t match',	470,	1),
(1109,	'Password successfully changed',	471,	1),
(1110,	'Password Change Error',	472,	1),
(1111,	'',	465,	1),
(1112,	'',	473,	1),
(1113,	'',	474,	1),
(1114,	'',	475,	1),
(1115,	'About your new order',	476,	1),
(1116,	'A new order has been registered. Thank you.',	477,	1),
(1117,	'New order registered',	478,	1),
(1118,	'A new order has been registered.',	479,	1),
(1119,	'There is no content to import',	480,	1),
(1120,	'Changing language data ...',	481,	1),
(1121,	'Error loading image',	485,	1),
(1122,	'Image file:',	484,	1),
(1123,	'Image File Selection',	483,	1),
(1124,	'Don''t Remove',	486,	1),
(1125,	'Remove',	487,	1),
(1126,	'<b>&times;</b> Discard',	488,	1),
(1128,	'Discard Order',	490,	1),
(1129,	'new',	492,	1),
(1130,	'archived',	493,	1),
(1131,	'Date',	496,	1),
(1132,	'Name',	497,	1),
(1133,	'Order',	498,	1),
(1134,	'Actions',	499,	1),
(1135,	'Cancel',	500,	1),
(1136,	'Send',	501,	1),
(1137,	'',	502,	1),
(1138,	'',	482,	1),
(1139,	'',	491,	1),
(1140,	'Remember me',	503,	1),
(1141,	'Languages',	504,	1),
(1142,	'Please ckeck your Order data below and then click in Confirm Order',	505,	1),
(1143,	'Country',	506,	1),
(1144,	'It exports these custom site content: title and subtitle and menus and its content',	507,	1),
(1145,	'It exports this custom site content: Catalog content, that is, categories, subcategories and products',	508,	1),
(1146,	'Checkout shipping &amp; payment methods',	509,	1),
(1147,	'It exports this custom site content: shipping methods and payment methods',	510,	1),
(1148,	'It exports general languages content of the app that is not relationed with custom elements like menus, articles, products, ect...',	511,	1),
(1149,	'It exports users and its data',	512,	1),
(1150,	'Uploading Image...',	513,	1);

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "username" character varying(50),
    "pwd" character varying(150),
    "status" integer,
    "access" integer,
    "_userstypes" integer,
    "_userstypes_position" integer,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "users__userstypes" ON "public"."users" USING btree ("_userstypes");

INSERT INTO "users" ("id", "username", "pwd", "status", "access", "_userstypes", "_userstypes_position") VALUES
(2,	'ordersadmin',	'$2y$10$PlqpvA9Oafxu9UA6tbF67OL86oqDjFgY9IPUuSHoPXl3LQ12J8wHu',	0,	1603212168,	3, 1),
(6,	'usersadmin',	'$2y$10$W4KkiELlafJWyHHamXko/.lzcc0cvRvYSCpqBNt9sbQXB9NVVq3kq',	0,	1590327417,	11, 1),
(1,	'webadmin',	'$2y$10$NKXLi/BalpfosYj2btEkjO7KZxvIX/bBJx1uPVieALynD/LUEP3pe',	0,	1635687561,	7, 1),
(4,	'productsadmin',	'$2y$10$gaaoUP8s7iE5QF0HgLTBOut3AL8HhHT4UXhcQ.3mnc42JzM3O/opq',	0,	1636215772,	9, 1),
(7,	'systemadmin',	'$2y$10$ImHVY1dgkuB4RMWE8PYd0u7Y3S9TO1mwkJUl6rjeMhwuSpRBbjJue',	0,	1637160504,	13, 1);

DROP TABLE IF EXISTS "usersdata";
DROP SEQUENCE IF EXISTS usersdata_id_seq;
CREATE SEQUENCE usersdata_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."usersdata" (
    "id" integer DEFAULT nextval('usersdata_id_seq') NOT NULL,
    "fullname" character varying(80),
    "emailaddress" character varying(80),
    "phonenumber" character varying(50),
    "_users" integer,
    CONSTRAINT "usersdata_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "usersdata__users" ON "public"."usersdata" USING btree ("_users");

INSERT INTO "usersdata" ("id", "fullname", "emailaddress", "phonenumber", "_users") VALUES
(1,	'',	'',	'0',	1),
(2,	'',	'',	'0',	2),
(3,	'',	'',	'0',	4),
(4,	'',	'',	'0',	6),
(5,	'',	'',	'0',	7);

DROP TABLE IF EXISTS "userstypes";
DROP SEQUENCE IF EXISTS usertypes_id_seq;
CREATE SEQUENCE usertypes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."userstypes" (
    "id" integer DEFAULT nextval('usertypes_id_seq') NOT NULL,
    "type" character varying(50),
    "_userstypes_position" integer,
    CONSTRAINT "usertypes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "userstypes" ("id", "type", "_userstypes_position") VALUES
(3,	'orders administrator', 1),
(7,	'web administrator', 2),
(9,	'product administrator', 3),
(10,	'product seller', 4),
(11,	'user administrator', 5),
(12,	'customer', 6),
(13,	'system administrator', 7);

ALTER TABLE ONLY "public"."addresses" ADD CONSTRAINT "addresses__users_fkey" FOREIGN KEY (_users) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."itemcategories" ADD CONSTRAINT "itemcategories__itemcategories_fkey" FOREIGN KEY (_itemcategories) REFERENCES itemcategories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."itemcategoriesdata" ADD CONSTRAINT "itemcategoriesdata__itemcategories_fkey" FOREIGN KEY (_itemcategories) REFERENCES itemcategories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."itemcategoriesdata" ADD CONSTRAINT "itemcategoriesdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."items" ADD CONSTRAINT "items__itemcategories_fkey" FOREIGN KEY (_itemcategories) REFERENCES itemcategories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."items" ADD CONSTRAINT "items__itemusers_fkey" FOREIGN KEY (_itemusers) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."itemsdata" ADD CONSTRAINT "itemsdata__items_fkey" FOREIGN KEY (_items) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."itemsdata" ADD CONSTRAINT "itemsdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."itemsimages" ADD CONSTRAINT "itemsimages__items_fkey" FOREIGN KEY (_items) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."orderitems" ADD CONSTRAINT "orderitems__orders_fkey" FOREIGN KEY (_orders) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."orderpaymenttypes" ADD CONSTRAINT "orderpaymenttypes__orders_fkey" FOREIGN KEY (_orders) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."orders" ADD CONSTRAINT "orders__users_fkey" FOREIGN KEY (_users) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."ordershippingtypes" ADD CONSTRAINT "ordershippingtypes__orders_fkey" FOREIGN KEY (_orders) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."pageelements" ADD CONSTRAINT "pageelements__pageelements_fkey" FOREIGN KEY (_pageelements) REFERENCES pageelements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."pageelementsdata" ADD CONSTRAINT "pageelementsdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."pageelementsdata" ADD CONSTRAINT "pageelementsdata__pageelements_fkey" FOREIGN KEY (_pageelements) REFERENCES pageelements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."paymenttypesdata" ADD CONSTRAINT "paymenttypesdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."paymenttypesdata" ADD CONSTRAINT "paymenttypesdata__paymenttypes_fkey" FOREIGN KEY (_paymenttypes) REFERENCES paymenttypes(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."shippingtypesdata" ADD CONSTRAINT "shippingtypesdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."shippingtypesdata" ADD CONSTRAINT "shippingtypesdata__shippingtypes_fkey" FOREIGN KEY (_shippingtypes) REFERENCES shippingtypes(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."siteelements" ADD CONSTRAINT "siteelements__siteelements_fkey" FOREIGN KEY (_siteelements) REFERENCES siteelements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."siteelementsdata" ADD CONSTRAINT "siteelementsdata__languages_fkey" FOREIGN KEY (_languages) REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."siteelementsdata" ADD CONSTRAINT "siteelementsdata__siteelements_fkey" FOREIGN KEY (_siteelements) REFERENCES siteelements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users__userstypes_fkey" FOREIGN KEY (_userstypes) REFERENCES userstypes(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;

ALTER TABLE ONLY "public"."usersdata" ADD CONSTRAINT "usersdata__users_fkey" FOREIGN KEY (_users) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- 2021-11-20 20:09:26.326002+01