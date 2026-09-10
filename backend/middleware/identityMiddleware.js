import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to resolve either an authenticated User or a valid Guest identity.
 * Sets req.identity = { type: 'user', id: ObjectId, user } OR { type: 'guest', id: string, guestId: string }.
 */
export const resolveIdentity = async (req, res, next) => {
  let token;

  // 1. Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt || req.signedCookies?.jwt) {
    token = req.cookies?.jwt || req.signedCookies?.jwt;
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'cartverse_super_secret_jwt_key_2026_dev_secure';
      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select('-password');
      if (user) {
        req.user = user;
        req.identity = {
          type: 'user',
          id: user._id,
          userId: user._id,
          email: user.email,
        };
        return next();
      }
    } catch (err) {
      // Invalid/expired token - proceed to resolve as guest
    }
  }

  // 2. If req.user was already set by upstream middleware
  if (req.user) {
    req.identity = {
      type: 'user',
      id: req.user._id,
      userId: req.user._id,
      email: req.user.email,
    };
    return next();
  }

  // 3. Resolve Guest identity from signed cookie, plain cookie, or header
  let guestId =
    req.signedCookies?.cartverse_guest_id ||
    req.cookies?.cartverse_guest_id ||
    req.headers['x-guest-id'];

  if (!guestId) {
    guestId = `gst_${crypto.randomUUID().replace(/-/g, '')}`;
    const cookieSecret = process.env.COOKIE_SECRET || 'cartverse_cookie_secret_2026';
    res.cookie('cartverse_guest_id', guestId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      signed: Boolean(cookieSecret),
    });
  }

  res.setHeader('x-guest-id', guestId);

  req.identity = {
    type: 'guest',
    id: guestId,
    guestId,
  };

  next();
};
