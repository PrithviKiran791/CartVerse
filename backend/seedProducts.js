import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import sequelize from './config/db.js';
import { syncDB, User, Product, Outbox, OrderItem } from './models/index.js';
import { mockProducts } from './data/dist/products-bundle.js';

const seedProducts = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Safely migrate category column to VARCHAR(50) if previously an ENUM
    try {
      await sequelize.query('ALTER TABLE "Products" ALTER COLUMN "category" TYPE VARCHAR(50);');
      console.log('Category column migrated to VARCHAR(50)');
    } catch (e) {
      // Column might already be VARCHAR or table doesn't exist yet
    }

    await syncDB();

    console.log(`Loaded ${mockProducts.length} mock products from hardware catalog bundle.`);

    // Find or create admin user for product ownership
    let adminUser = await User.findOne({ where: { isAdmin: true } });
    if (!adminUser) {
      adminUser = await User.findOne();
    }
    const adminId = adminUser ? adminUser.id : null;

    // Clean existing products for fresh seeding
    await OrderItem.destroy({ where: {}, truncate: true, cascade: true }).catch(() => {});
    await Product.destroy({ where: {}, truncate: true, cascade: true }).catch(() => {});
    await Outbox.destroy({ where: {}, truncate: true, cascade: true }).catch(() => {});

    const productsToInsert = [];
    const outboxBatch = [];
    const seenSkus = new Set();

    for (let i = 0; i < mockProducts.length; i++) {
      const item = mockProducts[i];
      const prodId = item.id || `CV-${Math.random().toString(36).substring(2, 9)}`;
      let skuVal = (item.sku && item.sku.trim()) || `SKU-${prodId.toUpperCase()}`;
      if (seenSkus.has(skuVal.toLowerCase())) {
        skuVal = `${skuVal}-${i + 1}`;
      }
      seenSkus.add(skuVal.toLowerCase());

      const productData = {
        userId: adminId,
        productId: prodId,
        sku: skuVal,
        name: (item.name || 'Unnamed Product').slice(0, 200),
        brand: (item.brand || 'Generic').slice(0, 100),
        category: (item.category || 'other').slice(0, 50),
        subcategory: item.subcategory || null,
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
        imageSlug: item.imageSlug || 'placeholder.jpg',
        stock: typeof item.stock === 'number' ? item.stock : 25,
        rating: Number(item.rating || item.avgRating || 0),
        reviewsCount: Number(item.reviewsCount || item.reviewCount || 0),
        specs: item.specs || {},
        featured: Boolean(item.featured),
        isNew: Boolean(item.isNew),
        bestSeller: Boolean(item.bestSeller),
        tags: Array.isArray(item.tags) ? item.tags : [],
        description: item.description || `${item.name} - high performance hardware.`,
      };

      productsToInsert.push(productData);
      outboxBatch.push({
        aggregateType: 'Product',
        aggregateId: prodId,
        eventType: 'created',
        payload: productData,
      });
    }

    console.log(`Inserting ${productsToInsert.length} products in bulk...`);
    await Product.bulkCreate(productsToInsert);
    console.log(`Successfully inserted ${productsToInsert.length} products into PostgreSQL.`);

    // Populate Outbox table in batches of 100
    if (outboxBatch.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < outboxBatch.length; i += chunkSize) {
        const chunk = outboxBatch.slice(i, i + chunkSize);
        await Outbox.bulkCreate(chunk);
      }
      console.log(`Outbox events logged: ${outboxBatch.length} events.`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
