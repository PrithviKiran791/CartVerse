import { Product, BuilderSlotKey, PCBuildState } from '../types/hardware';
import { usePCBuilderStore } from '../store/usePCBuilderStore';
import { store } from '../store/redux/store';
import { setComponent } from '../store/redux/pcBuilderSlice';
import { useToastStore } from '../store/useToastStore';
import { validateBuild } from './compatibilityEngine';

export function mapCategoryToSlot(category: string): BuilderSlotKey | null {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'cpu':
      return 'cpu';
    case 'gpu':
      return 'gpu';
    case 'motherboard':
      return 'motherboard';
    case 'ram':
      return 'ram';
    case 'ssd':
      return 'primaryStorage';
    case 'hdd':
      return 'secondaryStorage';
    case 'psu':
      return 'psu';
    case 'cooler':
      return 'cooler';
    case 'cabinet':
      return 'cabinet';
    case 'monitor':
      return 'monitor';
    case 'keyboard':
      return 'keyboard';
    case 'mouse':
      return 'mouse';
    case 'headphones':
    case 'speakers':
      return 'headphones';
    default:
      return null;
  }
}

export function addProductToPCBuild(product: Product): { success: boolean; message: string; warning?: string } {
  const slot = mapCategoryToSlot(product.category);
  const toast = useToastStore.getState();

  if (!slot) {
    toast.error(`Cannot slot '${product.name}' (${product.category.toUpperCase()}) directly into custom PC build slots.`);
    return {
      success: false,
      message: 'This component category cannot be slotted directly into the PC Builder.',
    };
  }

  const currentBuild = usePCBuilderStore.getState().build;
  const hypotheticalBuild: PCBuildState = {
    ...currentBuild,
    [slot]: product,
  };

  // Run full architectural compatibility check
  const report = validateBuild(hypotheticalBuild);
  let warning: string | undefined;

  if (report.errors.length > 0) {
    warning = report.errors[0];
  } else if (report.warnings.length > 0) {
    warning = report.warnings[0];
  }

  // Update Zustand PC Builder store
  usePCBuilderStore.getState().setSlot(slot, product);

  // Update Redux pcBuilder slice for compatibility
  const reduxSlotMap: Record<string, string> = {
    cpu: 'cpu',
    gpu: 'gpu',
    motherboard: 'motherboard',
    ram: 'ram',
    primaryStorage: 'storage',
    secondaryStorage: 'storage',
    psu: 'psu',
    cooler: 'cooler',
    cabinet: 'case',
    monitor: 'monitor',
    keyboard: 'keyboard',
    mouse: 'mouse',
    headphones: 'headphones',
  };

  const reduxSlot = reduxSlotMap[slot] || 'cpu';
  store.dispatch(setComponent({ slot: reduxSlot, product }));

  if (warning) {
    toast.warning(`Added to ${slot.toUpperCase()}: ${product.name}. Warning: ${warning}`);
  } else {
    toast.success(`Added ${product.name} to PC Builder (${slot.toUpperCase()} slot).`);
  }

  return {
    success: true,
    message: `Added to PC Builder (${slot.toUpperCase()})`,
    warning,
  };
}
