import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  buildBundle: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  image: {
    type: String,
    default: '',
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      sparse: true,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: { type: String, default: '' },
      discountPercent: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to recompute financial totals server-side
cartSchema.methods.calculateTotals = function () {
  let subtotal = 0;

  for (const item of this.items) {
    subtotal += (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }

  this.subtotal = subtotal;

  // Compute discount
  let discount = 0;
  if (this.coupon?.discountPercent > 0) {
    discount = Math.round((subtotal * this.coupon.discountPercent) / 100);
  } else if (this.coupon?.discountAmount > 0) {
    discount = Math.min(this.coupon.discountAmount, subtotal);
  }

  // 18% GST on PC Hardware
  const taxableAmount = Math.max(0, subtotal - discount);
  this.tax = Math.round(taxableAmount * 0.18);

  // Free shipping on hardware orders above ₹5000, else ₹299
  this.shipping = subtotal > 5000 || subtotal === 0 ? 0 : 299;

  this.total = taxableAmount + this.tax + this.shipping;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
