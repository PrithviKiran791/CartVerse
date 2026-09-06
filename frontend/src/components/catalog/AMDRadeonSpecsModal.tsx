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
  Tv,
  Film,
} from 'lucide-react';
import { Product } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import { getComponentImage } from '../../utils/assetRegistry';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { useUIStore } from '../../store/useUIStore';
import { useNavigate } from 'react-router-dom';

interface AMDRadeonSpecsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AMDRadeonSpecsModal: React.FC<AMDRadeonSpecsModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();

  if (!isOpen || !product || !product.specs.radeonSpecs) return null;

  const radeon = product.specs.radeonSpecs;
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
    setSlot('gpu', product);
    addToast({
      type: 'success',
      title: 'Slot Assigned in PC Builder',
      message: `${product.name} selected as your GPU.`,
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
          className="relative z-50 w-full max-w-4xl bg-neutral-950 border border-red-500/40 rounded-3xl shadow-2xl shadow-red-950/40 overflow-hidden my-8"
        >
          {/* Top Decorative AMD Crimson Red Header */}
          <div className="relative bg-gradient-to-r from-red-950 via-neutral-900 to-rose-950 border-b border-red-500/30 p-6 sm:p-8 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
              {/* Product Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900/90 border border-red-500/30 p-2 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Title & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    AMD Radeon Official Specification
                  </span>
                  <span className="bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {radeon.architecture}
                  </span>
                  <span className="bg-neutral-800 text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    {radeon.series}
                  </span>
                  <span className="bg-neutral-800 text-amber-400 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    Node: {radeon.processNode}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AMD {radeon.modelName}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-red-400 mt-1">
                  <span>GPU Silicon:</span>
                  <span className="font-bold text-white bg-red-950 px-2 py-0.5 rounded border border-red-800/50">
                    {radeon.gpuCodename}
                  </span>
                  <span>•</span>
                  <span>Segment:</span>
                  <span className="text-neutral-300">{radeon.marketSegment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body: 23 Detailed Specifications */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* 1. Compute & Ray Tracing Engine */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-3">
                <Activity className="w-4 h-4 text-red-400" />
                <span>Compute Array & Hardware Raytracing Accelerators</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-900/90 border border-red-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Compute Units</div>
                  <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
                    {radeon.computeUnits}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Dual-Issue CUs</div>
                </div>

                <div className="bg-neutral-900/90 border border-rose-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Stream Processors</div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">
                    {radeon.streamProcessors}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Shading Cores</div>
                </div>

                <div className="bg-neutral-900/90 border border-amber-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Ray Accelerators</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {radeon.rayAccelerators}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Real-Time BVH Engine</div>
                </div>

                <div className="bg-neutral-900/90 border border-purple-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">AI Accelerators</div>
                  <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
                    {radeon.aiAccelerators}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Matrix Math Units</div>
                </div>
              </div>
            </div>

            {/* 2. Clock Frequencies & Rasterization */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-3">
                <Gauge className="w-4 h-4 text-red-400" />
                <span>Clock Frequencies & Rasterization Profiles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Base Clock</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">{radeon.baseClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Sustained minimum frequency</div>
                </div>

                <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Game Clock</div>
                  <div className="text-lg font-bold text-emerald-300 font-mono mt-1">{radeon.gameClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Typical gaming workload target</div>
                </div>

                <div className="bg-neutral-900/70 border border-red-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl" />
                  <div className="text-[10px] font-mono text-red-400 uppercase font-bold">Max Boost Clock</div>
                  <div className="text-xl font-black text-red-300 font-mono mt-1">{radeon.boostClock}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Peak burst rendering speed</div>
                </div>
              </div>
            </div>

            {/* 3. VRAM, Memory Bus & Infinity Cache */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-3">
                <MemoryStick className="w-4 h-4 text-red-400" />
                <span>VRAM Configuration & AMD Infinity Cache™</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">VRAM Capacity</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">{radeon.vram}</div>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Memory Bus Width</div>
                  <div className="text-lg font-bold text-amber-300 font-mono mt-1">{radeon.memoryBusWidth}</div>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Memory Bandwidth</div>
                  <div className="text-lg font-bold text-cyan-300 font-mono mt-1">{radeon.memoryBandwidth}</div>
                </div>

                <div className="bg-neutral-900/80 border border-rose-500/30 rounded-2xl p-4">
                  <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">Infinity Cache</div>
                  <div className="text-lg font-black text-rose-300 font-mono mt-1">{radeon.infinityCache}</div>
                </div>
              </div>
            </div>

            {/* 4. Power, Platform & Media Subsystem */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Power Rating, Display Outputs & Media Engine</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Power & Interface */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Total Board Power (TBP)</span>
                    <span className="font-mono font-bold text-yellow-400 text-sm">{radeon.boardPowerTbp}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">PCIe Host Interface</span>
                    <span className="font-mono font-bold text-white text-sm">{radeon.pcieInterface}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">API Support Standards</span>
                    <span className="font-mono font-bold text-rose-300 text-xs">{radeon.apiSupport}</span>
                  </div>
                </div>

                {/* Display & Media Engine */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Display Output Standards
                    </span>
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{radeon.displayOutputs}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Hardware Video Codec Engine
                    </span>
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-neutral-200">{radeon.mediaEngine}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Architectural Innovations */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 relative">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-2">
                <Info className="w-4 h-4" />
                <span>Architectural Innovations & Key Technical Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {radeon.architecturalNotes}
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
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
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

export default AMDRadeonSpecsModal;
