# CartVerse — Complete Architecture & Execution Walkthrough

This document provides a comprehensive technical walkthrough of the **CartVerse** PC Hardware E-Commerce & Custom PC Builder platform backend and frontend integration.

---

## 📌 Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack](#2-tech-stack)
3. [Directory Layout](#3-directory-layout)
4. [Implemented Features Breakdown](#4-implemented-features-breakdown)
   - [PC Builder Diagnostics & Slotting Fixes](#pc-builder-diagnostics--slotting-fixes)
   - [Custom Saved Builds & Cloud Share Engine](#custom-saved-builds--cloud-share-engine)
   - [Server-Persisted Cart & Coupon Engine](#server-persisted-cart--coupon-engine)
   - [Order Confirmation Page](#order-confirmation-page)
   - [Order History Page](#order-history-page)
   - [Razorpay Payment Gateway](#razorpay-payment-gateway)
   - [Cloudinary Media Upload Engine](#cloudinary-media-upload-engine)
5. [API Routes Reference](#5-api-routes-reference)
6. [Getting Started & Running the Code](#6-getting-started--running-the-code)
   - [Environment Configuration](#environment-configuration)
   - [Database Seeding](#database-seeding)
   - [Starting Development Servers](#starting-development-servers)
7. [Pre-configured Test Accounts & Promo Codes](#7-pre-configured-test-accounts--promo-codes)
8. [Automated Verification Test Results](#8-automated-verification-test-results)

---

## 1. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CartVerse Frontend                       │
│       (React 19 + TypeScript + Vite + Tailwind CSS v4)      │
│   • PC Builder Studio       • Saved Builds & Cloud Sharing  │
│   • 779-Item Catalog        • Slide-Over Cart with Bundles  │
│   • Razorpay Checkout Modal • Order Confirmation & History  │
└──────────────┬───────────────────────────────▲──────────────┘
               │ HTTP Requests                 │ JSON Data &
               │ (Bearer JWT / Cookies)        │ Telemetry
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│                    CartVerse Express API                     │
│                       (Node.js / ESM)                       │
├─────────────────────────────────────────────────────────────┤
│  • Auth Middleware (JWT & Roles)    • Rate Limiters         │
│  • Product Catalog Query Engine     • Error Sanitizer       │
│  • PC Compatibility & Wattage Engine • Razorpay Gateway     │
│  • Saved Builds & Share Engine      • Cloudinary Uploads    │
│  • Server Cart & Coupon Engine      • Order Lifecycle       │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Mongoose Queries              │ Aggregated
               │ & Transactions                │ Documents
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│                      MongoDB Database                       │
│  (Users, Products, Builds, Carts, Orders, Reviews)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

### Backend
- **Runtime**: Node.js (ESM `"type": "module"`)
- **Web Framework**: Express.js 4.21
- **Database / ODM**: MongoDB + Mongoose 8.9
- **Payments**: Razorpay Node SDK (`razorpay`) with HMAC-SHA256 verification
- **Media Storage**: Cloudinary SDK (`cloudinary`) + Multer streaming storage
- **Security & Auth**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `cookie-parser`, `express-rate-limit`
- **Logging & Utilities**: `morgan`, `dotenv`, `express-async-handler`

### Frontend
- **UI Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (local + cloud synced) + Redux Toolkit
- **Animation**: Framer Motion, Canvas Confetti

---

## 3. Directory Layout

```text
CartVerse/
├── .env                              # Environment variable configuration
├── .env.example                      # Template environment variables
├── package.json                      # Root configuration & dependencies
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection with dev fallback
│   │   └── cloudinary.js             # Cloudinary SDK & Multer memory storage
│   ├── controllers/
│   │   ├── buildController.js        # Saved builds & share slug controller
│   │   ├── builderController.js      # Custom PC validation & prebuilt rigs
│   │   ├── cartController.js         # Server cart sync & coupon calculations
│   │   ├── orderController.js        # Checkout, order tracking & delivery status
│   │   ├── paymentController.js      # Razorpay order creation & HMAC verification
│   │   ├── productController.js      # Catalog search, filter & reviews
│   │   ├── uploadController.js       # Cloudinary product & avatar upload
│   │   └── userController.js         # User auth, profile & admin CRUD
│   ├── data/
│   │   ├── products.json             # 779 verified PC hardware items
│   │   └── users.js                  # Seed user fixtures
│   ├── middleware/
│   │   ├── authMiddleware.js         # Dual-mode (Bearer/Cookie) auth & admin guard
│   │   ├── errorMiddleware.js        # Mongoose 404 & centralized error handler
│   │   └── rateLimiter.js            # Express rate limiter (Auth & API)
│   ├── models/
│   │   ├── buildModel.js             # Mongoose saved build schema
│   │   ├── cartModel.js              # Mongoose server-persisted cart schema
│   │   ├── orderModel.js             # Mongoose order schema with Razorpay refs
│   │   ├── productModel.js           # Mongoose product schema with specs telemetry
│   │   └── userModel.js              # Mongoose user schema with bcrypt hooks
│   ├── routes/
│   │   ├── buildRoutes.js            # /api/builds routes
│   │   ├── builderRoutes.js          # /api/builder routes
│   │   ├── cartRoutes.js             # /api/cart routes
│   │   ├── orderRoutes.js            # /api/orders routes
│   │   ├── paymentRoutes.js          # /api/payments routes
│   │   ├── productRoutes.js          # /api/products routes
│   │   ├── uploadRoutes.js           # /api/upload routes
│   │   └── userRoutes.js             # /api/users & /api/auth routes
│   ├── utils/
│   │   ├── compatibilityEngine.js    # Socket, RAM, and wattage calculator
│   │   ├── generateToken.js          # JWT generator & cookie setter
│   │   └── syncProducts.js           # Catalog extraction utility
│   ├── seeder.js                     # CLI database seeder script
│   ├── server.js                     # Express entrypoint
│   └── test-backend.js               # Automated end-to-end test suite
└── frontend/                         # React client application
    └── src/
        ├── components/
        │   ├── cart/                 # CartDrawer, CheckoutModal (Razorpay)
        │   ├── pc-builder/           # ComponentPickerModal, ShareBuildModal, Studio
        │   └── catalog/              # ProductCard, Category filters
        ├── pages/
        │   ├── OrderConfirmationPage.tsx # /order-confirmation/:orderId
        │   ├── OrdersPage.tsx        # /orders (Paginated history)
        │   ├── PCBuilderPage.tsx     # /builder (PC Studio)
        │   └── CartPage.tsx          # /cart (Collapsible bundles & coupons)
        ├── store/
        │   ├── useCartStore.ts       # Zustand cart + server sync
        │   ├── usePCBuilderStore.ts  # Zustand builder + cloud save/load
        │   └── useAuthStore.ts       # Auth session store
        └── utils/
            ├── assetRegistry.ts      # Vite dynamic resolver + Cloudinary URLs
            ├── compatibilityEngine.ts# Client compatibility matrix
            └── pcBuilderBridge.ts    # Safe slot bridge with warnings
```

---

## 4. Implemented Features Breakdown

### PC Builder Diagnostics & Slotting Fixes
- **Clear Feedback**: Adding components runs real-time compatibility validation; any socket, memory, clearance, or wattage issue displays an informative warning toast notification instead of silently failing.
- **Safe Fallbacks**: `assetRegistry.ts` natively supports remote HTTP/HTTPS Cloudinary URLs alongside local Vite assets with graceful SVG fallbacks.

### Custom Saved Builds & Cloud Share Engine
- **Cloud Persistence**: Authenticated users can save their custom rigs to the MongoDB `Build` collection via `POST /api/builds`.
- **Share Slugs**: Every saved build receives a short slug (e.g. `cv-f9053a57`) for instant sharing via `http://localhost:5173/builder?build=cv-f9053a57`.
- **Batch Add to Cart**: One-click action adds the entire build as a structured line item bundle to the cart.

### Server-Persisted Cart & Coupon Engine
- **Login Synchronization**: Guest carts in `localStorage` automatically merge into MongoDB upon logging in.
- **Collapsible Bundles**: PC build bundles appear in the cart as unified, collapsible cards.
- **Server Coupons**: `POST /api/cart/coupon` validates coupon codes (`CART10`, `BUILDER20`, `RIGFORGE5`, `FREESHIP`) and computes exact tax and discounts.

### Order Confirmation Page (`/order-confirmation/:orderId`)
- Self-fetching page that loads order details directly from `/api/orders/:id`.
- Celebratory confetti animation on purchase completion.
- Interactive delivery progress tracker (`Placed` → `Processing` → `Dispatched` → `Delivered`), itemized list, and customer address card.
- Live polling for pending gateway callbacks and interactive **"Retry Payment"** CTA when payments are interrupted.

### Order History Page (`/orders`) & Detail Page (`/orders/:orderId`)
- Protected route displaying customer order history with status filter tabs (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`).
- Visually distinct dual badges for **Order Fulfillment** and **Payment State**.
- Instant one-click Order ID copy button and search query filtering.
- Dedicated **Payment Gateway Transaction Log** panel displaying transaction audit records (Date, Gateway: `RAZORPAY`, Type: `Payment`/`Refund`, Status: `CAPTURED`/`FAILED`, Amount in ₹, Gateway Ref ID, and failure diagnostics).
- Displays item thumbnails, order totals, and a one-click **Reorder** button.

### Transactions Collection & Billing Hub (`/account/transactions`)
- Dedicated Mongoose model `Transaction` storing individual financial events in integer paise.
- Customer-facing financial statement listing every payment and refund attempt across all orders.
- Admin support/ops query (`GET /api/admin/transactions?status=failed`) for inspecting payment disputes.

### Razorpay Payment Gateway
- **Server-Derived Pricing**: `POST /api/payments/create-order` computes totals in paise on the server and writes initial `Transaction` records.
- **HMAC-SHA256 Signature Verification**: `POST /api/payments/verify` verifies payment authenticity, marks `Transaction` as `captured`, and confirms the database order.
- **Failure Auditing**: `POST /api/payments/fail` records customer or gateway dismissals with plain-language diagnostics.
- **Webhook Handling**: `POST /api/payments/webhook` for async payment captures, failures, and refunds.

### Cloudinary Media Upload Engine
- Multer streaming integration for uploading product catalog images (`/api/upload/product-image`) and avatars (`/api/upload/avatar`).
- Automatic asset deletion support (`/api/upload`).

---

## 5. API Routes Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health and uptime status |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & retrieve JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `GET` | `/api/products` | Public | List products with search, filters, pagination |
| `GET` | `/api/products/:id` | Public | Retrieve single product by ID or SKU |
| `POST` | `/api/builds` | Public/Auth | Save custom PC build configuration |
| `GET` | `/api/builds/:id` | Public | Fetch saved build by slug or ID |
| `GET` | `/api/builds/mine` | Private | List authenticated user's saved builds |
| `GET` | `/api/cart` | Private | Retrieve server-persisted cart |
| `POST` | `/api/cart/sync` | Private | Merge guest cart into server cart |
| `POST` | `/api/cart/coupon` | Private | Apply promo discount code |
| `POST` | `/api/payments/create-order` | Private | Create Razorpay order & Transaction in paise |
| `POST` | `/api/payments/verify` | Private | Verify HMAC signature & capture Transaction |
| `POST` | `/api/payments/fail` | Private | Record payment failure attempt & diagnostics |
| `POST` | `/api/payments/webhook` | Public | Razorpay async webhook (capture, fail, refund) |
| `GET` | `/api/orders` | Private | Get paginated customer order history |
| `GET` | `/api/orders/:id` | Private | Get single order details with embedded transactions |
| `GET` | `/api/orders/:id/transactions` | Private | Get standalone transactions for an order |
| `GET` | `/api/transactions` | Private | Get customer billing statement across all orders |
| `GET` | `/api/admin/transactions` | Admin | Get failed/disputed transactions for ops review |
| `PATCH`| `/api/orders/:id/status` | Admin | Update shipment/delivery status |
| `POST` | `/api/upload/product-image`| Admin | Upload image to Cloudinary |
| `POST` | `/api/upload/avatar` | Private | Upload avatar to Cloudinary |

---

## 6. Getting Started & Running the Code

### Environment Configuration
The root `.env` file contains standard development defaults:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cartverse
JWT_SECRET=cartverse_super_secret_jwt_key_2026_dev_secure
PAYPAL_CLIENT_ID=sb
CLIENT_URL=http://localhost:5173

# Razorpay Test Mode
RAZORPAY_KEY_ID=rzp_test_TdP8zwDyWEG1FE
RAZORPAY_KEY_SECRET=iD84xu9zm9Ed2vW8f3NqU2me
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_2026

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=cartverse
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12345
```

### Database Seeding
```powershell
npm run data:import
```

### Starting Development Servers
```powershell
# Run full stack concurrently:
npm run dev

# Or run individually:
npm run server   # Backend on http://localhost:5000
npm run client   # Frontend on http://localhost:5173
```

---

## 7. Pre-configured Test Accounts & Promo Codes

### Accounts
| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cartverse.in` | `password123` | Administrator |
| **Creator** | `prithvi@cartverse.in` | `password123` | Administrator |
| **Customer** | `gamer@cartverse.in` | `password123` | Standard Customer |

### Promo Codes
- `CART10`: 10% Off All Hardware
- `BUILDER20`: ₹2,000 Off Custom PC Builds (Orders > ₹25,000)
- `RIGFORGE5`: 5% Instant Discount
- `FREESHIP`: Free Express Shipping

---

## 8. Guest Checkout & Order Tracking Architecture

### Overview
CartVerse now features an unauthenticated purchase experience. Shoppers are never forced to register or log in to browse, add components, check out, pay, or track orders.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Dual Identity Resolution                    │
│           (Authorization Header OR x-guest-id)              │
├──────────────────────────────┬──────────────────────────────┤
│  Authenticated Customer      │  Guest Shopper               │
│  • req.identity.type: 'user' │  • req.identity.type: 'guest'│
│  • req.user: User Document   │  • req.identity.id: guestId  │
│  • cart: { user: userId }    │  • cart: { guestId }         │
│  • order: { user: userId }   │  • order: { guestId, email } │
└──────────────────────────────┴──────────────────────────────┘
                               │
                Post-Purchase Account Creation
                               │
            Migrate all past Orders & Transactions
                 matching guestEmail or guestId
                               ▼
            Permanent Unified Customer Profile Dashboard
```

### Key Components
1. **Dual Identity Middleware (`resolveIdentity`)**:
   - Inspects `Authorization: Bearer <jwt>` and `req.cookies.jwt`.
   - If not authenticated, reads signed cookie `cartverse_guest_id`, plain cookie, or `x-guest-id` header.
   - If absent, generates an encrypted UUID (`gst_<hex>`), sets signed cookie, and returns `x-guest-id` response header.
2. **Nullable User Schema & Guest Identification**:
   - `Order.user`: Nullable ObjectId with sparse index.
   - `Order.guestId`: Indexed guest identifier string.
   - `Order.guestEmail`: Indexed, lowercased, and validated email address.
   - `Transaction.userId`: Nullable ObjectId; `Transaction.guestId`: Indexed string.
   - `Cart.user`: Nullable ObjectId; `Cart.guestId`: Indexed string.
3. **Public Order Tracking Page (`/track-order`)**:
   - `POST /api/orders/lookup` validates both `orderId` and `email`.
   - Generic 404 response on email mismatch to prevent brute-force order enumeration.
   - Rate-limited via `lookupLimiter` (30 requests / 15 minutes).
   - Interactive progress stepper (`Order Placed` -> `Processing & Assembly` -> `Shipped` -> `Delivered`), component breakdown, shipping address, and live status.
4. **Soft Post-Purchase Account Creation**:
   - On `/order-confirmation/:orderId`, guests can set a password in 1 click.
   - Submits to `POST /api/auth/register`, which migrates all matching guest orders and transactions into the newly created user account.
   - Automatically issues a JWT, clears the guest cookie, and logs the user in.

---

## 9. Automated Verification Test Results

```text
=== RUNNING CARTVERSE FULL BACKEND INTEGRATION TEST SUITE ===

1. Health Check Endpoint (/api/health)...
   Status: online | Uptime: 35
   ✅ Health check passed!

2. Testing User Login (/api/auth/login)...
   Logged in user: Prithvi Kiran (Admin: true)
   ✅ Auth Login passed!

3. Testing Saved Builds API (/api/builds)...
   Saved Build Slug: cv-189180e9 | Price: ₹368994 | Wattage: 818W
   ✅ Saved Builds CRUD & Slug generation passed!

4. Testing Server-Persisted Cart & Coupon Engine (/api/cart)...
   Cart Subtotal: ₹244998 | Tax: ₹44100 | Total: ₹289098
   Coupon Response: Promo code CART10 applied! (10% Off All Hardware) | Discount: 10%
   ✅ Cart synchronization & coupon engine passed!

5. Testing Razorpay Payments Gateway (/api/payments)...
   Created Razorpay Order ID: order_test_1788986688493 | Amount: 28909800 paise (₹289098)
   Verified Order ID: 6aa1c540080302a89502d427 | Status: processing | Paid: true
   ✅ Razorpay payment initiation & verification passed!

6. Testing Customer Orders History & Details (/api/orders)...
   Fetched 5 orders on page 1 of 1 (Total: 5)
   Single Order Lookup: #6aa1c540080302a89502d427 with 1 embedded transactions
   ✅ Orders pagination and confirmation retrieval passed!

7. Testing Dedicated Transactions & Billing System (/api/transactions)...
   Order #6aa1c540080302a89502d427 has 1 transaction(s). Latest Status: captured
   User Transactions: 5 total records across orders (Amount: ₹289098)
   Recorded simulated payment failure: Status: failed | Reason: User cancelled payment modal during checkout test
   Admin query found 3 failed transaction(s) for ops review.
   ✅ Transactions lifecycle & endpoints passed!

8. Testing PC Compatibility Matrix Engine (/api/builder/validate)...
   Build isCompatible: true | Wattage: 818W | Recommended PSU: 1050W
   ✅ PC compatibility matrix passed!

9. Testing Guest Cart Flow (No Auth Token)...
   Guest Cart Subtotal: ₹38999 | Guest ID Header: gst_284e45715bab464db749c9371050bc2a
   ✅ Guest cart resolution passed!

10. Testing Guest Order Placement (No Auth)...
   Guest Order Created: ID: 6aa1c540080302a89502d452 | User: null | GuestId: gst_284e45715bab464db749c9371050bc2a | Email: guest_1788986688761@example.com
   ✅ Guest order placement passed!

11. Testing Guest Order Lookup (/api/orders/lookup)...
   Lookup Success: Found order 6aa1c540080302a89502d452 with status processing
   ✅ Guest order lookup & privacy check passed!

12. Testing Guest Razorpay Payment Verification...
   Order Payment Status: paid | Paid: true
   ✅ Guest payment verification passed!

13. Testing Guest Account Creation & Order Migration (/api/auth/register)...
   Registered User ID: 6aa1c540080302a89502d467 | Migrated Orders Count: 1
   Verified Order User Owner: 6aa1c540080302a89502d467
   ✅ Guest account creation & order migration passed!

================================================================
🎉 ALL 13 CARTVERSE INTEGRATION TESTS PASSED 100%!
================================================================
```

