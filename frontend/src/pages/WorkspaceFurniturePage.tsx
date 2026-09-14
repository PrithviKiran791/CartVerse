import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Sparkles,
  ArrowUpDown,
  Maximize2,
  Info,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { BreadcrumbNav } from '../components/navigation/BreadcrumbNav';
import FadeContent from '../components/common/FadeContent';
import ShapeGrid from '../components/common/ShapeGrid';
import Topography from '../components/ui/Topography';
import { getComponentImage } from '../utils/assetRegistry';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../context/ThemeContext';
import {
  DESKS_DATA,
  CHAIRS_DATA,
  HARDWARE_CLEARANCE_RULES,
  DeskItem,
  ChairItem,
  toCartProduct,
} from '../data/workspaceFurnitureData';

type MainTab = 'all' | 'tables' | 'chairs';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'load-desc';

export const WorkspaceFurniturePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as MainTab) || 'all';
  const [activeTab, setActiveTab] = useState<MainTab>(
    initialTab === 'tables' || initialTab === 'chairs' ? initialTab : 'all'
  );
  const [subFilter, setSubFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedItem, setSelectedItem] = useState<{ item: DeskItem | ChairItem; category: 'table' | 'chair' } | null>(null);
  const [showClearanceGuide, setShowClearanceGuide] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();
  const { isDarkMode } = useTheme();

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSubFilter('all');
    setSearchParams(tab === 'all' ? {} : { tab });
  };

  const handleAddToCart = (item: DeskItem | ChairItem, category: 'table' | 'chair', e?: React.MouseEvent) => {
    e?.stopPropagation();
    const product = toCartProduct(item, category);
    addItem(product);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);

    addToast({
      title: 'Added to Cart',
      message: `${item.name} added to your build.`,
      type: 'success',
      duration: 3000,
    });
  };

  // Filtered lists
  const filteredDesks = useMemo(() => {
    if (activeTab === 'chairs') return [];
    return DESKS_DATA.filter((desk) => {
      if (subFilter === 'all') return true;
      if (subFilter === 'fixed') return desk.deskType === 'Fixed-Frame';
      if (subFilter === 'sit-stand') return desk.deskType === 'Motorized Sit-Stand';
      if (subFilter === 'l-shaped') return desk.deskType === 'L-Shaped Corner';
      return true;
    });
  }, [activeTab, subFilter]);

  const filteredChairs = useMemo(() => {
    if (activeTab === 'tables') return [];
    return CHAIRS_DATA.filter((chair) => {
      if (subFilter === 'all') return true;
      if (subFilter === 'mesh') return chair.chairType === 'Ergonomic Mesh';
      if (subFilter === 'bucket') return chair.chairType === 'Gaming Bucket';
      return true;
    });
  }, [activeTab, subFilter]);

  // Combined and sorted items
  const displayItems = useMemo(() => {
    const list: Array<{ item: DeskItem | ChairItem; category: 'table' | 'chair' }> = [
      ...filteredDesks.map((d) => ({ item: d, category: 'table' as const })),
      ...filteredChairs.map((c) => ({ item: c, category: 'chair' as const })),
    ];

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.item.price - b.item.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.item.price - a.item.price);
    } else if (sortBy === 'load-desc') {
      list.sort((a, b) => b.item.maxLoadKg - a.item.maxLoadKg);
    }
    return list;
  }, [filteredDesks, filteredChairs, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0A0A0C] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 relative pb-24">
      {/* Red Topography Elevation Lines Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-85 dark:opacity-80">
        <Topography
          lowColor="#800810"
          midColor="#E31B23"
          highColor="#FF4D5A"
          speed={0.35}
          morphAmount={3.0}
          morphSpeed={0.06}
          bands={6.0}
          thickness={0.03}
          scale={1.5}
          pixelSize={1}
          glow={0.8}
          colorMode="elevation"
          contrast={1.0}
          brightness={1.35}
          fillBands={false}
          opacity={0.85}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseRadius={0.35}
          mouseStrength={0.5}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Minimal Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: 'HOME', href: '/' },
            { label: 'CATALOG', href: '/products' },
            { label: 'WORKSPACE & SEATING' },
          ]}
        />

        {/* Minimal Header */}
        <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800/80 pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF1E2D] inline-block mb-1">
              Ergonomic Hardware
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Desks & Seating Setup
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Motorized sit-stand frames, corner battlestations, dynamic mesh task chairs, and esports recliners.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <span className="px-2.5 py-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70">
              {DESKS_DATA.length} Desks
            </span>
            <span className="px-2.5 py-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70">
              {CHAIRS_DATA.length} Chairs
            </span>
          </div>
        </div>

        {/* Top Control Bar: Minimal Switcher & Search */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Minimal Segmented Tab */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-200/70 dark:bg-neutral-900 border border-neutral-300/60 dark:border-neutral-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                All Setup ({DESKS_DATA.length + CHAIRS_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('tables')}
                className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                  activeTab === 'tables'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Tables & Desks ({DESKS_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('chairs')}
                className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                  activeTab === 'chairs'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Chairs & Seating ({CHAIRS_DATA.length})
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none focus:border-[#FF1E2D]"
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="load-desc">Max Load Capacity</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-neutral-400 uppercase mr-1 shrink-0">Type:</span>
            <button
              type="button"
              onClick={() => setSubFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                subFilter === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950'
                  : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              All Types
            </button>

            {activeTab !== 'chairs' && (
              <>
                <button
                  type="button"
                  onClick={() => setSubFilter('sit-stand')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    subFilter === 'sit-stand'
                      ? 'bg-[#FF1E2D] text-white'
                      : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Motorized Sit-Stand
                </button>
                <button
                  type="button"
                  onClick={() => setSubFilter('fixed')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    subFilter === 'fixed'
                      ? 'bg-[#FF1E2D] text-white'
                      : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Fixed-Frame
                </button>
                <button
                  type="button"
                  onClick={() => setSubFilter('l-shaped')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    subFilter === 'l-shaped'
                      ? 'bg-[#FF1E2D] text-white'
                      : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  L-Shaped Corner
                </button>
              </>
            )}

            {activeTab !== 'tables' && (
              <>
                <button
                  type="button"
                  onClick={() => setSubFilter('mesh')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    subFilter === 'mesh'
                      ? 'bg-[#FF1E2D] text-white'
                      : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Ergonomic Mesh
                </button>
                <button
                  type="button"
                  onClick={() => setSubFilter('bucket')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    subFilter === 'bucket'
                      ? 'bg-[#FF1E2D] text-white'
                      : 'bg-neutral-200/70 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Gaming Bucket Seat
                </button>
              </>
            )}
          </div>
        </div>

        {/* Minimal Product Grid */}
        <FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
          {displayItems.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30">
              <p className="text-sm font-semibold text-neutral-500">No matching models found.</p>
              <button
                type="button"
                onClick={() => {
                  setSubFilter('all');
                }}
                className="mt-3 text-xs font-bold text-[#FF1E2D] hover:underline"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayItems.map(({ item, category }) => {
                const isDesk = category === 'table';
                const desk = isDesk ? (item as DeskItem) : null;
                const chair = !isDesk ? (item as ChairItem) : null;
                const imgSrc = getComponentImage(item.imageSlug, isDesk ? 'table' : 'chair');

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem({ item, category })}
                    className="group relative flex flex-col bg-white dark:bg-[#121215] rounded-none border-2 border-neutral-900 dark:border-neutral-700 hover:border-[#FF1E2D] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-[6px_6px_0px_0px_#FF1E2D] transition-all duration-150 overflow-hidden cursor-pointer"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-950/60 p-5 flex items-center justify-center overflow-hidden border-b-2 border-neutral-900 dark:border-neutral-800">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Micro Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-neutral-900 text-neutral-100 border border-neutral-700 shadow-[2px_2px_0px_0px_#000000]">
                          {isDesk ? desk?.deskType : chair?.chairType}
                        </span>
                      </div>

                      {/* Brand Tag */}
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1E2D]">
                          // {item.brand}
                        </span>
                      </div>

                      {/* Quick Inspect Hover Icon */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <span className="p-1.5 rounded-none border border-neutral-900 bg-neutral-900 text-white text-xs flex items-center gap-1 shadow-[2px_2px_0px_0px_#FF1E2D]">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-mono">
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-[#FF1E2D] transition-colors">
                          {item.name}
                        </h3>

                        {/* Minimal Key Specifications */}
                        <div className="mt-2 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                          {isDesk ? (
                            <>
                              <p className="line-clamp-1">{desk?.dimensions}</p>
                              <p className="line-clamp-1">Max Load: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{desk?.maxLoadKg} kg</span></p>
                              {desk?.motorSpeed && (
                                <p className="line-clamp-1 text-emerald-600 dark:text-emerald-400 font-medium">{desk.motorSpeed}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="line-clamp-1">{chair?.materials}</p>
                              <p className="line-clamp-1">Capacity: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{chair?.maxLoadKg} kg</span> · {chair?.gasLift || chair?.baseCastors || 'Class 4'}</p>
                              <p className="line-clamp-1 text-sky-600 dark:text-sky-400 font-medium">{chair?.lumbarTech}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="pt-2 border-t-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-neutral-950 dark:text-white">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-neutral-400 uppercase">{item.priceRange}</p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(item, category, e)}
                          title="Add to Cart"
                          className={`p-2 rounded-none border-2 border-neutral-900 dark:border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                            addedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-100 hover:bg-[#FF1E2D] text-neutral-900 hover:text-white dark:bg-neutral-800 dark:hover:bg-[#FF1E2D] dark:text-neutral-200'
                          }`}
                        >
                          {addedId === item.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </FadeContent>

        {/* Collapsible Clearance & Ergonomic Guidelines Section */}
        <div className="mt-14 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#111015] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowClearanceGuide(!showClearanceGuide)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 text-[#FF1E2D]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Hardware Clearance & Ergonomic Selection Rules
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Critical rules for tabletop monitor depth, monitor arm clamping, motor weight limits, and frog tilt mechanisms.
                </p>
              </div>
            </div>
            {showClearanceGuide ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {showClearanceGuide && (
            <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {HARDWARE_CLEARANCE_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-[#15141b] border border-neutral-200 dark:border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#FF1E2D] uppercase tracking-wider">
                      {rule.category === 'desk' ? 'Desk Clearance' : 'Chair Ergonomics'}
                    </span>
                    <span className="text-[10px] text-neutral-400">Rule #{idx + 1}</span>
                  </div>
                  <h4 className="font-extrabold text-neutral-900 dark:text-white">
                    {rule.title}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {rule.summary}
                  </p>
                  <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 font-medium">
                    <span className="font-bold">Recommendation:</span> {rule.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Minimal Spec Details Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white dark:bg-[#121118] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-40 h-40 shrink-0 bg-neutral-100 dark:bg-neutral-950 p-3 rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                <img
                  src={getComponentImage(selectedItem.item.imageSlug, selectedItem.category)}
                  alt={selectedItem.item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF1E2D]">
                  {selectedItem.item.brand} · {selectedItem.category === 'table' ? 'Desk Specification' : 'Ergonomic Seating'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                  {selectedItem.item.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-xs font-black text-[#FF1E2D] bg-[#FF1E2D]/10 px-2.5 py-1 rounded-lg">
                    ₹{selectedItem.item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Est. Range: {selectedItem.item.priceRange}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Spec Sheet */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                Technical Blueprint
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedItem.category === 'table' ? (
                  <>
                    {(() => {
                      const d = selectedItem.item as DeskItem;
                      return (
                        <>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">DIMENSIONS</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{d.dimensions}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">MAX LOAD CAPACITY</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{d.maxLoadKg} kg</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 sm:col-span-2">
                            <span className="text-neutral-400 block text-[10px]">TABLETOP & FRAME MATERIALS</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{d.materials}</span>
                          </div>
                          {d.motorSpeed && (
                            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                              <span className="text-neutral-400 block text-[10px]">MOTOR SYSTEM</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{d.motorSpeed}</span>
                            </div>
                          )}
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">TARGET RIG PROFILE</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{d.targetRig}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 sm:col-span-2">
                            <span className="text-neutral-400 block text-[10px] mb-1">INTEGRATED FEATURES</span>
                            <div className="flex flex-wrap gap-1.5">
                              {d.features.map((f, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px]">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const c = selectedItem.item as ChairItem;
                      return (
                        <>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 sm:col-span-2">
                            <span className="text-neutral-400 block text-[10px]">UPHOLSTERY & SEAT MATERIAL</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{c.materials}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">LUMBAR & HEADREST</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{c.lumbarTech}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">ARMRESTS</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{c.armrests}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">RECLINE & MECHANISM</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{c.mechanism}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="text-neutral-400 block text-[10px]">WEIGHT RATING</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{c.maxLoadKg} kg ({c.gasLift || c.baseCastors || 'Class 4'})</span>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 flex items-center justify-end gap-3">
              {selectedItem.item.link && (
                <a
                  href={selectedItem.item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Official Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  handleAddToCart(selectedItem.item, selectedItem.category);
                  setSelectedItem(null);
                  openCart();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF1E2D] hover:bg-[#FF3B48] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceFurniturePage;
