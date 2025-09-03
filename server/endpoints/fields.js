import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// Get all courts with basic information and joins
router.get('/fields_', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        f.id_field,
        f.name_field,
        f.id_game,
        g.name_game,
        f.id_municipality,
        m.name_municipality,
        f.id_availability,
        a.estado AS availability,
        f.id_owner,
        f.image_path,
        f.created_at,
        f.updated_at
      FROM fields_ f
      LEFT JOIN games g ON f.id_game = g.id_game
      LEFT JOIN municipalities m ON f.id_municipality = m.id_municipality
      LEFT JOIN availability a ON f.id_availability = a.id_availability
    `);
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting fields_', err.message);
  }
});

// Get detailed courts with additional joins
router.get('/fields/detailed', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id_field,
        f.name_field,
        f.id_game,
        g.name_game,
        f.id_municipality,
        m.name_municipality,
        f.id_availability,
        a.day_of_week,
        t.hora_inicio,
        t.hora_final,
        a.estado,
        f.id_owner,
        f.image_path
      FROM fields_ f
      JOIN games g ON f.id_game = g.id_game
      JOIN municipalities m ON f.id_municipality = m.id_municipality
      JOIN availability a ON f.id_availability = a.id_availability
      JOIN time_ t ON a.id_tiempo = t.id_tiempo
    `);
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting detailed courts', err.message);
  }
});

// Get specific court by ID
router.get('/fields_/:id_field', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!rows.length) return sendError(res, 404, 'Field not found');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error getting field', err.message);
  }
});

// Create a new field
router.post('/fields_', async (req, res) => {
  const { name_field, id_municipality, id_game, id_availability, id_owner, image_path } = req.body;
  if (!name_field || !id_municipality || !id_game || !id_availability) {
    return sendError(res, 400, 'name_field, id_municipality, id_game e id_availability son requeridos');
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO fields_ (name_field, id_municipality, id_game, id_availability, id_owner, image_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name_field, id_municipality, id_game, id_availability, id_owner || null, image_path || null]
    );
    res.status(201).json({ id_field: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error creating field', err.message);
  }
});

// Update fields
router.put('/fields_/:id_field', async (req, res) => {
  const { name_field, id_municipality, id_game, id_availability, id_owner, image_path } = req.body;
  try {
    const [currRows] = await pool.query('SELECT * FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!currRows.length) return sendError(res, 404, 'Field not found');
    const curr = currRows[0];
    const [result] = await pool.query(
      `UPDATE fields_ SET name_field = ?, id_municipality = ?, id_game = ?, id_availability = ?, id_owner = ?, image_path = ?
       WHERE id_field = ?`,
      [
        name_field ?? curr.name_field,
        id_municipality ?? curr.id_municipality,
        id_game ?? curr.id_game,
        id_availability ?? curr.id_availability,
        (id_owner === undefined ? curr.id_owner : id_owner),
        image_path ?? curr.image_path,
        req.params.id_field
      ]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Field not found');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error updating field', err.message);
  }
});

// delete fields
router.delete('/fields_/:id_field', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!result.affectedRows) return sendError(res, 404, 'Field not found');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error deleting field', err.message);
  }
});


router.get('/fields_/available', async (req, res) => {
  const { datetime } = req.query;
  if (!datetime) return sendError(res, 400, 'datetime is required in ISO format');

  try {
    const requestedDate = new Date(datetime);
    if (isNaN(requestedDate)) return sendError(res, 400, 'datetime inválid');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[requestedDate.getUTCDay()];

    const timeString = requestedDate.toISOString().substr(11, 8);

    const query = `
      SELECT f.id_field, f.name_field, g.name_game, m.name_municipality,
             a.day_of_week, t.hora_inicio, t.hora_final, a.estado,
             f.id_owner, f.image_path
      FROM fields_ f
      JOIN availability a ON f.id_availability = a.id_availability
      JOIN time_ t ON a.id_tiempo = t.id_tiempo
      JOIN games g ON f.id_game = g.id_game
      JOIN municipalities m ON f.id_municipality = m.id_municipality
      WHERE a.estado = 'available'
        AND a.day_of_week = ?
        AND t.hora_inicio <= ?
        AND t.hora_final > ?
        AND f.id_field NOT IN (
          SELECT r.id_field
          FROM reservations r
          WHERE r.reserve_schedule = ?
        )
    `;

    const [rows] = await pool.query(query, [dayOfWeek, timeString, timeString, datetime]);
    res.json(rows);
  } catch (err) {
    console.error('Error en /fields_/available:', err);
    sendError(res, 500, 'Error getting available courts', err.message);
  }
});

export default router;

