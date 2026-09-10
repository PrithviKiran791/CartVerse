import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    category: {
      type: DataTypes.ENUM(
        'cpu',
        'gpu',
        'motherboard',
        'ram',
        'ssd',
        'hdd',
        'psu',
        'cabinet',
        'cooler',
        'monitor',
        'keyboard',
        'mouse',
        'mousepad',
        'headphones',
        'speakers',
        'webcam',
        'controller',
        'cables',
        'prebuilt'
      ),
      allowNull: false,
    },

    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    imageSlug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },

    reviewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    specs: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isNew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    bestSeller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },

    // Explicit foreign key for product creator/admin
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,

    indexes: [
      {
        fields: ['category', 'brand'],
      },
      {
        fields: ['price'],
      },
      {
        fields: ['rating'],
      },
      {
        fields: ['featured', 'bestSeller'],
      },
    ],
  }
);

export default Product;