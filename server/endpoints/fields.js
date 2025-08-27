// endpoints/fields.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/fields_', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fields_');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener fields_', err.message);
  }
});

router.get('/fields_/:id_field', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!rows.length) return sendError(res, 404, 'Field no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener field', err.message);
  }
});

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
    sendError(res, 500, 'Error al crear field', err.message);
  }
});

router.put('/fields_/:id_field', async (req, res) => {
  const { name_field, id_municipality, id_game, id_availability, id_owner, image_path } = req.body;
  try {
    const [currRows] = await pool.query('SELECT * FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!currRows.length) return sendError(res, 404, 'Field no encontrada');
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
    if (!result.affectedRows) return sendError(res, 404, 'Field no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar field', err.message);
  }
});

router.delete('/fields_/:id_field', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!result.affectedRows) return sendError(res, 404, 'Field no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar field', err.message);
  }
});

export default router;
