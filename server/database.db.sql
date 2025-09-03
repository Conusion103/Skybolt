--CREATE DATABASE skybolt;
USE skybolt;

-- Desactivar claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS owner_requests;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS fields_;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS time_;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS municipalities;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS games;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE departments (
    id_department INT AUTO_INCREMENT PRIMARY KEY,
    name_department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE municipalities (
    id_municipality INT AUTO_INCREMENT PRIMARY KEY,
    id_department INT NOT NULL,
    name_municipality VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_department) REFERENCES departments(id_department)
);


CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    id_document VARCHAR(50) NOT NULL UNIQUE,
    id_municipality INT NOT NULL,
    password_ VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality)
);


CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name_role VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE user_roles (
    id_user INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);


CREATE TABLE games (
    id_game INT AUTO_INCREMENT PRIMARY KEY,
    name_game VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE time_ (
    id_tiempo INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE availability (
    id_availability INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL,
    id_tiempo INT NOT NULL,
    estado ENUM('available', 'not_available') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tiempo) REFERENCES time_(id_tiempo)
);


CREATE TABLE fields_ (
    id_field INT AUTO_INCREMENT PRIMARY KEY,
    name_field VARCHAR(255) NOT NULL,
    id_municipality INT NOT NULL,
    id_game INT NOT NULL,
    id_availability INT NOT NULL,
    id_owner INT DEFAULT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality) ON DELETE CASCADE,
    FOREIGN KEY (id_game) REFERENCES games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_availability) REFERENCES availability(id_availability) ON DELETE CASCADE,
    FOREIGN KEY (id_owner) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE reservations (
    id_reserve INT AUTO_INCREMENT PRIMARY KEY,
    reserve_schedule DATETIME NOT NULL,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_field) REFERENCES fields_(id_field) ON DELETE CASCADE
);


CREATE TABLE owner_requests (
    id_request INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    cancha_name VARCHAR(255) NOT NULL,
    cancha_location VARCHAR(255) NOT NULL,
    cancha_description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);


CREATE TABLE reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_field) REFERENCES fields_(id_field) ON DELETE CASCADE
);

-- CREATE TABLE owner_status (
--     id_user INT PRIMARY KEY,
--     status ENUM('active', 'suspended') DEFAULT 'active',
--     FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
-- );


INSERT INTO departments (name_department) VALUES
('Atlántico');


INSERT INTO municipalities (id_department, name_municipality) VALUES
(1, 'Barranquilla');


INSERT INTO roles (name_role) VALUES
('admin'),
('owner'),
('user');


INSERT INTO users (
    full_name,
    email,
    phone,
    birthdate,
    document_type,
    id_document,
    id_municipality,
    password_
) VALUES (
    'Super Admin',
    'admin@example.com',
    '3001234567',
    '1990-01-01',
    'CC',
    '1000000001',
    1,
    '$2a$12$7tcjcHBSNcVHOUqIcs6W1.lVZTHjMBfBbDJrRRJPmOCV60DQnvD7a'
);


INSERT INTO user_roles (id_user, id_role)
VALUES (
    1,
    (SELECT id_role FROM roles WHERE name_role = 'admin' LIMIT 1)
);

INSERT INTO games (name_game)
VALUES ('Fútbol 5');

INSERT INTO time_ (hora_inicio, hora_final)
VALUES ('08:00:00', '10:00:00');

INSERT INTO availability (day_of_week, id_tiempo, estado)
VALUES ('Monday', 1, 'available');

select * from users;