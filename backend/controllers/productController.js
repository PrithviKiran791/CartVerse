import asyncHandler from 'express-async-handler';
import { Op } from 'sequelize';
import { Product, Review, Outbox, sequelize } from '../models/index.js';

// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);

  const where = {};

  // Sequelize parameterizes this automatically — safe from SQL injection
  if (req.query.keyword) {
    const keyword = String(req.query.keyword).slice(0, 100);
    where.name = { [Op.iLike]: `%${keyword}%` };
  }

  if (req.query.category) where.category = String(req.query.category);

  if (req.query.brands) {
    const brands = String(req.query.brands).split(',').map((b) => b.trim()).filter(Boolean);
    if (brands.length) where.brand = { [Op.in]: brands };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    where.price = {};
    if (req.query.minPrice) where.price[Op.gte] = Number(req.query.minPrice);
    if (req.query.maxPrice) where.price[Op.lte] = Number(req.query.maxPrice);
  }

  if (req.query.inStock === 'true') where.stock = { [Op.gt]: 0 };

  let order = [['createdAt', 'DESC']];
  switch (req.query.sortBy) {
    case 'price-asc': order = [['price', 'ASC']]; break;
    case 'price-desc': order = [['price', 'DESC']]; break;
    case 'rating': order = [['rating', 'DESC']]; break;
    case 'newest': order = [['createdAt', 'DESC']]; break;
    case 'featured': order = [['featured', 'DESC'], ['bestSeller', 'DESC']]; break;
  }

  const { count, rows } = await Product.findAndCountAll({
    where, order, limit: pageSize, offset: pageSize * (page - 1),
  });

  res.json({ products: rows, page, pages: Math.ceil(count / pageSize), total: count });
});

// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { productId: req.params.id },
    include: [{ model: Review, as: 'reviews' }],
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @route GET /api/products/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.findAll({
    attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
    group: ['category'],
    order: [['category', 'ASC']],
    raw: true,
  });
  res.json(categories.map((c) => ({ category: c.category, count: Number(c.count) })));
});

// @route GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { [Op.or]: [{ featured: true }, { bestSeller: true }] },
    limit: 12,
  });
  res.json(products);
});

// @route GET /api/products/brands
export const getBrands = asyncHandler(async (req, res) => {
  const where = req.query.category ? { category: String(req.query.category) } : {};
  const rows = await Product.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('brand')), 'brand']],
    where,
    raw: true,
  });
  res.json(rows.map((r) => r.brand).sort());
});

// @route GET /api/products/top
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ order: [['rating', 'DESC']], limit: 5 });
  res.json(products);
});

// @route POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, subcategory, price, originalPrice, imageSlug, stock, specs, tags, description, sku, productId } = req.body;

  const t = await sequelize.transaction();
  try {
    const product = await Product.create({
      userId: req.user.id,
      productId: productId || `CV-${Date.now()}`,
      sku: sku || `SKU-${Date.now()}`,
      name, brand, category, subcategory, price, originalPrice, imageSlug, stock,
      specs: specs || {}, tags: tags || [], description,
    }, { transaction: t });

    await Outbox.create({
      aggregateType: 'Product',
      aggregateId: product.productId,
      eventType: 'created',
      payload: product.toJSON(),
    }, { transaction: t });

    await t.commit();
    res.status(201).json(product);
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

// @route PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ where: { productId: req.params.id } });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const allowedFields = ['name', 'brand', 'category', 'subcategory', 'price', 'originalPrice', 'imageSlug', 'stock', 'specs', 'featured', 'isNew', 'bestSeller', 'tags', 'description'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const t = await sequelize.transaction();
  try {
    await product.update(updates, { transaction: t });

    await Outbox.create({
      aggregateType: 'Product',
      aggregateId: product.productId,
      eventType: 'updated',
      payload: product.toJSON(),
    }, { transaction: t });

    await t.commit();
    res.json(product);
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

// @route DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ where: { productId: req.params.id } });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const t = await sequelize.transaction();
  try {
    const productId = product.productId;
    await product.destroy({ transaction: t });

    await Outbox.create({
      aggregateType: 'Product',
      aggregateId: productId,
      eventType: 'deleted',
      payload: { productId },
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Product removed' });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

// @route POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findOne({ where: { productId: req.params.id } });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({ where: { productRefId: product.id, userId: req.user.id } });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const t = await sequelize.transaction();
  try {
    await Review.create({
      productRefId: product.id,
      userId: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }, { transaction: t });

    const reviews = await Review.findAll({ where: { productRefId: product.id }, transaction: t });
    product.reviewsCount = reviews.length;
    product.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save({ transaction: t });

    await Outbox.create({
      aggregateType: 'Product',
      aggregateId: product.productId,
      eventType: 'updated',
      payload: product.toJSON(),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});