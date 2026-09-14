import React from 'react';
import {
  Plus,
  Trash2,
  RefreshCw,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Box,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Snowflake,
  AlertCircle,
} from 'lucide-react';
import { Product, BuilderSlotKey, CompatibilityIssue } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { HardwareIcon, getHardwareIcon, isMonochromeHardwareIcon } from '../../utils/hardwareIcons';

interface ComponentSlotCardProps {
  slotKey: BuilderSlotKey;
  label: string;
  categoryName: string;
  selectedProduct: Product | null;
  onSelect: () => void;
  onRemove: () => void;
  conflictIssue?: CompatibilityIssue;
}

export const ComponentSlotCard: React.FC<ComponentSlotCardProps> = ({
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
        return Cpu;
      case 'motherboard':
        return Layers;
      case 'ram':
      case 'primaryStorage':
      case 'secondaryStorage':
        return HardDrive;
      case 'gpu':
        return Tv;
      case 'psu':
        return Zap;
      case 'cabinet':
        return Box;
      case 'cooler':
        return Snowflake;
      case 'monitor':
        return Monitor;
      case 'keyboard':
        return Keyboard;
      case 'mouse':
        return Mouse;
      case 'headphones':
        return Headphones;
      default:
        return Cpu;
    }
  };

  const Icon = getSlotIcon();
  const iconSrc = getHardwareIcon(slotKey);

  if (!selectedProduct) {
    return (
      <div
        onClick={onSelect}
        className="group relative bg-white/5 dark:bg-black/30 hover:bg-neutral-900/60 border-2 border-dashed border-neutral-700 dark:border-neutral-700 hover:border-[#FF1E2D] rounded-none p-4 sm:p-5 transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px]"
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-none bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-700 group-hover:border-[#FF1E2D] shadow-[2px_2px_0px_0px_#FF1E2D] flex items-center justify-center p-2.5 text-neutral-500 group-hover:text-[#FF1E2D] transition-all shrink-0">
            {iconSrc ? (
              <img
                src={iconSrc}
                alt={categoryName}
                className={`w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform group-hover:scale-110 ${
                  isMonochromeHardwareIcon(slotKey) ? 'dark:invert dark:brightness-125' : ''
                }`}
              />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF1E2D] font-bold">
              // {label}
            </div>
            <div className="text-sm font-mono font-bold text-neutral-300 group-hover:text-white transition-colors flex items-center gap-1.5 mt-0.5">
              <span>+ CHOOSE {categoryName.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSelect}
          className="rounded-none border-2 border-neutral-900 dark:border-neutral-700 hover:border-white bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white group-hover:text-[#FF1E2D] text-xs font-mono font-bold px-3.5 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#FF1E2D]" />
          <span>SELECT</span>
        </button>
      </div>
    );
  }

  const imgUrl = getComponentImage(selectedProduct.imageSlug, selectedProduct.category);

  return (
    <div
      className={`group relative bg-white dark:bg-[#121215] border-2 rounded-none p-4 sm:p-5 transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] ${
        conflictIssue
          ? 'border-[#FF1E2D] bg-[#FF1E2D]/10'
          : 'border-neutral-900 dark:border-neutral-700 hover:border-[#FF1E2D]'
      }`}
    >
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-none bg-neutral-100 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-700 p-1.5 flex items-center justify-center shrink-0 group-hover:border-[#FF1E2D] shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] transition-all">
          <img
            src={imgUrl}
            alt={selectedProduct.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {iconSrc && (
              <img
                src={iconSrc}
                alt=""
                className={`w-3.5 h-3.5 object-contain shrink-0 ${
                  isMonochromeHardwareIcon(slotKey) ? 'dark:invert dark:brightness-125' : ''
                }`}
              />
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF1E2D] font-bold">
              // {label}
            </span>
            <span className="text-[10px] font-mono text-[#FF1E2D] uppercase font-bold">
              • {selectedProduct.brand}
            </span>
          </div>

          <h4
            className="text-sm font-bold font-mono text-neutral-900 dark:text-white group-hover:text-[#FF1E2D] transition-colors truncate mt-0.5"
            title={selectedProduct.name}
          >
            {selectedProduct.name}
          </h4>

          {/* Specs Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 font-mono">
            {selectedProduct.specs.socket && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-cyan-600 dark:text-cyan-300 border border-neutral-300 dark:border-neutral-800">
                {selectedProduct.specs.socket}
              </span>
            )}
            {selectedProduct.specs.ramType && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-purple-600 dark:text-purple-300 border border-neutral-300 dark:border-neutral-800">
                {selectedProduct.specs.ramType}
              </span>
            )}
            {selectedProduct.specs.vram && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-emerald-600 dark:text-emerald-300 border border-neutral-300 dark:border-neutral-800">
                {selectedProduct.specs.vram}
              </span>
            )}
            {selectedProduct.specs.capacity && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-amber-600 dark:text-amber-300 border border-neutral-300 dark:border-neutral-800">
                {selectedProduct.specs.capacity}
              </span>
            )}
            {selectedProduct.specs.wattage && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-yellow-600 dark:text-yellow-300 border border-neutral-300 dark:border-neutral-800">
                {formatWattage(selectedProduct.specs.wattage)}
              </span>
            )}
            {selectedProduct.specs.tdp && (
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded-none text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-800">
                {formatWattage(selectedProduct.specs.tdp)} TDP
              </span>
            )}
          </div>

          {/* Warning badge if conflict */}
          {conflictIssue && (
            <div className="flex items-center gap-1.5 text-xs text-[#FF1E2D] font-mono font-bold mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{conflictIssue.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-200 dark:border-neutral-800">
        <div className="text-left sm:text-right font-mono">
          <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
            {formatCurrency(selectedProduct.price)}
          </span>
          <span className="text-[9px] text-[#FF1E2D] block font-bold uppercase">Incl. 18% GST</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelect}
            className="px-3 py-1.5 rounded-none border-2 border-neutral-900 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 text-xs font-mono font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span className="hidden md:inline">CHANGE</span>
          </button>

          <button
            onClick={onRemove}
            className="p-2 rounded-none bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            title="Remove from build"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSlotCard;
