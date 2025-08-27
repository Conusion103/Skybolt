// endpoints/roles.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/roles', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener roles', err.message);
  }
});

router.get('/roles/:id_role', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles WHERE id_role = ?', [req.params.id_role]);
    if (!rows.length) return sendError(res, 404, 'Rol no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener rol', err.message);
  }
});

router.post('/roles', async (req, res) => {
  const { name_role } = req.body;
  if (!name_role) return sendError(res, 400, 'name_role es requerido');
  try {
    const [result] = await pool.query('INSERT INTO roles (name_role) VALUES (?)', [name_role]);
    res.status(201).json({ id_role: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear rol', err.message);
  }
});

router.put('/roles/:id_role', async (req, res) => {
  const { name_role } = req.body;
  if (!name_role) return sendError(res, 400, 'name_role es requerido');
  try {
    const [result] = await pool.query('UPDATE roles SET name_role = ? WHERE id_role = ?', [name_role, req.params.id_role]);
    if (!result.affectedRows) return sendError(res, 404, 'Rol no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar rol', err.message);
  }
});

router.delete('/roles/:id_role', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM roles WHERE id_role = ?', [req.params.id_role]);
    if (!result.affectedRows) return sendError(res, 404, 'Rol no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar rol', err.message);
  }
});

export default router;
