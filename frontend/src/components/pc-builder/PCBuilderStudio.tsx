import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Sparkles, HelpCircle, Layers, Flame } from 'lucide-react';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { BuilderSlotKey } from '../../types/hardware';
import { ComponentSlotCard } from './ComponentSlotCard';
import { ComponentPickerModal } from './ComponentPickerModal';
import { formatCurrency } from '../../utils/formatters';
import { NoiseBackground } from '../ui/noise-background';
import Typography from '../ui/Typography';
import ShapeGrid from '../common/ShapeGrid';
import { Boxes } from '../ui/background-boxes';
import FadeContent from '../common/FadeContent';
import { ContainerScroll } from '../ui/container-scroll-animation';
import { getHardwareIcon } from '../../utils/hardwareIcons';

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

  // Load build from URL query parameters or cloud slug if present
  useEffect(() => {
    if (location.search && location.search.length > 1) {
      const params = new URLSearchParams(location.search);
      const buildSlug = params.get('build');
      if (buildSlug) {
        usePCBuilderStore.getState().loadBuildFromCloud(buildSlug);
      } else {
        loadBuildFromUrl(location.search);
      }
    }
  }, [location.search, loadBuildFromUrl]);

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
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex flex-col justify-between relative overflow-hidden">
      {/* React Bits ShapeGrid Canvas Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-40">
        <ShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255, 30, 45, 0.18)"
          hoverFillColor="#FF1E2D"
          shape="square"
          hoverTrailAmount={3}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        {/* Studio Header */}
        {/* Studio Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="bg-[#0E0E11] border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 rounded-none sm:rounded-md p-6 sm:p-8 mb-8 relative overflow-hidden shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D]">
            {/* Aceternity Animated Background Boxes */}
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF1E2D] uppercase tracking-wider mb-2 font-bold">
                  <Cpu className="w-4 h-4 text-[#FF1E2D]" />
                  // SYS.STUDIO // RIG_CONFIGURATOR_v2
                </div>
                <Typography type="h1" className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono uppercase">
                  Custom PC Builder & Configurator
                </Typography>
                <Typography type="body-sm" color="muted" className="mt-2 max-w-2xl leading-relaxed">
                  Design and validate your dream gaming or workstation rig. Our real-time hardware compatibility engine continuously verifies pin sockets, RAM generations, physical chassis clearances, and electrical headroom.
                </Typography>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => openSlotPicker('cpu')}
                  className="cursor-pointer rounded-none border-2 border-neutral-900 dark:border-white bg-[#FF1E2D] hover:bg-[#FF3B48] px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
                >
                  <span>Start Component Selection &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </FadeContent>

        {/* Interactive Rig Architecture Workspace with Aceternity ContainerScroll */}
        <ContainerScroll
          titleComponent={
            <div className="text-center mb-6">
              <div className="font-mono text-[10px] text-[#FF1E2D] font-bold tracking-wider uppercase mb-1">
                // ACTIVE_WORKBENCH
              </div>
              <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-mono mt-1">
                Configure Core Hardware & Peripherals
              </Typography>
              <Typography type="body-sm" color="muted" className="mt-1 max-w-xl mx-auto">
                Select verified components with real-time socket, dimension, and wattage validation.
              </Typography>
            </div>
          }
        >
          {/* Component Slots Grid */}
          <div className="space-y-8">
            {/* Core System Components */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-neutral-900 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <img src={getHardwareIcon('cpu')} alt="" className="w-5 h-5 object-contain shrink-0" />
                  <Typography type="h3" className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Core System Architecture
                  </Typography>
                </div>
                <span className="text-[10px] font-mono text-[#FF1E2D] font-bold uppercase tracking-wider">// CORE_SLOTS [8]</span>
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
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-neutral-900 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <img src={getHardwareIcon('monitor')} alt="" className="w-5 h-5 object-contain shrink-0 dark:invert dark:brightness-125" />
                  <Typography type="h3" className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Cooling, Displays & Peripherals
                  </Typography>
                </div>
                <span className="text-[10px] font-mono text-[#FF1E2D] font-bold uppercase tracking-wider">// AUX_GEAR [5]</span>
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
        </ContainerScroll>


      </div>

      {/* Component Selection Modal */}
      <ComponentPickerModal slotKey={activeSlotPicker} onClose={closeSlotPicker} />
    </div>
  );
};

export default PCBuilderStudio;
