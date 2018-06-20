CREATE DATABASE IF NOT EXISTS `ptdb`;
USE `ptdb`;

CREATE TABLE IF NOT EXISTS `ptdb`.`Employee` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `employee_code` VARCHAR(60) NULL,
  `employee_firstname` VARCHAR(20) NOT NULL,
  `employee_lastname` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Packer` (
  `packer_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`packer_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`employee_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Manager` (
  `manager_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`manager_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`employee_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Credentials` (
  `employee_id` INT NOT NULL,
  `username` VARCHAR(40) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `salt` BINARY(32) NOT NULL,
  `salted_hash` BINARY(96) NOT NULL,
  `is_admin` BOOL NOT NULL DEFAULT FALSE,
  `is_raspi` BOOL NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`username`),
  FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`employee_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Commodity` (
  `commodity_id` INT NOT NULL AUTO_INCREMENT,
  `commodity_name` VARCHAR(20) NOT NULL,
  `commodity_packtype` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`commodity_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Location` (
  `location_id` INT NOT NULL AUTO_INCREMENT,
  `location_name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`location_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Line` (
  `line_id` INT NOT NULL AUTO_INCREMENT,
  `location_id` INT NOT NULL,
  `line_name` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`line_id`),
  FOREIGN KEY (`location_id`) REFERENCES `Location`(`location_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Position` (
  `position_id` INT NOT NULL AUTO_INCREMENT,
  `position_code` VARCHAR(60) NOT NULL,
  `line_id` INT NOT NULL,
  PRIMARY KEY (`position_id`),
  FOREIGN KEY (`line_id`) REFERENCES `Line`(`line_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Roll` (
  `roll_id` INT NOT NULL AUTO_INCREMENT,
  `position_id` INT NOT NULL,
  PRIMARY KEY (`roll_id`),
  FOREIGN KEY (`position_id`) REFERENCES `Position`(`position_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Shift` (
  `shift_id` INT NOT NULL AUTO_INCREMENT,
  `shift_start` DATETIME NOT NULL,
  `shift_end` DATETIME NULL,
  `manager_id` INT NOT NULL,
  `line_id` INT NOT NULL,
  PRIMARY KEY (`shift_id`),
  FOREIGN KEY (`manager_id`) REFERENCES `Manager`(`manager_id`),
  FOREIGN KEY (`line_id`) REFERENCES `Line`(`line_id`)
);

CREATE TABLE IF NOT EXISTS `ptdb`.`Session` (
  `session_id` INT NOT NULL AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `commodity_id` INT NOT NULL,
  PRIMARY KEY (`session_id`)
);
