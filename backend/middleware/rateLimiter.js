import rateLimit from 'express-rate-limit';

// Strict limiter for auth endpoints — blunts brute-force / credential-stuffing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for guest order lookup to prevent brute-force order ID enumeration
export const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many order lookup attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Review submission and voting limiter to prevent review spam / bot flood
export const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { message: 'Too many review operations. Please wait before submitting more reviews.' },
  standardHeaders: true,
  legacyHeaders: false,
});
 