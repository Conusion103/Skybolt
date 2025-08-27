// endpoints/reviews.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/reviews', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reviews', err.message);
  }
});

router.get('/reviews/:id_review', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id_review = ?', [req.params.id_review]);
    if (!rows.length) return sendError(res, 404, 'Review no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener review', err.message);
  }
});

router.post('/reviews', async (req, res) => {
  const { id_user, id_field, rating, comment } = req.body;
  if (!id_user || !id_field || !rating) return sendError(res, 400, 'id_user, id_field y rating son requeridos');
  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (id_user, id_field, rating, comment) VALUES (?, ?, ?, ?)',
      [id_user, id_field, rating, comment || null]
    );
    res.status(201).json({ id_review: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear review', err.message);
  }
});

router.put('/reviews/:id_review', async (req, res) => {
  const { id_user, id_field, rating, comment } = req.body;
  try {
    const [currRows] = await pool.query('SELECT * FROM reviews WHERE id_review = ?', [req.params.id_review]);
    if (!currRows.length) return sendError(res, 404, 'Review no encontrada');
    const curr = currRows[0];
    const [result] = await pool.query(
      'UPDATE reviews SET id_user = ?, id_field = ?, rating = ?, comment = ? WHERE id_review = ?',
      [
        id_user ?? curr.id_user,
        id_field ?? curr.id_field,
        rating ?? curr.rating,
        (comment === undefined ? curr.comment : comment),
        req.params.id_review
      ]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Review no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar review', err.message);
  }
});

router.delete('/reviews/:id_review', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reviews WHERE id_review = ?', [req.params.id_review]);
    if (!result.affectedRows) return sendError(res, 404, 'Review no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar review', err.message);
  }
});

export default router;
