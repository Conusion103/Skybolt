// endpoints/userRoles.js
import express from 'express';
import { pool } from '../conexion_db.js';
import { sendError } from '../utils.js';

const router = express.Router();

// Asignar / remover roles a usuario
router.post('/users/change-role', async (req, res) => {
  const { target_user_id, role, action } = req.body;
  if (!target_user_id || !role || !['assign', 'remove'].includes(action)) {
    return sendError(res, 400, 'target_user_id, role y action son requeridos');
  }
  try {
    let id_role = null;
    if (typeof role === 'number') id_role = role;
    else {
      const [r] = await pool.query('SELECT id_role FROM roles WHERE name_role = ?', [role]);
      if (!r.length) return sendError(res, 404, 'Rol no existe');
      id_role = r[0].id_role;
    }
    if (action === 'assign') {
      await pool.query('INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)', [target_user_id, id_role]);
    } else {
      await pool.query('DELETE FROM user_roles WHERE id_user = ? AND id_role = ?', [target_user_id, id_role]);
    }
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al cambiar rol', err.message);
  }
});

export default router;
