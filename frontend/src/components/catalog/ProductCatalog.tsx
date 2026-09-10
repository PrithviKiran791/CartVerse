import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
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
  Server,
} from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { Product, FilterState, ComponentCategory } from '../../types/hardware';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import HoverEffect from '../ui/card-hover-effect';
import Typography from '../ui/Typography';
import { Boxes } from '../ui/background-boxes';
import { SidebarNavigationSimple } from '../common/SidebarNavigationSimple';
import FaultyTerminal from '../common/FaultyTerminal';
import { HardwareIcon, getHardwareIcon } from '../../utils/hardwareIcons';

export const ProductCatalog: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isServerRoute =
    location.pathname.startsWith('/servers') || searchParams.get('productClass') === 'server';
  const initialProductClass = isServerRoute ? 'server' : 'consumer';
  const initialCategory = (searchParams.get('category') as ComponentCategory) || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialUseCase = searchParams.get('useCase');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearch,
    category: initialCategory,
    brands: [],
    priceRange: [500, initialProductClass === 'server' ? 35000000 : 250000],
    sockets: [],
    ramTypes: [],
    resolutions: [],
    refreshRates: [],
    inStockOnly: false,
    sortBy: 'featured',
    productClass: initialProductClass,
    memoryTypes: [],
    rackUnits: [],
    psuRedundancies: [],
    useCases: initialUseCase ? [initialUseCase] : [],
  });

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(24);
  }, [filters]);

  // Sync url param changes to filters
  useEffect(() => {
    const cat = searchParams.get('category') as ComponentCategory;
    const search = searchParams.get('search');
    const pc = searchParams.get('productClass') as 'consumer' | 'server';
    const uc = searchParams.get('useCase');

    setFilters((prev) => ({
      ...prev,
      ...(cat && { category: cat }),
      ...(search !== null && { searchQuery: search }),
      ...(pc && { productClass: pc, priceRange: [500, pc === 'server' ? 35000000 : 250000] }),
      ...(uc && { useCases: [uc] }),
    }));
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesIntel =
          product.specs.intelSpecs &&
          (product.specs.intelSpecs.codename.toLowerCase().includes(q) ||
            product.specs.intelSpecs.exactModel.toLowerCase().includes(q) ||
            product.specs.intelSpecs.generation.toLowerCase().includes(q) ||
            product.specs.intelSpecs.tier.toLowerCase().includes(q) ||
            product.specs.intelSpecs.suffix.toLowerCase().includes(q) ||
            product.specs.intelSpecs.igpu.toLowerCase().includes(q) ||
            product.specs.intelSpecs.architecturalNotes.toLowerCase().includes(q));

        const matchesRyzen =
          product.specs.ryzenSpecs &&
          (product.specs.ryzenSpecs.architecture.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.codename.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.modelName.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.generation.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.tier.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.suffix.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.l3Cache.toLowerCase().includes(q) ||
            product.specs.ryzenSpecs.architecturalNotes.toLowerCase().includes(q));

        const matchesRadeon =
          product.specs.radeonSpecs &&
          (product.specs.radeonSpecs.architecture.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.gpuCodename.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.modelName.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.series.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.vram.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.infinityCache.toLowerCase().includes(q) ||
            product.specs.radeonSpecs.architecturalNotes.toLowerCase().includes(q));

        const matchesNvidia =
          product.specs.nvidiaSpecs &&
          (product.specs.nvidiaSpecs.architecture.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.series.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.model.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.variant.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.generation.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.dlssAiFeatures.toLowerCase().includes(q) ||
            product.specs.nvidiaSpecs.mediaEngines.toLowerCase().includes(q));

        const matches =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(q)) ||
          (product.description && product.description.toLowerCase().includes(q)) ||
          (product.tags && product.tags.some((t) => t.toLowerCase().includes(q))) ||
          matchesIntel ||
          matchesRyzen ||
          matchesRadeon ||
          matchesNvidia;
        if (!matches) return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Product Class Filter (Consumer vs Server)
      if (filters.productClass === 'server') {
        const isServerProduct =
          product.productClass === 'server' ||
          product.category === 'server' ||
          product.category === 'supercomputer' ||
          product.specs.socket === 'SP5' ||
          product.specs.socket === 'SP3' ||
          product.specs.socket === 'LGA4677';
        if (!isServerProduct) return false;
      } else if (filters.productClass === 'consumer') {
        const isServerProduct =
          product.productClass === 'server' ||
          product.category === 'server' ||
          product.category === 'supercomputer';
        if (isServerProduct) return false;
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

      // Server Memory Types (RDIMM / LRDIMM)
      if (filters.memoryTypes && filters.memoryTypes.length > 0) {
        const mType = product.memoryType || product.specs.memoryType;
        if (!mType || !filters.memoryTypes.includes(mType as any)) {
          return false;
        }
      }

      // Rack Units (1U, 2U, 4U, etc.)
      if (filters.rackUnits && filters.rackUnits.length > 0) {
        const ru = product.rackUnits || product.specs.rackUnits;
        if (!ru || !filters.rackUnits.includes(ru)) {
          return false;
        }
      }

      // PSU Redundancy
      if (filters.psuRedundancies && filters.psuRedundancies.length > 0) {
        const red = product.psuRedundancy || product.specs.psuRedundancy;
        if (!red || !filters.psuRedundancies.includes(red as any)) {
          return false;
        }
      }

      // Use Case Tags
      if (filters.useCases && filters.useCases.length > 0) {
        const tags = product.useCaseTags || [];
        const matchesUseCase = filters.useCases.some((uc) => tags.includes(uc));
        if (!matchesUseCase) {
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
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 rounded-3xl p-8 mb-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Aceternity Animated Background Boxes */}
        <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Direct Indian Channel Hardware
          </div>
          <Typography type="h1" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PC Hardware & Components Catalog
          </Typography>
          <Typography type="body-sm" color="muted" className="mt-2 leading-relaxed">
            Browse our comprehensive inventory of processors, GPUs, motherboards, high-speed RAM, NVMe SSDs, and peripherals with real-time stock and compatibility validation.
          </Typography>
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

        {/* Sort & Mobile Filters */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 text-xs font-bold text-neutral-200 border border-neutral-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>Filters</span>
          </button>

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
            <span className="bg-red-950/60 border border-red-800 text-red-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-mono">
              <HardwareIcon name={filters.category} className="w-3.5 h-3.5 object-contain" />
              <span>Category: {filters.category.toUpperCase()}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-white ml-0.5"
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
        {/* Sidebar Container */}
        <div className={`w-full lg:w-72 shrink-0 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <SidebarNavigationSimple
            activeCategory={filters.category}
            onSelectCategory={(cat) => {
              setFilters((prev) => ({ ...prev, category: cat as ComponentCategory }));
            }}
          />

          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            totalCount={sortedProducts.length}
          />
        </div>

        {/* Catalog Content */}
        <div className="flex-1 min-w-0">
          {/* Faceted Grid View */}
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
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Progressive Loading & Pagination Controls */}
              {visibleCount < sortedProducts.length && (
                <div className="pt-6 pb-2 text-center flex flex-col items-center gap-3">
                  <p className="text-xs font-mono text-neutral-400">
                    Showing <span className="text-white font-bold">{Math.min(visibleCount, sortedProducts.length)}</span> of{' '}
                    <span className="text-red-400 font-bold">{sortedProducts.length}</span> models
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-red-950/40 cursor-pointer"
                    >
                      Load More Hardware (+24)
                    </button>
                    <button
                      onClick={() => setVisibleCount(sortedProducts.length)}
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      View All ({sortedProducts.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hardware Telemetry Terminal Matrix (Catalog Below Part) */}
          <div className="relative w-full h-[320px] sm:h-[380px] mt-16 rounded-3xl border border-neutral-800/90 overflow-hidden bg-neutral-950 shadow-2xl">
            <div className="absolute inset-0 z-0">
              <FaultyTerminal
                scale={1.5}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={0.4}
                scanlineIntensity={0.45}
                glitchAmount={1.05}
                flickerAmount={0.8}
                noiseAmp={1.0}
                chromaticAberration={0.25}
                curvature={0.08}
                tint="#E31B23"
                secondaryTint="#F59E0B"
                greyTint="#6B7280"
                multiColorMix={true}
                mouseReact={true}
                mouseStrength={0.5}
                brightness={0.85}
              />
            </div>

            {/* Gradient Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-10" />

            {/* Content overlay */}
            <div className="relative z-20 h-full p-6 sm:p-10 flex flex-col justify-between pointer-events-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase bg-red-950/80 px-2.5 py-1 rounded border border-red-800/60">
                    ENTERPRISE CATALOG TELEMETRY // HARDWARE MATRIX
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                  MULTI-COLOR MATRIX // RED • YELLOW • GREY • BLACK
                </span>
              </div>

              <div className="max-w-xl">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  Real-Time Component Bus Telemetry
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-1.5 leading-relaxed">
                  Live stock telemetry across enterprise and consumer component categories with automated architectural validation.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80 text-xs font-mono pointer-events-auto">
                <div className="flex items-center gap-4 text-neutral-400">
                  <span className="text-red-400 font-bold">● RED // ARCHITECTURE</span>
                  <span className="text-amber-400 font-bold">● YELLOW // GLITCH/BUS</span>
                  <span className="text-neutral-400 font-bold">● GREY // TELEMETRY</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/60 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  <span>Back to Top</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
