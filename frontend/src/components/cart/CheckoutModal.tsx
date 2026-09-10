import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Truck, CreditCard, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import CloseButton from '../ui/CloseButton';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  gstAmount: number;
  itemsCount: number;
  onOrderSuccess: () => void;
}

// Dynamically load Razorpay checkout script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  grandTotal,
  gstAmount,
  itemsCount,
  onOrderSuccess,
}) => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { items, bundles, clearCart, getSubtotal } = useCartStore();
  const toast = useToastStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'emi'>('card');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Flatten items for order payload
  const prepareOrderItems = () => {
    const list: any[] = [];
    items.forEach((i) => {
      list.push({
        product: i.product.id || i.product._id,
        name: i.product.name,
        price: i.product.price,
        qty: i.quantity,
        image: i.product.imageSlug,
      });
    });

    bundles.forEach((b) => {
      b.items.forEach((item) => {
        list.push({
          product: item.product.id || item.product._id,
          name: `${b.title}: ${item.product.name}`,
          price: item.product.price,
          qty: item.quantity,
          image: item.product.imageSlug,
        });
      });
    });
    return list;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      toast.error('A valid email address is required for order updates and tracking.');
      setIsProcessing(false);
      return;
    }

    const subtotal = getSubtotal();
    const orderItems = prepareOrderItems();

    if (orderItems.length === 0) {
      toast.error('Your cart is empty.');
      setIsProcessing(false);
      return;
    }

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

      // 1. Cash on Delivery (COD) Flow
      if (paymentMethod === 'cod') {
        const orderPayload = {
          orderItems,
          shippingAddress: formData,
          paymentMethod: 'cod',
          itemsPrice: subtotal,
          taxPrice: gstAmount,
          shippingPrice: subtotal > 5000 ? 0 : 299,
          totalPrice: grandTotal,
          guestEmail: formData.email.trim().toLowerCase(),
        };

        const res = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(orderPayload),
        });

        const newGuestId = res.headers.get('x-guest-id');
        if (newGuestId) {
          localStorage.setItem('cartverse_guest_id', newGuestId);
        }

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to place COD order');
        }

        const createdOrder = await res.json();
        clearCart();
        onOrderSuccess();
        onClose();
        navigate(`/order-confirmation/${createdOrder._id}?email=${encodeURIComponent(formData.email.trim())}`);
        return;
      }

      // 2. Razorpay Digital Payment Gateway Flow
      const createRes = await fetch(`${BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: formData,
          guestEmail: formData.email.trim().toLowerCase(),
        }),
      });

      const paymentGuestId = createRes.headers.get('x-guest-id');
      if (paymentGuestId) {
        localStorage.setItem('cartverse_guest_id', paymentGuestId);
      }

      if (!createRes.ok) {
        throw new Error('Failed to initiate payment gateway session');
      }

      const paymentData = await createRes.json();
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !(window as any).Razorpay || paymentData.isTestMode) {
        // Fallback test verification simulation if offline or test mode
        const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            orderId: paymentData.orderId,
            razorpay_order_id: paymentData.razorpayOrderId,
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: 'test_signature_mock',
            shippingAddress: formData,
            orderItems,
            itemsPrice: subtotal,
            taxPrice: gstAmount,
            shippingPrice: subtotal > 5000 ? 0 : 299,
            totalPrice: grandTotal,
            guestEmail: formData.email.trim().toLowerCase(),
          }),
        });

        if (!verifyRes.ok) throw new Error('Payment verification failed');
        const confirmedOrder = await verifyRes.json();

        clearCart();
        onOrderSuccess();
        onClose();
        navigate(`/order-confirmation/${confirmedOrder._id}?email=${encodeURIComponent(formData.email.trim())}`);
        return;
      }

      // Open Official Razorpay Checkout Modal
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: 'CartVerse PC Studio',
        description: `Order Payment for ${itemsCount} items`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#E31B23',
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify({
                orderId: paymentData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: formData,
                orderItems,
                itemsPrice: subtotal,
                taxPrice: gstAmount,
                shippingPrice: subtotal > 5000 ? 0 : 299,
                totalPrice: grandTotal,
                guestEmail: formData.email.trim().toLowerCase(),
              }),
            });

            if (!verifyRes.ok) throw new Error('Payment signature mismatch');
            const verifiedOrder = await verifyRes.json();

            clearCart();
            onOrderSuccess();
            onClose();
            navigate(`/order-confirmation/${verifiedOrder._id}?email=${encodeURIComponent(formData.email.trim())}`);
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false);
            toast.info('Payment checkout dismissed');
            if (paymentData.orderId) {
              await fetch(`${BASE_URL}/payments/fail`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                  orderId: paymentData.orderId,
                  razorpay_order_id: paymentData.razorpayOrderId,
                  failureReason: 'Customer dismissed payment gateway dialog',
                }),
              });
              onClose();
              navigate(`/order-confirmation/${paymentData.orderId}?email=${encodeURIComponent(formData.email.trim())}`);
            }
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        setIsProcessing(false);
        toast.error(`Payment Failed: ${response.error?.description || 'Transaction declined'}`);
        if (paymentData.orderId) {
          await fetch(`${BASE_URL}/payments/fail`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              orderId: paymentData.orderId,
              razorpay_order_id: paymentData.razorpayOrderId,
              razorpay_payment_id: response.error?.metadata?.payment_id,
              failureReason: response.error?.description || response.error?.code || 'Transaction declined',
              rawGatewayPayload: response.error,
            }),
          });
          onClose();
          navigate(`/order-confirmation/${paymentData.orderId}`);
        }
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || 'Error communicating with checkout server');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Express Checkout</h3>
                <p className="text-xs text-neutral-400">
                  {itemsCount} Items · Total: {formatCurrency(grandTotal)}
                </p>
              </div>
            </div>
            <CloseButton onClick={onClose} size="lg" variant="flat" />
          </div>

          {/* Form */}
          <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-6">
            {!user && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600/15 via-red-500/10 to-transparent border border-red-500/30 text-xs flex items-start gap-3 shadow-inner">
                <div className="p-1 rounded-lg bg-red-600/20 text-red-500 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-white font-rajdhani uppercase tracking-wider">Guest Checkout Active</p>
                  <p className="text-[11px] text-neutral-300 font-sans mt-0.5">
                    No account or password required! Complete your order directly. An instant digital receipt and live tracking reference will be sent to your email.
                  </p>
                </div>
              </div>
            )}

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
                    placeholder="e.g. Alex Mercer"
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
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    Email Address <span className="text-red-500">*</span> (For Live Tracking & Invoice)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500 font-sans"
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
                Payment Gateway (Razorpay Secured)
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
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
                  <div className="text-[10px] text-neutral-500 mt-0.5">Razorpay Secured (Visa / MC / RuPay)</div>
                </button>

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
                  <div className="text-[10px] text-neutral-500 mt-0.5">Pay at Doorstep</div>
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-1.5 text-xs font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-white">{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%):</span>
                <span className="text-white">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Total Payable:</span>
                <span className="text-emerald-400">{formatCurrency(grandTotal)}</span>
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
                {isProcessing
                  ? 'Authorizing Secure Payment...'
                  : `Pay & Place Order (${formatCurrency(grandTotal)})`}
              </span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
