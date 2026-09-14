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
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950/40 border border-neutral-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF1E2D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-3xl flex-1">
                <Typography
                  type="h1"
                  className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none"
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
                    className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/60 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <img src={processorIcon} alt="Configurator" className="w-4 h-4 object-contain brightness-0 invert" />
                    <span>Launch Server Configurator &rarr;</span>
                  </Link>

                  <Link
                    to="/servers/pre-configured"
                    className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <img src={serverIcon} alt="Turnkey" className="w-4 h-4 object-contain brightness-0 invert" />
                    <span>Turnkey Server Nodes</span>
                  </Link>

                  <Link
                    to="/servers/catalog"
                    className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-800 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Server Catalog</span>
                  </Link>
                </div>
              </div>

              {/* High-Tech Animated Server GIF Showcase */}
              <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#FF1E2D]/60 bg-black shadow-[0_0_35px_rgba(255,30,45,0.2)] group transition-all duration-300">
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
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl py-5 px-5 sm:px-7 backdrop-blur-md relative overflow-hidden shadow-lg">
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
                <div className="text-xs sm:text-[13px] font-bold text-white truncate font-sans">{item.name}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-400 font-sans truncate mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Targeted Workload Use-Case Tiles */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Typography type="h2" className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
            Engineered for Mission-Critical Infrastructure
          </Typography>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-2 leading-relaxed">
            Select a tailored computing profile to filter verified server hardware components and pre-configured nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {useCases.map((uc) => {
            return (
              <div
                key={uc.id}
                onClick={() => navigate(`/servers/catalog?productClass=server&useCase=${uc.id}`)}
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
                    <span className="text-[10px] font-sans font-bold bg-neutral-950 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-800">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#FF1E2D] transition-colors">
                    {uc.title}
                  </h3>

                  <span className="text-xs sm:text-sm font-sans text-neutral-400 block mt-1.5">
                    {uc.tagline}
                  </span>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-sans mt-3.5 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="mt-7 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs sm:text-sm font-sans font-bold text-[#FF1E2D]">
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
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] mb-1">
              <Activity className="w-4 h-4 text-[#FF1E2D]" />
              TOP500 Global Benchmark
            </div>
            <Typography type="h2" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              World-Class Supercomputing Architecture
            </Typography>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Inspect technical topologies, interconnect fabrics, and peak compute ratings of leading HPC supercomputing systems.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="text-xs font-sans font-bold text-[#FF1E2D] hover:text-red-300 flex items-center gap-1 shrink-0"
          >
            <span>View All Supercomputer Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Supercomputing Fabric Spotlight Banner featuring Supercomputer.gif */}
        <div className="mb-8 relative rounded-3xl overflow-hidden border border-neutral-800 bg-gradient-to-r from-neutral-900 via-[#120F17] to-neutral-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF1E2D]/15 border border-[#FF1E2D]/40 text-[#FF1E2D] text-xs font-sans font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRONTIER EXASCALE CLUSTER MATRIX</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-sans">
              Exascale High Performance Computing Fabric
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Massively parallel symmetric nodes interconnected by low-latency Slingshot-11 and InfiniBand NDR fabrics, delivering hundreds of petaflops of mixed-precision tensor computing.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-72 lg:w-80 aspect-video rounded-2xl overflow-hidden border border-neutral-700/80 shadow-[0_0_30px_rgba(255,30,45,0.2)] relative group">
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

                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#FF1E2D] bg-red-950/60 px-2.5 py-1 rounded-md border border-red-800/50">
                    {specs?.peakCompute}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-2.5 group-hover:text-[#FF1E2D] transition-colors">
                    {sc.name}
                  </h3>

                  <p className="text-xs font-sans text-neutral-400 mt-1 line-clamp-1">
                    {specs?.operatingInstitutionCountry}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-neutral-800/80 space-y-1.5 text-xs font-sans">
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
                  className="mt-5 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs sm:text-[13px] font-sans font-bold text-center border border-neutral-700 transition-colors block"
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
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Immediate order availability with pan-India insured freight and 3-year OEM on-site warranty.
            </p>
          </div>

          <Link
            to="/servers/pre-configured"
            className="text-xs font-sans font-bold text-[#FF1E2D] hover:text-red-300 flex items-center gap-1 shrink-0"
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

                  <div className="mb-2">
                    <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase">
                      {srv.brand} // {s?.formFactor}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#FF1E2D] transition-colors">
                    {srv.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-400 font-sans mt-2 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-neutral-800/80 space-y-2 font-sans text-xs sm:text-[13px]">
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
                    <span className="text-[10px] font-sans text-neutral-500 uppercase block">
                      Approx Street Price
                    </span>
                    <span className="text-lg sm:text-xl font-black font-sans text-white">
                      {formatCurrency(srv.price)}
                    </span>
                  </div>

                  <Link
                    to={`/servers/${srv.id}`}
                    className="px-5 py-2.5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded-xl text-xs sm:text-sm font-sans font-bold transition-all shadow-md shadow-red-950/40"
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
