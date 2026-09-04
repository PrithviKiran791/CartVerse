import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, Building, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  gstAmount: number;
  itemsCount: number;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  grandTotal,
  gstAmount,
  itemsCount,
  onOrderSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'emi'>('upi');
  const [formData, setFormData] = useState({
    name: 'Prithvi Kiran',
    phone: '+91 98765 43210',
    email: 'prithvi@cartverse.in',
    address: '#144, 100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1200);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onOrderSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {isSuccess ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Order Confirmed Successfully!</h2>
                <p className="text-xs text-neutral-400 mt-1.5 font-mono">
                  Order ID: #CV-{Math.floor(100000 + Math.random() * 900000)}
                </p>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Customer:</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Pincode:</span>
                  <span className="text-white font-mono">{formData.pincode} ({formData.city})</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GST Tax Breakdown (18%):</span>
                  <span className="text-neutral-300 font-mono">{formatCurrency(gstAmount)}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your hardware components will be dispatched via insured express air courier. Tracking details have been sent to your email.
              </p>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Return to Storefront
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Express Checkout</h3>
                    <p className="text-xs text-neutral-400">{itemsCount} Items · Total: {formatCurrency(grandTotal)}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-6">
                {/* Shipping Details */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-red-500" />
                    Delivery Destination
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Mobile Number (+91)</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-neutral-400 block mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">City / Town</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Pincode (India)</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    Payment Method
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-xs">UPI / QR Code</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Google Pay, PhonePe, Paytm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-xs">Credit / Debit Card</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Visa, Mastercard, RuPay</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emi')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'emi'
                          ? 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-xs">No-Cost EMI</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">3, 6, 9 or 12 Months</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-xs">Cash on Delivery</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Verified Pincodes Only</div>
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-sm transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Authorizing Secure Payment...' : `Authorize & Place Order (${formatCurrency(grandTotal)})`}
                  </span>
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
