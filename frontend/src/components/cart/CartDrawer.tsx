import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Cpu,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { useUIStore } from '../../store/useUIStore';
import { CheckoutModal } from './CheckoutModal';
import { Link } from 'react-router-dom';
import CloseButton from '../ui/CloseButton';

export const CartDrawer: React.FC = () => {
  const {
    items,
    bundles,
    isCartOpen,
    closeCart,
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
        message: 'Try code CARTVERSE10 for 10% off or FIRSTBUILD for 5% off.',
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Your Cart ({totalItems})</h2>
                      <span className="text-[10px] font-mono text-neutral-400">CartVerse Insured Checkout</span>
                    </div>
                  </div>

                  <CloseButton onClick={closeCart} size="md" variant="flat" />
                </div>

                {/* Items & Bundles Scroll Area */}
                <div className="p-5 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
                  {items.length === 0 && bundles.length === 0 ? (
                    <div className="py-16 text-center text-neutral-400 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-600">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Your Shopping Cart is Empty</h4>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                          Configure your custom rig in our PC Builder or explore hardware from our catalog.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link
                          to="/builder"
                          onClick={closeCart}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-950/40"
                        >
                          <Cpu className="w-4 h-4" />
                          <span>Launch PC Builder</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Custom PC Build Bundles */}
                      {bundles.map((bundle) => {
                        const isExpanded = expandedBundles[bundle.id] ?? false;
                        return (
                          <div
                            key={bundle.id}
                            className="bg-neutral-950 border border-red-900/50 rounded-2xl overflow-hidden shadow-lg"
                          >
                            {/* Bundle Title Header */}
                            <div className="p-4 bg-gradient-to-r from-red-950/40 to-neutral-900 border-b border-red-900/30 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <Cpu className="w-4 h-4 text-red-500" />
                                <div>
                                  <h4 className="text-xs font-bold text-white">{bundle.title}</h4>
                                  <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-2">
                                    <span>{bundle.items.length} Parts</span>
                                    <span>·</span>
                                    <span className="text-amber-400">{formatWattage(bundle.totalWattage)} TDP</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-white">
                                  {formatCurrency(bundle.totalPrice)}
                                </span>
                                <button
                                  onClick={() => removeBundle(bundle.id)}
                                  className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  title="Remove entire build"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => toggleBundleExpand(bundle.id)}
                                  className="p-1 text-neutral-400 hover:text-white"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Bundle breakdown list (Collapsible) */}
                            {isExpanded && (
                              <div className="p-3 space-y-2 bg-neutral-950/80 border-t border-neutral-850">
                                {bundle.items.map((bItem) => {
                                  const bImg = getComponentImage(bItem.product.imageSlug, bItem.product.category);
                                  return (
                                    <div
                                      key={bItem.product.id}
                                      className="flex items-center justify-between gap-3 text-[11px] p-2 bg-neutral-900/50 rounded-lg border border-neutral-850"
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <img src={bImg} alt="" className="w-7 h-7 object-contain rounded bg-neutral-950 p-0.5" />
                                        <div className="truncate">
                                          <div className="text-white font-medium truncate">{bItem.product.name}</div>
                                          <div className="text-[9px] text-neutral-500 font-mono uppercase">{bItem.product.category}</div>
                                        </div>
                                      </div>
                                      <span className="font-mono text-neutral-300 shrink-0">
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
                            className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-neutral-900 p-1 flex items-center justify-center shrink-0 border border-neutral-800">
                                <img src={img} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                  {formatCurrency(item.product.price)} each
                                </div>
                              </div>
                            </div>

                            {/* Quantity modifier and price */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="text-xs font-mono font-bold text-white">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>

                              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 text-neutral-400 hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-mono font-bold text-neutral-200">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 text-neutral-400 hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Footer Breakdown & Checkout CTA */}
                {(items.length > 0 || bundles.length > 0) && (
                  <div className="p-5 border-t border-neutral-800 bg-neutral-950 space-y-4">
                    {/* Coupon Input */}
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Coupon (e.g. CARTVERSE10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 font-mono uppercase outline-none focus:border-red-500"
                        />
                        <Tag className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-all border border-neutral-700 cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponCode && (
                      <div className="flex items-center justify-between text-xs font-mono bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 p-2 rounded-xl">
                        <span>Coupon ({couponCode}) Applied: -{formatCurrency(discountAmount)}</span>
                        <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={removeCoupon} />
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
                      <div className="flex justify-between">
                        <span>Subtotal (Hardware)</span>
                        <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>18% GST (Tax Transparency)</span>
                        <span className="font-mono">{formatCurrency(gstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Express Insured Shipping</span>
                        <span className="font-mono font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-850">
                        <span>Grand Total</span>
                        <span className="font-mono text-red-400 text-base">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Proceed to Checkout ({formatCurrency(grandTotal)})</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Dialog */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        grandTotal={grandTotal}
        gstAmount={gstAmount}
        itemsCount={totalItems}
        onOrderSuccess={() => {
          clearCart();
          closeCart();
        }}
      />
    </>
  );
};

export default CartDrawer;
