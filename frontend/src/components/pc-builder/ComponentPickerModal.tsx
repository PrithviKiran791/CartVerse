import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, AlertCircle, ShieldCheck, Filter, ArrowUpDown } from 'lucide-react';
import { BuilderSlotKey, Product, ComponentCategory } from '../../types/hardware';
import { mockProducts } from '../../data/mockProducts';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { isComponentCompatibleWithBuild } from '../../utils/compatibilityEngine';

interface ComponentPickerModalProps {
  slotKey: BuilderSlotKey | null;
  onClose: () => void;
}

export const ComponentPickerModal: React.FC<ComponentPickerModalProps> = ({ slotKey, onClose }) => {
  const { build, setSlot, showOnlyCompatible, toggleShowOnlyCompatible } = usePCBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  if (!slotKey) return null;

  // Map slot key to mock product category
  const getCategoryForSlot = (key: BuilderSlotKey): ComponentCategory[] => {
    switch (key) {
      case 'cpu':
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
      case 'monitor':
        return ['monitor'];
      case 'keyboard':
        return ['keyboard'];
      case 'mouse':
        return ['mouse'];
      case 'headphones':
        return ['headphones', 'speakers'];
      default:
        return ['cpu'];
    }
  };

  const categories = getCategoryForSlot(slotKey);

  // Filter candidates for this slot
  const candidateProducts = useMemo(() => {
    return mockProducts.filter((p) => categories.includes(p.category));
  }, [categories]);

  // Check compatibility & search filtering
  const processedProducts = useMemo(() => {
    return candidateProducts
      .map((product) => {
        const comp = isComponentCompatibleWithBuild(product, slotKey, build);
        return {
          product,
          isCompatible: comp.isCompatible,
          reason: comp.reason,
        };
      })
      .filter(({ product, isCompatible }) => {
        // Compatibility filter
        if (showOnlyCompatible && !isCompatible) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            (product.tags && product.tags.some((t) => t.toLowerCase().includes(q)));
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

  const handleSelect = (product: Product) => {
    setSlot(slotKey, product);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <div>
              <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider font-bold">
                CartVerse Configurator
              </div>
              <h2 className="text-xl font-black text-white capitalize mt-0.5">
                Choose {slotKey.replace(/([A-Z])/g, ' $1')}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-800/80 bg-neutral-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Search ${slotKey} models, brands, specs...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Compatibility toggle & sort */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <button
                onClick={toggleShowOnlyCompatible}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  showOnlyCompatible
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Compatible Only</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-700">
                  {showOnlyCompatible ? 'ON' : 'OFF'}
                </span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Component List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
            {processedProducts.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Matching Hardware Available</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {showOnlyCompatible
                    ? 'All catalog parts in this category have socket or clearance conflicts with your selected parts. Toggle "Compatible Only" off to inspect conflicting models.'
                    : 'No products match your search query.'}
                </p>
              </div>
            ) : (
              processedProducts.map(({ product, isCompatible, reason }) => {
                const imgUrl = getComponentImage(product.imageSlug, product.category);
                const isCurrent = build[slotKey]?.id === product.id;

                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-red-950/30 border-red-500'
                        : isCompatible
                        ? 'bg-neutral-950/60 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700'
                        : 'bg-neutral-950/30 border-neutral-850 opacity-60'
                    }`}
                  >
                    {/* Thumbnail & specs */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-neutral-900 p-1 flex items-center justify-center shrink-0 border border-neutral-800">
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                            {product.brand}
                          </span>
                          {product.bestSeller && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {product.name}
                        </h4>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {product.specs.socket && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-cyan-300 px-2 py-0.5 rounded">
                              {product.specs.socket}
                            </span>
                          )}
                          {product.specs.ramType && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-purple-300 px-2 py-0.5 rounded">
                              {product.specs.ramType}
                            </span>
                          )}
                          {product.specs.vram && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-emerald-300 px-2 py-0.5 rounded">
                              {product.specs.vram}
                            </span>
                          )}
                          {product.specs.capacity && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-amber-300 px-2 py-0.5 rounded">
                              {product.specs.capacity}
                            </span>
                          )}
                          {product.specs.wattage && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-yellow-300 px-2 py-0.5 rounded">
                              {formatWattage(product.specs.wattage)}
                            </span>
                          )}
                          {product.specs.tdp && (
                            <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                              {formatWattage(product.specs.tdp)} TDP
                            </span>
                          )}
                        </div>

                        {!isCompatible && reason && (
                          <div className="text-[11px] text-red-400 font-mono mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>Conflict: {reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Choose Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-black font-mono text-white">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-[10px] text-neutral-500 block font-mono">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelect(product)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Choose</span>
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

export default ComponentPickerModal;
