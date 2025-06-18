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

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

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
