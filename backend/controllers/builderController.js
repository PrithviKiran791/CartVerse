import asyncHandler from 'express-async-handler';
import { validateBuild as runValidationEngine } from '../utils/compatibilityEngine.js';
import Product from '../models/productModel.js';

// @desc    Validate custom PC build compatibility and calculate power headroom
// @route   POST /api/builder/validate
// @access  Public
export const validateBuild = asyncHandler(async (req, res) => {
  const build = req.body.build || req.body;
  const report = runValidationEngine(build);
  res.json(report);
});

// @desc    Get prebuilt rig packages
// @route   GET /api/builder/prebuilts
// @access  Public
export const getPrebuiltRigs = asyncHandler(async (req, res) => {
  const prebuilts = await Product.find({
    category: 'prebuilt',
  }).sort({ price: -1 });

  res.json(prebuilts);
});
