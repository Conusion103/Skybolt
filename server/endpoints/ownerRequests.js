// endpoints/ownerRequests.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError } from "../utils.js";

const router = express.Router();


router.get("/owner_requests", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM owner_requests");
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error getting owner_requests", err.message);
  }
});


router.get("/owner_requests/:id_request", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!rows.length) return sendError(res, 404, "Owner request not found");
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error getting owner_request", err.message);
  }
});


router.post("/owner_requests", async (req, res) => {
  const { id_user, cancha_name, cancha_location, cancha_description } = req.body;
  if (!id_user || !cancha_name || !cancha_location) {
    return sendError(
      res,
      400,
      "id_user, cancha_name and cancha_location are requerid"
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
    sendError(res, 500, "Error creating owner_request", err.message);
  }
});


router.put("/owner_requests/:id_request", async (req, res) => {
  const { status } = req.body;

  if (!status || !["approved", "rejected"].includes(status)) {
    return sendError(res, 400, "The status must be 'approved' or 'rejected''");
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!rows.length) return sendError(res, 404, "Solicitud not found");

    const request = rows[0];

    if (request.status !== "pending") {
      return sendError(
        res,
        400,
        "This request has already been processed and cannot be modified."
      );
    }

    // update state
    await pool.query(
      "UPDATE owner_requests SET status = ? WHERE id_request = ?",
      [status, req.params.id_request]
    );


    if (status === "approved") {
      await pool.query(
        `INSERT IGNORE INTO user_roles (id_user, id_role)
         VALUES (?, (SELECT id_role FROM roles WHERE name_role = 'owner'))`,
        [request.id_user]
      );
    }

    res.json({ success: true, message: `Request updated to ${status}` });
  } catch (err) {
    sendError(res, 500, "Error updating owner_request", err.message);
  }
});


router.delete("/owner_requests/:id_request", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM owner_requests WHERE id_request = ?",
      [req.params.id_request]
    );
    if (!result.affectedRows)
      return sendError(res, 404, "Owner request not found");
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, "Error deliting owner_request", err.message);
  }
});

export default router;


