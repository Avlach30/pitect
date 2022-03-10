-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 10, 2022 at 01:52 AM
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
  `EMAIL` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PASSWORD` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`USERID`, `FULLNAME`, `TYPE`, `EMAIL`, `PASSWORD`) VALUES
(13, 'john doe', 'project owner', 'johndoe@gmail.com', '$2b$12$vTCQZNWL88n9FTj8z2bOq.5J5tqneqGj8K9Lwv3TFXphwxu.ur7cq'),
(14, 'jane doe', 'worker', 'janedoe@gmail.com', '$2b$12$CPuqVeuCwIWxM3Gp6EXgq.ATp3dPahpFsMYpjOz9X/NWkusKEyZ16'),
(15, 'morisson', 'project owner', 'morisson@gmail.com', '$2b$12$rAc9MhG20ReIjsjdJ/ERwOn0BuvRFrtBesGJ.UaEPMzaPzoEoQWQK');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
