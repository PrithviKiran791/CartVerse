import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

import { connectDB } from './config/db.js';
import { syncDB } from './models/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';

const requiredEnvVariables = [
  'POSTGRES_HOST',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'JWT_SECRET',
];

for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

await connectDB();
await syncDB();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

app.use(cookieParser());

app.use(hpp());

app.use('/api', apiLimiter);+
app.get('/api', (req, res) => {
  res.json({
    message: 'CartVerse API is running',
  });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`
  );
});