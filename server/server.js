import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "./conexion_db.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ----------------- HELPER FUNCTIONS -----------------

// Verificar conexión con DB
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a la base de datos exitosa");
    connection.release();
  } catch (err) {
    console.error("❌ Error de conexión a la base de datos:", err.message);
    process.exit(1);
  }
};
testDbConnection();

// Función estándar de error
const sendError = (res, req, status, message, details = null) => {
  res.status(status).json({
    status,
    endpoint: req.originalUrl,
    method: req.method,
    message,
    details,
  });
};

// Validación de campos
const validateUserFields = (data, isUpdate = false) => {
  const requiredFields = [
    "full_name",
    "email",
    "phone",
    "birthdate",
    "document_type",
    "rol",
  ];

  if (!isUpdate) {
    requiredFields.push("password_"); // password obligatorio solo al crear
  }

  return requiredFields.filter((field) => !data[field]);
};

// ----------------- RUTAS USERS CRUD -----------------

// GET todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    sendError(res, req, 500, "Error al obtener usuarios", err.message);
  }
});

// GET un usuario por id
app.get("/api/users/:id_user", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (rows.length === 0) {
      return sendError(res, req, 404, `Usuario ${req.params.id_user} no encontrado`);
    }
    res.json(rows[0]);
  } catch (err) {
    sendError(res, req, 500, "Error al obtener usuario", err.message);
  }
});

// POST crear usuario
app.post("/api/users", async (req, res) => {
  try {
    const missingFields = validateUserFields(req.body);
    if (missingFields.length > 0) {
      return sendError(
        res,
        req,
        400,
        "Faltan campos obligatorios",
        `Campos: ${missingFields.join(", ")}`
      );
    }

    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
      id_department,
      id_municipality,
      password_,
      rol,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password_, 10);

    const [result] = await pool.query(
      `INSERT INTO users 
      (full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document || null,
        id_department || null,
        id_municipality || null,
        hashedPassword,
        rol,
      ]
    );

    res.status(201).json({
      status: 201,
      endpoint: req.originalUrl,
      method: req.method,
      message: "Usuario creado correctamente",
      id_user: result.insertId,
    });
  } catch (err) {
    sendError(res, req, 500, "Error al crear usuario", err.message);
  }
});

// PUT actualizar usuario
app.put("/api/users/:id_user", async (req, res) => {
  try {
    const missingFields = validateUserFields(req.body, true);
    if (missingFields.length > 0) {
      return sendError(
        res,
        req,
        400,
        "Faltan campos obligatorios",
        `Campos: ${missingFields.join(", ")}`
      );
    }

    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
      id_department,
      id_municipality,
      password_,
      rol,
    } = req.body;

    let query = `
      UPDATE users SET
        full_name = ?,
        email = ?,
        phone = ?,
        birthdate = ?,
        document_type = ?,
        id_document = ?,
        id_department = ?,
        id_municipality = ?,
        rol = ?`;

    const params = [
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document || null,
      id_department || null,
      id_municipality || null,
      rol,
    ];

    if (password_) {
      const hashedPassword = await bcrypt.hash(password_, 10);
      query += `, password_ = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id_user = ?`;
    params.push(req.params.id_user);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return sendError(res, req, 404, `Usuario ${req.params.id_user} no encontrado`);
    }

    res.json({
      status: 200,
      endpoint: req.originalUrl,
      method: req.method,
      message: "Usuario actualizado correctamente",
    });
  } catch (err) {
    sendError(res, req, 500, "Error al actualizar usuario", err.message);
  }
});

// DELETE usuario
app.delete("/api/users/:id_user", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (result.affectedRows === 0) {
      return sendError(res, req, 404, `Usuario ${req.params.id_user} no encontrado`);
    }
    res.json({
      status: 200,
      endpoint: req.originalUrl,
      method: req.method,
      message: "Usuario eliminado correctamente",
    });
  } catch (err) {
    sendError(res, req, 500, "Error al eliminar usuario", err.message);
  }
});

// 404 Not Found
app.use((req, res) => {
  sendError(res, req, 404, `Ruta no encontrada`);
});

// 500 Internal Error
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.stack);
  sendError(res, req, 500, "Error interno del servidor", err.message);
});

// ----------------- SERVER -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});


