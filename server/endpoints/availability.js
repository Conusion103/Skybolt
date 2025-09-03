// endpoints/availability.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

const validDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Check day_of_week
function isValidDay(day) {
  return validDays.includes(day);
}

// Check state
function isValidEstado(estado) {
  return ['available', 'not_available'].includes(estado);
}

// List availability 
router.get('/availability', async (req, res) => {
  try {
    const { day_of_week, estado, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    let whereClauses = [];
    let params = [];

    if (day_of_week) {
      if (!isValidDay(day_of_week)) {
        return sendError(res, 400, 'day_of_week inválido');
      }
      whereClauses.push('a.day_of_week = ?');
      params.push(day_of_week);
    }
    if (estado) {
      if (!isValidEstado(estado)) {
        return sendError(res, 400, 'invalid state');
      }
      whereClauses.push('a.estado = ?');
      params.push(estado);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [rows] = await pool.query(`
      SELECT 
        a.id_availability,
        a.day_of_week,
        a.estado,
        t.id_tiempo,
        t.hora_inicio,
        t.hora_final
      FROM availability a
      JOIN time_ t ON a.id_tiempo = t.id_tiempo
      ${whereSql}
      ORDER BY a.id_availability
      LIMIT ? OFFSET ?
    `, [...params, Number(limit), Number(offset)]);

    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener availability', err.message);
  }
});

// Get availability by id
router.get('/availability/:id_availability', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!rows.length) return sendError(res, 404, 'Availability no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error getting availability', err.message);
  }
});

// Create availability with validation and duplicate checking
router.post('/availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) {
    return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  }
  if (!isValidDay(day_of_week)) {
    return sendError(res, 400, 'day_of_week inválido');
  }
  if (!isValidEstado(estado)) {
    return sendError(res, 400, "status must be 'available' or 'not_available'");
  }

  try {

    const [existing] = await pool.query(
      'SELECT * FROM availability WHERE day_of_week = ? AND id_tiempo = ?',
      [day_of_week, id_tiempo]
    );
    if (existing.length) {
      return sendError(res, 409, 'There is already availability for that day and time.');
    }

    const [result] = await pool.query(
      'INSERT INTO availability (day_of_week, id_tiempo, estado) VALUES (?, ?, ?)',
      [day_of_week, id_tiempo, estado]
    );
    res.status(201).json({ id_availability: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error creating availability', err.message);
  }
});

// Update availability with duplicate validation and checking
router.put('/availability/:id_availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) {
    return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  }
  if (!isValidDay(day_of_week)) {
    return sendError(res, 400, 'day_of_week inválido');
  }
  if (!isValidEstado(estado)) {
    return sendError(res, 400, "status must be 'available' or 'not_available''");
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM availability WHERE day_of_week = ? AND id_tiempo = ? AND id_availability != ?',
      [day_of_week, id_tiempo, req.params.id_availability]
    );
    if (existing.length) {
      return sendError(res, 409, 'There is already availability for that day and time.');
    }

    const [result] = await pool.query(
      'UPDATE availability SET day_of_week = ?, id_tiempo = ?, estado = ? WHERE id_availability = ?',
      [day_of_week, id_tiempo, estado, req.params.id_availability]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Availability not found');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error updating availability', err.message);
  }
});

// Delete availability
router.delete('/availability/:id_availability', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!result.affectedRows) return sendError(res, 404, 'Availability not found');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error removing availability', err.message);
  }
});

// Get availability with details (courts, schedule, location)
router.get('/availability/fields/detailed', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id_field,
        f.name_field,
        f.image_path,
        a.day_of_week,
        a.estado,
        t.hora_inicio,
        t.hora_final,
        g.name_game,
        m.name_municipality,
        d.name_department
      FROM fields_ f
      INNER JOIN availability a ON f.id_availability = a.id_availability
      INNER JOIN time_ t ON a.id_tiempo = t.id_tiempo
      INNER JOIN games g ON f.id_game = g.id_game
      INNER JOIN municipalities m ON f.id_municipality = m.id_municipality
      INNER JOIN departments d ON m.id_department = d.id_department
    `);

    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting detailed court availability', err.message);
  }
});

// get availability for a specific court
router.get('/availability/fields/:id_field', async (req, res) => {
  try {
    const { id_field } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        f.id_field,
        f.name_field,
        f.image_path,
        a.day_of_week,
        a.estado,
        t.hora_inicio,
        t.hora_final,
        g.name_game,
        m.name_municipality,
        d.name_department
      FROM fields_ f
      INNER JOIN availability a ON f.id_availability = a.id_availability
      INNER JOIN time_ t ON a.id_tiempo = t.id_tiempo
      INNER JOIN games g ON f.id_game = g.id_game
      INNER JOIN municipalities m ON f.id_municipality = m.id_municipality
      INNER JOIN departments d ON m.id_department = d.id_department
      WHERE f.id_field = ?
    `, [id_field]);

    if (!rows.length) return sendError(res, 404, 'Field not found or unavailable');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting availability for specific court', err.message);
  }
});

export default router;
