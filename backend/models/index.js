import sequelize from '../config/db.js';

import User from './userModel.js';
import Product from './productModel.js';
import Review from './reviewModel.js';
import Order from './orderModel.js';
import OrderItem from './orderItemModel.js';

// =====================================================
// USER ↔ PRODUCT
// =====================================================

User.hasMany(Product, {
  foreignKey: 'userId',
  as: 'products',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Product.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator',
});


// =====================================================
// USER ↔ REVIEW
// =====================================================

User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});


// =====================================================
// PRODUCT ↔ REVIEW
// =====================================================

Product.hasMany(Review, {
  foreignKey: 'productRefId',
  as: 'reviews',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Review.belongsTo(Product, {
  foreignKey: 'productRefId',
  as: 'product',
});


// =====================================================
// USER ↔ ORDER
// =====================================================

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});


// =====================================================
// ORDER ↔ ORDER ITEM
// =====================================================

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});


// =====================================================
// PRODUCT ↔ ORDER ITEM
// =====================================================

Product.hasMany(OrderItem, {
  foreignKey: 'productRefId',
  as: 'orderItems',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productRefId',
  as: 'product',
});


// =====================================================
// DATABASE SYNC
// =====================================================

export const syncDB = async () => {
  await sequelize.sync({
    alter: process.env.NODE_ENV === 'development',
  });

  console.log('Database synced');
};

export {
  sequelize,
  User,
  Product,
  Review,
  Order,
  OrderItem,
};