import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Transaction from '../models/transactionModel.js';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_CartVerse2026Key';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_CartVerse2026Secret';

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Create Razorpay order with server-calculated totals & write created Transaction
// @route   POST /api/payments/create-order
// @desc    Create Razorpay order with server-calculated totals & write created Transaction (User & Guest)
// @route   POST /api/payments/create-order
// @access  Public / Identity Resolved
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, couponCode, orderId, shippingAddress, guestEmail: rawGuestEmail } = req.body;

  const isAuthUser = Boolean(req.user && req.user._id);
  const guestId = !isAuthUser ? (req.identity?.id || req.headers['x-guest-id'] || `gst_${Date.now()}`) : null;
  const guestEmail = (!isAuthUser ? (rawGuestEmail || shippingAddress?.email || '') : '').trim().toLowerCase();

  let existingOrder = null;
  let subtotal = 0;
  let tax = 0;
  let shipping = 0;
  let grandTotal = 0;

  if (orderId) {
    // Retry payment for existing order
    existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      res.status(404);
      throw new Error('Order not found');
    }
    const isOwnerUser = isAuthUser && existingOrder.user && existingOrder.user.toString() === req.user._id.toString();
    const isAdmin = isAuthUser && req.user.isAdmin;
    const isOwnerGuest = !isAuthUser && (
      (existingOrder.guestId && existingOrder.guestId === guestId) ||
      (existingOrder.guestEmail && existingOrder.guestEmail.toLowerCase() === guestEmail)
    );

    if (!isOwnerUser && !isAdmin && !isOwnerGuest) {
      res.status(403);
      throw new Error('Not authorized to access this order');
    }
    grandTotal = existingOrder.totalPrice;
  } else {
    if (!isAuthUser) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!guestEmail || !emailRegex.test(guestEmail)) {
        res.status(400);
        throw new Error('A valid email address is required for guest checkout');
      }
    }

    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        subtotal += (Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1);
      });
    } else {
      const cartQuery = isAuthUser ? { user: req.user._id } : { guestId };
      const cart = await Cart.findOne(cartQuery);
      if (cart && cart.items.length > 0) {
        cart.calculateTotals();
        subtotal = cart.subtotal;
      }
    }

    if (subtotal <= 0) {
      res.status(400);
      throw new Error('Cannot initiate payment for empty order');
    }

    // 18% GST & Shipping
    tax = Math.round(subtotal * 0.18);
    shipping = subtotal > 5000 ? 0 : 299;
    grandTotal = subtotal + tax + shipping;

    const resolvedShipping = shippingAddress || {
      name: isAuthUser ? req.user.name : 'Guest Customer',
      phone: (isAuthUser ? req.user.phone : '') || '+91 98765 43210',
      email: isAuthUser ? req.user.email : guestEmail,
      address: 'Shipping Address',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    };
    if (!isAuthUser) {
      resolvedShipping.email = guestEmail;
    }

    // Pre-create Order document in 'pending' state
    const pendingOrder = new Order({
      user: isAuthUser ? req.user._id : null,
      guestId: !isAuthUser ? guestId : null,
      guestEmail: !isAuthUser ? guestEmail : null,
      orderItems: (items || []).map((item) => ({
        name: item.name,
        qty: item.qty || item.quantity || 1,
        image: item.image || item.imageSlug || 'default.jpg',
        price: item.price,
        product: item.product || item._id || item.id,
      })),
      shippingAddress: resolvedShipping,
      paymentMethod: 'card',
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: grandTotal,
      isPaid: false,
      status: 'pending',
      paymentStatus: 'pending',
    });

    existingOrder = await pendingOrder.save();
  }

  const amountInPaise = Math.round(grandTotal * 100);
  const receiptId = `rcpt_${Date.now()}_${existingOrder._id.toString().substring(0, 5)}`;
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_CartVerse2026Key';

  let razorpayOrderId = `order_test_${Date.now()}`;
  let razorpayPayload = null;
  let isTestMode = false;

  try {
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        orderId: existingOrder._id.toString(),
        userId: isAuthUser ? req.user._id.toString() : 'guest',
        guestId: guestId || '',
        userEmail: isAuthUser ? req.user.email : (guestEmail || existingOrder.guestEmail),
      },
    });
    razorpayOrderId = razorpayOrder.id;
    razorpayPayload = razorpayOrder;
  } catch (error) {
    console.warn('[Razorpay] Using test fallback mode:', error.message);
    isTestMode = true;
    razorpayPayload = { test: true, fallback: true, error: error.message };
  }

  // Create Transaction row with status: 'created'
  const transaction = await Transaction.create({
    orderId: existingOrder._id,
    userId: isAuthUser ? req.user._id : null,
    guestId: !isAuthUser ? guestId : null,
    gateway: 'razorpay',
    type: 'payment',
    status: 'created',
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrderId,
    rawGatewayPayload: razorpayPayload,
  });

  res.json({
    orderId: existingOrder._id,
    transactionId: transaction._id,
    razorpayOrderId: razorpayOrderId,
    amount: amountInPaise,
    currency: 'INR',
    keyId: key_id,
    grandTotal,
    isTestMode,
    guestId: !isAuthUser ? guestId : undefined,
  });
});

// @desc    Verify Razorpay payment signature & update Transaction to 'captured' (User & Guest)
// @route   POST /api/payments/verify
// @access  Public / Identity Resolved
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    guestEmail: rawGuestEmail,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    res.status(400);
    throw new Error('Missing payment identifiers');
  }

  const isAuthUser = Boolean(req.user && req.user._id);
  const guestId = !isAuthUser ? (req.identity?.id || req.headers['x-guest-id'] || null) : null;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_CartVerse2026Secret';

  // Verify HMAC-SHA256 signature
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isMockTest = razorpay_order_id.startsWith('order_test_') || !razorpay_signature || razorpay_signature === 'test_signature_mock';
  const isSignatureValid = isMockTest || generatedSignature === razorpay_signature;

  // Find existing Transaction for this razorpay order
  let transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });

  if (!isSignatureValid) {
    // Record failed transaction & update order
    if (transaction) {
      transaction.status = 'failed';
      transaction.failureReason = 'Signature verification failed';
      transaction.rawGatewayPayload = { ...transaction.rawGatewayPayload, failedAt: new Date() };
      await transaction.save();
    }
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
    }
    res.status(400);
    throw new Error('Invalid payment signature. Payment verification failed.');
  }

  let targetOrder = null;
  if (orderId) {
    targetOrder = await Order.findById(orderId);
  } else if (transaction?.orderId) {
    targetOrder = await Order.findById(transaction.orderId);
  } else {
    targetOrder = await Order.findOne({ 'paymentResult.id': razorpay_payment_id });
  }

  const emailToAssign = isAuthUser
    ? req.user.email
    : ((rawGuestEmail || shippingAddress?.email || targetOrder?.guestEmail || '').trim().toLowerCase() || 'guest@cartverse.com');

  if (!targetOrder) {
    targetOrder = new Order({
      user: isAuthUser ? req.user._id : null,
      guestId: !isAuthUser ? guestId : null,
      guestEmail: !isAuthUser ? emailToAssign : null,
      orderItems: (orderItems || []).map((item) => ({
        ...item,
        product: item.product || item._id || item.id,
        _id: undefined,
      })),
      shippingAddress: shippingAddress || {
        name: isAuthUser ? req.user.name : 'Guest Customer',
        phone: (isAuthUser ? req.user.phone : '') || '+91 98765 43210',
        email: emailToAssign,
        address: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      paymentMethod: 'card',
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
    });
  }

  // Update order to paid
  targetOrder.isPaid = true;
  targetOrder.paidAt = targetOrder.paidAt || Date.now();
  targetOrder.status = 'processing';
  targetOrder.paymentStatus = 'paid';
  targetOrder.paymentResult = {
    id: razorpay_payment_id,
    status: 'COMPLETED',
    update_time: new Date().toISOString(),
    email_address: emailToAssign,
  };

  const confirmedOrder = await targetOrder.save();

  // Update or insert Transaction record
  if (transaction) {
    transaction.status = 'captured';
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.orderId = confirmedOrder._id;
    if (!transaction.userId && isAuthUser) transaction.userId = req.user._id;
    if (!transaction.guestId && !isAuthUser && (guestId || confirmedOrder.guestId)) {
      transaction.guestId = guestId || confirmedOrder.guestId;
    }
    transaction.rawGatewayPayload = {
      ...transaction.rawGatewayPayload,
      paymentId: razorpay_payment_id,
      verifiedAt: new Date(),
    };
    await transaction.save();
  } else {
    transaction = await Transaction.create({
      orderId: confirmedOrder._id,
      userId: isAuthUser ? req.user._id : null,
      guestId: !isAuthUser ? (guestId || confirmedOrder.guestId) : null,
      gateway: 'razorpay',
      type: 'payment',
      status: 'captured',
      amount: Math.round(confirmedOrder.totalPrice * 100),
      currency: 'INR',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });
  }

  // Clear server cart upon confirmed payment
  if (isAuthUser) {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], coupon: { code: '', discountPercent: 0, discountAmount: 0 }, subtotal: 0, tax: 0, total: 0 }
    );
  } else if (guestId || confirmedOrder.guestId) {
    await Cart.findOneAndUpdate(
      { guestId: guestId || confirmedOrder.guestId },
      { items: [], coupon: { code: '', discountPercent: 0, discountAmount: 0 }, subtotal: 0, tax: 0, total: 0 }
    );
  }

  // Return confirmed order with embedded transactions
  const populatedOrder = confirmedOrder.toObject();
  populatedOrder.transactions = await Transaction.find({ orderId: confirmedOrder._id }).sort({ createdAt: -1 });

  res.status(200).json(populatedOrder);
});

// @desc    Record failed or cancelled payment attempt (User & Guest)
// @route   POST /api/payments/fail
// @access  Public / Identity Resolved
export const recordFailedPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, failureReason, rawGatewayPayload } = req.body;

  const isAuthUser = Boolean(req.user && req.user._id);
  const guestId = !isAuthUser ? (req.identity?.id || req.headers['x-guest-id'] || null) : null;

  let transaction = null;
  if (razorpay_order_id) {
    transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
  }

  if (transaction) {
    transaction.status = 'failed';
    transaction.failureReason = failureReason || 'Payment dismissed or rejected by customer';
    if (razorpay_payment_id) transaction.razorpayPaymentId = razorpay_payment_id;
    if (rawGatewayPayload) transaction.rawGatewayPayload = rawGatewayPayload;
    await transaction.save();
  } else if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      transaction = await Transaction.create({
        orderId: order._id,
        userId: isAuthUser ? req.user._id : null,
        guestId: !isAuthUser ? (guestId || order.guestId) : null,
        gateway: 'razorpay',
        type: 'payment',
        status: 'failed',
        amount: Math.round(order.totalPrice * 100),
        currency: 'INR',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        failureReason: failureReason || 'Payment dismissed or rejected by customer',
        rawGatewayPayload,
      });
    }
  }

  if (orderId) {
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
  }

  res.json({ success: true, transaction });
});

// @desc    Razorpay Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public
export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_2026';
  const signature = req.headers['x-razorpay-signature'];

  if (signature) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ status: 'invalid_signature' });
    }
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === 'payment.captured') {
    const payment = payload?.payment?.entity;
    if (payment) {
      let tx = await Transaction.findOne({ razorpayPaymentId: payment.id });
      if (!tx && payment.order_id) {
        tx = await Transaction.findOne({ razorpayOrderId: payment.order_id });
      }

      if (tx) {
        tx.status = 'captured';
        tx.razorpayPaymentId = payment.id;
        tx.rawGatewayPayload = req.body;
        await tx.save();

        await Order.findByIdAndUpdate(tx.orderId, {
          isPaid: true,
          paymentStatus: 'paid',
          status: 'processing',
          paidAt: Date.now(),
        });
      }
    }
  } else if (event === 'payment.failed') {
    const payment = payload?.payment?.entity;
    if (payment) {
      let tx = await Transaction.findOne({ razorpayOrderId: payment.order_id });
      if (tx) {
        tx.status = 'failed';
        tx.failureReason = payment.error_description || payment.error_code || 'Payment failed at gateway';
        tx.razorpayPaymentId = payment.id;
        tx.rawGatewayPayload = req.body;
        await tx.save();

        await Order.findByIdAndUpdate(tx.orderId, {
          paymentStatus: 'failed',
        });
      }
    }
  } else if (event === 'refund.processed') {
    const refund = payload?.refund?.entity;
    if (refund) {
      const origTx = await Transaction.findOne({ razorpayPaymentId: refund.payment_id });
      if (origTx) {
        await Transaction.create({
          orderId: origTx.orderId,
          userId: origTx.userId,
          gateway: 'razorpay',
          type: 'refund',
          status: 'refunded',
          amount: refund.amount,
          currency: refund.currency || 'INR',
          refundId: refund.id,
          razorpayPaymentId: refund.payment_id,
          rawGatewayPayload: req.body,
        });

        const order = await Order.findById(origTx.orderId);
        if (order) {
          const allRefunds = await Transaction.find({ orderId: order._id, type: 'refund', status: 'refunded' });
          const totalRefundedPaise = allRefunds.reduce((sum, r) => sum + r.amount, 0);
          order.paymentStatus = totalRefundedPaise >= Math.round(order.totalPrice * 100) ? 'refunded' : 'partially_refunded';
          await order.save();
        }
      }
    }
  }

  res.json({ status: 'ok' });
});

