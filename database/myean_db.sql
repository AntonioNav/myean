SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `myean` ;
CREATE SCHEMA IF NOT EXISTS `myean` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci ;
USE `myean` ;

-- -----------------------------------------------------
-- Table `myean`.`Contacts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`Contacts` ;

CREATE TABLE IF NOT EXISTS `myean`.`Contacts` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Number` VARCHAR(11) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `Name` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `Report` TINYINT(1) NOT NULL DEFAULT 1,
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC),
  UNIQUE INDEX `Number_UNIQUE` (`Number` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 6;


-- -----------------------------------------------------
-- Table `myean`.`CallType`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`CallType` ;

CREATE TABLE IF NOT EXISTS `myean`.`CallType` (
  `Id` INT(1) NOT NULL,
  `Description` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `ID_UNIQUE` (`Id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myean`.`Calls`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`Calls` ;

CREATE TABLE IF NOT EXISTS `myean`.`Calls` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `StartDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EndDate` DATETIME NOT NULL,
  `Number` VARCHAR(11) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NULL,
  `CallType_Id` INT(1) NOT NULL,
  `Reported` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`, `CallType_Id`),
  UNIQUE INDEX `STARTDATE` (`StartDate` ASC),
  INDEX `NUMBER` (`Number` ASC, `CallType_Id` ASC),
  INDEX `REPORTED` (`Reported` ASC),
  INDEX `fk_calls_calltype_idx` (`CallType_Id` ASC),
  UNIQUE INDEX `ID_UNIQUE` (`Id` ASC),
  CONSTRAINT `fk_calls_calltype`
    FOREIGN KEY (`CallType_Id`)
    REFERENCES `myean`.`CallType` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_calls_contacts`
    FOREIGN KEY (`Number`)
    REFERENCES `myean`.`Contacts` (`Number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 593;


-- -----------------------------------------------------
-- Table `myean`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`Users` ;

CREATE TABLE IF NOT EXISTS `myean`.`Users` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(128) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Password` CHAR(60) NOT NULL,
  `SendMail` TINYINT(1) NOT NULL DEFAULT 1,
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myean`.`Roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`Roles` ;

CREATE TABLE IF NOT EXISTS `myean`.`Roles` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Active` TINYINT(1) NOT NULL DEFAULT 1,
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC),
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myean`.`Users_has_Roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `myean`.`Users_has_Roles` ;

CREATE TABLE IF NOT EXISTS `myean`.`Users_has_Roles` (
  `Users_Id` INT(11) NOT NULL,
  `Roles_Id` INT(11) NOT NULL,
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Users_Id`, `Roles_Id`),
  INDEX `fk_Users_has_Roles_Roles1_idx` (`Roles_Id` ASC),
  INDEX `fk_Users_has_Roles_Users1_idx` (`Users_Id` ASC),
  CONSTRAINT `fk_Users_has_Roles_Users1`
    FOREIGN KEY (`Users_Id`)
    REFERENCES `myean`.`Users` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_has_Roles_Roles1`
    FOREIGN KEY (`Roles_Id`)
    REFERENCES `myean`.`Roles` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `myean`.`Roles`
-- -----------------------------------------------------
START TRANSACTION;
USE `myean`;
INSERT INTO `myean`.`Roles` (`Id`, `Name`) VALUES (1, 'Admin');
INSERT INTO `myean`.`Roles` (`Id`, `Name`) VALUES (2, 'View');
INSERT INTO `myean`.`Users` (`Id`, `Name`, `Email`, `Password`) VALUES (1, 'Admin', 'admin@admin.new','$2a$10$D1GqqBSu6Yb4z7OHGdd2T.r0aYPF/TCKakte8PHlEjMdnnm2HOPJe');
INSERT INTO `myean`.`Users_has_Roles` (`Users_Id`, `Roles_Id`) VALUES (1,1);

COMMIT;

