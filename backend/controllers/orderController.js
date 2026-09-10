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
    const productIds = orderItems.map((i) => i.productId);
    const itemsFromDB = await Product.findAll({
      where: { productId: { [Op.in]: productIds } },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const dbOrderItemsData = orderItems.map((clientItem) => {
      const matchingProduct = itemsFromDB.find((p) => p.productId === clientItem.productId);
      if (!matchingProduct) {
        throw Object.assign(new Error(`Product not found: ${clientItem.productId}`), { statusCode: 400 });
      }
      if (matchingProduct.stock < clientItem.qty) {
        throw Object.assign(new Error(`Insufficient stock for ${matchingProduct.name}`), { statusCode: 400 });
      }
      return {
        productId: matchingProduct.productId,
        productRefId: matchingProduct.id,
        name: matchingProduct.name,
        imageSlug: matchingProduct.imageSlug,
        price: matchingProduct.price, // server price, never client price
        qty: clientItem.qty,
      };
    });

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
  res.status(201).json(fullOrder);
});

// @route GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: OrderItem, as: 'orderItems' }],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
});

// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      { model: OrderItem, as: 'orderItems' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.userId !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @route PUT /api/orders/:id/pay
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.userId !== req.user.id && !req.user.isAdmin) {
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
  res.json(order);
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
  res.json(order);
});

// @route GET /api/orders (admin)
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
});