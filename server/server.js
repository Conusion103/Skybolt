 // server.sql-aligned.js
 // Backend Express totalmente alineado con tu esquema SQL "skybolt"
 // Requiere: npm i express cors bcryptjs jsonwebtoken dotenv mysql2
 // Asegúrate que tu pool de conexión (conexion_db.js) exporte:  export const pool = mysql.createPool({...}).promise();
 import 'dotenv/config';
 import cors from 'cors';
 import express from 'express';
 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcryptjs';
 import { pool } from './conexion_db.js';
 const app = express();
 app.use(cors());
 app.use(express.json());
 // ------------------------------ Utilidades -----------------------------
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
 const sendError = (res, status, message, detail = null) => {
  res.status(status).json({ status, error: message, detail });
 };
 const validateUserFields = (body, { requirePassword = true } = {}) => {
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
 const getUserRoles = async (id_user) => {
  const [rows] = await pool.query(
    `SELECT r.id_role, r.name_role
     FROM user_roles ur
     JOIN roles r ON ur.id_role = r.id_role
     WHERE ur.id_user = ?`,
    [id_user]
  );
  return rows;
 };
 // Probar conexión
 const testDbConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('DB OK');
    conn.release();
  } catch (e) {
    console.error('DB FAIL:', e.message);
    process.exit(1);
  }
 };
 await testDbConnection();
 // ------------------------------ Auth / Login -----------------------------
// Nota: este ejemplo genera token y retorna los roles del usuario.
 // Puedes proteger rutas agregando un middleware verifyToken.
const verifyToken = (req, res, next) => {
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
 app.post('/api/login', async (req, res) => {
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
 // ------------------------------ USERS -----------------------------
// Listar usuarios (incluye roles)
 app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    // Adjuntar roles por usuario
    const withRoles = await Promise.all(
      rows.map(async (u) => ({
        ...u,
        roles: await getUserRoles(u.id_user),
      }))
    );
    res.json(withRoles);
  } catch (err) {
    sendError(res, 500, 'Error al obtener usuarios', err.message);
  }
 });
 // Obtener usuario por id_user (incluye roles)
 app.get('/api/users/:id_user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id_user = ?', [req.params.id_user]);
    if (rows.length === 0) return sendError(res, 404, `Usuario con id ${req.params.id_user} no encontrado`);
    const user = rows[0];
    user.roles = await getUserRoles(user.id_user);
    res.json(user);
  } catch (err) {
    sendError(res, 500, 'Error al obtener usuario', err.message);
  }
 });

// Crear usuario (opcional: roles por name_role o id_role)
//  app.post('/api/users', async (req, res) => {
//   try {
//     const missing = validateUserFields(req.body, { requirePassword: true });
//     if (missing.length) return sendError(res, 400, 'Faltan campos obligatorios', `Campos: ${missing.join(', ')}`);
//     const {
//       full_name,
//       email,
//       phone,
//       birthdate,
//       document_type,
//       id_document,
//       id_municipality,
//       password_,
//       roles // opcional: array de strings (name_role) o números (id_role)
//     } = req.body;
//     const hashed = await bcrypt.hash(password_, 10);
//     const [result] = await pool.query(
//       `INSERT INTO users
//        (full_name, email, phone, birthdate, document_type, id_document, id_municipality, password_, image_path)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [full_name, email, phone, birthdate, document_type, id_document, id_municipality, hashed, req.body.image_path || null]
//     );
//     const id_user = result.insertId;
//     if (Array.isArray(roles) && roles.length) {
//       // Resolver ids por name_role si llegan strings
//       const roleIds = [];
//       for (const r of roles) {
//         if (typeof r === 'number') roleIds.push(r);
//         else {
//           const [rr] = await pool.query('SELECT id_role FROM roles WHERE name_role = ?', [r]);
//           if (rr.length) roleIds.push(rr[0].id_role);
//         }
//       }
//       for (const id_role of roleIds) {
//         await pool.query('INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)', [id_user, id_role]);
//       }
//     }
//     res.status(201).json({ id_user });
//   } catch (err) {
//     sendError(res, 500, 'Error al crear usuario', err.message);
//   }
//  });

app.post('/api/users', async (req, res) => {
  try {
    const missing = validateUserFields(req.body, { requirePassword: true });
    if (missing.length) return sendError(res, 400, 'Faltan campos obligatorios', `Campos: ${missing.join(', ')}`);

    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
      id_municipality,
      password_,
      // ⚠️ ignoramos roles si no es admin
    } = req.body;

    const hashed = await bcrypt.hash(password_, 10);

    const [result] = await pool.query(
      `INSERT INTO users
       (full_name, email, phone, birthdate, document_type, id_document, id_municipality, password_, image_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, birthdate, document_type, id_document, id_municipality, hashed, req.body.image_path || null]
    );

    const id_user = result.insertId;

    // 👇 Aquí controlamos los roles
    let roles = [];

    // Si el request viene autenticado como admin, dejamos que pase roles
    if (req.user && req.user.role === 'admin' && Array.isArray(req.body.roles) && req.body.roles.length) {
      roles = req.body.roles;
    } else {
      // Si no es admin → rol "user" por defecto
      roles = ['user'];
    }

    // Resolver ids por name_role
    const roleIds = [];
    for (const r of roles) {
      if (typeof r === 'number') roleIds.push(r);
      else {
        const [rr] = await pool.query('SELECT id_role FROM roles WHERE name_role = ?', [r]);
        if (rr.length) roleIds.push(rr[0].id_role);
      }
    }

    for (const id_role of roleIds) {
      await pool.query('INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)', [id_user, id_role]);
    }

    res.status(201).json({ id_user, roles_asignados: roles });
  } catch (err) {
    sendError(res, 500, 'Error al crear usuario', err.message);
  }
});


 // Actualizar usuario (password_ opcional, roles para reemplazar completamente)
 app.put('/api/users/:id_user', async (req, res) => {
  const {
    full_name,
    email,
    phone,
    birthdate,
    document_type,
    id_document,
    id_municipality,
    password_,
    image_path,
    roles // opcional
  } = req.body;
  try {
    // Tomar valores actuales si no llegan
    const [currRows] = await pool.query('SELECT * FROM users WHERE id_user = ?', [req.params.id_user]);
    if (!currRows.length) return sendError(res, 404, `Usuario con id ${req.params.id_user} no encontrado`);
    const curr = currRows[0];
    const hashed = password_ ? await bcrypt.hash(password_, 10) : curr.password_;
    const [result] = await pool.query(
      `UPDATE users SET
        full_name = ?, email = ?, phone = ?, birthdate = ?, document_type = ?, id_document = ?,
        id_municipality = ?, password_ = ?, image_path = ?
       WHERE id_user = ?`,
      [
        full_name ?? curr.full_name,
        email ?? curr.email,
        phone ?? curr.phone,
        birthdate ?? curr.birthdate,
        document_type ?? curr.document_type,
        id_document ?? curr.id_document,
        id_municipality ?? curr.id_municipality,
        hashed,
        image_path ?? curr.image_path,
        req.params.id_user,
      ]
    );
    // Si envían roles, reemplazamos
    if (Array.isArray(roles)) {
      await pool.query('DELETE FROM user_roles WHERE id_user = ?', [req.params.id_user]);
      const roleIds = [];
      for (const r of roles) {
        if (typeof r === 'number') roleIds.push(r);
        else {
          const [rr] = await pool.query('SELECT id_role FROM roles WHERE name_role = ?', [r]);
          if (rr.length) roleIds.push(rr[0].id_role);
        }
      }
      for (const id_role of roleIds) {
        await pool.query('INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)', [req.params.id_user, id_role]);
      }
    }
    if (result.affectedRows === 0) return sendError(res, 404, 'Usuario no encontrado');
    res.json({ status: 200, message: 'Usuario actualizado correctamente' });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar usuario', err.message);
  }
 });
 // Eliminar usuario
 app.delete('/api/users/:id_user', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id_user = ?', [req.params.id_user]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Usuario no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar usuario', err.message);
  }
 });
 // ------------------------------ ROLES -----------------------------
app.get('/api/roles', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener roles', err.message);
  }
 });
 app.get('/api/roles/:id_role', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles WHERE id_role = ?', [req.params.id_role]);
    if (!rows.length) return sendError(res, 404, 'Rol no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener rol', err.message);
  }
 });
 app.post('/api/roles', async (req, res) => {
  const { name_role } = req.body;
  if (!name_role) return sendError(res, 400, 'name_role es requerido');
  try {
    const [result] = await pool.query('INSERT INTO roles (name_role) VALUES (?)', [name_role]);
    res.status(201).json({ id_role: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear rol', err.message);
  }
 });
 app.put('/api/roles/:id_role', async (req, res) => {
  const { name_role } = req.body;
  if (!name_role) return sendError(res, 400, 'name_role es requerido');
  try {
    const [result] = await pool.query('UPDATE roles SET name_role = ? WHERE id_role = ?', [name_role, req.params.id_role]);
    if (!result.affectedRows) return sendError(res, 404, 'Rol no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar rol', err.message);
  }
 });
 app.delete('/api/roles/:id_role', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM roles WHERE id_role = ?', [req.params.id_role]);
    if (!result.affectedRows) return sendError(res, 404, 'Rol no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar rol', err.message);
  }
 });
 // Asignar / remover roles a usuario
 app.post('/api/users/change-role', async (req, res) => {
  const { target_user_id, role, action } = req.body; // role: id_role (number) o name_role (string), action: 'assign'|'remove'
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
 // ------------------------------ GAMES -----------------------------
app.get('/api/games', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener games', err.message);
  }
 });
 app.get('/api/games/:id_game', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games WHERE id_game = ?', [req.params.id_game]);
    if (!rows.length) return sendError(res, 404, 'Game no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener game', err.message);
  }
 });
 app.post('/api/games', async (req, res) => {
  const { name_game } = req.body;
  if (!name_game) return sendError(res, 400, 'name_game es requerido');
  try {
    const [result] = await pool.query('INSERT INTO games (name_game) VALUES (?)', [name_game]);
    res.status(201).json({ id_game: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear game', err.message);
  }
 });
 app.put('/api/games/:id_game', async (req, res) => {
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
 app.delete('/api/games/:id_game', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM games WHERE id_game = ?', [req.params.id_game]);
    if (!result.affectedRows) return sendError(res, 404, 'Game no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar game', err.message);
  }
 });
 // ------------------------------ TIME_ -----------------------------
app.get('/api/time_', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM time_');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener time_', err.message);
  }
 });
 app.get('/api/time_/:id_tiempo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM time_ WHERE id_tiempo = ?', [req.params.id_tiempo]);
    if (!rows.length) return sendError(res, 404, 'Tiempo no encontrado');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener tiempo', err.message);
  }
 });
 app.post('/api/time_', async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final) return sendError(res, 400, 'hora_inicio y hora_final son requeridos');
  try {
    const [result] = await pool.query('INSERT INTO time_ (hora_inicio, hora_final) VALUES (?, ?)', [hora_inicio, hora_final]);
    res.status(201).json({ id_tiempo: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear tiempo', err.message);
  }
 });
 app.put('/api/time_/:id_tiempo', async (req, res) => {
  const { hora_inicio, hora_final } = req.body;
  if (!hora_inicio || !hora_final) return sendError(res, 400, 'hora_inicio y hora_final son requeridos');
  try {
    const [result] = await pool.query('UPDATE time_ SET hora_inicio = ?, hora_final = ? WHERE id_tiempo = ?', [hora_inicio, hora_final, req.params.id_tiempo]);
    if (!result.affectedRows) return sendError(res, 404, 'Tiempo no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar tiempo', err.message);
  }
 });
 app.delete('/api/time_/:id_tiempo', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM time_ WHERE id_tiempo = ?', [req.params.id_tiempo]);
    if (!result.affectedRows) return sendError(res, 404, 'Tiempo no encontrado');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar tiempo', err.message);
  }
 });
 // ------------------------------ AVAILABILITY -----------------------------
app.get('/api/availability', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM availability');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener availability', err.message);
  }
 });
 app.get('/api/availability/:id_availability', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!rows.length) return sendError(res, 404, 'Availability no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener availability', err.message);
  }
 });
 app.post('/api/availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  if (!['available', 'not_available'].includes(estado)) return sendError(res, 400, "estado debe ser 'available' o 'not_available'");
  try {
    const [result] = await pool.query('INSERT INTO availability (day_of_week, id_tiempo, estado) VALUES (?, ?, ?)', [day_of_week, id_tiempo, estado]);
    res.status(201).json({ id_availability: result.insertId });
  } catch (err) {
    sendError(res, 500, 'Error al crear availability', err.message);
  }
 });
 app.put('/api/availability/:id_availability', async (req, res) => {
  const { day_of_week, id_tiempo, estado } = req.body;
  if (!day_of_week || !id_tiempo || !estado) return sendError(res, 400, 'day_of_week, id_tiempo y estado son requeridos');
  if (!['available', 'not_available'].includes(estado)) return sendError(res, 400, "estado debe ser 'available' o 'not_available'");
  try {
    const [result] = await pool.query('UPDATE availability SET day_of_week = ?, id_tiempo = ?, estado = ? WHERE id_availability = ?', [day_of_week, id_tiempo, estado, req.params.id_availability]);
    if (!result.affectedRows) return sendError(res, 404, 'Availability no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar availability', err.message);
  }
 });
 app.delete('/api/availability/:id_availability', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM availability WHERE id_availability = ?', [req.params.id_availability]);
    if (!result.affectedRows) return sendError(res, 404, 'Availability no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar availability', err.message);
  }
 });
 // ------------------------------ FIELDS_ -----------------------------
app.get('/api/fields_', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fields_');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener fields_', err.message);
  }
 });
 app.get('/api/fields_/:id_field', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!rows.length) return sendError(res, 404, 'Field no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener field', err.message);
  }
 });
 app.post('/api/fields_', async (req, res) => {
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
 app.put('/api/fields_/:id_field', async (req, res) => {
  const { name_field, id_municipality, id_game, id_availability, id_owner, image_path } = req.body;
  try {
    // tomar actuales
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
 app.delete('/api/fields_/:id_field', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM fields_ WHERE id_field = ?', [req.params.id_field]);
    if (!result.affectedRows) return sendError(res, 404, 'Field no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar field', err.message);
  }
 });
 // ------------------------------ RESERVATIONS -----------------------------
app.get('/api/reservations', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reservations', err.message);
  }
 });
 app.get('/api/reservations/:id_reserve', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations WHERE id_reserve = ?', [req.params.id_reserve]);
    if (!rows.length) return sendError(res, 404, 'Reservation no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reservation', err.message);
  }
 });
 app.post('/api/reservations', async (req, res) => {
  const { reserve_schedule, id_user, id_field } = req.body;
  if (!reserve_schedule || !id_user || !id_field) return sendError(res, 400, 'reserve_schedule, id_user e id_field son requeridos');
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
 app.put('/api/reservations/:id_reserve', async (req, res) => {
  const { reserve_schedule, id_user, id_field } = req.body;
  try {
    const [currRows] = await pool.query('SELECT * FROM reservations WHERE id_reserve = ?', [req.params.id_reserve]);
    if (!currRows.length) return sendError(res, 404, 'Reservation no encontrada');
    const curr = currRows[0];
    const [result] = await pool.query(
      'UPDATE reservations SET reserve_schedule = ?, id_user = ?, id_field = ? WHERE id_reserve = ?',
      [reserve_schedule ?? curr.reserve_schedule, id_user ?? curr.id_user, id_field ?? curr.id_field, req.params.id_reserve]
    );
    if (!result.affectedRows) return sendError(res, 404, 'Reservation no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al actualizar reservation', err.message);
  }
 });
 app.delete('/api/reservations/:id_reserve', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reservations WHERE id_reserve = ?', [req.params.id_reserve]);
    if (!result.affectedRows) return sendError(res, 404, 'Reservation no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar reservation', err.message);
  }
 });
 // ------------------------------ OWNER_REQUESTS -----------------------------
app.get('/api/owner_requests', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM owner_requests');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener owner_requests', err.message);
  }
 });
 app.get('/api/owner_requests/:id_request', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM owner_requests WHERE id_request = ?', [req.params.id_request]);
    if (!rows.length) return sendError(res, 404, 'Owner request no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener owner_request', err.message);
  }
 });
 app.post('/api/owner_requests', async (req, res) => {
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
 app.put('/api/owner_requests/:id_request', async (req, res) => {
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
 app.delete('/api/owner_requests/:id_request', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM owner_requests WHERE id_request = ?', [req.params.id_request]);
    if (!result.affectedRows) return sendError(res, 404, 'Owner request no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar owner_request', err.message);
  }
 });
 // ------------------------------ REVIEWS -----------------------------
app.get('/api/reviews', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews');
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener reviews', err.message);
  }
 });
 app.get('/api/reviews/:id_review', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id_review = ?', [req.params.id_review]);
    if (!rows.length) return sendError(res, 404, 'Review no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al obtener review', err.message);
  }
 });
 app.post('/api/reviews', async (req, res) => {
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
 app.put('/api/reviews/:id_review', async (req, res) => {
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
 app.delete('/api/reviews/:id_review', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reviews WHERE id_review = ?', [req.params.id_review]);
    if (!result.affectedRows) return sendError(res, 404, 'Review no encontrada');
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Error al eliminar review', err.message);
  }
 });
 // ------------------------------ Consultas Avanzadas -----------------------------
// Reservas de un usuario con detalles de cancha y ubicación
 app.get('/api/users/:id_user/reservations', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        r.id_reserve,
        r.reserve_schedule,
        f.name_field AS field_name,
        m.name_municipality AS municipality_name,
        d.name_department AS department_name
       FROM reservations r
       JOIN fields_ f ON r.id_field = f.id_field
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       WHERE r.id_user = ?
       ORDER BY r.reserve_schedule DESC`,
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al consultar reservas del usuario', err.message);
  }
 });
 // Conteo de reservas por cancha
 app.get('/api/fields_/:id_field/reservations/count', async (req, res) => {
  const { id_field } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
         f.name_field AS field_name,
         COUNT(r.id_user) AS num_reservations
       FROM fields_ f
       LEFT JOIN reservations r ON f.id_field = r.id_field
       WHERE f.id_field = ?
       GROUP BY f.name_field`,
      [id_field]
    );
    if (!rows.length) return sendError(res, 404, 'Field no encontrada');
    res.json(rows[0]);
  } catch (err) {
    sendError(res, 500, 'Error al contar reservas', err.message);
  }
 });
 // Listar reservas con detalles de usuario y ubicación
 app.get('/api/reservations/details', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         r.id_reserve,
         r.reserve_schedule,
         u.full_name AS user_name,
         f.name_field AS field_name,
         m.name_municipality AS municipality_name,
         d.name_department AS department_name
       FROM reservations r
       JOIN users u ON r.id_user = u.id_user
       JOIN fields_ f ON r.id_field = f.id_field
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       ORDER BY r.reserve_schedule DESC`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener detalles de reservas', err.message);
  }
 });
 // Canchas, disponibilidad y número de reservas
 app.get('/api/fields_/availability', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         f.name_field AS field_name,
         d.name_department AS department_name,
         m.name_municipality AS municipality_name,
         COALESCE(COUNT(r.id_field), 0) AS num_reservations,
         a.day_of_week,
         t.hora_inicio,
         t.hora_final,
         a.estado
       FROM fields_ f
       LEFT JOIN reservations r ON f.id_field = r.id_field
       JOIN availability a ON f.id_availability = a.id_availability
       JOIN time_ t ON a.id_tiempo = t.id_tiempo
       JOIN municipalities m ON f.id_municipality = m.id_municipality
       JOIN departments d ON m.id_department = d.id_department
       GROUP BY f.name_field, d.name_department, m.name_municipality, a.day_of_week, t.hora_inicio, t.hora_final, a.estado`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error al obtener disponibilidad de fields_', err.message);
  }
 });
 // ------------------------------ Start Server -----------------------------
const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
 })

