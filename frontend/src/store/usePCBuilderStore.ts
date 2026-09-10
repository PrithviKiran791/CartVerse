import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PCBuildState, BuilderSlotKey, Product, CompatibilityReport } from '../types/hardware';
import { validateBuild, calculateEstimatedWattage } from '../utils/compatibilityEngine';
import { encodeBuildToUrl, decodeBuildFromUrl } from '../utils/formatters';
import { mockProducts } from '../data/mockProducts';
import { useCartStore } from './useCartStore';
import { useAuthStore } from './useAuthStore';
import { useToastStore } from './useToastStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  savedBuildSlug: string | null;
  isSavingBuild: boolean;

  // Actions
  setSlot: (slotName: BuilderSlotKey, product: Product) => void;
  removeSlot: (slotName: BuilderSlotKey) => void;
  resetBuild: () => void;
  openSlotPicker: (slotName: BuilderSlotKey) => void;
  closeSlotPicker: () => void;
  toggleShowOnlyCompatible: () => void;
  loadBuildFromUrl: (urlParams: string) => boolean;
  getShareableUrl: () => string;
  saveBuildToCloud: (buildName?: string) => Promise<string | null>;
  loadBuildFromCloud: (slugOrId: string) => Promise<boolean>;
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
      savedBuildSlug: null,
      isSavingBuild: false,

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
        set({ build: initialBuildState, activeSlotPicker: null, savedBuildSlug: null });
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

      saveBuildToCloud: async (buildName: string = 'Custom Gaming Rig') => {
        const build = get().build;
        const toast = useToastStore.getState();
        const token = useAuthStore.getState().token;

        const filledParts = Object.values(build).filter(Boolean);
        if (filledParts.length === 0) {
          toast.warning('Please select at least one component before saving your build.');
          return null;
        }

        set({ isSavingBuild: true });
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(`${BASE_URL}/builds`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name: buildName,
              components: build,
              isPublic: true,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save build');
          }

          const data = await response.json();
          set({ savedBuildSlug: data.shareSlug, isSavingBuild: false });
          toast.success(`Saved "${buildName}" to CartVerse Cloud!`);
          return data.shareSlug;
        } catch (err: any) {
          set({ isSavingBuild: false });
          toast.error('Failed to save build to cloud. You can still share via URL parameters.');
          return null;
        }
      },

      loadBuildFromCloud: async (slugOrId: string) => {
        const toast = useToastStore.getState();
        try {
          const response = await fetch(`${BASE_URL}/builds/${slugOrId}`);
          if (!response.ok) return false;
          const data = await response.json();
          if (data.components) {
            set({
              build: { ...initialBuildState, ...data.components },
              savedBuildSlug: data.shareSlug || slugOrId,
            });
            toast.success(`Loaded saved build: ${data.name}`);
            return true;
          }
        } catch (e) {
          console.error('Error loading build from cloud:', e);
        }
        return false;
      },

      getShareableUrl: () => {
        const slug = get().savedBuildSlug;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        if (slug) {
          return `${origin}/builder?build=${slug}`;
        }
        const query = encodeBuildToUrl(get().build);
        return `${origin}/builder?${query}`;
      },

      addToCartAsBundle: (customTitle?: string) => {
        const build = get().build;
        const filledSlots = Object.values(build).filter(Boolean);
        if (filledSlots.length === 0) {
          useToastStore.getState().warning('Your custom build is currently empty.');
          return;
        }
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
        savedBuildSlug: state.savedBuildSlug,
      }),
    }
  )
);
