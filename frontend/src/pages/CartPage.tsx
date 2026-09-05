import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Cpu,
  ShieldCheck,
  Tag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../utils/formatters';
import { useUIStore } from '../store/useUIStore';
import { CheckoutModal } from '../components/cart/CheckoutModal';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import Typography from '../components/ui/Typography';
import { ContainerScroll } from '../components/ui/container-scroll-animation';

export const CartPage: React.FC = () => {
  const {
    items,
    bundles,
    removeItem,
    updateQuantity,
    removeBundle,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
    getItemsCount,
    getSubtotal,
    getGstAmount,
    getDiscountAmount,
    getGrandTotal,
  } = useCartStore();

  const { addToast } = useUIStore();
  const [couponInput, setCouponInput] = useState('');
  const [expandedBundles, setExpandedBundles] = useState<Record<string, boolean>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const totalItems = getItemsCount();
  const subtotal = getSubtotal();
  const gstAmount = getGstAmount();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  const toggleBundleExpand = (id: string) => {
    setExpandedBundles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      addToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: `Code ${couponInput.toUpperCase()} successfully applied.`,
      });
      setCouponInput('');
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'Try code CARTVERSE10 for 10% off.',
      });
    }
  };

  if (items.length === 0 && bundles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-600 mb-6">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white mb-2">Your Shopping Cart is Empty</Typography>
        <Typography type="body-sm" color="muted" className="max-w-md mx-auto mb-8">
          Explore our high-performance hardware inventory or start crafting your dream rig in our interactive PC Builder Studio.
        </Typography>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/builder"
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-red-950/60"
          >
            Launch PC Builder
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-800"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ContainerScroll
        titleComponent={
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold bg-red-950/80 px-3 py-1 rounded-full border border-red-700/50">
              CartVerse Insured Checkout
            </span>
            <Typography type="h1" className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
              Shopping Cart Overview ({totalItems})
            </Typography>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Items & Bundles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom PC Build Bundles */}
            {bundles.map((bundle) => {
              const isExpanded = expandedBundles[bundle.id] ?? true;
              return (
                <div
                  key={bundle.id}
                  className="bg-neutral-900/90 border border-red-900/50 rounded-3xl overflow-hidden shadow-2xl"
                >
                  {/* Bundle Header */}
                  <div className="p-5 bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border-b border-red-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{bundle.title}</h3>
                        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>{bundle.items.length} Custom Parts</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">{formatWattage(bundle.totalWattage)} TDP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black font-mono text-white">
                        {formatCurrency(bundle.totalPrice)}
                      </span>
                      <button
                        onClick={() => removeBundle(bundle.id)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Remove entire build"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBundleExpand(bundle.id)}
                        className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bundle Items List */}
                  {isExpanded && (
                    <div className="p-4 space-y-3 bg-neutral-950/60">
                      {bundle.items.map((bItem) => {
                        const bImg = getComponentImage(bItem.product.imageSlug, bItem.product.category);
                        return (
                          <div
                            key={bItem.product.id}
                            className="flex items-center justify-between p-3 bg-neutral-900/80 rounded-xl border border-neutral-800"
                          >
                            <div className="flex items-center gap-3">
                              <img src={bImg} alt="" className="w-10 h-10 object-contain rounded bg-neutral-950 p-1" />
                              <div>
                                <div className="text-xs font-bold text-white">{bItem.product.name}</div>
                                <div className="text-[10px] font-mono text-neutral-400 uppercase">{bItem.product.category}</div>
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-neutral-200">
                              {formatCurrency(bItem.product.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standalone Hardware Products */}
            {items.map((item) => {
              const img = getComponentImage(item.product.imageSlug, item.product.category);
              return (
                <div
                  key={item.product.id}
                  className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-950 p-2 flex items-center justify-center shrink-0 border border-neutral-800">
                      <img src={img} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">{item.product.brand}</span>
                      <h4 className="text-sm font-bold text-white truncate">{item.product.name}</h4>
                      <span className="text-xs font-mono text-neutral-400 mt-1 block">
                        {formatCurrency(item.product.price)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
                    <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black font-mono text-white block">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 1 Col: Summary & Checkout */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-6 sticky top-28 backdrop-blur-md">
            <Typography type="h3" className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-neutral-800">
              Order Summary
            </Typography>

            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (CARTVERSE10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl border border-neutral-700"
              >
                Apply
              </button>
            </form>

            {couponCode && (
              <div className="flex items-center justify-between text-xs font-mono bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 p-2.5 rounded-xl">
                <span>{couponCode}: -{formatCurrency(discountAmount)}</span>
                <button onClick={removeCoupon} className="text-emerald-400 hover:text-white">Remove</button>
              </div>
            )}

            {/* Price rows */}
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Hardware Subtotal</span>
                <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>18% GST (Tax Inclusive)</span>
                <span className="font-mono">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Shipping & Insurance</span>
                <span className="font-mono font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-4 border-t border-neutral-800">
                <span>Total Investment</span>
                <span className="font-mono text-red-400 text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <MagneticButton className="w-full">
              <NoiseBackground containerClassName="rounded-xl shadow-xl w-full">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              </NoiseBackground>
            </MagneticButton>
          </div>
        </div>
      </ContainerScroll>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        grandTotal={grandTotal}
        gstAmount={gstAmount}
        itemsCount={totalItems}
        onOrderSuccess={() => {
          clearCart();
        }}
      />
    </div>
  );
};

export default CartPage;
