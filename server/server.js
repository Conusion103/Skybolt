import cors from "cors";
import express from "express";
import { pool } from "./conexion_db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------- Conexión a la base de datos ------------------------
const testDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Conexión a la base de datos exitosa");
        connection.release(); // Liberamos la conexión
    } catch (err) {
        console.error("Error de conexión a la base de datos:", err.message);
        process.exit(1);  // Si hay un error, cerramos el proceso.
    }
};

// Test de conexión antes de iniciar el servidor
testDbConnection();

// ------------------------------- CRUD ------------------------

// USERS ---------------------------------------------------------------------
// Obtener información de todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener información de un usuario específico
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
    const { full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol } = req.body;

    if (!full_name || !email || !phone || !birthdate || !document_type || !password_ || !rol) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar información de un usuario
app.put('/api/users/:id', async (req, res) => {
    const { full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol } = req.body;

    if (!full_name || !email || !phone || !birthdate || !document_type || !password_ || !rol) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ?, birthdate = ?, document_type = ?, id_document = ?, id_department = ?, id_municipality = ?, password_ = ?, rol = ? WHERE id = ?',
            [full_name, email, phone, birthdate, document_type, id_document, id_department, id_municipality, password_, rol, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un usuario
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

// Inicia el servidor solo si la conexión es exitosa
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
