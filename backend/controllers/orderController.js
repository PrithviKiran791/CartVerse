import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Transaction from '../models/transactionModel.js';

// @desc    Create new order (Supports Authenticated User & Guest Checkout)
// @route   POST /api/orders
// @access  Public / Identity Resolved
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    guestEmail: rawGuestEmail,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided in request');
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  const isAuthUser = Boolean(req.user && req.user._id);
  let orderUser = null;
  let orderGuestId = null;
  let orderGuestEmail = null;

  if (isAuthUser) {
    orderUser = req.user._id;
  } else {
    // Guest checkout: validate guest email
    const emailToValidate = (rawGuestEmail || shippingAddress.email || '').toString().trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailToValidate || !emailRegex.test(emailToValidate)) {
      res.status(400);
      throw new Error('A valid email address is required for guest checkout');
    }

    orderGuestId = req.identity?.id || req.headers['x-guest-id'] || `gst_${Date.now()}`;
    orderGuestEmail = emailToValidate;
    shippingAddress.email = emailToValidate;
  }

  const order = new Order({
    orderItems: orderItems.map((item) => {
      const prod = item.product || item._id || item.id;
      return {
        ...item,
        product: prod && mongoose.isValidObjectId(prod) ? prod : undefined,
        _id: undefined,
      };
    }),
    user: orderUser,
    guestId: orderGuestId,
    guestEmail: orderGuestEmail,
    shippingAddress,
    paymentMethod: paymentMethod || 'upi',
    itemsPrice: Number(itemsPrice) || 0,
    taxPrice: Number(taxPrice) || 0,
    shippingPrice: Number(shippingPrice) || 0,
    totalPrice: Number(totalPrice) || 0,
    status: paymentMethod === 'cod' ? 'processing' : 'pending',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    isPaid: false,
  });

  const createdOrder = await order.save();

  // If COD, record a transaction with status: 'created'
  if (paymentMethod === 'cod') {
    await Transaction.create({
      orderId: createdOrder._id,
      userId: orderUser,
      guestId: orderGuestId,
      gateway: 'cod',
      type: 'payment',
      status: 'created',
      amount: Math.round(createdOrder.totalPrice * 100),
      currency: 'INR',
      rawGatewayPayload: {
        method: 'cod',
        note: 'Cash On Delivery Order',
        email: isAuthUser ? req.user.email : orderGuestEmail,
      },
    });
  }

  // Clear server cart upon order placement
  if (isAuthUser) {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], coupon: { code: '', discountPercent: 0, discountAmount: 0 }, subtotal: 0, tax: 0, total: 0 }
    );
  } else if (orderGuestId) {
    await Cart.findOneAndUpdate(
      { guestId: orderGuestId },
      { items: [], coupon: { code: '', discountPercent: 0, discountAmount: 0 }, subtotal: 0, tax: 0, total: 0 }
    );
  }

  const populatedOrder = createdOrder.toObject();
  populatedOrder.transactions = await Transaction.find({ orderId: createdOrder._id }).sort({ createdAt: -1 });

  res.status(201).json(populatedOrder);
});

// @desc    Lookup guest order by orderId + email (Strict Verification, Rate Limited)
// @route   POST /api/orders/lookup
// @access  Public
export const lookupGuestOrder = asyncHandler(async (req, res) => {
  const { orderId, email } = req.body;

  if (!orderId || !email) {
    res.status(400);
    throw new Error('Please provide both Order ID and Email address');
  }

  const trimmedId = String(orderId).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  // Basic mongo ObjectId format check
  if (!trimmedId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(404);
    throw new Error('No matching order found with the provided details');
  }

  const order = await Order.findById(trimmedId).populate('user', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('No matching order found with the provided details');
  }

  // Check email match against guestEmail, user.email, or shippingAddress.email
  const guestMatch = order.guestEmail && order.guestEmail.toLowerCase() === normalizedEmail;
  const shippingMatch = order.shippingAddress?.email && order.shippingAddress.email.toLowerCase() === normalizedEmail;
  const userMatch = order.user?.email && order.user.email.toLowerCase() === normalizedEmail;

  if (!guestMatch && !shippingMatch && !userMatch) {
    res.status(404);
    throw new Error('No matching order found with the provided details');
  }

  const transactions = await Transaction.find({ orderId: order._id }).sort({ createdAt: -1 });
  const orderData = order.toObject();
  orderData.transactions = transactions;
  orderData.orderStatus = order.status;
  orderData.paymentStatus = order.paymentStatus || (order.isPaid ? 'paid' : 'pending');

  res.json(orderData);
});

// @desc    Get logged in user orders with pagination & status filtering (lightweight shape)
// @route   GET /api/orders or /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status && status !== 'all') {
    query.status = status;
  }

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  // Return lightweight shape for list views (omit bloated specs)
  const lightweightOrders = orders.map((o) => ({
    _id: o._id,
    createdAt: o.createdAt,
    orderStatus: o.status,
    status: o.status,
    paymentStatus: o.paymentStatus || (o.isPaid ? 'paid' : 'pending'),
    paymentMethod: o.paymentMethod,
    totalPrice: o.totalPrice,
    itemsPrice: o.itemsPrice,
    taxPrice: o.taxPrice,
    shippingPrice: o.shippingPrice,
    itemsCount: o.orderItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0,
    orderItems: (o.orderItems || []).map((i) => ({
      name: i.name,
      qty: i.qty,
      image: i.image,
      price: i.price,
    })),
  }));

  res.json({
    orders: lightweightOrders,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get order by ID with embedded related transactions (Supports User & Guest with identity/email verification)
// @route   GET /api/orders/:id
// @access  Public / Private (Identity checked)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.isAdmin;
  const isGuestIdOwner = req.identity && order.guestId && order.guestId === req.identity.id;
  const queryEmail = req.query.email ? String(req.query.email).trim().toLowerCase() : null;
  const isEmailOwner = queryEmail && (
    (order.guestEmail && order.guestEmail.toLowerCase() === queryEmail) ||
    (order.shippingAddress?.email && order.shippingAddress.email.toLowerCase() === queryEmail)
  );

  if (isUserOwner || isAdmin || isGuestIdOwner || isEmailOwner) {
    const transactions = await Transaction.find({ orderId: order._id }).sort({ createdAt: -1 });
    const orderData = order.toObject();
    orderData.transactions = transactions;
    orderData.orderStatus = order.status;
    orderData.paymentStatus = order.paymentStatus || (order.isPaid ? 'paid' : 'pending');
    res.json(orderData);
  } else {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
});

// @desc    Get transactions tied to a specific order
// @route   GET /api/orders/:id/transactions
// @access  Public / Private (Identity checked)
export const getOrderTransactions = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isUserOwner = req.user && order.user && order.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.isAdmin;
  const isGuestIdOwner = req.identity && order.guestId && order.guestId === req.identity.id;
  const queryEmail = req.query.email ? String(req.query.email).trim().toLowerCase() : null;
  const isEmailOwner = queryEmail && (
    (order.guestEmail && order.guestEmail.toLowerCase() === queryEmail) ||
    (order.shippingAddress?.email && order.shippingAddress.email.toLowerCase() === queryEmail)
  );

  if (!isUserOwner && !isAdmin && !isGuestIdOwner && !isEmailOwner) {
    res.status(403);
    throw new Error('Not authorized to view transactions for this order');
  }

  const transactions = await Transaction.find({ orderId: order._id }).sort({ createdAt: -1 });
  res.json(transactions);
});

// @desc    Get logged in user's transactions across all orders
// @route   GET /api/transactions
// @access  Private
export const getUserTransactions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;

  const count = await Transaction.countDocuments({ userId: req.user._id });
  const transactions = await Transaction.find({ userId: req.user._id })
    .populate('orderId', 'totalPrice status paymentStatus createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    transactions,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get failed/disputed transactions across all users (Admin)
// @route   GET /api/admin/transactions
// @access  Private/Admin
export const getAdminTransactions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  const count = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .populate('orderId', 'totalPrice status paymentStatus createdAt')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    transactions,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentStatus = 'paid';
    order.paymentResult = {
      id: req.body.id || `TXN-${Date.now()}`,
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders (Admin) or current user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  if (req.user.isAdmin && req.query.admin === 'true') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    return res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  }

  // Otherwise return current user's orders
  return getMyOrders(req, res);
});
