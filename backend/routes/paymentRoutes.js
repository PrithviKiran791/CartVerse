import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordFailedPayment,
  handleRazorpayWebhook,
} from '../controllers/paymentController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', optionalProtect, createRazorpayOrder);
router.post('/verify', optionalProtect, verifyRazorpayPayment);
router.post('/fail', recordFailedPayment);
router.post('/webhook', handleRazorpayWebhook);

export default router;
