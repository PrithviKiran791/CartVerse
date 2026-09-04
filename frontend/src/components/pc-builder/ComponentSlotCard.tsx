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

  if (!selectedProduct) {
    return (
      <div
        onClick={onSelect}
        className="group relative bg-neutral-900/40 hover:bg-neutral-850/80 border-2 border-dashed border-neutral-800 hover:border-red-500/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 group-hover:border-red-500/50 group-hover:bg-red-950/20 flex items-center justify-center text-neutral-500 group-hover:text-red-400 transition-all shrink-0">
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              {label}
            </div>
            <div className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors flex items-center gap-1.5 mt-0.5">
              <span>+ Choose {categoryName}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-neutral-800 group-hover:bg-red-600 text-neutral-300 group-hover:text-white text-xs font-bold transition-all shadow shrink-0 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Select</span>
        </button>
      </div>
    );
  }

  const imgUrl = getComponentImage(selectedProduct.imageSlug, selectedProduct.category);

  return (
    <div
      className={`group relative bg-neutral-900/90 border rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
        conflictIssue
          ? 'border-red-500/70 bg-red-950/20 shadow-red-950/30'
          : 'border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 p-1.5 flex items-center justify-center shrink-0 group-hover:border-red-500/40 transition-colors">
          <img
            src={imgUrl}
            alt={selectedProduct.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
              {label}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              • {selectedProduct.brand}
            </span>
          </div>

          <h4
            className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate mt-0.5"
            title={selectedProduct.name}
          >
            {selectedProduct.name}
          </h4>

          {/* Specs Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {selectedProduct.specs.socket && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-cyan-300 border border-neutral-800">
                {selectedProduct.specs.socket}
              </span>
            )}
            {selectedProduct.specs.ramType && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-purple-300 border border-neutral-800">
                {selectedProduct.specs.ramType}
              </span>
            )}
            {selectedProduct.specs.vram && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-emerald-300 border border-neutral-800">
                {selectedProduct.specs.vram}
              </span>
            )}
            {selectedProduct.specs.capacity && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-amber-300 border border-neutral-800">
                {selectedProduct.specs.capacity}
              </span>
            )}
            {selectedProduct.specs.wattage && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-yellow-300 border border-neutral-800">
                {formatWattage(selectedProduct.specs.wattage)}
              </span>
            )}
            {selectedProduct.specs.tdp && (
              <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">
                {formatWattage(selectedProduct.specs.tdp)} TDP
              </span>
            )}
          </div>

          {/* Warning badge if conflict */}
          {conflictIssue && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{conflictIssue.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
        <div className="text-left sm:text-right">
          <span className="text-base sm:text-lg font-black font-mono text-white">
            {formatCurrency(selectedProduct.price)}
          </span>
          <span className="text-[10px] text-neutral-500 block font-mono">Incl. 18% GST</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-neutral-700 cursor-pointer"
            title="Change Component"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Change</span>
          </button>

          <button
            onClick={onRemove}
            className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-400 hover:text-white transition-colors border border-red-900/60 cursor-pointer"
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
