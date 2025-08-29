import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// Middleware para validar formato de hora (HH:mm o HH:mm:ss)
function validateTimeFormat(timeStr) {
  // regex para HH:mm o HH:mm:ss, 24 horas
  return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(timeStr);
}

function validateRequestBody(req, res, next) {
  const { hora_inicio, hora_final } = req.body;

  if (!hora_inicio || !hora_final) {
    return sendError(res, 400, 'hora_inicio y hora_final son requeridos');
  }
  if (!validateTimeFormat(hora_inicio) || !validateTimeFormat(hora_final)) {
    return sendError(res, 400, 'hora_inicio y hora_final deben tener formato HH:mm o HH:mm:ss');
  }
  if (hora_final <= hora_inicio) {
    return sendError(res, 400, 'hora_final debe ser posterior a hora_inicio');
  }

  next();
}

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

router.post('/time_', validateRequestBody, async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO time_ (hora_inicio, hora_final) VALUES (?, ?)', [hora_inicio, hora_final]);
    const [newRow] = await pool.query('SELECT * FROM time_ WHERE id_tiempo = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    sendError(res, 500, 'Error al crear tiempo', err.message);
  }
});

router.put('/time_/:id_tiempo', validateRequestBody, async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE time_ SET hora_inicio = ?, hora_final = ? WHERE id_tiempo = ?',
      [hora_inicio, hora_final, req.params.id_tiempo]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Tiempo no encontrado');

    const [updatedRows] = await pool.query('SELECT * FROM time_ WHERE id_tiempo = ?', [req.params.id_tiempo]);
    res.json(updatedRows[0]);
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
