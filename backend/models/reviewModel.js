import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    // User who created the review
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Actual Product UUID
    productRefId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ['userId', 'productRefId'],
      },
    ],
  }
);

export default Review;