// endpoints/ownerRequests.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/owner_requests', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM owner_requests');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener owner_requests', err.message);
  }
});

router.get('/owner_requests/:id_request', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM owner_requests WHERE id_request = ?', [req.params.id_request]);
    if (!rows.length) return sendError(res, 404, 'Owner request no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener owner_request', err.message);
  }
});

router.post('/owner_requests', async (req, res) => {
  const { id_user, cancha_name, cancha_location, cancha_description, status } = req.body;
  if (!id_user || !cancha_name || !cancha_location) {
    return sendError(res, 400, 'id_user, cancha_name y cancha_location son requeridos');
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO owner_requests (id_user, cancha_name, cancha_location, cancha_description, status)
       VALUES (?, ?, ?, ?, ?)`,
      [id_user, cancha_name, cancha_location, cancha_description || null, status || 'pending']
    );
    res.status(201).json({ id_request: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear owner_request', err.message);
  }
});

router.put('/owner_requests/:id_request', async (req, res) => {
  const { id_user, cancha_name, cancha_location, cancha_description, status } = req.body;
  try {
    const [currRows] = await pool.query('SELECT * FROM owner_requests WHERE id_request = ?', [req.params.id_request]);
    if (!currRows.length) return sendError(res, 404, 'Owner request no encontrada');
    const curr = currRows[0];
    const [result] = await pool.query(
      `UPDATE owner_requests SET id_user = ?, cancha_name = ?, cancha_location = ?, cancha_description = ?, status = ?
       WHERE id_request = ?`,
      [
        id_user ?? curr.id_user,
        cancha_name ?? curr.cancha_name,
        cancha_location ?? curr.cancha_location,
        (cancha_description === undefined ? curr.cancha_description : cancha_description),
        status ?? curr.status,
        req.params.id_request
      ]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Owner request no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar owner_request', err.message);
  }
});

router.delete('/owner_requests/:id_request', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM owner_requests WHERE id_request = ?', [req.params.id_request]);
    if (!result.affectedRows) return sendError(res, 404, 'Owner request no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar owner_request', err.message);
  }
});

export default router;
