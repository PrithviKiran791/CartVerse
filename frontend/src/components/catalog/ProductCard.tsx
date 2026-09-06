import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Wrench, Star, Eye, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency } from '../../utils/formatters';
import { addProductToPCBuild, mapCategoryToSlot } from '../../utils/pcBuilderBridge';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onViewDetails }) => {
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const toast = useToastStore;

  const imgUrl = getComponentImage(product.imageSlug, product.category);
  const isBuildComponent = Boolean(mapCategoryToSlot(product.category));

  // Compute discount percentage if original price exists
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Render category-specific technical specifications per section 8
  const renderCategorySpecs = () => {
    switch (product.category) {
      case 'cpu': {
        const cores = product.specs?.cores || product.specs?.intelSpecs?.totalCores || product.specs?.amdSpecs?.totalCores || '-';
        const threads = product.specs?.threads || product.specs?.amdSpecs?.threads || '-';
        const socket = product.specs?.socket || '-';
        const boost = product.specs?.boostClock || product.specs?.intelSpecs?.turboClock || '-';
        const tdp = product.specs?.tdp ? `${product.specs.tdp}W` : '-';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">CORES / THREADS:</span>
              <span className="font-bold text-white">{cores}C / {threads}T</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">SOCKET:</span>
              <span className="font-bold text-red-400">{socket}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">BOOST CLOCK:</span>
              <span className="font-bold text-neutral-200">UP TO {boost}</span>
            </div>
          </div>
        );
      }

      case 'gpu': {
        const vram = product.specs?.vram || (product.specs?.nvidiaSpecs?.memorySizeGb ? `${product.specs.nvidiaSpecs.memorySizeGb}GB` : '') || (product.specs?.amdRadeonSpecs?.memorySizeGb ? `${product.specs.amdRadeonSpecs.memorySizeGb}GB` : '') || '12GB';
        const memType = product.specs?.nvidiaSpecs?.memoryType || product.specs?.amdRadeonSpecs?.memoryType || 'GDDR6X';
        const tdp = product.specs?.tdp ? `${product.specs.tdp}W` : '200W';
        const arch = product.specs?.nvidiaSpecs?.architecture || product.specs?.amdRadeonSpecs?.architecture || 'Ada Lovelace';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">VRAM & TYPE:</span>
              <span className="font-bold text-emerald-400">{vram} {memType}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">TDP / POWER:</span>
              <span className="font-bold text-white">{tdp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ARCHITECTURE:</span>
              <span className="font-bold text-neutral-200">{arch}</span>
            </div>
          </div>
        );
      }

      case 'ram': {
        const ramType = product.specs?.ramType || (product.name.includes('DDR5') ? 'DDR5' : 'DDR4');
        const capacity = product.specs?.capacity || '32GB';
        const speed = product.specs?.speedMhz ? `${product.specs.speedMhz} MT/s` : '6000 MT/s';
        const modules = product.specs?.modules ? `${product.specs.modules}x Modules` : '2x 16GB';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">CAPACITY & TYPE:</span>
              <span className="font-bold text-red-400">{capacity} {ramType}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">RATED SPEED:</span>
              <span className="font-bold text-white">{speed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">CONFIGURATION:</span>
              <span className="font-bold text-neutral-200">{modules}</span>
            </div>
          </div>
        );
      }

      case 'cooler':
      case 'coolant': {
        const type = product.specs?.coolerType || (product.name.includes('AIO') || product.name.includes('Liquid') ? 'AIO Liquid' : 'Tower Air');
        const radSize = product.specs?.radiatorSize || (type === 'AIO Liquid' ? '360mm' : 'Dual Tower 120mm');
        const noise = product.specs?.noiseLevel ? `${product.specs.noiseLevel} dBA` : '28 dBA Silent';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">COOLER TYPE:</span>
              <span className="font-bold text-cyan-400">{type}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">RADIATOR / FANS:</span>
              <span className="font-bold text-white">{radSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ACOUSTICS:</span>
              <span className="font-bold text-neutral-200">{noise}</span>
            </div>
          </div>
        );
      }

      case 'monitor': {
        const res = product.specs?.resolution || '2560 x 1440 QHD';
        const panel = product.specs?.panelType || 'Fast IPS';
        const refresh = product.specs?.refreshRate ? `${product.specs.refreshRate}Hz` : '240Hz';
        const size = product.specs?.screenSize ? `${product.specs.screenSize}"` : '27"';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">SIZE & RESOLUTION:</span>
              <span className="font-bold text-indigo-400">{size} · {res}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">PANEL & REFRESH:</span>
              <span className="font-bold text-white">{panel} · {refresh}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">RESPONSE TIME:</span>
              <span className="font-bold text-neutral-200">0.03ms / 1ms GtG</span>
            </div>
          </div>
        );
      }

      case 'cables': {
        const cableType = product.specs?.cableType || 'Sleeved PSU Interconnect';
        const conn = product.specs?.connectorType || '16-Pin 12V-2x6 / ATX 24P';
        const len = product.specs?.cableLength || '650mm / 16AWG';
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">CABLE TYPE:</span>
              <span className="font-bold text-amber-400">{cableType}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">CONNECTORS:</span>
              <span className="font-bold text-white">{conn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">GAUGE & LENGTH:</span>
              <span className="font-bold text-neutral-200">{len}</span>
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="space-y-1 text-[11px] font-mono text-neutral-400">
            <div className="flex justify-between border-b border-neutral-800/80 pb-0.5">
              <span className="text-neutral-500">CATEGORY:</span>
              <span className="font-bold text-white">{product.category.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">MANUFACTURER:</span>
              <span className="font-bold text-neutral-200">{product.brand}</span>
            </div>
          </div>
        );
      }
    }
  };

  const handleNavigateDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-lg border border-neutral-800/90 bg-[#120F17] hover:border-red-600/75 transition-all duration-200 hover:shadow-[0_8px_28px_-6px_rgba(227,27,35,0.25)]">
      {/* Product Image Stage */}
      <div
        onClick={handleNavigateDetails}
        className="relative h-48 sm:h-52 bg-neutral-950 flex items-center justify-center p-4 border-b border-neutral-800/80 overflow-hidden cursor-pointer"
      >
        <img
          src={imgUrl}
          alt={product.name}
          loading="lazy"
          className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
        />

        {/* Discount Badge */}
        {discountPercent !== null && discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-sm shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Brand Badge */}
        <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900/90 px-2.5 py-0.5 rounded-sm border border-neutral-800">
          {product.brand}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Brand & Name */}
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">
            {product.brand}
          </div>
          <Link
            to={`/product/${product.id}`}
            className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Key Specifications Table */}
          <div className="mt-3 bg-neutral-900/80 border border-neutral-800/80 rounded-md p-2.5">
            {renderCategorySpecs()}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="mt-2.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans">
              {product.description}
            </p>
          )}
        </div>

        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
            <span className="text-[10px] text-neutral-500 font-normal">
              ({product.reviewsCount || 42} REVIEWS)
            </span>
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
            product.stock > 0
              ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
              : 'text-red-400 bg-red-950/40 border border-red-800/40'
          }`}>
            {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="space-y-2.5 pt-2 border-t border-neutral-800/70">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-white font-mono tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-500 line-through font-mono">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: ADD TO BUILD & ADD TO CART */}
          <div className="grid grid-cols-2 gap-2">
            {isBuildComponent ? (
              <button
                type="button"
                onClick={() => addProductToPCBuild(product)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/80 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200 hover:text-white rounded transition-colors cursor-pointer"
                title="Add to Custom PC Build Slot"
              >
                <Wrench className="w-3.5 h-3.5 text-red-500" />
                <span>ADD TO BUILD</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addItem(product, 1);
                  toast.success(`Added ${product.name} to Cart`);
                  openCart();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200 hover:text-white rounded transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                <span>BUY NOW</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                addItem(product, 1);
                toast.success(`Added ${product.name} to Cart`);
                openCart();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-red-600 hover:bg-red-700 text-[11px] font-mono font-bold uppercase tracking-wider text-white rounded transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ADD TO CART</span>
            </button>
          </div>

          {/* View Details Text Action */}
          <button
            type="button"
            onClick={handleNavigateDetails}
            className="w-full text-center text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 hover:text-red-400 transition-colors pt-1 cursor-pointer"
          >
            [ VIEW DETAILS → ]
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
