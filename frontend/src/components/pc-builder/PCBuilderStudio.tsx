import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Sparkles, HelpCircle, Layers, Flame } from 'lucide-react';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { BuilderSlotKey } from '../../types/hardware';
import { ComponentSlotCard } from './ComponentSlotCard';
import { CompatibilityBar } from './CompatibilityBar';
import { WattageGauge } from './WattageGauge';
import { ComponentPickerModal } from './ComponentPickerModal';
import { BuildSummaryBar } from './BuildSummaryBar';
import { formatCurrency } from '../../utils/formatters';
import { NoiseBackground } from '../ui/noise-background';

interface SlotDefinition {
  key: BuilderSlotKey;
  label: string;
  categoryName: string;
  isCore?: boolean;
}

export const PCBuilderStudio: React.FC = () => {
  const location = useLocation();
  const {
    build,
    activeSlotPicker,
    openSlotPicker,
    closeSlotPicker,
    removeSlot,
    loadBuildFromUrl,
    getCompatibilityReport,
    getEstimatedWattage,
    getFilledSlotsCount,
  } = usePCBuilderStore();

  // Load build from URL query parameters if present (e.g. from a shared link)
  useEffect(() => {
    if (location.search && location.search.length > 1) {
      loadBuildFromUrl(location.search);
    }
  }, [location.search]);

  const report = getCompatibilityReport();
  const estimatedWattage = getEstimatedWattage();
  const filledSlots = getFilledSlotsCount();

  const coreSlots: SlotDefinition[] = [
    { key: 'cpu', label: '1. Processor (CPU)', categoryName: 'Processor', isCore: true },
    { key: 'motherboard', label: '2. Motherboard', categoryName: 'Motherboard', isCore: true },
    { key: 'ram', label: '3. Memory (RAM)', categoryName: 'RAM Kit', isCore: true },
    { key: 'gpu', label: '4. Graphics Card (GPU)', categoryName: 'Graphics Card', isCore: true },
    { key: 'primaryStorage', label: '5. Primary Storage (NVMe SSD)', categoryName: 'Solid State Drive', isCore: true },
    { key: 'secondaryStorage', label: '6. Secondary Storage (SSD / HDD)', categoryName: 'Secondary Storage' },
    { key: 'psu', label: '7. Power Supply (PSU)', categoryName: 'Power Supply', isCore: true },
    { key: 'cabinet', label: '8. PC Cabinet (Chassis)', categoryName: 'Cabinet', isCore: true },
  ];

  const accessorySlots: SlotDefinition[] = [
    { key: 'cooler', label: '9. CPU Liquid / Air Cooler', categoryName: 'Cooler' },
    { key: 'monitor', label: '10. Gaming Monitor', categoryName: 'Monitor' },
    { key: 'keyboard', label: '11. Mechanical Keyboard', categoryName: 'Keyboard' },
    { key: 'mouse', label: '12. Esports Mouse', categoryName: 'Mouse' },
    { key: 'headphones', label: '13. Headset / Audio', categoryName: 'Headset' },
  ];

  const getConflictForSlot = (slotKey: BuilderSlotKey) => {
    return report.issues.find((issue) => {
      if (slotKey === 'cpu' && issue.category === 'socket') return true;
      if (slotKey === 'motherboard' && (issue.category === 'socket' || issue.category === 'formfactor' || issue.category === 'memory')) return true;
      if (slotKey === 'ram' && issue.category === 'memory') return true;
      if (slotKey === 'gpu' && issue.category === 'clearance') return true;
      if (slotKey === 'cabinet' && (issue.category === 'clearance' || issue.category === 'formfactor')) return true;
      if (slotKey === 'psu' && issue.category === 'power') return true;
      if (slotKey === 'cooler' && issue.category === 'cooler') return true;
      return false;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Studio Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950/40 border border-neutral-800 rounded-3xl p-8 mb-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest mb-2 font-bold">
                <Cpu className="w-4 h-4 text-red-500" />
                CartVerse Interactive Hardware Studio
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Custom PC Builder & Configurator
              </h1>
              <p className="text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
                Design and validate your dream gaming or workstation rig. Our real-time hardware compatibility engine continuously verifies pin sockets, RAM generations, physical chassis clearances, and electrical headroom.
              </p>
            </div>

            <NoiseBackground
              containerClassName="w-fit p-1.5 rounded-full shrink-0 shadow-2xl"
              gradientColors={[
                'rgb(255, 100, 150)',
                'rgb(100, 150, 255)',
                'rgb(255, 200, 100)',
              ]}
            >
              <button
                onClick={() => openSlotPicker('cpu')}
                className="h-full w-full cursor-pointer rounded-full bg-neutral-950 hover:bg-neutral-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0px_1px_0px_0px_rgba(255,255,255,0.25)_inset,0px_1px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-100 active:scale-95 flex items-center gap-2"
              >
                <span>Start Component Selection &rarr;</span>
              </button>
            </NoiseBackground>
          </div>
        </div>

        {/* Real-time Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CompatibilityBar report={report} filledSlotsCount={filledSlots} />
          </div>
          <div>
            <WattageGauge
              estimatedWattage={estimatedWattage}
              recommendedPsuWattage={report.recommendedPsuWattage}
              selectedPsuWattage={build.psu?.specs.wattage}
            />
          </div>
        </div>

        {/* Component Slots Grid */}
        <div className="space-y-8 mb-20">
          {/* Core System Components */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Core System Architecture
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Essential PC Slots</span>
            </div>

            <div className="space-y-3">
              {coreSlots.map((slot) => (
                <ComponentSlotCard
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  categoryName={slot.categoryName}
                  selectedProduct={build[slot.key]}
                  onSelect={() => openSlotPicker(slot.key)}
                  onRemove={() => removeSlot(slot.key)}
                  conflictIssue={getConflictForSlot(slot.key)}
                />
              ))}
            </div>
          </div>

          {/* Peripherals & Accessories */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Cooling, Displays & Peripherals
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Optional Battle Station Gear</span>
            </div>

            <div className="space-y-3">
              {accessorySlots.map((slot) => (
                <ComponentSlotCard
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  categoryName={slot.categoryName}
                  selectedProduct={build[slot.key]}
                  onSelect={() => openSlotPicker(slot.key)}
                  onRemove={() => removeSlot(slot.key)}
                  conflictIssue={getConflictForSlot(slot.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Selection Modal */}
      <ComponentPickerModal slotKey={activeSlotPicker} onClose={closeSlotPicker} />

      {/* Sticky Bottom Summary Bar */}
      <BuildSummaryBar />
    </div>
  );
};

export default PCBuilderStudio;
