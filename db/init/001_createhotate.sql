CREATE DATABASE IF NOT EXISTS hotate;

use hotate;

CREATE TABLE IF NOT EXISTS authors (
  id varchar(255) NOT NULL,
  name varchar(255) NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS publishers (
  id varchar(255) NOT NULL,
  name varchar(255) NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS books (
  id varchar(255) NOT NULL,
  isbn varchar(30) NULL DEFAULT NULL,
  book_name varchar(255) NOT NULL,
  book_sub_name varchar(255) NULL DEFAULT NULL,
  author_id varchar(255) NOT NULL,
  ndc int NULL DEFAULT NULL,
  publisher_id varchar(255) NOT NULL,
  year int NULL DEFAULT NULL,
  book_content text NULL DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (publisher_id) REFERENCES publishers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS admin (
  id varchar(255) NOT NULL,
  pw varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
