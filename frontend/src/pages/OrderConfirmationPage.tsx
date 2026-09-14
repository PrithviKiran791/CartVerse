import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Layers,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { getComponentImage } from '../utils/assetRegistry';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const toast = useToastStore();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [expandedBuilds, setExpandedBuilds] = useState<Record<string, boolean>>({});
  const [pollCount, setPollCount] = useState(0);
  const [registerPassword, setRegisterPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const confettiFired = useRef(false);

  const fetchOrder = async (isPoll = false) => {
    if (!orderId) return;
    if (!isPoll) setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryEmail = urlParams.get('email');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const storedGuestId = localStorage.getItem('cartverse_guest_id');
      if (storedGuestId) {
        headers['x-guest-id'] = storedGuestId;
      }

      const orderUrl = queryEmail
        ? `${BASE_URL}/orders/${orderId}?email=${encodeURIComponent(queryEmail)}`
        : `${BASE_URL}/orders/${orderId}`;

      const res = await fetch(orderUrl, { headers, credentials: 'include' });
      if (res.status === 403) {
        throw new Error('Access denied: You are not authorized to inspect this order reference.');
      }
      if (!res.ok) {
        throw new Error('Order not found or invalid session reference.');
      }
      const data = await res.json();
      setOrder(data);

      // Trigger confetti only once on valid order load
      if (!confettiFired.current && (data.isPaid || data.paymentMethod === 'cod')) {
        confettiFired.current = true;
        try {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId, token]);

  // Polling for pending payments (up to 5 attempts, every 3.5 seconds)
  useEffect(() => {
    if (!order) return;
    const isPendingPayment = !order.isPaid && order.paymentMethod !== 'cod' && order.paymentStatus === 'pending';
    if (isPendingPayment && pollCount < 6) {
      const timer = setTimeout(() => {
        setPollCount((prev) => prev + 1);
        fetchOrder(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [order, pollCount]);

  const toggleBuildExpand = (key: string) => {
    setExpandedBuilds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Convert guest checkout to permanent account with automatic past order migration
  const handleConvertAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerPassword || registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setIsRegistering(true);
    try {
      const targetEmail = order.guestEmail || order.shippingAddress?.email;
      const targetName = order.shippingAddress?.name || 'CartVerse Gamer';
      const targetPhone = order.shippingAddress?.phone || '';
      const storedGuestId = localStorage.getItem('cartverse_guest_id') || order.guestId;

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: targetName,
          email: targetEmail,
          password: registerPassword,
          phone: targetPhone,
          guestId: storedGuestId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Account registration failed');
      }

      useAuthStore.getState().login(data.user, data.token);
      setAccountCreated(true);
      toast.success('Account created! This order has been migrated to your profile.');
      // Refresh order to reflect newly attached user
      fetchOrder(true);
    } catch (err: any) {
      toast.error(err.message || 'Could not create account');
    } finally {
      setIsRegistering(false);
    }
  };

  // Retry payment directly for this order (Works for User & Guest)
  const handleRetryPayment = async () => {
    if (!order) return;
    setIsRetrying(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const storedGuestId = localStorage.getItem('cartverse_guest_id');
      if (storedGuestId) {
        headers['x-guest-id'] = storedGuestId;
      }

      const res = await fetch(`${BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          orderId: order._id,
          guestEmail: order.guestEmail || order.shippingAddress?.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not initialize gateway session');
      }

      const paymentData = await res.json();
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !(window as any).Razorpay || paymentData.isTestMode) {
        // Mock fallback verification
        const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            orderId: order._id,
            razorpay_order_id: paymentData.razorpayOrderId,
            razorpay_payment_id: `pay_retry_${Date.now()}`,
            razorpay_signature: 'test_signature_mock',
            guestEmail: order.guestEmail || order.shippingAddress?.email,
          }),
        });

        if (!verifyRes.ok) throw new Error('Verification failed');
        const updated = await verifyRes.json();
        setOrder(updated);
        toast.success('Payment verified successfully!');
        setIsRetrying(false);
        return;
      }

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: 'CartVerse PC Studio',
        description: `Order Retry #${order._id.substring(0, 8)}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: order.shippingAddress?.name,
          email: order.shippingAddress?.email,
          contact: order.shippingAddress?.phone,
        },
        theme: {
          color: '#FF1E2D',
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error('Signature verification rejected');
            const verified = await verifyRes.json();
            setOrder(verified);
            toast.success('Payment authorized & verified!');
          } catch (vErr: any) {
            toast.error(vErr.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: async () => {
            await fetch(`${BASE_URL}/payments/fail`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: order._id,
                razorpay_order_id: paymentData.razorpayOrderId,
                failureReason: 'User cancelled payment modal during retry',
              }),
            });
            toast.warning('Payment was cancelled.');
            fetchOrder(true);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed');
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF1E2D] border-t-transparent animate-spin" />
        <p className="text-xs font-sans text-neutral-400">Verifying order telemetry & financial ledger...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-[#FF1E2D]/30 flex items-center justify-center text-[#FF1E2D] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Order Unavailable</h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-md">
          {error || 'The requested order reference could not be located or belongs to another session.'}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Link
            to="/orders"
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <span>My Orders</span>
          </Link>
          <Link
            to="/products"
            className="px-5 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const latestTransaction = order.transactions && order.transactions.length > 0 ? order.transactions[0] : null;
  const isPending = !order.isPaid && order.paymentMethod !== 'cod' && order.paymentStatus === 'pending';
  const isFailed = order.paymentStatus === 'failed' || (!order.isPaid && order.paymentMethod !== 'cod' && !isPending);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        {isFailed ? (
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-[#FF1E2D]/30 text-[#FF1E2D] mx-auto flex items-center justify-center shadow-lg shadow-[#FF1E2D]/30">
            <AlertCircle className="w-9 h-9" />
          </div>
        ) : isPending ? (
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-950/40 animate-pulse">
            <Clock className="w-9 h-9" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>
        )}

        <span
          className={`text-[11px] font-sans font-bold uppercase tracking-widest block ${
            isFailed ? 'text-[#FF1E2D]' : isPending ? 'text-amber-400' : 'text-emerald-400'
          }`}
        >
          {isFailed
            ? 'Payment Action Required'
            : isPending
            ? 'Awaiting Gateway Confirmation'
            : 'Order Placed & Confirmed'}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {isFailed
            ? 'Payment Verification Incomplete'
            : isPending
            ? 'Confirming Payment...'
            : 'Thank you for choosing CartVerse!'}
        </h1>

        <p className="text-xs text-neutral-400 font-sans">
          Order ID: <span className="text-white font-bold">#{order._id}</span> • Placed on{' '}
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        {isPending && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-sans mt-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Polling payment status from gateway ({pollCount}/6)...</span>
          </div>
        )}
      </motion.div>

      {/* Failure Alert Banner & Retry CTA */}
      {isFailed && (
        <div className="bg-red-950/30 border border-[#FF1E2D]/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FF1E2D]" />
              <span>Payment Attempt Did Not Complete</span>
            </h4>
            <p className="text-xs text-neutral-300">
              {latestTransaction?.failureReason ||
                'The payment attempt was interrupted or dismissed. You can retry paying for this order right now.'}
            </p>
          </div>
          <button
            type="button"
            disabled={isRetrying}
            onClick={handleRetryPayment}
            className="px-6 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md shadow-[#FF1E2D]/30 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Connecting...' : 'Retry Payment'}</span>
          </button>
        </div>
      )}

      {/* Delivery Tracking Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-300">
            <Truck className="w-4 h-4 text-[#FF1E2D]" />
            <span>Estimated Dispatch & Delivery:</span>
            <span className="text-white font-bold">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-bold">
              Order: {order.status?.toUpperCase() || 'PLACED'}
            </span>
            <span
              className={`text-[10px] font-sans uppercase px-2.5 py-1 rounded border font-bold ${
                order.paymentStatus === 'paid' || order.isPaid
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : isFailed
                  ? 'bg-red-950/60 text-[#FF1E2D] border-[#FF1E2D]/30'
                  : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
              }`}
            >
              Payment: {order.paymentStatus?.toUpperCase() || (order.isPaid ? 'PAID' : 'PENDING')}
            </span>
          </div>
        </div>

        {/* 4-step progress tracker */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-sans">
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-bold">Placed</span>
          </div>
          <div className="space-y-1">
            <div
              className={`h-1.5 rounded-full ${
                order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                  ? 'bg-emerald-500'
                  : 'bg-neutral-800'
              }`}
            />
            <span
              className={
                order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                  ? 'text-emerald-400 font-bold'
                  : 'text-neutral-500'
              }
            >
              Processing
            </span>
          </div>
          <div className="space-y-1">
            <div
              className={`h-1.5 rounded-full ${
                order.status === 'shipped' || order.status === 'delivered' ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            />
            <span
              className={
                order.status === 'shipped' || order.status === 'delivered'
                  ? 'text-emerald-400 font-bold'
                  : 'text-neutral-500'
              }
            >
              Dispatched
            </span>
          </div>
          <div className="space-y-1">
            <div
              className={`h-1.5 rounded-full ${
                order.status === 'delivered' ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            />
            <span className={order.status === 'delivered' ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Order Items & Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Line Items List */}
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF1E2D]" />
              <span>Purchased Components ({order.orderItems?.length || 0})</span>
            </h3>
            <span className="text-xs font-sans text-neutral-400">Insured Hardware Transit</span>
          </div>

          <div className="space-y-3 divide-y divide-neutral-800/60">
            {order.orderItems?.map((item: any, idx: number) => {
              const imgUrl = getComponentImage(item.image);
              const isBundle = item.name?.includes(':');
              const isExpanded = expandedBuilds[idx];

              return (
                <div key={idx} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-neutral-950 p-1 flex items-center justify-center shrink-0 border border-neutral-800">
                        <img src={imgUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-[10px] font-sans text-neutral-400">
                          Qty: {item.qty} × {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="text-xs font-sans font-bold text-white">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                      {isBundle && (
                        <button
                          type="button"
                          onClick={() => toggleBuildExpand(String(idx))}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isBundle && isExpanded && (
                    <div className="ml-15 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] font-sans text-neutral-400 space-y-1">
                      <div className="text-[#FF1E2D] font-bold">Custom Build Spec Breakdown</div>
                      <div>Individual component warranty and serial registry assigned at dispatch.</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing breakdown derived from server values */}
          <div className="border-t border-neutral-800 pt-4 space-y-1.5 text-xs font-sans text-neutral-400">
            <div className="flex justify-between">
              <span>Hardware Subtotal:</span>
              <span className="text-white">{formatCurrency(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18% Tax):</span>
              <span className="text-white">{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="text-emerald-400">
                {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Total Amount:</span>
              <span className="text-[#FF1E2D]">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Financial Telemetry */}
        <div className="space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#FF1E2D]" />
              <span>Shipping Address</span>
            </h4>
            <div className="text-xs text-neutral-300 space-y-1">
              <p className="font-bold text-white">{order.shippingAddress?.name}</p>
              <p className="text-neutral-400">{order.shippingAddress?.address}</p>
              <p className="text-neutral-400 font-sans">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-neutral-400 font-sans text-[11px] pt-1">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Payment Telemetry Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-[#FF1E2D]" />
              <span>Payment Gateway Ledger</span>
            </h4>
            <div className="text-xs text-neutral-400 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>Gateway:</span>
                <span className="text-white uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Status:</span>
                <span
                  className={`font-bold ${
                    order.paymentStatus === 'paid' || order.isPaid
                      ? 'text-emerald-400'
                      : isFailed
                      ? 'text-[#FF1E2D]'
                      : 'text-amber-400'
                  }`}
                >
                  {latestTransaction
                    ? `${latestTransaction.status.toUpperCase()} (${latestTransaction.gateway.toUpperCase()})`
                    : order.paymentStatus?.toUpperCase() || (order.isPaid ? 'PAID' : 'PENDING')}
                </span>
              </div>
              {latestTransaction?.razorpayPaymentId && (
                <div className="flex justify-between text-[11px]">
                  <span>Payment Ref:</span>
                  <span className="text-neutral-300 truncate max-w-[130px]" title={latestTransaction.razorpayPaymentId}>
                    {latestTransaction.razorpayPaymentId}
                  </span>
                </div>
              )}
              {latestTransaction?.amount && (
                <div className="flex justify-between text-[11px]">
                  <span>Ledger Amount:</span>
                  <span className="text-white">{formatCurrency(latestTransaction.amount / 100)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Guest Order Telemetry & Notice */}
          {(!user || order.guestEmail) && (
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-sans uppercase text-amber-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Guest Order Receipt</span>
              </div>
              <p className="text-xs text-neutral-300 font-sans">
                Order placed as guest. An official tax invoice and shipment tracker have been dispatched to{' '}
                <span className="text-white font-semibold font-sans">{order.guestEmail || order.shippingAddress?.email}</span>.
              </p>
            </div>
          )}

          {/* Optional Post-Purchase Soft Account Creation Card */}
          {!user && !accountCreated && (
            <div className="bg-gradient-to-br from-red-950/20 via-neutral-900 to-neutral-950 border border-[#FF1E2D]/30 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-xs font-sans uppercase text-[#FF1E2D]">
                <Sparkles className="w-4 h-4 text-[#FF1E2D]" />
                <span className="font-bold font-sans text-sm">Claim & Save Order</span>
              </div>
              <p className="text-xs text-neutral-300 font-sans">
                Set a password to create an account in 1 click. This order and all future builds will automatically sync to your dashboard!
              </p>
              <form onSubmit={handleConvertAccount} className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] font-sans uppercase text-neutral-400 block mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={order.guestEmail || order.shippingAddress?.email || ''}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-400 font-sans cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans uppercase text-neutral-400 block mb-1">Set Password (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-sans outline-none focus:border-[#FF1E2D]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF1E2D]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRegistering ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Save Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {accountCreated && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Account activated! This order has been migrated to your permanent profile.</span>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="space-y-2">
            {user ? (
              <>
                <Link
                  to={`/orders/${order._id}`}
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-neutral-800 cursor-pointer"
                >
                  <span>View Full Order Details</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>

                <Link
                  to="/orders"
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-neutral-800 cursor-pointer"
                >
                  <span>All Orders History</span>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-neutral-800 cursor-pointer"
              >
                <span>Existing Customer? Sign In</span>
              </Link>
            )}

            <Link
              to="/products"
              className="w-full py-2.5 px-4 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF1E2D]/30 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
