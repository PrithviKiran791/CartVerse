import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {
  searchProducts,
  suggestProducts,
  getSearchFacets,
  healthCheck,
  readinessCheck,
} from './controllers/searchController.js';
import { runFullReindex } from './indexer/indexerWorker.js';
import { startIncrementalSyncWorker } from './indexer/incrementalSync.js';
import { searchRateLimiter, suggestRateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { testDbConnection } from './config/db.js';
import { checkTypesenseHealth } from './config/typesenseClient.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(requestLogger);

// Health & Readiness Probes
app.get('/healthz', healthCheck);
app.get('/readyz', readinessCheck);

// API Versioned Search Routes
app.get('/api/v1/search', searchRateLimiter, searchProducts);
app.get('/api/v1/search/suggest', suggestRateLimiter, suggestProducts);
app.get('/api/v1/search/facets', getSearchFacets);

// Admin Reindex Route
app.post('/api/v1/search/reindex', async (req, res) => {
  try {
    const result = await runFullReindex();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SearchService] Unhandled Error:', err);
  res.status(500).json({ error: 'Internal search service error', message: err.message });
});

// Startup & Service Verification
const startServer = async () => {
  console.log('--- Initializing CartVerse Search Service ---');

  // Verify PostgreSQL
  const dbConnected = await testDbConnection();
  if (dbConnected) {
    console.log('[DB] PostgreSQL connected successfully.');
  } else {
    console.error('[DB] PostgreSQL connection failed. Check database credentials.');
  }

  // Check Typesense status
  const typesenseUp = await checkTypesenseHealth();
  if (typesenseUp) {
    console.log('[Typesense] Search engine connected and ready.');
  } else {
    console.warn(
      '[Typesense] Typesense engine not responding. Auto-fallback mode is ACTIVE (PostgreSQL SQL search).'
    );
  }

  // Start incremental sync worker for transactional outbox
  startIncrementalSyncWorker(1000);

  app.listen(PORT, () => {
    console.log(`[SearchService] Running on port ${PORT}`);
    console.log(`[SearchService] Health check: http://localhost:${PORT}/healthz`);
  });
};

// Export app for integration tests
export default app;

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
