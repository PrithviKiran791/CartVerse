import React from 'react';
import { Server, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RackClearanceReport } from '../../store/useServerBuilderStore';

interface RackUnitGaugeProps {
  clearance: RackClearanceReport;
}

export const RackUnitGauge: React.FC<RackUnitGaugeProps> = ({ clearance }) => {
  const { chassisRackUnits, consumedRackUnits, isExceeded, gpuClearanceMm } = clearance;
  const maxUnits = chassisRackUnits || 4;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden shadow-xl flex flex-col justify-between h-full">
      {/* Background Rack Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-red-500" />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-white">
              Rack Unit Clearance
            </span>
          </div>
          <span
            className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border ${
              isExceeded
                ? 'bg-red-950/80 text-red-400 border-red-700/60'
                : chassisRackUnits > 0
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {isExceeded
              ? 'CLEARANCE OVERFLOW'
              : chassisRackUnits > 0
              ? 'RACK ENVELOPE VERIFIED'
              : 'CHASSIS NOT SELECTED'}
          </span>
        </div>

        {/* Visual Rack SVG Diagram */}
        <div className="my-3 flex items-center justify-center">
          <div className="w-full max-w-[280px] bg-neutral-950 border border-neutral-800 rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between text-[9px] font-sans text-neutral-500 pb-1.5 border-b border-neutral-800/60 mb-2">
              <span>RACK BAY [EIA-310]</span>
              <span>19-INCH SPEC</span>
            </div>

            {/* Stacked U Blocks */}
            <div className="space-y-1.5">
              {Array.from({ length: maxUnits }, (_, i) => {
                const uNumber = maxUnits - i; // Top U down to 1U
                const isOccupied = consumedRackUnits >= uNumber;
                const isOverflow = isExceeded && isOccupied;

                return (
                  <div
                    key={uNumber}
                    className={`h-7 rounded flex items-center justify-between px-3 font-sans text-xs transition-all duration-300 border ${
                      isOverflow
                        ? 'bg-red-950/90 border-red-600 text-red-300 shadow-md shadow-red-950'
                        : isOccupied
                        ? 'bg-gradient-to-r from-red-900/60 to-red-800/40 border-red-500/50 text-white font-bold'
                        : 'bg-neutral-900/50 border-neutral-800/80 text-neutral-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-wider">
                      U{uNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                      <span className="text-[9px] uppercase tracking-widest">
                        {isOverflow
                          ? 'EXCEEDS 1U'
                          : isOccupied
                          ? 'OCCUPIED'
                          : 'AVAILABLE'}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Rail Mount */}
            <div className="mt-2 pt-1 border-t border-neutral-800/60 flex justify-between text-[8px] font-sans text-neutral-500">
              <span>HEAVY-DUTY SLIDING RAIL</span>
              <span>1U = 1.75 IN (44.45 MM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-center font-sans">
        <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/60">
          <span className="text-[10px] text-neutral-400 block mb-0.5">Chassis Rating</span>
          <span className="text-sm font-bold text-white">
            {chassisRackUnits ? `${chassisRackUnits}U Rackmount` : 'Pending Selection'}
          </span>
        </div>
        <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/60">
          <span className="text-[10px] text-neutral-400 block mb-0.5">Vertical Required</span>
          <span
            className={`text-sm font-bold ${
              isExceeded ? 'text-red-400 font-black' : 'text-neutral-200'
            }`}
          >
            {consumedRackUnits ? `${consumedRackUnits}U Space` : '0U'}
          </span>
        </div>
      </div>

      {/* GPU Length clearance callout if tight or exceeded */}
      {gpuClearanceMm.current > 0 && (
        <div
          className={`mt-2 p-2 rounded-xl border text-[11px] font-sans flex items-center gap-2 ${
            gpuClearanceMm.isExceeded
              ? 'bg-red-950/60 border-red-700/50 text-red-300'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
          }`}
        >
          {gpuClearanceMm.isExceeded ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span>
            Accelerator Length: {gpuClearanceMm.current}mm (Max Chassis Clearance: {gpuClearanceMm.max}mm)
          </span>
        </div>
      )}
    </div>
  );
};
