import React from 'react';
import { ShoppingCart, RotateCcw, ShieldCheck, Zap, Server } from 'lucide-react';
import { useServerBuilderStore } from '../../store/useServerBuilderStore';
import { formatCurrency, formatWattage } from '../../utils/formatters';

export const ServerBuildSummaryBar: React.FC = () => {
  const {
    getTotalPrice,
    getEstimatedWattage,
    getPsuMetrics,
    getRackClearance,
    getFilledSlotsCount,
    getCompatibilityReport,
    resetBuild,
    addToCartAsBundle,
  } = useServerBuilderStore();

  const totalPrice = getTotalPrice();
  const estimatedWattage = getEstimatedWattage();
  const psuMetrics = getPsuMetrics();
  const rackClearance = getRackClearance();
  const filledSlots = getFilledSlotsCount();
  const report = getCompatibilityReport();

  return (
    <div className="sticky bottom-0 z-40 w-full bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Key Metrics (Price, Wattage, Rack, Redundancy) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-start">
          {/* Total Price */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Total Hardware Estimate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {formatCurrency(totalPrice)}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">INR</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Wattage Draw */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Compute Power Load
            </span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm sm:text-base font-bold font-mono text-white">
                {formatWattage(estimatedWattage)}
              </span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Rack Envelope */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Chassis Rack Units
            </span>
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-red-500" />
              <span
                className={`text-sm sm:text-base font-bold font-mono ${
                  rackClearance.isExceeded ? 'text-red-400 font-black' : 'text-white'
                }`}
              >
                {rackClearance.chassisRackUnits > 0
                  ? `${rackClearance.consumedRackUnits}U of ${rackClearance.chassisRackUnits}U`
                  : 'Pending'}
              </span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Redundancy */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Power Delivery
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm font-bold font-mono text-emerald-400">
                {psuMetrics.redundancyMode.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {filledSlots > 0 && (
            <button
              onClick={resetBuild}
              className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-mono border border-neutral-800 transition-colors flex items-center gap-1.5"
              title="Reset Configurator"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => addToCartAsBundle()}
            disabled={!report.isCompatible || filledSlots === 0}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
              report.isCompatible && filledSlots > 0
                ? 'bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/60 active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add Server Build to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
