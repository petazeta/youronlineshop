-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 10, 2018 at 01:34 AM
-- Server version: 5.5.60-0+deb8u1
-- PHP Version: 5.6.36-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ecommerce`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itemsdata`
--

INSERT INTO `itemsdata` (`id`, `name`, `descriptionlarge`, `descriptionshort`, `image`, `price`, `_items`, `_languages`) VALUES
(10, 'First Product', '', 'P description', '', 8.00, 10, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `itemsdata`
--
ALTER TABLE `itemsdata`
 ADD PRIMARY KEY (`id`), ADD KEY `_groups` (`_items`), ADD KEY `_languages` (`_languages`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `itemsdata`
--
ALTER TABLE `itemsdata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `itemsdata`
--
ALTER TABLE `itemsdata`
ADD CONSTRAINT `itemsdata_ibfk_2` FOREIGN KEY (`_languages`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `itemsdata_ibfk_3` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
