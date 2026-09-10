import express from 'express';
import {
  addOrderItems,
  lookupGuestOrder,
  getMyOrders,
  getOrderById,
  getOrderTransactions,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { resolveIdentity } from '../middleware/identityMiddleware.js';
import { lookupLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Order creation supports both Authenticated Users and Guests
router.route('/').post(resolveIdentity, addOrderItems).get(protect, getOrders);

// Guest Order Tracking / Lookup (Strict verification, rate limited)
router.post('/lookup', lookupLimiter, resolveIdentity, lookupGuestOrder);

// Authenticated user order history dashboard
router.route('/myorders').get(protect, getMyOrders);

// Single order details & transactions (Identity check: User ownership OR Guest cookie/query verification)
router.route('/:id').get(resolveIdentity, getOrderById);
router.route('/:id/transactions').get(resolveIdentity, getOrderTransactions);
router.route('/:id/pay').put(resolveIdentity, updateOrderToPaid);

// Admin only actions
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').patch(protect, admin, updateOrderStatus);

export default router;

