import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordFailedPayment,
  handleRazorpayWebhook,
} from '../controllers/paymentController.js';
import { resolveIdentity } from '../middleware/identityMiddleware.js';

const router = express.Router();

router.post('/create-order', resolveIdentity, createRazorpayOrder);
router.post('/verify', resolveIdentity, verifyRazorpayPayment);
router.post('/fail', resolveIdentity, recordFailedPayment);
router.post('/webhook', handleRazorpayWebhook);

export default router;
