-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2021 at 03:25 PM
-- Server version: 8.0.26-0ubuntu0.20.04.3
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `3_6`
--

-- --------------------------------------------------------

--
-- Table structure for table `itemsimages`
--

CREATE TABLE `itemsimages` (
  `id` int NOT NULL,
  `imagename` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `_items` int DEFAULT NULL,
  `_items_position` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `itemsimages`
--
ALTER TABLE `itemsimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itemsimages_ibfk_1` (`_items`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `itemsimages`
--
ALTER TABLE `itemsimages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itemsimages`
--
ALTER TABLE `itemsimages`
  ADD CONSTRAINT `itemsimages_ibfk_1` FOREIGN KEY (`_items`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

