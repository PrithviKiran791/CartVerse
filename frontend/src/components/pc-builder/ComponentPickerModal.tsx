import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, AlertCircle, ShieldCheck, Filter, ArrowUpDown, Cpu } from 'lucide-react';
import { BuilderSlotKey, Product, ComponentCategory } from '../../types/hardware';
import { mockProducts } from '../../data/mockProducts';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { isComponentCompatibleWithBuild } from '../../utils/compatibilityEngine';
import { useToastStore } from '../../store/useToastStore';
import CloseButton from '../ui/CloseButton';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { HardwareIcon } from '../../utils/hardwareIcons';

interface ComponentPickerModalProps {
  slotKey: BuilderSlotKey | null;
  onClose: () => void;
}

export const ComponentPickerModal: React.FC<ComponentPickerModalProps> = ({ slotKey, onClose }) => {
  const { build, setSlot, showOnlyCompatible, toggleShowOnlyCompatible } = usePCBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Map slot key to mock product category
  const getCategoryForSlot = (key: BuilderSlotKey | null): ComponentCategory[] => {
    if (!key) return [];
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

  const categories = useMemo(() => getCategoryForSlot(slotKey), [slotKey]);

  // Filter candidates for this slot
  const candidateProducts = useMemo(() => {
    if (!slotKey || categories.length === 0) return [];
    return mockProducts.filter((p) => categories.includes(p.category) && p.productClass !== 'server');
  }, [categories, slotKey]);

  // Check compatibility & search filtering
  const processedProducts = useMemo(() => {
    if (!slotKey) return [];
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

  const handleSelect = (product: Product, isCompatible: boolean, reason?: string) => {
    if (!slotKey) return;
    setSlot(slotKey, product);
    if (!isCompatible && reason) {
      useToastStore.getState().warning(`Added ${product.name} with warning: ${reason}`);
    } else {
      useToastStore.getState().success(`Selected ${product.name} for ${slotKey.toUpperCase()} slot.`);
    }
    onClose();
  };

  if (!slotKey) return null;

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
          className="relative w-full max-w-4xl bg-neutral-950 border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 rounded-none sm:rounded-md shadow-[10px_10px_0px_0px_#000000] dark:shadow-[10px_10px_0px_0px_#FF1E2D] overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b-2 border-neutral-900 dark:border-neutral-800 flex items-center justify-between bg-neutral-950 font-mono">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-none bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#FF1E2D] flex items-center justify-center p-2 shrink-0">
                <HardwareIcon
                  name={slotKey}
                  className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  fallback={<Cpu className="w-6 h-6 text-red-500" />}
                />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#FF1E2D] uppercase tracking-wider font-bold">
                  // SYS.CONFIGURATOR // HARDWARE_SELECTION
                </div>
                <h2 className="text-xl font-black text-white capitalize font-mono mt-0.5">
                  Choose {slotKey.replace(/([A-Z])/g, ' $1')}
                </h2>
              </div>
            </div>

            <CloseButton onClick={onClose} size="lg" variant="flat" />
          </div>

          {/* Controls bar */}
          <div className="p-4 sm:p-5 border-b-2 border-neutral-900 dark:border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Search ${slotKey} models, brands, specs...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-none pl-10 pr-4 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-500 outline-none focus:border-[#FF1E2D]"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Compatibility toggle & sort */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <button
                onClick={toggleShowOnlyCompatible}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                  showOnlyCompatible
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Compatible Only</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-neutral-950 border border-neutral-700">
                  {showOnlyCompatible ? 'ON' : 'OFF'}
                </span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-neutral-900 border-2 border-neutral-800 text-neutral-300 text-xs font-mono rounded-none px-3 py-2 outline-none focus:border-[#FF1E2D] cursor-pointer"
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
              <div className="p-12 text-center text-neutral-400 font-mono">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">// NO_MATCHING_HARDWARE</h4>
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
                    className={`p-4 rounded-none border-2 font-mono transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D] ${
                      isCurrent
                        ? 'bg-[#FF1E2D]/15 border-[#FF1E2D]'
                        : isCompatible
                        ? 'bg-neutral-950 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        : 'bg-neutral-950/40 border-neutral-850 opacity-60'
                    }`}
                  >
                    {/* Thumbnail & specs */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-none bg-neutral-900 p-1 flex items-center justify-center shrink-0 border-2 border-neutral-800">
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                            // {product.brand}
                          </span>
                          {product.bestSeller && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 rounded-none border border-amber-500/30">
                              BEST_SELLER
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold font-mono text-white truncate">
                          {product.name}
                        </h4>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono">
                          {product.specs.socket && (
                            <span className="text-[10px] bg-neutral-900 text-cyan-300 px-2 py-0.5 rounded-none border border-neutral-800">
                              {product.specs.socket}
                            </span>
                          )}
                          {product.specs.ramType && (
                            <span className="text-[10px] bg-neutral-900 text-purple-300 px-2 py-0.5 rounded-none border border-neutral-800">
                              {product.specs.ramType}
                            </span>
                          )}
                          {product.specs.vram && (
                            <span className="text-[10px] bg-neutral-900 text-emerald-300 px-2 py-0.5 rounded-none border border-neutral-800">
                              {product.specs.vram}
                            </span>
                          )}
                          {product.specs.capacity && (
                            <span className="text-[10px] bg-neutral-900 text-amber-300 px-2 py-0.5 rounded-none border border-neutral-800">
                              {product.specs.capacity}
                            </span>
                          )}
                          {product.specs.wattage && (
                            <span className="text-[10px] bg-neutral-900 text-yellow-300 px-2 py-0.5 rounded-none border border-neutral-800">
                              {formatWattage(product.specs.wattage)}
                            </span>
                          )}
                          {product.specs.tdp && (
                            <span className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded-none border border-neutral-800">
                              {formatWattage(product.specs.tdp)} TDP
                            </span>
                          )}
                        </div>

                        {!isCompatible && reason && (
                          <div className="text-[11px] text-red-400 font-mono mt-1 flex items-center gap-1 font-bold">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>CONFLICT: {reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Choose Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800 font-mono">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-black text-white">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-[10px] text-neutral-500 block uppercase">
                          STOCK: {product.stock}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelect(product, isCompatible, reason)}
                        className={`text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer rounded-none border-2 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${
                          isCurrent
                            ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                            : 'bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-neutral-900 dark:border-white'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Current</span>
                          </>
                        ) : (
                          <span>Select Part</span>
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
