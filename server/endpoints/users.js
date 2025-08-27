// server/endpoints/users.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError, validateUserFields, getUserRoles, bcrypt } from "../utils.js";

const router = express.Router();

/* ==========================
   📌 Listar usuarios (con roles)
   ========================== */
router.get("/users", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    const withRoles = await Promise.all(
      rows.map(async (u) => ({
        ...u,
        roles: await getUserRoles(u.id_user),
      }))
    );
    res.json(withRoles);
  } catch (err) {
    sendError(res, 500, "Error al obtener usuarios", err.message);
  }
});

/* ==========================
   📌 Obtener usuario por ID (con roles)
   ========================== */
router.get("/users/:id_user", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (rows.length === 0)
      return sendError(
        res,
        404,
        `Usuario con id ${req.params.id_user} no encontrado`
      );
    const user = rows[0];
    user.roles = await getUserRoles(user.id_user);
    res.json(user);
  } catch (err) {
    sendError(res, 500, "Error al obtener usuario", err.message);
  }
});

/* ==========================
   📌 Crear usuario (rol "user" por defecto)
   ========================== */
// Crear usuario (rol "user" por defecto)
router.post("/users", async (req, res) => {
  const missing = validateUserFields(req.body);
  if (missing.length > 0) {
    return sendError(res, 400, "Faltan campos requeridos", missing);
  }

  try {
    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
      id_municipality,
      password_,
    } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password_, 10);

    // Insertar usuario
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, id_municipality, password_)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document,
        id_municipality,
        hashedPassword,
      ]
    );

    const newUserId = result.insertId;

    // ✅ Asignar rol "user" por defecto (ya existe en la tabla `roles`)
    await pool.query(
      `INSERT INTO user_roles (id_user, id_role)
       VALUES (?, (SELECT id_role FROM roles WHERE name_role = 'user'))`,
      [newUserId]
    );

    res
      .status(201)
      .json({ message: "Usuario creado con rol user", id_user: newUserId });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error al crear el usuario", error.message);
  }
});


/* ==========================
   📌 Actualizar usuario
   ========================== */
router.put("/users/:id_user", async (req, res) => {
  const {
    full_name,
    email,
    phone,
    birthdate,
    document_type,
    id_document,
    id_municipality,
    password_,
    image_path,
    roles,
  } = req.body;

  try {
    const [currRows] = await pool.query(
      "SELECT * FROM users WHERE id_user = ?",
      [req.params.id_user]
    );
    if (!currRows.length)
      return sendError(
        res,
        404,
        `Usuario con id ${req.params.id_user} no encontrado`
      );
    const curr = currRows[0];

    const hashed = password_
      ? await bcrypt.hash(password_, 10)
      : curr.password_;

    const [result] = await pool.query(
      `UPDATE users SET
        full_name = ?, email = ?, phone = ?, birthdate = ?, document_type = ?, id_document = ?,
        id_municipality = ?, password_ = ?, image_path = ?
       WHERE id_user = ?`,
      [
        full_name ?? curr.full_name,
        email ?? curr.email,
        phone ?? curr.phone,
        birthdate ?? curr.birthdate,
        document_type ?? curr.document_type,
        id_document ?? curr.id_document,
        id_municipality ?? curr.id_municipality,
        hashed,
        image_path ?? curr.image_path,
        req.params.id_user,
      ]
    );

    // Actualizar roles si vienen en el body
    if (Array.isArray(roles)) {
      await pool.query("DELETE FROM user_roles WHERE id_user = ?", [
        req.params.id_user,
      ]);
      const roleIds = [];
      for (const r of roles) {
        if (typeof r === "number") roleIds.push(r);
        else {
          const [rr] = await pool.query(
            "SELECT id_role FROM roles WHERE name_role = ?",
            [r]
          );
          if (rr.length) roleIds.push(rr[0].id_role);
        }
      }
      for (const id_role of roleIds) {
        await pool.query(
          "INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)",
          [req.params.id_user, id_role]
        );
      }
    }

    if (result.affectedRows === 0)
      return sendError(res, 404, "Usuario no encontrado");

    res.json({ status: 200, message: "Usuario actualizado correctamente" });
  } catch (err) {
    sendError(res, 500, "Error al actualizar usuario", err.message);
  }
});

/* ==========================
   📌 Eliminar usuario
   ========================== */
router.delete("/users/:id_user", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (result.affectedRows === 0)
      return sendError(res, 404, "Usuario no encontrado");
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, "Error al eliminar usuario", err.message);
  }
});

export default router;

