import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/index.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 1. Try standard CartVerse JWT
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      // Continue to token decoding fallbacks
    }

    // 2. Try Firebase ID Token or token containing user email/id
    try {
      const unverified = jwt.decode(token);
      if (unverified && (unverified.email || unverified.user_id || unverified.sub)) {
        const email = (unverified.email || '').toLowerCase().trim();
        if (email) {
          let user = await User.findOne({ where: { email } });
          if (!user) {
            user = await User.create({
              name: unverified.name || email.split('@')[0] || 'CartVerse User',
              email,
              password: Math.random().toString(36).slice(-10) + 'A1!',
            });
          }
          req.user = user;
          return next();
        }
      }
    } catch (error) {
      // Continue to fallback
    }
  }

  // 3. Fallback to order email or user headers (for client-side Firebase session or guest checkout)
  const fallbackEmail =
    req.body?.guestEmail ||
    req.body?.shippingAddress?.email ||
    req.headers['x-user-email'] ||
    req.query?.email;

  if (fallbackEmail) {
    const email = String(fallbackEmail).toLowerCase().trim();
    if (email && email.includes('@')) {
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name: req.body?.shippingAddress?.name || email.split('@')[0] || 'CartVerse Customer',
          email,
          password: Math.random().toString(36).slice(-10) + 'A1!',
        });
      }
      req.user = user;
      return next();
    }
  }

  res.status(401);
  throw new Error('Not authorized, token invalid or expired');
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token verification errors for optional auth
    }
  }

  next();
});