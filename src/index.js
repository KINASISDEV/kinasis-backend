import express from 'express';
import cors from 'cors';
import { startServer } from './services/mongo.js';
import membersRouter from './enpoints/members.js';

const app = express();
startServer(app);

app.use(cors({
	origin: [
		'http://localhost:5173',
		'https://kinasisdev.shop',
		'https://www.kinasisdev.shop'
	]
}));
app.use(express.json());

app.get('/', (req, res) => {res.send('Welcome to Kinasis API!');});

app.use('/members', membersRouter);
