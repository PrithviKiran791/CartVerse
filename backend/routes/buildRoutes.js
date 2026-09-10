import express from 'express';
import {
  createBuild,
  getBuildByIdOrSlug,
  getMyBuilds,
  updateBuild,
  deleteBuild,
} from '../controllers/buildController.js';
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// Optional auth parser for guest vs authenticated build saves
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'cartverse_super_secret_jwt_key_2026_dev_secure';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (e) {
      // Ignore token decode errors for optional auth
    }
  }
  next();
};

router.route('/').post(optionalAuth, createBuild);
router.route('/mine').get(protect, getMyBuilds);
router
  .route('/:id')
  .get(getBuildByIdOrSlug)
  .put(protect, updateBuild)
  .delete(protect, deleteBuild);

export default router;
