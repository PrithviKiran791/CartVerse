import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';
import dotenv from 'dotenv';
dotenv.config();

const memoryCache = new LRUCache({
  max: 1000,
  ttl: (parseInt(process.env.CACHE_TTL_SECONDS || '120', 10)) * 1000,
});

let redisClient = null;
let isRedisAvailable = false;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 2000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // don't spam retries if redis is not running
    lazyConnect: true,
  });

  redisClient.connect().then(() => {
    isRedisAvailable = true;
    console.log('[Cache] Connected to Redis successfully');
  }).catch(() => {
    isRedisAvailable = false;
    console.log('[Cache] Redis unavailable, using in-memory LRU fallback');
  });

  redisClient.on('error', () => {
    isRedisAvailable = false;
  });
} catch (e) {
  isRedisAvailable = false;
}

export const getCached = async (key) => {
  if (isRedisAvailable && redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      // Fallback to memory
    }
  }
  return memoryCache.get(key) || null;
};

export const setCached = async (key, value, ttlSeconds = 120) => {
  const serialized = JSON.stringify(value);
  memoryCache.set(key, value, { ttl: ttlSeconds * 1000 });

  if (isRedisAvailable && redisClient) {
    try {
      await redisClient.set(key, serialized, 'EX', ttlSeconds);
    } catch (e) {
      // Ignore redis set error
    }
  }
};

export const flushCache = async () => {
  memoryCache.clear();
  if (isRedisAvailable && redisClient) {
    try {
      await redisClient.flushdb();
    } catch (e) {}
  }
};
