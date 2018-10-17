-- MySQL dump 10.13  Distrib 8.0.12, for Linux (x86_64)
--
-- Host: localhost    Database: southwind
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `southwind`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `southwind` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

USE `southwind`;

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_details` (
  `productID` int(10) unsigned NOT NULL,
  `comment` text,
  PRIMARY KEY (`productID`),
  CONSTRAINT `product_details_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products` (
  `productID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productCode` char(3) NOT NULL DEFAULT '',
  `name` varchar(30) NOT NULL DEFAULT '',
  `quantity` int(10) unsigned NOT NULL DEFAULT '0',
  `price` decimal(7,2) NOT NULL DEFAULT '99999.99',
  PRIMARY KEY (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=2007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2001,'PEN','Pen Red',5000,1.23),(2002,'PEN','Pen Blue',8000,1.25),(2003,'PEN','Pen Black',2000,1.25),(2004,'PEC','Pencil 2B',10000,0.48),(2005,'PEC','Pencil 2H',8000,0.49),(2006,'PEC','Pencil HB',0,99999.99);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_suppliers`
--

DROP TABLE IF EXISTS `products_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products_suppliers` (
  `productID` int(10) unsigned NOT NULL,
  `supplierID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`productID`,`supplierID`),
  KEY `supplierID` (`supplierID`),
  CONSTRAINT `products_suppliers_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productid`),
  CONSTRAINT `products_suppliers_ibfk_2` FOREIGN KEY (`supplierID`) REFERENCES `suppliers` (`supplierid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_suppliers`
--

LOCK TABLES `products_suppliers` WRITE;
/*!40000 ALTER TABLE `products_suppliers` DISABLE KEYS */;
INSERT INTO `products_suppliers` VALUES (2001,501),(2002,501),(2003,501),(2004,502),(2001,503);
/*!40000 ALTER TABLE `products_suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `suppliers` (
  `supplierID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `phone` char(8) NOT NULL DEFAULT '',
  PRIMARY KEY (`supplierID`)
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (501,'ABC Traders','88881111'),(502,'XYZ Company','88882222'),(503,'QQ Corp','88883333');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-17 17:46:45
