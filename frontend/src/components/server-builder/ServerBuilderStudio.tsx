import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Server,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  HardDrive,
  Network,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useServerBuilderStore } from '../../store/useServerBuilderStore';
import { ServerSlotKey } from '../../types/hardware';
import { ServerSlotCard } from './ServerSlotCard';
import { ServerCompatibilityBar } from './ServerCompatibilityBar';
import { RackUnitGauge } from './RackUnitGauge';
import { ServerWattageRedundancyGauge } from './ServerWattageRedundancyGauge';
import { ServerComponentPickerModal } from './ServerComponentPickerModal';
import { ServerBuildSummaryBar } from './ServerBuildSummaryBar';
import ShapeGrid from '../common/ShapeGrid';
import { Boxes } from '../ui/background-boxes';
import FadeContent from '../common/FadeContent';
import Typography from '../ui/Typography';
import { serverProducts } from '../../data/serverProducts';

interface ServerSlotDefinition {
  key: ServerSlotKey;
  label: string;
  categoryName: string;
}

export const ServerBuilderStudio: React.FC = () => {
  const {
    build,
    activeSlotPicker,
    openSlotPicker,
    closeSlotPicker,
    removeSlot,
    loadProfile,
    getCompatibilityReport,
    getEstimatedWattage,
    getPsuMetrics,
    getRackClearance,
    getFilledSlotsCount,
  } = useServerBuilderStore();

  const report = getCompatibilityReport();
  const estimatedWattage = getEstimatedWattage();
  const psuMetrics = getPsuMetrics();
  const rackClearance = getRackClearance();
  const filledSlots = getFilledSlotsCount();

  const coreSlots: ServerSlotDefinition[] = [
    { key: 'cpu', label: '1. Primary Processor (CPU 1)', categoryName: 'Primary CPU' },
    { key: 'cpu2', label: '2. Secondary Processor (CPU 2 - Dual Socket)', categoryName: 'Secondary CPU' },
    { key: 'motherboard', label: '3. Server Motherboard (IPMI / BMC)', categoryName: 'Server Motherboard' },
    { key: 'ram', label: '4. ECC Memory (RDIMM / LRDIMM)', categoryName: 'ECC Memory Kit' },
    { key: 'cabinet', label: '5. Rackmount Chassis (1U/2U/4U/Tower)', categoryName: 'Rack Chassis' },
    { key: 'psu', label: '6. Redundant Power Supply (N+1)', categoryName: 'Redundant PSU' },
  ];

  const computeStorageSlots: ServerSlotDefinition[] = [
    { key: 'gpu', label: '7. Accelerator / Compute GPU (H100 / RTX)', categoryName: 'Accelerator GPU' },
    { key: 'primaryStorage', label: '8. Primary NVMe / U.2 SSD', categoryName: 'Enterprise NVMe SSD' },
    { key: 'secondaryStorage', label: '9. Secondary Storage (SAS/SATA HDD)', categoryName: 'Enterprise Storage' },
    { key: 'networkCard', label: '10. Network Fabric NIC (25G/100G)', categoryName: 'Network Interface' },
    { key: 'raidController', label: '11. Hardware RAID / HBA Controller', categoryName: 'RAID Controller' },
    { key: 'cooler', label: '12. Active Server Heatsink / Cooler', categoryName: 'Server Heatsink' },
  ];

  const getConflictForSlot = (slotKey: ServerSlotKey) => {
    return report.issues.find((issue) => {
      if ((slotKey === 'cpu' || slotKey === 'cpu2') && issue.category === 'socket') return true;
      if (slotKey === 'motherboard' && (issue.category === 'socket' || issue.category === 'formfactor' || issue.category === 'memory')) return true;
      if (slotKey === 'ram' && issue.category === 'memory') return true;
      if (slotKey === 'gpu' && issue.category === 'clearance') return true;
      if (slotKey === 'cabinet' && (issue.category === 'clearance' || issue.category === 'formfactor')) return true;
      if (slotKey === 'psu' && issue.category === 'power') return true;
      if (slotKey === 'cooler' && issue.category === 'cooler') return true;
      return false;
    });
  };

  // Helper to load curated server profiles
  const handleLoadTemplate = (templateType: 'ai' | 'render' | 'database') => {
    if (templateType === 'ai') {
      const epyc = serverProducts.find((p) => p.id === 'cpu-srv-amd-epyc-9654') || null;
      const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-h13dsh-dual-sp5') || null;
      const ram = serverProducts.find((p) => p.id === 'ram-srv-samsung-128gb-ddr5-lrdimm') || null;
      const gpu = serverProducts.find((p) => p.id === 'gpu-srv-nvidia-h100-pcie') || null;
      const chassis = serverProducts.find((p) => p.id === 'case-srv-sm-4u-gpu-chassis') || null;
      const psu = serverProducts.find((p) => p.id === 'psu-srv-sm-2000w-redundant') || null;
      const ssd = serverProducts.find((p) => p.id === 'ssd-srv-kioxia-cm6-768tb') || null;

      loadProfile({
        cpu: epyc,
        cpu2: epyc,
        motherboard: mobo,
        ram,
        gpu,
        cabinet: chassis,
        psu,
        primaryStorage: ssd,
      });
    } else if (templateType === 'render') {
      const epyc = serverProducts.find((p) => p.id === 'cpu-srv-amd-epyc-9554') || null;
      const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-h13dsh-dual-sp5') || null;
      const ram = serverProducts.find((p) => p.id === 'ram-srv-micron-64gb-ddr5-rdimm') || null;
      const gpu = serverProducts.find((p) => p.id === 'gpu-srv-nvidia-rtx-6000-ada') || null;
      const chassis = serverProducts.find((p) => p.id === 'case-srv-dell-2u-enterprise-chassis') || null;
      const psu = serverProducts.find((p) => p.id === 'psu-srv-delta-1200w-redundant') || null;
      const ssd = serverProducts.find((p) => p.id === 'ssd-srv-samsung-pm9a3-384tb') || null;

      loadProfile({
        cpu: epyc,
        cpu2: epyc,
        motherboard: mobo,
        ram,
        gpu,
        cabinet: chassis,
        psu,
        primaryStorage: ssd,
      });
    } else if (templateType === 'database') {
      const xeon = serverProducts.find((p) => p.id === 'cpu-srv-intel-xeon-plat-8480') || null;
      const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-x13dei-dual-lga4677') || null;
      const ram = serverProducts.find((p) => p.id === 'ram-srv-micron-64gb-ddr5-rdimm') || null;
      const chassis = serverProducts.find((p) => p.id === 'case-srv-dell-2u-enterprise-chassis') || null;
      const psu = serverProducts.find((p) => p.id === 'psu-srv-delta-1200w-redundant') || null;
      const ssd = serverProducts.find((p) => p.id === 'ssd-srv-samsung-pm9a3-384tb') || null;
      const hdd = serverProducts.find((p) => p.id === 'hdd-srv-seagate-exos-20tb') || null;

      loadProfile({
        cpu: xeon,
        cpu2: xeon,
        motherboard: mobo,
        ram,
        cabinet: chassis,
        psu,
        primaryStorage: ssd,
        secondaryStorage: hdd,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Brutalist Technical ShapeGrid Canvas Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-35">
        <ShapeGrid
          speed={0.4}
          squareSize={48}
          direction="diagonal"
          borderColor="rgba(255, 30, 45, 0.15)"
          hoverFillColor="#FF1E2D"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        {/* Master Studio Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-sans text-red-500 uppercase tracking-widest mb-2 font-bold">
                  <Server className="w-4 h-4 text-red-500" />
                  Enterprise Infrastructure Studio
                </div>
                <Typography type="h1" className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Server & HPC Configurator
                </Typography>
                <Typography type="body-sm" color="muted" className="mt-2 max-w-2xl leading-relaxed">
                  Architect, validate, and procure mission-critical rack servers and supercomputing nodes. Real-time verification of multi-socket EPYC/Xeon topologies, ECC Registered RDIMMs, 1U–4U clearance envelopes, and N+1 power redundancy.
                </Typography>
              </div>

              {/* Template Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => handleLoadTemplate('ai')}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-xl text-xs font-sans font-bold border border-neutral-700/80 shadow transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>Load AI Training Node (4U)</span>
                </button>
                <button
                  onClick={() => handleLoadTemplate('database')}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-xl text-xs font-sans font-bold border border-neutral-700/80 shadow transition-all flex items-center gap-1.5"
                >
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Load Database Cluster (2U)</span>
                </button>
              </div>
            </div>
          </div>
        </FadeContent>

        {/* Real-time Status Grid: Compatibility Bar + Rack Unit Gauge + Wattage Redundancy Gauge */}
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3">
              <ServerCompatibilityBar report={report} filledSlotsCount={filledSlots} />
            </div>
            <div className="lg:col-span-2">
              <RackUnitGauge clearance={rackClearance} />
            </div>
            <div className="lg:col-span-1">
              <ServerWattageRedundancyGauge
                estimatedWattage={estimatedWattage}
                selectedPsuWattage={build.psu?.specs.wattage}
                psuMetrics={psuMetrics}
              />
            </div>
          </div>
        </FadeContent>

        {/* Component Slots Grid */}
        <div className="space-y-8 mb-12">
          {/* 1. Core Compute & Chassis Architecture */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-500" />
                <Typography type="h3" className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Core Compute, Motherboard & Rack Envelope
                </Typography>
              </div>
              <span className="text-[11px] font-sans text-neutral-400">Essential Server Foundation</span>
            </div>

            <div className="space-y-3">
              {coreSlots.map((slot) => (
                <ServerSlotCard
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

          {/* 2. Compute Acceleration, Storage & Fabric */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <Typography type="h3" className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Accelerators, Enterprise NVMe Storage & Fabric Networking
                </Typography>
              </div>
              <span className="text-[11px] font-sans text-neutral-400">Throughput & Expansion</span>
            </div>

            <div className="space-y-3">
              {computeStorageSlots.map((slot) => (
                <ServerSlotCard
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

        {/* Turnkey Server Systems CTA Banner */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Looking for Turnkey Rack Systems or Exascale Supercomputers?
            </h4>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Explore 16 pre-integrated Dell PowerEdge, HPE ProLiant, and Supermicro turnkey servers, or inspect world-class supercomputing topologies.
            </p>
          </div>
          <Link
            to="/servers/pre-configured"
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-sans font-bold shrink-0 border border-neutral-700 transition-all flex items-center gap-1.5"
          >
            <span>View Pre-Configured Nodes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Component Selection Modal */}
      <ServerComponentPickerModal
        slotKey={activeSlotPicker}
        onClose={closeSlotPicker}
      />

      {/* Sticky Bottom Summary Bar */}
      <ServerBuildSummaryBar />
    </div>
  );
};

export default ServerBuilderStudio;
