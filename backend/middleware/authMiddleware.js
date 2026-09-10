import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * Protect routes: Validates JWT from either:
 * 1. Authorization header: "Bearer <token>"
 * 2. HTTP-Only cookie: req.cookies.jwt
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to HttpOnly cookie
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no authentication token provided');
  }

  try {
    const secret = process.env.JWT_SECRET || 'cartverse_super_secret_jwt_key_2026_dev_secure';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

/**
 * Admin middleware: Ensures authenticated user has admin privileges
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as administrator');
  }
};

/**
 * Optional Auth middleware: Sets req.user if a valid token is present,
 * but proceeds without error if not.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'cartverse_super_secret_jwt_key_2026_dev_secure';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid/expired token in optional mode
  }
  next();
});