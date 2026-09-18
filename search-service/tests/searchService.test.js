import test from 'node:test';
import assert from 'node:assert/strict';
import { executeFallbackSearch, circuitBreaker, BreakerState } from '../src/services/circuitBreaker.js';
import { searchConfig } from '../src/config/searchConfig.js';
import { transformProductForIndex } from '../src/indexer/schema.js';
import { sequelize } from '../src/config/db.js';

test.after(async () => {
  await sequelize.close();
});

test('Product Schema Transformer correctly maps hardware attributes', () => {
  const sample = {
    productId: 'cpu-7800x3d',
    name: 'AMD Ryzen 7 7800X3D',
    brand: 'AMD',
    category: 'cpu',
    price: 32999,
    stock: 14,
    rating: 4.9,
    featured: true,
    bestSeller: true,
    specs: {
      socket: 'AM5',
      cores: 8,
      vCache: '96MB',
    },
    tags: ['AM5', 'Zen 4', 'X3D'],
  };

  const doc = transformProductForIndex(sample);
  assert.equal(doc.id, 'cpu-7800x3d');
  assert.equal(doc.brand, 'AMD');
  assert.equal(doc.inStock, true);
  assert.ok(doc.specsText.includes('socket: AM5'));
  assert.ok(doc.specsText.includes('vCache: 96MB'));
  assert.ok(doc.boostScore > 10, 'Boost score should be elevated for best sellers in stock');
});

test('Synonym Dictionary includes key PC hardware groups', () => {
  const gpuSyn = searchConfig.synonyms.find((s) => s.id === 'gpu-synonyms');
  assert.ok(gpuSyn, 'GPU synonyms set exists');
  assert.ok(gpuSyn.synonyms.includes('graphics card'));
  assert.ok(gpuSyn.synonyms.includes('rtx'));

  const cpuSyn = searchConfig.synonyms.find((s) => s.id === 'cpu-synonyms');
  assert.ok(cpuSyn, 'CPU synonyms set exists');
  assert.ok(cpuSyn.synonyms.includes('processor'));

  const ramSyn = searchConfig.synonyms.find((s) => s.id === 'ram-synonyms');
  assert.ok(ramSyn, 'RAM synonyms set exists');
  assert.ok(ramSyn.synonyms.includes('memory'));
});

test('Token separators contain hyphens and slashes for model numbers', () => {
  assert.ok(searchConfig.tokenSeparators.includes('-'), 'Hyphen separator is configured');
  assert.ok(searchConfig.tokenSeparators.includes('/'), 'Slash separator is configured');
  assert.ok(searchConfig.tokenSeparators.includes('_'), 'Underscore separator is configured');
});

test('Circuit Breaker state transitions correctly', () => {
  circuitBreaker.failureCount = 0;
  circuitBreaker.state = BreakerState.CLOSED;

  assert.equal(circuitBreaker.isOpen(), false, 'Initially CLOSED');

  // Record failures to trip breaker
  circuitBreaker.recordFailure(new Error('Connection timeout 1'));
  circuitBreaker.recordFailure(new Error('Connection timeout 2'));
  circuitBreaker.recordFailure(new Error('Connection timeout 3'));

  assert.equal(circuitBreaker.state, BreakerState.OPEN, 'Should be OPEN after threshold failures');
  assert.equal(circuitBreaker.isOpen(), true, 'isOpen() should return true when OPEN');

  // Success resets to CLOSED
  circuitBreaker.recordSuccess();
  assert.equal(circuitBreaker.state, BreakerState.CLOSED, 'Should reset to CLOSED on success');
  assert.equal(circuitBreaker.isOpen(), false);
});

test('PostgreSQL Fallback Search handles multi-token hardware queries', async () => {
  const result = await executeFallbackSearch({
    query: 'ryzen',
    page: 1,
    perPage: 5,
  });

  assert.ok(result, 'Returns a search result');
  assert.ok(Array.isArray(result.hits), 'Returns hits array');
  assert.equal(result.degraded, true, 'Flags degraded mode');
  assert.equal(result.engine, 'postgresql_fallback');
  assert.ok(result.totalHits > 0, 'Found matching products in PostgreSQL');
  assert.ok(result.hits[0].document.name, 'Document contains product name');
});

test('PostgreSQL Fallback Search handles model codes like "4070"', async () => {
  const result = await executeFallbackSearch({
    query: '4070',
    page: 1,
    perPage: 5,
  });

  assert.ok(result, 'Returns result for 4070');
  assert.ok(result.hits.length > 0, 'Should find products matching 4070');
});

test('PostgreSQL Fallback Search respects category and price filters', async () => {
  const result = await executeFallbackSearch({
    query: '',
    category: 'gpu',
    minPrice: 10000,
    maxPrice: 150000,
    page: 1,
    perPage: 10,
  });

  assert.ok(result, 'Returns result');
  for (const hit of result.hits) {
    assert.equal(hit.document.category, 'gpu', 'Category matches filter');
    assert.ok(hit.document.price >= 10000, 'Price satisfies minPrice');
    assert.ok(hit.document.price <= 150000, 'Price satisfies maxPrice');
  }
});
