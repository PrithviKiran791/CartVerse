import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Check,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { searchCatalog, SearchResponse, SearchHit } from '../api/searchApi';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  // Read URL parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort_by') || 'relevance';
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const inStockFilter = searchParams.get('in_stock') === 'true';

  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Local price input state
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Execute search when URL params change
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchCatalog(
      {
        q: query,
        page,
        per_page: 20,
        sort_by: sortBy,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        in_stock: inStockFilter ? true : undefined,
      },
      controller.signal
    )
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
          setError(err.message || 'Failed to fetch search results');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [query, page, sortBy, categoryFilter, brandFilter, minPrice, maxPrice, inStockFilter]);

  // Update query params helper
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams);
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key !== 'page') {
        next.set('page', '1'); // reset page on filter change
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const toggleBrand = (brand: string) => {
    const current = brandFilter ? brandFilter.split(',').filter(Boolean) : [];
    const exists = current.includes(brand);
    const updated = exists ? current.filter((b) => b !== brand) : [...current, brand];
    updateParam('brand', updated.length > 0 ? updated.join(',') : null);
  };

  const toggleCategory = (cat: string) => {
    const current = categoryFilter ? categoryFilter.split(',').filter(Boolean) : [];
    const exists = current.includes(cat);
    const updated = exists ? current.filter((c) => c !== cat) : [...current, cat];
    updateParam('category', updated.length > 0 ? updated.join(',') : null);
  };

  const handleApplyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (localMinPrice) next.set('min_price', localMinPrice);
    else next.delete('min_price');
    if (localMaxPrice) next.set('max_price', localMaxPrice);
    else next.delete('max_price');
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setSearchParams(next);
  };

  const handleAddToCart = (product: SearchHit['document']) => {
    addItem(product as any);
    addToast(`${product.name} added to cart!`);
  };

  const selectedBrands = brandFilter ? brandFilter.split(',').filter(Boolean) : [];
  const selectedCategories = categoryFilter ? categoryFilter.split(',').filter(Boolean) : [];
  const hasActiveFilters =
    Boolean(categoryFilter) ||
    Boolean(brandFilter) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockFilter;

  const categoryFacets =
    response?.facetCounts?.find((f) => f.field_name === 'category')?.counts || [];
  const brandFacets =
    response?.facetCounts?.find((f) => f.field_name === 'brand')?.counts || [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0c] text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Query Summary Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-[#FF1E2D]" />
              {query ? (
                <span>
                  Results for <span className="text-[#FF1E2D]">"{query}"</span>
                </span>
              ) : (
                <span>Hardware Catalog</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {loading ? (
                'Searching hardware catalog...'
              ) : (
                <>
                  Found <span className="font-semibold text-neutral-900 dark:text-white">{response?.totalHits || 0}</span> products
                  {response?.queryTimeMs ? ` in ${response.queryTimeMs}ms` : ''}
                  {response?.degraded && (
                    <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Resilient Fallback Mode
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#16151f] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#FF1E2D]" />
              Filters {hasActiveFilters && '(Active)'}
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => updateParam('sort_by', e.target.value)}
                className="text-xs bg-white dark:bg-[#16151f] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF1E2D] shadow-xs cursor-pointer"
              >
                <option value="relevance">Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Facets Sidebar (Desktop + Mobile Drawer) */}
          <aside
            className={`${
              showMobileFilters ? 'block' : 'hidden'
            } md:block md:col-span-1 space-y-6 bg-white dark:bg-[#111018] p-5 rounded-2xl border border-neutral-200/80 dark:border-[#201d2d] shadow-xs h-fit`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF1E2D]" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#FF1E2D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* In Stock Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockFilter}
                  onChange={(e) => updateParam('in_stock', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 rounded text-[#FF1E2D] focus:ring-[#FF1E2D] border-neutral-300 dark:border-neutral-700"
                />
                In Stock Only
              </label>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                Price (₹)
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#181622] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FF1E2D]"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#181622] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FF1E2D]"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPriceFilter}
                className="w-full py-1.5 rounded-lg bg-neutral-100 dark:bg-[#201d2d] hover:bg-[#FF1E2D] hover:text-white text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Apply Price
              </button>
            </div>

            {/* Category Facet Checklist */}
            {categoryFacets.length > 0 && (
              <div className="space-y-2.5 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                  Categories
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {categoryFacets.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.value);
                    return (
                      <label
                        key={cat.value}
                        className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.value)}
                            className="w-3.5 h-3.5 rounded text-[#FF1E2D] focus:ring-[#FF1E2D] border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="capitalize">{cat.value}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                          {cat.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brand Facet Checklist */}
            {brandFacets.length > 0 && (
              <div className="space-y-2.5 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                  Brands
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {brandFacets.map((b) => {
                    const isChecked = selectedBrands.includes(b.value);
                    return (
                      <label
                        key={b.value}
                        className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(b.value)}
                            className="w-3.5 h-3.5 rounded text-[#FF1E2D] focus:ring-[#FF1E2D] border-neutral-300 dark:border-neutral-700"
                          />
                          <span>{b.value}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                          {b.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Results Product Grid & Pagination */}
          <main className="md:col-span-3 lg:col-span-4 space-y-6">
            {/* Loading Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111018] border border-neutral-200/70 dark:border-[#201d2d] animate-pulse space-y-3"
                  >
                    <div className="w-full h-40 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 pt-2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-white dark:bg-[#111018] rounded-2xl border border-red-500/20 text-neutral-700 dark:text-neutral-300 space-y-3">
                <AlertCircle className="w-8 h-8 text-[#FF1E2D] mx-auto" />
                <h3 className="text-base font-semibold">Search Request Error</h3>
                <p className="text-xs text-neutral-500">{error}</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-[#FF1E2D] text-white cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : response?.hits && response.hits.length > 0 ? (
              <>
                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {response.hits.map((hit) => {
                    const product = hit.document;
                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#111018] border border-neutral-200/80 dark:border-[#201d2d] hover:border-[#FF1E2D]/50 dark:hover:border-[#FF1E2D]/50 hover:shadow-xl transition-all duration-200"
                      >
                        <div>
                          {/* Image Container */}
                          <Link
                            to={`/product/${product.productId || product.id}`}
                            className="block relative w-full h-44 rounded-xl bg-neutral-50 dark:bg-[#181622] p-3 overflow-hidden border border-neutral-100 dark:border-neutral-800/80 mb-3"
                          >
                            <img
                              src={getComponentImage(product.imageSlug, product.category)}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {product.bestSeller && (
                              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF1E2D] text-white uppercase tracking-wider shadow-xs">
                                Best Seller
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-300 backdrop-blur-xs">
                                Out of Stock
                              </span>
                            )}
                          </Link>

                          {/* Brand & Category */}
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              {product.brand}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{product.category}</span>
                          </div>

                          {/* Product Title */}
                          <Link
                            to={`/product/${product.productId || product.id}`}
                            className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2 hover:text-[#FF1E2D] transition-colors"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex items-center text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium ml-1 text-neutral-800 dark:text-neutral-200">
                                {Number(product.rating || 0).toFixed(1)}
                              </span>
                            </div>
                            {product.reviewsCount > 0 && (
                              <span className="text-[11px] text-neutral-400">
                                ({product.reviewsCount})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                          <div>
                            <div className="text-base font-bold text-[#FF1E2D]">
                              {formatCurrency(product.price)}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-[11px] text-neutral-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-[#1e1b2b] hover:bg-[#FF1E2D] dark:hover:bg-[#FF1E2D] text-neutral-800 dark:text-neutral-200 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {response.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => updateParam('page', String(page - 1))}
                      className="p-2 rounded-lg bg-white dark:bg-[#16151f] border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs text-neutral-500 dark:text-neutral-400 px-3">
                      Page <span className="font-semibold text-neutral-900 dark:text-white">{page}</span> of{' '}
                      <span className="font-semibold text-neutral-900 dark:text-white">{response.totalPages}</span>
                    </span>

                    <button
                      type="button"
                      disabled={page >= response.totalPages}
                      onClick={() => updateParam('page', String(page + 1))}
                      className="p-2 rounded-lg bg-white dark:bg-[#16151f] border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Zero Results Recovery State */
              <div className="p-8 text-center bg-white dark:bg-[#111018] rounded-2xl border border-neutral-200/80 dark:border-[#201d2d] space-y-6">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#1e1b2b] flex items-center justify-center mx-auto text-[#FF1E2D]">
                  <Search className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    No exact products found for "{query}"
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    {hasActiveFilters
                      ? 'Your active filters may be too restrictive. Try clearing filters or checking for typos.'
                      : 'Check the spelling of your hardware query, or browse our recommended hardware below.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF1E2D] text-white text-xs font-medium hover:bg-[#E5252A] transition-colors cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
                    </button>
                  )}
                </div>

                {/* Suggested / Popular Alternatives */}
                {response?.suggestedHits && response.suggestedHits.length > 0 && (
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-left space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                      <Sparkles className="w-4 h-4 text-[#FF1E2D]" />
                      Recommended Alternatives
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {response.suggestedHits.slice(0, 4).map((hit) => {
                        const product = hit.document;
                        return (
                          <div
                            key={product.id}
                            className="p-3 rounded-xl bg-neutral-50 dark:bg-[#181622] border border-neutral-200/70 dark:border-neutral-800 space-y-2"
                          >
                            <Link
                              to={`/product/${product.productId || product.id}`}
                              className="block h-28 bg-white dark:bg-[#111018] rounded-lg p-2 overflow-hidden"
                            >
                              <img
                                src={getComponentImage(product.imageSlug, product.category)}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </Link>
                            <Link
                              to={`/product/${product.productId || product.id}`}
                              className="text-xs font-medium line-clamp-1 hover:text-[#FF1E2D] transition-colors"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#FF1E2D]">
                                {formatCurrency(product.price)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="p-1.5 rounded-lg bg-white dark:bg-[#201d2d] text-neutral-700 dark:text-neutral-300 hover:text-[#FF1E2D]"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
