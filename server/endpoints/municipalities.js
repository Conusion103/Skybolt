// endpoints/municipalities.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

router.get('/municipalities', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM municipalities`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener municipios', err.message);
  }
});

export default router;
