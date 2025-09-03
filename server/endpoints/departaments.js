// endpoints/departments.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError } from "../utils.js";

const router = express.Router();

// Get all departments
router.get("/departments", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM departments");
    res.json(rows);
  } catch (err) {
    sendError(res, 500, "Error getting departments", err.message);
  }
});

// Get a department by ID
router.get("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM departments WHERE id_department = ?",
      [id]
    );

    if (rows.length === 0) {
      return sendError(res, 404, "Departament not found");
    }

    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, "Error getting the department", err.message);
  }
});

// Create a new department
router.post("/departments", async (req, res) => {
  try {
    const { name_department } = req.body;

    if (!name_department) {
      return sendError(res, 400, "The department name is required");
    }

    const [result] = await pool.query(
      "INSERT INTO departments (name_department) VALUES (?)",
      [name_department]
    );

    res.status(201).json({ id: result.insertId, name_department });
  } catch (err) {
    sendError(res, 500, "Error creating department", err.message);
  }
});

// Update deparments
router.put("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name_department } = req.body;

    const [result] = await pool.query(
      "UPDATE departments SET name_department = ? WHERE id_department = ?",
      [name_department, id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Departamento not found");
    }

    res.json({ message: "Department updated correctly" });
  } catch (err) {
    sendError(res, 500, "Error updating department", err.message);
  }
});

// delete deparment
router.delete("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM departments WHERE id_department = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Departamento not found");
    }

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    sendError(res, 500, "Error deleting department", err.message);
  }
});

// Obtain a department with its municipalities
router.get("/departments/:id/municipalities", async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if the department exists
    const [deptRows] = await pool.query(
      "SELECT * FROM departments WHERE id_department = ?",
      [id]
    );
    if (deptRows.length === 0) {
      return sendError(res, 404, "Departamento not found");
    }

    // Then, get the municipalities related to that department
    const [municipalities] = await pool.query(
      "SELECT id_municipality, name_municipality FROM municipalities WHERE id_department = ?",
      [id]
    );

    res.json({
      department: deptRows[0],
      municipalities,
    });
  } catch (err) {
    sendError(
      res,
      500,
      "Error getting the department with its municipalities",
      err.message
    );
  }
});

export default router;
