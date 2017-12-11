DROP DATABASE if EXISTS trainlyio;

CREATE DATABASE if not EXISTS trainlyio;

USE trainlyio;

CREATE TABLE `USER` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `hash_pw` varchar(45) DEFAULT NULL,
  `profile_pic` varchar(500) DEFAULT NULL,
  `f_name` varchar(45) DEFAULT NULL,
  `l_name` varchar(45) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PHONE_NUMBER` (
  `user_id` int(11) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  PRIMARY KEY (`user_id`,`phone_number`),
  KEY `phonenumber_fk_idx` (`user_id`),
  CONSTRAINT `pn_fk` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ADMINISTRATOR` (
  `admin_id` int(11) NOT NULL,
  `date_time` timestamp(1) NULL DEFAULT NULL,
  `grantor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `grantor_fk_idx` (`grantor_id`),
  CONSTRAINT `admin_fk` FOREIGN KEY (`admin_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grantor_fk` FOREIGN KEY (`grantor_id`) REFERENCES `ADMINISTRATOR` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `FACULTY` (
  `faculty_id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `affiliation` varchar(45) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `grantor_id` int(11) DEFAULT NULL,
  `date_time` timestamp(1) NULL DEFAULT NULL,
  PRIMARY KEY (`faculty_id`),
  KEY `faculty_fk2_idx` (`grantor_id`),
  CONSTRAINT `faculty_fk` FOREIGN KEY (`faculty_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `faculty_fk2` FOREIGN KEY (`grantor_id`) REFERENCES `ADMINISTRATOR` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `COURSE` (
  `course_id` int(11) NOT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `topic` varchar(200) DEFAULT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `SECONDARY_TOPIC` (
  `course_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`course_id`,`name`),
  CONSTRAINT `st_fk` FOREIGN KEY (`course_id`) REFERENCES `COURSE` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `MATERIAL` (
  `material_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL,
  `material_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  KEY `material_fk_idx` (`course_id`),
  CONSTRAINT `material_fk` FOREIGN KEY (`course_id`) REFERENCES `COURSE` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PLAYLIST` (
  `user_id` int(11) NOT NULL,
  `playlist_name` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`,`playlist_name`),
  CONSTRAINT `playlist_fk` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `INNER_MATERIAL` (
  `user_id` int(11) NOT NULL,
  `playlist_name` varchar(45) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`playlist_name`,`material_id`),
  KEY `im_fk2_idx` (`material_id`),
  CONSTRAINT `im_fk1` FOREIGN KEY (`user_id`, `playlist_name`) REFERENCES `PLAYLIST` (`user_id`, `playlist_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `im_fk2` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `INTERESTED` (
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`course_id`),
  KEY `interested_fk2_idx` (`course_id`),
  CONSTRAINT `interested_fk1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `interested_fk2` FOREIGN KEY (`course_id`) REFERENCES `COURSE` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ENROLLED` (
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `start_time` timestamp(1) NULL DEFAULT NULL,
  `end_time` timestamp(1) NULL DEFAULT NULL,
  `rate` varchar(5) DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `payment_code` varchar(45) DEFAULT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `complete` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`course_id`),
  UNIQUE KEY `payment_code_UNIQUE` (`payment_code`),
  KEY `enrolled_fk2_idx` (`course_id`),
  CONSTRAINT `enrolled_fk1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrolled_fk2` FOREIGN KEY (`course_id`) REFERENCES `COURSE` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `COMPLETED_MATERIALS` (
  `user_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `date_time` timestamp(1) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`material_id`),
  KEY `cm_fk2_idx` (`material_id`),
  CONSTRAINT `cm_fk1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cm_fk2` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `DOWNLOADABLE_FILE` (
  `material_id` int(11) NOT NULL,
  `path` varchar(500) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  CONSTRAINT `df_fk` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `LINK` (
  `material_id` int(11) NOT NULL,
  `URL` varchar(200) DEFAULT NULL,
  `video_tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  CONSTRAINT `link_fk` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `POST` (
  `material_id` int(11) NOT NULL,
  `text` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  CONSTRAINT `post_fk` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `QUIZ` (
  `material_id` int(11) NOT NULL,
  `passing_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  CONSTRAINT `quiz_fk` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `QUIZ_QUESTION` (
  `material_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `text` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`material_id`,`question_id`),
  CONSTRAINT `qq_fk` FOREIGN KEY (`material_id`) REFERENCES `QUIZ` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `QUIZ_ANSWER` (
  `material_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `text` varchar(1000) DEFAULT NULL,
  `feedback` varchar(1000) DEFAULT NULL,
  `indication` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`material_id`,`question_id`,`answer_id`),
  CONSTRAINT `qa_fk` FOREIGN KEY (`material_id`, `question_id`) REFERENCES `QUIZ_QUESTION` (`material_id`, `question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `POSTER` (
  `course_id` int(11) NOT NULL,
  `poster_id` int(11) NOT NULL,
  `date_time` timestamp(1) NULL DEFAULT NULL,
  PRIMARY KEY (`course_id`,`poster_id`),
  KEY `poster_fk1_idx` (`poster_id`),
  CONSTRAINT `poster_fk1` FOREIGN KEY (`poster_id`) REFERENCES `FACULTY` (`faculty_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `poster_fk2` FOREIGN KEY (`course_id`) REFERENCES `COURSE` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `QUESTION` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `text` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `question_fk_idx` (`user_id`),
  CONSTRAINT `question_fk` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

CREATE TABLE `LIKE` (
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`question_id`),
  KEY `like_fk2_idx` (`question_id`),
  CONSTRAINT `like_fk1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `like_fk2` FOREIGN KEY (`question_id`) REFERENCES `QUESTION` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ANSWER` (
  `faculty_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `visible` varchar(5) DEFAULT NULL,
  `text` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`faculty_id`,`question_id`),
  KEY `answer_fk2_idx` (`question_id`),
  CONSTRAINT `answer_fk1` FOREIGN KEY (`faculty_id`) REFERENCES `FACULTY` (`faculty_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `answer_fk2` FOREIGN KEY (`question_id`) REFERENCES `QUESTION` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `QUESTION_MATERIALS` (
  `question_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`question_id`,`material_id`),
  KEY `qm_fk2_idx` (`material_id`),
  CONSTRAINT `qm_fk1` FOREIGN KEY (`question_id`) REFERENCES `QUESTION` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `qm_fk2` FOREIGN KEY (`material_id`) REFERENCES `MATERIAL` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;