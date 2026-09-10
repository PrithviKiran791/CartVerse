import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Public/business product ID snapshot
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Actual Product UUID foreign key
    productRefId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Actual Order UUID foreign key
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Product information snapshot at time of purchase
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    imageSlug: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Price snapshot at time of purchase
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: false,
  }
);

export default OrderItem;