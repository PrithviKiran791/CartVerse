import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const profileUpdateValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).matches(/\d/),
];

export const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment required, max 1000 chars'),
];

export const productValidator = [
  body('name').trim().notEmpty().isLength({ max: 200 }),
  body('brand').trim().notEmpty().isLength({ max: 100 }),
  body('price').isFloat({ min: 0 }),
  body('category').trim().notEmpty(),
  body('description').trim().notEmpty().isLength({ max: 5000 }),
  body('stock').isInt({ min: 0 }),
];

export const orderValidator = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('orderItems.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderItems.*').custom((item) => {
    if (!item.productId && !item.product && !item.id) {
      throw new Error('Product identifier is required for each item');
    }
    return true;
  }),
  body('shippingAddress.address').trim().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress').custom((addr) => {
    if (!addr.postalCode && !addr.pincode) {
      throw new Error('Postal code or pincode is required');
    }
    return true;
  }),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
]; 