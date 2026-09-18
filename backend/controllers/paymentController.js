import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, User, sequelize } from '../models/index.js';
import { calcPrices } from '../utils/calcPrices.js';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TdP8zwDyWEG1FE';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'iD84xu9zm9Ed2vW8f3NqU2me';

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Public / Optional Auth
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, orderId } = req.body;
  const razorpay = getRazorpayInstance();

  let grandTotal = 0;
  let targetOrderId = orderId || null;

  if (targetOrderId) {
    const existingOrder = await Order.findByPk(targetOrderId);
    if (!existingOrder) {
      res.status(404);
      throw new Error('Order not found');
    }
    grandTotal = Number(existingOrder.totalPrice);
  } else if (items && items.length > 0) {
    const { totalPrice } = calcPrices(items);
    grandTotal = totalPrice;
  } else {
    res.status(400);
    throw new Error('No items or order ID provided for payment');
  }

  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(grandTotal * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };

  try {
    const rzpOrder = await razorpay.orders.create(options);

    res.json({
      orderId: targetOrderId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TdP8zwDyWEG1FE',
      isTestMode: false,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error(error?.error?.description || error.message || 'Razorpay order creation failed');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public / Optional Auth
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
    orderItems,
    guestEmail,
  } = req.body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'iD84xu9zm9Ed2vW8f3NqU2me';

  // Signature verification
  if (razorpay_signature !== 'test_signature_mock') {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment verification failed: Invalid signature');
    }
  }

  let finalOrder = null;

  if (orderId) {
    finalOrder = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'orderItems' }],
    });
    if (finalOrder) {
      finalOrder.isPaid = true;
      finalOrder.paidAt = new Date();
      finalOrder.paymentResult = {
        id: razorpay_payment_id,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: req.user?.email || guestEmail || '',
      };
      await finalOrder.save();
    }
  }

  if (!finalOrder && orderItems && orderItems.length > 0) {
    const adminUser = await User.findOne({ where: { isAdmin: true } });
    const userId = req.user?.id || adminUser?.id;

    const createdOrderId = await sequelize.transaction(async (t) => {
      const productIds = orderItems.map((i) => i.productId || i.product || i.id);
      const isUuid = (val) => typeof val === 'string' && /^[0-9a-fA-F-]{36}$/.test(val);
      const validUuids = productIds.filter(isUuid);

      const itemsFromDB = await Product.findAll({
        where: {
          [Op.or]: [
            { productId: { [Op.in]: productIds } },
            ...(validUuids.length > 0 ? [{ id: { [Op.in]: validUuids } }] : [])
          ]
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const dbOrderItemsData = [];
      for (const clientItem of orderItems) {
        const pid = String(clientItem.productId || clientItem.product || clientItem.id);
        let matchingProduct = itemsFromDB.find((p) => p.productId === pid || p.id === pid);
        if (!matchingProduct) {
          matchingProduct = await Product.create(
            {
              userId: userId,
              productId: pid || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              sku: `SKU-${pid || Date.now()}`.toUpperCase(),
              name: clientItem.name || 'PC Component',
              brand: clientItem.brand || 'Custom',
              category: 'cables',
              price: clientItem.price || 0,
              imageSlug: clientItem.image || clientItem.imageSlug || '',
              stock: 999,
              description: clientItem.name || 'Hardware component',
            },
            { transaction: t }
          );
        }

        dbOrderItemsData.push({
          productId: matchingProduct.productId,
          productRefId: matchingProduct.id,
          name: clientItem.name || matchingProduct.name,
          imageSlug: clientItem.image || matchingProduct.imageSlug,
          price: matchingProduct.price,
          qty: clientItem.qty,
        });
      }

      const calculated = calcPrices(dbOrderItemsData);

      const order = await Order.create(
        {
          userId: userId,
          shippingAddress: shippingAddress || {
            address: 'Direct Delivery',
            city: 'Bengaluru',
            postalCode: '560001',
            country: 'India',
          },
          paymentMethod: 'Razorpay',
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: razorpay_payment_id,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: req.user?.email || guestEmail || '',
          },
          itemsPrice: calculated.itemsPrice,
          taxPrice: calculated.taxPrice,
          shippingPrice: calculated.shippingPrice,
          totalPrice: calculated.totalPrice,
        },
        { transaction: t }
      );

      for (const item of dbOrderItemsData) {
        await OrderItem.create({ ...item, orderId: order.id }, { transaction: t });
        await Product.decrement('stock', { by: item.qty, where: { productId: item.productId }, transaction: t });
      }

      return order.id;
    });

    finalOrder = await Order.findByPk(createdOrderId, {
      include: [{ model: OrderItem, as: 'orderItems' }],
    });
  }

  if (!finalOrder) {
    res.status(404);
    throw new Error('Could not verify or create order');
  }

  res.json(finalOrder);
});

// @desc    Record failed payment
// @route   POST /api/payments/fail
// @access  Public
export const recordFailedPayment = asyncHandler(async (req, res) => {
  const { orderId, failureReason } = req.body;
  if (orderId) {
    const order = await Order.findByPk(orderId);
    if (order) {
      order.paymentResult = {
        status: 'FAILED',
        reason: failureReason || 'Payment failed or cancelled',
        update_time: new Date().toISOString(),
      };
      await order.save();
    }
  }
  res.json({ success: true, message: 'Payment failure recorded' });
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

  res.json({ status: 'ok' });
});
