CREATE DATABASE motoka;
USE motoka;
DROP DATABASE motoka;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(99) NOT NULL,
    last_name VARCHAR(99),
    username VARCHAR(99) NOT NULL UNIQUE,
    password VARCHAR(99) NOT NULL,
    email VARCHAR(99) NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(255),
    gender ENUM("Male", "Female") NOT NULL,
    address VARCHAR(255),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

SELECT * FROM users;

CREATE TABLE admin (
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(99) NOT NULL UNIQUE,
    username VARCHAR (99) NOT NULL UNIQUE,
    password VARCHAR (20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

SELECT * FROM admin;

CREATE TABLE brands (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (99)
);

CREATE TABLE products (
	id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    CONSTRAINT FK_BrandID
    FOREIGN KEY(brand_id) REFERENCES brands(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    name VARCHAR (99) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    stock INT DEFAULT 1
);

CREATE TABLE product_images(
	id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    CONSTRAINT FK_Product_ImagesID
    FOREIGN KEY(product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE carts (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    CONSTRAINT FK_UserID
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    product_id INT NOT NULL,
    CONSTRAINT FK_ProductID
    FOREIGN KEY(product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INT NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE checkout (
	id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    CONSTRAINT FK_CartID
    FOREIGN KEY(cart_id) REFERENCES carts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    admin_id INT NOT NULL,
    CONSTRAINT FK_AdminID
    FOREIGN KEY(admin_id) REFERENCES admin(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    total_price INT,
    payment_upload VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

