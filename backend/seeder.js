import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import users from './data/users.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create users (passwords are hashed by pre-save middleware)
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    console.log(`[Seeder] Seeded ${createdUsers.length} users (Admin & demo accounts).`);

    // Load products
    const productsPath = path.resolve('backend/data/products.json');
    let products = [];
    if (fs.existsSync(productsPath)) {
      const raw = fs.readFileSync(productsPath, 'utf8');
      products = JSON.parse(raw);
    }

    if (products.length > 0) {
      // Clean and map products with unique SKU deduplication
      const seenSkus = new Set();
      const seenIds = new Set();
      const sampleProducts = [];

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const { _id, ...rest } = product;

        let id = product.id || `prod-${i + 1}`;
        if (seenIds.has(id)) {
          id = `${id}-${i + 1}`;
        }
        seenIds.add(id);

        let sku = product.sku || id.toUpperCase();
        if (seenSkus.has(sku)) {
          sku = `${sku}-${i + 1}`;
        }
        seenSkus.add(sku);

        sampleProducts.push({
          ...rest,
          id,
          sku,
        });
      }

      await Product.insertMany(sampleProducts);
      console.log(`[Seeder] Seeded ${sampleProducts.length} verified hardware products.`);
    }

    console.log('[Seeder] Data Import Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] All database records deleted successfully!');
    process.exit();
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
