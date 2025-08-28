// endpoints/departments.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError } from "../utils.js";

const router = express.Router();

// 📌 Obtener todos los departamentos
router.get("/departments", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM departments");
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error al obtener departamentos", err.message);
  }
});

// 📌 Obtener un departamento por ID
router.get("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM departments WHERE id_department = ?", [id]);

    if (rows.length === 0) {
      return sendError(res, 404, "Departamento no encontrado");
    }

    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error al obtener el departamento", err.message);
  }
});

// 📌 Crear un nuevo departamento
router.post("/departments", async (req, res) => {
  try {
    const { name_department } = req.body;

    if (!name_department) {
      return sendError(res, 400, "El nombre del departamento es obligatorio");
    }

    const [result] = await pool.query(
      "INSERT INTO departments (name_department) VALUES (?)",
      [name_department]
    );

    res.status(201).json({ id: result.insertId, name_department });
  } catch (err) {
    sendError(res, 500, "Error al crear el departamento", err.message);
  }
});

// 📌 Actualizar un departamento
router.put("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name_department } = req.body;

    const [result] = await pool.query(
      "UPDATE departments SET name_department = ? WHERE id_department = ?",
      [name_department, id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Departamento no encontrado");
    }

    res.json({ message: "Departamento actualizado correctamente" });
  } catch (err) {
    sendError(res, 500, "Error al actualizar el departamento", err.message);
  }
});

// 📌 Eliminar un departamento
router.delete("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM departments WHERE id_department = ?", [id]);

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Departamento no encontrado");
    }

    res.json({ message: "Departamento eliminado correctamente" });
  } catch (err) {
    sendError(res, 500, "Error al eliminar el departamento", err.message);
  }
});

export default router;
