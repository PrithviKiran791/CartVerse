export interface SearchHit {
  document: {
    id: string;
    productId: string;
    name: string;
    brand: string;
    category: string;
    subcategory?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    inStock: boolean;
    rating: number;
    reviewsCount: number;
    imageSlug: string;
    sku: string;
    featured: boolean;
    isNew: boolean;
    bestSeller: boolean;
    tags: string[];
    description: string;
  };
  highlights?: Array<{
    field: string;
    snippet: string;
    matched_tokens: string[];
  }>;
}

export interface SearchFacetCount {
  field_name: string;
  counts: Array<{ value: string; count: number }>;
}

export interface SearchResponse {
  hits: SearchHit[];
  totalHits: number;
  found: number;
  page: number;
  totalPages: number;
  perPage: number;
  facetCounts: SearchFacetCount[];
  queryTimeMs: number;
  degraded: boolean;
  engine?: string;
  suggestedHits?: SearchHit[];
  zeroResultReason?: string;
}

export interface SuggestResponse {
  query: string;
  products: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    imageSlug: string;
    rating: number;
    inStock?: boolean;
  }>;
  categories: string[];
  brands: string[];
  popular: string[];
  degraded: boolean;
}

export interface SearchQueryParams {
  q?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
  facet_by?: string;
}

// In development or production, queries pass through backend /api/v1/search proxy or direct to search-service
const BASE_URL = import.meta.env.VITE_SEARCH_API_URL || '/api/v1/search';

/**
 * Execute search query with cancellation support
 */
export const searchCatalog = async (
  params: SearchQueryParams,
  signal?: AbortSignal
): Promise<SearchResponse> => {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.page) query.set('page', String(params.page));
  if (params.per_page) query.set('per_page', String(params.per_page));
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.category) query.set('category', params.category);
  if (params.brand) query.set('brand', params.brand);
  if (params.min_price !== undefined) query.set('min_price', String(params.min_price));
  if (params.max_price !== undefined) query.set('max_price', String(params.max_price));
  if (params.in_stock !== undefined) query.set('in_stock', String(params.in_stock));
  if (params.featured !== undefined) query.set('featured', String(params.featured));
  if (params.facet_by) query.set('facet_by', params.facet_by);

  const url = `${BASE_URL}?${query.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Search request failed with status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch prefix autocomplete suggestions with cancellation support
 */
export const suggestQueries = async (
  queryText: string,
  signal?: AbortSignal
): Promise<SuggestResponse> => {
  const url = `${BASE_URL}/suggest?q=${encodeURIComponent(queryText)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Suggest request failed with status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch facet counts
 */
export const fetchFacets = async (
  category?: string,
  brand?: string,
  signal?: AbortSignal
): Promise<{ facets: SearchFacetCount[]; degraded: boolean }> => {
  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (brand) query.set('brand', brand);

  const url = `${BASE_URL}/facets?${query.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Facets request failed with status: ${response.status}`);
  }

  return response.json();
};
