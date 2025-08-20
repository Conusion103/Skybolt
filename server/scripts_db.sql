CREATE DATABASE skybolt;

USE skybolt;

-- Crear tabla de departamentos
CREATE TABLE departments (
    id_department INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de municipios
CREATE TABLE municipalities (
    id_municipality INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de juegos
CREATE TABLE games (
    id_game INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de tiempos
CREATE TABLE tiempos (
    id_tiempo INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de disponibilidad
CREATE TABLE disponibilidad (
    id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL,
    id_tiempo INT NOT NULL,
    estado ENUM('available', 'not_available') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tiempo) REFERENCES tiempos(id_tiempo)
);

-- Crear tabla de canchas
CREATE TABLE fields (
    id_field INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_municipality INT NOT NULL,
    id_department INT NOT NULL,
    id_game INT NOT NULL,
    id_disponibilidad INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality),
    FOREIGN KEY (id_department) REFERENCES departments(id_department),
    FOREIGN KEY (id_game) REFERENCES games(id_game),
    FOREIGN KEY (id_disponibilidad) REFERENCES disponibilidad(id_disponibilidad)
);

-- Crear tabla de usuarios
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    id_document VARCHAR(50) NOT NULL UNIQUE,
    id_department INT NOT NULL,
    id_municipality INT NOT NULL,
    password_ VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user', 'guest') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_department) REFERENCES departments(id_department),
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality)
);

-- Crear tabla de reservas
CREATE TABLE reservas (
    id_reserve INT AUTO_INCREMENT PRIMARY KEY,
    reserve_schedule DATETIME NOT NULL,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_field) REFERENCES fields(id_field)
);


-- Insertar datos en la tabla de departamentos
INSERT INTO departments (name) VALUES ('Departamento 1'), ('Departamento 2');

-- Insertar datos en la tabla de municipios
INSERT INTO municipalities (name) VALUES ('Municipio 1'), ('Municipio 2');

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