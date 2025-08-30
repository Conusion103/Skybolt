import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// ✅ Obtener todas las canchas con JOIN y disponibilidades
router.get('/fields_', async (_req, res) => {
  try {
    const [fields] = await pool.query(`
      SELECT 
        f.id_field, f.name_field, f.id_game, g.name_game,
        f.id_municipality, m.name_municipality,
        f.id_owner, f.image_path,
        f.created_at, f.updated_at
      FROM fields_ f
      JOIN games g ON f.id_game = g.id_game
      JOIN municipalities m ON f.id_municipality = m.id_municipality
    `);

    const [availabilities] = await pool.query(`
      SELECT 
        fa.id_field, a.id_availability, a.estado, a.day_of_week, t.hora_inicio, t.hora_final
      FROM field_availability fa
      JOIN availability a ON fa.id_availability = a.id_availability
      JOIN time_ t ON a.id_tiempo = t.id_tiempo
    `);

    const merged = fields.map(f => ({
      ...f,
      availability: availabilities
        .filter(a => a.id_field === f.id_field)
        .map(a => ({
          id_availability: a.id_availability,
          estado: a.estado,
          day_of_week: a.day_of_week,
          hora_inicio: a.hora_inicio,
          hora_final: a.hora_final
        }))
    }));

    res.json(merged);
  } catch (err) {
    sendError(res, 500, 'Error al obtener fields_', err.message);
  }
});

// ✅ Obtener cancha por ID
router.get('/fields_/:id_field', async (req, res) => {
  const { id_field } = req.params;

  try {
    const [fieldRows] = await pool.query(`SELECT * FROM fields_ WHERE id_field = ?`, [id_field]);
    if (!fieldRows.length) return sendError(res, 404, 'Field no encontrada');

    const [availabilities] = await pool.query(`
      SELECT a.id_availability, a.estado, a.day_of_week, t.hora_inicio, t.hora_final
      FROM field_availability fa
      JOIN availability a ON fa.id_availability = a.id_availability
      JOIN time_ t ON a.id_tiempo = t.id_tiempo
      WHERE fa.id_field = ?
    `, [id_field]);

    res.json({
      ...fieldRows[0],
      availability: availabilities
    });
  } catch (err) {
    sendError(res, 500, 'Error al obtener field', err.message);
  }
});

// ✅ Crear nueva cancha con disponibilidad por día y hora
router.post('/fields_', async (req, res) => {
  const {
    name_field,
    id_municipality,
    id_game,
    id_owner,
    image_path,
    availability_selection // { Monday: ['09:00:00', ...], ... }
  } = req.body;

  if (!name_field || !id_municipality || !id_game || typeof availability_selection !== 'object') {
    return sendError(res, 400, 'Datos incompletos o disponibilidad no válida');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`
      INSERT INTO fields_ (name_field, id_municipality, id_game, id_owner, image_path)
      VALUES (?, ?, ?, ?, ?)
    `, [name_field, id_municipality, id_game, id_owner || null, image_path || null]);

    const id_field = result.insertId;

    for (const [day, hours] of Object.entries(availability_selection)) {
      for (const hour of hours) {
        const [timeRows] = await conn.query('SELECT id_tiempo FROM time_ WHERE hora_inicio = ?', [hour]);
        if (!timeRows.length) continue;
        const id_tiempo = timeRows[0].id_tiempo;

        const [availRows] = await conn.query(`
          SELECT id_availability FROM availability
          WHERE day_of_week = ? AND id_tiempo = ? AND estado = 'available'
        `, [day, id_tiempo]);
        if (!availRows.length) continue;

        const id_availability = availRows[0].id_availability;

        await conn.query('INSERT INTO field_availability (id_field, id_availability) VALUES (?, ?)', [id_field, id_availability]);
      }
    }

    await conn.commit();
    res.status(201).json({ id_field });
  } catch (err) {
    await conn.rollback();
    sendError(res, 500, 'Error al crear cancha', err.message);
  } finally {
    conn.release();
  }
});

// ✅ Actualizar cancha con disponibilidad por día y hora
router.put('/fields_/:id_field', async (req, res) => {
  const {
    name_field,
    id_municipality,
    id_game,
    id_owner,
    image_path,
    availability_selection
  } = req.body;
  const { id_field } = req.params;

  if (!name_field || !id_municipality || !id_game || typeof availability_selection !== 'object') {
    return sendError(res, 400, 'Datos incompletos o disponibilidad no válida');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [exists] = await conn.query('SELECT * FROM fields_ WHERE id_field = ?', [id_field]);
    if (!exists.length) {
      await conn.rollback();
      return sendError(res, 404, 'Cancha no encontrada');
    }

    await conn.query(`
      UPDATE fields_
      SET name_field = ?, id_municipality = ?, id_game = ?, id_owner = ?, image_path = ?
      WHERE id_field = ?
    `, [name_field, id_municipality, id_game, id_owner || null, image_path || null, id_field]);

    await conn.query('DELETE FROM field_availability WHERE id_field = ?', [id_field]);

    for (const [day, hours] of Object.entries(availability_selection)) {
      for (const hour of hours) {
        const [timeRows] = await conn.query('SELECT id_tiempo FROM time_ WHERE hora_inicio = ?', [hour]);
        if (!timeRows.length) continue;
        const id_tiempo = timeRows[0].id_tiempo;

        const [availRows] = await conn.query(`
          SELECT id_availability FROM availability
          WHERE day_of_week = ? AND id_tiempo = ? AND estado = 'available'
        `, [day, id_tiempo]);
        if (!availRows.length) continue;

        const id_availability = availRows[0].id_availability;

        await conn.query('INSERT INTO field_availability (id_field, id_availability) VALUES (?, ?)', [id_field, id_availability]);
      }
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    sendError(res, 500, 'Error al actualizar cancha', err.message);
  } finally {
    conn.release();
  }
});

// ✅ Eliminar cancha
router.delete('/fields_/:id_field', async (req, res) => {
  const { id_field } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM field_availability WHERE id_field = ?', [id_field]);
    const [result] = await conn.query('DELETE FROM fields_ WHERE id_field = ?', [id_field]);
    await conn.commit();
    if (!result.affectedRows) return sendError(res, 404, 'Cancha no encontrada');
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    sendError(res, 500, 'Error al eliminar cancha', err.message);
  } finally {
    conn.release();
  }
});

// ✅ Obtener canchas disponibles en un datetime
router.get('/fields_/available', async (req, res) => {
  const { datetime } = req.query;
  if (!datetime) return sendError(res, 400, 'datetime es requerido en formato ISO');

  try {
    const requestedDate = new Date(datetime);
    if (isNaN(requestedDate)) return sendError(res, 400, 'datetime inválido');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[requestedDate.getUTCDay()];
    const timeString = requestedDate.toISOString().substr(11, 8);

    const query = `
      SELECT f.id_field, f.name_field, g.name_game, m.name_municipality,
             a.day_of_week, t.hora_inicio, t.hora_final, a.estado,
             f.id_owner, f.image_path
      FROM fields_ f
      JOIN field_availability fa ON f.id_field = fa.id_field
      JOIN availability a ON fa.id_availability = a.id_availability
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
    sendError(res, 500, 'Error al obtener canchas disponibles', err.message);
  }
});

export default router;



