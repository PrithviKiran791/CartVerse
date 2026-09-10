import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartBuildBundle, Product, PCBuildState } from '../types/hardware';
import { useAuthStore } from './useAuthStore';
import { useToastStore } from './useToastStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface CartStore {
  items: CartItem[];
  bundles: CartBuildBundle[];
  isCartOpen: boolean;
  couponCode: string;
  discountPercentage: number;
  discountAmount: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addBuildBundle: (build: PCBuildState, title?: string) => void;
  removeBundle: (bundleId: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  syncWithServer: () => Promise<void>;

  // Selectors
  getItemsCount: () => number;
  getSubtotal: () => number;
  getGstAmount: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
}

// Background sync helper
const syncToServer = async (items: CartItem[], bundles: CartBuildBundle[]) => {
  const token = useAuthStore.getState().token;
  if (!token) return;

  try {
    const formattedItems = [
      ...items.map((i) => ({
        product: i.product.id || i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.imageSlug,
      })),
      ...bundles.map((b) => ({
        buildBundle: b,
        name: b.title,
        price: b.totalPrice,
        quantity: 1,
        image: 'Pre-Built PC/Apex_Flagship.png',
      })),
    ];

    await fetch(`${BASE_URL}/cart/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: formattedItems }),
    });
  } catch (err) {
    // Non-blocking background sync error
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      bundles: [],
      isCartOpen: false,
      couponCode: '',
      discountPercentage: 0,
      discountAmount: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            : [...state.items, { product, quantity }];

          syncToServer(updatedItems, state.bundles);
          return { items: updatedItems, isCartOpen: true };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.product.id !== productId);
          syncToServer(updatedItems, state.bundles);
          return { items: updatedItems };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          );
          syncToServer(updatedItems, state.bundles);
          return { items: updatedItems };
        });
      },

      addBuildBundle: (build: PCBuildState, title?: string) => {
        const buildProducts = Object.values(build).filter((p): p is Product => p !== null);
        if (buildProducts.length === 0) return;

        const bundleItems: CartItem[] = buildProducts.map((p) => ({
          product: p,
          quantity: 1,
        }));

        const totalPrice = buildProducts.reduce((sum, p) => sum + p.price, 0);
        const totalWattage = buildProducts.reduce((sum, p) => sum + (p.specs.tdp || p.specs.wattage || 0), 0);

        const newBundle: CartBuildBundle = {
          id: `bundle-${Date.now()}`,
          title: title || `Custom PC Rig #${get().bundles.length + 1}`,
          build,
          items: bundleItems,
          totalPrice,
          totalWattage,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedBundles = [...state.bundles, newBundle];
          syncToServer(state.items, updatedBundles);
          useToastStore.getState().success(`Added "${newBundle.title}" to cart!`);
          return { bundles: updatedBundles, isCartOpen: true };
        });
      },

      removeBundle: (bundleId: string) => {
        set((state) => {
          const updatedBundles = state.bundles.filter((b) => b.id !== bundleId);
          syncToServer(state.items, updatedBundles);
          return { bundles: updatedBundles };
        });
      },

      applyCoupon: async (code: string) => {
        const clean = code.trim().toUpperCase();
        const toast = useToastStore.getState();
        const token = useAuthStore.getState().token;

        // Try server-side validation if authenticated
        if (token) {
          try {
            const res = await fetch(`${BASE_URL}/cart/coupon`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ code: clean }),
            });

            if (res.ok) {
              const data = await res.json();
              set({
                couponCode: clean,
                discountPercentage: data.cart?.coupon?.discountPercent || 0,
                discountAmount: data.cart?.coupon?.discountAmount || 0,
              });
              toast.success(data.message || `Promo code ${clean} applied!`);
              return true;
            }
          } catch (e) {
            // Fallback to client logic
          }
        }

        // Standard client promo coupons
        if (clean === 'CART10' || clean === 'RIGFORGE10' || clean === 'CARTVERSE10') {
          set({ couponCode: clean, discountPercentage: 10, discountAmount: 0 });
          toast.success(`Promo code ${clean} applied (10% Off)!`);
          return true;
        } else if (clean === 'BUILDER20') {
          set({ couponCode: clean, discountPercentage: 0, discountAmount: 2000 });
          toast.success(`Promo code ${clean} applied (₹2,000 Off)!`);
          return true;
        } else if (clean === 'RIGFORGE5' || clean === 'FIRSTBUILD') {
          set({ couponCode: clean, discountPercentage: 5, discountAmount: 0 });
          toast.success(`Promo code ${clean} applied (5% Off)!`);
          return true;
        }

        toast.error(`Invalid promo code '${clean}'. Try CART10 or BUILDER20.`);
        return false;
      },

      removeCoupon: async () => {
        const token = useAuthStore.getState().token;
        if (token) {
          try {
            await fetch(`${BASE_URL}/cart/coupon`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {}
        }
        set({ couponCode: '', discountPercentage: 0, discountAmount: 0 });
        useToastStore.getState().info('Coupon removed.');
      },

      clearCart: () => {
        const token = useAuthStore.getState().token;
        if (token) {
          fetch(`${BASE_URL}/cart`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
        }
        set({ items: [], bundles: [], couponCode: '', discountPercentage: 0, discountAmount: 0 });
      },

      syncWithServer: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
          const res = await fetch(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.coupon) {
              set({
                couponCode: data.coupon.code || '',
                discountPercentage: data.coupon.discountPercent || 0,
                discountAmount: data.coupon.discountAmount || 0,
              });
            }
          }
        } catch (e) {}
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      getItemsCount: () => {
        const itemQty = get().items.reduce((sum, i) => sum + i.quantity, 0);
        const bundleQty = get().bundles.reduce(
          (sum, b) => sum + b.items.reduce((bSum, i) => bSum + i.quantity, 0),
          0
        );
        return itemQty + bundleQty;
      },

      getSubtotal: () => {
        const itemSum = get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        const bundleSum = get().bundles.reduce((sum, b) => sum + b.totalPrice, 0);
        return itemSum + bundleSum;
      },

      getGstAmount: () => {
        const subtotal = get().getSubtotal();
        return Math.round((subtotal * 18) / 118);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercentage;
        const fixedAmt = get().discountAmount;

        if (pct > 0) {
          return Math.round((subtotal * pct) / 100);
        }
        if (fixedAmt > 0) {
          return Math.min(fixedAmt, subtotal);
        }
        return 0;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: 'cartverse-cart-storage',
      partialize: (state) => ({
        items: state.items,
        bundles: state.bundles,
        couponCode: state.couponCode,
        discountPercentage: state.discountPercentage,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
