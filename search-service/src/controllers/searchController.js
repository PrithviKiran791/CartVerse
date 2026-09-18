import { typesenseClient, COLLECTION_ALIAS, checkTypesenseHealth } from '../config/typesenseClient.js';
import { circuitBreaker, executeFallbackSearch } from '../services/circuitBreaker.js';
import { searchConfig } from '../config/searchConfig.js';
import { getCached, setCached } from '../config/cache.js';
import { sequelize } from '../config/db.js';

/**
 * Log search query analytics for telemetry and zero-result tracking
 */
const recordAnalytics = async ({ query, hitsCount, queryTimeMs, filters, req, degraded }) => {
  try {
    const cleanQ = String(query || '').trim();
    if (!cleanQ) return;

    await sequelize.query(
      `INSERT INTO "SearchAnalytics" ("id", "query", "normalizedQuery", "hitsCount", "queryTimeMs", "filters", "ip", "userAgent", "degraded", "createdAt")
       VALUES (gen_random_uuid(), :query, :normalizedQuery, :hitsCount, :queryTimeMs, :filters, :ip, :userAgent, :degraded, NOW());`,
      {
        replacements: {
          query: cleanQ,
          normalizedQuery: cleanQ.toLowerCase(),
          hitsCount,
          queryTimeMs,
          filters: filters ? JSON.stringify(filters) : null,
          ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
          userAgent: (req.headers['user-agent'] || '').slice(0, 500),
          degraded,
        },
      }
    );
  } catch (err) {
    // Non-blocking telemetry
  }
};

/**
 * Main Search Endpoint: /api/v1/search
 */
export const searchProducts = async (req, res) => {
  const startTime = performance.now();
  const {
    q = '',
    page = 1,
    per_page = 20,
    sort_by,
    category,
    brand,
    min_price,
    max_price,
    in_stock,
    featured,
    facet_by = searchConfig.facetBy,
  } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const perPageNum = Math.min(Math.max(Number(per_page) || 20, 1), 100);
  const queryStr = String(q || '').trim();

  // Cache key
  const cacheKey = `search:${queryStr}:${pageNum}:${perPageNum}:${sort_by || ''}:${category || ''}:${brand || ''}:${min_price || ''}:${max_price || ''}:${in_stock || ''}:${featured || ''}`;
  const cachedResult = await getCached(cacheKey);
  if (cachedResult) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cachedResult);
  }

  // 1. If Circuit Breaker is OPEN, route directly to Fallback
  if (circuitBreaker.isOpen()) {
    const fallbackRes = await executeFallbackSearch({
      query: queryStr,
      page: pageNum,
      perPage: perPageNum,
      category,
      brands: brand,
      minPrice: min_price,
      maxPrice: max_price,
      inStock: in_stock,
      sortBy: sort_by,
    });
    const queryTimeMs = Math.round(performance.now() - startTime);
    fallbackRes.queryTimeMs = queryTimeMs;

    recordAnalytics({
      query: queryStr,
      hitsCount: fallbackRes.totalHits,
      queryTimeMs,
      filters: req.query,
      req,
      degraded: true,
    });

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Search-Engine', 'PostgreSQL-Fallback');
    return res.json(fallbackRes);
  }

  // 2. Build Typesense search parameters
  try {
    const filterClauses = [];

    if (category) {
      filterClauses.push(`category:=[${String(category).split(',').map(c => `\`${c.trim()}\``).join(',')}]`);
    }

    if (brand) {
      filterClauses.push(`brand:=[${String(brand).split(',').map(b => `\`${b.trim()}\``).join(',')}]`);
    }

    if (min_price !== undefined && min_price !== '') {
      filterClauses.push(`price:>=${Number(min_price)}`);
    }

    if (max_price !== undefined && max_price !== '') {
      filterClauses.push(`price:<=${Number(max_price)}`);
    }

    if (in_stock === 'true' || in_stock === true) {
      filterClauses.push('inStock:=true');
    }

    if (featured === 'true' || featured === true) {
      filterClauses.push('featured:=true');
    }

    let searchSort = 'boostScore:desc,_text_match:desc';
    if (sort_by) {
      if (sort_by === 'price-asc' || sort_by === 'price:asc') searchSort = 'price:asc';
      else if (sort_by === 'price-desc' || sort_by === 'price:desc') searchSort = 'price:desc';
      else if (sort_by === 'rating' || sort_by === 'rating:desc') searchSort = 'rating:desc';
      else if (sort_by === 'newest' || sort_by === 'created_at:desc') searchSort = 'created_at:desc';
    }

    const searchParams = {
      q: queryStr || '*',
      query_by: searchConfig.queryBy,
      query_by_weights: searchConfig.queryByWeights,
      num_typos: searchConfig.numTypos,
      min_len_1typo: searchConfig.minLen1Typo,
      min_len_2typo: searchConfig.minLen2Typos,
      drop_tokens_threshold: searchConfig.dropTokensThreshold,
      typo_tokens_threshold: searchConfig.typoTokensThreshold,
      page: pageNum,
      per_page: perPageNum,
      sort_by: searchSort,
      facet_by,
      max_facet_values: searchConfig.maxFacetValues,
      highlight_fields: 'name,brand,category,sku',
      highlight_full_fields: 'name,brand',
    };

    if (filterClauses.length > 0) {
      searchParams.filter_by = filterClauses.join(' && ');
    }

    const searchResult = await typesenseClient
      .collections(COLLECTION_ALIAS)
      .documents()
      .search(searchParams);

    circuitBreaker.recordSuccess();

    let responseData = {
      hits: searchResult.hits || [],
      totalHits: searchResult.found || 0,
      found: searchResult.found || 0,
      page: searchResult.page || 1,
      totalPages: Math.ceil((searchResult.found || 0) / perPageNum),
      perPage: perPageNum,
      facetCounts: searchResult.facet_counts || [],
      queryTimeMs: searchResult.search_time_ms || Math.round(performance.now() - startTime),
      degraded: false,
      engine: 'typesense',
    };

    // Zero-result recovery: If 0 hits, try relaxing filters or fetching popular recommendations
    if (responseData.totalHits === 0 && (filterClauses.length > 0 || queryStr)) {
      console.log(`[Search] 0 hits for "${queryStr}", running zero-result recovery...`);
      try {
        // Relax filters first
        const relaxedParams = {
          ...searchParams,
          filter_by: undefined,
          q: queryStr || '*',
          per_page: 6,
        };
        const relaxedResult = await typesenseClient
          .collections(COLLECTION_ALIAS)
          .documents()
          .search(relaxedParams);

        if (relaxedResult.found > 0) {
          responseData.suggestedHits = relaxedResult.hits;
          responseData.zeroResultReason = 'filters_too_restrictive';
        } else {
          // Query itself had 0 hits - offer popular alternatives
          const fallbackParams = {
            q: '*',
            sort_by: 'boostScore:desc',
            per_page: 8,
          };
          const popularResult = await typesenseClient
            .collections(COLLECTION_ALIAS)
            .documents()
            .search(fallbackParams);
          responseData.suggestedHits = popularResult.hits;
          responseData.zeroResultReason = 'no_matching_query';
        }
      } catch (e) {
        // Soft fail for recovery
      }
    }

    await setCached(cacheKey, responseData, 60);

    recordAnalytics({
      query: queryStr,
      hitsCount: responseData.totalHits,
      queryTimeMs: responseData.queryTimeMs,
      filters: req.query,
      req,
      degraded: false,
    });

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Search-Engine', 'Typesense');
    return res.json(responseData);
  } catch (error) {
    circuitBreaker.recordFailure(error);

    // Immediate fallback to PostgreSQL
    const fallbackRes = await executeFallbackSearch({
      query: queryStr,
      page: pageNum,
      perPage: perPageNum,
      category,
      brands: brand,
      minPrice: min_price,
      maxPrice: max_price,
      inStock: in_stock,
      sortBy: sort_by,
    });

    const queryTimeMs = Math.round(performance.now() - startTime);
    fallbackRes.queryTimeMs = queryTimeMs;

    recordAnalytics({
      query: queryStr,
      hitsCount: fallbackRes.totalHits,
      queryTimeMs,
      filters: req.query,
      req,
      degraded: true,
    });

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Search-Engine', 'PostgreSQL-Fallback');
    return res.json(fallbackRes);
  }
};

/**
 * Autocomplete / Suggest Endpoint: /api/v1/search/suggest
 * Provides grouped suggestions (matching products, categories, brands, popular searches)
 */
export const suggestProducts = async (req, res) => {
  const queryStr = String(req.query.q || '').trim();
  if (!queryStr) {
    return res.json({
      query: '',
      products: [],
      categories: [],
      brands: [],
      popular: searchConfig.popularSearches.slice(0, 5),
    });
  }

  const cacheKey = `suggest:${queryStr.toLowerCase()}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // If circuit breaker is OPEN, use SQL fallback for suggestions
  if (circuitBreaker.isOpen()) {
    try {
      const [products] = await sequelize.query(
        `SELECT "productId", "name", "brand", "category", "price", "imageSlug", "rating"
         FROM "Products"
         WHERE "name" ILIKE :q OR "brand" ILIKE :q OR "category" ILIKE :q
         ORDER BY "stock" > 0 DESC, "rating" DESC
         LIMIT 6;`,
        { replacements: { q: `%${queryStr}%` } }
      );

      const [brandRows] = await sequelize.query(
        `SELECT DISTINCT "brand" FROM "Products" WHERE "brand" ILIKE :q LIMIT 4;`,
        { replacements: { q: `%${queryStr}%` } }
      );

      const [catRows] = await sequelize.query(
        `SELECT DISTINCT "category" FROM "Products" WHERE "category" ILIKE :q LIMIT 4;`,
        { replacements: { q: `%${queryStr}%` } }
      );

      const result = {
        query: queryStr,
        products: products.map((p) => ({
          id: p.productId,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: Number(p.price),
          imageSlug: p.imageSlug,
          rating: Number(p.rating),
        })),
        categories: catRows.map((c) => c.category),
        brands: brandRows.map((b) => b.brand),
        popular: searchConfig.popularSearches
          .filter((s) => s.toLowerCase().includes(queryStr.toLowerCase()))
          .slice(0, 3),
        degraded: true,
      };

      await setCached(cacheKey, result, 60);
      return res.json(result);
    } catch (e) {
      return res.json({
        query: queryStr,
        products: [],
        categories: [],
        brands: [],
        popular: [],
        degraded: true,
      });
    }
  }

  try {
    const searchParams = {
      q: queryStr,
      query_by: 'name,brand,category,sku,tags',
      prefix: true,
      num_typos: 1,
      per_page: 6,
      facet_by: 'category,brand',
      max_facet_values: 5,
      sort_by: 'boostScore:desc,_text_match:desc',
    };

    const results = await typesenseClient
      .collections(COLLECTION_ALIAS)
      .documents()
      .search(searchParams);

    circuitBreaker.recordSuccess();

    const products = (results.hits || []).map((h) => ({
      id: h.document.productId || h.document.id,
      name: h.document.name,
      brand: h.document.brand,
      category: h.document.category,
      price: h.document.price,
      imageSlug: h.document.imageSlug,
      rating: h.document.rating,
      inStock: h.document.inStock,
      highlights: h.highlights,
    }));

    const categoryFacets =
      results.facet_counts?.find((f) => f.field_name === 'category')?.counts || [];
    const brandFacets =
      results.facet_counts?.find((f) => f.field_name === 'brand')?.counts || [];

    const popular = searchConfig.popularSearches
      .filter((s) => s.toLowerCase().includes(queryStr.toLowerCase()))
      .slice(0, 3);

    const result = {
      query: queryStr,
      products,
      categories: categoryFacets.map((c) => c.value),
      brands: brandFacets.map((b) => b.value),
      popular,
      degraded: false,
    };

    await setCached(cacheKey, result, 60);
    return res.json(result);
  } catch (err) {
    circuitBreaker.recordFailure(err);

    // Fallback on error
    const [products] = await sequelize.query(
      `SELECT "productId", "name", "brand", "category", "price", "imageSlug", "rating"
       FROM "Products"
       WHERE "name" ILIKE :q OR "brand" ILIKE :q OR "category" ILIKE :q
       ORDER BY "stock" > 0 DESC, "rating" DESC
       LIMIT 6;`,
      { replacements: { q: `%${queryStr}%` } }
    );

    return res.json({
      query: queryStr,
      products: products.map((p) => ({
        id: p.productId,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: Number(p.price),
        imageSlug: p.imageSlug,
        rating: Number(p.rating),
      })),
      categories: [],
      brands: [],
      popular: [],
      degraded: true,
    });
  }
};

/**
 * Facets Endpoint: /api/v1/search/facets
 */
export const getSearchFacets = async (req, res) => {
  const { category, brand } = req.query;

  try {
    if (circuitBreaker.isOpen()) {
      throw new Error('Circuit breaker open');
    }

    const filterClauses = [];
    if (category) filterClauses.push(`category:=[${category}]`);
    if (brand) filterClauses.push(`brand:=[${brand}]`);

    const result = await typesenseClient
      .collections(COLLECTION_ALIAS)
      .documents()
      .search({
        q: '*',
        facet_by: 'category,brand,inStock,featured,bestSeller',
        max_facet_values: 30,
        per_page: 0,
        filter_by: filterClauses.length > 0 ? filterClauses.join(' && ') : undefined,
      });

    return res.json({
      facets: result.facet_counts || [],
      degraded: false,
    });
  } catch (err) {
    // SQL fallback for facets
    const [categories] = await sequelize.query(
      `SELECT "category" as value, COUNT(*)::int as count FROM "Products" GROUP BY "category" ORDER BY count DESC;`
    );
    const [brands] = await sequelize.query(
      `SELECT "brand" as value, COUNT(*)::int as count FROM "Products" GROUP BY "brand" ORDER BY count DESC LIMIT 30;`
    );

    return res.json({
      facets: [
        { field_name: 'category', counts: categories },
        { field_name: 'brand', counts: brands },
      ],
      degraded: true,
    });
  }
};

/**
 * Health & Readiness Probes
 */
export const healthCheck = async (req, res) => {
  const typesenseOk = await checkTypesenseHealth();
  const dbOk = await sequelize
    .authenticate()
    .then(() => true)
    .catch(() => false);

  const status = dbOk ? (typesenseOk ? 'healthy' : 'degraded') : 'unhealthy';

  res.status(dbOk ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      searchEngine: typesenseOk ? 'up' : 'down (fallback active)',
      database: dbOk ? 'up' : 'down',
      circuitBreakerState: circuitBreaker.state,
    },
  });
};

export const readinessCheck = async (req, res) => {
  res.status(200).json({ status: 'ready', uptime: process.uptime() });
};
