import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { getComponentImage } from '../utils/assetRegistry';
import { TopographicContourBackground } from '../components/ui/TopographicContourBackground';

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

/**
 * Minimal, crisp SVG fallback placeholder matching CartVerse 3-color light design system.
 */
const createLightPlaceholderSvg = (title: string = 'Component'): string => {
  const safeTitle = (title || 'Hardware').toUpperCase().slice(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
    <rect width="300" height="300" fill="#F7F7F7"/>
    <rect x="12" y="12" width="276" height="276" rx="6" fill="none" stroke="#E5E5E5" stroke-width="1.5"/>
    <circle cx="150" cy="130" r="46" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="1.5"/>
    <path d="M132 130 L168 130 M150 112 L150 148" stroke="#E5252A" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="140" y="120" width="20" height="20" rx="3" fill="none" stroke="#E5252A" stroke-width="1.5"/>
    <text x="150" y="212" text-anchor="middle" fill="#0A0A0A" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="12" letter-spacing="1">${safeTitle}</text>
    <text x="150" y="232" text-anchor="middle" fill="#737373" font-family="system-ui, -apple-system, sans-serif" font-size="9" letter-spacing="0.5">CARTVERSE HARDWARE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Normalizes multi-source image properties into a single valid image URL.
 */
const resolveItemImageUrl = (item: any): string => {
  // Log item telemetry for debugging image resolution
  console.log('[OrderConfirmation] Purchased component item:', item);

  const candidate =
    item.imageUrl ||
    item.image_url ||
    item.image ||
    item.imageSlug ||
    item.thumbnail ||
    (Array.isArray(item.images) && item.images[0] ? item.images[0] : null) ||
    item.product?.image ||
    item.product?.imageSlug ||
    item.product?.imageUrl ||
    item.product?.thumbnail ||
    '';

  if (!candidate || typeof candidate !== 'string' || !candidate.trim()) {
    return createLightPlaceholderSvg(item.name);
  }

  const trimmed = candidate.trim();

  // 1. Direct web or data URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 2. Resolve via local asset registry
  const cleaned = trimmed.replace(/^[\/\\]+/, '');
  const resolved = getComponentImage(cleaned, item.category || item.product?.category || 'hardware');

  // If resolved returns the old dark SVG, replace with the new light SVG placeholder
  if (resolved && resolved.startsWith('data:image/svg+xml') && resolved.includes('%23141417')) {
    return createLightPlaceholderSvg(item.name);
  }

  return resolved || createLightPlaceholderSvg(item.name);
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
  const [copiedOrderId, setCopiedOrderId] = useState(false);

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

  const rawOrderId = String(order?.id || order?._id || orderId || '');
  const displayShortId = rawOrderId.length > 14
    ? `#${rawOrderId.substring(0, 8)}…${rawOrderId.substring(rawOrderId.length - 5)}`
    : `#${rawOrderId}`;

  const handleCopyOrderId = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!rawOrderId) return;
    navigator.clipboard.writeText(rawOrderId);
    setCopiedOrderId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedOrderId(false), 2200);
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
      fetchOrder(true);
    } catch (err: any) {
      toast.error(err.message || 'Could not create account');
    } finally {
      setIsRegistering(false);
    }
  };

  // Direct payment retry for this order
  const handleRetryPayment = async () => {
    if (!order) return;
    const currentOrderId = order.id || order._id;
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
          orderId: currentOrderId,
          guestEmail: order.guestEmail || order.shippingAddress?.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not initialize gateway session');
      }

      const paymentData = await res.json();
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !(window as any).Razorpay || paymentData.isTestMode) {
        const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            orderId: currentOrderId,
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
        description: `Order Retry #${(currentOrderId || '').substring(0, 8)}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: order.shippingAddress?.name,
          email: order.shippingAddress?.email,
          contact: order.shippingAddress?.phone,
        },
        theme: {
          color: '#E5252A',
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
                orderId: currentOrderId,
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
                orderId: currentOrderId,
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

  // Loading State
  if (loading) {
    return (
      <div className="relative min-h-[80vh] w-full bg-[#FFFFFF] flex flex-col items-center justify-center space-y-4 font-sans">
        <TopographicContourBackground />
        <div className="relative z-10 flex flex-col items-center space-y-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#E5252A] border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-[#737373]">
            Verifying order telemetry & financial ledger...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="relative min-h-[80vh] w-full bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center font-sans">
        <TopographicContourBackground />
        <div className="relative z-10 max-w-md space-y-4">
          <div className="w-14 h-14 rounded-full border border-[#E5252A] flex items-center justify-center text-[#E5252A] mx-auto">
            <AlertCircle className="w-7 h-7 stroke-[2]" />
          </div>
          <h2 className="text-2xl font-black text-[#0A0A0A]">Order Unavailable</h2>
          <p className="text-xs text-[#525252] leading-relaxed">
            {error || 'The requested order reference could not be located or belongs to another session.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/orders"
              className="px-5 py-2.5 bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#0A0A0A] border border-[#E5E5E5] font-bold text-xs rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#E5252A] focus-visible:outline-none"
            >
              <span>My Orders</span>
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-[#E5252A] hover:bg-[#D01F24] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:outline-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Return to Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const latestTransaction = order.transactions && order.transactions.length > 0 ? order.transactions[0] : null;
  const isPending = !order.isPaid && order.paymentMethod !== 'cod' && order.paymentStatus === 'pending';
  const isFailed = order.paymentStatus === 'failed' || (!order.isPaid && order.paymentMethod !== 'cod' && !isPending);
  const isPaid = Boolean(order.isPaid || order.paymentStatus === 'paid');

  const orderDate = new Date(order.createdAt || Date.now());
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const estimatedDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // 4-step progress states
  const orderStatus = (order.status || 'placed').toLowerCase();
  const step1Active = true; // Placed
  const step2Active = orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'delivered';
  const step3Active = orderStatus === 'shipped' || orderStatus === 'delivered';
  const step4Active = orderStatus === 'delivered';

  return (
    <div className="relative min-h-screen w-full bg-[#FFFFFF] text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#E5252A] selection:text-white">
      {/* Animated Topographic Contour Layer */}
      <TopographicContourBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Confirmation Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center space-y-3 pt-2"
        >
          {/* Red outlined circle tick (Accent #E5252A) */}
          <div className="w-14 h-14 rounded-full border-2 border-[#E5252A] flex items-center justify-center mx-auto text-[#E5252A] shadow-none">
            {isFailed ? (
              <AlertCircle className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <Check className="w-7 h-7 stroke-[2.5]" />
            )}
          </div>

          {/* Small uppercase letter-spaced red label */}
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E5252A] block">
            {isFailed
              ? 'PAYMENT ACTION REQUIRED'
              : isPending
              ? 'AWAITING GATEWAY CONFIRMATION'
              : 'ORDER PLACED & CONFIRMED'}
          </span>

          {/* Large bold black heading */}
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight">
            {isFailed
              ? 'Payment Verification Incomplete'
              : isPending
              ? 'Confirming Payment...'
              : 'Thank you for choosing CartVerse!'}
          </h1>

          {/* Truncated Order ID with click-to-copy & timestamp */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-[#737373] pt-1">
            <span>Order ID:</span>
            <div className="inline-flex items-center gap-1.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded px-2 py-0.5 font-mono text-xs text-[#0A0A0A]">
              <span className="font-semibold">{displayShortId}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                title="Copy full Order ID"
                className="text-[#737373] hover:text-[#0A0A0A] p-0.5 rounded transition-colors focus-visible:ring-1 focus-visible:ring-[#E5252A] focus-visible:outline-none"
              >
                {copiedOrderId ? (
                  <Check className="w-3.5 h-3.5 text-[#E5252A]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span>•</span>
            <span>Placed on {formattedDate}</span>
          </div>

          {isPending && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F7] border border-[#E5252A]/40 text-[#E5252A] text-xs font-medium mt-2">
              <div className="w-2 h-2 rounded-full bg-[#E5252A] animate-ping" />
              <span>Polling gateway ledger ({pollCount}/6)...</span>
            </div>
          )}
        </motion.div>

        {/* Failure Banner & Retry CTA */}
        {isFailed && (
          <div className="bg-[#F7F7F7] border border-[#E5252A] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E5252A]" />
                <span>Payment Attempt Did Not Complete</span>
              </h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                {latestTransaction?.failureReason ||
                  'The financial attempt was interrupted. You can retry paying for this order right now.'}
              </p>
            </div>
            <button
              type="button"
              disabled={isRetrying}
              onClick={handleRetryPayment}
              className="px-6 py-2.5 bg-[#E5252A] hover:bg-[#D01F24] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:outline-none"
            >
              <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Connecting...' : 'Retry Payment'}</span>
            </button>
          </div>
        )}

        {/* Status Strip: Delivery Estimate, Badges & 4-Step Progress Bar */}
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-[#E5252A]" />
              <span className="text-[#737373]">Estimated Dispatch & Delivery:</span>
              <span className="text-[#0A0A0A] font-bold">{estimatedDeliveryDate}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* ORDER: PLACED Badge (Black) */}
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#0A0A0A] text-[#0A0A0A] tracking-wider">
                ORDER: {order.status?.toUpperCase() || 'PLACED'}
              </span>

              {/* PAYMENT Badge (Red accent / Black variant - strictly no green/yellow) */}
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded tracking-wider border ${
                  isPaid
                    ? 'bg-[#E5252A] text-white border-[#E5252A]'
                    : isFailed
                    ? 'bg-[#FFFFFF] text-[#E5252A] border-[#E5252A]'
                    : 'bg-[#FFFFFF] text-[#E5252A] border-[#E5252A]'
                }`}
              >
                PAYMENT: {order.paymentStatus?.toUpperCase() || (order.isPaid ? 'PAID' : 'PENDING')}
              </span>
            </div>
          </div>

          {/* 4-step Progress Tracker (Red fill for completed, light grey for pending) */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="space-y-1.5">
                <div className={`h-1.5 rounded-full ${step1Active ? 'bg-[#E5252A]' : 'bg-[#E5E5E5]'}`} />
                <span className={`block font-bold ${step1Active ? 'text-[#0A0A0A]' : 'text-[#737373]'}`}>
                  Placed
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`h-1.5 rounded-full ${step2Active ? 'bg-[#E5252A]' : 'bg-[#E5E5E5]'}`} />
                <span className={`block font-bold ${step2Active ? 'text-[#0A0A0A]' : 'text-[#737373]'}`}>
                  Processing
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`h-1.5 rounded-full ${step3Active ? 'bg-[#E5252A]' : 'bg-[#E5E5E5]'}`} />
                <span className={`block font-bold ${step3Active ? 'text-[#0A0A0A]' : 'text-[#737373]'}`}>
                  Dispatched
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`h-1.5 rounded-full ${step4Active ? 'bg-[#E5252A]' : 'bg-[#E5E5E5]'}`} />
                <span className={`block font-bold ${step4Active ? 'text-[#0A0A0A]' : 'text-[#737373]'}`}>
                  Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Purchased Components (Left) + Ledger & Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Purchased Components */}
          <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <h3 className="text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#E5252A]" />
                <span>Purchased Components ({order.orderItems?.length || 0})</span>
              </h3>
              <span className="text-xs text-[#737373]">Insured Hardware Transit</span>
            </div>

            {/* Line Items List with Normalized Product Images */}
            <div className="space-y-4 divide-y divide-[#E5E5E5]">
              {order.orderItems?.map((item: any, idx: number) => {
                const imgUrl = resolveItemImageUrl(item);
                const isBundle = item.name?.includes(':');
                const isExpanded = expandedBuilds[idx];

                return (
                  <div key={idx} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Fixed Square Thumbnail (64x64) with 1px border & light neutral bg */}
                        <div className="w-16 h-16 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={item.name || 'Purchased component'}
                            loading="lazy"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Local placeholder fallback on network error
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = createLightPlaceholderSvg(item.name);
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#0A0A0A] truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#737373] block mt-0.5">
                            Qty: {item.qty} × {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#0A0A0A]">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                        {isBundle && (
                          <button
                            type="button"
                            onClick={() => toggleBuildExpand(String(idx))}
                            className="p-1 text-[#737373] hover:text-[#0A0A0A] transition-colors focus-visible:ring-1 focus-visible:ring-[#E5252A] focus-visible:outline-none"
                            aria-label="Toggle build specification breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {isBundle && isExpanded && (
                      <div className="ml-19 p-3 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] text-[11px] text-[#525252] space-y-1">
                        <div className="text-[#E5252A] font-bold">Custom Build Specification Breakdown</div>
                        <div>Validated against electrical and thermal matrix before shipment dispatch.</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-[#E5E5E5] pt-4 space-y-2 text-xs text-[#525252]">
              <div className="flex justify-between">
                <span>Hardware Subtotal:</span>
                <span className="text-[#0A0A0A] font-medium">{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Tax):</span>
                <span className="text-[#0A0A0A] font-medium">{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="text-[#0A0A0A] font-bold">
                  {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#0A0A0A] pt-3 border-t border-[#E5E5E5]">
                <span>Total Amount:</span>
                <span className="text-[#E5252A] font-black">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Address, Ledger & Navigation Actions */}
          <div className="space-y-6">
            {/* Destination Address Card */}
            <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#E5252A]" />
                <span>Shipping Address</span>
              </h4>
              <div className="text-xs text-[#525252] space-y-1 leading-relaxed">
                <p className="font-bold text-[#0A0A0A]">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
                <p className="text-[11px] text-[#737373] pt-0.5">
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Payment Gateway Ledger Card */}
            <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-[#E5252A]" />
                <span>Payment Gateway Ledger</span>
              </h4>
              <div className="text-xs text-[#525252] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Gateway:</span>
                  <span className="text-[#0A0A0A] font-bold uppercase">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Transaction Status:</span>
                  <span className="text-[#0A0A0A] font-bold">
                    {latestTransaction
                      ? `${latestTransaction.status.toUpperCase()} (${latestTransaction.gateway.toUpperCase()})`
                      : order.paymentStatus?.toUpperCase() || (order.isPaid ? 'PAID' : 'PENDING')}
                  </span>
                </div>
                {latestTransaction?.razorpayPaymentId && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#737373]">Payment Ref:</span>
                    <span className="text-[#0A0A0A] font-mono truncate max-w-[130px]" title={latestTransaction.razorpayPaymentId}>
                      {latestTransaction.razorpayPaymentId}
                    </span>
                  </div>
                )}
                {latestTransaction?.amount && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#737373]">Ledger Amount:</span>
                    <span className="text-[#0A0A0A] font-bold">{formatCurrency(latestTransaction.amount / 100)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guest Order Notification */}
            {(!user || order.guestEmail) && (
              <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-[#0A0A0A] tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-[#E5252A]" />
                  <span>Guest Order Notice</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Tax invoice and tracking receipt have been dispatched to{' '}
                  <span className="text-[#0A0A0A] font-bold">{order.guestEmail || order.shippingAddress?.email}</span>.
                </p>
              </div>
            )}

            {/* Soft Account Creation Card for Guests */}
            {!user && !accountCreated && (
              <div className="bg-[#F7F7F7] border border-[#E5252A]/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs uppercase text-[#E5252A] font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5252A]" />
                  <span>Claim & Save Order</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Set a password to create an account in 1 click. This build and all past orders will sync directly to your profile.
                </p>
                <form onSubmit={handleConvertAccount} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] uppercase text-[#737373] font-bold block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={order.guestEmail || order.shippingAddress?.email || ''}
                      className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs text-[#737373] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#737373] font-bold block mb-1">
                      Set Password (Min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs text-[#0A0A0A] outline-none focus:border-[#E5252A] focus:ring-1 focus:ring-[#E5252A] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#E5252A] hover:bg-[#D01F24] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:outline-none"
                  >
                    {isRegistering ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Save</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {accountCreated && (
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-[#0A0A0A] text-xs flex items-center gap-2.5">
                <Check className="w-4 h-4 shrink-0 text-[#E5252A] stroke-[3]" />
                <span className="font-medium">
                  Account activated! This order has been migrated to your permanent profile.
                </span>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="space-y-2 pt-1">
              {user ? (
                <>
                  <Link
                    to={`/orders/${order.id || order._id}`}
                    className="w-full py-2.5 px-4 bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#0A0A0A] text-xs font-bold rounded-lg flex items-center justify-between border border-[#E5E5E5] transition-colors focus-visible:ring-2 focus-visible:ring-[#E5252A] focus-visible:outline-none"
                  >
                    <span>View Full Order Details</span>
                    <ChevronRight className="w-4 h-4 text-[#737373]" />
                  </Link>

                  <Link
                    to="/orders"
                    className="w-full py-2.5 px-4 bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#0A0A0A] text-xs font-bold rounded-lg flex items-center justify-between border border-[#E5E5E5] transition-colors focus-visible:ring-2 focus-visible:ring-[#E5252A] focus-visible:outline-none"
                  >
                    <span>All Orders History</span>
                    <ChevronRight className="w-4 h-4 text-[#737373]" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#0A0A0A] text-xs font-bold rounded-lg flex items-center justify-between border border-[#E5E5E5] transition-colors focus-visible:ring-2 focus-visible:ring-[#E5252A] focus-visible:outline-none"
                >
                  <span>Existing Customer? Sign In</span>
                  <ChevronRight className="w-4 h-4 text-[#737373]" />
                </Link>
              )}

              <Link
                to="/products"
                className="w-full py-2.5 px-4 bg-[#E5252A] hover:bg-[#D01F24] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:outline-none"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
