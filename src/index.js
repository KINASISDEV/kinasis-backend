import express from 'express';
import { startServer } from './services/mongo.js';

const app = express();
startServer(app);


app.get('/', (req, res) => {
  res.send('Welcome to Kinasis API!');
});
