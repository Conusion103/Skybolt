// endpoints/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../conexion_db.js';
import { sendError, getUserRoles, JWT_SECRET, bcrypt } from '../utils.js';

const router = express.Router();


// Endpoint for the login manage
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return sendError(res, 400, 'Email y password son requeridos');
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return sendError(res, 401, 'Credenciales inválidas');
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_);
    if (!match) return sendError(res, 401, 'Credenciales inválidas');
    const roles = await getUserRoles(user.id_user);
    const payload = {
      id_user: user.id_user,
      full_name: user.full_name,
      roles: roles.map((r) => r.name_role),
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: payload });
  } catch (err) {
    sendError(res, 500, 'Error en login', err.message);
  }
});

export default router;
