import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: '',
    },
    body: {
      type: String,
      required: [true, 'Review body text is required'],
      trim: true,
      minlength: [5, 'Review body must be at least 5 characters long'],
      maxlength: [2000, 'Review body cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    helpfulVotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['published', 'pending', 'rejected'],
      default: 'published',
      index: true,
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Unique Index: One review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Compound Index for fast paginated retrieval of published reviews
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

// Virtual to determine if this review is a Verified Purchase
reviewSchema.virtual('isVerifiedPurchase').get(function () {
  return !!this.orderId;
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
