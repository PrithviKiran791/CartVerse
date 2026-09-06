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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0E0E12] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-100"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/60">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border bg-gradient-to-r ${brandColorClass}`}>
                {cs.brand || product.brand}
              </span>
              <h3 className="text-lg font-bold text-white tracking-wide truncate max-w-md">
                {product.name}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Top Showcase Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gradient-to-br from-neutral-900/90 to-neutral-950 p-6 rounded-xl border border-neutral-800/60">
              <div className="md:col-span-1 flex justify-center items-center h-48 bg-neutral-900/40 rounded-lg p-3">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="max-h-44 max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-400">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>Release Year: <strong className="text-neutral-200">{cs.releaseYear}</strong></span>
                </div>

                <h2 className="text-xl font-extrabold text-white leading-snug">
                  {cs.consoleModel}
                </h2>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/60">
                  <div>
                    <span className="text-xs text-neutral-400 block">Catalog Price</span>
                    <span className="text-2xl font-black text-white">{formatCurrency(product.price)}</span>
                  </div>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock})
                  </span>
                </div>
              </div>
            </div>

            {/* Spec Grid Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CPU / Silicon */}
              {cs.cpuGpuArch && (
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <span>Processor & Graphics Silicon</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-200">{cs.cpuGpuArch}</p>
                </div>
              )}

              {/* Memory & Storage */}
              {cs.memoryStorage && (
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Memory & Storage Architecture</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-200">{cs.memoryStorage}</p>
                </div>
              )}

              {/* Display & Target Resolution */}
              {cs.displayScreenSpecs && (
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <Tv className="w-4 h-4 text-amber-400" />
                    <span>Display & Resolution Target</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-200">{cs.displayScreenSpecs}</p>
                </div>
              )}

              {/* Media Format */}
              {cs.mediaFormatCompatibility && (
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <Disc className="w-4 h-4 text-purple-400" />
                    <span>Media & Compatibility</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-200">{cs.mediaFormatCompatibility}</p>
                </div>
              )}
            </div>

            {/* Standout Features & Architectural Legacy */}
            {cs.standoutFeaturesLegacy && (
              <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-900/40 p-5 rounded-xl border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
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
          <div className="px-6 py-4 border-t border-neutral-800/80 bg-neutral-900/80 flex items-center justify-between">
            <div className="text-xs text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic Gaming Hardware • Full CartVerse Warranty</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/40 flex items-center gap-2 transition-all"
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
