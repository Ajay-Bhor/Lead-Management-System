-- ===================================================
-- Lead Management System - SQL Server Setup Script
-- ===================================================

-- 1. Create the Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'LeadManagementDb')
BEGIN
    CREATE DATABASE LeadManagementDb;
END
GO

USE LeadManagementDb;
GO

-- 2. Create Users Table
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE Users (
        Id NVARCHAR(450) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Role NVARCHAR(50) NOT NULL, -- Admin, Sales Manager, Sales Executive
        Name NVARCHAR(200) NOT NULL
    );
END
GO

-- 3. Create Leads Table
IF OBJECT_ID(N'dbo.Leads', N'U') IS NULL
BEGIN
    CREATE TABLE Leads (
        Id NVARCHAR(450) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) NOT NULL,
        Phone NVARCHAR(50) NULL,
        Company NVARCHAR(200) NULL,
        Status NVARCHAR(50) NOT NULL, -- New, Contacted, Qualified, Proposal Sent, Won, Lost
        Source NVARCHAR(50) NOT NULL, -- Website forms, Social media, Email campaigns, Phone calls, Manual entry
        Date DATETIME2 NOT NULL,
        DealValue DECIMAL(18,2) NOT NULL DEFAULT 0,
        Score INT NOT NULL DEFAULT 50,
        Priority NVARCHAR(20) NOT NULL DEFAULT 'Warm', -- Hot, Warm, Cold
        AssignedTo NVARCHAR(200) NOT NULL DEFAULT 'Ajay Bhor',
        Territory NVARCHAR(100) NULL DEFAULT 'Maharashtra',
        Notes NVARCHAR(MAX) NULL
    );
END
GO

-- 4. Create ActivityLogs Table (Communication History)
IF OBJECT_ID(N'dbo.ActivityLogs', N'U') IS NULL
BEGIN
    CREATE TABLE ActivityLogs (
        Id NVARCHAR(450) PRIMARY KEY,
        LeadId NVARCHAR(450) NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- Call, Meeting, Email, Note, StatusChange
        Title NVARCHAR(300) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Outcome NVARCHAR(300) NULL,
        Date DATETIME2 NOT NULL,
        LoggedBy NVARCHAR(200) NOT NULL,
        CONSTRAINT FK_ActivityLogs_Leads FOREIGN KEY (LeadId) REFERENCES Leads(Id) ON DELETE CASCADE
    );
END
GO

-- 5. Create Tasks Table (Follow-ups, Meetings, Calls)
IF OBJECT_ID(N'dbo.Tasks', N'U') IS NULL
BEGIN
    CREATE TABLE Tasks (
        Id NVARCHAR(450) PRIMARY KEY,
        Title NVARCHAR(300) NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- Follow-up, Meeting, Call
        DueDate DATETIME2 NOT NULL,
        LeadId NVARCHAR(450) NULL,
        IsCompleted BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL
    );
END
GO

-- 6. Seed Default Users with Roles
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Id, Username, PasswordHash, Role, Name)
    VALUES (NEWID(), 'admin', 'admin', 'Admin', 'Ajay Bhor');
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'sarah')
BEGIN
    INSERT INTO Users (Id, Username, PasswordHash, Role, Name)
    VALUES (NEWID(), 'sarah', 'password123', 'Sales Manager', 'Sarah Smith');
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'vikram')
BEGIN
    INSERT INTO Users (Id, Username, PasswordHash, Role, Name)
    VALUES (NEWID(), 'vikram', 'password123', 'Sales Executive', 'Vikram Joshi');
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'pooja')
BEGIN
    INSERT INTO Users (Id, Username, PasswordHash, Role, Name)
    VALUES (NEWID(), 'pooja', 'password123', 'Sales Executive', 'Pooja Kulkarni');
END
GO
