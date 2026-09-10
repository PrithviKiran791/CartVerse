import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReviewHelpful,
  reportReview,
  getAdminReviews,
  updateReviewStatus,
} from '../controllers/reviewController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Individual review operations
router
  .route('/:reviewId')
  .put(protect, reviewLimiter, updateReview)
  .delete(protect, deleteReview);

// Helpful vote toggle
router.route('/:reviewId/helpful').post(protect, reviewLimiter, voteReviewHelpful);

// Report review
router.route('/:reviewId/report').post(protect, reviewLimiter, reportReview);

// Admin review moderation queue
router.route('/admin').get(protect, admin, getAdminReviews);
router.route('/admin/:reviewId/status').patch(protect, admin, updateReviewStatus);

export default router;
