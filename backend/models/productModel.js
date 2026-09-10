import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify component category'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide price in INR (₹)'],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    imageSlug: {
      type: String,
      required: true,
      default: 'placeholder.png',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    productClass: {
      type: String,
      enum: ['consumer', 'server'],
      default: 'consumer',
      index: true,
    },
    socketCount: {
      type: Number,
      enum: [1, 2, 4],
    },
    memoryType: {
      type: String,
      enum: ['UDIMM', 'RDIMM', 'LRDIMM'],
    },
    eccSupport: {
      type: Boolean,
      default: false,
    },
    rackUnits: {
      type: Number,
    },
    psuRedundancy: {
      type: String,
      enum: ['single', 'N+1', 'N+N'],
    },
    ipmiSupport: {
      type: Boolean,
      default: false,
    },
    useCaseTags: {
      type: [String],
      default: [],
    },
    serverSpecs: {
      type: mongoose.Schema.Types.Mixed,
    },
    supercomputerSpecs: {
      type: mongoose.Schema.Types.Mixed,
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted price or custom mappings if needed
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
