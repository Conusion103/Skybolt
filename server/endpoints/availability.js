// endpoints/availability.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// router.get('/availability', async (_req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM availability');
//     res.json(rows);
//   } catch (err) {
//     sendError(res, 500, 'Error al obtener availability', err.message);
//   }
// });

router.get('/availability', async (_req, res) => {
  try {
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
    `);
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

// 📌 Obtener disponibilidad con detalles de cancha, horario y ubicación
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
    sendError(res, 500, 'Error al obtener disponibilidad detallada de canchas', err.message);
  }
});


export default router;
