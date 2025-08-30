import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { probarConexionConLaBaseDeDatos } from './conexion_db.js';

// routers
import authRouter from './endpoints/auth.js';
import usersRouter from './endpoints/users.js';
import rolesRouter from './endpoints/roles.js';
import userRolesRouter from './endpoints/userRoles.js';
import gamesRouter from './endpoints/games.js';
import timeRouter from './endpoints/time.js';
import availabilityRouter from './endpoints/availability.js';
import fieldsRouter from './endpoints/fields.js';
import reservationsRouter from './endpoints/reservations.js';
import ownerRequestsRouter from './endpoints/ownerRequests.js';
import reviewsRouter from './endpoints/reviews.js';
import queriesRouter from './endpoints/queries.js';
import municipalitiesRouter from './endpoints/municipalities.js';
import departamentsRouter from './endpoints/departaments.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log requests - opcional pero recomendado

// Healthcheck endpoint
app.get('/health', (_req, res) => res.json({ ok: true }));

// Test DB connection
probarConexionConLaBaseDeDatos();

// Mount routers under /api
app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', rolesRouter);
app.use('/api', userRolesRouter);
app.use('/api', gamesRouter);
app.use('/api', timeRouter);
app.use('/api', availabilityRouter);
app.use('/api', fieldsRouter);
app.use('/api', reservationsRouter);
app.use('/api', ownerRequestsRouter);
app.use('/api', reviewsRouter);
app.use('/api', queriesRouter);
app.use('/api', municipalitiesRouter);
app.use('/api', departamentsRouter);

// Handle 404 - Not Found
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Global error handler middleware
app.use((err, _req, res, _next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
