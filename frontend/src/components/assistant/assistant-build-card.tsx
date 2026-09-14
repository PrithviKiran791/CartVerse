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
    <div className="my-3 rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#121215] overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] transition-all">
      {/* Header */}
      <div className="bg-neutral-100 dark:bg-[#18181C] p-3 border-b-2 border-neutral-900 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] text-[#FF1E2D] font-bold tracking-wider uppercase mb-0.5">
            // RIG_CONFIGURATION
          </div>
          <h4 className="text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <span>{partsList.length} UNITS</span>
            {computedWattage > 0 && <span>• EST. {formatWattage(computedWattage)}</span>}
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-xs font-bold text-[#FF1E2D]">
            {formatCurrency(computedTotal)}
          </div>
          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">TOTAL_EST</div>
        </div>
      </div>

      {/* Parts list */}
      <div className="p-3 space-y-2 max-h-48 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800/80 font-mono text-xs">
        {partsList.map(([slot, product]) => (
          <div key={slot} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold text-[#FF1E2D] w-16 shrink-0 truncate">
              {slot}
            </span>
            <span className="text-neutral-900 dark:text-neutral-200 truncate flex-1 font-medium text-xs">
              {product.name}
            </span>
            <span className="text-neutral-900 dark:text-neutral-100 shrink-0 font-bold text-[11px]">
              {formatCurrency(product.price)}
            </span>
          </div>
        ))}
      </div>

      {notes && (
        <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border-t-2 border-neutral-900 dark:border-neutral-800 text-[11px] font-mono text-amber-900 dark:text-amber-300">
          <span className="font-bold">// NOTE:</span> {notes}
        </div>
      )}

      {/* Actions */}
      <div className="p-2.5 bg-neutral-100 dark:bg-[#0E0E10] border-t-2 border-neutral-900 dark:border-neutral-800 flex items-center justify-end gap-2">
        <button
          onClick={handleApplyToBuilder}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-900 dark:text-neutral-200 bg-white dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:bg-neutral-100 dark:hover:bg-neutral-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <Wrench className="w-3 h-3" />
          Load in Builder
        </button>
        <button
          onClick={handleAddBundleToCart}
          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-mono uppercase tracking-wider font-bold bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-2 border-neutral-900 dark:border-neutral-700 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3" />
          Add Bundle
        </button>
      </div>
    </div>
  );
};
