// endpoints/reservations.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// ✅ Obtener todas las reservas con JOIN (usuario y cancha)
router.get('/reservations/full', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id_reserve, r.reserve_schedule, 
              u.id_user, u.full_name AS user_name, 
              f.id_field, f.field_name
       FROM reservations r
       JOIN users u ON r.id_user = u.id_user
       JOIN fields f ON r.id_field = f.id_field`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reservas con detalles', err.message);
  }
});

// ✅ Obtener reserva específica con JOIN
router.get('/reservations/full/:id_reserve', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id_reserve, r.reserve_schedule, 
              u.id_user, u.full_name AS user_name, 
              f.id_field, f.field_name
       FROM reservations r
       JOIN users u ON r.id_user = u.id_user
       JOIN fields f ON r.id_field = f.id_field
       WHERE r.id_reserve = ?`,
      [req.params.id_reserve]
    );
    if (!rows.length) return sendError(res, 404, 'Reserva no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reserva con detalles', err.message);
  }
});

// ✅ CRUD básico (lo que ya tienes)
router.get('/reservations', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reservations', err.message);
  }
});

router.get('/reservations/:id_reserve', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reservations WHERE id_reserve = ?', 
      [req.params.id_reserve]
    );
    if (!rows.length) return sendError(res, 404, 'Reservation no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reservation', err.message);
  }
});

router.post('/reservations', async (req, res) => {
  const { reserve_schedule, id_user, id_field } = req.body;
  if (!reserve_schedule || !id_user || !id_field) {
    return sendError(res, 400, 'reserve_schedule, id_user e id_field son requeridos');
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO reservations (reserve_schedule, id_user, id_field) VALUES (?, ?, ?)',
      [reserve_schedule, id_user, id_field]
    );
    res.status(201).json({ id_reserve: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear reservation', err.message);
  }
});

router.put('/reservations/:id_reserve', async (req, res) => {
  const { reserve_schedule, id_user, id_field } = req.body;
  try {
    const [currRows] = await pool.query(
      'SELECT * FROM reservations WHERE id_reserve = ?', 
      [req.params.id_reserve]
    );
    if (!currRows.length) return sendError(res, 404, 'Reservation no encontrada');

    const curr = currRows[0];
    const [result] = await pool.query(
      'UPDATE reservations SET reserve_schedule = ?, id_user = ?, id_field = ? WHERE id_reserve = ?',
      [
        reserve_schedule ?? curr.reserve_schedule,
        id_user ?? curr.id_user,
        id_field ?? curr.id_field,
        req.params.id_reserve
      ]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Reservation no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar reservation', err.message);
  }
});

router.delete('/reservations/:id_reserve', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM reservations WHERE id_reserve = ?', 
      [req.params.id_reserve]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Reservation no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar reservation', err.message);
  }
});

export default router;

