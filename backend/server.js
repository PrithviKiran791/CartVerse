import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import builderRoutes from './routes/builderRoutes.js';
import buildRoutes from './routes/buildRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { getAdminTransactions } from './controllers/orderController.js';
import { protect, admin } from './middleware/authMiddleware.js';

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// HTTP Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
    exposedHeaders: ['x-guest-id'],
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cartverse_cookie_secret_2026'));

// Static folder for local asset uploads fallback
app.use('/uploads', express.static(path.resolve('backend/uploads')));

// General API rate limiter
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'CartVerse Backend API is healthy and operational',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Third-party Payment Configuration
app.get('/api/config/paypal', (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || 'sb',
  });
});

// Mount Application Routes
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/builder', builderRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/transactions', protect, admin, getAdminTransactions);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'CartVerse API Server',
    status: 'running',
    docs: '/api/health',
  });
});

// 404 & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(
      `[Server] CartVerse API server running in ${
        process.env.NODE_ENV || 'development'
      } mode on http://localhost:${PORT}`
    );
  });
}

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[Server Unhandled Rejection] ${err.message}`);
});

export default app;
