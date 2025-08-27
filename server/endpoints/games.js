// endpoints/games.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/games', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener games', err.message);
  }
});

router.get('/games/:id_game', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games WHERE id_game = ?', [req.params.id_game]);
    if (!rows.length) return sendError(res, 404, 'Game no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener game', err.message);
  }
});

router.post('/games', async (req, res) => {
  const { name_game } = req.body;
  if (!name_game) return sendError(res, 400, 'name_game es requerido');
  try {
    const [result] = await pool.query('INSERT INTO games (name_game) VALUES (?)', [name_game]);
    res.status(201).json({ id_game: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear game', err.message);
  }
});

router.put('/games/:id_game', async (req, res) => {
  const { name_game } = req.body;
  if (!name_game) return sendError(res, 400, 'name_game es requerido');
  try {
    const [result] = await pool.query('UPDATE games SET name_game = ? WHERE id_game = ?', [name_game, req.params.id_game]);
    if (!result.affectedRows) return sendError(res, 404, 'Game no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar game', err.message);
  }
});

router.delete('/games/:id_game', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM games WHERE id_game = ?', [req.params.id_game]);
    if (!result.affectedRows) return sendError(res, 404, 'Game no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar game', err.message);
  }
});

export default router;
