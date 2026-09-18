import { searchConfig } from '../config/searchConfig.js';

export const getCollectionSchema = (collectionName) => ({
  name: collectionName,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'productId', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'brand', type: 'string', facet: true },
    { name: 'category', type: 'string', facet: true },
    { name: 'subcategory', type: 'string', facet: true, optional: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'originalPrice', type: 'float', optional: true },
    { name: 'stock', type: 'int32', facet: true },
    { name: 'inStock', type: 'bool', facet: true },
    { name: 'rating', type: 'float', facet: true },
    { name: 'reviewsCount', type: 'int32' },
    { name: 'imageSlug', type: 'string' },
    { name: 'sku', type: 'string' },
    { name: 'featured', type: 'bool', facet: true },
    { name: 'isNew', type: 'bool', facet: true },
    { name: 'bestSeller', type: 'bool', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'description', type: 'string' },
    { name: 'specsText', type: 'string' },
    { name: 'boostScore', type: 'float' },
  ],
  token_separators: searchConfig.tokenSeparators,
  symbols_to_index: searchConfig.symbolsToIndex,
});

/**
 * Transforms a raw database product row into a search document ready for indexing.
 */
export const transformProductForIndex = (product) => {
  const specs = typeof product.specs === 'object' && product.specs !== null ? product.specs : {};

  // Flatten specs into a searchable string, extracting hardware attributes
  const flattenSpecs = (obj, prefix = '') => {
    let parts = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        parts.push(...flattenSpecs(value, `${prefix}${key} `));
      } else if (value !== null && value !== undefined) {
        parts.push(`${key}: ${value}`);
      }
    }
    return parts;
  };
  const specsText = flattenSpecs(specs).join(' ');

  const rating = Number(product.rating || 0);
  const stock = Number(product.stock || 0);
  const inStock = stock > 0;
  const featured = Boolean(product.featured);
  const bestSeller = Boolean(product.bestSeller);

  // Boost calculation: in-stock items get 2x baseline, best sellers +5, featured +3, rating scale up to +5
  const boostScore = (inStock ? 10.0 : 1.0) + (bestSeller ? 5.0 : 0) + (featured ? 3.0 : 0) + (rating * 1.0);

  return {
    id: String(product.productId || product.id),
    productId: String(product.productId || product.id),
    name: String(product.name || ''),
    brand: String(product.brand || 'Generic'),
    category: String(product.category || 'other'),
    subcategory: product.subcategory ? String(product.subcategory) : undefined,
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    stock,
    inStock,
    rating,
    reviewsCount: Number(product.reviewsCount || 0),
    imageSlug: String(product.imageSlug || 'placeholder.jpg'),
    sku: String(product.sku || ''),
    featured,
    isNew: Boolean(product.isNew),
    bestSeller,
    tags: Array.isArray(product.tags) ? product.tags : [],
    description: String(product.description || ''),
    specsText,
    boostScore,
  };
};
