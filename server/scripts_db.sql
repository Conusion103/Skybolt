-- Crear base de datos
CREATE DATABASE skybolt;
USE skybolt;

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

-- Tabla relación usuario - roles (muchos a muchos)
CREATE TABLE user_roles (
    id_user INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
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
CREATE TABLE tiempos (
    id_tiempo INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de disponibilidad
CREATE TABLE disponibilidad (
    id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL,
    id_tiempo INT NOT NULL,
    estado ENUM('available', 'not_available') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tiempo) REFERENCES tiempos(id_tiempo)
);

-- Tabla de canchas
CREATE TABLE fields (
    id_field INT AUTO_INCREMENT PRIMARY KEY,
    name_field VARCHAR(255) NOT NULL,
    id_municipality INT NOT NULL,
    id_game INT NOT NULL,
    id_disponibilidad INT NOT NULL,
    id_owner INT DEFAULT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipality) REFERENCES municipalities(id_municipality),
    FOREIGN KEY (id_game) REFERENCES games(id_game),
    FOREIGN KEY (id_disponibilidad) REFERENCES disponibilidad(id_disponibilidad),
    FOREIGN KEY (id_owner) REFERENCES users(id_user)
);

-- Tabla de reservas
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

-- Tabla para solicitudes de ser owner
CREATE TABLE owner_requests (
    id_request INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    cancha_name VARCHAR(255) NOT NULL,
    cancha_location VARCHAR(255) NOT NULL,
    cancha_description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_field INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_field) REFERENCES fields(id_field)
);



-- INSERT DATA


-- Insertar departamentos (mantener igual)
INSERT INTO departments (name_department) VALUES
('Antioquia'),         -- id = 1
('Cundinamarca'),      -- id = 2
('Valle del Cauca'),   -- id = 3
('Atlántico'),         -- id = 4
('Bolívar'),           -- id = 5
('Magdalena');         -- id = 6


-- Insertar municipios (mantener igual, IDs automáticos incrementales)
INSERT INTO municipalities (id_department, name_municipality) VALUES
(1, 'Medellín'), (1, 'Envigado'), (1, 'Bello'), (1, 'Itagüí'), (1, 'Rionegro'),
(2, 'Bogotá'), (2, 'Soacha'), (2, 'Chía'), (2, 'Zipaquirá'), (2, 'Girardot'),
(3, 'Cali'), (3, 'Palmira'), (3, 'Yumbo'), (3, 'Buenaventura'), (3, 'Tuluá'),
(4, 'Barranquilla'), (4, 'Soledad'), (4, 'Malambo'), (4, 'Puerto Colombia'), (4, 'Sabanalarga'),
(5, 'Cartagena'), (5, 'Magangué'), (5, 'Turbaco'), (5, 'El Carmen de Bolívar'), (5, 'Arjona'),
(6, 'Santa Marta'), (6, 'Ciénaga'), (6, 'Fundación'), (6, 'El Banco'), (6, 'Plato');


-- Insertar roles iniciales (sin guest)
INSERT INTO roles (name_role) VALUES
('admin'),
('owner'),
('user');


-- Insertar usuarios (sin campo rol)
INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, password_, id_municipality) VALUES
('Ana Martínez', 'ana@example.com', '3001234567', '1990-05-10', 'CC', '100000001', 'pass1hash', 1),  -- Medellín
('Luis Gómez', 'luis@example.com', '3007654321', '1992-08-22', 'CC', '100000002', 'pass2hash', 1), -- Medellín
('Carla Ruiz', 'carla@example.com', '3112345678', '1988-11-15', 'CC', '100000003', 'pass3hash', 2);  -- Chía 


-- Asignar roles a usuarios en user_roles (ejemplo)
-- Asumamos: Ana es admin, Luis es user, Carla es owner
INSERT INTO user_roles (id_user, id_role) VALUES
(1, 1),  -- Ana -> admin
(2, 3),  -- Luis -> user
(3, 2);  -- Carla -> owner


-- Insertar datos en la tabla de juegos (igual)
INSERT INTO games (name_game) VALUES
('Fútbol'),
('Baloncesto'),
('Voleibol');


-- Insertar datos en la tabla de tiempos (igual)
INSERT INTO tiempos (hora_inicio, hora_final) VALUES
('08:00:00', '09:00:00'),
('09:00:00', '10:00:00'),
('10:00:00', '11:00:00');


-- Insertar datos en la tabla de disponibilidad (igual)
INSERT INTO disponibilidad (day_of_week, id_tiempo, estado) VALUES
('Lunes', 1, 'available'),
('Martes', 2, 'not_available'),
('Miércoles', 3, 'available');


-- Insertar datos en la tabla de canchas
-- Ajustamos id_municipality (ver los ids reales):
-- Medellín (id 1), Envigado (id 2), Bogotá (id 6), Cali (id 11)
-- Ponemos id_owner (por ejemplo, dueño de Ana - id 1 y Carla - id 3)

INSERT INTO fields (name_field, id_municipality, id_game, id_disponibilidad, id_owner) VALUES
('Cancha Medellín 1', 1, 1, 1, 1),   -- fútbol, disponible lunes, dueño Ana
('Cancha Envigado', 2, 2, 2, NULL),  -- baloncesto, no disponible martes, sin dueño
('Cancha Bogotá 1', 6, 1, 3, 3),     -- fútbol, disponible miércoles, dueña Carla
('Cancha Cali', 11, 3, 1, NULL);      -- voleibol, disponible lunes, sin dueño


-- Insertar datos en la tabla de reservas (usar usuarios y canchas con ids correctos)
INSERT INTO reservas (reserve_schedule, id_user, id_field) VALUES
('2025-09-01 08:00:00', 2, 1),  -- Luis reserva Cancha Medellín 1
('2025-09-02 09:00:00', 3, 3),  -- Carla reserva Cancha Bogotá 1
('2025-09-03 10:00:00', 2, 2);  -- Luis reserva Cancha Envigado

INSERT INTO reviews (id_user, id_field, rating, comment) VALUES
(2, 1, 5, 'La cancha estaba en excelente estado, muy recomendable.'),
(3, 3, 4, 'Buena cancha, pero el acceso puede mejorar.'),
(1, 4, 3, 'Regular, esperaba mejor mantenimiento.');

INSERT INTO owner_requests (id_user, cancha_name, cancha_location, cancha_description) VALUES
(2, 'Cancha Nueva', 'Barrio Central', 'Cancha con césped natural, capacidad para 50 personas');



SELECT * FROM departments;
SELECT * FROM municipalities;
SELECT * FROM games;
SELECT * FROM tiempos;
SELECT * FROM disponibilidad;
SELECT * FROM fields;
SELECT * FROM users;
SELECT * FROM reservas;
SELECT * FROM reviews;
SELECT * FROM owner_requests;


-- ..........................................................................................................................
-- ### 1. Ver las reservas de un usuario
-- Esta consulta muestra todas las reservas realizadas por un usuario en función de su ID.
SELECT 
    r.reserve_schedule,
    f.name_field AS field_name,
    m.name_municipality AS municipality_name,
    d.name_deparment AS department_name
FROM 
    reservas r
JOIN 
    fields f ON r.id_field = f.id_field 
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality  
JOIN 
    departments d ON m.id_department = d.id_department 
WHERE 
    r.id_user = 1;

    
-- 2. Ver cuántos usuarios han reservado una cancha específica
-- Con esta consulta, puedes ver cuántas reservas se han hecho en una cancha específica.


SELECT 
    f.name_field AS field_name,
    COUNT(r.id_user) AS num_reservations
FROM 
    fields f
LEFT JOIN 
    reservas r ON f.id_field = r.id_field
WHERE 
    f.id_field = 1 
GROUP BY 
    f.name_field;


-- ### 3. Listar todas las reservas con detalles de usuario
-- Esta consulta proporciona una lista completa de todas las reservas, mostrando información tanto de la reserva como del usuario que la realizó.


SELECT 
    r.reserve_schedule,
    u.full_name AS user_name,
    f.name_field AS field_name,
    m.name_municipality AS municipality_name,
    d.name_deparment AS department_name
FROM 
    reservas r
JOIN 
    users u ON r.id_user = u.id_user
JOIN 
    fields f ON r.id_field = f.id_field
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality  
JOIN 
    departments d ON m.id_department = d.id_department 
ORDER BY 
    r.reserve_schedule DESC;



-- ### 4. Ver todas las canchas y su disponibilidad
-- Si deseas listar todas las canchas junto con su disponibilidad y el número de reservas actuales, puedes utilizar la siguiente consulta:

SELECT 
    f.name_field AS field_name,
    d.name_deparment AS department_name,
    m.name_municipality AS municipality_name,
    COALESCE(COUNT(r.id_field), 0) AS num_reservations,
    dis.day_of_week,
    t.hora_inicio,
    t.hora_final,
    dis.estado
FROM 
    fields f
LEFT JOIN 
    reservas r ON f.id_field = r.id_field
JOIN 
    disponibilidad dis ON f.id_disponibilidad = dis.id_disponibilidad
JOIN 
    tiempos t ON dis.id_tiempo = t.id_tiempo
JOIN 
    municipalities m ON f.id_municipality = m.id_municipality
JOIN 
    departments d ON m.id_department = d.id_department
GROUP BY 
    f.name_field,
    d.name_deparment,
    m.name_municipality,
    dis.day_of_week,
    t.hora_inicio,
    t.hora_final,
    dis.estado;





-- cambio de rol

DELIMITER //

CREATE PROCEDURE change_user_role(
    IN p_admin_id INT,
    IN p_target_user_id INT,
    IN p_new_role VARCHAR(20)
)
BEGIN
    DECLARE admin_role VARCHAR(20);

    -- Verificar que quien solicita el cambio es admin
    SELECT rol INTO admin_role FROM users WHERE id_user = p_admin_id;

    IF admin_role = 'admin' THEN
        UPDATE users 
        SET rol = p_new_role 
        WHERE id_user = p_target_user_id;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Solo administradores pueden cambiar roles.';
    END IF;
END //

DELIMITER ;
