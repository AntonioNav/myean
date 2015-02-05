-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
DROP TABLE IF EXISTS Users ;

CREATE TABLE IF NOT EXISTS Users (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Name VARCHAR(128) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Password CHAR(60) NOT NULL,
  SendMail TINYINT NOT NULL DEFAULT 1,
  CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);

DROP INDEX IF EXISTS Email_UNIQUE;

CREATE UNIQUE INDEX Email_UNIQUE ON Users(Email);

DROP TRIGGER IF EXISTS Users_UpdateDate_Trigg;

CREATE TRIGGER Users_UpdateDate_Trigg AFTER UPDATE ON Users
  FOR EACH ROW
  BEGIN
    UPDATE Users SET UpdateDate = CURRENT_TIMESTAMP WHERE Id = old.Id;
  END;

-- -----------------------------------------------------
-- Table Roles
-- -----------------------------------------------------
DROP TABLE IF EXISTS Roles ;

CREATE TABLE IF NOT EXISTS Roles (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Name VARCHAR(45) NOT NULL,
  Active TINYINT NOT NULL DEFAULT 1,
  CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);

DROP INDEX IF EXISTS Name_UNIQUE;

CREATE UNIQUE INDEX Name_UNIQUE ON Roles(Name);

DROP TRIGGER IF EXISTS Roles_UpdateDate_Trigg;

CREATE TRIGGER Roles_UpdateDate_Trigg AFTER UPDATE ON Roles
  FOR EACH ROW
  BEGIN
    UPDATE Roles SET UpdateDate = CURRENT_TIMESTAMP WHERE Id = old.Id;
  END;


-- -----------------------------------------------------
-- Table Users_has_Roles
-- -----------------------------------------------------
DROP TABLE IF EXISTS Users_has_Roles ;

CREATE TABLE IF NOT EXISTS Users_has_Roles (
  Users_Id INT NOT NULL,
  Roles_Id INT NOT NULL,
  CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Users_Id, Roles_Id),
  FOREIGN KEY (Users_Id) REFERENCES Users (Id),
  FOREIGN KEY (Roles_Id) REFERENCES Roles (Id)
);

DROP TRIGGER IF EXISTS Users_has_Roles_UpdateDate_Trigg;

CREATE TRIGGER Users_has_Roles_UpdateDate_Trigg AFTER UPDATE ON Users_has_Roles
  FOR EACH ROW
  BEGIN
    UPDATE Users_has_Roles SET UpdateDate = CURRENT_TIMESTAMP WHERE Id = old.Id;
  END;


-- -----------------------------------------------------
-- Initial data
-- -----------------------------------------------------
BEGIN TRANSACTION;
    INSERT INTO Roles (Id, Name) VALUES (1, 'Admin');
    INSERT INTO Roles (Id, Name) VALUES (2, 'View');
    INSERT INTO Users (Id, Name, Email, Password) VALUES (1, 'Admin', 'admin@admin.new','$2a$10$D1GqqBSu6Yb4z7OHGdd2T.r0aYPF/TCKakte8PHlEjMdnnm2HOPJe');
    INSERT INTO Users_has_Roles (Users_Id, Roles_Id) VALUES (1,1);
COMMIT;