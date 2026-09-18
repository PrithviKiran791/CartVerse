import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  Calendar,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  AlertCircle,
  Search,
  Filter,
  CreditCard,
  Copy,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { getComponentImage } from '../utils/assetRegistry';
import { Boxes } from '../components/ui/background-boxes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const toast = useToastStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async (targetPage = 1, status = 'all') => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const statusQuery = status !== 'all' ? `&status=${status}` : '';
      const res = await fetch(`${BASE_URL}/orders?page=${targetPage}&limit=6${statusQuery}`, {
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          useAuthStore.getState().logout();
          toast.error('Your session has expired. Please sign in again.');
          navigate('/login?redirect=/orders');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.orders || []);
      setOrders(list);
      setTotalPages(data.pages || 1);
      setPage(data.page || 1);
    } catch (err: any) {
      toast.error(err?.message || 'Unable to retrieve orders history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(1, activeStatus);
    }
  }, [token, activeStatus]);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!order.orderItems || order.orderItems.length === 0) return;

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

    toast.success(`Reordered ${order.orderItems.length} items to your cart!`);
    useCartStore.getState().openCart();
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

  // Filter orders by search query client-side
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderId = String(order.id || order._id || '');
    return (
      orderId.toLowerCase().includes(q) ||
      order.orderItems?.some((item: any) => item.name?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden bg-[#0A0A0C]">
      {/* Aceternity Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A0C]/85 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-40" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#FF1E2D]">
            Account Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Hardware Orders & History
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track real-time shipment dispatch, inspect gateway receipts, and reorder hardware components.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/account/transactions"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all border border-neutral-800"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span>Billing History</span>
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                activeStatus === status
                  ? 'bg-[#FF1E2D] text-white shadow-md shadow-[#FF1E2D]/30'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by ID or hardware name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-[#FF1E2D] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders List Content */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF1E2D] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">Retrieving order telemetry & history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Located</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `No orders matching '${searchQuery}'. Try adjusting your search query.`
              : activeStatus === 'all'
              ? "You haven't placed any hardware orders yet. Build your custom gaming PC or explore our flagship catalog!"
              : `No orders found with status '${activeStatus}'.`}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#FF1E2D]/30"
            >
              <span>Launch PC Builder</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderId = String(order.id || order._id || '');
            const shortId = orderId ? orderId.substring(0, 8) : 'ORD';
            return (
              <div
                key={orderId || Math.random().toString()}
                onClick={() => navigate(`/orders/${orderId}`)}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-neutral-700 transition-all cursor-pointer group"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white font-sans flex items-center gap-1.5">
                        #{shortId}...
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(orderId, e)}
                          title="Copy Full Order ID"
                          className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
                        >
                          {copiedId === orderId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </span>

                      {/* Visual distinction: Order Status Badge */}
                      <span
                        className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded border ${getOrderStatusBadge(
                          order.status
                        )}`}
                      >
                        Order: {order.status || 'PLACED'}
                      </span>

                      {/* Visual distinction: Payment Status Badge */}
                      <span
                        className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded border ${getPaymentStatusBadge(
                          order.paymentStatus
                        )}`}
                      >
                        Pay: {order.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <p className="text-[11px] font-sans text-neutral-400">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black font-sans text-white block">
                      {formatCurrency(order.totalPrice)}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-400">
                      {order.itemsCount || order.orderItems?.length || 0} items •{' '}
                      {order.paymentMethod?.toUpperCase() || 'RAZORPAY'}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails Stack */}
                <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
                  {order.orderItems?.map((item: any, i: number) => {
                    const imgUrl = getComponentImage(item.image || item.imageSlug);
                    return (
                      <div
                        key={i}
                        title={`${item.name} (${item.qty}x)`}
                        className="w-14 h-14 rounded-xl bg-neutral-950 p-1 flex items-center justify-center shrink-0 border border-neutral-800 relative group-hover:border-neutral-700 transition-colors"
                      >
                        <img src={imgUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                        {item.qty > 1 && (
                          <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-[#FF1E2D] text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {item.qty}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                  <button
                    type="button"
                    onClick={(e) => handleReorder(order, e)}
                    className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF1E2D]" />
                    <span>Reorder Components</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FF1E2D] group-hover:text-[#FF3B48] flex items-center gap-1 transition-colors">
                      <span>Inspect Details & Ledger</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FF1E2D]" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchOrders(page - 1, activeStatus)}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 disabled:opacity-40 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-sans text-neutral-400 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => fetchOrders(page + 1, activeStatus)}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 disabled:opacity-40 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default OrdersPage;
