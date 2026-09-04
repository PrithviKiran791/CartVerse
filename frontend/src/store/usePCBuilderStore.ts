import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PCBuildState, BuilderSlotKey, Product, CompatibilityReport } from '../types/hardware';
import { validateBuild, calculateEstimatedWattage } from '../utils/compatibilityEngine';
import { encodeBuildToUrl, decodeBuildFromUrl } from '../utils/formatters';
import { mockProducts } from '../data/mockProducts';
import { useCartStore } from './useCartStore';

const initialBuildState: PCBuildState = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  primaryStorage: null,
  secondaryStorage: null,
  psu: null,
  cabinet: null,
  cooler: null,
  monitor: null,
  keyboard: null,
  mouse: null,
  headphones: null,
};

interface PCBuilderStore {
  build: PCBuildState;
  activeSlotPicker: BuilderSlotKey | null;
  showOnlyCompatible: boolean;

  // Actions
  setSlot: (slotName: BuilderSlotKey, product: Product) => void;
  removeSlot: (slotName: BuilderSlotKey) => void;
  resetBuild: () => void;
  openSlotPicker: (slotName: BuilderSlotKey) => void;
  closeSlotPicker: () => void;
  toggleShowOnlyCompatible: () => void;
  loadBuildFromUrl: (urlParams: string) => boolean;
  getShareableUrl: () => string;
  addToCartAsBundle: (customTitle?: string) => void;

  // Selectors
  getCompatibilityReport: () => CompatibilityReport;
  getTotalPrice: () => number;
  getEstimatedWattage: () => number;
  getFilledSlotsCount: () => number;
  getTotalCoreSlotsCount: () => number;
}

export const usePCBuilderStore = create<PCBuilderStore>()(
  persist(
    (set, get) => ({
      build: initialBuildState,
      activeSlotPicker: null,
      showOnlyCompatible: true,

      setSlot: (slotName: BuilderSlotKey, product: Product) => {
        set((state) => ({
          build: {
            ...state.build,
            [slotName]: product,
          },
          activeSlotPicker: null, // Auto close modal after selection
        }));
      },

      removeSlot: (slotName: BuilderSlotKey) => {
        set((state) => ({
          build: {
            ...state.build,
            [slotName]: null,
          },
        }));
      },

      resetBuild: () => {
        set({ build: initialBuildState, activeSlotPicker: null });
      },

      openSlotPicker: (slotName: BuilderSlotKey) => {
        set({ activeSlotPicker: slotName });
      },

      closeSlotPicker: () => {
        set({ activeSlotPicker: null });
      },

      toggleShowOnlyCompatible: () => {
        set((state) => ({ showOnlyCompatible: !state.showOnlyCompatible }));
      },

      loadBuildFromUrl: (paramString: string) => {
        try {
          const restoredSlots = decodeBuildFromUrl(paramString, mockProducts);
          if (Object.keys(restoredSlots).length > 0) {
            set((state) => ({
              build: {
                ...state.build,
                ...restoredSlots,
              },
            }));
            return true;
          }
        } catch (e) {
          console.error('Failed to load build from url:', e);
        }
        return false;
      },

      getShareableUrl: () => {
        const query = encodeBuildToUrl(get().build);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return `${origin}/builder?${query}`;
      },

      addToCartAsBundle: (customTitle?: string) => {
        const build = get().build;
        useCartStore.getState().addBuildBundle(build, customTitle);
      },

      getCompatibilityReport: () => {
        return validateBuild(get().build);
      },

      getTotalPrice: () => {
        return Object.values(get().build).reduce((sum, p) => sum + (p?.price || 0), 0);
      },

      getEstimatedWattage: () => {
        return calculateEstimatedWattage(get().build);
      },

      getFilledSlotsCount: () => {
        return Object.values(get().build).filter((p) => p !== null).length;
      },

      getTotalCoreSlotsCount: () => 8, // CPU, Mobo, RAM, GPU, Storage, PSU, Cabinet, Cooler
    }),
    {
      name: 'cartverse-pc-builder-storage',
      partialize: (state) => ({
        build: state.build,
        showOnlyCompatible: state.showOnlyCompatible,
      }),
    }
  )
);
