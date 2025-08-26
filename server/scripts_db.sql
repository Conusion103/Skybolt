-- CREATE DATABASE skybolt;
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

-- Tabla de departamentos
CREATE TABLE departments (
    id_department INT AUTO_INCREMENT PRIMARY KEY,
    name_department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de municipios
CREATE TABLE municipalities (
    id_municipality INT AUTO_INCREMENT PRIMARY KEY,
    id_department INT NOT NULL,
    name_municipality VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_department) REFERENCES departments(id_department)
);

-- Tabla de usuarios
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

-- Tabla de roles
CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name_role VARCHAR(50) UNIQUE NOT NULL
);

-- Relación muchos a muchos entre usuarios y roles
CREATE TABLE user_roles (
    id_user INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

-- Tabla de juegos
CREATE TABLE games (
    id_game INT AUTO_INCREMENT PRIMARY KEY,
    name_game VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de tiempos
CREATE TABLE time_ (
    id_tiempo INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de disponibilidad
CREATE TABLE availability (
    id_availability INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL,
    id_tiempo INT NOT NULL,
    estado ENUM('available', 'not_available') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tiempo) REFERENCES time_(id_tiempo)
);

-- Tabla de canchas
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
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality),
    FOREIGN KEY (id_game) REFERENCES games(id_game),
    FOREIGN KEY (id_availability) REFERENCES availability(id_availability),
    FOREIGN KEY (id_owner) REFERENCES users(id_user)
);

-- Tabla de reservas
CREATE TABLE reservations (
    id_reserve INT AUTO_INCREMENT PRIMARY KEY,
    reserve_schedule DATETIME NOT NULL,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_field) REFERENCES fields_(id_field)
);

-- Tabla de solicitudes de ser propietario
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

-- Tabla de reseñas
CREATE TABLE reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_field) REFERENCES fields_(id_field)
);

-- Insertar departamentos
INSERT INTO departments (name_department) VALUES
('Antioquia'),         
('Cundinamarca'),      
('Valle del Cauca'),   
('Atlántico'),         
('Bolívar'),           
('Magdalena');

-- Insertar municipios
INSERT INTO municipalities (id_department, name_municipality) VALUES
(1, 'Medellín'), (1, 'Envigado'), (1, 'Bello'), (1, 'Itagüí'), (1, 'Rionegro'),
(2, 'Bogotá'), (2, 'Soacha'), (2, 'Chía'), (2, 'Zipaquirá'), (2, 'Girardot'),
(3, 'Cali'), (3, 'Palmira'), (3, 'Yumbo'), (3, 'Buenaventura'), (3, 'Tuluá'),
(4, 'Barranquilla'), (4, 'Soledad'), (4, 'Malambo'), (4, 'Puerto Colombia'), (4, 'Sabanalarga'),
(5, 'Cartagena'), (5, 'Magangué'), (5, 'Turbaco'), (5, 'El Carmen de Bolívar'), (5, 'Arjona'),
(6, 'Santa Marta'), (6, 'Ciénaga'), (6, 'Fundación'), (6, 'El Banco'), (6, 'Plato');

-- Insertar roles
INSERT INTO roles (name_role) VALUES
('admin'),
('owner'),
('user');
