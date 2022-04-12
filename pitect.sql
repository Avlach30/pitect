-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 12, 2022 at 08:54 AM
-- Server version: 8.0.21
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pitect`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int DEFAULT NULL,
  `serviceInfoId` int DEFAULT NULL,
  `cartId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`,`serviceInfoId`,`cartId`),
  KEY `cartId` (`cartId`),
  KEY `serviceInfoId` (`serviceInfoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
CREATE TABLE IF NOT EXISTS `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `serviceId` int DEFAULT NULL,
  `serviceInfoId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`,`serviceId`,`serviceInfoId`),
  KEY `serviceId` (`serviceId`),
  KEY `serviceInfoId` (`serviceInfoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderreviews`
--

DROP TABLE IF EXISTS `orderreviews`;
CREATE TABLE IF NOT EXISTS `orderreviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  `serviceId` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `serviceId` (`serviceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `isSuccess` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projectbudgets`
--

DROP TABLE IF EXISTS `projectbudgets`;
CREATE TABLE IF NOT EXISTS `projectbudgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `date` date NOT NULL,
  `content` varchar(72) NOT NULL,
  `amount` int NOT NULL,
  `cost` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projectbudgets`
--

INSERT INTO `projectbudgets` (`id`, `projectId`, `date`, `content`, `amount`, `cost`, `created_at`) VALUES
(15, 29, '2022-03-16', 'Kontrak Awal', 0, 15000000, '2022-03-16 09:48:27'),
(16, 30, '2022-03-16', 'Kontrak Awal', 0, 2000000, '2022-03-16 10:32:28'),
(19, 29, '2022-03-17', 'Penyewaan jasa aduk semen dengan pasir', 20, 2000000, '2022-03-17 02:41:36'),
(22, 33, '2022-03-17', 'Kontrak Awal', 0, 500000000, '2022-03-17 03:54:37'),
(24, 35, '2022-03-17', 'Kontrak Awal', 0, 500000000, '2022-03-17 04:24:25'),
(26, 32, '2022-03-17', 'Kontrak Awal', 20, 500000000, '2022-03-22 04:17:49'),
(27, 30, '2022-03-17', 'Penyewaan jasa aduk semen dengan pasir', 20, 1000000, '2022-03-22 04:18:48'),
(29, 33, '2022-03-17', 'Pengecoran', 20, 150000, '2022-03-22 04:24:38'),
(31, 36, '2022-03-28', 'Kontrak Awal', 0, 20000000, '2022-03-28 05:27:11'),
(32, 37, '2022-03-28', 'Kontrak Awal', 0, 20000000, '2022-03-28 05:27:21'),
(33, 29, '0000-00-00', 'Pengecoran', 20, 1500000, '2022-03-28 05:38:03'),
(34, 33, '0000-00-00', 'Pengadukan semen', 20, 3000000, '2022-03-28 05:38:03');

-- --------------------------------------------------------

--
-- Table structure for table `projectmembers`
--

DROP TABLE IF EXISTS `projectmembers`;
CREATE TABLE IF NOT EXISTS `projectmembers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int DEFAULT NULL,
  `project` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member` (`user`),
  KEY `taskProject` (`project`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projectmembers`
--

INSERT INTO `projectmembers` (`id`, `user`, `project`, `created_at`) VALUES
(49, 27, 29, '2022-03-16 09:48:27'),
(50, 24, 29, '2022-03-16 09:56:27'),
(51, 27, 30, '2022-03-16 10:32:28'),
(53, 24, 32, '2022-03-17 03:52:50'),
(54, 24, 33, '2022-03-17 03:54:37'),
(56, 24, 35, '2022-03-17 04:24:25'),
(57, 24, 30, '2022-03-18 03:11:40'),
(58, 27, 32, '2022-03-18 06:55:22'),
(59, 27, 35, '2022-03-18 06:58:13'),
(61, 27, 33, '2022-03-21 04:24:52'),
(69, 24, 36, '2022-03-28 05:27:11'),
(70, 28, 37, '2022-03-28 05:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `admin` int DEFAULT NULL,
  `totalContract` int NOT NULL,
  `startDate` date NOT NULL,
  `finishDate` date NOT NULL,
  `address` varchar(96) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `taskAdmin` (`admin`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `admin`, `totalContract`, `startDate`, `finishDate`, `address`, `created_at`) VALUES
(29, 'Pembangunan Jembatan', 27, 15000000, '2021-12-23', '2022-02-13', 'Sulawesi Selatan', '2022-03-16 09:48:27'),
(30, 'Pembangunan Wc', 27, 22000000, '2021-12-23', '2022-02-13', 'Sulawesi Selatan', '2022-03-16 10:32:28'),
(32, 'Pengembangan proyek homestay', 24, 500000000, '2022-01-08', '2022-07-08', 'Maluku', '2022-03-17 03:52:50'),
(33, 'Pembangunan Proyek IKN', 24, 500000000, '2022-01-08', '2022-07-08', 'Sulawesi Selatan', '2022-03-17 03:54:37'),
(35, 'Pengembangan proyek sengketa', 24, 500000000, '2022-01-08', '2022-07-08', 'Maluku', '2022-03-17 04:24:25'),
(36, 'Pengembangan proyek kolam renang', 24, 20000000, '2022-03-26', '2022-07-26', 'Yogyakarta', '2022-03-28 05:27:11'),
(37, 'Pengembangan proyek kolam renang', 28, 20000000, '2022-03-26', '2022-07-26', 'Yogyakarta', '2022-03-28 05:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `serviceinfos`
--

DROP TABLE IF EXISTS `serviceinfos`;
CREATE TABLE IF NOT EXISTS `serviceinfos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(512) NOT NULL,
  `duration` int DEFAULT NULL,
  `cost` int DEFAULT NULL,
  `serviceId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `serviceinfos`
--

INSERT INTO `serviceinfos` (`id`, `title`, `content`, `duration`, `cost`, `serviceId`, `created_at`) VALUES
(7, 'standard', 'desain dengan fitur seperti biasa', 2, 2000000, 11, '2022-04-12 04:16:18'),
(8, 'advanced', 'Penambahan fitur revisi desain 1 x', 4, 3500000, 11, '2022-04-12 04:16:18'),
(9, 'professional', 'Konsultrasi gratis, penyaluran dengan kontraktor professional', 7, 5000000, 11, '2022-04-12 04:16:18'),
(16, 'standard', 'desain dengan fitur seperti biasa', 2, 2000000, 14, '2022-04-12 04:57:25'),
(17, 'advanced', 'Penambahan fitur revisi desain 1 x', 4, 3500000, 14, '2022-04-12 04:57:25'),
(18, 'professional', 'Konsultrasi gratis, penyaluran dengan kontraktor professional', 7, 5000000, 14, '2022-04-12 04:57:25');

-- --------------------------------------------------------

--
-- Table structure for table `serviceowns`
--

DROP TABLE IF EXISTS `serviceowns`;
CREATE TABLE IF NOT EXISTS `serviceowns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `ownStatus` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`,`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `serviceowns`
--

INSERT INTO `serviceowns` (`id`, `serviceId`, `userId`, `ownStatus`, `created_at`) VALUES
(2, 2, 27, 'Creator', '2022-04-12 03:39:44'),
(4, 11, 27, 'Creator', '2022-04-12 04:16:18'),
(7, 14, 27, 'Creator', '2022-04-12 04:57:25'),
(8, 15, 24, 'Creator', '2022-04-12 05:00:50');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isService` tinyint(1) DEFAULT '1',
  `cost` int DEFAULT '0',
  `category` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creator` (`creator`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `description`, `isService`, `cost`, `category`, `image`, `creator`, `created_at`) VALUES
(2, 'desain tugu sepeda', 'Perancangan tugu sepeda untuk provinsi DKI Jakarta', 0, 5000000, 'statue', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/84dc9c5b-fe8b-491f-8070-c455ecfb0f63.jpeg', 27, '2022-04-12 03:39:44'),
(11, 'Rancangan kantor pos', 'Jasa perancangan kantor pos di daerah manado', 1, 5000000, 'Services', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/b2727586-07c2-4842-b034-4618cc3ee828.png', 27, '2022-04-12 04:16:18'),
(14, 'Rancangan Rumah tipe 36', 'Jasa perancangan denah rumah dengan tipe 36', 1, 5000000, 'Services', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg', 27, '2022-04-12 04:57:25'),
(15, 'desain stadion', 'desain untuk perancangan stadion JIS', 0, 5000000, 'design', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg', 24, '2022-04-12 05:00:50');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `isFinished` tinyint NOT NULL DEFAULT '0',
  `projectId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `taskProject` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `content`, `isFinished`, `projectId`, `created_at`) VALUES
(1, 'Perancangan Kontruksi', 1, 29, '2022-03-16 09:48:27'),
(2, 'Perancangan Kontruksi', 0, 30, '2022-03-16 10:32:28'),
(4, 'Perancangan Kontruksi', 1, 32, '2022-03-17 03:52:50'),
(5, 'Perancangan Kontruksi', 0, 33, '2022-03-17 03:54:37'),
(7, 'Perancangan Kontruksi', 0, 35, '2022-03-17 04:24:25'),
(8, 'Pengadukan Semen', 0, 30, '2022-03-23 02:31:31'),
(9, 'Pengecoran', 0, 32, '2022-03-23 02:37:24'),
(10, 'Pengadukan Semen', 1, 29, '2022-03-23 02:38:05'),
(12, 'Pengadukan semen dengan pasir', 0, 32, '2022-03-25 09:24:16'),
(13, 'Perancangan Kontruksi', 0, 36, '2022-03-28 05:27:11'),
(14, 'Perancangan Kontruksi', 0, 37, '2022-03-28 05:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `USERID` int NOT NULL AUTO_INCREMENT,
  `FULLNAME` varchar(24) NOT NULL,
  `TYPE` varchar(18) DEFAULT NULL,
  `isVerified` tinyint NOT NULL DEFAULT '0',
  `numPhone` varchar(15) NOT NULL,
  `EMAIL` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PASSWORD` varchar(256) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`USERID`, `FULLNAME`, `TYPE`, `isVerified`, `numPhone`, `EMAIL`, `PASSWORD`, `created_at`) VALUES
(24, 'john doe', 'personal', 0, '089123456789', 'johndoe@gmail.com', '$2b$12$WE4aqiUH.xnnF32tJwkrpeaJswHjO5wPBGZ0.Dx7/EX151XbXrjkO', '2022-04-11 02:30:26'),
(25, 'jane doe', 'organization', 0, '089123456789', 'janedoe@gmail.com', '$2b$12$DIm3lsm26uhDU8k43uk9RuANaR0lS7LqqODvpwfAVIyTzrycCWJvi', '2022-04-11 02:30:26'),
(27, 'rocketmail', 'company', 0, '089123456789', 'rocketmail@gmail.com', '$2b$12$kr2GTTc03U.dpN7dgBsWZuntHTj3ObJBk62zfOsFLg17LnThPGcx2', '2022-04-11 02:30:26'),
(28, 'john morisson', 'company', 0, '088987654321', 'morisson@gmail.com', '$2b$12$O5E3Ft/NVG2dlfdAh/GoB.jMxrxljac3W9qlwDIYuZUkhh.mzuUea', '2022-04-11 02:30:26');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serviceId` (`serviceId`,`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartitems`
--
ALTER TABLE `cartitems`
  ADD CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cartitems_ibfk_3` FOREIGN KEY (`serviceInfoId`) REFERENCES `serviceinfos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`serviceInfoId`) REFERENCES `serviceinfos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderreviews`
--
ALTER TABLE `orderreviews`
  ADD CONSTRAINT `orderreviews_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderreviews_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projectbudgets`
--
ALTER TABLE `projectbudgets`
  ADD CONSTRAINT `projectbudgets_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projectmembers`
--
ALTER TABLE `projectmembers`
  ADD CONSTRAINT `projectmembers_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projectmembers_ibfk_2` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `serviceinfos`
--
ALTER TABLE `serviceinfos`
  ADD CONSTRAINT `serviceinfos_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `serviceowns`
--
ALTER TABLE `serviceowns`
  ADD CONSTRAINT `serviceowns_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `serviceowns_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
