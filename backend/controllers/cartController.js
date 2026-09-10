import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Valid promo coupons database
const PROMO_COUPONS = {
  CART10: { discountPercent: 10, minSpend: 1000, description: '10% Off All Hardware' },
  BUILDER20: { discountAmount: 2000, minSpend: 25000, description: '₹2,000 Off Custom PC Builds' },
  RIGFORGE5: { discountPercent: 5, minSpend: 0, description: '5% Instant Gamer Discount' },
  FREESHIP: { discountAmount: 299, minSpend: 0, description: 'Free Express Shipping' },
};

// Helper to find cart by user or guest identity
const getCartQuery = (req) => {
  if (req.identity) {
    return req.identity.type === 'user' ? { user: req.identity.id } : { guestId: req.identity.id };
  }
  if (req.user) {
    return { user: req.user._id };
  }
  const guestId =
    req.signedCookies?.cartverse_guest_id ||
    req.cookies?.cartverse_guest_id ||
    req.headers['x-guest-id'] ||
    'gst_fallback';
  return { guestId };
};

const createNewCart = (req) => {
  const query = getCartQuery(req);
  return new Cart({ ...query, items: [] });
};

// @desc    Get user or guest server cart
// @route   GET /api/cart
// @access  Public / Identity Resolved
export const getCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  let cart = await Cart.findOne(query).populate('items.product');

  if (!cart) {
    cart = createNewCart(req);
    cart.calculateTotals();
    await cart.save();
  } else {
    cart.calculateTotals();
    await cart.save();
  }

  res.json(cart);
});

// @desc    Sync / merge local cart into server cart on login or guest session
// @route   POST /api/cart/sync
// @access  Public / Identity Resolved
export const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const query = getCartQuery(req);

  let cart = await Cart.findOne(query);

  if (!cart) {
    cart = createNewCart(req);
  }

  if (Array.isArray(items) && items.length > 0) {
    for (const incoming of items) {
      const existingIndex = cart.items.findIndex(
        (i) =>
          (incoming.product && i.product && i.product.toString() === incoming.product.toString()) ||
          (incoming.buildBundle && i.buildBundle && i.buildBundle.id === incoming.buildBundle.id)
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(incoming.quantity) || 1;
      } else {
        cart.items.push({
          product: incoming.product || incoming.productId || null,
          buildBundle: incoming.buildBundle || null,
          name: incoming.name || incoming.product?.name || 'Hardware Item',
          price: Number(incoming.price || incoming.product?.price) || 0,
          quantity: Number(incoming.quantity) || 1,
          image: incoming.image || incoming.product?.imageSlug || '',
        });
      }
    }
  }

  cart.calculateTotals();
  const savedCart = await cart.save();
  res.json(savedCart);
});

// @desc    Add item or build bundle to cart
// @route   POST /api/cart/items
// @access  Public / Identity Resolved
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, buildBundle, quantity, name, price, image } = req.body;
  const query = getCartQuery(req);

  let cart = await Cart.findOne(query);
  if (!cart) {
    cart = createNewCart(req);
  }

  const qty = Number(quantity) || 1;

  if (productId) {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product && i.product.toString() === product._id.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.imageSlug,
      });
    }
  } else if (buildBundle) {
    cart.items.push({
      buildBundle,
      name: name || buildBundle.title || 'Custom PC Build Rig',
      price: Number(price || buildBundle.totalPrice) || 0,
      quantity: qty,
      image: image || 'Pre-Built PC/Apex_Flagship.png',
    });
  } else {
    res.status(400);
    throw new Error('Either productId or buildBundle is required');
  }

  cart.calculateTotals();
  const savedCart = await cart.save();
  res.json(savedCart);
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:itemId
// @access  Public / Identity Resolved
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  const query = getCartQuery(req);

  const cart = await Cart.findOne(query);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  const qty = Number(quantity);
  if (qty <= 0) {
    cart.items.pull(itemId);
  } else {
    item.quantity = qty;
  }

  cart.calculateTotals();
  const savedCart = await cart.save();
  res.json(savedCart);
});

// @desc    Delete item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Public / Identity Resolved
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const query = getCartQuery(req);

  const cart = await Cart.findOne(query);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items.pull(itemId);
  cart.calculateTotals();
  const savedCart = await cart.save();
  res.json(savedCart);
});

// @desc    Apply promo coupon code
// @route   POST /api/cart/coupon
// @access  Public / Identity Resolved
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please enter a coupon code');
  }

  const upperCode = code.trim().toUpperCase();
  const couponData = PROMO_COUPONS[upperCode];

  if (!couponData) {
    res.status(400);
    throw new Error(`Invalid promo code '${upperCode}'. Try CART10 or BUILDER20.`);
  }

  const query = getCartQuery(req);
  const cart = await Cart.findOne(query);
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Check minimum spend
  let subtotal = 0;
  cart.items.forEach((i) => (subtotal += i.price * i.quantity));

  if (subtotal < couponData.minSpend) {
    res.status(400);
    throw new Error(
      `Coupon requires a minimum order subtotal of ₹${couponData.minSpend.toLocaleString('en-IN')}`
    );
  }

  cart.coupon = {
    code: upperCode,
    discountPercent: couponData.discountPercent || 0,
    discountAmount: couponData.discountAmount || 0,
  };

  cart.calculateTotals();
  const savedCart = await cart.save();

  res.json({
    cart: savedCart,
    message: `Promo code ${upperCode} applied! (${couponData.description})`,
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Public / Identity Resolved
export const removeCoupon = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  const cart = await Cart.findOne(query);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.coupon = { code: '', discountPercent: 0, discountAmount: 0 };
  cart.calculateTotals();
  const savedCart = await cart.save();

  res.json({
    cart: savedCart,
    message: 'Coupon removed',
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Public / Identity Resolved
export const clearCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  const cart = await Cart.findOne(query);
  if (cart) {
    cart.items = [];
    cart.coupon = { code: '', discountPercent: 0, discountAmount: 0 };
    cart.calculateTotals();
    await cart.save();
  }
  res.json({ message: 'Cart cleared successfully' });
});
