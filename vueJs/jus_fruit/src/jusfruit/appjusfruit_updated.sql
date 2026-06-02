-- phpMyAdmin SQL Dump - Version mise à jour pour JusFruit
-- Ajout de la colonne texteEmb dans emballage + données de démo

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Base de données : `appjusfruit`

-- ─── TABLE CLIENT ───────────────────────────────────────────────────────────

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `idClient` int NOT NULL AUTO_INCREMENT,
  `mdp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomClient` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenomClient` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailClient` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numClient` int DEFAULT NULL,
  `adresseClient` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cdpClient` int DEFAULT NULL,
  PRIMARY KEY (`idClient`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `client` VALUES (1,'Jesu!isTr0pB!en','kawaii','patate','patate-kawaii@gmail.com',666666666,'3 rue des chevaliers',13190);

-- ─── TABLE COMMANDE ─────────────────────────────────────────────────────────

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `idCom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_commande` datetime DEFAULT NULL,
  `idClient` int NOT NULL,
  PRIMARY KEY (`idCom`),
  KEY `idClient` (`idClient`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── TABLE CONTENIR ─────────────────────────────────────────────────────────

DROP TABLE IF EXISTS `contenir`;
CREATE TABLE IF NOT EXISTS `contenir` (
  `idFruit` int NOT NULL,
  `idJus` int NOT NULL,
  `quantiteFruit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idFruit`,`idJus`),
  KEY `idJus` (`idJus`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contenir` VALUES
(1, 1, '200g'),
(2, 2, '150g'),
(3, 2, '100g'),
(4, 3, '180g'),
(5, 4, '120g'),
(3, 4, '80g');

-- ─── TABLE EMBALLAGE ────────────────────────────────────────────────────────
-- /!\ Nouvelle colonne : texteEmb (texte personnalisé optionnel sur l'emballage)
-- /!\ Nouvelle colonne : imageEmb (URL ou nom de fichier image)

DROP TABLE IF EXISTS `emballage`;
CREATE TABLE IF NOT EXISTS `emballage` (
  `idEmb` int NOT NULL AUTO_INCREMENT,
  `nomEmb` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeEmb` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colorisEmb` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prixEmb` decimal(15,2) DEFAULT NULL,
  `texteEmb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageEmb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idEmb`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `emballage` (`idEmb`, `nomEmb`, `typeEmb`, `colorisEmb`, `prixEmb`, `texteEmb`, `imageEmb`) VALUES
(1, 'Bouteille Classic', 'Bouteille', '#FF6B35', 1.50, NULL, NULL),
(2, 'Bouteille Premium', 'Bouteille', '#4CAF50', 2.00, NULL, NULL),
(3, 'Carton Eco', 'Carton', '#8BC34A', 0.80, NULL, NULL),
(4, 'Canette Fun', 'Canette', '#2196F3', 1.20, NULL, NULL);

-- ─── TABLE FRUIT ────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS `fruit`;
CREATE TABLE IF NOT EXISTS `fruit` (
  `idFruit` int NOT NULL AUTO_INCREMENT,
  `nomFruit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeFruit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stockFruit` int DEFAULT NULL,
  PRIMARY KEY (`idFruit`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fruit` VALUES
(1, 'Orange', 'Agrume', 500),
(2, 'Mangue', 'Tropical', 300),
(3, 'Ananas', 'Tropical', 400),
(4, 'Fraise', 'Baie', 350),
(5, 'Pastèque', 'Cucurbitacée', 200);

-- ─── TABLE LIGNE_COMMANDE ───────────────────────────────────────────────────

DROP TABLE IF EXISTS `ligne_commande`;
CREATE TABLE IF NOT EXISTS `ligne_commande` (
  `idCom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numLigne` int NOT NULL,
  `qte` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idEmb` int NOT NULL,
  `idJus` int NOT NULL,
  PRIMARY KEY (`idCom`,`numLigne`),
  KEY `idEmb` (`idEmb`),
  KEY `idJus` (`idJus`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── TABLE PRODUIT_JUS ──────────────────────────────────────────────────────

DROP TABLE IF EXISTS `produit_jus`;
CREATE TABLE IF NOT EXISTS `produit_jus` (
  `idJus` int NOT NULL AUTO_INCREMENT,
  `nomJus` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prixUnitaire` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idJus`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `produit_jus` VALUES
(1, 'Jus d\'Orange Pressé', '3.50', 'Un jus d\'orange fraîchement pressé, riche en vitamine C'),
(2, 'Exotique Mangue-Ananas', '4.20', 'Un mélange tropical entre mangue sucrée et ananas acidulé'),
(3, 'Ananas Soleil', '3.80', 'Jus d\'ananas pur, goût d\'été garanti'),
(4, 'Fraise Pastèque', '4.00', 'La douceur de la fraise rencontre la fraîcheur de la pastèque');

COMMIT;
