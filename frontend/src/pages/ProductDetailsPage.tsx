import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Cpu,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';
import { usePCBuilderStore } from '../store/usePCBuilderStore';
import { useUIStore } from '../store/useUIStore';
import { useReviewStore } from '../store/useReviewStore';
import { BuilderSlotKey } from '../types/hardware';
import { isComponentCompatibleWithBuild } from '../utils/compatibilityEngine';
import { motion } from 'framer-motion';
import { ProductReviewsSection } from '../components/reviews/ProductReviewsSection';
import { ProductCommentsSection } from '../components/reviews/ProductCommentsSection';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import ShapeGrid from '../components/common/ShapeGrid';
import Typography from '../components/ui/Typography';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { build, setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();
  const { getReviewSummary } = useReviewStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6">The requested hardware model could not be found in catalog.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const imgUrl = getComponentImage(product.imageSlug, product.category);
  const reviewSummary = getReviewSummary(product.id, product.name);

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
  const compatibility = slotKey ? isComponentCompatibleWithBuild(product, slotKey, build) : null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.name} added to cart.`,
    });
  };

  const handleAddToBuilder = () => {
    if (!slotKey) return;

    if (compatibility && !compatibility.isCompatible) {
      addToast({
        type: 'warning',
        title: 'Compatibility Warning',
        message: compatibility.reason || 'Component conflicts with your active PC build.',
      });
    } else {
      setSlot(slotKey, product);
      addToast({
        type: 'success',
        title: 'Assigned in PC Builder',
        message: `${product.name} set in your custom build.`,
      });
      navigate('/builder');
    }
  };

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* React Bits ShapeGrid Canvas Animated Background for Product Details */}
      <div className="absolute top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-auto opacity-40 z-0">
        <ShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.18)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10"
      >
        {/* Breadcrumb / Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hardware Catalog</span>
        </Link>

        {/* Main product view grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Image Stage with hover zoom */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900/80 border border-neutral-800 hover:border-red-500/50 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden backdrop-blur-md shadow-2xl group"
          >
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
              {product.featured && (
                <span className="bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                  Featured
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                  Best Seller
                </span>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.08, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-full h-80 sm:h-96 flex items-center justify-center p-4 cursor-zoom-in"
            >
              <img
                src={imgUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Right: Product Details & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                <span className="text-red-400 font-bold uppercase">{product.brand}</span>
                <span>•</span>
                <span className="uppercase">{product.category}</span>
                <span>•</span>
                <span className="font-mono text-neutral-500">SKU: {product.sku}</span>
              </div>

              <Typography type="h1" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {product.name}
              </Typography>

            {/* Dynamic Real-Time Rating & Stock */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{reviewSummary.averageRating}</span>
                <span className="text-xs text-neutral-400 font-mono">({reviewSummary.totalReviews} verified reviews)</span>
              </div>
              <span className="text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock ({product.stock} units available)</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-5 rounded-2xl flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-mono text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through font-mono">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-neutral-400 block mt-1">
                Inclusive of 18% GST · Free Insured Express Delivery
              </span>
            </div>

            {/* Quantity modifier */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {product.description}
          </p>

          {/* Real-time PC Builder Compatibility Status */}
          {slotKey && compatibility && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                compatibility.isCompatible
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/30 border-red-500/50 text-red-300'
              }`}
            >
              {compatibility.isCompatible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="font-bold mb-0.5">
                  {compatibility.isCompatible
                    ? '100% Compatible with Current PC Builder Setup'
                    : 'Compatibility Conflict Detected'}
                </div>
                <div className="text-neutral-400 leading-relaxed">
                  {compatibility.isCompatible
                    ? `Matches your active socket, memory channel, and physical clearances.`
                    : compatibility.reason}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <MagneticButton className="w-full">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </MagneticButton>

            {slotKey && (
              <MagneticButton className="w-full">
                <NoiseBackground containerClassName="rounded-xl shadow-lg w-full">
                  <button
                    onClick={handleAddToBuilder}
                    className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Assign to Custom Rig</span>
                  </button>
                </NoiseBackground>
              </MagneticButton>
            )}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Direct Brand RMA</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Insured Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-500 shrink-0" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Specs Breakdown Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {Object.entries(product.specs).map(([key, val]) => {
            if (val === undefined || val === null) return null;
            return (
              <div key={key} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-neutral-200 font-bold">
                  {Array.isArray(val) ? val.join(', ') : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Switcher: Dynamic Real-Time Reviews vs Community Comments */}
      <div className="pt-4">
        <div className="flex border-b border-neutral-800 gap-4 mb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold uppercase transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-red-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Verified Reviews ({reviewSummary.totalReviews})
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 font-bold uppercase transition-colors border-b-2 ${
              activeTab === 'comments'
                ? 'border-red-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Q&A & Community Discussion
          </button>
        </div>

        {activeTab === 'reviews' && (
          <ProductReviewsSection productId={product.id} productName={product.name} />
        )}

        {activeTab === 'comments' && (
          <ProductCommentsSection productId={product.id} />
        )}
      </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;
