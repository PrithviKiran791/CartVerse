import { sequelize } from '../config/db.js';

export const BreakerState = {
  CLOSED: 'CLOSED',       // Normal operation, calls route to Typesense
  OPEN: 'OPEN',           // Degraded mode, calls immediately route to PostgreSQL fallback
  HALF_OPEN: 'HALF_OPEN', // Probing Typesense health
};

class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeoutMs = 15000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.failureCount = 0;
    this.state = BreakerState.CLOSED;
    this.nextAttempt = Date.now();
  }

  isOpen() {
    if (this.state === BreakerState.OPEN) {
      if (Date.now() >= this.nextAttempt) {
        this.state = BreakerState.HALF_OPEN;
        console.log('[CircuitBreaker] Transitioned to HALF_OPEN, attempting probe...');
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    if (this.state !== BreakerState.CLOSED) {
      console.log('[CircuitBreaker] Primary search recovered! Transitioned to CLOSED');
    }
    this.failureCount = 0;
    this.state = BreakerState.CLOSED;
  }

  recordFailure(error) {
    this.failureCount++;
    console.warn(
      `[CircuitBreaker] Typesense call failed (${this.failureCount}/${this.failureThreshold}): ${error?.message || error}`
    );

    if (this.failureCount >= this.failureThreshold || this.state === BreakerState.HALF_OPEN) {
      this.state = BreakerState.OPEN;
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      console.warn(
        `[CircuitBreaker] Breaker tripped to OPEN! Fast failing to PostgreSQL until ${new Date(this.nextAttempt).toISOString()}`
      );
    }
  }
}

export const circuitBreaker = new CircuitBreaker();

/**
 * Robust PostgreSQL fallback search when Typesense is unavailable.
 * Tokenizes the query and matches against name, brand, category, sku, and description.
 * Aggregates facets and pagination to match the Typesense API format.
 */
export const executeFallbackSearch = async ({
  query = '',
  page = 1,
  perPage = 20,
  category,
  brands,
  minPrice,
  maxPrice,
  inStock,
  sortBy = 'relevance',
}) => {
  const pageNum = Math.max(Number(page) || 1, 1);
  const limit = Math.min(Math.max(Number(perPage) || 20, 1), 100);
  const offset = (pageNum - 1) * limit;

  const conditions = [];
  const replacements = { limit, offset };

  // Tokenize and clean query
  const cleanQ = String(query || '').trim();
  if (cleanQ) {
    const tokens = cleanQ.split(/\s+/).filter(Boolean);
    const tokenConditions = tokens.map((token, idx) => {
      const param = `t_${idx}`;
      replacements[param] = `%${token}%`;
      return `(
        "name" ILIKE :${param} OR
        "brand" ILIKE :${param} OR
        "category" ILIKE :${param} OR
        "sku" ILIKE :${param} OR
        "description" ILIKE :${param}
      )`;
    });
    conditions.push(`(${tokenConditions.join(' AND ')})`);
  }

  // Filter conditions
  if (category) {
    conditions.push(`"category" = :filterCategory`);
    replacements.filterCategory = category;
  }

  if (brands) {
    const brandList = Array.isArray(brands) ? brands : String(brands).split(',').map(b => b.trim());
    if (brandList.length > 0) {
      conditions.push(`"brand" IN (:filterBrands)`);
      replacements.filterBrands = brandList;
    }
  }

  if (minPrice !== undefined && minPrice !== '') {
    conditions.push(`"price" >= :minPrice`);
    replacements.minPrice = Number(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    conditions.push(`"price" <= :maxPrice`);
    replacements.maxPrice = Number(maxPrice);
  }

  if (inStock === 'true' || inStock === true) {
    conditions.push(`"stock" > 0`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Order clause
  let orderClause = 'ORDER BY "stock" > 0 DESC, "rating" DESC, "createdAt" DESC';
  if (sortBy === 'price:asc' || sortBy === 'price-asc') {
    orderClause = 'ORDER BY "price" ASC';
  } else if (sortBy === 'price:desc' || sortBy === 'price-desc') {
    orderClause = 'ORDER BY "price" DESC';
  } else if (sortBy === 'rating:desc' || sortBy === 'rating') {
    orderClause = 'ORDER BY "rating" DESC';
  } else if (sortBy === 'created_at:desc' || sortBy === 'newest') {
    orderClause = 'ORDER BY "createdAt" DESC';
  }

  // Count total matches
  const [countResult] = await sequelize.query(
    `SELECT COUNT(*)::int as total FROM "Products" ${whereClause};`,
    { replacements }
  );
  const total = countResult[0]?.total || 0;

  // Retrieve paginated products
  const [rows] = await sequelize.query(
    `SELECT * FROM "Products" ${whereClause} ${orderClause} LIMIT :limit OFFSET :offset;`,
    { replacements }
  );

  // Compute facet counts for categories and brands
  const [categoryFacets] = await sequelize.query(
    `SELECT "category" as value, COUNT(*)::int as count FROM "Products" ${whereClause} GROUP BY "category" ORDER BY count DESC LIMIT 20;`,
    { replacements }
  );

  const [brandFacets] = await sequelize.query(
    `SELECT "brand" as value, COUNT(*)::int as count FROM "Products" ${whereClause} GROUP BY "brand" ORDER BY count DESC LIMIT 30;`,
    { replacements }
  );

  // Format hits to match Typesense response format
  const hits = rows.map((p) => ({
    document: {
      id: p.productId,
      productId: p.productId,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      stock: p.stock,
      inStock: p.stock > 0,
      rating: Number(p.rating),
      reviewsCount: p.reviewsCount,
      imageSlug: p.imageSlug,
      sku: p.sku,
      featured: p.featured,
      isNew: p.isNew,
      bestSeller: p.bestSeller,
      tags: p.tags || [],
      description: p.description,
    },
    highlights: cleanQ
      ? [
          {
            field: 'name',
            snippet: p.name,
            matched_tokens: [cleanQ],
          },
        ]
      : [],
  }));

  const facetCounts = [
    {
      field_name: 'category',
      counts: categoryFacets.map((c) => ({ value: c.value, count: c.count })),
    },
    {
      field_name: 'brand',
      counts: brandFacets.map((b) => ({ value: b.value, count: b.count })),
    },
  ];

  return {
    hits,
    totalHits: total,
    found: total,
    page: pageNum,
    totalPages: Math.ceil(total / limit),
    perPage: limit,
    facetCounts,
    degraded: true,
    engine: 'postgresql_fallback',
  };
};
