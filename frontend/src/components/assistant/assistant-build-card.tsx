import React from 'react';
import { ShoppingBag, Wrench, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PCBuildState, Product } from '../../types/hardware';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { useToastStore } from '../../store/useToastStore';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useNavigate } from 'react-router-dom';

interface AssistantBuildCardProps {
  title?: string;
  build: Partial<PCBuildState>;
  estimatedTotal?: number;
  estimatedWattage?: number;
  notes?: string;
}

export const AssistantBuildCard: React.FC<AssistantBuildCardProps> = ({
  title = 'Recommended Custom Rig',
  build,
  estimatedTotal,
  estimatedWattage,
  notes,
}) => {
  const { addBuildBundle, openCart } = useCartStore();
  const { setSlot } = usePCBuilderStore();
  const toast = useToastStore.getState();
  const { closeAssistant } = useAssistantStore();
  const navigate = useNavigate();

  const partsList = Object.entries(build).filter(([_, product]) => Boolean(product)) as [
    string,
    Product
  ][];

  const computedTotal =
    estimatedTotal || partsList.reduce((sum, [_, product]) => sum + (product?.price || 0), 0);
  const computedWattage =
    estimatedWattage ||
    partsList.reduce(
      (sum, [_, product]) => sum + (product?.specs?.tdp || product?.specs?.wattage || 0),
      0
    );

  const handleApplyToBuilder = () => {
    partsList.forEach(([slot, product]) => {
      setSlot(slot as any, product);
    });
    toast.success('Applied components to your PC Builder studio!');
    closeAssistant();
    navigate('/builder');
  };

  const handleAddBundleToCart = () => {
    // Fill full build state
    const fullBuild: PCBuildState = {
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
      ...build,
    };
    addBuildBundle(fullBuild, title);
    toast.success(`Added ${title} bundle to your cart!`);
    openCart();
  };

  return (
    <div className="my-3 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
            <span>{partsList.length} components</span>
            {computedWattage > 0 && <span>• Est. {formatWattage(computedWattage)}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-[#FF1E2D]">
            {formatCurrency(computedTotal)}
          </div>
          <div className="text-[10px] text-neutral-400">Total Est.</div>
        </div>
      </div>

      {/* Parts list */}
      <div className="p-3 space-y-1.5 max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
        {partsList.map(([slot, product]) => (
          <div key={slot} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 w-16 shrink-0 truncate">
              {slot}
            </span>
            <span className="text-neutral-800 dark:text-neutral-200 truncate flex-1 font-medium">
              {product.name}
            </span>
            <span className="text-neutral-600 dark:text-neutral-300 shrink-0 font-semibold text-[11px]">
              {formatCurrency(product.price)}
            </span>
          </div>
        ))}
      </div>

      {notes && (
        <div className="px-3 py-1.5 bg-amber-50/50 dark:bg-amber-950/20 border-t border-amber-200/40 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-300">
          {notes}
        </div>
      )}

      {/* Actions */}
      <div className="p-2.5 bg-neutral-50/50 dark:bg-neutral-800/30 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
        <button
          onClick={handleApplyToBuilder}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Wrench className="w-3 h-3" />
          Load in Builder
        </button>
        <button
          onClick={handleAddBundleToCart}
          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3 h-3" />
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
};
