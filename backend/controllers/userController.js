import asyncHandler from 'express-async-handler';
import { User } from '../models/index.js';
import generateToken from '../utils/generateToken.js';

// @route POST /api/users
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password }); // isAdmin always defaults false

  generateToken(res, user.id);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

// @route POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope('withPassword').findOne({ where: { email } });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, user.id);
  res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

// @route POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    expires: new Date(0),
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
});

// @route GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user); // password excluded by default scope
});

// @route PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.scope('withPassword').findByPk(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.password) user.password = req.body.password;

  await user.save();
  generateToken(res, user.id);

  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin });
});

// @route GET /api/users (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// @route GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @route PUT /api/users/:id (admin)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.isAdmin !== undefined) user.isAdmin = Boolean(req.body.isAdmin);

  await user.save();
  res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

// @route DELETE /api/users/:id (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await user.destroy();
  res.json({ message: 'User removed' });
});