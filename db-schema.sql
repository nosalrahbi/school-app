CREATE DATABASE schoolAnsab;

USE schoolAnsab;

CREATE TABLE teachers (
	e_id INT(5) AUTO_INCREMENT NOT NULL,
    e_firstname VARCHAR(255) NOT NULL,
    e_lastname VARCHAR(255) NOT NULL,
    e_sex ENUM("M","F") NOT NULL,
    e_dob DATE NOT NULL,
    e_civilid VARCHAR(20),
    e_passport VARCHAR(20),
    e_qualification VARCHAR(255),
    marital ENUM("single","married","divorced"),
    e_salary INT(5),
    bank VARCHAR(10),
    AccNo VARCHAR(20),
    e_mobile VARCHAR(20),
    e_address VARCHAR(255),
    e_note VARCHAR(255),
    e_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    PRIMARY KEY (e_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE buses(
	bus_id INT(5) auto_increment NOT NULL,
    bus_name VARCHAR(50),
    driver VARCHAR(255),
    drv_mobile VARCHAR(20),
    bus_super VARCHAR(255),
    sup_mobile VARCHAR(20),
    area VARCHAR(100),
    primary key (bus_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

INSERT INTO buses(bus_name, driver) VALUES ('self', 'self');

CREATE TABLE classes(
	class_id int(5) auto_increment not null,
    class_name VARCHAR(50),
    class_teacher VARCHAR(255),
    primary key (class_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

INSERT INTO classes(class_name, class_teacher) VALUES ('school', 'school');

CREATE TABLE if not exists subjects(
	subject_id int(5) auto_increment not null,
    subject_ename VARCHAR(50),
    subject_aname VARCHAR(50),
    primary key (subject_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

INSERT INTO subjects(subject_ename,subject_aname) VAlUES ('Free / نشاط','Free / نشاط');

CREATE TABLE if not exists day_of_week (
    id int(5) auto_increment not null,
    day_name varchar(50) NOT NULL,
    primary key (id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

INSERT INTO day_of_week (id, day_name) VALUES (1,'Sunday'),(2, 'Monday'), (3,'Tuesday'), (4,'Wednesday'), (5,'Thursday');

CREATE TABLE IF NOT EXISTS students (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `sex` ENUM ('F', 'M') NOT NULL,
  `d_o_b` date NOT NULL,
  `passport_no` VARCHAR(15),
  `image` varchar(255),
  `address` varchar(255),
  `class` int(5) DEFAULT 0,
  `bus_id` int(5) DEFAULT 0,
  `parents_mobile` VARCHAR(20) NOT NULL,
  `reg_fee` int DEFAULT 0,
  `cloth_fee` int DEFAULT 0,
  `transport_fee` int DEFAULT 0,
  `tuition_fee` int DEFAULT 0,
  `dicount_fee` int DEFAULT 0,
  `active` BOOLEAN DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (class) REFERENCES classes(class_id) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `parents` (
  `parent_id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `sex` ENUM ('F', 'M') NOT NULL,
  `civil_id` VARCHAR(20) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `st_id` int(5) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  PRIMARY KEY (`parent_id`),
  foreign key (`st_id`)
	references students(id)
    on delete cascade
    ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS users (
    user_id INT(5) NOT NULL auto_increment,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    role ENUM("Admin", "User", "Guest","Parent") NOT NULL,
    st_id INT(5),
    Enabled ENUM("Yes", "No"),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    lastVisit TIMESTAMP NULL,
    PRIMARY KEY (user_id),
    foreign key (st_id) references students(id) 
    ON DELETE SET NULL 
    ON update CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=5;

INSERT INTO users (user_name, email, user_password, role, Enabled) VALUES ('admin1', 'admin1@example.com', '$2a$08$Mf0sROUtZsMWrnouA8KFl.h4lJOHNnxbcFJbp./AnYCTpfRyGEZna', 'Admin', 'Yes');

CREATE TABLE if not exists tables (
   id int auto_increment not null, 
   t_name varchar(20) not null UNIQUE,
   class_id int(5) not null,
   up_date DATE,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
   primary key (id),
   foreign key (class_id) references classes(class_id) 
    ON DELETE CASCADE 
    ON update CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE if not exists periods (
    t_id int(5) not null,
    day_id int(5) not null,
    p1 VARCHAR(50),
    p2 VARCHAR(50),
    p3 VARCHAR(50),
    p4 VARCHAR(50),
    p5 VARCHAR(50),
    p6 VARCHAR(50),
    p7 VARCHAR(50),
    p8 VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key (t_id, day_id),
    foreign key (t_id) references tables(id) 
    ON DELETE CASCADE 
    ON update CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE if not exists homeworks (
	id int(5) auto_increment not null,
    subject_id int(5) NOT NULL,
    class_id int(5) NOT NULL,
    homework text,
    task_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key (id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE if not exists months (
    month_no INT(5) NOT NULL AUTO_INCREMENT,
    month_name VARCHAR(50) NOT NULL,
    primary key (month_no)
)  ENGINE=INNODB DEFAULT CHARSET UTF8 DEFAULT COLLATE UTF8_UNICODE_CI AUTO_INCREMENT=1;

INSERT INTO months (month_name) VALUES ('August-2019'), ('September-2019'), ('October-2019'), ('November-2019'), ('December-2019'), ('January-2020'), ('February-2020'), ('March-2020'), ('April-2020'), ('May-2020'), ('June-2020'), ('July-2020');

CREATE TABLE IF NOT EXISTS income (
  in_id INT NOT NULL AUTO_INCREMENT,
  in_category VARCHAR(50) NOT NULL,
  invoice_no VARCHAR(20),
  in_item VARCHAR(50) NOT NULL,
  in_quantity INT(20) DEFAULT 1,
  in_price INT(20) NOT NULL,
  in_date DATE NOT NULL,
  in_desc VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  PRIMARY KEY (in_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS expenses (
  ex_id INT NOT NULL AUTO_INCREMENT,
  ex_category VARCHAR(50) NOT NULL,
  invoice_no VARCHAR(20),
  ex_item VARCHAR(50) NOT NULL,
  ex_quantity INT(20) DEFAULT 1,
  ex_price INT(20) NOT NULL,
  ex_date DATE NOT NULL,
  ex_desc VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  PRIMARY KEY (ex_id)
) ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS payments (
  pay_id INT(5) NOT NULL AUTO_INCREMENT,
  pay_date DATE NOT NULL,
  amount INT(5) NOT NULL,
  category VARCHAR(255),
  st_id INT(5),
  note VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  PRIMARY KEY (pay_id),
  FOREIGN KEY (st_id)
    REFERENCES students(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;

CREATE table salaries (
    sal_id INT(5) AUTO_INCREMENT NOT NULL,
    e_id INT(5),
	sal_month DATE NOT NULL,
    pay_date DATE NOT NULL,
    amount INT(5) NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),    
    PRIMARY KEY (sal_id),
    FOREIGN KEY (e_id)
        REFERENCES teachers(e_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
    )  ENGINE=InnoDB  DEFAULT CHARSET utf8 DEFAULT COLLATE utf8_unicode_ci AUTO_INCREMENT=1;