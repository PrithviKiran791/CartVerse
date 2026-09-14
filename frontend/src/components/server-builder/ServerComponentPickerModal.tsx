import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, AlertCircle, ShieldCheck, Filter, ArrowUpDown, Cpu } from 'lucide-react';
import { ServerSlotKey, Product, ComponentCategory } from '../../types/hardware';
import { mockProducts } from '../../data/mockProducts';
import { useServerBuilderStore } from '../../store/useServerBuilderStore';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { isServerComponentCompatibleWithBuild } from '../../utils/compatibilityEngine';
import CloseButton from '../ui/CloseButton';
import { HardwareIcon } from '../../utils/hardwareIcons';

interface ServerComponentPickerModalProps {
  slotKey: ServerSlotKey | null;
  onClose: () => void;
}

export const ServerComponentPickerModal: React.FC<ServerComponentPickerModalProps> = ({
  slotKey,
  onClose,
}) => {
  const { build, setSlot, showOnlyCompatible, toggleShowOnlyCompatible } =
    useServerBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Map slot key to candidate categories
  const getCategoryForSlot = (key: ServerSlotKey | null): ComponentCategory[] => {
    if (!key) return [];
    switch (key) {
      case 'cpu':
      case 'cpu2':
        return ['cpu'];
      case 'motherboard':
        return ['motherboard'];
      case 'ram':
        return ['ram'];
      case 'gpu':
        return ['gpu'];
      case 'primaryStorage':
      case 'secondaryStorage':
        return ['ssd', 'hdd'];
      case 'psu':
        return ['psu'];
      case 'cabinet':
        return ['cabinet'];
      case 'cooler':
        return ['cooler'];
      case 'networkCard':
      case 'raidController':
        return ['cables', 'server']; // accessories / controllers
      default:
        return ['server'];
    }
  };

  const categories = useMemo(() => getCategoryForSlot(slotKey), [slotKey]);

  // Candidate products: prefer server-class products; for storage/cooling, include enterprise-capable items
  const candidateProducts = useMemo(() => {
    if (!slotKey || categories.length === 0) return [];
    return mockProducts.filter((p) => {
      if (!categories.includes(p.category)) return false;
      // For CPU, motherboard, RAM, chassis, GPU, PSU in Server Configurator, strictly require server products or ECC/enterprise tags
      if (['cpu', 'cpu2', 'motherboard', 'ram', 'cabinet', 'psu'].includes(slotKey)) {
        return (
          p.productClass === 'server' ||
          p.specs.socket === 'SP5' ||
          p.specs.socket === 'SP3' ||
          p.specs.socket === 'LGA4677' ||
          p.eccSupport === true ||
          p.memoryType === 'RDIMM' ||
          p.memoryType === 'LRDIMM' ||
          p.rackUnits !== undefined
        );
      }
      return true;
    });
  }, [categories, slotKey]);

  // Run real-time compatibility checks & search filtering
  const processedProducts = useMemo(() => {
    if (!slotKey) return [];
    return candidateProducts
      .map((product) => {
        const comp = isServerComponentCompatibleWithBuild(product, slotKey, build);
        return {
          product,
          isCompatible: comp.isCompatible,
          reason: comp.reason,
        };
      })
      .filter(({ product, isCompatible }) => {
        if (showOnlyCompatible && !isCompatible) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            (product.tags && product.tags.some((t) => t.toLowerCase().includes(q))) ||
            (product.specs.socket && product.specs.socket.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.product.price - b.product.price;
        if (sortBy === 'price-desc') return b.product.price - a.product.price;
        if (sortBy === 'rating') return b.product.rating - a.product.rating;
        return (b.product.featured ? 1 : 0) - (a.product.featured ? 1 : 0);
      });
  }, [candidateProducts, slotKey, build, showOnlyCompatible, searchQuery, sortBy]);

  if (!slotKey) return null;

  const handleSelect = (product: Product) => {
    setSlot(slotKey, product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between gap-4 bg-neutral-950/60">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 shrink-0 shadow-inner">
                <HardwareIcon
                  name={slotKey === 'cpu2' ? 'cpu' : (slotKey || '')}
                  className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  fallback={<Cpu className="w-6 h-6 text-red-500" />}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
                    Infrastructure Component Selection
                  </span>
                  <span className="text-xs font-sans text-neutral-400">
                    Slot: <strong className="text-white uppercase">{slotKey}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Select Compatible Server Hardware
                </h2>
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </div>

          {/* Search, Filter Bar & Sort Controls */}
          <div className="p-4 sm:p-6 border-b border-neutral-800 bg-neutral-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search server SKU, socket (SP5, LGA4677), RDIMM..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 transition-colors"
              />
            </div>

            {/* Filter Toggle & Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleShowOnlyCompatible}
                className={`px-3 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all border ${
                  showOnlyCompatible
                    ? 'bg-red-950/80 border-red-600 text-red-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Compatible Only</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-red-500/60"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
            {processedProducts.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-neutral-300">
                  No matching server components
                </h4>
                <p className="text-xs text-neutral-500 mt-1 font-sans">
                  {showOnlyCompatible
                    ? 'Try turning off the "Compatible Only" filter to inspect rejected hardware specs.'
                    : 'Try broadening your search query.'}
                </p>
              </div>
            ) : (
              processedProducts.map(({ product, isCompatible, reason }) => {
                const img = getComponentImage(product.imageSlug, product.category);
                const isSelected =
                  build[slotKey]?.id === product.id;

                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-neutral-950 border-red-500 shadow-md shadow-red-950/40'
                        : isCompatible
                        ? 'bg-neutral-950/70 border-neutral-800/90 hover:border-neutral-700'
                        : 'bg-red-950/15 border-red-900/40 opacity-80'
                    }`}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-neutral-900 p-1 border border-neutral-800 shrink-0 flex items-center justify-center">
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-sans font-bold text-neutral-400">
                            {product.brand}
                          </span>
                          {product.specs.socket && (
                            <span className="text-[9px] font-sans px-1.5 py-0.2 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                              {product.specs.socket}
                            </span>
                          )}
                          {product.memoryType && (
                            <span className="text-[9px] font-sans px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded border border-purple-800/50">
                              {product.memoryType} ECC
                            </span>
                          )}
                          {product.rackUnits && (
                            <span className="text-[9px] font-sans px-1.5 py-0.2 bg-neutral-800 text-neutral-200 rounded border border-neutral-700">
                              {product.rackUnits}U Rack
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white tracking-tight truncate">
                          {product.name}
                        </h4>

                        <p className="text-xs text-neutral-400 font-sans mt-0.5 line-clamp-1">
                          {product.description}
                        </p>

                        {/* Incompatibility reason callout */}
                        {!isCompatible && reason && (
                          <div className="mt-2 text-[11px] font-sans text-red-400 bg-red-950/60 p-2 rounded-lg border border-red-900/60 flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Selection */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2">
                      <span className="text-base font-black font-sans text-white">
                        {formatCurrency(product.price)}
                      </span>

                      <button
                        disabled={!isCompatible}
                        onClick={() => handleSelect(product)}
                        className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white cursor-default'
                            : isCompatible
                            ? 'bg-red-600 hover:bg-red-500 text-white active:scale-95 shadow-lg shadow-red-950/50'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Configured</span>
                          </>
                        ) : isCompatible ? (
                          <span>Select Component</span>
                        ) : (
                          <span>Incompatible</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
