import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid,
  LayoutGrid,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  Sparkles,
  Layers,
  X,
  Cpu,
  Tv,
  Zap,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { Product, FilterState, ComponentCategory } from '../../types/hardware';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { CategorySectionView } from './CategorySectionView';
import HoverEffect from '../ui/card-hover-effect';

export const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ComponentCategory) || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [viewMode, setViewMode] = useState<'sections' | 'grid'>('sections');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearch,
    category: initialCategory,
    brands: [],
    priceRange: [500, 250000],
    sockets: [],
    ramTypes: [],
    resolutions: [],
    refreshRates: [],
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Sync url param changes to filters
  useEffect(() => {
    const cat = searchParams.get('category') as ComponentCategory;
    const search = searchParams.get('search');

    if (cat && cat !== filters.category) {
      setFilters((prev) => ({ ...prev, category: cat }));
      setViewMode('grid'); // switch to grid for specific category filtering
    }
    if (search !== null && search !== filters.searchQuery) {
      setFilters((prev) => ({ ...prev, searchQuery: search }));
      setViewMode('grid');
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.tags && product.tags.some((t) => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Price
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Sockets
      if (filters.sockets.length > 0) {
        if (!product.specs.socket || !filters.sockets.includes(product.specs.socket)) {
          return false;
        }
      }

      // RAM types
      if (filters.ramTypes.length > 0) {
        if (!product.specs.ramType || !filters.ramTypes.includes(product.specs.ramType)) {
          return false;
        }
      }

      // Resolutions
      if (filters.resolutions.length > 0) {
        if (!product.specs.resolution || !filters.resolutions.includes(product.specs.resolution)) {
          return false;
        }
      }

      // Refresh rate
      if (filters.refreshRates.length > 0) {
        if (
          !product.specs.refreshRateHz ||
          !filters.refreshRates.includes(product.specs.refreshRateHz)
        ) {
          return false;
        }
      }

      // In Stock
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (filters.sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, filters.sortBy]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.searchQuery !== '' ||
    filters.sockets.length > 0 ||
    filters.ramTypes.length > 0 ||
    filters.resolutions.length > 0 ||
    filters.refreshRates.length > 0 ||
    filters.priceRange[1] < 250000 ||
    filters.inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 rounded-3xl p-8 mb-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Direct Indian Channel Hardware
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PC Hardware & Components Catalog
          </h1>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            Browse our comprehensive inventory of processors, GPUs, motherboards, high-speed RAM, NVMe SSDs, and peripherals with real-time stock and compatibility validation.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search within hardware catalog..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-8 py-2 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-red-500"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 text-xs font-bold text-neutral-200 border border-neutral-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>Filters</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('sections')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'sections'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Category Sections View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Category Sections</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Faceted Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Faceted Grid</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Gen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-neutral-500 font-mono">Active Filters:</span>
          {filters.category !== 'all' && (
            <span className="bg-red-950/60 border border-red-800 text-red-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
              Category: {filters.category.toUpperCase()}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
              />
            </span>
          )}
          {filters.sockets.map((sock) => (
            <span
              key={sock}
              className="bg-neutral-800 border border-neutral-700 text-cyan-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono"
            >
              Socket: {sock}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() =>
                  setFilters((p) => ({ ...p, sockets: p.sockets.filter((s) => s !== sock) }))
                }
              />
            </span>
          ))}
          {filters.ramTypes.map((rt) => (
            <span
              key={rt}
              className="bg-neutral-800 border border-neutral-700 text-purple-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono"
            >
              RAM: {rt}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() =>
                  setFilters((p) => ({ ...p, ramTypes: p.ramTypes.filter((r) => r !== rt) }))
                }
              />
            </span>
          ))}
          {filters.inStockOnly && (
            <span className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
              In Stock Only
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setFilters((p) => ({ ...p, inStockOnly: false }))}
              />
            </span>
          )}
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            totalCount={sortedProducts.length}
          />
        </div>

        {/* Catalog Content */}
        <div className="flex-1 min-w-0">
          {viewMode === 'sections' && filters.category === 'all' && !filters.searchQuery ? (
            /* Dedicated Categorized Showcase */
            <CategorySectionView products={sortedProducts} />
          ) : (
            /* Faceted Grid View */
            <div>
              {sortedProducts.length === 0 ? (
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-800 mx-auto flex items-center justify-center mb-4 text-neutral-500">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Matching Hardware Found</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
                    We couldn't find any components matching your active filters or search query. Try broadening your criteria.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        category: 'all',
                        brands: [],
                        priceRange: [500, 250000],
                        sockets: [],
                        ramTypes: [],
                        resolutions: [],
                        refreshRates: [],
                        inStockOnly: false,
                        sortBy: 'featured',
                      })
                    }
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
