import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cpu,
  Zap,
  Gauge,
  Layers,
  Flame,
  Activity,
  MemoryStick,
  Monitor,
  Info,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import { getComponentImage } from '../../utils/assetRegistry';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { useUIStore } from '../../store/useUIStore';
import { useNavigate } from 'react-router-dom';

interface IntelSpecsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IntelSpecsModal: React.FC<IntelSpecsModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();

  if (!isOpen || !product || !product.specs.intelSpecs) return null;

  const intel = product.specs.intelSpecs;
  const imgUrl = getComponentImage(product.imageSlug, product.category);

  const handleAddToCart = () => {
    addItem(product, 1);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} added to your shopping cart.`,
    });
    onClose();
  };

  const handleAddToBuilder = () => {
    setSlot('cpu', product);
    addToast({
      type: 'success',
      title: 'Slot Assigned in PC Builder',
      message: `${product.name} selected as your CPU.`,
    });
    onClose();
    navigate('/builder');
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
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-40"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-50 w-full max-w-4xl bg-neutral-950 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/40 overflow-hidden my-8"
        >
          {/* Top Decorative Intel Cyan Glow Header */}
          <div className="relative bg-gradient-to-r from-blue-950 via-neutral-900 to-cyan-950 border-b border-cyan-500/30 p-6 sm:p-8 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
              {/* Product Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900/90 border border-cyan-500/30 p-2 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Title & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Intel Official Specification
                  </span>
                  <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {intel.generation}
                  </span>
                  <span className="bg-neutral-800 text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    Tier: {intel.tier}
                  </span>
                  <span className="bg-neutral-800 text-cyan-400 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    Suffix: {intel.suffix}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {intel.exactModel}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 mt-1">
                  <span>Architecture Codename:</span>
                  <span className="font-bold text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                    {intel.codename}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body: 17 Detailed Specifications */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* 1. Core Architecture Matrix */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Microarchitecture & Core Matrix</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-900/90 border border-cyan-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Total Cores</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                    {intel.totalCores}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Physical Compute Units</div>
                </div>

                <div className="bg-neutral-900/90 border border-blue-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">P-Cores</div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                    {intel.pCores}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Performance Cores</div>
                </div>

                <div className="bg-neutral-900/90 border border-indigo-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">E / LPE Cores</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                    {intel.eCores}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Efficient / Low-Power</div>
                </div>

                <div className="bg-neutral-900/90 border border-cyan-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Total Threads</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {intel.threads}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Parallel Workflows</div>
                </div>
              </div>
            </div>

            {/* 2. Frequency & Cache Profile */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Clock Frequencies & Smart Cache</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Base Clock (P-Core)</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">{intel.baseClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Sustained base operation</div>
                </div>

                <div className="bg-neutral-900/70 border border-cyan-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl" />
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Max Turbo Frequency</div>
                  <div className="text-xl font-black text-cyan-300 font-mono mt-1">{intel.turboClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Intel Turbo Boost Max</div>
                </div>

                <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">L3 Cache Pool</div>
                  <div className="text-lg font-bold text-amber-300 font-mono mt-1">{intel.l3Cache}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Shared Intel Smart Cache</div>
                </div>
              </div>
            </div>

            {/* 3. Power, Thermals & Platform */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>Power Envelope, Graphics & Memory</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Power details */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Processor Base Power (TDP)</span>
                    <span className="font-mono font-bold text-yellow-400 text-sm">{intel.baseTdp}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Max Turbo Power (PL2)</span>
                    <span className="font-mono font-bold text-orange-400 text-sm">{intel.maxTurboPowerPl2}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Motherboard Socket</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{product.specs.socket || 'LGA1700'}</span>
                  </div>
                </div>

                {/* Memory & GPU details */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Integrated Graphics (iGPU)
                    </span>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{intel.igpu}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Supported Memory Channels & Types
                    </span>
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{intel.memorySupport}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Architectural Context & Key Notes */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-5 relative">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                <Info className="w-4 h-4" />
                <span>Architectural Role & Platform Engineering Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {intel.architecturalNotes}
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black font-mono text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleAddToBuilder}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Assign to Build</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer"
                title="View Full Product Page"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IntelSpecsModal;
