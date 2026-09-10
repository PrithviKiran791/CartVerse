import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ServerBuildState,
  ServerSlotKey,
  Product,
  CompatibilityReport,
  CartItem,
} from '../types/hardware';
import {
  validateServerBuild,
  calculateEstimatedServerWattage,
  calculateServerPsuMetrics,
} from '../utils/compatibilityEngine';
import { useCartStore } from './useCartStore';
import { useToastStore } from './useToastStore';

export interface RackClearanceReport {
  chassisRackUnits: number;
  consumedRackUnits: number;
  isExceeded: boolean;
  gpuClearanceMm: { current: number; max: number; isExceeded: boolean };
}

export interface ServerPsuSummary {
  recommendedPsuWattage: number;
  psuHeadroomPercentage: number;
  redundancyMode: 'single' | 'N+1' | 'N+N';
  perModuleLoadWatts: number;
  isRedundantSafe: boolean;
}

const initialServerBuildState: ServerBuildState = {
  cpu: null,
  cpu2: null,
  motherboard: null,
  ram: null,
  gpu: null,
  primaryStorage: null,
  secondaryStorage: null,
  psu: null,
  cabinet: null,
  cooler: null,
  networkCard: null,
  raidController: null,
};

interface ServerBuilderStore {
  build: ServerBuildState;
  activeSlotPicker: ServerSlotKey | null;
  showOnlyCompatible: boolean;

  // Actions
  setSlot: (slotName: ServerSlotKey, product: Product) => void;
  removeSlot: (slotName: ServerSlotKey) => void;
  resetBuild: () => void;
  openSlotPicker: (slotName: ServerSlotKey) => void;
  closeSlotPicker: () => void;
  toggleShowOnlyCompatible: () => void;
  loadProfile: (profileBuild: Partial<ServerBuildState>) => void;
  addToCartAsBundle: (customTitle?: string) => void;

  // Selectors
  getCompatibilityReport: () => CompatibilityReport;
  getEstimatedWattage: () => number;
  getPsuMetrics: () => ServerPsuSummary;
  getRackClearance: () => RackClearanceReport;
  getTotalPrice: () => number;
  getFilledSlotsCount: () => number;
}

export const useServerBuilderStore = create<ServerBuilderStore>()(
  persist(
    (set, get) => ({
      build: initialServerBuildState,
      activeSlotPicker: null,
      showOnlyCompatible: true,

      setSlot: (slotName: ServerSlotKey, product: Product) => {
        set((state) => ({
          build: {
            ...state.build,
            [slotName]: product,
          },
          activeSlotPicker: null,
        }));
      },

      removeSlot: (slotName: ServerSlotKey) => {
        set((state) => ({
          build: {
            ...state.build,
            [slotName]: null,
          },
        }));
      },

      resetBuild: () => {
        set({ build: initialServerBuildState, activeSlotPicker: null });
      },

      openSlotPicker: (slotName: ServerSlotKey) => {
        set({ activeSlotPicker: slotName });
      },

      closeSlotPicker: () => {
        set({ activeSlotPicker: null });
      },

      toggleShowOnlyCompatible: () => {
        set((state) => ({ showOnlyCompatible: !state.showOnlyCompatible }));
      },

      loadProfile: (profileBuild: Partial<ServerBuildState>) => {
        set({
          build: {
            ...initialServerBuildState,
            ...profileBuild,
          },
          activeSlotPicker: null,
        });
      },

      addToCartAsBundle: (customTitle?: string) => {
        const { build } = get();
        const filledSlots = Object.entries(build).filter(
          ([, product]) => product !== null
        ) as [ServerSlotKey, Product][];

        if (filledSlots.length === 0) {
          useToastStore.getState().addToast({
            title: 'Configurator Empty',
            message: 'Select enterprise server components before adding to infrastructure order.',
            type: 'error',
          });
          return;
        }

        const report = validateServerBuild(build);
        if (!report.isCompatible) {
          useToastStore.getState().addToast({
            title: 'Compatibility Error',
            message: 'Resolve hardware architectural errors before adding server build to cart.',
            type: 'error',
          });
          return;
        }

        const cartStore = useCartStore.getState();
        const chassisName = build.cabinet?.name || 'Custom Rack Node';
        const bundleTitle = customTitle || `${chassisName} [Server Configuration]`;

        filledSlots.forEach(([, product]) => {
          cartStore.addItem(product, 1);
        });

        cartStore.openCart();

        useToastStore.getState().addToast({
          title: 'Infrastructure Order Updated',
          message: `Added ${filledSlots.length} components (${bundleTitle}) to your cart.`,
          type: 'success',
        });
      },

      getCompatibilityReport: () => {
        return validateServerBuild(get().build);
      },

      getEstimatedWattage: () => {
        return calculateEstimatedServerWattage(get().build);
      },

      getPsuMetrics: () => {
        const estimatedWattage = calculateEstimatedServerWattage(get().build);
        return calculateServerPsuMetrics(estimatedWattage, get().build.psu);
      },

      getRackClearance: () => {
        const { build } = get();
        const chassisU = build.cabinet?.rackUnits || (build.cabinet?.specs.rackUnits as number) || 0;
        const gpuU = build.gpu?.rackUnits || (build.gpu?.specs.rackUnits as number) || 0;
        const moboU = build.motherboard?.rackUnits || (build.motherboard?.specs.rackUnits as number) || 1;

        const consumedU = Math.max(gpuU, moboU);
        const isExceeded = chassisU > 0 && consumedU > chassisU;

        const gpuLength = build.gpu?.specs.gpuLengthMm || 0;
        const maxGpuLength = build.cabinet?.specs.maxGpuLengthMm || 350;
        const isGpuLengthExceeded = gpuLength > 0 && maxGpuLength > 0 && gpuLength > maxGpuLength;

        return {
          chassisRackUnits: chassisU,
          consumedRackUnits: consumedU,
          isExceeded,
          gpuClearanceMm: {
            current: gpuLength,
            max: maxGpuLength,
            isExceeded: isGpuLengthExceeded,
          },
        };
      },

      getTotalPrice: () => {
        const { build } = get();
        return Object.values(build).reduce((acc: number, product) => {
          return product ? acc + product.price : acc;
        }, 0);
      },

      getFilledSlotsCount: () => {
        const { build } = get();
        return Object.values(build).filter(Boolean).length;
      },
    }),
    {
      name: 'cartverse-server-builder-storage',
      partialize: (state) => ({
        build: state.build,
        showOnlyCompatible: state.showOnlyCompatible,
      }),
    }
  )
);
