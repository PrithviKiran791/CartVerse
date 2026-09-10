import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Server,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { CompatibilityReport } from '../../types/hardware';

interface ServerCompatibilityBarProps {
  report: CompatibilityReport;
  filledSlotsCount: number;
}

export const ServerCompatibilityBar: React.FC<ServerCompatibilityBarProps> = ({
  report,
  filledSlotsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isCompatible, errors, warnings, issues } = report;

  const hasIssues = issues.length > 0;
  const errorCount = errors.length;
  const warningCount = warnings.length;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
        errorCount > 0
          ? 'bg-red-950/40 border-red-800/80 shadow-2xl shadow-red-950/40'
          : warningCount > 0
          ? 'bg-amber-950/40 border-amber-800/80 shadow-2xl shadow-amber-950/30'
          : filledSlotsCount > 0
          ? 'bg-neutral-900/90 border-neutral-800 shadow-xl'
          : 'bg-neutral-950/60 border-neutral-900'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              errorCount > 0
                ? 'bg-red-950 border-red-700 text-red-400'
                : warningCount > 0
                ? 'bg-amber-950 border-amber-700 text-amber-400'
                : 'bg-emerald-950 border-emerald-700 text-emerald-400'
            }`}
          >
            {errorCount > 0 ? (
              <XCircle className="w-6 h-6" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-sans tracking-tight">
                {errorCount > 0
                  ? 'Server Architectural Incompatibility Detected'
                  : warningCount > 0
                  ? 'Server Infrastructure Advisories'
                  : filledSlotsCount >= 4
                  ? 'Certified Enterprise Hardware Topology'
                  : 'Enterprise Configurator Ready'}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                {filledSlotsCount} / 12 SLOTS
              </span>
            </div>

            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              {errorCount > 0
                ? `${errorCount} fatal incompatibility issue${errorCount > 1 ? 's' : ''} must be resolved prior to checkout.`
                : warningCount > 0
                ? `${warningCount} optimization recommendation${warningCount > 1 ? 's' : ''} for high-availability operation.`
                : 'Sockets, ECC RDIMMs, 1U-4U clearances, and N+1 power rails continuously verified.'}
            </p>
          </div>
        </div>

        {/* Toggle drawer button if issues exist */}
        {hasIssues && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono transition-colors shrink-0"
          >
            <span>{isExpanded ? 'Hide Details' : `View ${issues.length} Notes`}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Issues Drawer */}
      {isExpanded && hasIssues && (
        <div className="border-t border-neutral-800/80 bg-neutral-950/80 p-4 sm:p-5 space-y-2.5">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-3 ${
                issue.type === 'error'
                  ? 'bg-red-950/60 border-red-800/70 text-red-200'
                  : 'bg-amber-950/60 border-amber-800/70 text-amber-200'
              }`}
            >
              {issue.type === 'error' ? (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold uppercase tracking-wider">
                    {issue.title}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-700">
                    Category: {issue.category}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  {issue.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
