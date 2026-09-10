import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Transaction from '../models/transactionModel.js';
import Cart from '../models/cartModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login (or /api/auth/login)
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token,
      message: 'Login successful',
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user & migrate guest orders/transactions
// @route   POST /api/users (or /api/auth/register)
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, guestId: clientGuestId } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone: phone || '',
  });

  if (user) {
    const token = generateToken(res, user._id);

    // Resolve guest identity for order migration
    const resolvedGuestId =
      clientGuestId ||
      req.signedCookies?.cartverse_guest_id ||
      req.cookies?.cartverse_guest_id ||
      req.headers['x-guest-id'] ||
      req.identity?.id;

    // Migrate any previous guest orders matching email or guestId
    const migrationConditions = [
      { guestEmail: normalizedEmail },
      { 'shippingAddress.email': normalizedEmail },
    ];
    if (resolvedGuestId) {
      migrationConditions.push({ guestId: resolvedGuestId });
    }

    const migratedOrders = await Order.updateMany(
      { user: null, $or: migrationConditions },
      { $set: { user: user._id } }
    );

    // Migrate transactions tied to these orders or this guestId
    if (resolvedGuestId) {
      await Transaction.updateMany(
        { userId: null, guestId: resolvedGuestId },
        { $set: { userId: user._id } }
      );
    }

    // Migrate or clean up guest cart
    if (resolvedGuestId) {
      const guestCart = await Cart.findOne({ guestId: resolvedGuestId });
      if (guestCart && guestCart.items.length > 0) {
        const existingUserCart = await Cart.findOne({ user: user._id });
        if (!existingUserCart) {
          guestCart.user = user._id;
          guestCart.guestId = null;
          await guestCart.save();
        } else {
          await Cart.deleteOne({ _id: guestCart._id });
        }
      }
    }

    // Clear guest cookie upon account conversion
    res.clearCookie('cartverse_guest_id');

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token,
      migratedOrdersCount: migratedOrders.modifiedCount || 0,
      message: 'User registered successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data received');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout (or /api/auth/logout)
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile (or /api/auth/me)
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile (or /api/auth/profile)
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
      if (emailExists) {
        res.status(409);
        throw new Error('Email is already registered by another account');
      }
      user.email = req.body.email.toLowerCase();
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(res, updatedUser._id);

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
      },
      token,
      message: 'Profile updated successfully',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete administrator user account');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.isAdmin = Boolean(req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin);

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
