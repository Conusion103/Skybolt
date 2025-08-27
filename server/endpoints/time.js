// endpoints/time.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/time_', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM time_');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener time_', err.message);
  }
});

router.get('/time_/:id_tiempo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM time_ WHERE id_tiempo = ?', [req.params.id_tiempo]);
    if (!rows.length) return sendError(res, 404, 'Tiempo no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener tiempo', err.message);
  }
});

router.post('/time_', async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final) return sendError(res, 400, 'hora_inicio y hora_final son requeridos');
  try {
    const [result] = await pool.query('INSERT INTO time_ (hora_inicio, hora_final) VALUES (?, ?)', [hora_inicio, hora_final]);
    res.status(201).json({ id_tiempo: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear tiempo', err.message);
  }
});

router.put('/time_/:id_tiempo', async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final) return sendError(res, 400, 'hora_inicio y hora_final son requeridos');
  try {
    const [result] = await pool.query(
      'UPDATE time_ SET hora_inicio = ?, hora_final = ? WHERE id_tiempo = ?',
      [hora_inicio, hora_final, req.params.id_tiempo]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Tiempo no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar tiempo', err.message);
  }
});

router.delete('/time_/:id_tiempo', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM time_ WHERE id_tiempo = ?', [req.params.id_tiempo]);
    if (!result.affectedRows) return sendError(res, 404, 'Tiempo no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar tiempo', err.message);
  }
});

export default router;
