import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import serverGif from '../assets/icons/Server.gif';
import supercomputerGif from '../assets/icons/Supercomputer.gif';
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
    accent: 'text-[#FF1E2D]',
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
          tint="#FF1E2D"
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
          <div className="bg-[#0E0C13] border-2 sm:border-[3px] border-neutral-800 rounded-none p-8 sm:p-12 relative overflow-hidden shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D]">
            {/* Viewport Corner Crosshairs */}
            <span className="absolute top-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute top-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute bottom-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute bottom-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>

            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF1E2D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-3xl flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#FF1E2D]/15 border-2 border-[#FF1E2D] text-[#FF1E2D] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[3px_3px_0px_0px_#FF1E2D]">
                  <Server className="w-3.5 h-3.5" />
                  <span>// SYS.ENTERPRISE_FABRIC [INDEX_ACTIVE]</span>
                </div>

                <Typography
                  type="h1"
                  className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase font-sans"
                >
                  Enterprise Servers &amp; Supercomputing Fabric
                </Typography>

                <p className="mt-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl">
                  High-density rack compute, multi-socket AMD EPYC &amp; Intel Xeon Scalable architectures, ECC RDIMM memory subsystems, and multi-GPU exascale accelerators. Built for deterministic throughput, zero-downtime N+1 redundancy, and minimal TCO.
                </p>

                {/* CTAs Row */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/servers/builder"
                    className="px-6 py-3.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-950 shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <img src={processorIcon} alt="Configurator" className="w-4 h-4 object-contain brightness-0 invert" />
                    <span>Launch Configurator &rarr;</span>
                  </Link>

                  <Link
                    to="/servers/pre-configured"
                    className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-700 shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <img src={serverIcon} alt="Turnkey" className="w-4 h-4 object-contain brightness-0 invert" />
                    <span>Turnkey Nodes</span>
                  </Link>

                  <Link
                    to="/servers/catalog"
                    className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-800 shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Catalog</span>
                  </Link>
                </div>
              </div>

              {/* High-Tech Animated Server GIF Showcase */}
              <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
                <div className="relative aspect-video rounded-none overflow-hidden border-2 border-neutral-700 hover:border-[#FF1E2D] bg-black shadow-[6px_6px_0px_0px_#FF1E2D] group transition-all duration-300">
                  <div className="absolute top-1 left-2 right-2 flex items-center justify-between text-[8px] font-mono text-neutral-400 border-b border-neutral-900 pb-0.5 z-10">
                    <span>RACK_01 // DATACENTER</span>
                    <span className="text-[#FF1E2D] font-bold">OPERATIONAL</span>
                  </div>
                  <img
                    src={serverGif}
                    alt="Enterprise Datacenter Server Infrastructure"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </FadeContent>
      </section>

      {/* 2. Enterprise Brand Trust Loop */}
      <section className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="bg-[#0E0C13] border-2 border-neutral-800 rounded-none py-5 px-5 sm:px-7 relative overflow-hidden shadow-[5px_5px_0px_0px_#000000]">
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
              className="bg-[#0E0C13] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-3.5 sm:p-4 flex items-center gap-3.5 transition-all shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#FF1E2D] cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-none bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center p-2.5 shrink-0 shadow-[2px_2px_0px_0px_#000000]">
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-6 h-6 sm:w-7 sm:h-7 object-contain ${item.invert ? 'brightness-0 invert' : ''}`}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-bold text-white truncate font-sans uppercase">{item.name}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-400 font-mono truncate mt-0.5">{item.sub}</div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF1E2D] bg-neutral-950 border border-neutral-800 px-1.5 py-0.2 mt-1 inline-block">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Targeted Workload Use-Case Tiles */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-neutral-950 border-2 border-neutral-800 text-[#FF1E2D] text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-[2px_2px_0px_0px_#000000]">
            // SYSTEM.WORKLOAD_PROFILES [SPEC_V4.2]
          </div>
          <Typography type="h2" className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-sans mt-2">
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
                onClick={() => navigate(`/servers/catalog?productClass=server&useCase=${uc.id}`)}
                className="bg-[#0E0C13] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-6 sm:p-7 min-h-[350px] shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#FF1E2D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                {/* Corner Crosshairs */}
                <span className="absolute top-1.5 left-1.5 font-mono text-[10px] text-neutral-600 group-hover:text-[#FF1E2D] select-none">+</span>
                <span className="absolute top-1.5 right-1.5 font-mono text-[10px] text-neutral-600 group-hover:text-[#FF1E2D] select-none">+</span>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-none bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center p-3 shadow-[3px_3px_0px_0px_#000000] group-hover:border-[#FF1E2D] transition-colors">
                      <img
                        src={uc.iconImage}
                        alt={uc.title}
                        className={`w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300 ${uc.imgClass || 'brightness-0 invert'}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-neutral-950 text-neutral-300 px-2.5 py-1 rounded-none border-2 border-neutral-800 uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black font-sans uppercase text-white tracking-tight group-hover:text-[#FF1E2D] transition-colors">
                    {uc.title}
                  </h3>

                  <span className="text-xs font-mono text-neutral-400 block mt-1.5 uppercase">
                    // {uc.tagline}
                  </span>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-mono mt-3.5 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-neutral-800 flex items-center justify-between text-xs font-mono font-bold text-[#FF1E2D] uppercase tracking-wider group-hover:text-white transition-colors">
                  <span>Explore Workload Components &rarr;</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Top Supercomputing Installations Spotlight */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF1E2D] mb-1">
              <Activity className="w-4 h-4 text-[#FF1E2D]" />
              // TOP500 GLOBAL BENCHMARK [HPC_MATRIX]
            </div>
            <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
              World-Class Supercomputing Architecture
            </Typography>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Inspect technical topologies, interconnect fabrics, and peak compute ratings of leading HPC supercomputing systems.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[#FF1E2D] hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-700 hover:border-[#FF1E2D] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 shrink-0"
          >
            <span>View All Supercomputer Profiles &rarr;</span>
          </Link>
        </div>

        {/* Supercomputing Fabric Spotlight Banner featuring Supercomputer.gif */}
        <div className="mb-8 relative rounded-none border-2 sm:border-[3px] border-neutral-800 bg-[#0E0C13] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D]">
          {/* Viewport Corner Crosshairs */}
          <span className="absolute top-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
          <span className="absolute top-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
          <span className="absolute bottom-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
          <span className="absolute bottom-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>

          <div className="space-y-3 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#FF1E2D]/15 border-2 border-[#FF1E2D] text-[#FF1E2D] text-xs font-mono font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#FF1E2D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRONTIER EXASCALE CLUSTER MATRIX</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-sans">
              Exascale High Performance Computing Fabric
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-mono">
              Massively parallel symmetric nodes interconnected by low-latency Slingshot-11 and InfiniBand NDR fabrics, delivering hundreds of petaflops of mixed-precision tensor computing.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-80 lg:w-96 aspect-video rounded-none overflow-hidden border-2 border-neutral-700 bg-black shadow-[6px_6px_0px_0px_#FF1E2D] relative group">
            <div className="absolute top-1 left-2 right-2 flex items-center justify-between text-[8px] font-mono text-neutral-400 border-b border-neutral-800 pb-0.5 z-10">
              <span>HPC_MATRIX // TOPOLOGY</span>
              <span className="text-[#FF1E2D] font-bold">ACTIVE</span>
            </div>
            <img
              src={supercomputerGif}
              alt="HPC Supercomputer Cluster Matrix"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supercomputers.slice(0, 4).map((sc) => {
            const specs = sc.supercomputerSpecs;
            const img = getComponentImage(sc.imageSlug, 'supercomputer');

            return (
              <div
                key={sc.id}
                className="bg-[#0E0C13] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#FF1E2D] flex flex-col justify-between transition-all group hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <div>
                  <div className="w-full h-44 bg-neutral-950 rounded-none p-3 border-2 border-neutral-800 mb-4 flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_#000000]">
                    <img
                      src={img}
                      alt={sc.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1E2D] bg-red-950 border border-red-800/80 px-2 py-0.5 rounded-none inline-block">
                    {specs?.peakCompute}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight mt-2.5 group-hover:text-[#FF1E2D] transition-colors">
                    {sc.name}
                  </h3>

                  <p className="text-xs font-mono text-neutral-400 mt-1 line-clamp-1">
                    {specs?.operatingInstitutionCountry}
                  </p>

                  <div className="mt-4 pt-3.5 border-t-2 border-neutral-800 space-y-1.5 text-xs font-mono">
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
                  className="mt-5 w-full py-2.5 bg-neutral-900 hover:bg-[#FF1E2D] hover:text-white text-neutral-200 rounded-none text-xs font-mono font-bold uppercase tracking-wider text-center border-2 border-neutral-700 hover:border-[#FF1E2D] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all block"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF1E2D] mb-1">
              <Server className="w-4 h-4 text-[#FF1E2D]" />
              // OEM FACTORY PRODUCTION NODES
            </div>
            <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
              Turnkey Server Models
            </Typography>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Immediate order availability with pan-India insured freight and 3-year OEM on-site warranty.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[#FF1E2D] hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-2 border-neutral-700 hover:border-[#FF1E2D] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 shrink-0"
          >
            <span>View All 16 Server Models &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {turnkeyServers.map((srv) => {
            const s = srv.serverSpecs;
            const img = getComponentImage(srv.imageSlug, 'server');

            return (
              <div
                key={srv.id}
                className="bg-[#0E0C13] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#FF1E2D] flex flex-col justify-between transition-all group hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <div>
                  <div className="w-full h-48 sm:h-52 bg-neutral-950 rounded-none p-3.5 border-2 border-neutral-800 mb-5 flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_0px_#000000]">
                    <img
                      src={img}
                      alt={srv.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="mb-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                      // {srv.brand} // {s?.formFactor}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-sans uppercase text-white tracking-tight group-hover:text-[#FF1E2D] transition-colors">
                    {srv.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-mono mt-2 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-5 pt-4 border-t-2 border-neutral-800 space-y-2 font-mono text-xs sm:text-[13px]">
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

                <div className="mt-6 pt-5 border-t-2 border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                      // APPROX STREET PRICE
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-white">
                      {formatCurrency(srv.price)}
                    </span>
                  </div>

                  <Link
                    to={`/servers/${srv.id}`}
                    className="px-5 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded-none border-2 border-neutral-950 dark:border-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
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
