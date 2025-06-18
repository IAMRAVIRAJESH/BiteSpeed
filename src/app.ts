import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import routes from './routes';
import { connectDB } from './config/database';
import { syncModels } from './models';

dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const initializeApp = async (): Promise<void> => {
  try {
    await connectDB();

    await syncModels();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

initializeApp();

export default app;
