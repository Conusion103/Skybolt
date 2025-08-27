// utils.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './conexion_db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export const sendError = (res, status, message, detail = null) => {
  res.status(status).json({ status, error: message, detail });
};

export const validateUserFields = (body, { requirePassword = true } = {}) => {
  const required = [
    'full_name',
    'email',
    'phone',
    'birthdate',
    'document_type',
    'id_document',
    'id_municipality',
  ];
  if (requirePassword) required.push('password_');
  const missing = required.filter((k) => !body[k]);
  return missing;
};

export const getUserRoles = async (id_user) => {
  const [rows] = await pool.query(
    `SELECT r.id_role, r.name_role
     FROM user_roles ur
     JOIN roles r ON ur.id_role = r.id_role
     WHERE ur.id_user = ?`,
    [id_user]
  );
  return rows;
};

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return sendError(res, 401, 'Token requerido');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return sendError(res, 401, 'Token inválido');
  }
};

export { pool, bcrypt };
