import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token for the user and attaches it as an HTTP-Only cookie.
 * Also returns the token string for clients using Bearer tokens (e.g. SPAs, Mobile).
 */
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'cartverse_super_secret_jwt_key_2026_dev_secure';
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  if (res && res.cookie) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  return token;
};

export default generateToken;
