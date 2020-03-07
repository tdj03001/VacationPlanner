DROP DATABASE IF EXISTS vacation_db;
CREATE DATABASE vacation_db;
USE vacation_db;
CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE itinerary(
	id INT NOT NULL AUTO_INCREMENT,
    userid INT NOT NULL,
    city VARCHAR(30) NOT NULL,
    xid VARCHAR(30) NOT NULL,
    dayof INT not null,
    PRIMARY KEY (id)
);
