import express from 'express';
import cors from 'cors';
import { startServer } from './services/mongo.js';
import membersRouter from './enpoints/members.js';
import dataRouter from './enpoints/data.js';
import catalogRouter from './enpoints/catalogs.js';
import servicesRouter from './enpoints/services.js';

const app = express();
startServer(app);

app.use(cors({
	origin: [
		'http://localhost:5173',
		'https://dev.kinasisdev.shop',
		'https://kinasisdev.shop',
		'https://www.kinasisdev.shop'
	]
}));
app.use(express.json());

app.get('/', (req, res) => {res.send('Welcome to Kinasis API!');});

app.use('/members', membersRouter);
app.use('/data', dataRouter);
app.use('/catalogs', catalogRouter);
app.use('/services', servicesRouter);
