-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 11, 2022 at 09:22 AM
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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `USERID` int NOT NULL AUTO_INCREMENT,
  `FULLNAME` varchar(24) NOT NULL,
  `TYPE` varchar(18) DEFAULT NULL,
  `isVerified` tinyint NOT NULL DEFAULT '0',
  `numPhone` varchar(15) NOT NULL,
  `EMAIL` varchar(48) DEFAULT NULL,
  `PASSWORD` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`USERID`, `FULLNAME`, `TYPE`, `isVerified`, `numPhone`, `EMAIL`, `PASSWORD`) VALUES
(24, 'john doe', 'personal', 0, '089123456789', 'johndoe@gmail.com', '$2b$12$WE4aqiUH.xnnF32tJwkrpeaJswHjO5wPBGZ0.Dx7/EX151XbXrjkO'),
(25, 'jane doe', 'organization', 0, '089123456789', 'janedoe@gmail.com', '$2b$12$DIm3lsm26uhDU8k43uk9RuANaR0lS7LqqODvpwfAVIyTzrycCWJvi'),
(26, 'rocketmail', 'company', 0, '089123456789', 'rocketmail@gmail.com', '$2b$12$jIFapWK//q5hr5iZDJhXr.UFteoIAP/vIgYDZH67TQSDlG0Jhkaj6');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
