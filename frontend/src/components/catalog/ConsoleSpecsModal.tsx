import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gamepad2,
  Cpu,
  Tv,
  HardDrive,
  Calendar,
  Sparkles,
  Info,
  ShoppingCart,
  CheckCircle,
  Tag,
  ShieldCheck,
  Disc
} from 'lucide-react';
import { Product } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import { getComponentImage } from '../../utils/assetRegistry';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

interface ConsoleSpecsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsoleSpecsModal: React.FC<ConsoleSpecsModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  if (!isOpen || !product || !product.specs?.consoleSpecs) return null;

  const cs = product.specs.consoleSpecs;
  const imgUrl = getComponentImage(product.imageSlug, product.category);

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'nintendo':
        return 'from-red-600 to-rose-500 text-red-400 border-red-500/30';
      case 'sony':
      case 'playstation':
        return 'from-blue-600 to-cyan-500 text-blue-400 border-blue-500/30';
      case 'xbox':
      case 'microsoft':
        return 'from-emerald-600 to-green-500 text-emerald-400 border-emerald-500/30';
      default:
        return 'from-purple-600 to-indigo-500 text-purple-400 border-purple-500/30';
    }
  };

  const brandColorClass = getBrandColor(cs.brand || product.brand);

  const handleAddToCart = () => {
    addItem(product, 1);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} added to your shopping cart.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0E0C13] border-2 sm:border-[3px] border-neutral-700 rounded-none shadow-[10px_10px_0px_0px_#FF1E2D] overflow-hidden flex flex-col text-neutral-100"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-neutral-800 bg-neutral-950">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 shadow-[2px_2px_0px_0px_#000000] bg-gradient-to-r ${brandColorClass}`}>
                {cs.brand || product.brand}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide uppercase font-sans truncate max-w-md">
                {product.name}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border-2 border-neutral-700 hover:border-[#FF1E2D] rounded-none transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Top Showcase Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-neutral-950 p-6 rounded-none border-2 border-neutral-800 shadow-[4px_4px_0px_0px_#000000]">
              <div className="md:col-span-1 flex justify-center items-center h-48 bg-neutral-900/50 rounded-none border-2 border-neutral-800 p-3">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="max-h-44 max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-neutral-400 uppercase">
                  <Calendar className="w-4 h-4 text-[#FF1E2D]" />
                  <span>Release Year: <strong className="text-white font-mono">{cs.releaseYear}</strong></span>
                </div>

                <h2 className="text-xl font-black text-white leading-snug uppercase font-sans">
                  {cs.consoleModel}
                </h2>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t-2 border-neutral-800">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block tracking-wider">Catalog Price</span>
                    <span className="text-2xl font-black text-white font-mono">{formatCurrency(product.price)}</span>
                  </div>

                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-none bg-emerald-950/80 text-emerald-400 border-2 border-emerald-500 shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock})
                  </span>
                </div>
              </div>
            </div>

            {/* Spec Grid Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CPU / Silicon */}
              {cs.cpuGpuArch && (
                <div className="bg-neutral-950 p-4 rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <span>Processor & Graphics Silicon</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-200 font-sans">{cs.cpuGpuArch}</p>
                </div>
              )}

              {/* Memory & Storage */}
              {cs.memoryStorage && (
                <div className="bg-neutral-950 p-4 rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Memory & Storage Architecture</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-200 font-sans">{cs.memoryStorage}</p>
                </div>
              )}

              {/* Display & Target Resolution */}
              {cs.displayScreenSpecs && (
                <div className="bg-neutral-950 p-4 rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    <Tv className="w-4 h-4 text-amber-400" />
                    <span>Display & Resolution Target</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-200 font-sans">{cs.displayScreenSpecs}</p>
                </div>
              )}

              {/* Media Format */}
              {cs.mediaFormatCompatibility && (
                <div className="bg-neutral-950 p-4 rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    <Disc className="w-4 h-4 text-purple-400" />
                    <span>Media & Compatibility</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-200 font-sans">{cs.mediaFormatCompatibility}</p>
                </div>
              )}
            </div>

            {/* Standout Features & Architectural Legacy */}
            {cs.standoutFeaturesLegacy && (
              <div className="bg-neutral-950 p-5 rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF1E2D] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Hardware Innovations & Platform Legacy</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {cs.standoutFeaturesLegacy}
                </p>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="px-6 py-4 border-t-2 border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AUTHENTIC HARDWARE • CARTVERSE WARRANTY</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-mono font-black text-xs uppercase tracking-wider rounded-none border-2 border-neutral-950 shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Console to Cart</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
