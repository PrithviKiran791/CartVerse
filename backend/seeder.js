import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { syncDB, User, Product, Order, OrderItem } from './models/index.js';
import users from './data/users.js';

const run = async () => {
  await connectDB();
  await syncDB();
};

const importData = async () => {
  try {
    await run();

    await OrderItem.destroy({ where: {}, truncate: true, cascade: true });
    await Order.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    // Loop with .create() (not bulkCreate) so the password-hashing hook runs for each user
    const createdUsers = [];
    for (const u of users) {
      createdUsers.push(await User.create(u));
    }
    const adminUser = createdUsers[0].id;

    // TODO: replace with your real product data converted from frontend/src/data/mockProducts.ts
    await Product.create({
      userId: adminUser,
      productId: 'CV-CPU-0001',
      sku: 'SKU-CPU-0001',
      name: 'AMD Ryzen 7 7800X3D',
      brand: 'AMD',
      category: 'cpu',
      price: 32999,
      imageSlug: 'CPU_Image/AMD/ryzen7_7800x3d.png',
      stock: 25,
      description: 'High-performance gaming CPU with 3D V-Cache.',
      tags: ['AM5', 'DDR5'],
      featured: true,
    });

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await run();
    await OrderItem.destroy({ where: {}, truncate: true, cascade: true });
    await Order.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}