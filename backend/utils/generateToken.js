import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // not accessible via JS — mitigates XSS token theft
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection and cross-port dev support
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });

  return token;
};

export default generateToken; 