// endpoints/ownerRequests.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError } from "../utils.js";

const router = express.Router();

/* ==========================
   📌 Listar solicitudes
   ========================== */
router.get("/owner_requests", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM owner_requests");
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error al obtener owner_requests", err.message);
  }
});

/* ==========================
   📌 Obtener una solicitud
   ========================== */
router.get("/owner_requests/:id_request", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!rows.length) return sendError(res, 404, "Owner request no encontrada");
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error al obtener owner_request", err.message);
  }
});

/* ==========================
   📌 Crear solicitud
   ========================== */
router.post("/owner_requests", async (req, res) => {
  const { id_user, cancha_name, cancha_location, cancha_description } = req.body;
  if (!id_user || !cancha_name || !cancha_location) {
    return sendError(
      res,
      400,
      "id_user, cancha_name y cancha_location son requeridos"
    );
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO owner_requests (id_user, cancha_name, cancha_location, cancha_description, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [id_user, cancha_name, cancha_location, cancha_description || null]
    );
    res.status(201).json({ id_request: result.insertId });
  } catch (err) {
    sendError(res, 500, "Error al crear owner_request", err.message);
  }
});

/* ==========================
   📌 Actualizar estado solicitud
   ========================== */
router.put("/owner_requests/:id_request", async (req, res) => {
  const { status } = req.body;

  if (!status || !["approved", "rejected"].includes(status)) {
    return sendError(res, 400, "El estado debe ser 'approved' o 'rejected'");
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!rows.length) return sendError(res, 404, "Solicitud no encontrada");

    const request = rows[0];

    // Solo se puede cambiar si está pendiente
    if (request.status !== "pending") {
      return sendError(
        res,
        400,
        "Esta solicitud ya fue procesada y no puede ser modificada."
      );
    }

    // Actualizar estado
    await pool.query(
      "UPDATE owner_requests SET status = ? WHERE id_request = ?",
      [status, req.params.id_request]
    );

    // Si se aprueba, asignar rol "owner" al usuario
    if (status === "approved") {
      await pool.query(
        `INSERT IGNORE INTO user_roles (id_user, id_role)
         VALUES (?, (SELECT id_role FROM roles WHERE name_role = 'owner'))`,
        [request.id_user]
      );
    }

    res.json({ success: true, message: `Solicitud actualizada a ${status}` });
  } catch (err) {
    sendError(res, 500, "Error al actualizar owner_request", err.message);
  }
});

/* ==========================
   📌 Eliminar solicitud
   ========================== */
router.delete("/owner_requests/:id_request", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!result.affectedRows)
      return sendError(res, 404, "Owner request no encontrada");
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, "Error al eliminar owner_request", err.message);
  }
});

export default router;


