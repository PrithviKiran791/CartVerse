# CartVerse Backend — Implementation Plan

> A step-by-step implementation roadmap for the CartVerse backend API, database, authentication, payment integration, and frontend screen development.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Task 3 — Create Express Server & Install Nodemon](#task-3--create-express-server--install-nodemon)
- [Task 4 — Install Mongoose & Create Product Schema](#task-4--install-mongoose--create-product-schema)
- [Task 5 — Product Controller Part 1](#task-5--product-controller-part-1)
- [Task 6 — Product Controller Part 2](#task-6--product-controller-part-2)
- [Task 7 — Create Product Routes](#task-7--create-product-routes)
- [Task 8 — MongoDB Atlas Setup, DB Config & .env](#task-8--mongodb-atlas-setup-db-config--env)
- [Task 9 — User MongoDB Schema](#task-9--user-mongodb-schema)
- [Task 10 — JWT Token Generation](#task-10--jwt-token-generation)
- [Task 11 — User Controllers Part 1 (Sign In & Sign Up)](#task-11--user-controllers-part-1-sign-in--sign-up)
- [Task 12 — User Controllers Part 2 (Profile)](#task-12--user-controllers-part-2-profile)
- [Task 13 — User Controllers Part 3 (Admin)](#task-13--user-controllers-part-3-admin)
- [Task 14 — User Routes](#task-14--user-routes)
- [Task 15 — Auth Middleware (User & Admin)](#task-15--auth-middleware-user--admin)
- [Task 16 — Protect Routes with Middleware](#task-16--protect-routes-with-middleware)
- [Task 17 — CORS & Cookie Parser](#task-17--cors--cookie-parser)
- [Task 18 — Upload Seed Data to MongoDB](#task-18--upload-seed-data-to-mongodb)
- [Task 19 — Test User Routes in Postman](#task-19--test-user-routes-in-postman)
- [Task 20 — Test Product Routes in Postman](#task-20--test-product-routes-in-postman)
- [Task 49 — Order Schema](#task-49--order-schema)
- [Task 50 — Calculate Prices for Items](#task-50--calculate-prices-for-items)
- [Task 51 — PayPal Setup](#task-51--paypal-setup)
- [Task 52 — Order Controllers Part 1](#task-52--order-controllers-part-1)
- [Task 53 — Order Controllers Part 2](#task-53--order-controllers-part-2)
- [Task 54 — Order Routes](#task-54--order-routes)
- [Task 55 — Orders API Slice (Frontend)](#task-55--orders-api-slice-frontend)
- [Task 56 — Private Route & Shipping Screen Part 1](#task-56--private-route--shipping-screen-part-1)
- [Task 57 — Shipping Screen Part 2](#task-57--shipping-screen-part-2)
- [Task 58 — Payment Screen](#task-58--payment-screen)
- [Task 59 — Place Order Part 1](#task-59--place-order-part-1)
- [Task 60 — Place Order Part 2](#task-60--place-order-part-2)
- [Task 61 — Order Screen Part 1](#task-61--order-screen-part-1)
- [Task 62 — Order Screen Part 2 (PayPal)](#task-62--order-screen-part-2-paypal)
- [Task 63 — Order Screen Part 3 (Admin)](#task-63--order-screen-part-3-admin)
- [Task 64 — Profile Screen Part 1](#task-64--profile-screen-part-1)
- [Task 65 — Profile Screen Part 2 (Order History)](#task-65--profile-screen-part-2-order-history)
- [Task 66 — Profile Screen Part 3 (Polish)](#task-66--profile-screen-part-3-polish)
- [Verification Plan](#verification-plan)

---

## Architecture Overview

```
┌─────────────────────────┐       REST API        ┌──────────────────────────┐
│   Frontend (Existing)   │ ────────────────────▶  │    Backend (New)          │
│   React 19 + Vite       │   HTTP-Only Cookies    │    Express.js             │
│   Port 5173             │ ◀──────────────────── │    Port 5000              │
└─────────────────────────┘                        └────────┬─────────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │   MongoDB Atlas   │
                                                   │   (Cloud DB)      │
                                                   └──────────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │   PayPal API      │
                                                   │   (Payments)      │
                                                   └──────────────────┘
```

**Request flow:**
1. Frontend makes API call to `/api/*` (proxied via Vite in dev)
2. Express receives request → runs middleware (CORS, cookie-parser, JSON parser)
3. Auth middleware reads JWT from HTTP-only cookie → attaches `req.user`
4. Controller processes request → queries MongoDB via Mongoose
5. Response sent back as JSON

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js | Server-side JavaScript |
| Framework | Express.js | HTTP server & routing |
| Database | MongoDB Atlas | Cloud-hosted document database |
| ODM | Mongoose | MongoDB object modeling |
| Auth | JSON Web Tokens (JWT) | Stateless authentication |
| Password | bcryptjs | Password hashing (12 salt rounds) |
| Payments | PayPal REST API | Order payments |
| Dev Server | Nodemon | Auto-restart on file changes |
| Env Config | dotenv | Environment variable management |
| Security | CORS + cookie-parser | Cross-origin + cookie handling |

---

## Directory Structure

```
CartVerse/
├── frontend/                     # Existing React app
│   ├── src/
│   │   ├── slices/               # NEW — API service slices
│   │   │   ├── apiSlice.js
│   │   │   └── ordersApiSlice.js
│   │   ├── pages/                # MODIFY — new screens
│   │   │   ├── ShippingScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   ├── PlaceOrderScreen.tsx
│   │   │   ├── OrderScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── components/           # MODIFY
│   │   │   ├── PrivateRoute.tsx
│   │   │   └── AdminRoute.tsx
│   │   └── ...
│   ├── vite.config.ts            # MODIFY — add API proxy
│   └── .env                      # NEW
│
├── backend/                      # NEW — entire directory
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js  # Product CRUD + reviews
│   │   ├── userController.js     # Auth + profile + admin
│   │   └── orderController.js    # Orders + payments
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification + admin check
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   ├── productModel.js       # Product schema
│   │   ├── userModel.js          # User schema + bcrypt hooks
│   │   └── orderModel.js         # Order schema
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   ├── generateToken.js      # JWT + cookie utility
│   │   └── calcPrices.js         # Server-side price calculation
│   ├── data/
│   │   ├── products.js           # 501 product seed data
│   │   └── users.js              # Admin + test user seed data
│   ├── seeder.js                 # DB seed/destroy script
│   └── server.js                 # Express entry point
│
├── package.json                  # Root package.json (scripts)
├── .env                          # Environment variables
├── .gitignore
└── README.md
```

---

## Task 3 — Create Express Server & Install Nodemon

### Goal
Set up the Express server with nodemon for hot-reloading during development.

### Install
```bash
npm init -y
npm install express
npm install -D nodemon
```

### Files

**`package.json`** (project root)
```json
{
  "name": "cartverse",
  "version": "1.0.0",
  "type": "module",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "server": "nodemon backend/server.js"
  }
}
```

> **Note:** `"type": "module"` enables ES module `import/export` syntax throughout the backend.

**`backend/server.js`**
```javascript
import express from 'express';
const port = process.env.PORT || 5000;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'CartVerse API is running' });
});

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
```

### Acceptance Criteria
- [x] `npm run server` starts Express on port 5000
- [x] Nodemon auto-restarts on file changes
- [x] `GET http://localhost:5000/api` returns `{ "message": "CartVerse API is running" }`

---

## Task 4 — Install Mongoose & Create Product Schema

### Goal
Define the MongoDB product schema matching the frontend's `Product` TypeScript interface.

### Install
```bash
npm install mongoose
```

### Files

**`backend/models/productModel.js`**

```javascript
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  productId:     { type: String, required: true, unique: true },
  sku:           { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  brand:         { type: String, required: true },
  category:      { type: String, required: true, enum: [
    'cpu', 'gpu', 'motherboard', 'ram', 'ssd', 'hdd', 'psu', 'cabinet',
    'cooler', 'monitor', 'keyboard', 'mouse', 'mousepad', 'headphones',
    'speakers', 'webcam', 'controller', 'cables', 'prebuilt'
  ]},
  subcategory:   { type: String },
  price:         { type: Number, required: true, default: 0 },
  originalPrice: { type: Number },
  imageSlug:     { type: String, required: true },
  stock:         { type: Number, required: true, default: 0 },
  rating:        { type: Number, required: true, default: 0 },
  reviewsCount:  { type: Number, required: true, default: 0 },
  specs:         { type: mongoose.Schema.Types.Mixed, default: {} },
  featured:      { type: Boolean, default: false },
  isNew:         { type: Boolean, default: false },
  bestSeller:    { type: Boolean, default: false },
  tags:          [{ type: String }],
  description:   { type: String, required: true },
  reviews:       [reviewSchema],
}, { timestamps: true });

// Text search index
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

// Compound indexes for filtering
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ featured: 1, bestSeller: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
```

### Schema Field Mapping

| Frontend (`Product`) | MongoDB Field | Notes |
|---------------------|---------------|-------|
| `id` | `productId` | Stored as `productId` to avoid conflict with Mongo's `_id` |
| `sku` | `sku` | Unique index (e.g. `"CV-CPU-1039"`) |
| `name` | `name` | Text index for search |
| `brand` | `brand` | Text index for search |
| `category` | `category` | Enum validation, 19 categories |
| `price` | `price` | Integer in INR (₹) |
| `originalPrice` | `originalPrice` | Strike-through price for discounts |
| `imageSlug` | `imageSlug` | Relative path (e.g. `"CPU_Image/AMD/..."`) |
| `specs` | `specs` | `Mixed` type — flexible `HardwareSpecs` object |
| `tags` | `tags` | String array (e.g. `["AM5", "DDR5"]`) |

### Acceptance Criteria
- [x] Schema file exports `Product` model
- [x] No runtime errors on import
- [x] Embedded `reviewSchema` for product reviews
- [x] Appropriate indexes created

---

## Task 5 — Product Controller Part 1

### Goal
Implement public product endpoints: listing with filters, single product, categories, and featured.

### Files

**`backend/controllers/productController.js`**

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `getProducts` | `GET` | `/api/products` | Paginated listing with keyword search, category filter, brand filter, price range, in-stock filter, and sorting |
| `getProductById` | `GET` | `/api/products/:id` | Find by `productId`. Returns full product or 404 |
| `getCategories` | `GET` | `/api/products/categories` | Aggregate distinct categories with product counts |
| `getFeaturedProducts` | `GET` | `/api/products/featured` | Products where `featured: true` or `bestSeller: true`, limit 12 |

### Query Parameters for `getProducts`

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `keyword` | string | `ryzen` | Search name (regex, case-insensitive) |
| `category` | string | `cpu` | Filter by category |
| `brands` | string | `AMD,Intel` | Comma-separated brand filter |
| `minPrice` | number | `5000` | Minimum price |
| `maxPrice` | number | `50000` | Maximum price |
| `inStock` | boolean | `true` | Only in-stock products |
| `sortBy` | string | `price-asc` | Sort: `featured`, `price-asc`, `price-desc`, `rating`, `newest` |
| `page` | number | `1` | Page number |
| `pageSize` | number | `20` | Items per page |

### Response Shape
```json
{
  "products": [ ... ],
  "page": 1,
  "pages": 5,
  "total": 98
}
```

### Acceptance Criteria
- [x] `GET /api/products` returns paginated products
- [x] `GET /api/products?keyword=ryzen&category=cpu` filters correctly
- [x] `GET /api/products/nonexistent-id` returns 404
- [x] `GET /api/products/categories` returns category list with counts

---

## Task 6 — Product Controller Part 2

### Goal
Add admin CRUD operations and user review functionality.

### Additional Functions

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `createProduct` | `POST` | `/api/products` | Admin | Create product with sample defaults |
| `updateProduct` | `PUT` | `/api/products/:id` | Admin | Update any product field |
| `deleteProduct` | `DELETE` | `/api/products/:id` | Admin | Remove product |
| `createProductReview` | `POST` | `/api/products/:id/reviews` | User | Add review. Prevents duplicates per user. Recalculates rating. |
| `getBrands` | `GET` | `/api/products/brands` | Public | Distinct brands (optional `?category=` filter) |
| `getTopProducts` | `GET` | `/api/products/top` | Public | Top 5 by rating |

### Review Rating Recalculation
```javascript
product.reviewsCount = product.reviews.length;
product.rating =
  product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
await product.save();
```

### Acceptance Criteria
- [x] Admin can create, update, and delete products
- [x] Users can submit reviews (one per product)
- [x] Product rating auto-updates after review submission
- [x] Duplicate review attempt returns 400 error

---

## Task 7 — Create Product Routes

### Files

**`backend/routes/productRoutes.js`**

```javascript
import express from 'express';
import {
  getProducts, getProductById, getCategories, getFeaturedProducts,
  getBrands, getTopProducts, createProduct, updateProduct,
  deleteProduct, createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/top', getTopProducts);
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
```

> **Important:** Static routes (`/categories`, `/featured`, `/brands`, `/top`) must be declared **before** the `/:id` dynamic route to prevent Express from matching "categories" as a product ID.

### Wire in `server.js`
```javascript
import productRoutes from './routes/productRoutes.js';
app.use('/api/products', productRoutes);
```

### Acceptance Criteria
- [x] All routes registered and accessible
- [x] Public routes accessible without auth
- [x] Protected routes return 401 without cookie

---

## Task 8 — MongoDB Atlas Setup, DB Config & .env

### Goal
Connect to MongoDB Atlas cloud database using environment variables.

### Install
```bash
npm install dotenv
```

### Manual Steps
1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Create free M0 cluster
2. Create database user (username + password)
3. Network Access → Whitelist `0.0.0.0/0` (for development)
4. Connect → Get connection string
5. Create database named `cartverse`

### Files

**`backend/config/db.js`**
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

**`.env`** (project root)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cartverse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Update `backend/server.js`**
```javascript
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

connectDB();

// ... routes ...

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
```

### Acceptance Criteria
- [x] Server starts and logs `MongoDB Connected: cluster0-shard-xxxxx.mongodb.net`
- [x] `.env` is in `.gitignore`
- [x] Connection failure logs error and exits

---

## Task 9 — User MongoDB Schema

### Goal
Define user schema with password hashing and comparison methods.

### Install
```bash
npm install bcryptjs
```

### Files

**`backend/models/userModel.js`**
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  isAdmin:  { type: Boolean, required: true, default: false },
}, { timestamps: true });

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
```

### Key Design Decisions
- **Salt rounds: 12** — Good balance between security and performance
- **Pre-save hook** — Only hashes if password field was modified (prevents re-hashing on profile updates)
- **`matchPassword` instance method** — Called as `user.matchPassword(enteredPassword)`

### Acceptance Criteria
- [x] User model exported with `matchPassword` method
- [x] Pre-save hook hashes password on create
- [x] Pre-save hook skips hashing on non-password updates

---

## Task 10 — JWT Token Generation

### Goal
Create utility to generate JWT and set it as a secure HTTP-only cookie.

### Install
```bash
npm install jsonwebtoken
```

### Files

**`backend/utils/generateToken.js`**
```javascript
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,                                    // Not accessible via JavaScript
    secure: process.env.NODE_ENV !== 'development',    // HTTPS only in production
    sameSite: 'strict',                                // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000,                 // 30 days in milliseconds
  });
};

export default generateToken;
```

### Why HTTP-Only Cookies?
| Feature | `Authorization: Bearer` Header | HTTP-Only Cookie |
|---------|-------------------------------|------------------|
| XSS Protection | ❌ Token in localStorage/memory | ✅ Not accessible via JS |
| Auto-sent | ❌ Must attach manually | ✅ Sent automatically |
| CSRF | ✅ Not auto-sent | ⚠️ Mitigated by `sameSite: strict` |

### Acceptance Criteria
- [x] Function generates JWT with 30-day expiry
- [x] Cookie set with `httpOnly`, `secure` (prod), `sameSite: strict`
- [x] Cookie name is `jwt`

---

## Task 11 — User Controllers Part 1 (Sign In & Sign Up)

### Goal
Implement user registration, login, and logout.

### Functions

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `registerUser` | `POST` | `/api/users` | Create new user. Validate fields. Check email uniqueness. Hash password (via pre-save hook). Set JWT cookie. Return user data. |
| `loginUser` | `POST` | `/api/users/login` | Find by email. Compare password. Set JWT cookie. Return user data. 401 if invalid. |
| `logoutUser` | `POST` | `/api/users/logout` | Clear JWT cookie (`maxAge: 0`). Return success message. |

### Request/Response

**Register: `POST /api/users`**
```json
// Request
{ "name": "Prithvi Kiran", "email": "prithvi@cartverse.in", "password": "password123" }

// Response (201)
{ "_id": "...", "name": "Prithvi Kiran", "email": "prithvi@cartverse.in", "isAdmin": false }
// + Set-Cookie: jwt=eyJ... (HTTP-Only)
```

**Login: `POST /api/users/login`**
```json
// Request
{ "email": "prithvi@cartverse.in", "password": "password123" }

// Response (200)
{ "_id": "...", "name": "Prithvi Kiran", "email": "prithvi@cartverse.in", "isAdmin": false }
// + Set-Cookie: jwt=eyJ... (HTTP-Only)
```

**Logout: `POST /api/users/logout`**
```json
// Response (200)
{ "message": "Logged out successfully" }
// + Set-Cookie: jwt=; Max-Age=0
```

### Validation Rules
- **Name**: required, non-empty
- **Email**: required, valid format, unique in DB
- **Password**: required, minimum 6 characters

### Acceptance Criteria
- [x] Register creates user and sets cookie
- [x] Duplicate email returns 400 "User already exists"
- [x] Login with valid credentials returns user + cookie
- [x] Login with invalid credentials returns 401
- [x] Logout clears the cookie

---

## Task 12 — User Controllers Part 2 (Profile)

### Goal
Allow authenticated users to view and update their profile.

### Functions

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `getUserProfile` | `GET` | `/api/users/profile` | User | Return current user data from `req.user._id` |
| `updateUserProfile` | `PUT` | `/api/users/profile` | User | Update name, email, phone. Optionally update password. |

### Password Update Logic
```javascript
// Only update password if provided in request body
if (req.body.password) {
  user.password = req.body.password;  // Pre-save hook will hash it
}
await user.save();

// Refresh JWT cookie with updated info
generateToken(res, user._id);
```

### Acceptance Criteria
- [x] `GET /profile` returns user data (without password)
- [x] `PUT /profile` updates name and email
- [x] Password change works and is re-hashed
- [x] Unauthenticated request returns 401

---

## Task 13 — User Controllers Part 3 (Admin)

### Goal
Admin-only user management operations.

### Functions

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `getUsers` | `GET` | `/api/users` | Admin | List all users (exclude password) |
| `getUserById` | `GET` | `/api/users/:id` | Admin | Get single user (exclude password) |
| `updateUser` | `PUT` | `/api/users/:id` | Admin | Update name, email, isAdmin |
| `deleteUser` | `DELETE` | `/api/users/:id` | Admin | Delete user (prevent self-deletion) |

### Safety Check
```javascript
// Prevent admin from deleting themselves
if (user._id.toString() === req.user._id.toString()) {
  res.status(400);
  throw new Error('Cannot delete your own admin account');
}
```

### Acceptance Criteria
- [x] Admin can list, view, update, and delete users
- [x] Non-admin gets 403 Forbidden
- [x] Admin cannot delete themselves
- [x] Password field is never returned

---

## Task 14 — User Routes

### Files

**`backend/routes/userRoutes.js`**
```javascript
import express from 'express';
import {
  registerUser, loginUser, logoutUser,
  getUserProfile, updateUserProfile,
  getUsers, getUserById, updateUser, deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
```

### Wire in `server.js`
```javascript
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
```

### Route Summary

| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| `POST` | `/api/users` | Public | `registerUser` |
| `GET` | `/api/users` | Admin | `getUsers` |
| `POST` | `/api/users/login` | Public | `loginUser` |
| `POST` | `/api/users/logout` | Public | `logoutUser` |
| `GET` | `/api/users/profile` | User | `getUserProfile` |
| `PUT` | `/api/users/profile` | User | `updateUserProfile` |
| `GET` | `/api/users/:id` | Admin | `getUserById` |
| `PUT` | `/api/users/:id` | Admin | `updateUser` |
| `DELETE` | `/api/users/:id` | Admin | `deleteUser` |

---

## Task 15 — Auth Middleware (User & Admin)

### Files

**`backend/middleware/authMiddleware.js`**
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes — verify JWT from cookie
const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Admin check — must be used AFTER protect
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };
```

**`backend/middleware/errorMiddleware.js`**
```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
```

### Middleware Chain
```
Request → CORS → Cookie Parser → JSON Parser → Route Handler
                                                     │
                                          ┌──────────┴──────────┐
                                          │  Public Route        │  → Controller → Response
                                          │  Protected Route     │  → protect → Controller → Response
                                          │  Admin Route         │  → protect → admin → Controller → Response
                                          └─────────────────────┘
                                                     │
                                              errorHandler (catch-all)
```

### Acceptance Criteria
- [x] Protected routes return 401 without JWT cookie
- [x] Protected routes work with valid JWT cookie
- [x] Admin routes return 403 for non-admin users
- [x] Malformed tokens return 401
- [x] 404 handler catches unknown routes

---

## Task 16 — Protect Routes with Middleware

### Changes

**Product Routes** (`productRoutes.js`):
| Endpoint | Middleware |
|----------|-----------|
| `GET /` | Public |
| `GET /categories` | Public |
| `GET /featured` | Public |
| `GET /brands` | Public |
| `GET /top` | Public |
| `GET /:id` | Public |
| `POST /` | `protect, admin` |
| `PUT /:id` | `protect, admin` |
| `DELETE /:id` | `protect, admin` |
| `POST /:id/reviews` | `protect` |

**User Routes** (`userRoutes.js`):
Already protected in Task 14.

### Acceptance Criteria
- [x] All public routes accessible without auth
- [x] Admin routes return 401/403 for unauthorized access
- [x] Review creation requires authentication

---

## Task 17 — CORS & Cookie Parser

### Install
```bash
npm install cors cookie-parser
```

### Update `backend/server.js`
```javascript
import cors from 'cors';
import cookieParser from 'cookie-parser';

// CORS — allow frontend origin with credentials
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,    // Required for cookies
}));

// Cookie parser — read JWT from req.cookies
app.use(cookieParser());
```

### Why `credentials: true`?
- Frontend must set `credentials: 'include'` on fetch requests
- Backend must set `credentials: true` in CORS config
- Without this, cookies are **not sent** cross-origin

### Add to `.env`
```env
CLIENT_URL=http://localhost:5173
```

### Acceptance Criteria
- [x] Frontend at `:5173` can call backend at `:5000` without CORS errors
- [x] Cookies are sent and received cross-origin
- [x] Other origins are blocked

---

## Task 18 — Upload Seed Data to MongoDB

### Goal
Import the 501 products from the frontend mock data and create default users.

### Files

**`backend/data/users.js`**
```javascript
import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@cartverse.in',
    password: bcrypt.hashSync('admin123', 12),
    isAdmin: true,
  },
  {
    name: 'Prithvi Kiran',
    email: 'prithvi@cartverse.in',
    password: bcrypt.hashSync('password123', 12),
    isAdmin: false,
  },
  {
    name: 'Test User',
    email: 'test@cartverse.in',
    password: bcrypt.hashSync('test1234', 12),
    isAdmin: false,
  },
];

export default users;
```

**`backend/data/products.js`**
- Converted from `frontend/src/data/mockProducts.ts`
- 501 products as a plain JavaScript array
- Frontend `id` field mapped to `productId`

**`backend/seeder.js`**
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import users from './data/users.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((p) => ({ ...p, user: adminUser }));
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "data:import": "node backend/seeder.js",
    "data:destroy": "node backend/seeder.js -d"
  }
}
```

### Run
```bash
npm run data:import     # Seeds 501 products + 3 users
npm run data:destroy    # Wipes all data
```

### Acceptance Criteria
- [x] `npm run data:import` logs "Data Imported!"
- [x] MongoDB Atlas shows 501 products in `products` collection
- [x] MongoDB Atlas shows 3 users in `users` collection
- [x] All products linked to admin user via `user` field
- [x] `npm run data:destroy` clears both collections

---

## Task 19 — Test User Routes in Postman

### Test Checklist

| # | Method | URL | Body / Notes | Expected Response |
|---|--------|-----|--------------|-------------------|
| 1 | `POST` | `/api/users` | `{ "name": "Test", "email": "new@test.com", "password": "123456" }` | `201` + user data + `jwt` cookie |
| 2 | `POST` | `/api/users` | Same email again | `400` "User already exists" |
| 3 | `POST` | `/api/users/login` | `{ "email": "new@test.com", "password": "123456" }` | `200` + user data + `jwt` cookie |
| 4 | `POST` | `/api/users/login` | Wrong password | `401` "Invalid email or password" |
| 5 | `GET` | `/api/users/profile` | (with `jwt` cookie) | `200` + user profile |
| 6 | `GET` | `/api/users/profile` | (no cookie) | `401` "Not authorized" |
| 7 | `PUT` | `/api/users/profile` | `{ "name": "Updated Name" }` | `200` + updated data |
| 8 | `POST` | `/api/users/logout` | — | `200` + cookie cleared |
| 9 | `POST` | `/api/users/login` | Admin credentials | `200` + `isAdmin: true` |
| 10 | `GET` | `/api/users` | (admin cookie) | `200` + all users list |
| 11 | `GET` | `/api/users` | (non-admin cookie) | `403` "Not authorized as admin" |
| 12 | `DELETE` | `/api/users/:id` | (admin cookie, other user's id) | `200` + success |
| 13 | `DELETE` | `/api/users/:id` | (admin cookie, own id) | `400` "Cannot delete own account" |

### Postman Tips
- Enable "Save cookies" in Postman settings
- JWT cookie is automatically sent with subsequent requests
- Check **Cookies** tab to verify cookie is set/cleared

---

## Task 20 — Test Product Routes in Postman

### Test Checklist

| # | Method | URL | Query / Body | Expected Response |
|---|--------|-----|-------------|-------------------|
| 1 | `GET` | `/api/products` | — | `200` + first 20 products + pagination |
| 2 | `GET` | `/api/products?pageSize=5&page=2` | — | `200` + 5 products, page 2 |
| 3 | `GET` | `/api/products?category=cpu` | — | `200` + only CPU products |
| 4 | `GET` | `/api/products?keyword=ryzen` | — | `200` + AMD Ryzen products |
| 5 | `GET` | `/api/products?keyword=rtx&category=gpu` | — | `200` + NVIDIA RTX GPUs |
| 6 | `GET` | `/api/products?minPrice=10000&maxPrice=30000` | — | `200` + products in range |
| 7 | `GET` | `/api/products?sortBy=price-asc` | — | `200` + sorted by price ascending |
| 8 | `GET` | `/api/products?inStock=true` | — | `200` + only in-stock items |
| 9 | `GET` | `/api/products/prod-cpu-40-amd-ryzen-5-7th-gen` | — | `200` + full product |
| 10 | `GET` | `/api/products/nonexistent-id` | — | `404` "Product not found" |
| 11 | `GET` | `/api/products/categories` | — | `200` + 19 categories with counts |
| 12 | `GET` | `/api/products/featured` | — | `200` + featured/bestseller products |
| 13 | `GET` | `/api/products/brands` | — | `200` + distinct brand list |
| 14 | `GET` | `/api/products/brands?category=cpu` | — | `200` + CPU brands only (AMD, Intel) |
| 15 | `GET` | `/api/products/top` | — | `200` + top 5 rated products |
| 16 | `POST` | `/api/products` | Sample product (admin cookie) | `201` + new product |
| 17 | `PUT` | `/api/products/:id` | `{ "price": 29999 }` (admin) | `200` + updated product |
| 18 | `DELETE` | `/api/products/:id` | (admin cookie) | `200` + success |
| 19 | `POST` | `/api/products/:id/reviews` | `{ "rating": 5, "comment": "Great!" }` (user cookie) | `201` + review added |
| 20 | `POST` | `/api/products/:id/reviews` | Same user, same product | `400` "Already reviewed" |

---

## Task 49 — Order Schema

### Files

**`backend/models/orderModel.js`**

```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [{
    name:      { type: String, required: true },
    qty:       { type: Number, required: true },
    imageSlug: { type: String, required: true },
    price:     { type: Number, required: true },
    product:   { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  }],
  shippingAddress: {
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pincode:  { type: String, required: true },
    country:  { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentResult: {
    id:            { type: String },
    status:        { type: String },
    update_time:   { type: String },
    email_address: { type: String },
  },
  itemsPrice: {
    type: Number, required: true, default: 0.0,
  },
  taxPrice: {
    type: Number, required: true, default: 0.0,
  },
  shippingPrice: {
    type: Number, required: true, default: 0.0,
  },
  totalPrice: {
    type: Number, required: true, default: 0.0,
  },
  isPaid: {
    type: Boolean, required: true, default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean, required: true, default: false,
  },
  deliveredAt: {
    type: Date,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
```

### Acceptance Criteria
- [x] Order schema covers items, shipping, payment, pricing, status
- [x] Timestamps auto-generated (`createdAt`, `updatedAt`)
- [x] References to `User` and `Product` models

---

## Task 50 — Calculate Prices for Items

### Files

**`backend/utils/calcPrices.js`**

```javascript
function addDecimals(num) {
  return Math.round(num * 100) / 100;
}

export function calcPrices(orderItems) {
  // Items price
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Shipping — free above ₹5,000, else ₹499
  const shippingPrice = addDecimals(itemsPrice > 5000 ? 0 : 499);

  // Tax — 18% GST (inclusive in Indian MRP)
  // This shows the tax component already included in the price
  const taxPrice = addDecimals(Math.round((itemsPrice * 18) / 118));

  // Total
  const totalPrice = addDecimals(itemsPrice + shippingPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
```

### Price Calculation Rules
| Field | Formula | Notes |
|-------|---------|-------|
| `itemsPrice` | `Σ (item.price × item.qty)` | Sum of all line items |
| `shippingPrice` | `itemsPrice > ₹5,000 ? ₹0 : ₹499` | Free shipping threshold |
| `taxPrice` | `(itemsPrice × 18) / 118` | GST is **inclusive** — tax component within MRP |
| `totalPrice` | `itemsPrice + shippingPrice` | Customer pays this amount |

> **Important:** Prices are always recalculated server-side. Never trust client-submitted totals.

---

## Task 51 — PayPal Setup

### Setup Steps
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in → Sandbox → Create App
3. Copy **Client ID** → paste in `.env`

### Add to `.env`
```env
PAYPAL_CLIENT_ID=AYour-PayPal-Client-ID-Here
```

### Add PayPal Config Route in `server.js`
```javascript
// PayPal config
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
```

### Frontend Install (for Task 62)
```bash
cd frontend && npm install @paypal/react-paypal-js
```

### Acceptance Criteria
- [x] `GET /api/config/paypal` returns `{ clientId: "..." }`
- [x] PayPal sandbox app created
- [x] Client ID stored in `.env`

---

## Task 52 — Order Controllers Part 1

### Functions

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `addOrderItems` | `POST` | `/api/orders` | User | Create new order |
| `getMyOrders` | `GET` | `/api/orders/mine` | User | List user's orders |
| `getOrderById` | `GET` | `/api/orders/:id` | User | Get order details |

### `addOrderItems` Logic
1. Validate `orderItems` is non-empty
2. Look up each product by `_id` from database
3. Build order items with server-side prices (not client prices)
4. Calculate totals using `calcPrices()`
5. Create order with `user: req.user._id`
6. Return `201` + created order

### Acceptance Criteria
- [x] Order created with server-calculated prices
- [x] Empty order items returns 400
- [x] `getMyOrders` returns only the authenticated user's orders
- [x] `getOrderById` returns order with populated user name/email

---

## Task 53 — Order Controllers Part 2

### Functions

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `updateOrderToPaid` | `PUT` | `/api/orders/:id/pay` | User | Mark order as paid with PayPal result |
| `updateOrderToDelivered` | `PUT` | `/api/orders/:id/deliver` | Admin | Mark order as delivered |
| `getOrders` | `GET` | `/api/orders` | Admin | List ALL orders |

### `updateOrderToPaid` Logic
```javascript
order.isPaid = true;
order.paidAt = Date.now();
order.paymentResult = {
  id: req.body.id,
  status: req.body.status,
  update_time: req.body.update_time,
  email_address: req.body.payer.email_address,
};
const updatedOrder = await order.save();
```

### Acceptance Criteria
- [x] Payment result stored on order
- [x] `isPaid` and `paidAt` updated
- [x] Admin can mark as delivered
- [x] Admin can see all orders

---

## Task 54 — Order Routes

### Files

**`backend/routes/orderRoutes.js`**
```javascript
import express from 'express';
import {
  addOrderItems, getMyOrders, getOrderById,
  updateOrderToPaid, updateOrderToDelivered, getOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
```

> **Important:** `/mine` must be declared before `/:id` to prevent Express from matching "mine" as an order ID.

### Wire in `server.js`
```javascript
import orderRoutes from './routes/orderRoutes.js';
app.use('/api/orders', orderRoutes);
```

### Route Summary

| Method | Endpoint | Auth | Handler |
|--------|----------|------|---------|
| `POST` | `/api/orders` | User | `addOrderItems` |
| `GET` | `/api/orders` | Admin | `getOrders` |
| `GET` | `/api/orders/mine` | User | `getMyOrders` |
| `GET` | `/api/orders/:id` | User | `getOrderById` |
| `PUT` | `/api/orders/:id/pay` | User | `updateOrderToPaid` |
| `PUT` | `/api/orders/:id/deliver` | Admin | `updateOrderToDelivered` |

---

## Task 55 — Orders API Slice (Frontend)

### Goal
Create frontend API service layer to communicate with the backend.

### Files

**`frontend/src/slices/apiSlice.js`** — Base API configuration
```javascript
export const BASE_URL = '';    // Proxied through Vite
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
```

**`frontend/src/slices/ordersApiSlice.js`** — Order API functions
- `createOrder(orderData)` → `POST /api/orders`
- `getOrderDetails(orderId)` → `GET /api/orders/:id`
- `payOrder({ orderId, details })` → `PUT /api/orders/:id/pay`
- `getMyOrders()` → `GET /api/orders/mine`
- `getPayPalClientId()` → `GET /api/config/paypal`

**`frontend/vite.config.ts`** — Add API proxy
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Task 56 — Private Route & Shipping Screen Part 1

### Files

**`frontend/src/components/PrivateRoute.tsx`**
- Check if user is authenticated
- If not → redirect to `/login`
- If yes → render `<Outlet />`

**`frontend/src/pages/ShippingScreen.tsx`** (Part 1)
- Form fields: `address`, `city`, `state`, `pincode`, `country` (default "India")
- Store shipping address in state
- Pre-fill from saved address if available

---

## Task 57 — Shipping Screen Part 2

### Complete ShippingScreen
- Form validation (all fields required, 6-digit pincode regex)
- Checkout steps indicator: `Login → Shipping → Payment → Place Order`
- Save to checkout state on submit
- "Continue" → navigate to `/payment`
- CartVerse dark theme styling

---

## Task 58 — Payment Screen

### Files

**`frontend/src/pages/PaymentScreen.tsx`**
- Radio buttons: `PayPal` (default), `UPI`, `COD`
- Checkout steps indicator (step 3 highlighted)
- "Continue" → navigate to `/placeorder`
- Save selected payment method to state

---

## Task 59 — Place Order Part 1

### Files

**`frontend/src/pages/PlaceOrderScreen.tsx`** (Part 1)
- Two-column layout:
  - **Left column**: Shipping address, payment method, order items list
  - **Right column**: Order summary card (Items, Shipping, Tax/GST, Total)
- Line items with image, name, quantity, price

---

## Task 60 — Place Order Part 2

### Complete PlaceOrderScreen
- "Place Order" button → calls `createOrder` API
- Loading spinner during API call
- On success → redirect to `/order/:orderId`
- On error → display error toast
- Clear cart after successful order placement
- Disable button if cart is empty

---

## Task 61 — Order Screen Part 1

### Files

**`frontend/src/pages/OrderScreen.tsx`** (Part 1)
- Route: `/order/:id`
- Fetch order details via API
- Display: order ID, shipping address, payment method, order items
- Status badges: "Paid" / "Not Paid", "Delivered" / "Not Delivered" with dates

---

## Task 62 — Order Screen Part 2 (PayPal)

### PayPal Integration
- Load PayPal Client ID via `GET /api/config/paypal`
- Wrap with `<PayPalScriptProvider>`
- Render `<PayPalButtons>` (only if order is NOT paid)
- `onApprove` → call `payOrder` API → update order status
- Loading state while PayPal SDK initializes

---

## Task 63 — Order Screen Part 3 (Admin)

### Admin Features
- "Mark As Delivered" button (visible only to admin)
- Calls `updateOrderToDelivered` API
- Error handling for all API calls
- Order summary sidebar with price breakdown
- Responsive layout

---

## Task 64 — Profile Screen Part 1

### Files

**`frontend/src/pages/ProfileScreen.tsx`** (Part 1)
- Two-column layout:
  - **Left**: Profile form (name, email, password, confirm password)
  - **Right**: Order history table
- Pre-fill form with current user data from state
- "Update" button → calls `updateUserProfile` API

---

## Task 65 — Profile Screen Part 2 (Order History)

### Order History Table
- Fetch orders via `getMyOrders` API
- Table columns: ID, Date, Total, Paid (✓/✗), Delivered (✓/✗), Details link
- Sorted by newest first
- Loading skeleton while fetching
- Empty state: "No orders yet"

---

## Task 66 — Profile Screen Part 3 (Polish)

### Final Polish
- Success toast on profile update
- Password validation (match check + minimum 6 chars)
- Responsive design for mobile
- Order table pagination for large order histories
- Each order row links to `/order/:id`

---

## Complete API Reference

### Product Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | Public | List products (paginated, filtered, sorted) |
| `GET` | `/api/products/categories` | Public | Category list with counts |
| `GET` | `/api/products/featured` | Public | Featured products |
| `GET` | `/api/products/brands` | Public | Distinct brands |
| `GET` | `/api/products/top` | Public | Top rated products |
| `GET` | `/api/products/:id` | Public | Single product details |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `POST` | `/api/products/:id/reviews` | User | Submit review |

### User Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users` | Public | Register |
| `POST` | `/api/users/login` | Public | Login |
| `POST` | `/api/users/logout` | Public | Logout |
| `GET` | `/api/users/profile` | User | Get profile |
| `PUT` | `/api/users/profile` | User | Update profile |
| `GET` | `/api/users` | Admin | List all users |
| `GET` | `/api/users/:id` | Admin | Get user by ID |
| `PUT` | `/api/users/:id` | Admin | Update user |
| `DELETE` | `/api/users/:id` | Admin | Delete user |

### Order Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/orders` | User | Create order |
| `GET` | `/api/orders` | Admin | List all orders |
| `GET` | `/api/orders/mine` | User | List my orders |
| `GET` | `/api/orders/:id` | User | Get order details |
| `PUT` | `/api/orders/:id/pay` | User | Update payment status |
| `PUT` | `/api/orders/:id/deliver` | Admin | Mark as delivered |

### Config Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/config/paypal` | Public | PayPal client ID |

---

## Verification Plan

### After Backend (Tasks 3–20)
```bash
npm run server            # Express on :5000
npm run data:import       # Seed 501 products + 3 users
# → Test all user & product routes in Postman
```

### After Orders (Tasks 49–54)
```bash
# Test via Postman:
POST /api/orders          # Create order (user cookie)
GET  /api/orders/mine     # List my orders
PUT  /api/orders/:id/pay  # Mark as paid
GET  /api/orders          # Admin: list all orders
```

### After Frontend (Tasks 55–66)
```bash
cd frontend && npm run dev    # Frontend on :5173 (proxied to :5000)
```

**End-to-end flow test:**
1. Register → Login
2. Browse products → Add to cart
3. Checkout → Shipping → Payment → Place Order
4. Pay via PayPal sandbox
5. View order details + payment status
6. Profile → View order history
7. Admin: Mark order as delivered

---

## Task Summary

| Task | Deliverable | Type | Status |
|------|------------|------|--------|
| 3 | Express server + nodemon | Backend setup | ⬜ |
| 4 | Product Mongoose schema | Backend model | ⬜ |
| 5 | Product controller (list, filter, detail) | Backend controller | ⬜ |
| 6 | Product controller (CRUD, reviews) | Backend controller | ⬜ |
| 7 | Product routes | Backend routes | ⬜ |
| 8 | MongoDB Atlas + db.js + .env | Backend config | ⬜ |
| 9 | User schema + bcrypt | Backend model | ⬜ |
| 10 | JWT token + cookie utility | Backend utility | ⬜ |
| 11 | User controller (register, login, logout) | Backend controller | ⬜ |
| 12 | User controller (profile) | Backend controller | ⬜ |
| 13 | User controller (admin) | Backend controller | ⬜ |
| 14 | User routes | Backend routes | ⬜ |
| 15 | Auth + admin middleware | Backend middleware | ⬜ |
| 16 | Protect routes with middleware | Backend security | ⬜ |
| 17 | CORS + cookie-parser | Backend middleware | ⬜ |
| 18 | Seed data to MongoDB | Backend data | ⬜ |
| 19 | Test user routes (Postman) | Testing | ⬜ |
| 20 | Test product routes (Postman) | Testing | ⬜ |
| 49 | Order schema | Backend model | ⬜ |
| 50 | Price calculation utility | Backend utility | ⬜ |
| 51 | PayPal configuration | Backend + config | ⬜ |
| 52 | Order controller (create, get) | Backend controller | ⬜ |
| 53 | Order controller (pay, deliver, all) | Backend controller | ⬜ |
| 54 | Order routes | Backend routes | ⬜ |
| 55 | Orders API slice + Vite proxy | Frontend integration | ⬜ |
| 56 | PrivateRoute + Shipping Part 1 | Frontend page | ⬜ |
| 57 | Shipping Screen Part 2 | Frontend page | ⬜ |
| 58 | Payment Screen | Frontend page | ⬜ |
| 59 | Place Order Part 1 | Frontend page | ⬜ |
| 60 | Place Order Part 2 | Frontend page | ⬜ |
| 61 | Order Screen Part 1 | Frontend page | ⬜ |
| 62 | Order Screen Part 2 (PayPal) | Frontend page | ⬜ |
| 63 | Order Screen Part 3 (admin) | Frontend page | ⬜ |
| 64 | Profile Screen Part 1 | Frontend page | ⬜ |
| 65 | Profile Screen Part 2 (orders) | Frontend page | ⬜ |
| 66 | Profile Screen Part 3 (polish) | Frontend page | ⬜ |
