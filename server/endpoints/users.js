// server/endpoints/users.js
import express from "express";
import { pool } from "../conexion_db.js";
import { sendError, validateUserFields, getUserRoles, bcrypt } from "../utils.js";

const router = express.Router();


router.get("/users", async (req, res) => {
  const { role } = req.query;

  try {
    if (role) {
      const [rows] = await pool.query(
        `
        SELECT u.*, r.name_role 
        FROM users u
        JOIN user_roles ur ON u.id_user = ur.id_user
        JOIN roles r ON ur.id_role = r.id_role
        WHERE r.name_role = ?
        `,
        [role]
      );
      return res.json(rows);
    }

    const [rows] = await pool.query("SELECT * FROM users");
    const withRoles = await Promise.all(
      rows.map(async (u) => ({
        ...u,
        roles: await getUserRoles(u.id_user),
      }))
    );
    res.json(withRoles);
  } catch (err) {
    sendError(res, 500, "Error getting usuarios", err.message);
  }
});

//reviews counter for user profile
router.get('/users/:id_user/reviews', async (req, res) => {
  try {
    const { id_user } = req.params;
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_reviews FROM reviews WHERE id_user = ?',
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting user reviews', err.message);
  }
});

//reservations counter for user profile
router.get('/users/:id_user/reservations', async (req, res) => {
  try {
    const { id_user } = req.params;
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_reservations FROM reservations WHERE id_user = ?',
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting reservations from user', err.message);
  }
});

router.get('/users/:id_user/reviewsowners', async (req, res) => {
  try {
    const { id_user } = req.params;
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_reviews FROM reviews r INNER JOIN fields_ f ON r.id_field = f.id_field WHERE f.id_owner = ?;',
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting reservations from user', err.message);
  }
});

router.get('/users/:id_user/reservationsowners', async (req, res) => {
  try {
    const { id_user } = req.params;
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_reservations FROM reservations r INNER JOIN fields_ f ON r.id_field = f.id_field WHERE f.id_owner = ?;',
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, 500, 'Error getting reservations from user', err.message);
  }
});


// Create default user rols 
router.post("/users", async (req, res) => {
  const missing = validateUserFields(req.body);
  if (missing.length > 0) {
    return sendError(res, 400, "Required fields are missing", missing);
  }

  try {
    const {
      full_name,
      email,
      phone,
      birthdate,
      document_type,
      id_document,
      id_municipality,
      password_,
    } = req.body;

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password_, 10);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, id_municipality, password_)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document,
        id_municipality,
        hashedPassword,
      ]
    );

    const newUserId = result.insertId;

    await pool.query(
      `INSERT INTO user_roles (id_user, id_role)
       VALUES (?, (SELECT id_role FROM roles WHERE name_role = 'user'))`,
      [newUserId]
    );

    res.status(201).json({
      message: "User created with user role",
      id_user: newUserId,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error creating user", error.message);
  }
});


router.put("/users/:id_user", async (req, res) => {
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
    roles,
  } = req.body;

  try {
    const [currRows] = await pool.query(
      "SELECT * FROM users WHERE id_user = ?",
      [req.params.id_user]
    );
    if (!currRows.length)
      return sendError(
        res,
        404,
        `User with id ${req.params.id_user} not found`
      );
    const curr = currRows[0];

    const hashed = password_
      ? await bcrypt.hash(password_, 10)
      : curr.password_;

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

    if (Array.isArray(roles)) {
      await pool.query("DELETE FROM user_roles WHERE id_user = ?", [
        req.params.id_user,
      ]);
      const roleIds = [];
      for (const r of roles) {
        if (typeof r === "number") roleIds.push(r);
        else {
          const [rr] = await pool.query(
            "SELECT id_role FROM roles WHERE name_role = ?",
            [r]
          );
          if (rr.length) roleIds.push(rr[0].id_role);
        }
      }
      for (const id_role of roleIds) {
        await pool.query(
          "INSERT IGNORE INTO user_roles (id_user, id_role) VALUES (?, ?)",
          [req.params.id_user, id_role]
        );
      }
    }

    if (result.affectedRows === 0)
      return sendError(res, 404, "User not found");

    res.json({ status: 200, message: "Successfully updated user" });
  } catch (err) {
    sendError(res, 500, "Error updating user", err.message);
  }
});


router.delete("/users/:id_user", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id_user = ?", [
      req.params.id_user,
    ]);
    if (result.affectedRows === 0)
      return sendError(res, 404, "User not found");
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, "Error deleting user", err.message);
  }
});

export default router;


