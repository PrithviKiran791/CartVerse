import { Product, BuilderSlotKey } from '../types/hardware';
import { usePCBuilderStore } from '../store/usePCBuilderStore';
import { store } from '../store/redux/store';
import { setComponent } from '../store/redux/pcBuilderSlice';
import { useToastStore } from '../store/useToastStore';

export function mapCategoryToSlot(category: string): BuilderSlotKey | null {
  switch (category) {
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
      return 'headphones';
    default:
      return null;
  }
}

export function addProductToPCBuild(product: Product): { success: boolean; message: string; warning?: string } {
  const slot = mapCategoryToSlot(product.category);
  const toast = useToastStore.getState();

  if (!slot) {
    toast.error('Cannot add this component directly to custom PC build slots.');
    return {
      success: false,
      message: 'This component category cannot be slotted directly into the PC Builder.',
    };
  }

  const currentBuild = usePCBuilderStore.getState().build;

  // Compatibility check for CPU & Motherboard
  let warning: string | undefined;
  if (slot === 'cpu' && currentBuild.motherboard) {
    const cpuSocket = product.specs?.socket;
    const mbSocket = currentBuild.motherboard.specs?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      warning = `Socket Conflict: This CPU requires ${cpuSocket}, but your selected motherboard uses ${mbSocket}.`;
    }
  } else if (slot === 'motherboard' && currentBuild.cpu) {
    const mbSocket = product.specs?.socket;
    const cpuSocket = currentBuild.cpu.specs?.socket;
    if (mbSocket && cpuSocket && mbSocket !== cpuSocket) {
      warning = `Socket Conflict: This Motherboard uses ${mbSocket}, but your selected CPU requires ${cpuSocket}.`;
    }
  }

  // Update Zustand PC Builder store
  usePCBuilderStore.getState().setSlot(slot, product);

  // Update Redux pcBuilder slice
  const reduxSlotMap: Record<string, any> = {
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
    cables: 'cables',
  };

  const reduxSlot = reduxSlotMap[slot] || 'cpu';
  store.dispatch(setComponent({ slot: reduxSlot, product }));

  if (warning) {
    toast.warning(`Added to Build: ${product.name}. Warning: ${warning}`);
  } else {
    toast.success(`Added ${product.name} to PC Builder (${slot.toUpperCase()} slot).`);
  }

  return {
    success: true,
    message: `Added to PC Builder (${slot.toUpperCase()})`,
    warning,
  };
}
