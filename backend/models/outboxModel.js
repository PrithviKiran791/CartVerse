import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Outbox = sequelize.define(
  'Outbox',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    aggregateType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Product',
    },
    aggregateId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false, // 'created' | 'updated' | 'deleted'
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['processedAt', 'createdAt'],
      },
      {
        fields: ['aggregateType', 'aggregateId'],
      },
    ],
  }
);

export default Outbox;
