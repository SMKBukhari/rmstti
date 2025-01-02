-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `appraisals`;

CREATE TABLE `appraisals` (
  `AppraisalID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `AppraisalDate` date DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL,
  `Comments` text DEFAULT NULL,
  PRIMARY KEY (`AppraisalID`),
  KEY `FK_Employee_Appraisals` (`EmployeeID`),
  CONSTRAINT `FK_Employee_Appraisals` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `attendance`;

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `TimeIn` time DEFAULT NULL,
  `TimeOut` time DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Attendance_ibfk_1` (`EmployeeID`),
  CONSTRAINT `Attendance_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attendance` VALUES (1,61,'2024-02-15','13:36:04','13:36:15','Present');
INSERT INTO `attendance` VALUES (2,52,'2024-02-16','12:18:43',NULL,'Present');
INSERT INTO `attendance` VALUES (3,52,'2024-02-28','08:35:02',NULL,'Present');
INSERT INTO `attendance` VALUES (4,61,'2024-03-01','10:11:45','10:15:25','Present');
INSERT INTO `attendance` VALUES (5,61,'2024-03-01','10:15:29','10:15:35','Present');
INSERT INTO `attendance` VALUES (6,52,'2024-03-02','08:43:21',NULL,'Present');
INSERT INTO `attendance` VALUES (7,52,'2024-03-02','13:10:34','13:10:39','Present');
INSERT INTO `attendance` VALUES (8,61,'2024-03-02','13:10:36',NULL,'Present');
INSERT INTO `attendance` VALUES (9,61,'2024-03-02','19:46:06','19:46:18','Present');
INSERT INTO `attendance` VALUES (10,61,'2024-03-04','05:44:16',NULL,'Present');
INSERT INTO `attendance` VALUES (11,61,'2024-03-04','10:45:53','10:45:57','Present');
INSERT INTO `attendance` VALUES (12,52,'2024-03-05','04:43:45',NULL,'Present');
INSERT INTO `attendance` VALUES (13,61,'2024-03-05','07:30:50',NULL,'Present');
INSERT INTO `attendance` VALUES (14,52,'2024-03-05','11:58:25','11:58:27','Present');
INSERT INTO `attendance` VALUES (15,52,'2024-03-08','04:36:55',NULL,'Present');
INSERT INTO `attendance` VALUES (16,52,'2024-03-08','12:07:38','12:07:40','Present');
INSERT INTO `attendance` VALUES (17,52,'2024-03-11','04:35:45',NULL,'Present');
INSERT INTO `attendance` VALUES (18,10,'2024-03-19','06:41:55','06:42:45','Present');
INSERT INTO `attendance` VALUES (19,88,'2024-03-20','06:01:53','06:02:11','Present');
INSERT INTO `attendance` VALUES (20,52,'2024-03-20','09:08:36',NULL,'Present');
INSERT INTO `attendance` VALUES (21,60,'2024-03-20','14:24:11','14:24:28','Present');
INSERT INTO `attendance` VALUES (22,88,'2024-03-21','07:25:42',NULL,'Present');
INSERT INTO `attendance` VALUES (23,88,'2024-03-22','05:13:18',NULL,'Present');
INSERT INTO `attendance` VALUES (24,50,'2024-03-22','09:23:19',NULL,'Present');
INSERT INTO `attendance` VALUES (25,88,'2024-03-24','15:04:50',NULL,'Present');
INSERT INTO `attendance` VALUES (26,52,'2024-03-26','04:24:39',NULL,'Present');
INSERT INTO `attendance` VALUES (27,88,'2024-03-28','05:36:02',NULL,'Present');
INSERT INTO `attendance` VALUES (28,88,'2024-03-28','12:22:27','12:22:40','Present');
INSERT INTO `attendance` VALUES (29,88,'2024-03-28','12:30:43','12:30:48','Present');
INSERT INTO `attendance` VALUES (30,88,'2024-03-28','23:28:31','23:31:41','Present');
INSERT INTO `attendance` VALUES (31,88,'2024-03-28','23:38:05','23:38:14','Present');
INSERT INTO `attendance` VALUES (32,88,'2024-03-29','06:08:07','06:08:17','Present');
INSERT INTO `attendance` VALUES (33,88,'2024-04-02','06:01:19','06:01:29','Present');
INSERT INTO `attendance` VALUES (34,88,'2024-04-02','06:01:34','06:01:40','Present');
INSERT INTO `attendance` VALUES (35,88,'2024-04-02','09:13:02','09:13:11','Present');
INSERT INTO `attendance` VALUES (36,88,'2024-04-04','05:36:49','05:36:57','Present');
INSERT INTO `attendance` VALUES (37,88,'2024-04-05','09:00:13','09:00:18','Present');
INSERT INTO `attendance` VALUES (38,10,'2024-04-05','12:10:51','12:11:08','Present');
INSERT INTO `attendance` VALUES (39,5,'2024-04-06','12:45:31','12:49:59','Present');
INSERT INTO `attendance` VALUES (40,5,'2024-04-06','12:50:06','12:50:14','Present');
INSERT INTO `attendance` VALUES (41,5,'2024-04-06','13:00:04','13:00:15','Present');
INSERT INTO `attendance` VALUES (42,10,'2024-04-07','13:08:53','13:09:01','Present');
INSERT INTO `attendance` VALUES (43,88,'2024-04-07','13:38:09','13:38:27','Present');
INSERT INTO `attendance` VALUES (44,88,'2024-04-07','13:38:32',NULL,'Present');
INSERT INTO `attendance` VALUES (45,88,'2024-04-18','11:59:53','12:00:02','Present');
INSERT INTO `attendance` VALUES (46,97,'2024-09-11','09:11:51',NULL,'Present');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `department`;

CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `manager_id` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `department` VALUES (13,'IT',16,'2024-03-01 09:31:08');
INSERT INTO `department` VALUES (18,'Print Magazine',22,'2024-02-13 07:54:46');
INSERT INTO `department` VALUES (19,'Website',23,'2024-02-13 07:57:15');
INSERT INTO `department` VALUES (20,'Research',24,'2024-02-13 11:56:51');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `employeecv`;

CREATE TABLE `employeecv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `uploadCV` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EmployeeID` (`EmployeeID`),
  CONSTRAINT `employeecv_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `employeecv` VALUES (33,92,'cv/haseeb khan cv.pdf');
INSERT INTO `employeecv` VALUES (34,93,'cv/Mohsin Ali-CV.pdf');
INSERT INTO `employeecv` VALUES (35,95,'cv/Hina Urooj CV.pdf');
INSERT INTO `employeecv` VALUES (36,96,'cv/Copy of Rabia Ali CV Resume.pdf.pdf');
INSERT INTO `employeecv` VALUES (37,97,'cv/Syed Muhammad Kaif Bukhari CV.pdf');
INSERT INTO `employeecv` VALUES (38,100,'cv/Saad Jadoon - CV (New) (1).docx.pdf');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` text DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `HireDate` date DEFAULT NULL,
  `Position` varchar(50) DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `img` text DEFAULT NULL,
  `admin_approved` enum('approved','reject') DEFAULT NULL,
  `interview` text DEFAULT NULL,
  `company` text DEFAULT NULL,
  `designation` text DEFAULT NULL,
  `jobTitle` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `yearFromTo` text DEFAULT NULL,
  `degreeTitle` text DEFAULT NULL,
  `marksOrCGPA` text DEFAULT NULL,
  `yearOfDegree` text DEFAULT NULL,
  `country` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `type` text DEFAULT NULL,
  `qualification` text DEFAULT NULL,
  `cv_department` text DEFAULT NULL,
  `offer_letter` enum('hide','show') DEFAULT 'hide',
  `offer_letter_response_employee` enum('no','yes') NOT NULL,
  `html_resignation_letter` text DEFAULT NULL,
  `warning_letter_design_details` text DEFAULT NULL,
  `serial_no` int(11) DEFAULT NULL,
  `employement_status` enum('Active','Former','','') NOT NULL,
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `employees` VALUES (5,'Waqar','Mehmood','1996-10-25','male','03061029836','waqarrecords836@gmail.com','2020-06-09','Ofiice Boy',28600.00,'HOUSE # 66  NEAR ANWAR E MUSTAFA MOSQUE MOHALA MARRIR HASSAN STOP RAWALPINDI','12345678','assets/images/employee/660b01eec08c3_images (1).jpeg','approved','2024-02-01','company','Ofiice Boy','Reading, Writing','Reading, Writing','2020-2022','BSCS','3.5','2024','Pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,'<p>Test Warning</p>\r\n',1,'Active');
INSERT INTO `employees` VALUES (6,'Arsalan','Chaudry','1994-02-23','male','03445605446','ro@tti.org.pk','2020-06-10','Research Associate',50000.00,'House # 904 Street # 90 Sector I-8/4, Islamabad.','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','Research Associate','Reading, Writing','Reading, Writing','2020-2022','BSCS','3.5','2024','Pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,2,'Former');
INSERT INTO `employees` VALUES (7,'Muhammad Abdullah',' Nasir','1998-03-12','female','03095263016','N/A','2020-06-20','Administrator',25000.00,'Upper Chatar, Sund Gali, Ward #3, Muzaffarabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager','Reading, Writing','Reading, Writing','2020-2022','BSCS','3.5','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,3,'Former');
INSERT INTO `employees` VALUES (8,'Syed','Hussain Shah','1995-01-19','male','03335260313','hussainshah215@gmail.com','2020-07-06','Research Manager',50000.00,'House No 65, Stree No115, G13/1 Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,'',4,'Former');
INSERT INTO `employees` VALUES (10,'Hamza','Forooq Habib','1971-11-15','male','03212432160','editor@tti.org.pk','2020-08-17','Editor',80000.00,'House # 164, Street # 91, Sector I-8/1, Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,NULL,5,'Former');
INSERT INTO `employees` VALUES (11,'Amna','Shoaib','0001-01-01','female','03218137929','N/A','2020-08-17','Intern',20000.00,'HMC Taxila','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,6,'Former');
INSERT INTO `employees` VALUES (12,'Maha','Shoaib','1996-03-28','female','03335439819','N/A','2020-02-18','Research Associate',25000.00,'House # 874, Street # 86 Sector I-8/1 Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,7,'Former');
INSERT INTO `employees` VALUES (13,'Palwasha','Khattak','1994-04-14','female','03475000901','palwasha.khattak@tti.org.pk','2020-08-17','Correspondent',45000.00,'Block 14D, Flat# 4 Category 4, I-8/1 Islamabad.','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,NULL,8,'Former');
INSERT INTO `employees` VALUES (14,'Ayesha','Javaid','1997-04-24','female','03005508590','ayeshajavaid97@hotmail.com','2020-09-23','Research Associate',50000.00,'Street 55, house 241-c, i-8/3, Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,9,'Former');
INSERT INTO `employees` VALUES (15,'Mishal','Nawaz','1998-10-15','female','03161548279','receptionost@tti.org.pk','2020-09-22','Receptionist',22000.00,'House # 4, Street # 8c, Thandapani Fedral Town Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,10,'Former');
INSERT INTO `employees` VALUES (16,'Oroba','Tasnim','1996-11-02','female','03318859438','oroba.tasnim@tti.org.pk','2020-10-01','Research Associate',30000.00,'House 223, Margalla Road, F-10/3, Islamabad','12345678','assets/images/employee/1161142924.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,11,'Former');
INSERT INTO `employees` VALUES (17,'Azka','Gouher','1992-08-16','female','03335788840','N/A','2020-10-01','Sub Editor',30000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,12,'Former');
INSERT INTO `employees` VALUES (18,'Irfan','Ali','1995-02-02','male','03459908108','irfanawku@gmail.com','2020-10-05','Administrator',40000.00,'Seen Lasht Chitral T/H &Distt Chitral','12345678','assets/images/employee/1746799917.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,13,'Former');
INSERT INTO `employees` VALUES (19,'Fayaz','Soomro','2024-02-06','male','03000000000','fayazsoomro@gmail.com','2024-02-06','I.T Manager',0.00,'test','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,14,'Former');
INSERT INTO `employees` VALUES (20,'Shahid','Rasheed','0001-01-01','male','03225318157','N/A','2024-02-06','Tax Consultant',15000.00,'Soan Gardens Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,15,'Active');
INSERT INTO `employees` VALUES (21,'Saleem','Masih','0001-01-01','male','N/A','N/A','2020-06-09','Janitor',8000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,16,'Former');
INSERT INTO `employees` VALUES (22,'Syed','Jeree Ullah','1993-08-01','male','03365994509','jsleo10@gmail.com','2020-12-01','Research Associate',30000.00,'House # 65, Street # 115, Sector G-13/1 Islamabad','12345678','assets/images/employee/619953215.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,17,'Former');
INSERT INTO `employees` VALUES (23,'Haleema','Aurangzeb Abbasi','0001-01-01','female','03365311136','N/A','2020-12-03','Intern',10000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,18,'Former');
INSERT INTO `employees` VALUES (24,'Symrun','Razzaq','0001-01-01','female','03338553536','N/A','2021-02-02','Intern',10000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,19,'Former');
INSERT INTO `employees` VALUES (25,'Mamoona','Khan','0001-01-01','female','03368838561','N/A','2021-02-02','Intern',10000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,20,'Former');
INSERT INTO `employees` VALUES (26,'Ahmed','Mukhtar ','1973-04-01','male','03215369296','ahmedmukhtarpk@gmail.com','2021-02-15','Sub Editor',60000.00,'House No 88, Street 44, F/10-4 Islamabad','12345678','assets/images/employee/1583673143.jpg','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,21,'Former');
INSERT INTO `employees` VALUES (27,'Tousif','Ali Shah','1989-03-15','male','03363548813','ali.tousif@gmail.com','2021-05-01','Content Writer',25000.00,'MPhil Hostel # 4 Room # 1, Quaid-I-Azam University Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,22,'Former');
INSERT INTO `employees` VALUES (28,'Gohar','Imdad ','1997-01-02','female','03215944307','gohatimdad720@gmail.com','2021-05-01','Content Writer',40000.00,'House # 1619, Main Double Road I-10/1','12345678','assets/images/employee/1393653571.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,23,'Former');
INSERT INTO `employees` VALUES (30,'Zainab','Umer','2001-08-06','female','03368856775','zainabumer2001@gmail.com','2021-08-02','Social Media Handler',25000.00,'Media town, House No 43, street no 19, Block A.','12345678','assets/images/employee/859343844.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,24,'Former');
INSERT INTO `employees` VALUES (31,'Aimen','Bukhari','1998-06-08','female','03350929786','aimen_bukhari@outlook.com','2022-01-03','Content Writer',35000.00,'Bukhari House 4 near MCD Office Dina Districtt Jhelum','12345678','assets/images/employee/596817903.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,25,'Former');
INSERT INTO `employees` VALUES (33,'Ambreen','Tabassum','1992-02-14','female','03325328048','ambermaliknustian@gmail.com','2022-01-03','Research Associate ',60000.00,'House No 418A, Stree No 19, Sanghar Town near Fizaya Colony Rawalpindi','12345678','assets/images/employee/1155608850.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,26,'Former');
INSERT INTO `employees` VALUES (34,'Pavan','Manzoor','1996-03-22','female','03319370410','pavan.manzoor@outlook.com','2022-01-03','Business Development Officer',45000.00,'House No 166, Stree No: 93, G11/3 Islamabad','12345678','assets/images/employee/2108657476.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,27,'Former');
INSERT INTO `employees` VALUES (35,'Arsim','Tariq','1999-12-23','male','03330359337','arsimch9337@gmail.com','2022-01-03','Junior Research Associate',45000.00,'House#p-1251, St# 14, Mansoorbad, Faisalabad','12345678','assets/images/employee/1849545636.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,28,'Former');
INSERT INTO `employees` VALUES (36,'Shahmir','Niazi','1998-12-22','male','03455999904','shahmirniazi1998@gmail.com','2021-12-24','Content Writer',25000.00,'House 6, Street 19, Sector B, DHA Phase 5, Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,29,'Former');
INSERT INTO `employees` VALUES (37,'Adeena','Tahir','1998-06-06','female','03122823514','adeenatahir98@gmail.com','2022-02-01','Research Associate ',50000.00,'House No 83, Stree No 29, I-9/1, Islamabad, Postal Code: 44000','12345678','assets/images/employee/1254006208.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,30,'Former');
INSERT INTO `employees` VALUES (38,'Zamir A','Noushahi','0001-01-01','male','03214006247','  seniormarketingmanager@tti.org.pk','2022-05-09','SENIOR MARKETING MANAGER',50000.00,'691 Nargis Block Allama Iqbal Town Lahore','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,31,'Former');
INSERT INTO `employees` VALUES (39,'Mahnur','Mehfooz','1998-08-18','female','03095257376','mahymehfooz@gmail.com','2022-06-01','Content Writer',45000.00,'House no p-80, kot abdi, jhang road, gojra','12345678','assets/images/employee/500074930.jpeg','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,32,'Former');
INSERT INTO `employees` VALUES (40,'Syed Ali','Abbas','1996-01-12','male','03095257376','syedaliabbas2469@gmail.com','2022-06-01','Content Writer',45000.00,'Al-Syed Street Near Afzal Market G.T Road Haripur','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,33,'Former');
INSERT INTO `employees` VALUES (41,'Shah','Muhammad','1993-04-08','male','03153428889','shanistaan@gmail.com','2022-06-05','Research Associate',50000.00,'House# 70, Street 94, I-8/4, Islamabad','12345678','assets/images/employee/421662323.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,34,'Former');
INSERT INTO `employees` VALUES (42,'Rabia','Bano','1997-02-05','female','03130595446','rabiaaman524@gmail.com','2022-06-14','JUNIOR RESEARCH ASSOCIATE',35000.00,'Nizarabad, dak khana khas, danyore, tehsil and district Gilgit, GilgitBaltistan','12345678','assets/images/employee/1909489969.jpg','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,35,'Former');
INSERT INTO `employees` VALUES (43,'Wardah','Rafique','1990-04-17','female','03315123424','wardahrafique4@gmail.com','2022-07-18','Research manager',100000.00,'House no  DK 61/20 Usman Ghani Lane Street no 1  Bilal Colony Shamsabad.','12345678','assets/images/employee/1128817883.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,36,'Active');
INSERT INTO `employees` VALUES (44,'Neha','Ayub','1999-03-23','female','03319112170','nehaayub987@gmail.com','2023-09-05','Content Writer',45000.00,'Street#55, block#71, Flat#1, G-9/4 , Peshawar mor, Islamabad','12345678','assets/images/employee/402590720.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,37,'Former');
INSERT INTO `employees` VALUES (45,'Mohsin','Khan','0001-01-01','male','03161586771','N/A','0001-01-01','Janitor',8000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,38,'Former');
INSERT INTO `employees` VALUES (46,'Sara','Tayyab','0001-01-01','female','03015615159','intern@tti.org.pk','2023-02-02','Intern',10000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,39,'Former');
INSERT INTO `employees` VALUES (47,'Zahra Sikandar','Aziz','1984-02-01','female','03331541445','zahrasikandar.24@gmail.com','2022-12-07','Content Writer',50000.00,'H.No. 624, Street 24, PHA, Park Enclave  Islamabad','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,40,'Former');
INSERT INTO `employees` VALUES (48,'Natasha','Urooj','1995-11-16','female','03347677888','natashaurooj8@gmail.com','2023-03-01','Finance Officer',40000.00,'Model town street no 8A house no 2 HMC road Taxila','12345678','assets/images/employee/1267522670.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,41,'Active');
INSERT INTO `employees` VALUES (49,'Hammad ','Hassan ','2024-02-06','male','03224245650','hammad@gmail.com','2024-02-06','OFFICE Boy',0.00,'12345678','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,42,'Active');
INSERT INTO `employees` VALUES (50,'Shahroz ','Durrani','1993-09-26','male','03328383130','shah123793@gmail.com','2023-04-17','Regional Coordinator',50000.00,'House No wwb-60, Block 01 Near God Masjid Satellite town Quetta  ','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,'<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><strong><span style=\"font-size:12.0pt\">Show Cause Notice Regarding Failure to Respond to Query, Incomplete Project Questionnaires, and Lack of Response to CEO&#39;s Call on March 22, 2024</span></strong></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Dear Mr. Shahroz Durrani,</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">I hope this message finds you well. <span style=\"background-color:white\"><span style=\"color:#0d0d0d\">This notice serves as a formal complaint from the Research Departmen</span></span><span style=\"background-color:white\"><span style=\"color:#0d0d0d\">t</span></span>, I am writing to address a critical issue that occurred on March 22, 2024, during office hours, concerning your availability, responsiveness, and adherence to professional standards.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">On the aforementioned date, there was a query within our group that necessitated your input. Unfortunately, you were not available to provide the required information, resulting in a significant delay in resolving the query. This lack of timely response directly impacted our team&#39;s productivity and ability to fulfill our responsibilities effectively.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Additionally, it has come to my attention that several project questionnaires were not completed as required. Most of them were only partially complete and not fully filled out. Despite this incomplete status, payments were made to the respective individuals. This discrepancy raises concerns about the thoroughness and accuracy of our project management processes.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Furthermore, it has been brought to our notice that you did not respond to a call from our Chief Executive Officer (CEO). As a key member of our organization, it is imperative that you prioritize communication from senior management, regardless of the nature of the matter at hand. Your failure to respond to the CEO&#39;s call reflects poorly on your professionalism and commitment to your role within the company.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">As per our company policy, you are required to respond to this notice and provide a defense of your actions. Please reply to this notice through the company portal within the stipulated timeframe. Failure to respond within the specified period may result in further disciplinary action being taken.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">I trust that you understand the seriousness of these matters and the implications they carry for our team performance and reputation. I urge you to take these issues seriously and provide a satisfactory explanation for your lack of availability, responsiveness, and incomplete project questionnaires.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Your prompt attention to these matters and your cooperation in resolving them will be greatly appreciated.</span></span></p>\r\n\r\n<p style=\"text-align:justify\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Thank you for your understanding.</span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Sincerely,</span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">Aizaz Ullah</span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">HR Officer</span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\">The Truth International </span></span></p>\r\n',43,'Active');
INSERT INTO `employees` VALUES (51,'Ruedad','Haider','1999-10-24','male','03483012310','ruedadhaider@gmail.com','2023-06-01','Content Writer',50000.00,'Village Madaklasht Chitral KPK Pakistan','12345678','assets/images/employee/730223794.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Research','show','yes',NULL,NULL,44,'Former');
INSERT INTO `employees` VALUES (52,'Daniyal','Wali','2000-02-10','male','03412841200','daniyalwali2000@gmail.com','0001-01-01','Content Writer',45000.00,'Village Seenlast Chitral KPK Pakistan','12345678','assets/images/employee/1304072291.png','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,NULL,45,'Active');
INSERT INTO `employees` VALUES (53,'Saneela','Aslam','0001-01-01','female','03027922719','saneelaaslam@gmail.com','2023-07-10','Content Writer',45000.00,'12345678','12345678','assets/images/employee/1284716051.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,46,'Former');
INSERT INTO `employees` VALUES (54,'Romana','Afsheen','1997-03-04','female','03125370695','romana.awan01@gmail.com','2023-07-17','Content Writer',45000.00,'VPO Dulmial Tehsil Choa Saiden Shah District Chakwal','12345678','assets/images/employee/270410108.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,NULL,47,'Active');
INSERT INTO `employees` VALUES (55,'Roman','Ali','2024-02-06','male','03345668266','roman@gmail.com','2024-02-06','Videographer',0.00,'N/A','12345678','assets/images/employee/1305218189.jpeg','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','shorttime','test','IT Manager','show','yes',NULL,NULL,48,'Former');
INSERT INTO `employees` VALUES (56,'Mahnoor','Abid','0001-01-01','female','03316677807','N/A','2023-08-01','Presenter & Reacher',0.00,'N/A','12345678','assets/images/employee/124907105.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','shorttime','test','IT Manager','show','yes',NULL,NULL,49,'Former');
INSERT INTO `employees` VALUES (57,'Mehk','Saqib','0001-01-01','female','03235570317','N/A','2023-08-01','Anchor & Presenter',0.00,'N/A','12345678','assets/images/employee/620293528.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','shorttime','test','IT Manager','show','yes',NULL,NULL,50,'Active');
INSERT INTO `employees` VALUES (58,'Ayesha','Shaeban','2000-08-09','female','03032119044','ayeshashaeban2222@gmail.com	','2023-08-01','Presenter',0.00,'N/A','12345678','assets/images/employee/1835975491.jpeg','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','shorttime','test','IT Manager','show','yes',NULL,NULL,61,'Former');
INSERT INTO `employees` VALUES (59,'Aghzaz Ullah','Raj','2000-03-10','male','03409850810','ayzazullahraj@gmail.com','2023-08-01','Admin Officer',40000.00,'Village Saht Payeen P/O Drassun Mulkhow Upper Chitral','12345678','assets/images/employee/1278032471.jpeg','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,'<p>XYZ&nbsp; Warning</p>\r\n',62,'Active');
INSERT INTO `employees` VALUES (60,'Hasnain','Ahmad','1998-09-06','male','03129762032','hasnain.ahmad@tti.org.pk','2023-08-01','Research Associate ',60000.00,'Usman House Riaze Road, Jutial CANT Gilgit','12345678','assets/images/employee/189868265.jpeg','approved','2024-02-01','company','I.T Manager',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,'<p>Mr Hussnain,<br />\r\nYou are frequently repeating stories already published on The Truth International (TTI) website. It shows negligence on your part which is damaging the image of the organization. You are, therefore, warned to avoid repeating stories, otherwise, the organization will take action against you.</p>\r\n\r\n<p>Date 03/18/2024</p>\r\n',63,'Former');
INSERT INTO `employees` VALUES (61,'Kanwal','Munir','1999-07-08','female','03079132182','kanwal.munir@tti.org.pk','2024-02-06','Content Writer',45000.00,'N/A','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','OFFICE Boy',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','Website','show','yes',NULL,'<p style=\"text-align:center\"><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><strong><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Subject: Official Warning for Attendance Issues</span></span></strong></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Dear Kanwal Munir,</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">I hope you are well.</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">This letter serves as an official warning regarding your attendance record from September 1, 2023, to June 30, 2024. Our records indicate the following concerning patterns in your attendance:</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Days in office: 55</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Late arrivals: 41 (75%)</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Early departures: 12 (22%)</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Even though we allow a 15-minute grace period for being late, you have often arrived even later. This repeated behavior is disappointing and unacceptable. We value every employee and strive to treat everyone well, but your actions are not in line with our expectations.</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Starting July 1, 2024, we have updated our policy:</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><strong><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">&ldquo;Every three instances of late arrival or early departure will be considered as one unauthorized leave. This unauthorized leave will be marked as absent and will result in a one-day salary deduction&rdquo;</span></span></strong></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">If you continue to be late or leave early, we will have to take strict action. This could include further warnings, suspension, or even termination.</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">We hope you understand the seriousness of this issue and make the necessary changes. If you need help or have concerns, please let us know.</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Thank you for your immediate attention to this matter.</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Sincerely,</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Aizaz</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:11pt\"><span style=\"font-family:Calibri,sans-serif\"><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">HR Officer</span></span></span></span></p>\r\n\r\n<p><span style=\"font-size:14.0pt\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\">The Truth International</span></span></p>\r\n',64,'Active');
INSERT INTO `employees` VALUES (62,'Nimra','Atiq','2000-03-12','female','03331480307','nimraatiq@gmail.com','2023-11-08','Social Media Executive and Content Writer ',35000.00,'DD-104, St06, Gulshan Dadan khan Murree Road,  Rawalpindi Pakistan.','12345678','assets/images/employee/1069533573.webp','approved','2024-02-01','company','CEO',NULL,NULL,'2020-2022','BSCS','34','2024','pakistan','Islamabad','parmaent','test','IT Manager','show','yes',NULL,NULL,65,'Active');
INSERT INTO `employees` VALUES (87,'Zainab','Iftikhar','2001-11-13','female','03326555196','zainabimranmalik13@gmail.com','2023-11-01','Intern',20000.00,'Malik Atta Muhammad House , Street 4, Major Akram Shaheed Road , Jhelum','12345678','assets/images/employee/1647087538.jpg','approved',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'parmaent',NULL,'Research','hide','no',NULL,NULL,66,'Former');
INSERT INTO `employees` VALUES (88,'Ayeza','Areej','2001-06-16','female','03165940094','areejayeza10@gmail.com','2023-11-01','Intern',20000.00,'12345678','12345678','assets/images/employee/514612337.jpg','approved',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'parmaent',NULL,'Research','hide','no','<p>I Resign</p>\r\n',NULL,67,'Former');
INSERT INTO `employees` VALUES (89,'Tauheed','Zahra','1990-10-18','female','03008611572','tauheed.zahra@tti.org.pk','2024-03-01','Research Associate',75000.00,'12345678','12345678','assets/images/employee/65cb0813cd7ed_85BC815D-D696-4FFF-9719-2EF774A45864.jpeg','approved','2024-02-13','NCSW, Institute of social and cultural studies UOP, Quaid-i-Azam university, Unicef','NA','Research Associate/ Visiting lecturer','Specialized in Qualitative data analysis','2021- 2025','Ph.D Sociology','4','3rd','Pakistan','Islamabad','parmaent','Ph.D (in progress)','Research','hide','yes',NULL,NULL,68,'Former');
INSERT INTO `employees` VALUES (90,'Shehzil ','Abbasi','2001-09-19','female','03215382096','shehzil.abbasi@tti.org.pk','2024-02-20','Junior Research Associate',48000.00,'shehzil.abbasi@tti.org.pk','12345678','assets/images/employee/65cb44239c02f_IMG_0282.jpg','approved','2024-02-13','SSDO, Bahria Enclave, QAU','Research Intern, HR Intern, Assistant Research Associate ','Internships ','Research, communication, data analysis and presentation, public speaking, time management, critical thinking ','2019-2023','BS Sociology','3.83/4','2023','Pakistan','Islamabad','parmaent','BS Sociology','Research','hide','yes',NULL,NULL,69,'Active');
INSERT INTO `employees` VALUES (91,'Ayesha ','Shaeban','2000-08-09','female','03032119044','ayeshashaeban2222@gmail.com','2024-03-03','Content Writer',35000.00,NULL,'newspresenter','assets/images/employee/65cbcf94d4c3c_468DBF5E-8577-4B28-8555-ACFD0FDAB703.jpeg','approved','2024-02-14','The Truth International ','News presenter and researcher ','Anchor ','Social media management, content writing, production, news presenter, content creator ','2019-2023 ','Television Broadcasting and Digital Media ','3.02 ','4 years ','Pakistan ','Islamabad ','parmaent','Bachelors in Television Broadcasting and Digital Media ','Website','hide','yes',NULL,NULL,70,'Active');
INSERT INTO `employees` VALUES (92,'Haseeb  ','khan','1999-10-17','male','03027696403','niazihaseeb77@gmail.com',NULL,NULL,NULL,NULL,'haseeb7890','assets/images/employee/660a63abb243a_Screenshot_20240401_111438.jpg','reject',NULL,'Dar e insaniyat','Campus ambassador','Social worker','Cultural Sensitivity, communication, critical thinking, research skills, ethical awareness, problem solving','2019 /2023','Bachlers in Anthropology','2.5/4.0','2023','Pakistan','Mianwali',NULL,'Bachlers','Research','hide','no',NULL,NULL,NULL,'Former');
INSERT INTO `employees` VALUES (93,'Mohsin','Ali','1993-03-03','male','03009837027','rme.mohsinali@gmail.com',NULL,NULL,NULL,NULL,'Ma@90491724','assets/images/employee/667c0ab7e38e5_DSC_37294.jpg','reject',NULL,'Institute of Urbanism','Program Lead','Program Assistant','Research, Project Coordination, Writing ','2022-24','MPhil International Relations','3.5','2024','Pakistan','Islamabad',NULL,'MPhil','Research','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (94,'Qurat-ul-ain ','Rehan','2002-11-08','female','0332510228','aineerehan15@gmail.com',NULL,NULL,NULL,NULL,'jobjob','assets/images/employee/6683a483900b9_Snapchat-1805426642.jpg','reject',NULL,'Islamabad','Assistant counselor ','Counsellor ','Excel, basic QuickBooks, quick learner, time management','2022 - ongoing ','ACCA','85%','Started in 2022','Pakistan','Islamabad',NULL,'ACCA in progress ','Research','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (95,'Hina','Kashif','2024-11-22','female','03145782085','hinakashif0913@gmail.com','2024-07-31','Content Writer',45000.00,NULL,'sherryhuzaifazavo','assets/images/employee/6694ca544ba61_IMG_20240620_212958.jpg','approved','2024-07-15','AEO Islamabad ','Interlocutor ','OET','Excellent communication skills','2018-2021','MSc','70%','2022','Pakistan','ISLAMABAD','parmaent','MSc /MBa','Website','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (96,'Rabia Hussain','Ali','1985-09-04','female','03325526234','rabiaali4961@gmail.com','2024-07-31','Host / Content Creator ',80000.00,NULL,'TTIRabia','assets/images/employee/66a76264e2e5b_IMG_7759.jpeg','approved','2024-07-30','Redwood Marketing and Developments','BDM','Digital Media Marketer','Skill 1.  Multimedia Production, Skill 2. Digital Strategy, Skill 3 Relationship Management.','2004/2006','Bachlors in Mass Communications','Above 60 percent','2006','Pakistan','Islamabad','parmaent','Bachlors','IT','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (97,'Syed Muhammad','Kaif Bukhari','2005-01-11','male','03411579081','s.mkb2524@outlook.com','2024-09-01','Video Editor/ Web developer ',40000.00,'Kaif@5515340','Kaif@5515340','assets/images/employee/66ce05ea2239e_kaifbukhari.jpg','approved','2024-08-28','Devsinz','Full Stack Developer','MERN Stack Development','Frontend Development, Backend Development, Tailwind CSS, C#, NEXT.Js, React, JavaScript, MongoDB, SQL, MySQL, Prisma, Figma, WordPress, Python, NodeJS, ExpressJS, Video Editing, Adobe Premier, Adobe After Effect ','Ongoing','BS-SE','3.0','4 Years','Pakistan','Rawalpindi','parmaent','BS-SE','IT','hide','yes',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (98,'Zarmeen','Kausar','1997-01-01','female','03035444807','zarmeenkaosar@gmail.com',NULL,NULL,NULL,NULL,'03337561497','assets/images/employee/66d097950d921_WhatsApp Image 2024-08-29 at 19.04.31.jpeg','reject',NULL,'Pakistan Television Corporation ','Associate ','Research Associate','Research, Social Media Content Creator, Writing, Qualitative Research, Planning and Management, Goal oriented ','2022/2024','Mphil Gender Studies','4 CGPA','2024','Pakistan','Islamabad',NULL,'Mphil ','Research','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (99,'Mahnoor','Saleem','2000-01-02','female','03316677807','abidmahnoor999@gmail.com','2024-09-15','Office Co ordinator ',35000.00,NULL,'Msaleem033','assets/images/employee/66dcbcc9021bc_IMG_3506.jpeg','approved','2024-09-09','Hum news','News anchor','News anchor','Social media management, great communication skills','2019-2022','Digital media & TV-broadcasting','2.83','2022','Pakistan ','Rawalpindi','parmaent','BS in digital media and TV-broadcasting','Print Magazine','hide','yes',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (100,'Saad','Khan Jadoon','2000-02-23','male','03045403520','jadoons106@gmail.com',NULL,NULL,NULL,NULL,'khansaad','assets/images/employee/66e19bca58b73_BFC3C40F-3B04-46DC-95CB-4CE1925C4219.jpeg','reject',NULL,'Pakistan Television News ','Researcher ','Researcher at PTV NEWS','Content Writing and Research','2018-2022','Bachelor ','3.44GPA','2022','Pakistan ','Islamabad ',NULL,'BS Mass Communication ','Research','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (101,'Aleeshbah','Naveed','2003-01-16','female','03002378299','aleeshbah23@gmail.com',NULL,NULL,NULL,NULL,'@leeshbA2345','assets/images/employee/66f3dd3d93a44_WhatsApp Image 2024-09-25 at 14.34.11_dd747f28.jpg','reject',NULL,'Not applicable','Not applicable','Not applicable','Basic computer Knowledge, Little designing, Time management','2020/2024','Bachelors of Science in Mathematics','3.24','2024','Pakistan','Rawalpindi',NULL,'Bachelors','Research','hide','no',NULL,NULL,NULL,'Active');
INSERT INTO `employees` VALUES (103,'Test','TestSecond','2005-01-11','male','03259090028','unveiltech.mk@gmail.com','2024-10-29','CEO',60000000.00,NULL,'5515340','assets/images/employee/6720bc2ba9dfb_Screenshot 2024-09-12 145312.png','approved','2024-10-29','The Truth International','Employee','Vdieo Editro','Video Banana, Logo Pagal Banana','2022-2026','My Degree','4','4','Pakistan','Islamabad','parmaent','PHD','IT','hide','yes','<p>Mazan nahi a raha</p>\r\n','<p>Yojpzsekjhn zsrtijh zestihiouzdtsh rokzdtrnsi uhdkojh xdrztoixdrth ojdrhtxzdrt iuo</p>\r\n',NULL,'Active');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `employeeshifts`;

CREATE TABLE `employeeshifts` (
  `ShiftID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `ShiftType` enum('AM','PM','Online') DEFAULT NULL,
  `StartDateTime` datetime DEFAULT NULL,
  `EndDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ShiftID`),
  KEY `FK_Employee_Shifts` (`EmployeeID`),
  CONSTRAINT `FK_Employee_Shifts` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `filename` varchar(200) NOT NULL,
  `filesize` int(11) NOT NULL,
  `filetype` varchar(100) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `files` VALUES (0,'TTI Magazine 15th-30th April 2024 Cover.jpg',176892,'image/jpeg','2024-04-25 07:43:12',0);
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `healthinsurance`;

CREATE TABLE `healthinsurance` (
  `InsuranceID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `InsuranceProvider` varchar(100) DEFAULT NULL,
  `PolicyNumber` varchar(50) DEFAULT NULL,
  `PolicyStartDate` date DEFAULT NULL,
  `PolicyEndDate` date DEFAULT NULL,
  PRIMARY KEY (`InsuranceID`),
  KEY `FK_Employee_Insurance` (`EmployeeID`),
  CONSTRAINT `FK_Employee_Insurance` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `leaves`;

CREATE TABLE `leaves` (
  `LeaveID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `department_name` text DEFAULT NULL,
  `LeaveType` varchar(50) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Reason` text DEFAULT NULL,
  `show` enum('show','hide') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`LeaveID`),
  KEY `FK_Employee_Leaves` (`EmployeeID`),
  CONSTRAINT `FK_Employee_Leaves` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `leaves` VALUES (9,5,'IT Manager','Family or Personal Leave','2024-03-01','2024-03-01','Approved','Family Function At Home','hide','2024-03-01 11:12:30');
INSERT INTO `leaves` VALUES (11,88,'Research','half Leave','2024-03-19','2024-03-19','Approved','Test Half Leave','hide','2024-03-19 07:49:56');
INSERT INTO `leaves` VALUES (12,88,'Research','Annual Leave','2024-03-19','2024-03-19','Approved','Test Annual Leave','hide','2024-03-19 07:51:29');
INSERT INTO `leaves` VALUES (13,88,'Research','Sick Leave','2024-03-13','2024-03-13','Approved','Testing Sick Leave','hide','2024-03-19 07:59:31');
INSERT INTO `leaves` VALUES (14,88,'Research','half Leave','2024-03-28','2024-03-28','Approved','Testing Half Leave','hide','2024-03-19 08:00:10');
INSERT INTO `leaves` VALUES (15,88,'Research','half Leave','2024-04-01','2024-03-01','Approved','Testing Half Leave','hide','2024-03-19 08:00:58');
INSERT INTO `leaves` VALUES (16,88,'Research','half Leave','2024-04-02','2024-04-02','Approved','Testing Half Leave','hide','2024-03-19 08:01:44');
INSERT INTO `leaves` VALUES (17,88,'Research','Annual Leave','2024-04-22','2024-04-24','Approved','Three Days Leave','hide','2024-03-19 08:02:43');
INSERT INTO `leaves` VALUES (18,88,'Research','Annual Leave','2024-03-27','2024-03-27','Approved','Full Leave','hide','2024-03-19 08:03:57');
INSERT INTO `leaves` VALUES (19,88,'Research','Annual Leave','2024-05-15','2024-05-15','Rejected','1 Day Leave','hide','2024-03-19 08:05:57');
INSERT INTO `leaves` VALUES (20,88,'Research','Annual Leave','2024-03-20','2024-03-22','Approved','3 Days Leave','hide','2024-03-20 05:51:43');
INSERT INTO `leaves` VALUES (21,88,'Research','half Leave','2024-03-25','2024-03-25','Rejected','Half Leave','hide','2024-03-20 05:54:07');
INSERT INTO `leaves` VALUES (22,88,'Research','half Leave','2024-03-26','2024-03-26','Rejected','2nd Half Leave','hide','2024-03-20 05:54:40');
INSERT INTO `leaves` VALUES (23,88,'Research','Annual Leave','2024-04-01','2024-04-05','Rejected','5 Days Leave','hide','2024-03-20 05:55:28');
INSERT INTO `leaves` VALUES (24,88,'Research','Sick Leave','2024-03-27','2024-03-27','Approved','','hide','2024-03-20 05:59:57');
INSERT INTO `leaves` VALUES (25,88,'Research','Annual Leave','2024-03-25','2024-03-29','Approved','5 Days Leave','hide','2024-03-25 06:13:06');
INSERT INTO `leaves` VALUES (26,88,'Research','half Leave','2024-04-01','2024-04-01','Approved','Testing Half Leave','hide','2024-03-25 06:17:34');
INSERT INTO `leaves` VALUES (27,88,'Research','half Leave','2024-04-01','2024-04-02','Approved','Testing of Half Leave','hide','2024-03-25 10:05:29');
INSERT INTO `leaves` VALUES (28,88,'Research','half Leave','2024-03-25','2024-03-27','Approved','Testing Half Leave','hide','2024-03-25 10:08:08');
INSERT INTO `leaves` VALUES (29,88,'Research','Sick Leave','2024-03-26','2024-03-28','Approved','3 Days Leave','hide','2024-03-25 10:57:11');
INSERT INTO `leaves` VALUES (30,88,'Research','Annual Leave','2024-04-01','2024-03-11','Rejected','11 Days Leave','hide','2024-03-25 10:58:48');
INSERT INTO `leaves` VALUES (31,88,'Research','half Leave','2024-03-25','2024-03-25','Approved','Half Leave','hide','2024-03-25 11:13:41');
INSERT INTO `leaves` VALUES (32,88,'Research','Annual Leave','2024-03-28','2024-03-28','Rejected','One Day Leave Reject = 5','hide','2024-03-25 11:20:19');
INSERT INTO `leaves` VALUES (33,62,'IT Manager','Family or Personal Leave','2024-03-27','2024-03-27','Approved','Family emergency ','hide','2024-03-27 05:49:18');
INSERT INTO `leaves` VALUES (35,5,'IT Manager','Family or Personal Leave','2024-04-08','2024-04-09','Approved','Etikaf Ramdan Mubarik','hide','2024-04-01 08:08:40');
INSERT INTO `leaves` VALUES (37,90,'Research','Family or Personal Leave','2024-04-09','2024-04-09','Approved','Travel','hide','2024-04-04 07:52:09');
INSERT INTO `leaves` VALUES (38,89,'Research','Family or Personal Leave','2024-04-09','2024-04-09','Approved','Travelling to Home Town','hide','2024-04-04 07:53:00');
INSERT INTO `leaves` VALUES (39,54,'Website','Study or Exam Leave','2024-04-17','2024-04-17','Approved','For phD interviews.','hide','2024-04-15 12:46:04');
INSERT INTO `leaves` VALUES (40,48,'IT Manager','Family or Personal Leave','2024-04-18','2024-04-18','Approved','','hide','2024-04-17 08:47:37');
INSERT INTO `leaves` VALUES (41,5,'IT Manager','Family or Personal Leave','2024-04-24','2024-04-24','Approved','WIFE NOT WELL ','hide','2024-04-23 16:30:17');
INSERT INTO `leaves` VALUES (42,5,'IT Manager','Family or Personal Leave','2024-04-25','2024-04-25','Approved','WIFE NOT WELL ADMIT HOSPITAL','hide','2024-04-24 14:27:44');
INSERT INTO `leaves` VALUES (43,5,'IT Manager','Family or Personal Leave','2024-04-26','2024-04-26','Approved','WIFE NOT WELL ADMIT HOSPITAL ','hide','2024-04-25 15:29:15');
INSERT INTO `leaves` VALUES (44,54,'Website','Annual Leave','2024-05-24','2024-05-24','Approved','Demise of uncle','hide','2024-05-24 06:20:40');
INSERT INTO `leaves` VALUES (46,48,'IT Manager','Sick Leave','2024-06-12','2024-06-12','Approved','','hide','2024-06-11 19:04:36');
INSERT INTO `leaves` VALUES (47,5,'IT Manager','Family or Personal Leave','2024-06-20','2024-06-21','Approved','Nikkah Ceremony in Kohat','hide','2024-06-14 07:30:59');
INSERT INTO `leaves` VALUES (48,61,'Website','Family or Personal Leave','2024-06-20','2024-06-24','Approved','I am writing to request leave from the 20th to the 24th of June 2024, to attend my brother\'s wedding in my village. Your approval of my leave would be greatly appreciated. Thank you, Sir.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n','hide','2024-06-14 10:15:09');
INSERT INTO `leaves` VALUES (49,90,'Research','Family or Personal Leave','2024-06-20','2024-06-21','Approved','Travel','hide','2024-06-14 11:03:17');
INSERT INTO `leaves` VALUES (50,89,'Research','Family or Personal Leave','2024-06-20','2024-07-21','Approved','Travelling to home town. ','hide','2024-06-14 11:03:31');
INSERT INTO `leaves` VALUES (51,91,'Website','Annual Leave','2024-07-11','2024-07-13','Approved','Travelling out of city ','hide','2024-07-10 08:11:28');
INSERT INTO `leaves` VALUES (52,90,'Research','Family or Personal Leave','2024-07-15','2024-07-15','Approved','','hide','2024-07-12 12:05:44');
INSERT INTO `leaves` VALUES (53,48,'IT Manager','Sick Leave','2024-08-05','2024-08-05','Approved','I am experiencing a high fever and am feeling quite unwell.','hide','2024-08-04 15:55:19');
INSERT INTO `leaves` VALUES (55,90,'Research','Family or Personal Leave','2024-08-07','2024-08-07','Approved','','hide','2024-08-06 06:02:39');
INSERT INTO `leaves` VALUES (56,5,'IT Manager','Family or Personal Leave','2024-08-09','2024-08-09','Approved','','hide','2024-08-08 18:21:50');
INSERT INTO `leaves` VALUES (57,54,'Website','Sick Leave','2024-08-21','2024-08-21','Approved','High Fever.','hide','2024-08-20 13:26:11');
INSERT INTO `leaves` VALUES (58,91,'Website','Sick Leave','2024-08-22','2024-08-22','Approved',' I am experiencing severe migraine pain since last night, which is making it difficult for me to work on the PC. As a result, I will need to take a sick leave for today to rest and recover.\r\n\r\nI apologize for any inconvenience this may cause. Thank you for your understanding.','hide','2024-08-22 02:28:16');
INSERT INTO `leaves` VALUES (60,5,'IT Manager','Family or Personal Leave','2024-09-04','2024-09-04','Approved','WIFE NOT WELL','hide','2024-09-03 18:28:30');
INSERT INTO `leaves` VALUES (61,5,'IT Manager','Family or Personal Leave','2024-09-16','2024-09-16','Approved','Wife Not Well ','hide','2024-09-15 16:44:39');
INSERT INTO `leaves` VALUES (62,61,'Website','Family or Personal Leave','2024-10-12','2024-10-18','Approved','I am writing to formally request a 5-day leave for my Nikkah ceremony in my hometown. I appreciate your understanding and support during this special occasion and look forward to your approval.','hide','2024-10-09 06:10:47');
INSERT INTO `leaves` VALUES (63,90,'Research','half Leave','2024-10-11','2024-10-11','Approved','','hide','2024-10-10 17:18:25');
INSERT INTO `leaves` VALUES (64,99,'Print Magazine','Sick Leave','2024-10-09','2024-10-09','Approved','i was having temperature','hide','2024-10-11 11:57:16');
INSERT INTO `leaves` VALUES (65,48,'IT Manager','Sick Leave','2024-10-23','2024-10-23','Approved','My mother isn\'t feeling well, so I have to take her to the hospital.\r\n\r\n','hide','2024-10-23 03:48:49');
INSERT INTO `leaves` VALUES (66,99,'Print Magazine','Family or Personal Leave','2024-10-25','2024-10-25','Approved','Going out of city','hide','2024-10-25 10:33:35');
INSERT INTO `leaves` VALUES (68,54,'Website','Annual Leave','2024-10-11','2024-10-11','Approved','Demise of Grandmother.','hide','2024-10-29 05:15:07');
INSERT INTO `leaves` VALUES (69,54,'Website','Annual Leave','2024-11-01','2024-11-01','Approved','Masters Convocation','hide','2024-10-31 12:32:29');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `leaves_hr_manager`;

CREATE TABLE `leaves_hr_manager` (
  `LeaveID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `LeaveType` varchar(50) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Reason` text DEFAULT NULL,
  `show` enum('show','hide') DEFAULT NULL,
  PRIMARY KEY (`LeaveID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `leaves_hr_manager` VALUES (5,9,'Sick Leave','2024-02-27','2024-02-27','Approved','One day Leave Request for Tomorrow\r\n\r\nDear Sir,\r\nI trust this message finds you in good health condition,I am unwell and unable to come office tomorrow, 27/02/2024. So therefore it\'s requesting a sick leave for the day.\r\nThank you for your understanding.\r\n\r\nSincerely,\r\nAizaz Ullah','hide');
INSERT INTO `leaves_hr_manager` VALUES (6,24,'Family or Personal Leave','2024-03-08','2024-03-08','Approved','Personal ','hide');
INSERT INTO `leaves_hr_manager` VALUES (8,9,'Family or Personal Leave','2024-04-08','2024-04-21','Approved','Dear Sir, I kindly request one week of leave after Eid and two days before Eid 8th and 9th April, to spend time with my family. Your approval would be greatly appreciated. Thank you','hide');
INSERT INTO `leaves_hr_manager` VALUES (9,16,'Family or Personal Leave','2024-04-29','2024-04-30','Approved','','hide');
INSERT INTO `leaves_hr_manager` VALUES (10,24,'Family or Personal Leave','2024-05-08','2024-05-08','Approved','','hide');
INSERT INTO `leaves_hr_manager` VALUES (11,16,'Family or Personal Leave','2024-06-20','2024-06-20','Approved','Eid Celebration','hide');
INSERT INTO `leaves_hr_manager` VALUES (12,16,'Family or Personal Leave','2024-06-24','2024-06-28','Approved','Travel','hide');
INSERT INTO `leaves_hr_manager` VALUES (13,9,'Family or Personal Leave','2024-06-20','2024-06-21','Approved','Dear Sir,\r\nI am writing to request leave for two days, June 20th and 21st, 2024, to spend time with my family after Eid ul Azha.\r\nThank you for your understanding.','hide');
INSERT INTO `leaves_hr_manager` VALUES (14,24,'Annual Leave','2024-06-14','2024-06-14','Approved','Personal','hide');
INSERT INTO `leaves_hr_manager` VALUES (15,24,'Annual Leave','2024-07-23','2024-07-23','Approved','Personal Reasons ','hide');
INSERT INTO `leaves_hr_manager` VALUES (16,24,'Sick Leave','2024-07-05','2024-07-05','Approved','','hide');
INSERT INTO `leaves_hr_manager` VALUES (17,24,'Annual Leave','2024-07-10','2024-07-10','Approved','','hide');
INSERT INTO `leaves_hr_manager` VALUES (18,9,'half Leave','2024-08-02','2024-08-02','Approved','personnel ','hide');
INSERT INTO `leaves_hr_manager` VALUES (19,9,'Family or Personal Leave','2024-08-12','2024-08-12','Approved','Dear Sir,\r\nIt\'s request to take leave for tomorrow, I need to assist with my cousin admission. I will be unable to attend the office.\r\nThank you for understanding.','hide');
INSERT INTO `leaves_hr_manager` VALUES (20,9,'Sick Leave','2024-08-23','2024-08-23','Approved','Abdominal Pain ','hide');
INSERT INTO `leaves_hr_manager` VALUES (21,9,'Sick Leave','2024-09-09','2024-09-20','Approved','Dear Sir,\nI am writing to request a two-week leave due to my ongoing health issues. I have been experiencing stomach pain for the past month, and doctors has advised a strict organic diet to help with my recovery. To follow this properly, I need to go home for this period.\nI would be very thankful for your kind approval of my request.\nThank you for your understanding and support.\nYours sincerely,\nAizaz','hide');
INSERT INTO `leaves_hr_manager` VALUES (22,16,'Family or Personal Leave','2024-09-24','2024-09-24','Approved','','hide');
INSERT INTO `leaves_hr_manager` VALUES (23,9,'Sick Leave','2024-10-18','2024-10-18','Approved','Sick','hide');
INSERT INTO `leaves_hr_manager` VALUES (24,23,'Family or Personal Leave','2024-10-30','2024-10-30','Approved','Graduation Convocation of my son at the NUST University on Wednesday (October 30)','hide');
INSERT INTO `leaves_hr_manager` VALUES (26,9,'Sick Leave','2024-11-01','2024-11-30','Approved','Dear Sir,\r\nI am writing to request a one-month leave from work due to health reasons. After consulting with my doctor, I have been advised to take time off to focus on my recovery.\r\nI kindly request leave from 01st November 2024 to 30th November 2024. I will ensure a smooth handover of my responsibilities to ensure minimal disruption in my absence.\r\nThank you for your understanding and support during this time.\r\nBest regards,\r\nAizaz','hide');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `manager_interview_remaks`;

CREATE TABLE `manager_interview_remaks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `appearance` text NOT NULL,
  `skill` text DEFAULT NULL,
  `reasoning` text DEFAULT NULL,
  `education` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `job` text DEFAULT NULL,
  `gereral_knowledge` text DEFAULT NULL,
  `iq` text DEFAULT NULL,
  `pose` text DEFAULT NULL,
  `attitudes` text DEFAULT NULL,
  `salary` text DEFAULT NULL,
  `strengths` text DEFAULT NULL,
  `weakness` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `created_at` date DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `manager_interview_remaks` VALUES (12,89,'3','3','3','4','2','2','3','3','3','3','80000+','Have experience and seems mature to handle difficult situation. Seems to have leadership skills. As well as willing  for travel in field not longer field but for short visits.','Education and most experience is related to academic reserach','She is great fit for the position. Offered her 75 Thousand','2024-02-13');
INSERT INTO `manager_interview_remaks` VALUES (13,91,'4','3','3','3','2','0','3','2','4','2','N/A','EXCELLENT WRITING POWER, GOOD PRESENTABLE PERSONALITY, CONFIDENT,','No Previous Exposure','keeping in view her writing power and a good personality, she seems to be a suitable candidate for TTI\'s YouTube Channel + Content writing job','2024-02-14');
INSERT INTO `manager_interview_remaks` VALUES (14,90,'3','3','2','2','2','2','3','3','3','3','50000','Have good communication skills, eager to learn more','Have limited knowledge of job ','She is good can learn and execute tasks. Offered her 48k','2024-02-15');
INSERT INTO `manager_interview_remaks` VALUES (15,95,'3','3','3','4','1','1','3','2','4','4','50000','She is already writing blogs on current issues','She\'ll be coming back to work after a gap of 14 years, which might be difficult for her','She should be given a chance, would recommend her for the position of content writer and creator with a salary of 45000 PKR for first three months. If she proves her self her contract should be renewed for 1 year with a package of PKR 50,000/-','2024-07-17');
INSERT INTO `manager_interview_remaks` VALUES (16,96,'3','3','2','2','3','3','3','3','3','3','80000','She has a experience of hosting podcasts ','Her background is from marketing side','She should be give a chance to manage the whole youtube team, as she is experienced and looking at her previous work, she has been doing good','2024-07-31');
INSERT INTO `manager_interview_remaks` VALUES (17,97,'2','3','3','1','1','1','2','3','3','3','40000','He is a good devoted editor and also has web and development skills which can be utilised by our I','He doesn\'t have enough experience ','He can also be helpful for I.T related issues','2024-09-01');
INSERT INTO `manager_interview_remaks` VALUES (18,99,'3','2','3','3','1','2','2','3','3','3','35000','She has done a course of SEO, which can be helpful for boosting our content on YouTube and website','Lack of consistency ','She has been working with TTI as third party employee and is willing to continue.','2024-09-15');
INSERT INTO `manager_interview_remaks` VALUES (19,103,'3','3','3','3','3','3','3','3','3','3','350000000','3','gggg','tttgttt','2024-10-29');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `notification_admin`;

CREATE TABLE `notification_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notification_type` enum('opinion') DEFAULT NULL,
  `notification_details` text DEFAULT NULL,
  `manager_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `notification_admin` VALUES (5,'opinion','89','HR','2024-02-13 13:23:02');
INSERT INTO `notification_admin` VALUES (6,'opinion','91','HR','2024-02-14 10:48:11');
INSERT INTO `notification_admin` VALUES (7,'opinion','90','HR','2024-02-15 13:15:10');
INSERT INTO `notification_admin` VALUES (8,'opinion','95','HR','2024-07-17 22:54:37');
INSERT INTO `notification_admin` VALUES (9,'opinion','96','HR','2024-07-31 20:31:54');
INSERT INTO `notification_admin` VALUES (10,'opinion','97','HR','2024-09-02 01:32:40');
INSERT INTO `notification_admin` VALUES (11,'opinion','99','HR','2024-09-15 18:53:26');
INSERT INTO `notification_admin` VALUES (12,'opinion','103','HR','2024-10-29 10:50:11');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `other_letters`;

CREATE TABLE `other_letters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `file` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `payroll`;

CREATE TABLE `payroll` (
  `PayrollID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `SalaryMonth` date DEFAULT NULL,
  `BasicSalary` decimal(10,2) DEFAULT NULL,
  `OvertimePay` decimal(10,2) DEFAULT NULL,
  `Deductions` decimal(10,2) DEFAULT NULL,
  `NetSalary` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`PayrollID`),
  KEY `FK_Employee_Payroll` (`EmployeeID`),
  CONSTRAINT `FK_Employee_Payroll` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `resignation_letter`;

CREATE TABLE `resignation_letter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `status` enum('accept','declined') DEFAULT NULL,
  `file` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `resignation_letter` VALUES (19,88,'declined','022bd68c70fa509482074de2d3d4816c.pdf');
INSERT INTO `resignation_letter` VALUES (20,103,'declined','fcc6e58121c16d6716bb47a385f299dd.pdf');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `task_details`;

CREATE TABLE `task_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `messsage` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `tasks`;

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `manager_id` int(11) DEFAULT NULL,
  `assigned_to_employee_id` int(11) DEFAULT NULL,
  `task_description` text DEFAULT NULL,
  `status` enum('pending','in_progress','complete') DEFAULT 'pending',
  `manager_review_status` enum('under_review','comment_provided','discussion_done','completed') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tasks` VALUES (8,23,54,'Ms Romana Afsheen will file breaking news about Sports and Space Technology regularly ','pending','under_review','2024-02-23 10:23:17','2024-03-15 10:21:48');
INSERT INTO `tasks` VALUES (9,23,60,'Mr Hasnain will file breaking news about Scholarships and IT-related issues regularly','pending','under_review','2024-02-23 10:24:14','2024-02-23 10:24:14');
INSERT INTO `tasks` VALUES (10,23,61,'Ms Kanwal Muneer will file breaking news about Politics and Economy on a daily basis in addition to filing other major stories','pending','under_review','2024-02-23 10:25:13','2024-02-23 10:25:13');
INSERT INTO `tasks` VALUES (11,23,52,'Mr Daniyal Wali will file important stories about Entertainment/Showbiz and Culture daily along with filing breaking news','pending','under_review','2024-02-23 10:26:37','2024-02-23 10:26:37');
INSERT INTO `tasks` VALUES (12,24,43,'Upload BEDZ document ','pending','under_review','2024-03-25 04:31:30','2024-05-06 06:25:39');
INSERT INTO `tasks` VALUES (15,24,90,'Prepare ppt - Gwadar dry bulk port','pending','under_review','2024-05-06 06:26:18','2024-05-06 06:26:18');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `termination_letter`;

CREATE TABLE `termination_letter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `file` text DEFAULT NULL,
  `ternimation_letter_details` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `termination_letter` VALUES (15,60,'yes',NULL);
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `useremail` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pass` text DEFAULT NULL,
  `img` text DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `role` enum('admin','manager','hr') NOT NULL DEFAULT 'manager',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `useremail` (`useremail`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` VALUES (9,'hr@gmail.com','hr','$2y$10$6vlRcpQf4kJYF/i4oFYrC.GYqCB9C65bkConbiE15UZ9dcqEjdmnu',NULL,'uploads/1.avif',NULL,'hr','2023-11-29 12:09:57');
INSERT INTO `users` VALUES (16,'itmanager@tti.org.pk','Usama Ahmad','$2y$10$JKcyqTRicu0e5bpkOUbra.kxKXK6vWk9Z1epMMS0zBSoc.KayjReC','123456','uploads/1.avif',NULL,'manager','2024-01-26 17:14:29');
INSERT INTO `users` VALUES (21,'ceo@tti.org.pk','ceo','$2y$10$AynVTply08CLb7kT7EqIR.y6nuTmtx9FEvHQxmMAq0O2GrA1R/6aW','123456','uploads/1.avif',NULL,'admin','2024-02-12 03:05:36');
INSERT INTO `users` VALUES (22,NULL,'Ashraf Malkham','$2y$10$M5cYqW1YVpIUUbdpyb.qcuxKWkbWFZg.FrHrw3vXrjFvAQ6V2Iv0S','123456','uploads/1.avif',NULL,'manager','2024-02-13 00:53:53');
INSERT INTO `users` VALUES (23,NULL,'Javed Mahmood','$2y$10$QQTk9vlczwx5iT8D/QTd8uvHFq3e34ZRXRHiWW/7cgy5lLsbcyFDi','123456','uploads/65f7e67a57f90_javed best.jpg',NULL,'manager','2024-02-13 00:55:58');
INSERT INTO `users` VALUES (24,NULL,'Wardah Rafique','$2y$10$6X8Q7GJ3lKl.r.LI9iSeOuLOUfuLyIIJu8p5.F9U2sz9NJ9WPvQuu','123456','uploads/1.avif',NULL,'manager','2024-02-13 04:56:32');
INSERT INTO `users` VALUES (25,'developer@tti.org.pk','dev','$2y$10$OwHgc7hy3txdvqKkE651g.9TyrZl8WJl5SQpPjKLRH/QoTm.dgTya','Dev@TTI',NULL,NULL,'admin','2024-10-26 05:12:07');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `warning_letter`;

CREATE TABLE `warning_letter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `file` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `warning_letter` VALUES (15,60,'efc27e4f8abcdce13bf174681888b709.pdf');
INSERT INTO `warning_letter` VALUES (16,5,'2f3a418f833e7ac0d97d1cd326089766.pdf');
INSERT INTO `warning_letter` VALUES (19,60,'ef406679ca9e937f242f8fa5750b1f2d.pdf');
INSERT INTO `warning_letter` VALUES (20,50,'a22e5d134b9c9a129d4c674be8917d4f.pdf');
INSERT INTO `warning_letter` VALUES (23,61,'d67fd3bea89b58e515206cea6591a0cd.pdf');
INSERT INTO `warning_letter` VALUES (24,54,'fe7ae2bd165216c0325de0d3794c1eaa.pdf');
INSERT INTO `warning_letter` VALUES (25,91,'e025370b58964e2ecc6ea91c81b8e0fb.pdf');
INSERT INTO `warning_letter` VALUES (26,103,'818e753d8dbf6975b072f255f9817c75.pdf');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

DROP TABLE IF EXISTS `work_from_home`;

CREATE TABLE `work_from_home` (
  `WfhID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) DEFAULT NULL,
  `department_name` text DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Reason` text DEFAULT NULL,
  `show` enum('show','hide') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`WfhID`),
  KEY `FK_Employee_Leaves` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `work_from_home` VALUES (1,52,'Website','2024-04-01','2024-04-02','Approved','We requested the CEO, Sir Fahad, to allow us to work from home for the upcoming week.','hide','2024-03-29 07:14:49');
INSERT INTO `work_from_home` VALUES (2,52,'Website','2024-04-04','2024-04-05','Approved','We requested the CEO, Sir Fahad, to allow us to work from home for the upcoming week. ','hide','2024-03-29 07:16:00');
INSERT INTO `work_from_home` VALUES (3,54,'Website','2024-04-02','2024-04-02','Approved','Religious observance','hide','2024-03-30 05:35:05');
INSERT INTO `work_from_home` VALUES (4,54,'Website','2024-04-05','2024-04-05','Approved','Religious observance','hide','2024-03-30 05:35:41');
INSERT INTO `work_from_home` VALUES (5,54,'Website','2024-04-08','2024-04-08','Approved','Religious observance','hide','2024-03-30 05:36:25');
INSERT INTO `work_from_home` VALUES (6,54,'Website','2024-04-17','2024-04-17','Rejected','I have two phD interviews on the respective day.','hide','2024-04-15 10:19:33');
INSERT INTO `work_from_home` VALUES (7,52,'Website','2024-06-12','2024-06-12','Approved','Respected sir; \r\nI hope you\'re fine. I have severe fever and soar throat for the last 2 days due to which I cannot attend office tomorrow. However, I will work from home for the day. \r\nThank you.','hide','2024-06-11 15:56:28');
INSERT INTO `work_from_home` VALUES (8,91,'Website','2024-08-29','2024-08-29','Pending','I had a skin treatment yesterday that requires me to stay indoors for recovery. As a result, I will be working from home today. ','show','2024-08-29 07:29:24');
INSERT INTO `work_from_home` VALUES (9,54,'Website','2024-10-02','2024-10-02','Pending','Medical Emergency.','show','2024-10-01 10:07:05');
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

CREATE USER `erp786`@`68.178.231.250` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

CREATE USER `erp786`@`localhost` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

CREATE USER `erp786`@`sg2plzcpnl503789.prod.sin2.secureserver.net` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

GRANT USAGE ON *.* TO `erp786`@`68.178.231.250` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
GRANT ALL PRIVILEGES ON `erp786`.* TO `erp786`@`68.178.231.250`;
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

GRANT USAGE ON *.* TO `erp786`@`localhost` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
GRANT ALL PRIVILEGES ON `erp786`.* TO `erp786`@`localhost`;
-- <?php exit; __halt_compiler(); // Protect the file from being visited via web
-- Orion backup format

GRANT USAGE ON *.* TO `erp786`@`sg2plzcpnl503789.prod.sin2.secureserver.net` IDENTIFIED BY PASSWORD '*810AD6873152666E7D6C7D678032C6D2FAA8D02A';
GRANT ALL PRIVILEGES ON `erp786`.* TO `erp786`@`sg2plzcpnl503789.prod.sin2.secureserver.net`;
