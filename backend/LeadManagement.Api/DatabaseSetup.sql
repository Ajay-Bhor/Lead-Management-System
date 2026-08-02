-- Create the Database
CREATE DATABASE LeadManagementDb;
GO

USE LeadManagementDb;
GO

-- Create Users Table
CREATE TABLE Users (
    Id NVARCHAR(450) PRIMARY KEY,
    Username NVARCHAR(MAX) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL
);
GO

-- Create Leads Table
CREATE TABLE Leads (
    Id NVARCHAR(450) PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Email NVARCHAR(MAX) NOT NULL,
    Phone NVARCHAR(MAX) NULL,
    Company NVARCHAR(MAX) NULL,
    Status NVARCHAR(MAX) NOT NULL,
    Source NVARCHAR(MAX) NOT NULL,
    Date DATETIME2 NOT NULL
);
GO

-- Create Tasks Table
CREATE TABLE Tasks (
    Id NVARCHAR(450) PRIMARY KEY,
    Title NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(MAX) NOT NULL,
    DueDate DATETIME2 NOT NULL,
    LeadId NVARCHAR(MAX) NULL,
    IsCompleted BIT NOT NULL,
    CreatedAt DATETIME2 NOT NULL
);
GO

-- Insert default Admin User (Username: admin, Password: password123)
-- In production, this would be a hashed password.
INSERT INTO Users (Id, Username, PasswordHash, Role, Name)
VALUES (NEWID(), 'admin', 'password123', 'Admin', 'System Administrator');
GO
