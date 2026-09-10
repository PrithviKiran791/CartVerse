import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth endpoints
router.post('/login', authLimiter, authUser);
router.post('/register', authLimiter, registerUser);
router.post('/logout', logoutUser);

// Fallback user registration (for standard MERN POST /api/users)
router.route('/').post(authLimiter, registerUser).get(protect, admin, getUsers);

// User profile endpoints (supports both /profile and /me)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/me').get(protect, getUserProfile);

// Admin user management
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
