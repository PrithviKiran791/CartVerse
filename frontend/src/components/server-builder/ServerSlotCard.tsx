import React from 'react';
import {
  Server,
  Cpu,
  Layers,
  HardDrive,
  Zap,
  Box,
  Plus,
  Trash2,
  AlertCircle,
  ShieldCheck,
  Check,
  Network,
  RotateCcw,
} from 'lucide-react';
import { ServerSlotKey, Product, CompatibilityIssue } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { HardwareIcon } from '../../utils/hardwareIcons';

interface ServerSlotCardProps {
  slotKey: ServerSlotKey;
  label: string;
  categoryName: string;
  selectedProduct: Product | null;
  onSelect: () => void;
  onRemove: () => void;
  conflictIssue?: CompatibilityIssue;
}

export const ServerSlotCard: React.FC<ServerSlotCardProps> = ({
  slotKey,
  label,
  categoryName,
  selectedProduct,
  onSelect,
  onRemove,
  conflictIssue,
}) => {
  const getSlotIcon = () => {
    switch (slotKey) {
      case 'cpu':
      case 'cpu2':
        return <Cpu className="w-5 h-5 text-red-500" />;
      case 'motherboard':
        return <Layers className="w-5 h-5 text-neutral-300" />;
      case 'ram':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'gpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'primaryStorage':
      case 'secondaryStorage':
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
      case 'psu':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'cabinet':
        return <Server className="w-5 h-5 text-red-400" />;
      case 'networkCard':
        return <Network className="w-5 h-5 text-blue-400" />;
      case 'raidController':
        return <ShieldCheck className="w-5 h-5 text-teal-400" />;
      default:
        return <Box className="w-5 h-5 text-neutral-400" />;
    }
  };

  const isConfigured = Boolean(selectedProduct);
  const imageUrl = selectedProduct
    ? getComponentImage(selectedProduct.imageSlug, selectedProduct.category)
    : '';

  return (
    <div
      className={`rounded-none border-2 font-mono transition-all duration-150 overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] ${
        conflictIssue
          ? 'bg-red-950/20 border-red-600'
          : isConfigured
          ? 'bg-white dark:bg-[#121215] border-neutral-900 dark:border-neutral-700'
          : 'bg-white/5 dark:bg-black/30 border-neutral-700 hover:border-[#FF1E2D] border-dashed'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Slot metadata & Selected Product */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Component Thumbnail or Placeholder Icon */}
          <div
            onClick={onSelect}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-none flex items-center justify-center shrink-0 border-2 cursor-pointer overflow-hidden transition-all duration-150 ${
              isConfigured
                ? 'bg-neutral-100 dark:bg-neutral-950 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] p-1.5'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white shadow-[2px_2px_0px_0px_#FF1E2D]'
            }`}
          >
            {isConfigured ? (
              <img
                src={imageUrl}
                alt={selectedProduct?.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <HardwareIcon
                name={slotKey === 'cpu2' ? 'cpu' : slotKey}
                className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110"
                fallback={getSlotIcon()}
              />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 font-mono">
            <div className="flex items-center gap-2 mb-1">
              <HardwareIcon name={slotKey === 'cpu2' ? 'cpu' : slotKey} className="w-3.5 h-3.5 object-contain shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 bg-red-950/40 px-2 py-0.5 rounded-none border border-red-900/50">
                // {label}
              </span>
              {selectedProduct?.brand && (
                <span className="text-[10px] font-mono text-neutral-400">
                  {selectedProduct.brand}
                </span>
              )}
            </div>

            {isConfigured ? (
              <div>
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate tracking-tight font-mono">
                  {selectedProduct?.name}
                </h4>

                {/* Key Spec Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-[10px] text-neutral-300">
                  {selectedProduct?.specs.socket && (
                    <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-none text-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                      Socket {selectedProduct.specs.socket}
                    </span>
                  )}
                  {selectedProduct?.specs.tdp && (
                    <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-none text-amber-600 dark:text-amber-400 border border-neutral-300 dark:border-neutral-700">
                      {selectedProduct.specs.tdp}W TDP
                    </span>
                  )}
                  {selectedProduct?.memoryType && (
                    <span className="bg-purple-950/60 px-2 py-0.5 rounded-none text-purple-300 border border-purple-800/50">
                      {selectedProduct.memoryType} ECC
                    </span>
                  )}
                  {selectedProduct?.rackUnits && (
                    <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-none text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      {selectedProduct.rackUnits}U Form
                    </span>
                  )}
                  {selectedProduct?.psuRedundancy && (
                    <span className="bg-emerald-950/60 px-2 py-0.5 rounded-none text-emerald-300 border border-emerald-800/50">
                      {selectedProduct.psuRedundancy} Power
                    </span>
                  )}
                  {selectedProduct?.specs.storageInterface && (
                    <span className="bg-cyan-950/60 px-2 py-0.5 rounded-none text-cyan-300 border border-cyan-800/50">
                      {selectedProduct.specs.storageInterface}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold font-mono text-neutral-300">
                  + CHOOSE {categoryName.toUpperCase()}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                  Pin socket, ECC RDIMM, and rack unit verified automatically
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Price */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2 font-mono">
          {isConfigured && (
            <div className="text-right">
              <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                {formatCurrency(selectedProduct!.price)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <button
                  onClick={onSelect}
                  className="px-3 py-1.5 rounded-none border-2 border-neutral-900 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Change
                </button>
                <button
                  onClick={onRemove}
                  className="p-1.5 rounded-none bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  title="Remove Component"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onSelect}
                className="px-4 py-2 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-900 dark:border-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {categoryName}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conflict / Rejection Warning Bar */}
      {conflictIssue && (
        <div className="bg-red-950 border-t-2 border-red-600 px-4 py-2.5 flex items-start gap-2 text-xs font-mono text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider block text-red-300 mb-0.5">
              // {conflictIssue.title}
            </span>
            <p className="text-[11px] leading-relaxed text-red-200/90">
              {conflictIssue.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
