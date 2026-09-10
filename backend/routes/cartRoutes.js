import express from 'express';
import {
  getCart,
  syncCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
} from '../controllers/cartController.js';
import { resolveIdentity } from '../middleware/identityMiddleware.js';

const router = express.Router();

// Cart routes use resolveIdentity: works seamlessly for both authenticated users and guests
router.use(resolveIdentity);

router.route('/').get(getCart).delete(clearCart);
router.post('/sync', syncCart);
router.post('/items', addItemToCart);
router
  .route('/items/:itemId')
  .put(updateItemQuantity)
  .delete(removeItemFromCart);
router.route('/coupon').post(applyCoupon).delete(removeCoupon);

export default router;
