import express from 'express';
import {
  registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile,
  getUsers, getUserById, updateUser, deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerValidator, loginValidator, profileUpdateValidator, validate } from '../utils/validators.js';

const router = express.Router();

router.post('/', authLimiter, registerValidator, validate, registerUser);
router.post('/login', authLimiter, loginValidator, validate, loginUser);
router.post('/logout', logoutUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, profileUpdateValidator, validate, updateUserProfile);

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router; 