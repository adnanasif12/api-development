-- Optional: the app creates the database & tables automatically on start.
-- Use this file if you prefer to create them manually.

CREATE DATABASE IF NOT EXISTS blogdb;
USE blogdb;

CREATE TABLE IF NOT EXISTS users (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname  VARCHAR(100) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  isActive  BOOLEAN NOT NULL DEFAULT TRUE,
  role      ENUM('user','admin') NOT NULL DEFAULT 'user',
  createAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  userId    INT NOT NULL,
  blogTitle VARCHAR(255) NOT NULL,
  blog      TEXT NOT NULL,
  category  VARCHAR(100) NOT NULL,
  createAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blogs_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Make an existing user an admin:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
