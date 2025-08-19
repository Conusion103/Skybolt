
import cors from "cors"
import express from "express"
import { pool } from "./conexion_db.js"


const app = express();
app.use(cors()) 
app.use(express.json()) 

// ------------------------------- CRUD   ------------------------


// USERS ---------------------------------------------------------------------
// get for obtein information of all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get for obtein information of one user
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// post for load information of one user
app.post('/api/users', async (req, res) => {
    const { full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality } = req.body;

    if (!full_name || !email || !phone || !birthdate || !document_type || !password|| !rol) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// put for update information of one user
app.put('/api/users/:id', async (req, res) => {
    const { full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality } = req.body;

    if (!full_name || !email || !phone || !birthdate || !document_type || !password|| !rol) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE customers SET full_name = ?, email = ?, phone = ?, birthdate = ?, document_type = ?,id_document = ?, password = ?, rol = ?, id_department = ?, id_municipality WHERE id = ?',
            [full_name, email, phone, birthdate, document_type, id_document, password, rol, id_department, id_municipality]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Delete for delete information of one user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});