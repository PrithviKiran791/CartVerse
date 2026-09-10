import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { screenReviewContent } from '../utils/reviewModeration.js';

/**
 * Helper: Recomputes product avgRating and reviewCount from published reviews (Option A on write)
 */
export const recomputeProductRating = async (productId) => {
  try {
    let product;
    if (mongoose.isValidObjectId(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ id: productId }, { sku: productId }, { sku: productId.toUpperCase() }],
      });
    }

    if (!product) return null;

    const lookupId = product.id || String(product._id);

    // MongoDB aggregation: only published reviews count toward public rating metrics
    const stats = await Review.aggregate([
      {
        $match: {
          productId: { $in: [lookupId, String(product._id), product.id].filter(Boolean) },
          status: 'published',
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

    product.avgRating = avgRating;
    product.reviewCount = reviewCount;
    // Maintain backwards compatibility
    product.rating = avgRating;
    product.reviewsCount = reviewCount;

    await product.save();
    return { avgRating, reviewCount };
  } catch (error) {
    console.error(`Failed to recompute rating for product ${productId}:`, error.message);
    return null;
  }
};

/**
 * @desc    Get paginated, published reviews & rating breakdown for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
  const sortOption = req.query.sort || 'recent';

  // Build sort criteria
  let sortCriteria = { createdAt: -1 };
  if (sortOption === 'helpful') {
    sortCriteria = { helpfulVotes: -1, createdAt: -1 };
  } else if (sortOption === 'rating_high') {
    sortCriteria = { rating: -1, createdAt: -1 };
  } else if (sortOption === 'rating_low') {
    sortCriteria = { rating: 1, createdAt: -1 };
  }

  // Find matching product to ensure we check both string id and ObjectId if applicable
  let productLookup = [productId];
  if (mongoose.isValidObjectId(productId)) {
    const prodDoc = await Product.findById(productId);
    if (prodDoc?.id) productLookup.push(prodDoc.id);
  } else {
    const prodDoc = await Product.findOne({ id: productId });
    if (prodDoc?._id) productLookup.push(String(prodDoc._id));
  }

  const matchFilter = {
    productId: { $in: productLookup },
    status: 'published',
  };

  // 1. Calculate overall aggregate & distribution breakdown
  const [breakdownStats, totalCount] = await Promise.all([
    Review.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]),
    Review.countDocuments(matchFilter),
  ]);

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let ratingSum = 0;

  breakdownStats.forEach((stat) => {
    if (breakdown[stat._id] !== undefined) {
      breakdown[stat._id] = stat.count;
      ratingSum += stat._id * stat.count;
    }
  });

  const avgRating = totalCount > 0 ? Math.round((ratingSum / totalCount) * 10) / 10 : 0;
  const recommendedCount = (breakdown[5] || 0) + (breakdown[4] || 0);
  const percentageRecommended = totalCount > 0 ? Math.round((recommendedCount / totalCount) * 100) : 0;

  // 2. Fetch paginated published reviews
  const rawReviews = await Review.find(matchFilter)
    .populate('userId', 'name email avatar')
    .sort(sortCriteria)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const currentUserId = req.user?._id ? String(req.user._id) : null;

  const reviews = rawReviews.map((rev) => ({
    ...rev,
    id: rev._id,
    userName: rev.userId?.name || 'Verified Customer',
    userAvatar: rev.userId?.avatar || '',
    isHelpfulVoted: currentUserId && rev.helpfulVotedBy
      ? rev.helpfulVotedBy.some((id) => String(id) === currentUserId)
      : false,
    verifiedPurchase: Boolean(rev.orderId),
  }));

  // 3. Current user's own review (if authenticated)
  let currentUserReview = null;
  if (currentUserId) {
    const userRev = await Review.findOne({
      productId: { $in: productLookup },
      userId: req.user._id,
    })
      .populate('userId', 'name email avatar')
      .lean();

    if (userRev) {
      currentUserReview = {
        ...userRev,
        id: userRev._id,
        userName: userRev.userId?.name || req.user.name,
        isHelpfulVoted: false,
        verifiedPurchase: Boolean(userRev.orderId),
      };
    }
  }

  res.json({
    reviews,
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit) || 1,
      hasMore: page * limit < totalCount,
    },
    summary: {
      avgRating,
      reviewCount: totalCount,
      breakdown,
      percentageRecommended,
    },
    currentUserReview,
  });
});

/**
 * @desc    Submit a new review for a product
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, body, images } = req.body;

  // Validate rating
  const numericRating = Number(rating);
  if (!numericRating || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be an integer between 1 and 5');
  }

  // Validate review body
  const cleanBody = body?.trim();
  if (!cleanBody || cleanBody.length < 5) {
    res.status(400);
    throw new Error('Review body must be at least 5 characters in length');
  }

  // Verify product exists
  let product;
  if (mongoose.isValidObjectId(productId)) {
    product = await Product.findById(productId);
  }
  if (!product) {
    product = await Product.findOne({
      $or: [{ id: productId }, { sku: productId }, { sku: productId.toUpperCase() }],
    });
  }

  const resolvedProductId = product?.id || productId;

  // Guard: One review per user per product (compound unique index)
  const existingReview = await Review.findOne({
    productId: resolvedProductId,
    userId: req.user._id,
  });

  if (existingReview) {
    res.status(409);
    throw new Error('You have already reviewed this product. Please edit your existing review instead.');
  }

  // Section 3: Verified Purchase Tagging
  // Check if reviewing user has a delivered Order containing this product
  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    $or: [{ status: 'delivered' }, { isDelivered: true }],
    $or: [
      { 'orderItems.product': product?._id },
      { 'orderItems.productId': resolvedProductId },
      { 'orderItems.productId': productId },
    ],
  });

  // Section 5: Automated Content Screening
  const screening = screenReviewContent(title || '', cleanBody);
  const reviewStatus = screening.isFlagged ? 'pending' : 'published';

  const review = await Review.create({
    productId: resolvedProductId,
    userId: req.user._id,
    orderId: deliveredOrder ? deliveredOrder._id : null,
    rating: numericRating,
    title: (title || '').trim(),
    body: cleanBody,
    images: Array.isArray(images) ? images : [],
    status: reviewStatus,
  });

  // Section 2: Recompute product aggregate on write if published
  if (reviewStatus === 'published') {
    await recomputeProductRating(resolvedProductId);
  }

  res.status(201).json({
    message: screening.isFlagged
      ? 'Review submitted and queued for community moderation screening.'
      : 'Review verified and published successfully!',
    review: {
      ...review.toObject(),
      id: review._id,
      userName: req.user.name,
      verifiedPurchase: Boolean(deliveredOrder),
    },
  });
});

/**
 * @desc    Update existing review (owner-only)
 * @route   PUT /api/reviews/:reviewId
 * @access  Private
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, body, images } = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check ownership
  if (review.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized to modify this review');
  }

  // Validate rating if provided
  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400);
      throw new Error('Rating must be an integer between 1 and 5');
    }
    review.rating = numericRating;
  }

  // Validate body if provided
  if (body !== undefined) {
    const cleanBody = body.trim();
    if (cleanBody.length < 5) {
      res.status(400);
      throw new Error('Review body must be at least 5 characters');
    }
    review.body = cleanBody;
  }

  if (title !== undefined) {
    review.title = title.trim();
  }

  if (Array.isArray(images)) {
    review.images = images;
  }

  // Re-screen content
  const screening = screenReviewContent(review.title, review.body);
  review.status = screening.isFlagged ? 'pending' : 'published';
  review.editedAt = new Date();

  await review.save();

  // Recompute product rating
  await recomputeProductRating(review.productId);

  res.json({
    message: screening.isFlagged
      ? 'Review updated and queued for automated moderation.'
      : 'Review updated successfully!',
    review: {
      ...review.toObject(),
      id: review._id,
      userName: req.user.name,
      verifiedPurchase: Boolean(review.orderId),
    },
  });
});

/**
 * @desc    Delete a review (owner or admin)
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const isOwner = review.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Unauthorized to delete this review');
  }

  const productId = review.productId;
  await review.deleteOne();

  // Recompute product rating
  await recomputeProductRating(productId);

  res.json({ message: 'Review successfully removed' });
});

/**
 * @desc    Vote a review as helpful (or toggle vote off)
 * @route   POST /api/reviews/:reviewId/helpful
 * @access  Private
 */
export const voteReviewHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Prevent voting on own review
  if (review.userId.toString() === userId.toString()) {
    res.status(400);
    throw new Error('Cannot vote on your own review');
  }

  const alreadyVotedIndex = review.helpfulVotedBy.findIndex(
    (id) => id.toString() === userId.toString()
  );

  let isHelpfulVoted = false;

  if (alreadyVotedIndex !== -1) {
    // Toggle off
    review.helpfulVotedBy.splice(alreadyVotedIndex, 1);
    review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    isHelpfulVoted = false;
  } else {
    // Add vote
    review.helpfulVotedBy.push(userId);
    review.helpfulVotes += 1;
    isHelpfulVoted = true;
  }

  await review.save();

  res.json({
    helpfulVotes: review.helpfulVotes,
    isHelpfulVoted,
  });
});

/**
 * @desc    Report an inappropriate review
 * @route   POST /api/reviews/:reviewId/report
 * @access  Private
 */
export const reportReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const alreadyReported = review.reportedBy.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyReported) {
    return res.status(200).json({
      message: 'You have already reported this review. Our team is investigating.',
      isHidden: review.status === 'pending',
    });
  }

  review.reportedBy.push(userId);
  review.reportCount += 1;

  // Section 5: If report threshold (3) is reached, immediately pull from public view
  let isHidden = false;
  if (review.reportCount >= 3) {
    review.status = 'pending';
    isHidden = true;
  }

  await review.save();

  if (isHidden) {
    await recomputeProductRating(review.productId);
  }

  res.json({
    message: isHidden
      ? 'Review flagged and hidden for moderation review.'
      : 'Report received. Thank you for maintaining community standards.',
    isHidden,
  });
});

/**
 * @desc    Get moderation queue (Admin only)
 * @route   GET /api/admin/reviews
 * @access  Private/Admin
 */
export const getAdminReviews = asyncHandler(async (req, res) => {
  const status = req.query.status || 'pending';

  const reviews = await Review.find({ status })
    .populate('userId', 'name email')
    .sort({ reportCount: -1, createdAt: -1 })
    .limit(100);

  res.json(reviews);
});

/**
 * @desc    Update review status (approve/reject, Admin only)
 * @route   PATCH /api/admin/reviews/:reviewId/status
 * @access  Private/Admin
 */
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!['published', 'pending', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be published, pending, or rejected.');
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = status;
  await review.save();

  // Recompute product rating
  await recomputeProductRating(review.productId);

  res.json({
    message: `Review status updated to ${status}`,
    review,
  });
});
