CREATE DATABASE IF NOT EXISTS hotate;

use hotate;

CREATE TABLE IF NOT EXISTS authors (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS publishers (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS books (
  id int NOT NULL AUTO_INCREMENT,
  isbn int NULL,
  book_name varchar(255) NOT NULL,
  book_sub_name varchar(255) NULL,
  author_id int NOT NULL,
  ndc int NULL,
  publisher_id int NOT NULL,
  year int NOT NULL,
  book_content text NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (publisher_id) REFERENCES publishers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
