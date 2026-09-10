import express from 'express';
import {
  getProducts, getProductById, getCategories, getFeaturedProducts,
  getBrands, getTopProducts, createProduct, updateProduct,
  deleteProduct, createProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { productValidator, reviewValidator, validate } from '../utils/validators.js';

const router = express.Router();

// Static routes MUST come before /:id
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/top', getTopProducts);

router.route('/')
  .get(getProducts)
  .post(protect, admin, productValidator, validate, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post('/:id/reviews', protect, reviewValidator, validate, createProductReview);

export default router; 