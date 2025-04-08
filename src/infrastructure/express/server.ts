import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { Container } from 'typedi';
import { config } from '../config';
import { MongoDBConnection } from '../database/mongodb/connection';
import todoRoutes from './routes/todoRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await MongoDBConnection.getInstance().connect();
    
    const port = config.server.port;
    app.listen(port, () => {
      console.log(`Server running on port ${port} in ${config.server.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

if (require.main === module) {
  startServer();
}

export default app;
