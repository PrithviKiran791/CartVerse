import express from 'express';
import {
  getUserTransactions,
  getAdminTransactions,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUserTransactions);
router.route('/admin').get(protect, admin, getAdminTransactions);

export default router;
