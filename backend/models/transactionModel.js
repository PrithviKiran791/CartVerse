import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: 'User',
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    gateway: {
      type: String,
      required: true,
      enum: ['razorpay', 'cod'],
      default: 'razorpay',
    },
    type: {
      type: String,
      required: true,
      enum: ['payment', 'refund'],
      default: 'payment',
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
    },
    amount: {
      type: Number,
      required: true, // In paise (smallest currency unit)
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    razorpaySignature: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    refundId: {
      type: String,
    },
    rawGatewayPayload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast transaction lookups by order, newest first
transactionSchema.index({ orderId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
