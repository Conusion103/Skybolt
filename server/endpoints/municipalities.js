// endpoints/municipalities.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError } from "../utils.js";

const router = express.Router();

router.get("/municipalities", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM municipalities");
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error getting municipalitiess", err.message);
  }
});

router.get("/municipalities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM municipalities WHERE id_municipality = ?", [id]);

    if (rows.length === 0) {
      return sendError(res, 404, "municipalities not found");
    }

    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error getting municipalities", err.message);
  }
});

router.post("/municipalities", async (req, res) => {
  try {
    const { name_municipality, id_department } = req.body;

    if (!name_municipality || !id_department) {
      return sendError(res, 400, "The municipality name and department ID are required.");
    }

    const [result] = await pool.query(
      "INSERT INTO municipalities (name_municipality, id_department) VALUES (?, ?)",
      [name_municipality, id_department]
    );

    res.status(201).json({ id: result.insertId, name_municipality, id_department });
  } catch (err) {
    sendError(res, 500, "Error creating municipalities", err.message);
  }
});


router.put("/municipalities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name_municipality, id_department } = req.body;

    const [result] = await pool.query(
      "UPDATE municipalities SET name_municipality = ?, id_department = ? WHERE id_municipality = ?",
      [name_municipality, id_department, id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "municipalities not found");
    }

    res.json({ message: "municipalities updated correctly" });
  } catch (err) {
    sendError(res, 500, "Error updating municipalities", err.message);
  }
});


router.delete("/municipalities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM municipalities WHERE id_municipality = ?", [id]);

    if (result.affectedRows === 0) {
      return sendError(res, 404, "municipalities not found");
    }

    res.json({ message: "municipalities removed successfully" });
  } catch (err) {
    sendError(res, 500, "Error deleting municipalities", err.message);
  }
});


router.get("/municipalities-with-departments", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id_municipality, m.name_municipality, d.id_department, d.name_department
      FROM municipalities m
      INNER JOIN departments d ON m.id_department = d.id_department
    `);

    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error getting municipalities with departments", err.message);
  }
});

export default router;


