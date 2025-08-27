// endpoints/availability.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/availability', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM availability');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener availability', err.message);
  }
});

router.get('/availability/:id_availability', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!rows.length) return sendError(res, 404, 'Availability no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener availability', err.message);
  }
});

router.post('/availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  if (!['available', 'not_available'].includes(estado)) return sendError(res, 400, "estado debe ser 'available' o 'not_available'");
  try {
    const [result] = await pool.query(
      'INSERT INTO availability (day_of_week, id_tiempo, estado) VALUES (?, ?, ?)',
      [day_of_week, id_tiempo, estado]
    );
    res.status(201).json({ id_availability: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear availability', err.message);
  }
});

router.put('/availability/:id_availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  if (!['available', 'not_available'].includes(estado)) return sendError(res, 400, "estado debe ser 'available' o 'not_available'");
  try {
    const [result] = await pool.query(
      'UPDATE availability SET day_of_week = ?, id_tiempo = ?, estado = ? WHERE id_availability = ?',
      [day_of_week, id_tiempo, estado, req.params.id_availability]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Availability no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar availability', err.message);
  }
});

router.delete('/availability/:id_availability', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!result.affectedRows) return sendError(res, 404, 'Availability no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar availability', err.message);
  }
});

export default router;
