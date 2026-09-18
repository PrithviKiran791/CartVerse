import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Calendar,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  AlertCircle,
  CreditCard,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Receipt,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { getComponentImage } from '../utils/assetRegistry';
import { Boxes } from '../components/ui/background-boxes';

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

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const toast = useToastStore();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [expandedBuilds, setExpandedBuilds] = useState<Record<string, boolean>>({});

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/orders/${orderId}`, { headers });
      if (res.status === 403) {
        throw new Error('You do not have authorization to view this order.');
      }
      if (!res.ok) {
        throw new Error('Order not found.');
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId, token]);

  const handleReorder = () => {
    if (!order?.orderItems || order.orderItems.length === 0) return;

    order.orderItems.forEach((item: any) => {
      addItem(
        {
          id: item.product || `item-${Date.now()}`,
          name: item.name,
          price: item.price,
          category: 'gpu',
          imageSlug: item.image,
          stock: 10,
          rating: 5,
          reviewsCount: 1,
          specs: {},
          description: item.name,
          sku: `SKU-${Date.now()}`,
        },
        item.qty || 1
      );
    });

    toast.success(`Reordered ${order.orderItems.length} items to cart at current catalog prices.`);
    useCartStore.getState().openCart();
  };

  const handleRetryPayment = async () => {
    if (!order || !token) return;
    const currentOrderId = order.id || order._id;
    setIsRetrying(true);
    try {
      const res = await fetch(`${BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: currentOrderId,
        }),
      });

      if (!res.ok) throw new Error('Failed to initiate payment retry');
      const paymentData = await res.json();
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !(window as any).Razorpay || paymentData.isTestMode) {
        const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: currentOrderId,
            razorpay_order_id: paymentData.razorpayOrderId,
            razorpay_payment_id: `pay_retry_${Date.now()}`,
            razorpay_signature: 'test_signature_mock',
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
                orderId: currentOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error('Signature mismatch');
            const verified = await verifyRes.json();
            setOrder(verified);
            toast.success('Payment authorized and order confirmed!');
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
                failureReason: 'User dismissed retry payment modal',
              }),
            });
            toast.warning('Payment was not completed.');
            fetchOrderDetail();
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Could not retry payment');
    } finally {
      setIsRetrying(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400';
      case 'shipped':
        return 'bg-blue-950/60 border-blue-500/40 text-blue-400';
      case 'processing':
        return 'bg-amber-950/60 border-amber-500/40 text-amber-400';
      case 'cancelled':
        return 'bg-red-950/60 border-[#FF1E2D]/40 text-[#FF1E2D]';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-300';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400';
      case 'refunded':
      case 'partially_refunded':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-400';
      case 'failed':
        return 'bg-red-950/60 border-[#FF1E2D]/40 text-[#FF1E2D]';
      default:
        return 'bg-amber-950/60 border-amber-500/40 text-amber-400';
    }
  };

  const getTxStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'captured':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400';
      case 'refunded':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-400';
      case 'failed':
        return 'bg-red-950/60 border-[#FF1E2D]/40 text-[#FF1E2D]';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF1E2D] border-t-transparent animate-spin" />
        <p className="text-xs font-sans text-neutral-400">Loading order details and transaction ledger...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-[#FF1E2D]/30 flex items-center justify-center text-[#FF1E2D] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Order Not Found</h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-md">
          {error || 'The requested order reference could not be located.'}
        </p>
        <Link
          to="/orders"
          className="mt-6 px-5 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order History</span>
        </Link>
      </div>
    );
  }

  const transactions = order.transactions || [];
  const needsPayment = order.paymentStatus === 'failed' || (!order.isPaid && order.paymentMethod !== 'cod');

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden bg-[#0A0A0C]">
      {/* Aceternity Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A0C]/85 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-40" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
            <Link to="/orders" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
            <span>/</span>
            <span className="text-white font-bold">#{order.id || order._id}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              Order #{(order.id || order._id || '').substring(0, 10)}...
            </h1>
            <span className={`text-[10px] font-sans font-bold uppercase px-2.5 py-0.5 rounded border ${getOrderStatusBadge(order.status)}`}>
              {order.status || 'PLACED'}
            </span>
            <span className={`text-[10px] font-sans font-bold uppercase px-2.5 py-0.5 rounded border ${getPaymentStatusBadge(order.paymentStatus)}`}>
              {order.paymentStatus?.toUpperCase() || (order.isPaid ? 'PAID' : 'PENDING')}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {needsPayment && (
            <button
              type="button"
              disabled={isRetrying}
              onClick={handleRetryPayment}
              className="px-4 py-2 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#FF1E2D]/30"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Retry Payment'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReorder}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-neutral-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span>Reorder Items</span>
          </button>
        </div>
      </div>

      {/* Fulfillment Status Timeline */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#FF1E2D]" />
          <span>Fulfillment Lifecycle Timeline</span>
        </h3>

        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-sans">
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-bold block">Order Placed</span>
            <span className="text-neutral-400 text-[9px] block">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="space-y-1">
            <div
              className={`h-2 rounded-full ${
                order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                  ? 'bg-emerald-500'
                  : 'bg-neutral-800'
              }`}
            />
            <span
              className={`font-bold block ${
                order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                  ? 'text-emerald-400'
                  : 'text-neutral-400'
              }`}
            >
              Processing
            </span>
            <span className="text-neutral-400 text-[9px] block">Verified QA</span>
          </div>

          <div className="space-y-1">
            <div
              className={`h-2 rounded-full ${
                order.status === 'shipped' || order.status === 'delivered' ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            />
            <span
              className={`font-bold block ${
                order.status === 'shipped' || order.status === 'delivered' ? 'text-emerald-400' : 'text-neutral-400'
              }`}
            >
              Dispatched
            </span>
            <span className="text-neutral-400 text-[9px] block">Standard Air</span>
          </div>

          <div className="space-y-1">
            <div
              className={`h-2 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            />
            <span className={`font-bold block ${order.status === 'delivered' ? 'text-emerald-400' : 'text-neutral-400'}`}>
              Delivered
            </span>
            <span className="text-neutral-400 text-[9px] block">
              {order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Items & Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items List */}
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF1E2D]" />
              <span>Line Items ({order.orderItems?.length || 0})</span>
            </h3>
            <span className="text-xs font-sans text-neutral-400">Insured Delivery</span>
          </div>

          <div className="space-y-3 divide-y divide-neutral-800/60">
            {order.orderItems?.map((item: any, idx: number) => {
              const imgUrl = getComponentImage(item.image || item.imageSlug);
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
                          onClick={() => setExpandedBuilds((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isBundle && isExpanded && (
                    <div className="ml-15 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] font-sans text-neutral-400 space-y-1">
                      <div className="text-[#FF1E2D] font-bold">Custom PC Rig Component Specification</div>
                      <div>Components pre-tested and validated against compatibility matrix before shipment.</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing derived from server storage */}
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
              <span>Shipping:</span>
              <span className="text-emerald-400">
                {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Order Total:</span>
              <span className="text-[#FF1E2D]">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Address */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#FF1E2D]" />
              <span>Destination Address</span>
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

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5 text-[#FF1E2D]" />
              <span>Payment Overview</span>
            </h4>
            <div className="text-xs text-neutral-400 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-white uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment State:</span>
                <span className="text-white font-bold uppercase">{order.paymentStatus || (order.isPaid ? 'PAID' : 'PENDING')}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Date:</span>
                <span className="text-neutral-300">
                  {order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Transactions Panel */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FF1E2D]" />
              <span>Payment Gateway Transaction Log</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Audit trail of every financial attempt, capture, and refund tied to this order.
            </p>
          </div>
          <span className="text-xs font-sans text-neutral-400 bg-neutral-950 px-3 py-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
            {transactions.length} record(s)
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 font-sans">
            No gateway transactions recorded for this order yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-neutral-800/80 text-neutral-400 text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Attempt Date</th>
                  <th className="pb-3 font-semibold">Gateway</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount (₹)</th>
                  <th className="pb-3 font-semibold">Gateway Ref</th>
                  <th className="pb-3 font-semibold">Details / Failure Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                {transactions.map((tx: any, idx: number) => (
                  <tr key={tx.id || tx._id || idx} className="hover:bg-neutral-850/40 transition-colors">
                    <td className="py-3 text-neutral-400 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 uppercase font-bold text-white">{tx.gateway}</td>
                    <td className="py-3 capitalize">
                      <span className={tx.type === 'refund' ? 'text-purple-400' : 'text-neutral-200'}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${getTxStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-white whitespace-nowrap">
                      {formatCurrency(tx.amount / 100)}
                    </td>
                    <td className="py-3 text-neutral-400 max-w-[130px] truncate" title={tx.razorpayPaymentId || tx.razorpayOrderId}>
                      {tx.razorpayPaymentId || tx.razorpayOrderId || '—'}
                    </td>
                    <td className="py-3 text-[11px] text-neutral-400 max-w-[200px] truncate" title={tx.failureReason}>
                      {tx.failureReason ? (
                        <span className="text-[#FF1E2D] font-sans">{tx.failureReason}</span>
                      ) : tx.status === 'captured' ? (
                        <span className="text-emerald-400">Captured & Settled</span>
                      ) : (
                        <span>Initiated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
