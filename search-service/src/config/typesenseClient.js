import { Client } from 'typesense';
import dotenv from 'dotenv';
dotenv.config();

const typesenseHost = process.env.TYPESENSE_HOST || 'localhost';
const typesensePort = parseInt(process.env.TYPESENSE_PORT || '8108', 10);
const typesenseProtocol = process.env.TYPESENSE_PROTOCOL || 'http';
const typesenseApiKey = process.env.TYPESENSE_API_KEY || 'cartverse_dev_typesense_key_2025';

export const typesenseClient = new Client({
  nodes: [
    {
      host: typesenseHost,
      port: typesensePort,
      protocol: typesenseProtocol,
    },
  ],
  apiKey: typesenseApiKey,
  connectionTimeoutSeconds: 1,
  retryIntervalSeconds: 0.1,
  numRetries: 1,
  logLevel: 'error',
});

let lastHealthCheck = 0;
let cachedHealth = false;

export const checkTypesenseHealth = async (force = false) => {
  const now = Date.now();
  if (!force && now - lastHealthCheck < 3000) {
    return cachedHealth;
  }
  lastHealthCheck = now;
  try {
    const health = await typesenseClient.health.retrieve();
    cachedHealth = Boolean(health && health.ok === true);
    return cachedHealth;
  } catch (err) {
    cachedHealth = false;
    return false;
  }
};

export const COLLECTION_ALIAS = process.env.TYPESENSE_COLLECTION || 'cartverse_products';
