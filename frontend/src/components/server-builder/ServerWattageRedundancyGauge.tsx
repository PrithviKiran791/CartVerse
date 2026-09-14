import React from 'react';
import { Zap, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { ServerPsuSummary } from '../../store/useServerBuilderStore';
import { formatWattage } from '../../utils/formatters';

interface ServerWattageRedundancyGaugeProps {
  estimatedWattage: number;
  selectedPsuWattage?: number;
  psuMetrics: ServerPsuSummary;
}

export const ServerWattageRedundancyGauge: React.FC<ServerWattageRedundancyGaugeProps> = ({
  estimatedWattage,
  selectedPsuWattage = 0,
  psuMetrics,
}) => {
  const {
    recommendedPsuWattage,
    psuHeadroomPercentage,
    redundancyMode,
    perModuleLoadWatts,
    isRedundantSafe,
  } = psuMetrics;

  const hasPsu = selectedPsuWattage > 0;
  const isDeficit = hasPsu && selectedPsuWattage < estimatedWattage;
  const percentageOfPsu = hasPsu ? Math.min(100, Math.round((estimatedWattage / selectedPsuWattage) * 100)) : 0;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden shadow-xl flex flex-col justify-between h-full">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-white">
              Electrical Delivery & Redundancy
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                redundancyMode === 'N+1' || redundancyMode === 'N+N'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-400 border-amber-700/60'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {redundancyMode.toUpperCase()} REDUNDANCY
            </span>
          </div>
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-sans text-neutral-400 block mb-1">
              Estimated System Draw
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-sans text-white">
                {estimatedWattage}
              </span>
              <span className="text-xs font-sans text-neutral-400">W</span>
            </div>
            <span className="text-[9px] font-sans text-neutral-500 block mt-0.5">
              100% Sustained Compute Load
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-sans text-neutral-400 block mb-1">
              Selected PSU Module
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl sm:text-3xl font-black font-sans ${
                  hasPsu
                    ? isDeficit
                      ? 'text-red-500'
                      : 'text-amber-400'
                    : 'text-neutral-600'
                }`}
              >
                {hasPsu ? selectedPsuWattage : '---'}
              </span>
              <span className="text-xs font-sans text-neutral-400">W</span>
            </div>
            <span className="text-[9px] font-sans text-neutral-500 block mt-0.5">
              Recommended: {recommendedPsuWattage}W+
            </span>
          </div>
        </div>

        {/* Power Delivery Gauge Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-[11px] font-sans">
            <span className="text-neutral-400">PSU Utilization</span>
            <span
              className={`font-bold ${
                isDeficit
                  ? 'text-red-500'
                  : percentageOfPsu > 85
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {hasPsu ? `${percentageOfPsu}% of Single Module` : 'No PSU Selected'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDeficit
                  ? 'bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  : percentageOfPsu > 85
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-emerald-500 to-red-600 shadow-[0_0_8px_rgba(255, 30, 45,0.4)]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentageOfPsu))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Redundancy Math Breakdown */}
      <div className="pt-3 border-t border-neutral-800/80 font-sans text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-neutral-300">
          <span className="text-[#FF1E2D] font-medium">Active Load per Module:</span>
          <span className="font-bold text-white">
            {perModuleLoadWatts > 0 ? `${perModuleLoadWatts}W` : '0W'}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-300">
          <span className="text-[#FF1E2D] font-medium">Failover Reserve:</span>
          <span
            className={`font-bold ${
              isRedundantSafe ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {redundancyMode === 'single'
              ? 'None (Single-Point of Failure)'
              : `${psuHeadroomPercentage}% Headroom (Live Reserve)`}
          </span>
        </div>
      </div>
    </div>
  );
};
