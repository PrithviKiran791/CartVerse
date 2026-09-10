import express from 'express';
import {
  getProducts,
  getProductById,
  getProductCategories,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  getProductReviews,
  createReview,
} from '../controllers/reviewController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public catalog routes
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/categories', getProductCategories);
router.get('/top', getTopProducts);

// Product reviews (paginated published list & authenticated creation)
router
  .route('/:productId/reviews')
  .get(optionalAuth, getProductReviews)
  .post(protect, reviewLimiter, createReview);

// Backward-compatibility /:id/reviews alias
router
  .route('/:id/reviews')
  .get(optionalAuth, getProductReviews)
  .post(protect, reviewLimiter, createReview);

// Individual product operations
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
