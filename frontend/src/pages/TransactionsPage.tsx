import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Clock,
  ArrowLeft,
  Receipt,
  Download,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Boxes } from '../components/ui/background-boxes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();
  const toast = useToastStore();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTransactions = async (targetPage = 1) => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/transactions?page=${targetPage}&limit=10`, {
        headers,
      });

      if (!res.ok) throw new Error('Failed to retrieve financial transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotalPages(data.pages || 1);
      setPage(data.page || 1);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      toast.error(err.message || 'Unable to load billing statement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions(1);
    }
  }, [token]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'captured':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400';
      case 'refunded':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-400';
      case 'failed':
        return 'bg-red-950/60 border-red-500/40 text-red-400';
      case 'authorized':
        return 'bg-blue-950/60 border-blue-500/40 text-blue-400';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-400';
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden bg-[#0A0A0C]">
      {/* Aceternity Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A0C]/85 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-40" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400">
            Financial Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Billing & Transaction History
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official gateway payment audit log across all hardware orders and refunds.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/orders"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all border border-neutral-800"
          >
            <Receipt className="w-3.5 h-3.5 text-red-400" />
            <span>Orders History</span>
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
            <span>Store Catalog</span>
          </Link>
        </div>
      </div>

      {/* Transactions Table Container */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">Loading transaction telemetry...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <CreditCard className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Transactions Recorded</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You don't have any financial transactions or payment gateway events recorded yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-950/40"
          >
            <span>Explore Hardware</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 text-[10px] uppercase tracking-wider">
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Associated Order</th>
                    <th className="p-4 font-semibold">Gateway</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Amount (₹)</th>
                    <th className="p-4 font-semibold">Payment / Ref ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {transactions.map((tx: any) => {
                    const orderIdStr = tx.orderId?._id || tx.orderId;
                    return (
                      <tr key={tx._id} className="hover:bg-neutral-850/50 transition-colors">
                        <td className="p-4 text-neutral-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-4">
                          {orderIdStr ? (
                            <Link
                              to={`/orders/${orderIdStr}`}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
                            >
                              <span>#{String(orderIdStr).substring(0, 8)}...</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-neutral-500">—</span>
                          )}
                        </td>
                        <td className="p-4 uppercase font-bold text-white">{tx.gateway}</td>
                        <td className="p-4 capitalize">
                          <span className={tx.type === 'refund' ? 'text-purple-400' : 'text-neutral-200'}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${getStatusBadge(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-white whitespace-nowrap">
                          {formatCurrency(tx.amount / 100)}
                        </td>
                        <td className="p-4 text-neutral-400 max-w-[140px] truncate" title={tx.razorpayPaymentId || tx.razorpayOrderId}>
                          {tx.razorpayPaymentId || tx.razorpayOrderId || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchTransactions(page - 1)}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 disabled:opacity-40 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-mono text-neutral-400 px-3">
                Page {page} of {totalPages} ({totalCount} total events)
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => fetchTransactions(page + 1)}
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

export default TransactionsPage;
