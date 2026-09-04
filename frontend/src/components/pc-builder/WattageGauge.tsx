import React from 'react';
import { Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { formatWattage } from '../../utils/formatters';

interface WattageGaugeProps {
  estimatedWattage: number;
  recommendedPsuWattage: number;
  selectedPsuWattage?: number;
}

export const WattageGauge: React.FC<WattageGaugeProps> = ({
  estimatedWattage,
  recommendedPsuWattage,
  selectedPsuWattage,
}) => {
  // Determine gauge load percentage
  const maxScaleWattage = selectedPsuWattage ? Math.max(selectedPsuWattage, estimatedWattage) : recommendedPsuWattage * 1.3;
  const loadPercentage = maxScaleWattage > 0 ? Math.min(100, Math.round((estimatedWattage / maxScaleWattage) * 100)) : 0;

  // Determine load color
  let barColor = 'bg-emerald-500';
  let badgeText = 'Optimal Load';
  let badgeStyle = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';

  if (selectedPsuWattage) {
    const ratio = estimatedWattage / selectedPsuWattage;
    if (ratio > 1.0) {
      barColor = 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse';
      badgeText = 'Deficit / Overloaded';
      badgeStyle = 'text-red-400 bg-red-950/80 border-red-800';
    } else if (ratio > 0.8) {
      barColor = 'bg-amber-500 shadow-lg shadow-amber-500/30';
      badgeText = 'High Load (>80%)';
      badgeStyle = 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    } else {
      barColor = 'bg-emerald-500 shadow-lg shadow-emerald-500/30';
      badgeText = 'Safe 20%+ Headroom';
      badgeStyle = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    }
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Power & TDP Meter</h4>
            <p className="text-[10px] text-neutral-400">Dynamic load & transient headroom calculation</p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${badgeStyle}`}>
          {badgeText}
        </span>
      </div>

      {/* Main Wattage Readout */}
      <div className="grid grid-cols-2 gap-3 my-4 bg-neutral-950/60 p-3 rounded-xl border border-neutral-850">
        <div>
          <span className="text-[10px] uppercase font-mono text-neutral-500 block">Estimated Draw</span>
          <span className="text-xl font-black font-mono text-white tracking-tight">
            {formatWattage(estimatedWattage)}
          </span>
        </div>

        <div className="border-l border-neutral-850 pl-3">
          <span className="text-[10px] uppercase font-mono text-neutral-500 block">
            {selectedPsuWattage ? 'Selected PSU Rating' : 'Recommended PSU'}
          </span>
          <span className={`text-xl font-black font-mono tracking-tight ${selectedPsuWattage ? 'text-amber-400' : 'text-neutral-300'}`}>
            {formatWattage(selectedPsuWattage || recommendedPsuWattage)}
          </span>
        </div>
      </div>

      {/* Visual Bar Gauge */}
      <div className="space-y-1.5">
        <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.max(4, loadPercentage)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
          <span>0W</span>
          <span>{Math.round(maxScaleWattage / 2)}W</span>
          <span>{maxScaleWattage}W (Capacity)</span>
        </div>
      </div>
    </div>
  );
};

export default WattageGauge;
