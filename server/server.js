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

// Función para responder errores en formato estándar
const sendError = (res, status, message, details = null) => {
  res.status(status).json({
    status,
    message,
    details,
  });
};

// Validar campos obligatorios para crear o actualizar usuario
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
    // En creación, password es obligatorio
    requiredFields.push("password_");
  }

  const missingFields = requiredFields.filter((field) => !data[field]);
  return missingFields;
};

// ------------------ CRUD USERS ----------------------

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

// Crear usuario
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
      message: "Usuario creado correctamente",
      id_user: result.insertId,
    });
  } catch (err) {
    sendError(res, 500, "Error al crear usuario", err.message);
  }
});

// Actualizar usuario
app.put("/api/users/:id_user", async (req, res) => {
  try {
    const missingFields = validateUserFields(req.body, true);
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
      id_department,
      id_municipality,
      password_,
      rol,
    } = req.body;

    let hashedPassword = null;
    if (password_) {
      hashedPassword = await bcrypt.hash(password_, 10);
    }

    // Construir query dinámico según si hay password o no
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
        rol = ?
    `;

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

    if (hashedPassword) {
      query += `, password_ = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id_user = ?`;
    params.push(req.params.id_user);

    const [result] = await pool.query(query, params);

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
      return sendError(res, 404, `Usuario con id ${req.params.id_user} no encontrado`);
    }
    res.json({
      status: 200,
      message: "Usuario eliminado correctamente",
    });
  } catch (err) {
    sendError(res, 500, "Error al eliminar usuario", err.message);
  }
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  sendError(res, 404, `Ruta ${req.originalUrl} no encontrada en el servidor`);
});

// Middleware global de manejo de errores inesperados (500)
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.stack);
  sendError(res, 500, "Error interno del servidor", err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});


