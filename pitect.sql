-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 17, 2022 at 04:49 AM
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projectbudgets`
--

INSERT INTO `projectbudgets` (`id`, `projectId`, `date`, `content`, `amount`, `cost`, `created_at`) VALUES
(15, 29, '2022-03-16', 'Kontrak Awal', 0, 15000000, '2022-03-16 09:48:27'),
(16, 30, '2022-03-16', 'Kontrak Awal', 0, 2000000, '2022-03-16 10:32:28'),
(17, 29, '2022-03-16', 'Pembelian semen', 20, 2000000, '2022-03-16 11:15:49'),
(18, 30, '2022-03-16', 'Pembelian pasir', 20, 2000000, '2022-03-16 11:23:30'),
(19, 29, '2022-03-17', 'Penyewaan jasa aduk semen dengan pasir', 20, 2000000, '2022-03-17 02:41:36'),
(21, 32, '2022-03-17', 'Kontrak Awal', 0, 500000000, '2022-03-17 03:52:50'),
(22, 33, '2022-03-17', 'Kontrak Awal', 0, 500000000, '2022-03-17 03:54:37'),
(24, 35, '2022-03-17', 'Kontrak Awal', 0, 500000000, '2022-03-17 04:24:25');

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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projectmembers`
--

INSERT INTO `projectmembers` (`id`, `user`, `project`, `created_at`) VALUES
(49, 27, 29, '2022-03-16 09:48:27'),
(50, 24, 29, '2022-03-16 09:56:27'),
(51, 27, 30, '2022-03-16 10:32:28'),
(53, 24, 32, '2022-03-17 03:52:50'),
(54, 24, 33, '2022-03-17 03:54:37'),
(56, 24, 35, '2022-03-17 04:24:25');

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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `admin`, `totalContract`, `startDate`, `finishDate`, `address`, `created_at`) VALUES
(29, 'Pembangunan Jembatan', 27, 15000000, '2021-12-23', '2022-02-13', 'Sulawesi Selatan', '2022-03-16 09:48:27'),
(30, 'Pembangunan Wc', 27, 2000000, '2021-12-23', '2022-02-13', 'Sulawesi Selatan', '2022-03-16 10:32:28'),
(32, 'Pengembangan proyek homestay', 24, 500000000, '2022-01-08', '2022-07-08', 'Maluku', '2022-03-17 03:52:50'),
(33, 'Pembangunan Proyek IKN', 24, 500000000, '2022-01-08', '2022-07-08', 'Sulawesi Selatan', '2022-03-17 03:54:37'),
(35, 'Pengembangan proyek sengketa', 24, 500000000, '2022-01-08', '2022-07-08', 'Maluku', '2022-03-17 04:24:25');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `content`, `isFinished`, `projectId`, `created_at`) VALUES
(1, 'Perancangan Kontruksi', 0, 29, '2022-03-16 09:48:27'),
(2, 'Perancangan Kontruksi', 0, 30, '2022-03-16 10:32:28'),
(4, 'Perancangan Kontruksi', 0, 32, '2022-03-17 03:52:50'),
(5, 'Perancangan Kontruksi', 0, 33, '2022-03-17 03:54:37'),
(7, 'Perancangan Kontruksi', 0, 35, '2022-03-17 04:24:25');

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
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`USERID`, `FULLNAME`, `TYPE`, `isVerified`, `numPhone`, `EMAIL`, `PASSWORD`) VALUES
(24, 'john doe', 'personal', 0, '089123456789', 'johndoe@gmail.com', '$2b$12$WE4aqiUH.xnnF32tJwkrpeaJswHjO5wPBGZ0.Dx7/EX151XbXrjkO'),
(25, 'jane doe', 'organization', 0, '089123456789', 'janedoe@gmail.com', '$2b$12$DIm3lsm26uhDU8k43uk9RuANaR0lS7LqqODvpwfAVIyTzrycCWJvi'),
(27, 'rocketmail', 'company', 0, '089123456789', 'rocketmail@gmail.com', '$2b$12$kr2GTTc03U.dpN7dgBsWZuntHTj3ObJBk62zfOsFLg17LnThPGcx2');

--
-- Constraints for dumped tables
--

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
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
