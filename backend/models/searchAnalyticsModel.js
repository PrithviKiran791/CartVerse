import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SearchAnalytics = sequelize.define(
  'SearchAnalytics',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    query: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    normalizedQuery: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hitsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    queryTimeMs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    filters: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    degraded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['normalizedQuery'],
      },
      {
        fields: ['hitsCount'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default SearchAnalytics;
