-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 23, 2022 at 03:02 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `userId`, `created_at`) VALUES
(1, 27, '2022-04-25 03:08:56'),
(2, 24, '2022-04-25 03:15:06');

-- --------------------------------------------------------

--
-- Table structure for table `inspirations`
--

DROP TABLE IF EXISTS `inspirations`;
CREATE TABLE IF NOT EXISTS `inspirations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `imageUrl` varchar(256) NOT NULL,
  `creator` int DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creator` (`creator`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inspirations`
--

INSERT INTO `inspirations` (`id`, `title`, `imageUrl`, `creator`, `description`, `created_at`) VALUES
(1, 'Inspirasi rumah arsitektur bali', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/pitect-inspirations/5a8c18b4-04e9-4733-b678-fdd72ec46cda.jpeg', 27, 'Desain rumah dengan gaya arsitektur bali, cocok untuk tempat beriklim tropis namun sejuk', '2022-05-23 06:15:44'),
(2, 'Inspirasi rumah bahan kayu', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/pitect-inspirations/4bc84fa4-4f2c-4271-b116-5df40c9b77fa.jpeg', 24, 'Desain rumah dengan gaya arsitektur rumah panggung, dengan berbahan kayu', '2022-05-23 06:18:16'),
(3, 'Inspirasi rumah kontainer', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/pitect-inspirations/b0281b48-9825-4add-ad4b-0d161be55a86.jpeg', 24, 'Desain rumah dengan gaya arsitektur rumah minimalis, dengan berbahan kontainer', '2022-05-23 08:49:16'),
(4, 'Desain rumah pohon', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/pitect-inspirations/6e521187-caff-4e65-8526-ac98e5ed5613.jpeg', 27, 'Desain rumah pohon dengan gaya minimalis namun nyaman. Dengan konsep menyatu degan alam', '2022-05-23 14:48:15');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`id`, `orderId`, `serviceId`, `serviceInfoId`, `created_at`) VALUES
(1, 2, 16, 20, '2022-04-26 04:26:03'),
(2, 2, 17, 22, '2022-04-26 04:26:03'),
(3, 3, 16, 21, '2022-04-26 08:19:26'),
(4, 3, 17, 24, '2022-04-26 08:19:26');

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
  `reviewer` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `serviceId` (`serviceId`),
  KEY `reviewer` (`reviewer`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orderreviews`
--

INSERT INTO `orderreviews` (`id`, `comment`, `rating`, `orderId`, `serviceId`, `reviewer`, `created_at`) VALUES
(1, 'Ya biasa ajasii', 4, 3, 16, 27, '2022-05-18 04:14:35'),
(2, 'Membuatku bahagia :*', 5, 3, 16, 27, '2022-05-19 09:45:08');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `cost` int DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Belum bayar',
  `cancelDate` date DEFAULT NULL,
  `slipPayment` varchar(512) NOT NULL DEFAULT 'Some image',
  `isApprove` tinyint NOT NULL DEFAULT '0',
  `doneDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `date`, `cost`, `status`, `cancelDate`, `slipPayment`, `isApprove`, `doneDate`, `userId`, `created_at`) VALUES
(2, '2022-04-26 04:26:03', 5500000, 'Perlu konfirmasi', NULL, 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/slip-transfers/4c7906fa-6b91-4d32-a252-255a98105e06.jpeg', 1, NULL, 27, '2022-04-26 04:26:03'),
(3, '2022-04-26 08:19:27', 10000000, 'Selesai', NULL, 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/slip-transfers/70fcbb01-b11e-41f5-a64c-021e2fa3da54.jpeg', 1, '2022-05-17', 27, '2022-04-26 08:19:26');

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `serviceinfos`
--

INSERT INTO `serviceinfos` (`id`, `title`, `content`, `duration`, `cost`, `serviceId`, `created_at`) VALUES
(19, 'standard', 'desain dengan fitur seperti biasa', 2, 2000000, 16, '2022-04-14 03:23:32'),
(20, 'advanced', 'Penambahan fitur revisi desain 1 x', 4, 3500000, 16, '2022-04-14 03:23:32'),
(21, 'professional', 'Konsultrasi gratis, penyaluran dengan kontraktor professional', 7, 5000000, 16, '2022-04-14 03:23:32'),
(22, 'standard', 'desain dengan fitur seperti biasa', 2, 2000000, 17, '2022-04-22 02:28:01'),
(23, 'advanced', 'Penambahan fitur revisi desain 1 x', 4, 3500000, 17, '2022-04-22 02:28:01'),
(24, 'professional', 'Konsultrasi gratis, penyaluran dengan kontraktor professional', 7, 5000000, 17, '2022-04-22 02:28:01'),
(25, 'standard', 'Tanpa revisi dan tanpa konsultasi', 3, 45000000, 18, '2022-04-27 07:18:04'),
(26, 'advanced', 'Penambahan fitur desain dengan revisi maksimal 2 kali', 6, 75000000, 18, '2022-04-27 07:18:04'),
(27, 'professional', 'Revisi maksimal 1 kali per hari, disertai dengan konsultasi dan penyaluran dengan kontraktor', 9, 150000000, 18, '2022-04-27 07:18:04');

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `serviceowns`
--

INSERT INTO `serviceowns` (`id`, `serviceId`, `userId`, `ownStatus`, `created_at`) VALUES
(2, 2, 27, 'Creator', '2022-04-12 03:39:44'),
(8, 15, 24, 'Creator', '2022-04-12 05:00:50'),
(9, 16, 24, 'Creator', '2022-04-14 03:23:32'),
(10, 17, 27, 'Creator', '2022-04-22 02:28:01'),
(11, 18, 27, 'Creator', '2022-04-27 07:18:04');

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `description`, `isService`, `cost`, `category`, `image`, `creator`, `created_at`) VALUES
(2, 'desain tugu sepeda', 'Perancangan tugu sepeda untuk provinsi DKI Jakarta', 0, 2000000, 'Traditional', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/84dc9c5b-fe8b-491f-8070-c455ecfb0f63.jpeg', 27, '2022-04-12 03:39:44'),
(15, 'Rancangan stadion', 'Desain / rancangan bangunan stadion bernuansa modern dan futuristik', 0, 5000000, 'Modern', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/6c4b01fb-6ccd-4581-8c52-a35240b582fb.jpeg', 24, '2022-04-12 05:00:50'),
(16, 'Desain rancangan jembatan Sumatra - Jawa', 'Jasa desain untuk rancangan konstruksi jembatan Sumatra - Jawa', 1, 5000000, 'Modern', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg', 24, '2022-04-14 03:23:32'),
(17, 'Desain kantor pos', 'Jasa desain kantor pos dengan gaya modern', 1, 5000000, 'modern', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/23a17ffc-cb2b-427e-9470-7f5201e331c8.jpeg', 27, '2022-04-22 02:28:01'),
(18, 'Desain GWK full', 'Jasa desain GWK secara keseluruhan', 1, 150000000, 'Modern', 'https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/2d4a6273-c889-44d5-8788-af9782499f0f.jpeg', 27, '2022-04-27 07:18:04');

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
  `Avatar` varchar(512) NOT NULL DEFAULT 'Some Avatar',
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

INSERT INTO `users` (`USERID`, `FULLNAME`, `TYPE`, `Avatar`, `isVerified`, `numPhone`, `EMAIL`, `PASSWORD`, `created_at`) VALUES
(24, 'john doe', 'personal', 'Some Avatar', 0, '089123456789', 'johndoe@gmail.com', '$2b$12$WE4aqiUH.xnnF32tJwkrpeaJswHjO5wPBGZ0.Dx7/EX151XbXrjkO', '2022-04-11 02:30:26'),
(25, 'jane doe', 'organization', 'Some Avatar', 0, '089123456789', 'janedoe@gmail.com', '$2b$12$DIm3lsm26uhDU8k43uk9RuANaR0lS7LqqODvpwfAVIyTzrycCWJvi', '2022-04-11 02:30:26'),
(27, 'rocketmail', 'company', 'Some Avatar', 0, '089123456789', 'rocketmail@gmail.com', '$2b$12$kr2GTTc03U.dpN7dgBsWZuntHTj3ObJBk62zfOsFLg17LnThPGcx2', '2022-04-11 02:30:26'),
(28, 'john morisson', 'company', 'Some Avatar', 0, '088987654321', 'morisson@gmail.com', '$2b$12$O5E3Ft/NVG2dlfdAh/GoB.jMxrxljac3W9qlwDIYuZUkhh.mzuUea', '2022-04-11 02:30:26');

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
  KEY `serviceId` (`serviceId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `serviceId`, `userId`, `created_at`) VALUES
(6, 16, 24, '2022-04-19 07:07:50'),
(9, 2, 24, '2022-04-19 07:12:28'),
(13, 2, 27, '2022-04-20 08:15:53');

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
-- Constraints for table `inspirations`
--
ALTER TABLE `inspirations`
  ADD CONSTRAINT `inspirations_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `orderreviews_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderreviews_ibfk_3` FOREIGN KEY (`reviewer`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`USERID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
