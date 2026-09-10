import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 500;
  const page = Number(req.query.pageNumber) || 1;

  const filter = {};

  // Keyword search across name, brand, description, tags, sku
  if (req.query.keyword) {
    const keywordRegex = { $regex: req.query.keyword, $options: 'i' };
    filter.$or = [
      { name: keywordRegex },
      { brand: keywordRegex },
      { description: keywordRegex },
      { sku: keywordRegex },
      { tags: keywordRegex },
    ];
  }

  // Category filter
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category.toLowerCase();
  }

  // Brand filter (supports comma-separated list)
  if (req.query.brand) {
    const brands = req.query.brand.split(',').map((b) => b.trim());
    filter.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
  }

  // Product Class filter ('consumer' | 'server')
  if (req.query.productClass) {
    filter.productClass = req.query.productClass;
  }

  // Server Sockets / CPU Sockets filter
  if (req.query.socket) {
    const sockets = req.query.socket.split(',').map((s) => s.trim());
    filter['specs.socket'] = { $in: sockets };
  }

  // Server Socket Count (1, 2, 4)
  if (req.query.socketCount) {
    const socketCounts = req.query.socketCount.split(',').map((c) => Number(c.trim()));
    filter.socketCount = { $in: socketCounts };
  }

  // RAM Type filter (Consumer DDR4/DDR5)
  if (req.query.ramType) {
    const ramTypes = req.query.ramType.split(',').map((r) => r.trim());
    filter['specs.ramType'] = { $in: ramTypes };
  }

  // Server Memory Type (UDIMM, RDIMM, LRDIMM)
  if (req.query.memoryType) {
    const memTypes = req.query.memoryType.split(',').map((m) => m.trim());
    filter.memoryType = { $in: memTypes };
  }

  // Rack Units (1, 2, 4, etc.)
  if (req.query.rackUnits) {
    const rUnits = req.query.rackUnits.split(',').map((u) => Number(u.trim()));
    filter.rackUnits = { $in: rUnits };
  }

  // PSU Redundancy ('single', 'N+1', 'N+N')
  if (req.query.psuRedundancy) {
    const redundancies = req.query.psuRedundancy.split(',').map((r) => r.trim());
    filter.psuRedundancy = { $in: redundancies };
  }

  // Use Case filter (e.g. 'ai-training', 'virtualization', 'storage', etc.)
  if (req.query.useCase) {
    const useCases = req.query.useCase.split(',').map((u) => u.trim());
    filter.useCaseTags = { $in: useCases };
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // In stock only filter
  if (req.query.inStockOnly === 'true' || req.query.inStockOnly === true) {
    filter.stock = { $gt: 0 };
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  switch (req.query.sortBy) {
    case 'price-asc':
      sortOption = { price: 1 };
      break;
    case 'price-desc':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'featured':
      sortOption = { featured: -1, rating: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product by ID or SKU/slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product = null;

  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  }

  if (!product) {
    // Lookup by custom string ID or SKU
    product = await Product.findOne({
      $or: [{ id: id }, { sku: id }, { sku: id.toUpperCase() }],
    });
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found in hardware catalog');
  }
});

// @desc    Get product category statistics & taxonomy
// @route   GET /api/products/categories
// @access  Public
export const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json(categories);
});

// @desc    Get top rated and featured products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true })
    .sort({ rating: -1 })
    .limit(8);

  // If few featured, fallback to highest rated
  if (products.length < 4) {
    const topRated = await Product.find({})
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(8);
    res.json(topRated);
    return;
  }

  res.json(products);
});

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  let product;
  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({ id: id });
  }

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already submitted a review for this product');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review verified and added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  if (!productData.sku || !productData.name || !productData.category) {
    res.status(400);
    throw new Error('Please provide sku, name, and category');
  }

  const existingProduct = await Product.findOne({ sku: productData.sku });
  if (existingProduct) {
    res.status(409);
    throw new Error(`Product with SKU ${productData.sku} already exists`);
  }

  const product = new Product(productData);
  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({ id: id });
  }

  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({ id: id });
  }

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product deleted successfully from catalog' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
