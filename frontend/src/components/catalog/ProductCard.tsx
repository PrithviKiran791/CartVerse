import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Cpu, Star, CheckCircle } from 'lucide-react';
import { Product, BuilderSlotKey } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { useUIStore } from '../../store/useUIStore';
import { isComponentCompatibleWithBuild } from '../../utils/compatibilityEngine';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';
import { MagneticButton } from '../ui/magnetic-button';
import { NoiseBackground } from '../ui/noise-background';

interface ProductCardProps {
  product: Product;
  highlightCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { build, setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();

  const imgUrl = getComponentImage(product.imageSlug, product.category);

  // Map product category to appropriate PC builder slot key
  const getSlotKey = (cat: string): BuilderSlotKey | null => {
    switch (cat) {
      case 'cpu':
        return 'cpu';
      case 'motherboard':
        return 'motherboard';
      case 'ram':
        return 'ram';
      case 'gpu':
        return 'gpu';
      case 'ssd':
        return 'primaryStorage';
      case 'hdd':
        return 'secondaryStorage';
      case 'psu':
        return 'psu';
      case 'cabinet':
        return 'cabinet';
      case 'cooler':
        return 'cooler';
      case 'monitor':
        return 'monitor';
      case 'keyboard':
        return 'keyboard';
      case 'mouse':
        return 'mouse';
      case 'headphones':
        return 'headphones';
      default:
        return null;
    }
  };

  const slotKey = getSlotKey(product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your shopping cart.`,
    });
  };

  const handleAddToBuilder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!slotKey) {
      navigate('/builder');
      return;
    }

    const check = isComponentCompatibleWithBuild(product, slotKey, build);
    if (!check.isCompatible) {
      addToast({
        type: 'warning',
        title: 'Compatibility Warning',
        message: check.reason || 'This component conflicts with your current PC build.',
      });
    } else {
      setSlot(slotKey, product);
      addToast({
        type: 'success',
        title: 'Slot Assigned in PC Builder',
        message: `${product.name} set as your ${slotKey.toUpperCase()}.`,
      });
      navigate('/builder');
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-red-500/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-red-950/20 h-full group/card relative">
        {/* Badges container */}
        <CardItem translateZ="30" className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {product.featured && (
              <span className="bg-red-600/90 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                Featured
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-amber-500/90 text-black font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-cyan-600/90 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                New Gen
              </span>
            )}
          </div>
          {discountPercent && (
            <span className="bg-neutral-950/90 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              -{discountPercent}%
            </span>
          )}
        </CardItem>

        {/* Image container */}
        <CardItem translateZ="60" className="w-full">
          <Link to={`/product/${product.id}`} className="block relative pt-6 px-4 pb-2 bg-neutral-950/50 overflow-hidden">
            <div className="w-full h-48 flex items-center justify-center p-2 group-hover/card:scale-105 transition-transform duration-300">
              <img
                src={imgUrl}
                alt={product.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getComponentImage(undefined, product.category);
                }}
              />
            </div>
          </Link>
        </CardItem>

        {/* Details Container */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Brand & Category row */}
            <CardItem translateZ="20" className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
              <span className="text-red-400 font-bold uppercase tracking-wider">{product.brand}</span>
              <span className="text-neutral-500 uppercase">{product.category}</span>
            </CardItem>

            {/* Product Name */}
            <CardItem translateZ="40">
              <Link
                to={`/product/${product.id}`}
                className="text-sm font-bold text-neutral-100 group-hover/card:text-red-400 transition-colors line-clamp-2 leading-snug"
                title={product.name}
              >
                {product.name}
              </Link>
            </CardItem>

            {/* Specs tag pills */}
            <CardItem translateZ="30" className="flex flex-wrap gap-1 mt-2.5">
              {product.specs.socket && (
                <span className="text-[10px] font-mono bg-neutral-800 text-cyan-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.socket}
                </span>
              )}
              {product.specs.ramType && (
                <span className="text-[10px] font-mono bg-neutral-800 text-purple-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.ramType}
                </span>
              )}
              {product.specs.vram && (
                <span className="text-[10px] font-mono bg-neutral-800 text-emerald-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.vram}
                </span>
              )}
              {product.specs.capacity && (
                <span className="text-[10px] font-mono bg-neutral-800 text-amber-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.capacity}
                </span>
              )}
              {product.specs.resolution && (
                <span className="text-[10px] font-mono bg-neutral-800 text-blue-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.resolution}
                </span>
              )}
              {product.specs.refreshRateHz && (
                <span className="text-[10px] font-mono bg-neutral-800 text-rose-300 px-2 py-0.5 rounded border border-neutral-700">
                  {product.specs.refreshRateHz}Hz
                </span>
              )}
              {product.specs.wattage && (
                <span className="text-[10px] font-mono bg-neutral-800 text-yellow-300 px-2 py-0.5 rounded border border-neutral-700">
                  {formatWattage(product.specs.wattage)}
                </span>
              )}
              {product.specs.tdp && (
                <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
                  {formatWattage(product.specs.tdp)} TDP
                </span>
              )}
            </CardItem>
          </div>

          {/* Rating & Stock */}
          <CardItem translateZ="20" className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-neutral-200">{product.rating}</span>
              <span className="text-[10px] text-neutral-500">({product.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>In Stock ({product.stock})</span>
            </div>
          </CardItem>

          {/* Pricing & CTA actions */}
          <CardItem translateZ="40" className="pt-2 border-t border-neutral-800/80 w-full">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-black text-white font-mono">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MagneticButton className="w-full">
                <button
                  onClick={handleAddToCart}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-1.5 border border-neutral-700 hover:border-neutral-600 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </MagneticButton>

              {slotKey ? (
                <MagneticButton className="w-full">
                  <NoiseBackground containerClassName="rounded-lg w-full">
                    <button
                      onClick={handleAddToBuilder}
                      className="w-full px-3 py-2 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-red-600/50 hover:border-red-500 transition-all cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>To Builder</span>
                    </button>
                  </NoiseBackground>
                </MagneticButton>
              ) : (
                <MagneticButton className="w-full">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold text-center flex items-center justify-center border border-neutral-700 block"
                  >
                    View Specs
                  </Link>
                </MagneticButton>
              )}
            </div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ProductCard;
