create database panze_im;

create table if not exists `users` (
	id int(5) auto_increment not null primary key,
	email varchar(128) not null,
	avatar varchar(128) not null,
	createtime int(13) not null,
	nickname varchar(64) not null,
	password varchar(32) not null,
	birthday char(16) not null,
	grender char(1)
)
ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci AUTO_INCREMENT=5;

create table if not exists `friendship` (
	id int(5) auto_increment not null primary key,
	user_id int(5) not null,
	friend_id int(5) not null
)
ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci AUTO_INCREMENT=5;