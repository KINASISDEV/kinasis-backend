import express from 'express';
import { startServer } from './services/mongo.js';
import membersRouter from './enpoints/members.js';

const app = express();
startServer(app);

app.use(express.json());

app.get('/', (req, res) => {res.send('Welcome to Kinasis API!');});

app.use('/members', membersRouter);
