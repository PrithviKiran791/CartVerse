import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  HardDrive,
  Box,
  Wrench,
} from 'lucide-react';
import { CompatibilityReport, CompatibilityIssue } from '../../types/hardware';

interface CompatibilityBarProps {
  report: CompatibilityReport;
  filledSlotsCount: number;
}

export const CompatibilityBar: React.FC<CompatibilityBarProps> = ({ report, filledSlotsCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasIssues = report.errors.length > 0 || report.warnings.length > 0;
  const isAllCompatible = report.isCompatible && filledSlotsCount > 0;

  const getIssueIcon = (category: CompatibilityIssue['category']) => {
    switch (category) {
      case 'socket':
        return <Cpu className="w-4 h-4 text-red-400 shrink-0" />;
      case 'memory':
        return <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'clearance':
      case 'formfactor':
        return <Box className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'power':
        return <Zap className="w-4 h-4 text-yellow-400 shrink-0" />;
      default:
        return <Wrench className="w-4 h-4 text-red-400 shrink-0" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        report.errors.length > 0
          ? 'bg-red-950/40 border-red-500/50 shadow-lg shadow-red-950/40'
          : report.warnings.length > 0
          ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/30'
          : filledSlotsCount > 0
          ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
          : 'bg-neutral-900/60 border-neutral-800'
      }`}
    >
      {/* Main Status Row */}
      <div
        onClick={() => hasIssues && setIsExpanded(!isExpanded)}
        className={`p-4 sm:p-5 flex items-center justify-between gap-4 ${
          hasIssues ? 'cursor-pointer hover:bg-neutral-900/40' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          {report.errors.length > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 animate-bounce">
              <AlertOctagon className="w-6 h-6" />
            </div>
          ) : report.warnings.length > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : filledSlotsCount > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
          )}

          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              {report.errors.length > 0 ? (
                <span className="text-red-400">
                  Compatibility Conflict Detected ({report.errors.length} Critical Issue{report.errors.length > 1 ? 's' : ''})
                </span>
              ) : report.warnings.length > 0 ? (
                <span className="text-amber-400">
                  Hardware Advisories ({report.warnings.length} Warning{report.warnings.length > 1 ? 's' : ''})
                </span>
              ) : filledSlotsCount > 0 ? (
                <span className="text-emerald-400">
                  All Selected Components Are 100% Compatible
                </span>
              ) : (
                <span className="text-neutral-300">
                  Select Components to Begin Real-Time Compatibility Checks
                </span>
              )}
            </h3>

            <p className="text-xs text-neutral-400 mt-0.5">
              {report.errors.length > 0
                ? 'Review highlighted socket, RAM, clearance or power discrepancies below.'
                : report.warnings.length > 0
                ? 'Your build will function, but review recommended thermal/power optimizations.'
                : filledSlotsCount > 0
                ? 'Physical clearances, socket pins, memory generation and power safety verified.'
                : 'CartVerse Hardware Engine actively verifies sockets, form-factors, DDR gens & wattages.'}
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        {hasIssues && (
          <button className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded Conflict List */}
      {isExpanded && hasIssues && (
        <div className="border-t border-neutral-800/80 p-4 sm:p-5 space-y-3 bg-neutral-950/60">
          {report.issues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                issue.type === 'error'
                  ? 'bg-red-950/30 border-red-800/60 text-red-200'
                  : 'bg-amber-950/20 border-amber-800/60 text-amber-200'
              }`}
            >
              {getIssueIcon(issue.category)}
              <div className="flex-1 text-xs">
                <div className="font-bold mb-0.5">{issue.title}</div>
                <div className="text-neutral-300 leading-relaxed">{issue.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompatibilityBar;
