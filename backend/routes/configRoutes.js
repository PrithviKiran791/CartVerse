import express from 'express';
const router = express.Router();

// Only the public client ID is ever exposed — never the app secret
router.get('/paypal', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || '' });
});

router.get('/razorpay', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TdP8zwDyWEG1FE' });
});

export default router; 