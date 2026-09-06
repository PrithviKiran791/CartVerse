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
  Bot,
} from 'lucide-react';
import { Product } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import { getComponentImage } from '../../utils/assetRegistry';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { useUIStore } from '../../store/useUIStore';
import { useNavigate } from 'react-router-dom';

interface AMDRyzenSpecsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AMDRyzenSpecsModal: React.FC<AMDRyzenSpecsModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();

  if (!isOpen || !product || !product.specs.ryzenSpecs) return null;

  const ryzen = product.specs.ryzenSpecs;
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

  const isX3D = ryzen.suffix.includes('X3D') || ryzen.l3Cache.includes('3D V-Cache');

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
          className="relative z-50 w-full max-w-4xl bg-neutral-950 border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/40 overflow-hidden my-8"
        >
          {/* Top Decorative AMD Orange/Red Glow Header */}
          <div className="relative bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 border-b border-orange-500/30 p-6 sm:p-8 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
              {/* Product Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900/90 border border-orange-500/30 p-2 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Title & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    AMD Ryzen Architecture
                  </span>
                  <span className="bg-orange-950/80 border border-orange-500/40 text-orange-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {ryzen.architecture}
                  </span>
                  <span className="bg-neutral-800 text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    {ryzen.generation}
                  </span>
                  {isX3D && (
                    <span className="bg-rose-950 text-rose-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40">
                      AMD 3D V-Cache™
                    </span>
                  )}
                  <span className="bg-neutral-800 text-amber-400 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    Node: {ryzen.processNode}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AMD {ryzen.modelName}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-orange-400 mt-1">
                  <span>Codename:</span>
                  <span className="font-bold text-white bg-orange-950 px-2 py-0.5 rounded border border-orange-800/50">
                    {ryzen.codename}
                  </span>
                  <span>•</span>
                  <span>Platform:</span>
                  <span className="text-neutral-300">{ryzen.platform}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body: 19 Detailed Specifications */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* 1. Core Architecture Matrix */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4 text-orange-400" />
                <span>Compute Topology & Core Complex</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-900/90 border border-orange-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Total Cores</div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                    {ryzen.totalCores}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Physical Compute Units</div>
                </div>

                <div className="bg-neutral-900/90 border border-amber-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Core Breakdown</div>
                  <div className="text-lg sm:text-xl font-bold text-amber-300 font-mono truncate">
                    {ryzen.coreBreakdown}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Zen Microarchitecture</div>
                </div>

                <div className="bg-neutral-900/90 border border-red-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Threads</div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                    {ryzen.threads}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Simultaneous Multi-Threading</div>
                </div>

                <div className="bg-neutral-900/90 border border-purple-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">AI Engine / NPU</div>
                  <div className="text-sm font-bold text-purple-300 font-mono truncate mt-1">
                    {ryzen.npu !== 'None' ? ryzen.npu.split('(')[0].trim() : 'Standard'}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    {ryzen.npu.includes('TOPS') ? ryzen.npu.split('(')[1]?.replace(')', '') : 'CPU-based inference'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Frequency & Cache Profile */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-3">
                <Gauge className="w-4 h-4 text-orange-400" />
                <span>Clock Frequencies & L3 Cache (3D V-Cache)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Base Clock</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">{ryzen.baseClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Sustained base all-core</div>
                </div>

                <div className="bg-neutral-900/70 border border-orange-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl" />
                  <div className="text-[10px] font-mono text-orange-400 uppercase font-bold">Max Boost Clock</div>
                  <div className="text-xl font-black text-orange-300 font-mono mt-1">{ryzen.boostClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Precision Boost 2 Overdrive</div>
                </div>

                <div className={`rounded-2xl p-4 border ${
                  isX3D
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : 'bg-neutral-900/70 border-neutral-800'
                }`}>
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">L3 Cache Pool</div>
                  <div className="text-lg font-bold font-mono mt-1 text-amber-300">{ryzen.l3Cache}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {isX3D ? 'High-density stacked 3D V-Cache' : 'Unified on-die L3 cache'}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Power, Platform & Memory */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Thermal Envelope, Platform & Memory</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Power details */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Thermal Design Power (TDP / cTDP)</span>
                    <span className="font-mono font-bold text-yellow-400 text-sm">{ryzen.tdp}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Motherboard Socket</span>
                    <span className="font-mono font-bold text-orange-400 text-sm">{product.specs.socket || 'AM5'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Lithography / Process Node</span>
                    <span className="font-mono font-bold text-neutral-300 text-sm">{ryzen.processNode}</span>
                  </div>
                </div>

                {/* Memory & GPU details */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Integrated Graphics Engine
                    </span>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{ryzen.igpu}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Supported Memory Channels
                    </span>
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{ryzen.memorySupport}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Architectural Notes */}
            <div className="bg-orange-950/20 border border-orange-500/30 rounded-2xl p-5 relative">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-2">
                <Info className="w-4 h-4" />
                <span>Architectural Innovations & Engineering Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {ryzen.architecturalNotes}
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
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 transition-all cursor-pointer"
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

export default AMDRyzenSpecsModal;
