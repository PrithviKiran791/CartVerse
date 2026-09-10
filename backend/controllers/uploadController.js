import asyncHandler from 'express-async-handler';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Upload product image
// @route   POST /api/upload/product-image
// @access  Private/Admin
export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please select an image file to upload');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, 'cartverse/products');

  res.status(201).json({
    url: result.secure_url,
    public_id: result.public_id,
    message: 'Product image uploaded successfully',
  });
});

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please select an image file to upload');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, 'cartverse/avatars');

  res.status(201).json({
    url: result.secure_url,
    public_id: result.public_id,
    message: 'Avatar uploaded successfully',
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Private/Admin
export const deleteImage = asyncHandler(async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    res.status(400);
    throw new Error('public_id is required');
  }

  await deleteFromCloudinary(public_id);
  res.json({ message: 'Image deleted successfully' });
});
