import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Server,
  Cpu,
  Zap,
  ShieldCheck,
  HardDrive,
  Network,
  ArrowRight,
  Database,
  Layers,
  Activity,
  Award,
  Sparkles,
  BarChart3,
  Terminal,
} from 'lucide-react';
import ShapeGrid from '../components/common/ShapeGrid';
import FaultyTerminal from '../components/common/FaultyTerminal';
import { Boxes } from '../components/ui/background-boxes';
import FadeContent from '../components/common/FadeContent';
import Typography from '../components/ui/Typography';
import LogoLoop from '../components/common/LogoLoop';
import { enterpriseBrandLogos } from '../data/brandLogos';
import { serverProducts } from '../data/serverProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';

// Enterprise Server Custom Icon Assets
import aiIcon from '../assets/icons/Server/AI.png';
import renderIcon from '../assets/icons/Server/3D RENDER.png';
import dbIcon from '../assets/icons/Server/Database.png';
import serverIcon from '../assets/icons/Server/Server.png';
import processorIcon from '../assets/icons/Server/processor.png';
import desktopIcon from '../assets/icons/Server/Desktop.png';
import monitorIcon from '../assets/icons/Server/Monitor.png';

const useCases = [
  {
    id: 'ai-training',
    title: 'AI / LLM Training & Inference',
    tagline: 'High-Density GPU Clusters & NVLink Meshes',
    desc: 'Equipped for frontier model training, transformer fine-tuning, and ultra-low latency tensor inference with 8x NVIDIA H100/H200/B200 SXM5 accelerators.',
    badge: 'UP TO 8X SXM5 // 400G INFINIBAND',
    iconImage: aiIcon,
    accent: 'text-red-500',
    border: 'border-red-500/30',
    imgClass: 'brightness-0 invert drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    bgGlow: 'bg-red-950/40 border-red-800/60',
  },
  {
    id: 'rendering',
    title: '3D Rendering & VFX Compute',
    tagline: 'Multi-GPU Render Nodes & Ray Tracing',
    desc: 'Dense multi-GPU parallel processing optimized for Unreal Engine 5, Blender Cycles, and Houdini simulation clusters with RTX 6000 Ada architectures.',
    badge: '48GB ECC VRAM // 18,176 CUDA CORES',
    iconImage: renderIcon,
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
    imgClass: 'brightness-0 invert drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    bgGlow: 'bg-purple-950/40 border-purple-800/60',
  },
  {
    id: 'database',
    title: 'Core Databases & In-Memory Analytics',
    tagline: 'Ultra-Low Latency NVMe RAID & Terabyte RAM',
    desc: 'Engineered for mission-critical PostgreSQL, SQL Server, SAP HANA, and Redis clusters with 8TB DDR5 ECC RDIMMs and all-flash PCIe 5.0 NVMe.',
    badge: '8TB DDR5 RDIMM // 24X U.2 NVME',
    iconImage: dbIcon,
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    imgClass: 'brightness-0 invert drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    bgGlow: 'bg-cyan-950/40 border-cyan-800/60',
  },
  {
    id: 'hpc',
    title: 'HPC & Scientific Supercomputing',
    tagline: 'Exascale Topologies & Slingshot Fabrics',
    desc: 'Symmetric dual and quad AMD EPYC 9004/9005 & Intel Xeon Scalable clusters delivering petascale FP64 precision for genomics, weather, and fluid dynamics.',
    badge: '256 CORES / NODE // 128 PCIE 5.0 LANES',
    iconImage: processorIcon,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    imgClass: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    bgGlow: 'bg-emerald-950/40 border-emerald-800/60',
  },
  {
    id: 'virtualization',
    title: 'Cloud Virtualization & Multi-Tenancy',
    tagline: 'High-Density VMware, Proxmox & Kubernetes',
    desc: 'Consolidated computing footprint with dual 100GbE OCP 3.0 interfaces, hardware-isolated multi-tenancy, and N+1 Titanium power supplies.',
    badge: '99.999% UPTIME // N+1 FAILOVER',
    iconImage: serverIcon,
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    imgClass: 'brightness-0 invert drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    bgGlow: 'bg-amber-950/40 border-amber-800/60',
  },
  {
    id: 'monitoring',
    title: 'Edge Compute & Remote Mission Control',
    tagline: 'Hardware Telemetry, IPMI 2.0 & Operations Centers',
    desc: 'Low-latency edge nodes and remote management stations equipped with dedicated out-of-band iDRAC/iLO controllers, Redfish APIs, and high-fidelity displays.',
    badge: 'IPMI TELEMETRY // EDGE DEPLOY',
    iconImage: monitorIcon,
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
    imgClass: 'brightness-0 invert drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    bgGlow: 'bg-blue-950/40 border-blue-800/60',
  },
];

export const ServersLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const supercomputers = serverProducts.filter((p) => p.category === 'supercomputer');
  const turnkeyServers = serverProducts.filter((p) => p.category === 'server').slice(0, 6);

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 relative overflow-hidden font-sans">
      {/* Dynamic Faulty Terminal WebGL Matrix Background (Red, Yellow, Grey & Black Palette) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-65 overflow-hidden">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.4}
          pause={false}
          scanlineIntensity={0.45}
          glitchAmount={1.05}
          flickerAmount={0.8}
          noiseAmp={1.0}
          chromaticAberration={0.25}
          dither={0.12}
          curvature={0.08}
          tint="#E31B23"
          secondaryTint="#F59E0B"
          greyTint="#6B7280"
          multiColorMix={true}
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={true}
          brightness={0.85}
        />
        {/* Deep Vignette Gradient to ensure 100% foreground legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-transparent to-[#080808]/85 pointer-events-none" />
      </div>

      {/* 1. Technical Brutalist Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950/40 border border-neutral-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-widest text-red-500 uppercase mb-4">
                <span className="flex items-center gap-1.5 bg-red-950/80 px-2.5 py-1 rounded border border-red-800/60">
                  <img src={serverIcon} alt="Server" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
                  CartVerse Enterprise Infrastructure
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">99.999% SLA Uptime</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">Pan-India Data Center Deployment</span>
              </div>

              <Typography
                type="h1"
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none"
              >
                Enterprise Servers &amp; Supercomputing Fabric
              </Typography>

              <p className="mt-4 text-sm sm:text-base text-neutral-300 font-mono leading-relaxed max-w-3xl">
                High-density rack compute, multi-socket AMD EPYC &amp; Intel Xeon Scalable architectures, ECC RDIMM memory subsystems, and multi-GPU exascale accelerators. Built for deterministic throughput, zero-downtime N+1 redundancy, and minimal TCO.
              </p>

              {/* CTAs Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/servers/builder"
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/60 transition-all flex items-center gap-2 active:scale-95"
                >
                  <img src={processorIcon} alt="Configurator" className="w-4 h-4 object-contain brightness-0 invert" />
                  <span>Launch Server Configurator &rarr;</span>
                </Link>

                <Link
                  to="/servers/pre-configured"
                  className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 transition-all flex items-center gap-2"
                >
                  <img src={serverIcon} alt="Turnkey" className="w-4 h-4 object-contain brightness-0 invert" />
                  <span>Turnkey Server Nodes</span>
                </Link>

                <Link
                  to="/servers/catalog"
                  className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-800 transition-all flex items-center gap-2"
                >
                  <span>Browse Server Catalog</span>
                </Link>
              </div>
            </div>

            {/* Spec Highlights Grid */}
            <div className="mt-10 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 font-mono text-left relative z-10">
              <div className="bg-neutral-950/70 p-4 sm:p-5 rounded-2xl border border-neutral-800/90 shadow-lg">
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">Max Cores / Node</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">256 Cores</span>
                <span className="text-xs text-neutral-500 block mt-1">Dual EPYC 9005 Socket</span>
              </div>
              <div className="bg-neutral-950/70 p-4 sm:p-5 rounded-2xl border border-neutral-800/90 shadow-lg">
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">Peak AI Throughput</span>
                <span className="text-2xl sm:text-3xl font-black text-red-400 tracking-tight">8x H100 SXM5</span>
                <span className="text-xs text-neutral-500 block mt-1">3.2 Tbps NVLink Fabric</span>
              </div>
              <div className="bg-neutral-950/70 p-4 sm:p-5 rounded-2xl border border-neutral-800/90 shadow-lg">
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">Memory Ceiling</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">8 TB DDR5</span>
                <span className="text-xs text-neutral-500 block mt-1">32-Channel ECC RDIMM</span>
              </div>
              <div className="bg-neutral-950/70 p-4 sm:p-5 rounded-2xl border border-neutral-800/90 shadow-lg">
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">Power Architecture</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">N+1 / N+N</span>
                <span className="text-xs text-neutral-500 block mt-1">Titanium Hot-Swap PSUs</span>
              </div>
            </div>
          </div>
        </FadeContent>
      </section>

      {/* 2. Enterprise Brand Trust Loop */}
      <section className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl py-5 px-5 sm:px-7 backdrop-blur-md relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-1">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-semibold">ENTERPRISE HARDWARE ALLIANCE // TIER-1 OEM INVENTORY</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                FACTORY TESTED • OFFICIAL OEM WARRANTY
              </span>
            </div>

            <LogoLoop
              logos={enterpriseBrandLogos}
              speed={50}
              direction="left"
              logoHeight={28}
              gap={32}
              pauseOnHover={true}
              scaleOnHover={true}
              grayscale={false}
              fadeOut={true}
              fadeOutColor="#080808"
              ariaLabel="Enterprise server vendor marquee"
            />
          </div>
        </FadeContent>
      </section>

      {/* 2.5 Enterprise Silicon & Subsystems Strip */}
      <section className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {[
            { name: 'Server Compute', sub: 'Multi-Socket Node', icon: serverIcon, badge: 'EPYC / XEON', invert: true },
            { name: 'Silicon Cores', sub: 'Up to 256c / 512t', icon: processorIcon, badge: 'SP5 / LGA4677', invert: false },
            { name: 'AI Accelerators', sub: 'NVLink & PCIe 5.0', icon: aiIcon, badge: 'H100 / RTX 6000', invert: true },
            { name: 'Enterprise DB', sub: 'All-Flash NVMe Tier', icon: dbIcon, badge: 'U.2 / U.3 / E1.S', invert: true },
            { name: 'Control Console', sub: 'IPMI & KVM-over-IP', icon: monitorIcon, badge: 'OOB REDFISH', invert: true },
            { name: 'Workstation Node', sub: 'Pro Deskside Tower', icon: desktopIcon, badge: 'ECC MEMORY', invert: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-red-500/40 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 backdrop-blur-sm transition-colors shadow-md"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-2.5 shrink-0">
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-6 h-6 sm:w-7 sm:h-7 object-contain ${item.invert ? 'brightness-0 invert' : ''}`}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-bold text-white truncate font-mono">{item.name}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-400 font-mono truncate mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Targeted Workload Use-Case Tiles */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 bg-red-950/60 px-3.5 py-1 rounded-full border border-red-800/50">
            Workload Profiles
          </span>
          <Typography type="h2" className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
            Engineered for Mission-Critical Infrastructure
          </Typography>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-2 leading-relaxed">
            Select a tailored computing profile to filter verified server hardware components and pre-configured nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {useCases.map((uc) => {
            return (
              <div
                key={uc.id}
                onClick={() => navigate(`/servers/catalog?useCase=${uc.id}`)}
                className={`bg-neutral-900/80 border ${uc.border} hover:border-red-500/60 rounded-3xl p-7 sm:p-8 min-h-[350px] sm:min-h-[365px] backdrop-blur-md shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-16 h-16 rounded-2xl bg-neutral-900 border ${uc.bgGlow || 'border-neutral-800'} flex items-center justify-center p-3.5 shadow-inner group-hover:border-red-500/50 group-hover:scale-105 transition-all duration-300`}>
                      <img
                        src={uc.iconImage}
                        alt={uc.title}
                        className={`w-9 h-9 object-contain rounded-lg group-hover:scale-110 transition-transform duration-300 ${uc.imgClass || 'brightness-0 invert'}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-neutral-950 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-800">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                    {uc.title}
                  </h3>

                  <span className="text-xs sm:text-sm font-mono text-neutral-400 block mt-1.5">
                    {uc.tagline}
                  </span>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-mono mt-3.5 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="mt-7 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-red-500">
                  <span>Explore Workload Components</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Top Supercomputing Installations Spotlight */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-red-500 mb-1">
              <Activity className="w-4 h-4 text-red-500" />
              TOP500 Global Benchmark
            </div>
            <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              World-Class Supercomputing Architecture
            </Typography>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Inspect technical topologies, interconnect fabrics, and peak compute ratings of leading HPC supercomputing systems.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1 shrink-0"
          >
            <span>View All Supercomputer Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supercomputers.slice(0, 4).map((sc) => {
            const specs = sc.supercomputerSpecs;
            const img = getComponentImage(sc.imageSlug, 'supercomputer');

            return (
              <div
                key={sc.id}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-xl flex flex-col justify-between transition-all group hover:-translate-y-1"
              >
                <div>
                  <div className="w-full h-44 sm:h-48 bg-neutral-950 rounded-2xl p-3 border border-neutral-800/80 mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={img}
                      alt={sc.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-800/50">
                    {specs?.peakCompute}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-2.5 group-hover:text-red-400 transition-colors">
                    {sc.name}
                  </h3>

                  <p className="text-xs font-mono text-neutral-400 mt-1 line-clamp-1">
                    {specs?.operatingInstitutionCountry}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-neutral-800/80 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>Interconnect:</span>
                      <span className="text-white font-bold">{specs?.interconnectFabric}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Total Cores:</span>
                      <span className="text-white font-bold">{specs?.totalCores}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/servers/${sc.id}`}
                  className="mt-5 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs sm:text-[13px] font-mono font-bold text-center border border-neutral-700 transition-colors block"
                >
                  Technical Spec Sheet &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Turnkey Server Models Spotlight */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-red-500 mb-1">
              <Server className="w-4 h-4 text-red-500" />
              Turnkey Enterprise Nodes
            </div>
            <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pre-Configured Dell &amp; HPE Rack Nodes
            </Typography>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Immediate order availability with pan-India insured freight and 3-year OEM on-site warranty.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1 shrink-0"
          >
            <span>View All 16 Server Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {turnkeyServers.map((srv) => {
            const s = srv.serverSpecs;
            const img = getComponentImage(srv.imageSlug, 'server');

            return (
              <div
                key={srv.id}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-7 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between transition-all group hover:-translate-y-1"
              >
                <div>
                  <div className="w-full h-48 sm:h-52 bg-neutral-950 rounded-2xl p-3.5 border border-neutral-800/80 mb-5 flex items-center justify-center overflow-hidden">
                    <img
                      src={img}
                      alt={srv.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                      {srv.brand} // {s?.formFactor}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-800/50">
                      {s?.managementEngine}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                    {srv.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-mono mt-2 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-neutral-800/80 space-y-2 font-mono text-xs sm:text-[13px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Sockets:</span>
                      <span className="text-white font-bold">{s?.processorSockets}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Max RAM:</span>
                      <span className="text-white font-bold">{s?.maxMemory}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                      Approx Street Price
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-white">
                      {formatCurrency(srv.price)}
                    </span>
                  </div>

                  <Link
                    to={`/servers/${srv.id}`}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-mono font-bold transition-all shadow-md shadow-red-950/40"
                  >
                    Details &amp; Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServersLandingPage;
