import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Build from '../models/buildModel.js';
import { validateBuild, calculateEstimatedWattage } from '../utils/compatibilityEngine.js';
import crypto from 'crypto';

// @desc    Create or save custom PC build
// @route   POST /api/builds
// @access  Public / Optional Auth
export const createBuild = asyncHandler(async (req, res) => {
  const { name, components, isPublic } = req.body;

  if (!components || Object.keys(components).length === 0) {
    res.status(400);
    throw new Error('Please provide at least one component in the build');
  }

  // Server-side compatibility & wattage re-validation
  const report = validateBuild(components);
  const estimatedWattage = calculateEstimatedWattage(components);

  // Compute total price server-side
  let totalPrice = 0;
  Object.values(components).forEach((part) => {
    if (part && typeof part === 'object' && part.price) {
      totalPrice += Number(part.price) || 0;
    }
  });

  const shareSlug = `cv-${crypto.randomBytes(4).toString('hex')}`;

  const build = new Build({
    user: req.user ? req.user._id : null,
    name: name || 'Custom Gaming Rig',
    components,
    totalPrice,
    totalWattage: estimatedWattage,
    isPublic: isPublic !== undefined ? isPublic : true,
    shareSlug,
    compatibilityReport: report,
  });

  const savedBuild = await build.save();
  res.status(201).json(savedBuild);
});

// @desc    Get build by ID or share slug
// @route   GET /api/builds/:id
// @access  Public
export const getBuildByIdOrSlug = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let build = null;
  if (mongoose.isValidObjectId(id)) {
    build = await Build.findById(id).populate('user', 'name email');
  }

  if (!build) {
    build = await Build.findOne({ shareSlug: id }).populate('user', 'name email');
  }

  if (build) {
    res.json(build);
  } else {
    res.status(404);
    throw new Error('Saved PC build not found');
  }
});

// @desc    Get all saved builds for logged in user
// @route   GET /api/builds/mine
// @access  Private
export const getMyBuilds = asyncHandler(async (req, res) => {
  const builds = await Build.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(builds);
});

// @desc    Update a saved build
// @route   PUT /api/builds/:id
// @access  Private
export const updateBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) {
    res.status(404);
    throw new Error('Build not found');
  }

  if (!build.user || build.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this build');
  }

  if (req.body.name) build.name = req.body.name;
  if (req.body.isPublic !== undefined) build.isPublic = req.body.isPublic;

  if (req.body.components) {
    build.components = req.body.components;
    build.compatibilityReport = validateBuild(req.body.components);
    build.totalWattage = calculateEstimatedWattage(req.body.components);

    let totalPrice = 0;
    Object.values(req.body.components).forEach((part) => {
      if (part && typeof part === 'object' && part.price) {
        totalPrice += Number(part.price) || 0;
      }
    });
    build.totalPrice = totalPrice;
  }

  const updatedBuild = await build.save();
  res.json(updatedBuild);
});

// @desc    Delete a saved build
// @route   DELETE /api/builds/:id
// @access  Private
export const deleteBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) {
    res.status(404);
    throw new Error('Build not found');
  }

  if (!build.user || build.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this build');
  }

  await Build.deleteOne({ _id: build._id });
  res.json({ message: 'Build removed successfully' });
});
