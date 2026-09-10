import mongoose from 'mongoose';
import crypto from 'crypto';

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Custom PC Rig',
    },
    components: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalWattage: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    shareSlug: {
      type: String,
      unique: true,
      index: true,
    },
    compatibilityReport: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    buildType: {
      type: String,
      enum: ['consumer', 'server'],
      default: 'consumer',
      index: true,
    },
    serverMetrics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique shareSlug before validation
buildSchema.pre('save', function (next) {
  if (!this.shareSlug) {
    this.shareSlug = `cv-${crypto.randomBytes(4).toString('hex')}`;
  }
  next();
});

const Build = mongoose.model('Build', buildSchema);

export default Build;
