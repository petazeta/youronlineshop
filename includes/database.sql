-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 04-05-2018 a las 16:16:04
-- Versión del servidor: 5.5.58-0+deb8u1
-- Versión de PHP: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `ecommerce`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `addresses`
--

CREATE TABLE IF NOT EXISTS `addresses` (
`id` int(11) NOT NULL,
  `street` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pc` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `addresses`
--

INSERT INTO `addresses` (`id`, `street`, `city`, `state`, `pc`) VALUES
(20, 'my street', 'cityyyyyy', '', ''),
(21, '', '', '', ''),
(22, '', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documents`
--

CREATE TABLE IF NOT EXISTS `documents` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creationdate` datetime NOT NULL,
  `modificationdate` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `documents`
--

INSERT INTO `documents` (`id`, `name`, `creationdate`, `modificationdate`) VALUES
(1, 'root', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'How to', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'About', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'More', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'Additional Apps', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domelements`
--

CREATE TABLE IF NOT EXISTS `domelements` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `innerHTML` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `domelements`
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
(32, 'license', 'License'),
(33, 'designed', 'Powered by YOS'),
(36, 'addcarttt', '+1 to the cart'),
(38, 'lgintt', 'Insert you account details or create a new account.'),
(41, 'headtitle', 'Shop Title'),
(42, 'headsubtitle', 'This is my first shop'),
(43, 'username', 'the user name'),
(44, 'emptyvallabel', 'Not any value'),
(46, '', '<div>There are three olready created users: "user1", "user2" and "user3".&nbsp;</div><div><br></div><div>These are the users names, and users passwords are the same as users names.</div><div><br></div><div>User "user2" is order administrator and can watch and edit all the orders. Once you log in with this user click at "Show orders" button.</div><div><br></div><div>User "user3" is web administrator and can edit the web page content and the catalog (categories and items).<br></div>'),
(47, '', 'This software implements a smart customizable WYSIWYG (What You See Is What You Get) online ordering system (also known as ecommerce, e-commerce CMS, online store or shopping cart).<br>'),
(48, '', 'Continue at <b>How to</b>'),
(49, '', 'To start: log in with one of the users or sign in with a new one.'),
(50, '', 'More information at: <a href="https://github.com/petazeta/youronlineshop/wiki">Project Docs</a>&nbsp;and <a href="https://sourceforge.net/p/youronlineshop/discussion/">Project Forums</a>'),
(56, '', 'DbManager is a tool for editing database records. Get more information at: <a href="http://youronlineshop.sourceforge.net/dbmanager/">Dbmanager Home</a>'),
(57, '', 'When edit content click outside of the editable area to save changes. Use Intro for new line.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itemcategories`
--

CREATE TABLE IF NOT EXISTS `itemcategories` (
`id` int(11) NOT NULL,
  `cname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `itemcategories`
--

INSERT INTO `itemcategories` (`id`, `cname`) VALUES
(1, 'root'),
(3, 'Línea Facial'),
(5, 'Línea Tratamientos'),
(6, 'Limpieza'),
(7, 'Nutritivas'),
(8, 'Hidratantes'),
(9, 'Acné'),
(10, 'Manchas y marcas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items`
--

CREATE TABLE IF NOT EXISTS `items` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionlarge` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionshort` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `items`
--

INSERT INTO `items` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `image`, `price`) VALUES
(1, 'Lote Tratamiento Acné. 40 días. 15% Dto.', '<p>Las más de mil personas que han realizado con éxito este tratamiento son el mejor aliciente para comenzar a beneficiarse de las mejorías que se obtienen no sólo con respecto al acné sino también en el estado de salud de la piel.</p><p>Este tratamiento tiene un uso interno que actúa directamente en el origen del problema debido a sus propiedades depurativas y como regulador hormonal, y un uso externo que actúa eliminando el acné debido a sus propiedades astringetes, bactericidas, antibióticas y regeneradoras. Además es un tratamiento totalmente natural y sin efectos secundarios, beneficioso para la salud, fortalecedor de las defensas del organismo y aporta gran parte de las vitaminas y minerales necesarios para tener una piel sana.</p><p>De forma externa su acción es sobre los granos ya que literalmente cura la infección, elimina la obstrucción de los poros y nutre las capas epiteliales hasta conseguir regenerar la piel dañada.</p><p>Productos que componen el tratamiento:</p><ul><li>2 - Aloe Vera bebible 1L</li> <li>1 - Gel limpiador pieles grasas</li> <li>1 - Aloe Vera en Gel 200ml</li> <li>1 - Pulpa fresca de Aloe Vera 200ml</li></ul><printOut><p>Modo de aplicación:</p><ul> <li> Jugo de aloe vera 1l.: debes tomarte 4 tapones diarios preferiblemente en ayunas. (Doblar la dosis durante la primera semana)</li> <li> Lávate con el gel limpiador antes de las otras aplicaciones.</li> <li> Gel de aloe vera: Crema hidratante que debes aplicarte por las mañanas dejando que actúe durante todo el día. Puedes repetir la aplicación las veces que sea necesario a lo largo del día.</li> <li> Pulpa de Aloe: dátela cuando estés en casa, dos o tres veces, sin necesidad de aclarar. Te la puedes dar también antes de acostarte y, una vez se seque, dormir con ella puesta.</li></ul></printOut><p>Duración aprox. del lote: 40</p>', '<p>Las más de mil personas que han realizado con éxito este tratamiento son el mejor aliciente para comenzar a beneficiarse de las mejorías que se obtienen no sólo con respecto al acné sino también en el estado de salud de la piel. tambien tenemos mas cosas bien hechas.<br></p>', 'trat_acne.jpg', 969.00),
(3, 'Gel limpiador facial pieles grasa 200ml.', '<p>Nuestro sistema específico de limpieza facial que no contiene jabón y no irrita, es, sin duda, uno de los productos con más éxito. Ideal para pieles grasas y/o sensibles.</p><p>Al estar formulado con Hamamelis y Aloe Vera, cuida la piel a la vez que limpia en profundidad, eliminando grasa e impurezas de la piel y, por tanto, dejándola con un tono mate y más homogéneo.</p><p>Es muy beneo en casos de acné y de piel grasa, ya que elimina impuzas sin dañar la piel.</p><p>Modo de empleo:</p><p>Aplicar sobre el rostro realizando ligeros masajes circulares. Retirar con agua. No produce espuma...</p>', 'Nuestro sistema específico de limpieza facial que no contiene jabón y no irrita, es, sin duda, uno de los productos con más éxito. Ideal para pieles grasas y/o sensibles', 'limp_gel.jpg', 71.00),
(8, 'Protector Labial', '<p>Suaviza, hidrata y repara los labios protegiendolos de las inclemencias del tiempo asi como el frio y el viento.</p><p>Con Prop&oacute;leo:. Recomendado para los labios cortados y agrietados. Previene la aparicion de estos casos a la vez que hidrata y protege los labios<br>Con protector solar factor 20: Protege de las radiaciones solares y el frio, revitalizando y recomponiendo el tejido labial. Hidrata y no engrasa<br>Con aloe vera: regenera y hidrata los labios d&aacute;ndoles un aspecto m&aacute;s atratactivo.</p><p>Aplicar las veces al d&iacute;a que sea necesario.</p>', '<p>Suaviza, hidrata y repara los labios protegiendolos de las inclemencias del tiempo asi como el frio y el viento.</p>', 'plabial.jpg', 7.00),
(9, 'Regenerador Cutáneo 200ml', '<p>Por sus propiedades regeneradoras es un producto excelente para eliminar las marcas y manchas producidas por el acné.</p><p> De aroma refrescante y profunda penetración. Homogeiniza el tono y suaviza las imperfecciones.</p> <p> Indicado para acelerar la regeneración de cicatrices y eliminar marcas y manchas.</p> <p> Modo de empleo:<BR> Extender sobre la cara o zonas a tratar, permitiendo que la piel lo absorba. Es recomendable aplicárselo antes de acostarse para que actúe durante la noche.</p>', 'Por sus propiedades regeneradoras es un producto excelente para eliminar las marcas y manchas producidas por el acné.', 'regenerador.jpg', 714.00),
(15, 'Peeling + morera', '<p>Tratamiento de gran efecto exfoliante e iluminador. Contribuye a difuminar los excesos de pigmentación y corregir las imperfecciones causadas por lesiones cutáneas. Previene la aparición de manchas.</p><p>Contiene ácido glicólico, ácido láctico y extracto de morera. Esta combinación de ingredientes le confiere un profundo efecto exfoliante que favorece la redistribuición de la pigmentación, proporciondo un tono y un tacto uniforme. El ácido glicólico es un compuesto que se extrae de la caña de azúcar.</p><p>Indicado para pieles con lesiones de acné y/o con excesos de pigmentación.</p><print><p>Modo de empleo:<br> Aplicar en el rostro, incidiendo sobre las zonas más necesitadas. No aclarar. <b>Aplicar este producto un día y dejar descansar los dos siguientes. No aplicar más de 3 veces por semana.</b></p></print>', '<p>Tratamiento de gran efecto exfoliante e iluminador. Contribuye a difuminar los excesos de pigmentación y corregir las imperfecciones causadas por lesiones cutáneas. Previene la aparición de manchas.</p>', 'peeling.jpg', 20.00),
(17, 'Gel crema contorno de ojos de aloe vera 50ml', '<p>Gel crema no graso, que descongestiona las bolsas bajo los ojos y regenera la epidermis del contorno ocular, atenuando las arrugas de expresión, el decaimiento de los párpados y evitando la deshidratación.</p><p>Tonifica el contorno de ojos y previene la aparición de arrugas.</p><p>Modo de empleo:<br> Aplicar en el contorno de ojos.</p>', '<p>Gel crema no graso, que descongestiona las bolsas bajo los ojos y regenera la epidermis del contorno ocular, atenuando las arrugas de expresión, el decaimiento de los párpados y evitando la deshidratación.</p>', 'contornodeojos.jpg', 3.00),
(20, 'Jabon del apicultor hexagonal de miel 100gr', '<p>Tiene una deliciosa y potente fragancia a miel muy relajante. Contiene miel de abejas por lo que suaviza la piel y la deja mas hidratada.</p><p>Especialmente recomendado para las manos. Tiene forma hexagonal como los paneles de abejas de las que se obtiene la deliciosa miel.</p><p>Utilizar para el ba&ntilde;o o ducha diario.</p>', '<p>Tiene una deliciosa y potente fragancia a miel muy relajante. Contiene miel de abejas por lo que suaviza la piel y la deja mas hidratada.</p>', 'jabonmiel.jpg', 53.00),
(21, '', '', '', '', 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `links`
--

CREATE TABLE IF NOT EXISTS `links` (
`id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '1',
  `relationships_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=847 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `links`
--

INSERT INTO `links` (`id`, `parent_id`, `child_id`, `sort_order`, `relationships_id`) VALUES
(71, 4, 5, 1, 17),
(72, 4, 6, 2, 17),
(73, 4, 7, 3, 17),
(79, 5, 9, 1, 13),
(80, 5, 10, 2, 13),
(81, 3, 6, 1, 13),
(82, 3, 8, 2, 13),
(83, 3, 7, 3, 13),
(85, 1, 5, 1, 13),
(86, 1, 3, 2, 13),
(128, 1, 2, 2, 18),
(129, 1, 3, 3, 18),
(130, 3, 32, 2, 16),
(131, 3, 33, 1, 16),
(133, 33, 34, 2, 17),
(134, 33, 35, 1, 17),
(153, 6, 3, 2, 14),
(155, 9, 1, 1, 14),
(160, 8, 8, 1, 14),
(161, 10, 9, 1, 14),
(163, 10, 15, 2, 14),
(165, 7, 17, 1, 14),
(168, 6, 20, 1, 14),
(200, 2, 36, 1, 16),
(204, 2, 38, 2, 16),
(272, 1, 6, 1, 18),
(274, 6, 41, 1, 16),
(275, 6, 42, 2, 16),
(276, 6, 43, 3, 16),
(277, 43, 44, 1, 17),
(482, 1, 23, 2, 26),
(583, 2, 7, 1, 18),
(591, 7, 8, 1, 18),
(592, 7, 9, 2, 18),
(593, 8, 14, 2, 16),
(594, 8, 23, 1, 16),
(595, 9, 15, 3, 16),
(596, 9, 19, 2, 16),
(597, 9, 20, 1, 16),
(599, 8, 43, 3, 16),
(600, 2, 10, 2, 18),
(602, 10, 25, 2, 16),
(603, 10, 27, 1, 16),
(604, 2, 9, 3, 16),
(610, 1, 44, 1, 16),
(698, 33, 8, 1, 15),
(699, 32, 9, 1, 15),
(719, 23, 46, 1, 30),
(740, 14, 21, 1, 14),
(787, 1, 30, 1, 26),
(812, 13, 30, 1, 10),
(813, 13, 20, 1, 29),
(814, 14, 31, 1, 10),
(815, 14, 21, 1, 29),
(816, 15, 32, 1, 10),
(817, 15, 22, 1, 29),
(818, 14, 3, 1, 4),
(819, 15, 7, 1, 4),
(820, 30, 47, 1, 30),
(821, 30, 48, 2, 30),
(822, 23, 49, 3, 30),
(823, 1, 31, 3, 26),
(824, 31, 50, 1, 30),
(838, 13, 52, 1, 20),
(839, 52, 83, 1, 21),
(840, 1, 32, 4, 26),
(844, 32, 56, 1, 30),
(845, 23, 57, 2, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderitems`
--

CREATE TABLE IF NOT EXISTS `orderitems` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orderitems`
--

INSERT INTO `orderitems` (`id`, `name`, `price`, `quantity`) VALUES
(83, 'Lote Tratamiento Acné. 40 días. 15% Dto.', 969.00, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
`id` int(11) NOT NULL,
  `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `creationdate`, `modificationdate`, `status`) VALUES
(52, '2018-04-27 20:56:25', '0000-00-00 00:00:00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relationships`
--

CREATE TABLE IF NOT EXISTS `relationships` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parenttablename` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentunique` tinyint(1) NOT NULL DEFAULT '1',
  `childtablename` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childunique` tinyint(1) NOT NULL DEFAULT '0',
  `childtablelocked` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `relationships`
--

INSERT INTO `relationships` (`id`, `name`, `parenttablename`, `parentunique`, `childtablename`, `childunique`, `childtablelocked`) VALUES
(4, 'users_userstypes', 'users', 0, 'userstypes', 1, 1),
(10, 'user_userdata', 'users', 1, 'usersdata', 1, 0),
(13, 'itemcategories', 'itemcategories', 1, 'itemcategories', 0, 0),
(14, 'itemcategories_items', 'itemcategories', 1, 'items', 0, 0),
(16, 'websections_domelements', 'websections', 1, 'domelements', 0, 0),
(17, 'domelements', 'domelements', 1, 'domelements', 0, 0),
(18, 'websections', 'websections', 1, 'websections', 0, 0),
(20, 'orders', 'users', 1, 'orders', 0, 0),
(21, 'orderitems', 'orders', 1, 'orderitems', 0, 0),
(22, 'items', 'orderitems', 1, 'items', 1, 1),
(26, 'documents', 'documents', 1, 'documents', 0, 0),
(29, 'users_addresses', 'users', 1, 'addresses', 0, 0),
(30, 'documents_domelements', 'documents', 1, 'domelements', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`) VALUES
(13, 'user1', 'user1'),
(14, 'user2', 'user2'),
(15, 'user3', 'user3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usersdata`
--

CREATE TABLE IF NOT EXISTS `usersdata` (
`id` int(11) NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usersdata`
--

INSERT INTO `usersdata` (`id`, `name`, `surname`, `email`, `phonenumber`) VALUES
(30, 'uname', 'surname', 'emaillllll', 1111),
(31, '', '', '', 0),
(32, '', '', '', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userstypes`
--

CREATE TABLE IF NOT EXISTS `userstypes` (
`id` int(11) NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `userstypes`
--

INSERT INTO `userstypes` (`id`, `type`) VALUES
(3, 'orders administrator'),
(7, 'web administrator');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `websections`
--

CREATE TABLE IF NOT EXISTS `websections` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `websections`
--

INSERT INTO `websections` (`id`, `name`) VALUES
(1, 'root'),
(2, 'middle'),
(3, 'bottom'),
(6, 'top'),
(7, 'logbox'),
(8, 'logboxin'),
(9, 'logboxout'),
(10, 'cartbox');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `addresses`
--
ALTER TABLE `addresses`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `documents`
--
ALTER TABLE `documents`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `domelements`
--
ALTER TABLE `domelements`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `itemcategories`
--
ALTER TABLE `itemcategories`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `items`
--
ALTER TABLE `items`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `links`
--
ALTER TABLE `links`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orderitems`
--
ALTER TABLE `orderitems`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `relationships`
--
ALTER TABLE `relationships`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usersdata`
--
ALTER TABLE `usersdata`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `userstypes`
--
ALTER TABLE `userstypes`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `websections`
--
ALTER TABLE `websections`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `addresses`
--
ALTER TABLE `addresses`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT de la tabla `documents`
--
ALTER TABLE `documents`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT de la tabla `domelements`
--
ALTER TABLE `domelements`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=58;
--
-- AUTO_INCREMENT de la tabla `itemcategories`
--
ALTER TABLE `itemcategories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT de la tabla `links`
--
ALTER TABLE `links`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=847;
--
-- AUTO_INCREMENT de la tabla `orderitems`
--
ALTER TABLE `orderitems`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=84;
--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=53;
--
-- AUTO_INCREMENT de la tabla `relationships`
--
ALTER TABLE `relationships`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `usersdata`
--
ALTER TABLE `usersdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT de la tabla `userstypes`
--
ALTER TABLE `userstypes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `websections`
--
ALTER TABLE `websections`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
