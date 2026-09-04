import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartBuildBundle, Product, PCBuildState } from '../types/hardware';

interface CartStore {
  items: CartItem[];
  bundles: CartBuildBundle[];
  isCartOpen: boolean;
  couponCode: string;
  discountPercentage: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addBuildBundle: (build: PCBuildState, title?: string) => void;
  removeBundle: (bundleId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Selectors
  getItemsCount: () => number;
  getSubtotal: () => number;
  getGstAmount: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      bundles: [],
      isCartOpen: false,
      couponCode: '',
      discountPercentage: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isCartOpen: true,
            };
          }
          return {
            items: [...state.items, { product, quantity }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
        }));
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
          title: title || `Custom PC Build #${get().bundles.length + 1}`,
          build,
          items: bundleItems,
          totalPrice,
          totalWattage,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          bundles: [...state.bundles, newBundle],
          isCartOpen: true,
        }));
      },

      removeBundle: (bundleId: string) => {
        set((state) => ({
          bundles: state.bundles.filter((b) => b.id !== bundleId),
        }));
      },

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'RIGFORGE10' || clean === 'CARTVERSE10') {
          set({ couponCode: clean, discountPercentage: 10 });
          return true;
        } else if (clean === 'FIRSTBUILD' || clean === 'GENZ5') {
          set({ couponCode: clean, discountPercentage: 5 });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ couponCode: '', discountPercentage: 0 });
      },

      clearCart: () => {
        set({ items: [], bundles: [], couponCode: '', discountPercentage: 0 });
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
        // GST (18%) is already inclusive in Indian consumer retail prices, but displayed for tax transparency
        const subtotal = get().getSubtotal();
        return Math.round((subtotal * 18) / 118);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercentage;
        return pct > 0 ? Math.round((subtotal * pct) / 100) : 0;
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
      }),
    }
  )
);
