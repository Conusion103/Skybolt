import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "./conexion_db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Testear conexión DB
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a la base de datos exitosa");
    connection.release();
  } catch (err) {
    console.error("Error de conexión a la base de datos:", err.message);
    process.exit(1);
  }
};

testDbConnection();



// --------------------------------------login 

// revisar el tema del jwt 

// npm install express jsonwebtoken bcryptjs dotenv
// en .env JWT_SECRET=tu_clave_super_segura - PORT=3000

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y password son requeridos" });

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_);

    if (!isMatch)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const payload = {
      id_user: user.id_user,
      full_name: user.full_name,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------- CRUD USERS ------------------------

// Obtener todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users`);
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error al obtener usuarios", err.message);
  }
});

// Obtener usuario por id_user
app.get("/api/users/:id_user", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (rows.length === 0) {
      return sendError(res, 404, `Usuario con id ${req.params.id_user} no encontrado`);
    }
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error al obtener usuario", err.message);
  }
});

// Crear nuevo usuario con contraseña hasheada
// Crear nuevo usuario
app.post("/api/users", async (req, res) => {
  try {
    const missingFields = validateUserFields(req.body);
    if (missingFields.length > 0) {
      return sendError(
        res,
        400,
        "Faltan campos obligatorios",
        `Campos faltantes: ${missingFields.join(", ")}`
      );
    }

    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
        id_municipality,
      password_,
      rol,
    } = req.body;

  if (
    !full_name ||
    !email ||
    !phone ||
    !birthdate ||
    !document_type ||
    !id_document ||
    !id_municipality ||
    !password_ ||
    !rol
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password_, 10);

    const [result] = await pool.query(
      `INSERT INTO users 
      (full_name, email, phone, birthdate, document_type, id_document, id_municipality, password_, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      `INSERT INTO users 
      (full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document,
        id_municipality,
        hashedPassword,
        rol,
      ]
    );

    res.status(201).json({ id_user: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Actualizar un usuario con contraseña hasheada
// Actualizar usuario
app.put("/api/users/:id_user", async (req, res) => {
  const {
    full_name,
    email,
    phone,
    birthdate,
    document_type,
    id_document,
    id_municipality,
    password_,
    rol,
  } = req.body;

  if (
    !full_name ||
    !email ||
    !phone ||
    !birthdate ||
    !document_type ||
    !id_document ||
    !id_municipality ||
    !password_ ||
    !rol
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password_, 10);

    const [result] = await pool.query(
      `UPDATE users SET 
        full_name = ?, 
        email = ?, 
        phone = ?, 
        birthdate = ?, 
        document_type = ?, 
        id_document = ?, 
        id_municipality = ?, 
        password_ = ?, 
        rol = ?
      WHERE id_user = ?`,
      [
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document,
        id_municipality,
        hashedPassword,
        rol,
        req.params.id_user,
      ]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, `Usuario con id ${req.params.id_user} no encontrado`);
    }

    res.json({
      status: 200,
      message: "Usuario actualizado correctamente",
    });
  } catch (err) {
    sendError(res, 500, "Error al actualizar usuario", err.message);
  }
});


// Eliminar usuario
app.delete("/api/users/:id_user", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// games ------------------------------------------------------------------------------------------------
// Obtener todos los juegos
app.get("/api/games", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener juego por ID
app.get("/api/games/:id_game", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games WHERE id_game = ?", [
      req.params.id_game,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Game not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear juego
app.post("/api/games", async (req, res) => {
  const { name_game } = req.body;
  if (!name_game) return res.status(400).json({ error: "name_game is required" });

  try {
    const [result] = await pool.query("INSERT INTO games (name_game) VALUES (?)", [
      name_game,
    ]);
    res.status(201).json({ id_game: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar juego
app.put("/api/games/:id_game", async (req, res) => {
  const { name_game } = req.body;
  if (!name_game) return res.status(400).json({ error: "name_game is required" });

  try {
    const [result] = await pool.query(
      "UPDATE games SET name_game = ? WHERE id_game = ?",
      [name_game, req.params.id_game]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Game not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar juego
app.delete("/api/games/:id_game", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM games WHERE id_game = ?", [
      req.params.id_game,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Game not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// horarios ----------------------------------------------------------------------------
// Obtener todos los tiempos
app.get("/api/tiempos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tiempos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener tiempo por ID
app.get("/api/tiempos/:id_tiempo", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tiempos WHERE id_tiempo = ?", [
      req.params.id_tiempo,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Tiempo not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear tiempo
app.post("/api/tiempos", async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final)
    return res.status(400).json({ error: "hora_inicio and hora_final are required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO tiempos (hora_inicio, hora_final) VALUES (?, ?)",
      [hora_inicio, hora_final]
    );
    res.status(201).json({ id_tiempo: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar tiempo
app.put("/api/tiempos/:id_tiempo", async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final)
    return res.status(400).json({ error: "hora_inicio and hora_final are required" });

  try {
    const [result] = await pool.query(
      "UPDATE tiempos SET hora_inicio = ?, hora_final = ? WHERE id_tiempo = ?",
      [hora_inicio, hora_final, req.params.id_tiempo]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Tiempo not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar tiempo
app.delete("/api/tiempos/:id_tiempo", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tiempos WHERE id_tiempo = ?", [
      req.params.id_tiempo,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Tiempo not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// disponibilidad --------------------------------------------------------------------
// Obtener todas las disponibilidades
app.get("/api/disponibilidad", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM disponibilidad");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener disponibilidad por ID
app.get("/api/disponibilidad/:id_disponibilidad", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM disponibilidad WHERE id_disponibilidad = ?",
      [req.params.id_disponibilidad]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Disponibilidad not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear disponibilidad
app.post("/api/disponibilidad", async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado)
    return res
      .status(400)
      .json({ error: "day_of_week, id_tiempo and estado are required" });

  if (!["available", "not_available"].includes(estado))
    return res.status(400).json({ error: "estado must be 'available' or 'not_available'" });

  try {
    const [result] = await pool.query(
      "INSERT INTO disponibilidad (day_of_week, id_tiempo, estado) VALUES (?, ?, ?)",
      [day_of_week, id_tiempo, estado]
    );
    res.status(201).json({ id_disponibilidad: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar disponibilidad
app.put("/api/disponibilidad/:id_disponibilidad", async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado)
    return res
      .status(400)
      .json({ error: "day_of_week, id_tiempo and estado are required" });

  if (!["available", "not_available"].includes(estado))
    return res.status(400).json({ error: "estado must be 'available' or 'not_available'" });

  try {
    const [result] = await pool.query(
      "UPDATE disponibilidad SET day_of_week = ?, id_tiempo = ?, estado = ? WHERE id_disponibilidad = ?",
      [day_of_week, id_tiempo, estado, req.params.id_disponibilidad]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Disponibilidad not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar disponibilidad
app.delete("/api/disponibilidad/:id_disponibilidad", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM disponibilidad WHERE id_disponibilidad = ?",
      [req.params.id_disponibilidad]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Disponibilidad not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// canchas -------------------------------------------------------------------------
// Obtener todas las canchas
app.get("/api/fields", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fields");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener cancha por ID
app.get("/api/fields/:id_field", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fields WHERE id_field = ?", [
      req.params.id_field,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Field not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear cancha
app.post("/api/fields", async (req, res) => {
  const {
    name_field,
    id_municipality,
    id_game,
    id_disponibilidad,
    id_owner,
    image_path,
  } = req.body;

  if (
    !name_field ||
    !id_municipality ||
    !id_game ||
    !id_disponibilidad
  ) {
    return res
      .status(400)
      .json({ error: "name_field, id_municipality, id_game and id_disponibilidad are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO fields 
      (name_field, id_municipality, id_game, id_disponibilidad, id_owner, image_path)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name_field,
        id_municipality,
        id_game,
        id_disponibilidad,
        id_owner || null,
        image_path || null,
      ]
    );

    res.status(201).json({ id_field: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cancha
app.put("/api/fields/:id_field", async (req, res) => {
  const {
    name_field,
    id_municipality,
    id_game,
    id_disponibilidad,
    id_owner,
    image_path,
  } = req.body;

  if (
    !name_field ||
    !id_municipality ||
    !id_game ||
    !id_disponibilidad
  ) {
    return res
      .status(400)
      .json({ error: "name_field, id_municipality, id_game and id_disponibilidad are required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE fields SET
      name_field = ?, 
      id_municipality = ?, 
      id_game = ?, 
      id_disponibilidad = ?, 
      id_owner = ?, 
      image_path = ?
      WHERE id_field = ?`,
      [
        name_field,
        id_municipality,
        id_game,
        id_disponibilidad,
        id_owner || null,
        image_path || null,
        req.params.id_field,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Field not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cancha
app.delete("/api/fields/:id_field", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM fields WHERE id_field = ?", [
      req.params.id_field,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Field not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// roles -----------------------------------
// Obtener todos los roles
app.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM roles");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener rol por ID
app.get("/api/roles/:id_rol", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM roles WHERE id_rol = ?", [
      req.params.id_rol,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Role not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear rol
app.post("/api/roles", async (req, res) => {
  const { rol_name } = req.body;
  if (!rol_name) return res.status(400).json({ error: "rol_name is required" });

  try {
    const [result] = await pool.query("INSERT INTO roles (rol_name) VALUES (?)", [
      rol_name,
    ]);
    res.status(201).json({ id_rol: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar rol
app.put("/api/roles/:id_rol", async (req, res) => {
  const { rol_name } = req.body;
  if (!rol_name) return res.status(400).json({ error: "rol_name is required" });

  try {
    const [result] = await pool.query(
      "UPDATE roles SET rol_name = ? WHERE id_rol = ?",
      [rol_name, req.params.id_rol]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Role not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar rol
app.delete("/api/roles/:id_rol", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM roles WHERE id_rol = ?", [
      req.params.id_rol,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Role not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// reservas ----------------------------------------------------------------
// Obtener todas las reservas
app.get("/api/reservas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reservas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reserva por ID
app.get("/api/reservas/:id_reserva", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reservas WHERE id_reserva = ?", [
      req.params.id_reserva,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Reserva not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear reserva
app.post("/api/reservas", async (req, res) => {
  const { id_user, id_field, reserve_schedule } = req.body;

  if (!id_user || !id_field || !reserve_schedule)
    return res
      .status(400)
      .json({ error: "id_user, id_field and reserve_schedule are required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO reservas (id_user, id_field, reserve_schedule) VALUES (?, ?, ?)",
      [id_user, id_field, reserve_schedule]
    );
    res.status(201).json({ id_reserva: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar reserva
app.put("/api/reservas/:id_reserva", async (req, res) => {
  const { id_user, id_field, reserve_schedule } = req.body;

  if (!id_user || !id_field || !reserve_schedule)
    return res
      .status(400)
      .json({ error: "id_user, id_field and reserve_schedule are required" });

  try {
    const [result] = await pool.query(
      "UPDATE reservas SET id_user = ?, id_field = ?, reserve_schedule = ? WHERE id_reserva = ?",
      [id_user, id_field, reserve_schedule, req.params.id_reserva]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Reserva not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar reserva
app.delete("/api/reservas/:id_reserva", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM reservas WHERE id_reserva = ?", [
      req.params.id_reserva,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Reserva not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// owner_request -------------------------------------------------------------------
// Obtener todas las solicitudes de owner
app.get("/api/owner_requests", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM owner_requests");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener solicitud owner por ID
app.get("/api/owner_requests/:id_request", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Request not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear solicitud owner
app.post("/api/owner_requests", async (req, res) => {
  const { id_user, request_date, status } = req.body;

  if (!id_user || !request_date || !status)
    return res
      .status(400)
      .json({ error: "id_user, request_date and status are required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO owner_requests (id_user, request_date, status) VALUES (?, ?, ?)",
      [id_user, request_date, status]
    );
    res.status(201).json({ id_request: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar solicitud owner
app.put("/api/owner_requests/:id_request", async (req, res) => {
  const { id_user, request_date, status } = req.body;

  if (!id_user || !request_date || !status)
    return res
      .status(400)
      .json({ error: "id_user, request_date and status are required" });

  try {
    const [result] = await pool.query(
      "UPDATE owner_requests SET id_user = ?, request_date = ?, status = ? WHERE id_request = ?",
      [id_user, request_date, status, req.params.id_request]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Request not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar solicitud owner
app.delete("/api/owner_requests/:id_request", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Request not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// reviews------------------------------------------------------------------------
// Obtener todas las reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reviews");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener review por ID
app.get("/api/reviews/:id_review", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id_review = ?", [
      req.params.id_review,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Review not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear review
app.post("/api/reviews", async (req, res) => {
  const { id_user, id_field, score, comment } = req.body;

  if (!id_user || !id_field || !score)
    return res
      .status(400)
      .json({ error: "id_user, id_field and score are required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO reviews (id_user, id_field, score, comment) VALUES (?, ?, ?, ?)",
      [id_user, id_field, score, comment || null]
    );
    res.status(201).json({ id_review: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar review
app.put("/api/reviews/:id_review", async (req, res) => {
  const { id_user, id_field, score, comment } = req.body;

  if (!id_user || !id_field || !score)
    return res
      .status(400)
      .json({ error: "id_user, id_field and score are required" });

  try {
    const [result] = await pool.query(
      "UPDATE reviews SET id_user = ?, id_field = ?, score = ?, comment = ? WHERE id_review = ?",
      [id_user, id_field, score, comment || null, req.params.id_review]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Review not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar review
app.delete("/api/reviews/:id_review", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM reviews WHERE id_review = ?", [
      req.params.id_review,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Review not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --------------------- consultas avanzadas
// Ver las reservas de un usuario (con detalles de cancha y ubicación)
app.get("/api/users/:id_user/reservas", async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
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
        r.id_user = ?`,
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Ver cuántos usuarios han reservado una cancha específica
app.get("/api/fields/:id_field/reservas/count", async (req, res) => {
  const { id_field } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        f.name_field AS field_name,
        COUNT(r.id_user) AS num_reservations
      FROM 
        fields f
      LEFT JOIN 
        reservas r ON f.id_field = r.id_field
      WHERE 
        f.id_field = ?
      GROUP BY 
        f.name_field`,
      [id_field]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Field not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Listar todas las reservas con detalles de usuario
app.get("/api/reservas/detalles", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
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
        r.reserve_schedule DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Ver todas las canchas y su disponibilidad junto con número de reservas
app.get("/api/fields/disponibilidad", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
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
        dis.estado`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// cambio de rol 
app.post("/api/users/change-role", async (req, res) => {
  const { admin_id, target_user_id, new_role } = req.body;

  if (!admin_id || !target_user_id || !new_role) {
    return res.status(400).json({ error: "admin_id, target_user_id and new_role are required" });
  }

  try {
    await pool.query("CALL change_user_role(?, ?, ?)", [admin_id, target_user_id, new_role]);
    res.json({ success: true, message: "Role changed successfully" });
  } catch (err) {
    // En caso de error personalizado lanzado en el procedimiento almacenado
    if (err.sqlState === "45000") {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});










// ------------------------------- INICIAR SERVIDOR ------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});



