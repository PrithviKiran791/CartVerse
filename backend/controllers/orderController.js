import asyncHandler from 'express-async-handler';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, User, sequelize } from '../models/index.js';
import { calcPrices } from '../utils/calcPrices.js';

// @route POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // Wrapped in a transaction with row locks — prevents two simultaneous orders
  // from overselling the same stock (a race condition Mongo's version didn't guard against)
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
            userId: req.user.id,
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

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItemsData);

    const order = await Order.create(
      { userId: req.user.id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice },
      { transaction: t }
    );

    for (const item of dbOrderItemsData) {
      await OrderItem.create({ ...item, orderId: order.id }, { transaction: t });
      await Product.decrement('stock', { by: item.qty, where: { productId: item.productId }, transaction: t });
    }

    return order.id;
  });

  const fullOrder = await Order.findByPk(createdOrderId, { include: [{ model: OrderItem, as: 'orderItems' }] });
  res.status(201).json(formatOrderResponse(fullOrder));
});

// Helper to normalize and augment order records for both PostgreSQL and legacy client expectations
const formatOrderResponse = (order) => {
  if (!order) return null;
  const json = typeof order.toJSON === 'function' ? order.toJSON() : { ...order };
  const isDelivered = Boolean(json.isDelivered);
  const isPaid = Boolean(json.isPaid);
  const calculatedStatus = isDelivered ? 'delivered' : isPaid ? 'processing' : 'pending';
  const paymentStatus = isPaid ? 'paid' : (json.paymentMethod === 'cod' ? 'pending' : 'pending');

  return {
    ...json,
    _id: json.id,
    id: json.id,
    status: json.status || calculatedStatus,
    paymentStatus: json.paymentStatus || paymentStatus,
    orderItems: (json.orderItems || []).map((item) => {
      const itemJson = typeof item.toJSON === 'function' ? item.toJSON() : { ...item };
      const prod = itemJson.product || {};
      const img = itemJson.imageSlug || itemJson.image || prod.imageSlug || prod.image || '';
      return {
        ...itemJson,
        image: img,
        imageUrl: img,
        imageSlug: img,
        category: itemJson.category || prod.category || 'hardware',
      };
    }),
  };
};

// @route GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : null;

  const whereConditions = [{ userId: req.user.id }];
  if (userEmail) {
    whereConditions.push(
      sequelize.where(
        sequelize.literal(`LOWER("Order"."shippingAddress"->>'email')`),
        userEmail
      )
    );
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  const orders = await Order.findAll({
    where: {
      [Op.or]: whereConditions,
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'imageSlug', 'category'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  let formattedOrders = orders.map(formatOrderResponse);

  const { status } = req.query;
  if (status && status !== 'all') {
    formattedOrders = formattedOrders.filter(
      (order) => order.status?.toLowerCase() === status.toLowerCase()
    );
  }

  const total = formattedOrders.length;
  const paginatedOrders = formattedOrders.slice(offset, offset + limit);

  res.json({
    orders: paginatedOrders,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'imageSlug', 'category'] }],
      },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : null;
  const queryEmail = req.query?.email ? req.query.email.toLowerCase().trim() : null;
  const orderShippingEmail = order.shippingAddress?.email
    ? order.shippingAddress.email.toLowerCase().trim()
    : null;

  const isOwner = req.user && order.userId === req.user.id;
  const isAdmin = Boolean(req.user?.isAdmin);
  const isEmailMatch =
    orderShippingEmail &&
    ((userEmail && orderShippingEmail === userEmail) ||
      (queryEmail && orderShippingEmail === queryEmail));

  if (!isOwner && !isAdmin && !isEmailMatch) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(formatOrderResponse(order));
});

// @route PUT /api/orders/:id/pay
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : null;
  const orderShippingEmail = order.shippingAddress?.email
    ? order.shippingAddress.email.toLowerCase().trim()
    : null;
  const isOwner = req.user && order.userId === req.user.id;
  const isAdmin = Boolean(req.user?.isAdmin);
  const isEmailMatch = userEmail && orderShippingEmail && userEmail === orderShippingEmail;

  if (!isOwner && !isAdmin && !isEmailMatch) {
    res.status(403);
    throw new Error('Not authorized');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  await order.save();
  res.json(formatOrderResponse(order));
});

// @route PUT /api/orders/:id/deliver (admin)
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();
  res.json(formatOrderResponse(order));
});

// @route GET /api/orders (admin)
export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  const { count, rows: orders } = await Order.findAndCountAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name'] },
      { model: OrderItem, as: 'orderItems' },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  res.json({
    orders: orders.map(formatOrderResponse),
    page,
    pages: Math.ceil(count / limit) || 1,
    total: count,
  });
});