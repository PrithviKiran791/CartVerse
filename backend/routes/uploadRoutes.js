import express from 'express';
import {
  uploadProductImage,
  uploadAvatar,
  deleteImage,
} from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/product-image',
  protect,
  admin,
  upload.single('image'),
  uploadProductImage
);

router.post(
  '/avatar',
  protect,
  upload.single('avatar'),
  uploadAvatar
);

router.delete('/', protect, admin, deleteImage);

export default router;
