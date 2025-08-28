// server.js
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
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
import departamentsRouter from './endpoints/municipalities.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

probarConexionConLaBaseDeDatos();

// mount routers under /api
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
