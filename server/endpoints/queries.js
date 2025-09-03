// endpoints/queries.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// User reservations with court and location details
router.get('/users/:id_user/reservations', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT  
        r.id_reserve,
        r.reserve_schedule,
        f.name_field AS field_name,
        m.name_municipality AS municipality_name,
        d.name_department AS department_name
       FROM reservations r
       JOIN fields_ f ON r.id_field = f.id_field
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       WHERE r.id_user = ?
       ORDER BY r.reserve_schedule DESC`,
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error when querying user reservations', err.message);
  }
});


// Counting reservations per court
router.get('/fields_/:id_field/reservations/count', async (req, res) => {
  const { id_field } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT  
         f.name_field AS field_name,
         COUNT(r.id_user) AS num_reservations
       FROM fields_ f
       LEFT JOIN reservations r ON f.id_field = r.id_field
       WHERE f.id_field = ?
       GROUP BY f.name_field`,
      [id_field]
    );
    if (!rows.length) return sendError(res, 404, 'Field not found');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'error when counting reserves', err.message);
  }
});

// List reservations with user and location details
router.get('/reservations/details', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT  
         r.id_reserve,
         r.reserve_schedule,
         u.full_name AS user_name,
         f.name_field AS field_name,
         m.name_municipality AS municipality_name,
         d.name_department AS department_name
       FROM reservations r
       JOIN users u ON r.id_user = u.id_user
       JOIN fields_ f ON r.id_field = f.id_field
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       ORDER BY r.reserve_schedule DESC`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting reservation details', err.message);
  }
});

// Courts, availability and number of reservations
router.get('/fields_/availability', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT  
         f.name_field AS field_name,
         d.name_department AS department_name,
         m.name_municipality AS municipality_name,
         COALESCE(COUNT(r.id_field), 0) AS num_reservations,
         a.day_of_week,
         t.hora_inicio,
         t.hora_final,
         a.estado
       FROM fields_ f
       LEFT JOIN reservations r ON f.id_field = r.id_field
       JOIN availability a ON f.id_availability = a.id_availability
       JOIN time_ t ON a.id_tiempo = t.id_tiempo
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       GROUP BY f.name_field, d.name_department, m.name_municipality, a.day_of_week, t.hora_inicio, t.hora_final, a.estado`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting availability of fields_', err.message);
  }
});

export default router;
