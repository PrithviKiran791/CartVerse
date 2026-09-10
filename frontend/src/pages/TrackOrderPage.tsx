import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { getComponentImage } from '../utils/assetRegistry';
import { useToastStore } from '../store/useToastStore';
import { Boxes } from '../components/ui/background-boxes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToastStore();

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-search if both parameters are present in URL
  useEffect(() => {
    const initialId = searchParams.get('orderId');
    const initialEmail = searchParams.get('email');
    if (initialId && initialEmail) {
      setOrderId(initialId);
      setEmail(initialEmail);
      handleTrack(initialId, initialEmail);
    }
  }, []);

  const handleTrack = async (idToTrack = orderId, emailToTrack = email) => {
    const trimmedId = idToTrack.trim();
    const trimmedEmail = emailToTrack.trim().toLowerCase();

    if (!trimmedId || !trimmedEmail) {
      toast.error('Please enter both Order ID and Email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`${BASE_URL}/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: trimmedId, email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'No matching order found with the provided details.');
      }

      setOrder(data);
      // Update URL query params without reloading
      setSearchParams({ orderId: trimmedId, email: trimmedEmail });
    } catch (err: any) {
      setError(err.message || 'Unable to locate order. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Tracking Stages Logic
  const getStageIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const stages = [
    { label: 'Order Placed', desc: 'Received & Queued' },
    { label: 'Processing & Assembly', desc: 'Hardware Inspection' },
    { label: 'Shipped', desc: 'Handed to Courier' },
    { label: 'Delivered', desc: 'Delivered to Doorstep' },
  ];

  const currentStage = order ? getStageIndex(order.orderStatus || order.status) : 0;

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden bg-[#0A0A0C] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Aceternity Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A0C]/85 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-40" />

      <div className="relative z-20 max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono font-semibold tracking-wider uppercase">
            <Truck className="w-3.5 h-3.5" />
            Live Shipment Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-rajdhani uppercase tracking-tight text-neutral-900 dark:text-white">
            Track Your <span className="text-red-600">Order</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto font-sans">
            Enter your order reference and the email address used during checkout to inspect real-time fulfillment, shipping tracking, and payment verification.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-white dark:bg-[#12111A] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 items-end"
          >
            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Order Reference ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 6aa1c540080302a8..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 dark:bg-[#181724] border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. prithvi@cartverse.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 dark:bg-[#181724] border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-rajdhani font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center gap-2 text-xs text-neutral-500 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Secure dual verification. Your personal order data is only disclosed when both the Order Reference and Email match.</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs opacity-90">Please verify the Order Reference ID from your confirmation screen or confirmation email.</p>
            </div>
          </motion.div>
        )}

        {/* Results Container */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Status & Timeline Banner */}
            <div className="bg-white dark:bg-[#12111A] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-neutral-500">Order ID:</span>
                    <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">#{order._id}</span>
                    <button
                      onClick={() => copyOrderId(order._id)}
                      className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-white"
                      title="Copy ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    Payment: {order.paymentStatus || (order.isPaid ? 'Paid' : 'Pending')}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-600/10 text-red-500 border border-red-600/20">
                    Status: {order.orderStatus || order.status || 'Processing'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 relative">
                  {stages.map((stage, idx) => {
                    const isDone = idx <= currentStage;
                    const isCurrent = idx === currentStage;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all ${
                            isDone
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                              : 'bg-neutral-200 dark:bg-[#1a1924] text-neutral-400 dark:text-neutral-600 border border-neutral-300 dark:border-neutral-700'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <p className={`text-xs font-bold font-rajdhani uppercase mt-2 ${isCurrent ? 'text-red-500' : 'text-neutral-700 dark:text-neutral-300'}`}>
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-neutral-500 hidden sm:block">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Information Grid: Shipping & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-[#12111A] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Destination Address</span>
                </div>
                <div className="text-sm space-y-1 font-sans">
                  <p className="font-bold text-neutral-900 dark:text-white text-base">{order.shippingAddress?.name}</p>
                  <p className="text-neutral-600 dark:text-neutral-300">{order.shippingAddress?.address}</p>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                  </p>
                  <div className="pt-2 text-xs font-mono text-neutral-500 space-y-0.5">
                    <p>Phone: {order.shippingAddress?.phone}</p>
                    <p>Email: {order.shippingAddress?.email || order.guestEmail}</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white dark:bg-[#12111A] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  <span>Billing Summary</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 text-xs">
                    <span>Hardware Items ({order.orderItems?.length || 0})</span>
                    <span>{formatCurrency(order.itemsPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 text-xs">
                    <span>18% GST</span>
                    <span>{formatCurrency(order.taxPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 text-xs">
                    <span>Express Secure Shipping</span>
                    <span>{order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice || 0)}</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-2 flex justify-between items-center">
                    <span className="font-rajdhani font-bold text-base uppercase text-neutral-900 dark:text-white">Total Amount</span>
                    <span className="font-mono font-bold text-lg text-red-600">{formatCurrency(order.totalPrice || 0)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 pt-1">
                    Payment Method: <span className="uppercase font-bold text-neutral-700 dark:text-neutral-300">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Items List */}
            <div className="bg-white dark:bg-[#12111A] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-rajdhani font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-red-500" />
                <span>Components in this Package ({order.orderItems?.length || 0})</span>
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {order.orderItems?.map((item: any, idx: number) => {
                  const fallbackImg = getComponentImage(item.image || item.name);
                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={fallbackImg}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-contain bg-neutral-100 dark:bg-black/40 p-1 border border-neutral-200 dark:border-neutral-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/components/gpu/rtx4090.png';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate font-sans">{item.name}</p>
                          <p className="text-xs text-neutral-500 font-mono">Qty: {item.qty || item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                          {formatCurrency(item.price * (item.qty || item.quantity || 1))}
                        </p>
                        {(item.qty || item.quantity) > 1 && (
                          <p className="text-[10px] text-neutral-500 font-mono">{formatCurrency(item.price)} each</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                to="/products"
                className="text-xs font-mono text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <span>&larr; Return to Hardware Catalog</span>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Print Order Summary
                </button>
                <Link
                  to={`/order-confirmation/${order._id}?email=${encodeURIComponent(order.shippingAddress?.email || order.guestEmail || '')}`}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-rajdhani font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  View Confirmation Page &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
