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
-- Insertar datos en la tabla de juegos
INSERT INTO games (name) VALUES ('Fútbol'), ('Baloncesto');

-- Insertar datos en la tabla de tiempos
INSERT INTO tiempos (hora_inicio, hora_final) VALUES ('09:00:00', '10:00:00'), ('10:00:00', '11:00:00');

-- Insertar datos en la tabla de disponibilidad
INSERT INTO disponibilidad (day_of_week, id_tiempo, estado) VALUES 
('Lunes', 1, 'available'), 
('Martes', 1, 'available'),
('Miércoles', 2, 'not_available');


-- Insertar datos en la tabla de canchas
INSERT INTO fields (name, id_municipality, id_department, id_game, id_disponibilidad) VALUES 
('Cancha 1', 1, 1, 1, 1), 
('Cancha 2', 1, 1, 2, 2),
('Cancha 3', 2, 2, 1, 1);

-- Insertar datos en la tabla de usuarios
INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality)
VALUES 
('Juan Pérez', 'juan.perez@example.com', '123456789', '1990-01-01', 'CC', '123456789', 'hashed_password_1', 'user', 1, 1),
('María López', 'maria.lopez@example.com', '987654321', '1985-05-15', 'CC', '987654321', 'hashed_password_2', 'admin', 1, 1),
('Carlos Gómez', 'carlos.gomez@example.com', '456789123', '1992-08-20', 'CC', '456789123', 'hashed_password_3', 'user', 2, 2);

-- Insertar datos en la tabla de reservas
INSERT INTO reservas (reserve_schedule, id_user, id_field)
VALUES 
('2023-10-01 09:00:00', 1, 1), 
('2023-10-01 10:00:00', 2, 2), 
('2023-10-02 11:00:00', 3, 3);

SELECT * FROM departments;
SELECT * FROM municipalities;
SELECT * FROM games;
SELECT * FROM tiempos;
SELECT * FROM disponibilidad;
SELECT * FROM fields;
SELECT * FROM users;
SELECT * FROM reservas;


-- ..........................................................................................................................
-- ### 1. Ver las reservas de un usuario
-- Esta consulta muestra todas las reservas realizadas por un usuario en función de su ID.
SELECT 
    r.reserve_schedule,
    f.name AS field_name,
    m.name AS municipality_name,
    d.name AS department_name
FROM 
    reservas r
JOIN 
    fields f ON r.id_field = f.id_field 
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality  
JOIN 
    departments d ON f.id_department = d.id_department 
WHERE 
    r.id_user = 1;
    
    
-- 2. Ver cuántos usuarios han reservado una cancha específica
-- Con esta consulta, puedes ver cuántas reservas se han hecho en una cancha específica.


SELECT 
    f.name AS field_name,
    COUNT(r.id_user) AS num_reservations
FROM 
    fields f
LEFT JOIN 
    reservas r ON f.id_field = r.id_field
WHERE 
    f.id_field = 1 
GROUP BY 
    f.name;

-- ### 3. Listar todas las reservas con detalles de usuario
-- Esta consulta proporciona una lista completa de todas las reservas, mostrando información tanto de la reserva como del usuario que la realizó.


SELECT 
    r.reserve_schedule,
    u.full_name AS user_name,
    f.name AS field_name,
    m.name AS municipality_name,
    d.name AS department_name
FROM 
    reservas r
JOIN 
    users u ON r.id_user = u.id_user
JOIN 
    fields f ON r.id_field = f.id_field
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality  
JOIN 
    departments d ON f.id_department = d.id_department 
ORDER BY 
    r.reserve_schedule DESC; 


-- ### 4. Ver todas las canchas y su disponibilidad
-- Si deseas listar todas las canchas junto con su disponibilidad y el número de reservas actuales, puedes utilizar la siguiente consulta:


SELECT 
    f.name AS field_name,
    d.name AS department_name,
    m.name AS municipality_name,
    COALESCE(COUNT(r.id_field), 0) AS num_reservations,
    f.id_disponibilidad
FROM 
    fields f
LEFT JOIN 
    reservas r ON f.id_field = r.id_field
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality 
JOIN 
    departments d ON f.id_department = d.id_department 
GROUP BY 
    f.name, m.name, d.name, f.id_disponibilidad;