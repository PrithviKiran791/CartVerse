import rateLimit from 'express-rate-limit';

export const searchRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '120', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many search requests. Please slow down.',
  },
});

export const suggestRateLimiter = rateLimit({
  windowMs: 60000,
  max: 300, // higher allowance for typing/combobox suggestions
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many suggestion requests.',
  },
});
