import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

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
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

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

app.use('/api', apiLimiter);
app.get('/api', (req, res) => {
  res.json({
    message: 'CartVerse API is running',
  });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);

// Proxy search requests to dedicated search-service microservice
app.use('/api/v1/search', async (req, res) => {
  const searchServiceUrl = process.env.SEARCH_SERVICE_URL || 'http://localhost:5001';
  const targetUrl = `${searchServiceUrl}${req.originalUrl}`;
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': req.ip || req.connection?.remoteAddress,
        'user-agent': req.headers['user-agent'] || '',
      },
    };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    const serviceRes = await fetch(targetUrl, fetchOptions);
    const data = await serviceRes.json();
    return res.status(serviceRes.status).json(data);
  } catch (err) {
    return res.status(503).json({
      error: 'Search service temporarily unavailable',
      message: err.message,
    });
  }
});


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`
  );
});