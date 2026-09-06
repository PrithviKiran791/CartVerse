import React from 'react';
import {
  Cpu,
  Zap,
  Gauge,
  Layers,
  Flame,
  Activity,
  MemoryStick,
  Monitor,
  Info,
  Sparkles,
  Tv,
  Film,
  HardDrive,
  Server,
  Volume2,
  Headphones,
  Mouse,
  Keyboard,
  Gamepad2,
  Camera,
  Box,
  ShieldCheck,
  Radio,
  Sliders,
  CheckCircle2,
  Fan,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { Product } from '../../types/hardware';

interface DetailedSpecViewProps {
  product: Product;
}

export const DetailedSpecView: React.FC<DetailedSpecViewProps> = ({ product }) => {
  const specs = product.specs;

  // 1. INTEL CPU
  if (specs.intelSpecs) {
    const intel = specs.intelSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-cyan-950/20 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-cyan-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                Intel Engineering Specs
              </span>
              <span className="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                {intel.generation}
              </span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">
                {intel.codename}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Intel Official Microarchitecture & Platform Specifications
            </h3>
          </div>
          <div className="text-right font-mono text-xs text-cyan-400">
            <span className="text-neutral-500">Tier / Suffix:</span>{' '}
            <span className="text-white font-bold">{intel.tier} ({intel.suffix})</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Compute Fabric & Core Matrix</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-cyan-500/30 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Total Physical Cores</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">{intel.totalCores}</span>
              <span className="text-[10px] text-neutral-500 block mt-1">Unified Compute Units</span>
            </div>
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-blue-500/30 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Performance (P-Cores)</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{intel.pCores}</span>
              <span className="text-[10px] text-neutral-500 block mt-1">High-IPC Cores</span>
            </div>
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-indigo-500/30 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Efficient (E / LPE Cores)</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{intel.eCores}</span>
              <span className="text-[10px] text-neutral-500 block mt-1">Multi-Thread Throughput</span>
            </div>
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Total Hardware Threads</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{intel.threads}</span>
              <span className="text-[10px] text-neutral-500 block mt-1">Parallel Execution Streams</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Gauge className="w-4 h-4" />
              <span className="font-bold uppercase text-[11px]">Clock Frequencies</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">Base Clock:</span><span className="text-white font-bold">{intel.baseClock}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Max Turbo Boost:</span><span className="text-cyan-300 font-bold">{intel.turboClock}</span></div>
            </div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Layers className="w-4 h-4" />
              <span className="font-bold uppercase text-[11px]">Cache Hierarchy</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">L3 Smart Cache:</span><span className="text-amber-300 font-bold">{intel.l3Cache}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Memory Support:</span><span className="text-white text-[11px] truncate max-w-[130px]">{intel.memorySupport}</span></div>
            </div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Flame className="w-4 h-4" />
              <span className="font-bold uppercase text-[11px]">Power Envelope</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">Base TDP:</span><span className="text-yellow-400 font-bold">{intel.baseTdp}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Max Turbo PL2:</span><span className="text-orange-400 font-bold">{intel.maxTurboPowerPl2}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 relative">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
            <Info className="w-4 h-4" />
            <span>Architectural Role & Engineering Field Notes</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{intel.architecturalNotes}</p>
        </div>
      </div>
    );
  }

  // 2. AMD RYZEN CPU
  if (specs.ryzenSpecs) {
    const ryzen = specs.ryzenSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-orange-950/20 border border-orange-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-orange-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                AMD Ryzen Specs
              </span>
              <span className="bg-orange-950 text-orange-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30">
                {ryzen.architecture}
              </span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">
                {ryzen.generation}
              </span>
              {(ryzen.suffix.includes('X3D') || ryzen.l3Cache.includes('3D V-Cache')) && (
                <span className="bg-rose-950 text-rose-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40">
                  AMD 3D V-Cache™
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AMD Official Microarchitecture & Platform Specifications
            </h3>
          </div>
          <div className="text-right font-mono text-xs text-orange-400">
            <span className="text-neutral-500">Codename:</span>{' '}
            <span className="text-white font-bold bg-orange-950 px-2 py-0.5 rounded border border-orange-800/50">{ryzen.codename}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-orange-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Total Cores</span>
            <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">{ryzen.totalCores}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Physical Units</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Core Breakdown</span>
            <span className="text-lg sm:text-xl font-bold text-amber-300 font-mono truncate block">{ryzen.coreBreakdown}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">{ryzen.architecture} Matrix</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-rose-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Total Threads</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{ryzen.threads}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Simultaneous Multi-Threading</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-purple-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">AI Engine / NPU</span>
            <span className="text-sm font-bold text-purple-300 font-mono truncate block mt-1">
              {ryzen.npu !== 'None' ? ryzen.npu.split('(')[0].trim() : 'Standard'}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-1">{ryzen.npu}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-orange-400 mb-2"><Gauge className="w-4 h-4" /><span className="font-bold uppercase text-[11px]">Frequencies</span></div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">Base Clock:</span><span className="text-white font-bold">{ryzen.baseClock}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Max Boost:</span><span className="text-orange-300 font-bold">{ryzen.boostClock}</span></div>
            </div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-amber-400 mb-2"><Layers className="w-4 h-4" /><span className="font-bold uppercase text-[11px]">Cache Pool</span></div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">L3 Cache:</span><span className="text-amber-300 font-bold">{ryzen.l3Cache}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Memory Support:</span><span className="text-white text-[11px] truncate max-w-[130px]">{ryzen.memorySupport}</span></div>
            </div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-yellow-400 mb-2"><Flame className="w-4 h-4" /><span className="font-bold uppercase text-[11px]">Thermal Envelope</span></div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">TDP / cTDP:</span><span className="text-yellow-400 font-bold">{ryzen.tdp}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Lithography:</span><span className="text-neutral-300">{ryzen.processNode}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-orange-950/30 border border-orange-500/30 rounded-2xl p-5 relative">
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-2"><Info className="w-4 h-4" /><span>Architectural Innovations & Field Notes</span></div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{ryzen.architecturalNotes}</p>
        </div>
      </div>
    );
  }

  // 3. AMD RADEON GPU
  if (specs.radeonSpecs) {
    const radeon = specs.radeonSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-red-950/20 border border-red-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-red-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                AMD Radeon Official Specs
              </span>
              <span className="bg-red-950 text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">{radeon.architecture}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{radeon.series}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">AMD Radeon RDNA Architecture & Silicon Specifications</h3>
          </div>
          <div className="text-right font-mono text-xs text-red-400">
            <span className="text-neutral-500">Silicon:</span>{' '}
            <span className="text-white font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800/50">{radeon.gpuCodename}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-red-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Compute Units</span>
            <span className="text-2xl sm:text-3xl font-black text-red-400 font-mono">{radeon.computeUnits}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Dual-Issue CUs</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-rose-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Stream Processors</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">{radeon.streamProcessors}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Shading Cores</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Ray Accelerators</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">{radeon.rayAccelerators}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">BVH Engines</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-purple-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">AI Accelerators</span>
            <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono">{radeon.aiAccelerators}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Matrix Math</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-red-400 font-bold uppercase text-[11px] block mb-1">Clocks</span>
            <div className="flex justify-between"><span className="text-neutral-500">Base:</span><span className="text-white">{radeon.baseClock}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Game:</span><span className="text-emerald-300 font-bold">{radeon.gameClock}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Boost:</span><span className="text-red-300 font-bold">{radeon.boostClock}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-amber-400 font-bold uppercase text-[11px] block mb-1">Memory & Cache</span>
            <div className="flex justify-between"><span className="text-neutral-500">VRAM:</span><span className="text-white">{radeon.vram}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Bus:</span><span className="text-amber-300">{radeon.memoryBusWidth}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Infinity Cache:</span><span className="text-rose-300 font-bold">{radeon.infinityCache}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-yellow-400 font-bold uppercase text-[11px] block mb-1">Power & Engine</span>
            <div className="flex justify-between"><span className="text-neutral-500">Board Power:</span><span className="text-yellow-400 font-bold">{radeon.boardPowerTbp}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">PCIe:</span><span className="text-white">{radeon.pcieInterface}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Codec:</span><span className="text-purple-300 text-[11px] truncate max-w-[130px]">{radeon.mediaEngine}</span></div>
          </div>
        </div>

        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-5 relative">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-2"><Info className="w-4 h-4" /><span>Architectural Innovations</span></div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{radeon.architecturalNotes}</p>
        </div>
      </div>
    );
  }

  // 4. NVIDIA GEFORCE GPU
  if (specs.nvidiaSpecs) {
    const nvidia = specs.nvidiaSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-emerald-950/20 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-emerald-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                NVIDIA Official Specs
              </span>
              <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">{nvidia.architecture}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{nvidia.series}</span>
              {nvidia.dlssAiFeatures !== 'None' && (
                <span className="bg-green-950 text-green-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-500/40">
                  {nvidia.dlssAiFeatures.split('(')[0].trim()}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">NVIDIA GeForce Architecture & Silicon Specifications</h3>
          </div>
          <div className="text-right font-mono text-xs text-emerald-400">
            <span className="text-neutral-500">Status:</span>{' '}
            <span className="text-white font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">{nvidia.isCurrent === 'Yes' ? 'Active Generation' : 'Legacy Generation'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-emerald-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">CUDA® Cores</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{nvidia.cudaCores}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Parallel Units</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-green-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">RT Cores</span>
            <span className="text-2xl sm:text-3xl font-black text-green-300 font-mono">{nvidia.rtCores}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">Ray Tracing</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-teal-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Tensor Cores</span>
            <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono">{nvidia.tensorCores}</span>
            <span className="text-[10px] text-neutral-500 block mt-1">AI Matrix Units</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-purple-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">DLSS AI Tier</span>
            <span className="text-sm font-bold text-purple-300 font-mono truncate block mt-1">
              {nvidia.dlssAiFeatures !== 'None' ? nvidia.dlssAiFeatures.split('(')[0].trim() : 'Standard'}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-1">Neural Rendering</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-emerald-400 font-bold uppercase text-[11px] block mb-1">Clocks</span>
            <div className="flex justify-between"><span className="text-neutral-500">Base:</span><span className="text-white">{nvidia.baseClock}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Boost:</span><span className="text-emerald-300 font-bold">{nvidia.boostClock}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-amber-400 font-bold uppercase text-[11px] block mb-1">VRAM</span>
            <div className="flex justify-between"><span className="text-neutral-500">Capacity:</span><span className="text-white">{nvidia.vram} {nvidia.memoryType}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Bandwidth:</span><span className="text-amber-300 font-bold">{nvidia.bandwidth}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-yellow-400 font-bold uppercase text-[11px] block mb-1">Power & NVENC</span>
            <div className="flex justify-between"><span className="text-neutral-500">TGP:</span><span className="text-yellow-400 font-bold">{nvidia.tgpPower}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Media:</span><span className="text-purple-300 text-[11px] truncate max-w-[130px]">{nvidia.mediaEngines}</span></div>
          </div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 relative">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2"><Info className="w-4 h-4" /><span>Architecture Innovations</span></div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">Powered by NVIDIA {nvidia.architecture} architecture with dedicated RT Cores and Tensor Cores for {nvidia.dlssAiFeatures}.</p>
        </div>
      </div>
    );
  }

  // 5. MOTHERBOARDS
  if (specs.motherboardSpecs) {
    const mb = specs.motherboardSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-blue-950/20 border border-blue-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Motherboard Master Spec
              </span>
              <span className="bg-blue-950 text-blue-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">{mb.chipset}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{mb.formFactor}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-blue-400">
            <span className="text-neutral-500">Socket:</span> <span className="text-white font-bold bg-blue-950 px-2 py-0.5 rounded">{mb.socket}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-blue-400 font-bold uppercase text-[11px] block mb-1">Platform & Chipset</span>
            <div className="flex justify-between"><span className="text-neutral-500">Platform:</span><span className="text-white">{mb.platform}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Chipset:</span><span className="text-cyan-300 font-bold">{mb.chipset}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Form Factor:</span><span className="text-white">{mb.formFactor}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-purple-400 font-bold uppercase text-[11px] block mb-1">Memory & Networking</span>
            <div className="flex justify-between"><span className="text-neutral-500">RAM Slots:</span><span className="text-purple-300 font-bold">{mb.ramSlots}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Networking:</span><span className="text-emerald-300 text-[11px] truncate max-w-[130px]">{mb.networking}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-emerald-400 font-bold uppercase text-[11px] block mb-1">Recommended Pairing</span>
            <p className="text-neutral-200 text-xs font-sans leading-relaxed">{mb.targetCpuPairing}</p>
          </div>
        </div>
      </div>
    );
  }

  // 6. SSDs
  if (specs.ssdSpecs) {
    const ssd = specs.ssdSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-purple-950/20 border border-purple-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                High-Speed NVMe Storage Specs
              </span>
              <span className="bg-purple-950 text-purple-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">{ssd.formFactor}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-purple-400">
            <span className="text-neutral-500">DRAM Cache:</span> <span className="text-white font-bold bg-purple-950 px-2 py-0.5 rounded">{ssd.dramCache}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-purple-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Sequential Read</span>
            <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono">{ssd.readSpeed}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-indigo-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Sequential Write</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">{ssd.writeSpeed}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">NAND Architecture</span>
            <span className="text-lg font-bold text-white font-mono">{ssd.nandType}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Workload Profile</span>
            <span className="text-xs font-bold text-emerald-300 truncate block mt-1">{ssd.targetWorkload}</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. HDDs
  if (specs.hddSpecs) {
    const hdd = specs.hddSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Enterprise & Mass Storage Specs
              </span>
              <span className="bg-amber-950 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">{hdd.rpm}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-amber-400">
            <span className="text-neutral-500">Tech:</span> <span className="text-white font-bold bg-amber-950 px-2 py-0.5 rounded">{hdd.recordingTech}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Capacity:</span><span className="text-amber-300 font-bold">{hdd.capacity}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Cache Buffer:</span><span className="text-white">{hdd.cache}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Workload / MTBF:</span><span className="text-emerald-300 font-bold">{hdd.workloadRating}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Interface:</span><span className="text-white">{hdd.interface}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Target Deployment:</span>
            <p className="text-white font-sans text-xs">{hdd.targetDeployment}</p>
          </div>
        </div>
      </div>
    );
  }

  // 8. PSUs
  if (specs.psuSpecs) {
    const psu = specs.psuSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-yellow-950/20 border border-yellow-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-yellow-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Power Supply Architecture
              </span>
              <span className="bg-yellow-950 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30">{psu.wattage}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{psu.efficiencyRating}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-yellow-400">
            <span className="text-neutral-500">Modularity:</span> <span className="text-white font-bold bg-yellow-950 px-2 py-0.5 rounded">{psu.modularity}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Standard:</span><span className="text-white font-bold">{psu.atxStandard}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Efficiency:</span><span className="text-yellow-300 font-bold">{psu.efficiencyRating}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Recommended Rig:</span>
            <p className="text-white font-sans text-xs">{psu.idealBuild}</p>
          </div>
        </div>
      </div>
    );
  }

  // 9. CABINETS
  if (specs.cabinetSpecs) {
    const cab = specs.cabinetSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-red-950/20 border border-red-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Box className="w-3 h-3" />
                Chassis Architecture Specs
              </span>
              <span className="bg-red-950 text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">{cab.formFactor}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-red-400">
            <span className="text-neutral-500">GPU Max:</span> <span className="text-white font-bold bg-red-950 px-2 py-0.5 rounded">{cab.gpuClearance}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Design:</span><span className="text-white">{cab.designTheme}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Form:</span><span className="text-red-300">{cab.formFactor}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Radiator Support:</span><span className="text-cyan-300 font-bold">{cab.radiatorSupport}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">GPU Clearance:</span><span className="text-emerald-300 font-bold">{cab.gpuClearance}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Distinctive Engineering:</span>
            <p className="text-white font-sans text-xs">{cab.standoutFeature}</p>
          </div>
        </div>
      </div>
    );
  }

  // 10. MONITORS
  if (specs.monitorSpecs) {
    const mon = specs.monitorSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-cyan-950/20 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Optics & Panel Architecture
              </span>
              <span className="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">{mon.refreshRate}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{mon.panelType}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-cyan-400">
            <span className="text-neutral-500">Size:</span> <span className="text-white font-bold bg-cyan-950 px-2 py-0.5 rounded">{mon.screenSize}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-cyan-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Resolution</span>
            <span className="text-lg sm:text-xl font-bold text-cyan-300 font-mono">{mon.resolution}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-blue-500/30 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Refresh Rate</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{mon.refreshRate}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Response Time</span>
            <span className="text-lg font-bold text-emerald-300 font-mono">{mon.responseTime}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Panel Tech</span>
            <span className="text-lg font-bold text-white font-mono">{mon.panelType}</span>
          </div>
        </div>

        <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 font-mono text-xs space-y-2">
          <div className="flex justify-between"><span className="text-neutral-500">Connectivity Ports:</span><span className="text-white font-bold">{mon.ports}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Target Application:</span><span className="text-cyan-300">{mon.targetUse}</span></div>
        </div>
      </div>
    );
  }

  // 11. MICE
  if (specs.mouseSpecs) {
    const mouse = specs.mouseSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-emerald-950/20 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Mouse className="w-3 h-3" />
                Esports Optical Sensor Specifications
              </span>
              <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">{mouse.maxDpi}</span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">{mouse.weight}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-emerald-400">
            <span className="text-neutral-500">Polling:</span> <span className="text-white font-bold bg-emerald-950 px-2 py-0.5 rounded">{mouse.pollingRate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block mb-1">Optical Sensor</span>
            <span className="text-emerald-300 font-bold block">{mouse.sensor}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block mb-1">Main Switches</span>
            <span className="text-white font-bold block">{mouse.switchType}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block mb-1">Chassis Weight</span>
            <span className="text-yellow-400 font-bold block">{mouse.weight}</span>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 uppercase block mb-1">Connectivity</span>
            <span className="text-purple-300 font-bold block truncate">{mouse.connectivity}</span>
          </div>
        </div>
      </div>
    );
  }

  // 12. KEYBOARDS
  if (specs.keyboardSpecs) {
    const kb = specs.keyboardSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-indigo-950/20 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Keyboard className="w-3 h-3" />
                Mechanical / Hall Effect Specifications
              </span>
              <span className="bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/30">{kb.layout}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-indigo-400">
            <span className="text-neutral-500">Hot-Swap:</span> <span className="text-white font-bold bg-indigo-950 px-2 py-0.5 rounded">{kb.hotSwap}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Switch Type:</span><span className="text-indigo-300 font-bold">{kb.switchType}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Keycaps:</span><span className="text-white">{kb.keycaps}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Rapid Trigger:</span><span className="text-emerald-300 font-bold">{kb.rapidTrigger || 'Standard'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Acoustics:</span><span className="text-purple-300 text-[11px] truncate max-w-[130px]">{kb.acousticDampening}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Interface:</span><span className="text-white">{kb.connectivity}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Layout:</span><span className="text-cyan-300 font-bold">{kb.layout}</span></div>
          </div>
        </div>
      </div>
    );
  }

  // 13. HEADPHONES & SPEAKERS
  if (specs.headphonesSpecs) {
    const hp = specs.headphonesSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-rose-950/20 border border-rose-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                Acoustic Driver Specifications
              </span>
              <span className="bg-rose-950 text-rose-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">{hp.driverType}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-rose-400">
            <span className="text-neutral-500">Impedance:</span> <span className="text-white font-bold bg-rose-950 px-2 py-0.5 rounded">{hp.impedance}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Driver:</span><span className="text-white font-bold">{hp.driverType}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Frequency:</span><span className="text-rose-300 font-bold">{hp.frequencyResponse}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Design:</span><span className="text-white">{hp.acousticDesign}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Microphone:</span><span className="text-emerald-300 text-[11px] truncate max-w-[130px]">{hp.microphone}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Connectivity:</span><span className="text-purple-300">{hp.connectivity}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Spatial Audio:</span><span className="text-cyan-300 font-bold">{hp.surroundSound}</span></div>
          </div>
        </div>
      </div>
    );
  }

  // 14. SPEAKERS
  if (specs.speakersSpecs) {
    const spk = specs.speakersSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                Desktop Studio Monitor Specs
              </span>
              <span className="bg-amber-950 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">{spk.powerOutput}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-amber-400">
            <span className="text-neutral-500">Config:</span> <span className="text-white font-bold bg-amber-950 px-2 py-0.5 rounded">{spk.channelConfig}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Drivers:</span><span className="text-white">{spk.driverConfiguration}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Frequency:</span><span className="text-amber-300 font-bold">{spk.frequencyRange}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Power:</span><span className="text-yellow-400 font-bold">{spk.powerOutput}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Inputs:</span><span className="text-emerald-300 text-[11px] truncate max-w-[130px]">{spk.inputs}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Acoustics:</span>
            <p className="text-white font-sans text-xs">{spk.standoutAcoustics}</p>
          </div>
        </div>
      </div>
    );
  }

  // 15. MOUSEPADS
  if (specs.mousepadSpecs) {
    const mp = specs.mousepadSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-teal-950/20 border border-teal-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Friction & Surface Geometry
              </span>
              <span className="bg-teal-950 text-teal-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30">{mp.dimensions}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Surface Texture:</span><span className="text-teal-300 font-bold">{mp.surfaceTexture}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Glide Speed:</span><span className="text-white">{mp.glideSpeed}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Base Material:</span><span className="text-white">{mp.baseMaterial}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Stitching:</span><span className="text-emerald-300">{mp.edgeFinish}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Competitive Fit:</span>
            <p className="text-white font-sans text-xs">{mp.targetCompetitiveFit}</p>
          </div>
        </div>
      </div>
    );
  }

  // 16. CONTROLLERS
  if (specs.controllerSpecs) {
    const ctrl = specs.controllerSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-green-950/20 border border-green-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-green-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Gamepad2 className="w-3 h-3" />
                Gamepad Silicon & Magnetic Hall Effect Specs
              </span>
              <span className="bg-green-950 text-green-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">{ctrl.layoutStyle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-green-400">
            <span className="text-neutral-500">Polling:</span> <span className="text-white font-bold bg-green-950 px-2 py-0.5 rounded">{ctrl.pollingRate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Stick Tech:</span><span className="text-green-300 font-bold">{ctrl.stickTech}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Triggers:</span><span className="text-white">{ctrl.triggerTech}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Connectivity:</span><span className="text-purple-300">{ctrl.connectivity}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Protocols:</span><span className="text-emerald-300">{ctrl.inputProtocols}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <span className="text-neutral-500 block">Standout Features:</span>
            <p className="text-white font-sans text-xs">{ctrl.extraButtons}</p>
          </div>
        </div>
      </div>
    );
  }

  // 17. WEBCAMS
  if (specs.webcamSpecs) {
    const cam = specs.webcamSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-cyan-950/20 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Optics & Video Sensor Specifications
              </span>
              <span className="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">{cam.maxResolution}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-cyan-400">
            <span className="text-neutral-500">FOV:</span> <span className="text-white font-bold bg-cyan-950 px-2 py-0.5 rounded">{cam.fieldOfView}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Sensor & Focus:</span><span className="text-cyan-300 font-bold">{cam.sensorType}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Resolution:</span><span className="text-white">{cam.maxResolution}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Microphone:</span><span className="text-emerald-300">{cam.microphone}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Privacy Shutter:</span><span className="text-white">{cam.privacyShutter}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Mount:</span><span className="text-purple-300">{cam.mounting}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Field of View:</span><span className="text-white">{cam.fieldOfView}</span></div>
          </div>
        </div>
      </div>
    );
  }

  // 18. PREBUILT PCs
  if (specs.prebuiltSpecs) {
    const pb = specs.prebuiltSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-red-950/20 border border-red-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                CartVerse Custom Rig Architecture
              </span>
              <span className="bg-red-950 text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">{pb.tierName}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-red-400">
            <span className="text-neutral-500">Target:</span> <span className="text-white font-bold bg-red-950 px-2 py-0.5 rounded">{pb.targetPerformance}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Processor:</span><span className="text-cyan-300 font-bold">{pb.cpuModel}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Graphics:</span><span className="text-red-400 font-bold">{pb.gpuModel}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Memory:</span><span className="text-purple-300 font-bold">{pb.ram}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Storage:</span><span className="text-emerald-300 font-bold">{pb.primaryStorage}</span></div>
          </div>
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-500">Power Supply:</span><span className="text-yellow-400 font-bold">{pb.psu}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Thermals:</span><span className="text-white">{pb.cooler}</span></div>
          </div>
        </div>

        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-5 relative font-mono text-xs space-y-2">
          <div className="flex justify-between"><span className="text-neutral-500">Motherboard & Chassis:</span><span className="text-white">{pb.motherboard} in {pb.cabinet}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">OS & Warranty:</span><span className="text-emerald-300 font-bold">{pb.operatingSystem} · {pb.warranty}</span></div>
        </div>
      </div>
    );
  }

  // 19. CPU COOLERS & AIOs
  if (specs.coolerSpecs) {
    const clr = specs.coolerSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-cyan-950/20 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Fan className="w-3 h-3" />
                CartVerse Thermal Engineering
              </span>
              <span className="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30 uppercase">
                {clr.coolerType === 'aio_liquid' ? 'Liquid AIO Cooler' : 'Air Tower Cooler'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-cyan-400">
            <span className="text-neutral-500">Thermal Capacity:</span>{' '}
            <span className="text-white font-bold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">{clr.ratedTdpWatts}W TDP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <Thermometer className="w-4 h-4" />
              <span>Thermal Architecture</span>
            </div>
            <div className="flex justify-between"><span className="text-neutral-500">Cooler Type:</span><span className="text-white font-bold uppercase">{clr.coolerType === 'aio_liquid' ? 'Closed-Loop AIO' : 'Air Heatsink'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Rated TDP:</span><span className="text-cyan-300 font-bold">{clr.ratedTdpWatts} Watts</span></div>
            {clr.heatpipeCount && (
              <div className="flex justify-between"><span className="text-neutral-500">Heatpipes:</span><span className="text-white">{clr.heatpipeCount} Direct-Contact</span></div>
            )}
            {clr.heightMm && (
              <div className="flex justify-between"><span className="text-neutral-500">Height:</span><span className="text-amber-400 font-bold">{clr.heightMm} mm</span></div>
            )}
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <Fan className="w-4 h-4" />
              <span>Radiator & Fans</span>
            </div>
            {clr.radiatorSizeMm ? (
              <>
                <div className="flex justify-between"><span className="text-neutral-500">Radiator Size:</span><span className="text-emerald-400 font-bold">{clr.radiatorSizeMm} mm</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Rad Thickness:</span><span className="text-white">{clr.radiatorThicknessMm || 27} mm</span></div>
                {clr.pumpRpm && <div className="flex justify-between"><span className="text-neutral-500">Pump Speed:</span><span className="text-purple-300">{clr.pumpRpm} RPM</span></div>}
              </>
            ) : (
              <div className="flex justify-between"><span className="text-neutral-500">Fan Diameter:</span><span className="text-emerald-400 font-bold">{clr.fanSizeMm || 120} mm</span></div>
            )}
            <div className="flex justify-between"><span className="text-neutral-500">VRM Fan:</span><span className="text-white">{clr.hasVrmFan ? 'Integrated' : 'None'}</span></div>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Features & Display</span>
            </div>
            <div className="flex justify-between"><span className="text-neutral-500">LCD Screen:</span><span className="text-purple-300 font-bold">{clr.hasLcdScreen ? `${clr.lcdScreenSizeInches}" IPS LCD` : 'None'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Socket Mounting:</span><span className="text-white font-bold">{clr.supportedSockets.length} Sockets</span></div>
          </div>
        </div>

        <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 font-mono text-xs">
          <span className="text-neutral-400 block mb-2 font-bold uppercase tracking-wider text-[11px]">Supported Motherboard Sockets:</span>
          <div className="flex flex-wrap gap-2">
            {clr.supportedSockets.map((sock) => (
              <span key={sock} className="bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 px-2.5 py-1 rounded font-bold">
                {sock}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 20. PC COOLANTS & FLUIDS
  if (specs.coolantSpecs) {
    const clt = specs.coolantSpecs;
    return (
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-blue-950/20 border border-blue-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                CartVerse Custom Loop Fluid
              </span>
              <span className="bg-blue-950 text-blue-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase">
                {clt.coolantType.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{product.name}</h3>
          </div>
          <div className="text-right font-mono text-xs text-blue-400">
            <span className="text-neutral-500">Volume:</span>{' '}
            <span className="text-white font-bold bg-blue-950 px-2.5 py-1 rounded border border-blue-500/30">{clt.volumeMl} mL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <Droplets className="w-4 h-4" />
              <span>Fluid Chemistry</span>
            </div>
            <div className="flex justify-between"><span className="text-neutral-500">Base Chemistry:</span><span className="text-white font-bold">{clt.baseChemistry}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Formulation:</span><span className="text-cyan-300">{clt.readyToUse ? 'Pre-Mixed (Ready to Use)' : '100mL Concentrate'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Drain Interval:</span><span className="text-amber-400 font-bold">{clt.drainIntervalMonths} Months</span></div>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Metal Metallurgy</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {clt.compatibleMetals.map((m) => (
                <span key={m} className="bg-blue-950 border border-blue-500/40 text-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <Layers className="w-4 h-4" />
              <span>Tubing Compatibility</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {clt.compatibleTubing.map((t) => (
                <span key={t} className="bg-neutral-900 border border-neutral-700 text-neutral-200 px-2 py-0.5 rounded text-[11px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CONSOLE HARDWARE SPECS
  if (specs.consoleSpecs) {
    const cs = specs.consoleSpecs;
    const isNintendo = product.brand.toLowerCase().includes('nintendo') || (cs.brand && cs.brand.toLowerCase().includes('nintendo'));
    const isSony = product.brand.toLowerCase().includes('sony') || (cs.brand && cs.brand.toLowerCase().includes('sony'));
    const isXbox = product.brand.toLowerCase().includes('xbox') || product.brand.toLowerCase().includes('microsoft') || (cs.brand && cs.brand.toLowerCase().includes('xbox'));

    const brandTheme = isNintendo
      ? {
          badge: 'bg-red-600/90 text-white',
          border: 'border-red-500/40',
          gradient: 'from-neutral-900 via-neutral-900 to-red-950/20',
          accent: 'text-red-400',
        }
      : isSony
      ? {
          badge: 'bg-blue-600/90 text-white',
          border: 'border-blue-500/40',
          gradient: 'from-neutral-900 via-neutral-900 to-blue-950/20',
          accent: 'text-blue-400',
        }
      : isXbox
      ? {
          badge: 'bg-emerald-600/90 text-white',
          border: 'border-emerald-500/40',
          gradient: 'from-neutral-900 via-neutral-900 to-emerald-950/20',
          accent: 'text-emerald-400',
        }
      : {
          badge: 'bg-purple-600/90 text-white',
          border: 'border-purple-500/40',
          gradient: 'from-neutral-900 via-neutral-900 to-purple-950/20',
          accent: 'text-purple-400',
        };

    return (
      <div className={`bg-gradient-to-b ${brandTheme.gradient} border ${brandTheme.border} rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`${brandTheme.badge} font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow`}>
                <Gamepad2 className="w-3 h-3" />
                Console Silicon Specifications
              </span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-neutral-700">
                Released {cs.releaseYear}
              </span>
              {cs.approxMarketPriceInr && (
                <span className="bg-neutral-900 text-neutral-400 font-mono text-[10px] px-2 py-0.5 rounded border border-neutral-800">
                  Market: {cs.approxMarketPriceInr}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {cs.consoleModel || product.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Official Silicon Architecture
            </span>
            <span className={`text-sm font-bold font-mono ${brandTheme.accent}`}>
              {cs.brand || product.brand} Platform
            </span>
          </div>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cs.cpuGpuArch && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Processor & Graphics Silicon</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.cpuGpuArch}
              </p>
            </div>
          )}

          {cs.memoryStorage && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <HardDrive className="w-4 h-4" />
                <span>Memory & Storage Architecture</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.memoryStorage}
              </p>
            </div>
          )}

          {cs.displayScreenSpecs && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Tv className="w-4 h-4" />
                <span>Display / Visual Output</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.displayScreenSpecs}
              </p>
            </div>
          )}

          {cs.targetResolutionFps && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Gauge className="w-4 h-4" />
                <span>Target Resolution & Framerate</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.targetResolutionFps}
              </p>
            </div>
          )}

          {cs.mediaFormatCompatibility && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Film className="w-4 h-4" />
                <span>Media & Backward Compatibility</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.mediaFormatCompatibility}
              </p>
            </div>
          )}

          {cs.approxMarketPriceInr && (
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Collector / Retail Market Tier</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 leading-relaxed font-mono pt-1">
                {cs.approxMarketPriceInr}
              </p>
            </div>
          )}
        </div>

        {cs.standoutFeaturesLegacy && (
          <div className="bg-neutral-950/90 p-5 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Innovations & Platform Legacy</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {cs.standoutFeaturesLegacy}
            </p>
          </div>
        )}
      </div>
    );
  }

  // FALLBACK STANDARD SPECS
  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
      <h3 className="text-lg font-bold text-white mb-4">Technical Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {Object.entries(product.specs).map(([key, val]) => {
          if (
            val === undefined ||
            val === null ||
            typeof val === 'object'
          )
            return null;
          return (
            <div key={key} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
              <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-neutral-200 font-bold">
                {Array.isArray(val) ? val.join(', ') : String(val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedSpecView;
