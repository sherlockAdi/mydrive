-- ========================
-- MASTER TABLES (DOC_M_)
-- ========================

-- Frequency Master
CREATE TABLE DOC_M_Frequency
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(10) UNIQUE NOT NULL,
    name NVARCHAR(50) NOT NULL
);

-- Category Master (Tax, TDS, etc.)
CREATE TABLE DOC_M_Category
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(20) UNIQUE NOT NULL,
    name NVARCHAR(100) NOT NULL,
    frequencyId INT NOT NULL FOREIGN KEY REFERENCES DOC_M_Frequency(id),
    description NVARCHAR(255)
);

-- SubType Master (Form 16, ITR etc.)
CREATE TABLE DOC_M_SubType
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    categoryId INT NOT NULL FOREIGN KEY REFERENCES DOC_M_Category(id),
    name NVARCHAR(100) NOT NULL
);

-- Period Master (Q1 2024, Mar 2025 etc.)
CREATE TABLE DOC_M_Period
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    categoryId INT NOT NULL FOREIGN KEY REFERENCES DOC_M_Category(id),
    label NVARCHAR(50) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL
);

-- Role Master
CREATE TABLE DOC_M_Role
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(20) UNIQUE NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255)
);

-- Permission Master
CREATE TABLE DOC_M_Permission
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    module NVARCHAR(100) NOT NULL,
    action NVARCHAR(50) NOT NULL
);

-- Department Master
CREATE TABLE DOC_M_Department
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    code NVARCHAR(20)
);

-- Designation Master
CREATE TABLE DOC_M_Designation
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    code NVARCHAR(20)
);

-- Status Master
CREATE TABLE DOC_M_Status
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(20),
    label NVARCHAR(50)
);

-- ============================
-- TRANSACTIONAL TABLES (DOC_T_)
-- ============================

-- Files Table
CREATE TABLE DOC_T_File
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    folderId INT NULL,
    ownerUid INT NOT NULL,
    -- ATM_usersdetails.uid
    type NVARCHAR(50),
    size BIGINT,
    description NVARCHAR(1000),
    priority NVARCHAR(20),
    storagePath NVARCHAR(500),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Folders Table
CREATE TABLE DOC_T_Folder
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    parentId INT NULL,
    ownerUid INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Documents Table
CREATE TABLE DOC_T_Document
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    fileId INT NOT NULL FOREIGN KEY REFERENCES DOC_T_File(id),
    subTypeId INT NOT NULL FOREIGN KEY REFERENCES DOC_M_SubType(id),
    periodId INT NOT NULL FOREIGN KEY REFERENCES DOC_M_Period(id),
    uploadedByUid INT NOT NULL,
    uploadedAt DATETIME DEFAULT GETDATE()
);

-- File Access Table
CREATE TABLE DOC_T_FileAccess
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fileId INT NOT NULL FOREIGN KEY REFERENCES DOC_T_File(id),
    accessType NVARCHAR(10),
    -- 'user', 'team', 'all'
    accessId INT,
    permission NVARCHAR(10),
    -- 'read', 'write'
    sharedByUid INT,
    sharedAt DATETIME DEFAULT GETDATE()
);

-- File Comments Table
CREATE TABLE DOC_T_FileComment
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fileId INT FOREIGN KEY REFERENCES DOC_T_File(id),
    commenterUid INT,
    comment NVARCHAR(1000),
    commentedAt DATETIME DEFAULT GETDATE()
);

-- File Tags Table
CREATE TABLE DOC_T_FileTag
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fileId INT FOREIGN KEY REFERENCES DOC_T_File(id),
    tag NVARCHAR(100)
);

-- Task Table
CREATE TABLE DOC_T_Task
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255),
    assignedToUid INT,
    relatedFileId INT FOREIGN KEY REFERENCES DOC_T_File(id),
    dueDate DATE,
    status NVARCHAR(50),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Task Logs Table
CREATE TABLE DOC_T_TaskLog
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    taskId INT FOREIGN KEY REFERENCES DOC_T_Task(id),
    actionByUid INT,
    action NVARCHAR(255),
    timestamp DATETIME DEFAULT GETDATE()
);

-- ============================
-- RELATIONAL TABLES (DOC_R_)
-- ============================

-- App-Specific Users Table (linked via linkId to ATM_usersdetails.uid)
CREATE TABLE DOC_R_User
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    linkId INT NOT NULL,
    -- ATM_usersdetails.uid
    password NVARCHAR(255) NOT NULL,
    -- New encrypted password
    roleId INT FOREIGN KEY REFERENCES DOC_M_Role(id),
    status NVARCHAR(20) DEFAULT 'Active',
    createdAt DATETIME DEFAULT GETDATE()
);

-- Role ↔ Permission Mapping
CREATE TABLE DOC_R_RolePermission
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    roleId INT FOREIGN KEY REFERENCES DOC_M_Role(id),
    permissionId INT FOREIGN KEY REFERENCES DOC_M_Permission(id)
);

-- Team Master
CREATE TABLE DOC_R_Team
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(20),
    name NVARCHAR(100),
    description NVARCHAR(255)
);

-- Team Members
CREATE TABLE DOC_R_TeamMember
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    teamId INT FOREIGN KEY REFERENCES DOC_R_Team(id),
    memberUid INT
    -- ATM_usersdetails.uid
);

-- Audit Log
CREATE TABLE DOC_R_AuditLog
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    uid INT,
    action NVARCHAR(255),
    module NVARCHAR(100),
    refId INT,
    timestamp DATETIME DEFAULT GETDATE()
);

-- Notifications
CREATE TABLE DOC_R_Notification
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    uid INT,
    message NVARCHAR(255),
    isRead BIT DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Settings
CREATE TABLE DOC_R_Setting
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    skey NVARCHAR(100),
    svalue NVARCHAR(255)
);


CREATE TABLE ATM_usersdetails
(
    uid INT PRIMARY KEY,
    pwd NVARCHAR(255),
    useremail NVARCHAR(255),
    rollid INT,
    status NVARCHAR(20),
    archive BIT,
    leavetypeid INT,
    WFHType NVARCHAR(50)
);

CREATE TABLE Atm_M_Employee88
(
    id INT PRIMARY KEY,
    firstname NVARCHAR(100),
    lastname NVARCHAR(100)
);


-- 👤 Insert into simulated ATM_usersdetails
INSERT INTO ATM_usersdetails
    (uid, useremail, pwd, rollid, status, archive, leavetypeid, WFHType)
VALUES
    (1001, 'aditya@example.com', '', 1, 'Active', 0, NULL, NULL);

-- 👤 Insert into Atm_M_Employee88
INSERT INTO Atm_M_Employee88
    (id, firstname, lastname)
VALUES
    (1001, 'Aditya', 'Dwivedi');

    INSERT INTO DOC_M_Role
    ( name, description)
VALUES
    ( 'Admin', 'Super admin with full access');


INSERT INTO DOC_M_Role
    ( name, description)
VALUES
    ( 'User', 'Regular user with limited access');


-- 🔐 Insert into DOC_R_User (hashed 'admin@123')
INSERT INTO DOC_R_User
    (linkId, password, roleId, status)
VALUES
    (
        1001,
        '$2b$10$bnU2eUp27KHweaPi4VkY8u1ET28STk97VewSo8Bp8KGuFR0BjOUdu', -- bcrypt('admin@123')
        2,
        'Active'
);


-- Insert Admin Role
INSERT INTO DOC_M_Role
    (code, name, description)
VALUES
    ('admin', 'admin', 'Super admin with full access');

-- Insert Standard User Role
INSERT INTO DOC_M_Role
    (code, name, description)
VALUES
    ('user', 'user', 'Basic access user for uploading and viewing documents');


SELECT    * FROM    DOC_M_Role;




-- Insert Frequency if not already present
INSERT INTO DOC_M_Frequency
    (code, name)
VALUES
    ('YEAR', 'Yearly');


    -- Get Frequency ID for Yearly
DECLARE @frequencyId INT;
SELECT @frequencyId = id
FROM DOC_M_Frequency
WHERE code = 'YEAR';

-- Insert Category

INSERT INTO DOC_M_Category
    (code, name, frequencyId, description)
VALUES
    ('CAT_TAX', 'Tax', @frequencyId, 'Tax Related Documents');

-- Get Category ID for Tax
DECLARE @categoryId INT;
SELECT @categoryId = id
FROM DOC_M_Category
WHERE code = 'CAT_TAX';

-- Insert SubTypes
INSERT INTO DOC_M_SubType
    (categoryId, name)
VALUES
    (@categoryId, 'Computation'),
    (@categoryId, 'ITR-V'),
    (@categoryId, 'Fixed XML file'),
    (@categoryId, 'CPS');


INSERT INTO DOC_M_Period
    (categoryId, label, startDate, endDate)
VALUES
    (1, '2022-23', '2022-04-01', '2023-03-31'),
    (1, '2023-24', '2023-04-01', '2024-03-31'),
    (1, '2024-25', '2024-04-01', '2025-03-31'),
    (1, '2025-26', '2025-04-01', '2026-03-31'),
    (1, '2026-27', '2026-04-01', '2027-03-31');


SELECT TOP 1
    *
FROM ATM_usersdetails