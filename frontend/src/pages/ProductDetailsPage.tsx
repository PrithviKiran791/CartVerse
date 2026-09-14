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
  Server,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';
import { usePCBuilderStore } from '../store/usePCBuilderStore';
import { useUIStore } from '../store/useUIStore';
import { BuilderSlotKey } from '../types/hardware';
import { isComponentCompatibleWithBuild } from '../utils/compatibilityEngine';
import { motion } from 'framer-motion';
import { ProductReviewsSection } from '../components/reviews/ProductReviewsSection';
import { ProductCommentsSection } from '../components/reviews/ProductCommentsSection';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import ShapeGrid from '../components/common/ShapeGrid';
import Typography from '../components/ui/Typography';
import { DetailedSpecView } from '../components/catalog/DetailedSpecView';
import { BreadcrumbNav } from '../components/navigation/BreadcrumbNav';
import FadeContent from '../components/common/FadeContent';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { build, setSlot } = usePCBuilderStore();
  const { addToast } = useUIStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
          borderColor="rgba(255, 30, 45, 0.18)"
          hoverFillColor="#FF1E2D"
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
        {/* Clickable Breadcrumbs & Back Navigation */}
        <BreadcrumbNav
          items={
            product.productClass === 'server'
              ? [
                  { label: 'SERVERS', href: '/servers' },
                  {
                    label: product.category === 'supercomputer' ? 'SUPERCOMPUTERS' : 'SERVER INFRASTRUCTURE',
                    href: '/servers/catalog',
                  },
                  { label: product.name },
                ]
              : [
                  { label: product.category.toUpperCase(), href: `/products?category=${product.category}` },
                  { label: product.brand.toUpperCase() },
                  { label: product.name },
                ]
          }
          backTo={
            product.productClass === 'server'
              ? { label: 'SERVERS CATALOG', href: '/servers/catalog' }
              : { label: 'CATALOG', href: '/products' }
          }
        />

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

            {/* Multiple Thumbnails Gallery Selector */}
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-800/80 w-full justify-center">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg border p-1 bg-neutral-950 overflow-hidden cursor-pointer transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#FF1E2D] shadow-[0_0_12px_rgba(255, 30, 45,0.4)]'
                      : 'border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-700'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Details & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans text-neutral-400 mb-1">
                <span className="text-[#FF1E2D] font-bold uppercase">{product.brand}</span>
                <span>•</span>
                <span className="uppercase text-[#FF1E2D] font-bold">{product.category}</span>
                <span>•</span>
                <span className="font-sans text-[#FF1E2D] font-bold">SKU: {product.sku}</span>
              </div>

              <Typography type="h1" className="text-2xl sm:text-3xl font-black text-white mb-2">
                {product.name}
              </Typography>

              {product.category !== 'simulator' && (
                (product.avgRating || product.rating) ? (
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm mb-4">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-white">{(product.avgRating || product.rating).toFixed(1)}</span>
                    <span className="text-xs font-sans text-neutral-400">
                      ({product.reviewCount || product.reviewsCount || 0} reviews)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-sans text-neutral-400 mb-4">
                    <Star className="w-4 h-4 text-neutral-600" />
                    <span>No reviews yet</span>
                  </div>
                )
              )}


              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-sans text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.category !== 'simulator' && product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-500 line-through font-sans">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}

              </div>
              <span className="text-[11px] font-sans text-[#FF1E2D] font-bold block mt-1">
                Inclusive of 18% GST · Free Insured Express Delivery
              </span>
            </div>

            {/* Quantity modifier */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-sans font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Real-time PC Builder Compatibility Status (Consumer builds only) */}
            {product.productClass !== 'server' && slotKey && compatibility && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  compatibility.isCompatible
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#FF1E2D]/10 border-[#FF1E2D]/40 text-[#FF1E2D]'
                }`}
              >
                {compatibility.isCompatible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#FF1E2D] shrink-0 mt-0.5" />
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

              {product.productClass === 'server' ? (
                <MagneticButton className="w-full">
                  <NoiseBackground containerClassName="rounded-xl shadow-lg w-full">
                    <button
                      onClick={() => navigate('/servers/builder')}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Server className="w-4 h-4" />
                      <span>Configure in Server Studio</span>
                    </button>
                  </NoiseBackground>
                </MagneticButton>
              ) : slotKey ? (
                <MagneticButton className="w-full">
                  <NoiseBackground containerClassName="rounded-xl shadow-lg w-full">
                    <button
                      onClick={handleAddToBuilder}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Cpu className="w-4 h-4" />
                      <span>Assign to Custom Rig</span>
                    </button>
                  </NoiseBackground>
                </MagneticButton>
              ) : null}
            </div>

            {/* Value props */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF1E2D] shrink-0" />
                <span>Direct Brand RMA</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF1E2D] shrink-0" />
                <span>Insured Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF1E2D] shrink-0" />
                <span>7-Day Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Specs Breakdown Table */}
        <FadeContent blur={true} duration={850} delay={50} easing="ease-out" initialOpacity={0}>
          <DetailedSpecView product={product} />
        </FadeContent>

        {/* Customer Reviews & Ratings */}
        {product.category !== 'simulator' && (
          <FadeContent blur={true} duration={850} delay={75} easing="ease-out" initialOpacity={0}>
            <ProductReviewsSection productId={product.id} productName={product.name} />
          </FadeContent>
        )}


        {/* Community Discussion / Q&A */}
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="pt-6 border-t border-neutral-800">
            <h3 className="text-base font-black uppercase text-white tracking-wider mb-6 flex items-center gap-2">
              <span>Q&A & Community Discussion</span>
            </h3>
            <ProductCommentsSection productId={product.id} />
          </div>
        </FadeContent>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;
