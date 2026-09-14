import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, ArrowRight, Layers, ShieldCheck, Flame } from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';
import amdCpuGif from '../../assets/icons/Diy Cpu GIF by AMD.gif';
import intelCpuGif from '../../assets/icons/Tech Technology GIF by Intel.gif';
import nvidiaGpuGif from '../../assets/icons/Artificial Intelligence Ai GIF by NVIDIA GeForce.gif';
import radeonGpuGif from '../../assets/icons/Gpu Radeon GIF by AMD.gif';

export const ProcessorsGpusPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-20">
      {/* Subtle Background ShapeGrid */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20 z-0">
        <ShapeGrid
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255, 30, 45, 0.15)"
          hoverFillColor="#FF1E2D"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Clickable Breadcrumbs & Back Navigation */}
        <BreadcrumbNav
          items={[{ label: 'PROCESSORS & GPUs' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        {/* Hero Category Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-8 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF1E2D]/15 border border-[#FF1E2D]/40 text-[#FF1E2D] text-xs font-sans font-bold uppercase tracking-widest mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>EXTREME SILICON TAXONOMY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              PROCESSORS & GPUs
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl font-sans uppercase tracking-wider">
              SELECT THE HARDWARE YOU'RE LOOKING FOR.
            </p>
          </div>
        </FadeContent>

        <div className="space-y-16">
          {/* CPU MODULE */}
          <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-l-4 border-[#FF1E2D] pl-4">
                <div>
                  <span className="text-xs font-sans font-bold tracking-widest text-[#FF1E2D] uppercase">
                    CHOOSE YOUR PLATFORM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    PROCESSORS
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 font-sans">
                  Desktop CPUs, unlocked multipliers, 3D V-Cache & high-frequency IPC
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AMD Platform Card */}
                <Link
                  to="/processors-gpus/processors/amd"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 sm:p-8 hover:border-[#FF1E2D]/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(255, 30, 45,0.3)] cursor-pointer"
                >
                  {/* Background Hardware Watermark Image */}
                  <div className="absolute right-0 bottom-0 w-64 h-48 sm:w-80 sm:h-56 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 overflow-hidden rounded-br-xl">
                    <img
                      src={amdCpuGif}
                      alt="AMD Ryzen Processor"
                      className="w-full h-full object-cover object-center filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)] drop-shadow-[0_0_18px_rgba(255,30,45,0.3)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#120F17] via-[#120F17]/40 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] bg-[#FF1E2D]/15 px-2.5 py-1 rounded border border-[#FF1E2D]/40">
                        SOCKET AM5 / AM4
                      </span>
                      <span className="text-xs text-neutral-500 font-sans">124+ SKUs AVAILABLE</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase group-hover:text-[#FF1E2D] transition-colors">
                      AMD
                    </h3>
                    <div className="text-base sm:text-lg font-bold text-neutral-300 mb-2 font-sans">
                      Ryzen™ Series
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
                      Zen 5 & Zen 4 unlocked processors engineered with revolutionary 3D V-Cache™ technology, high core counts, and native PCIe 5.0 lanes.
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-sans text-neutral-400 mb-6">
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">Ryzen 9000</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">Ryzen 7000 X3D</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">Ryzen 5000 AM4</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] group-hover:text-[#FF1E2D] flex items-center gap-2">
                      EXPLORE AMD PROCESSORS
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>

                {/* INTEL Platform Card */}
                <Link
                  to="/processors-gpus/processors/intel"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 sm:p-8 hover:border-[#FF1E2D]/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(255, 30, 45,0.3)] cursor-pointer"
                >
                  {/* Background Hardware Watermark Image */}
                  <div className="absolute right-0 bottom-0 w-64 h-48 sm:w-80 sm:h-56 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 overflow-hidden rounded-br-xl">
                    <img
                      src={intelCpuGif}
                      alt="Intel Core Processor"
                      className="w-full h-full object-cover object-center filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)] drop-shadow-[0_0_18px_rgba(37,99,235,0.35)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#120F17] via-[#120F17]/40 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800/40">
                        LGA1851 / LGA1700
                      </span>
                      <span className="text-xs text-neutral-500 font-sans">48+ SKUs AVAILABLE</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                      INTEL
                    </h3>
                    <div className="text-base sm:text-lg font-bold text-neutral-300 mb-2 font-sans">
                      Core™ & Ultra Series
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
                      Performance hybrid architecture pairing ultra-fast Performance-cores with efficient background compute, reaching boost frequencies up to 6.0 GHz.
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-sans text-neutral-400 mb-6">
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">Core Ultra Series 2</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">14th Gen Raptor Lake-R</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">13th Gen Core</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] group-hover:text-[#FF1E2D] flex items-center gap-2">
                      EXPLORE INTEL PROCESSORS
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          </FadeContent>

          {/* GPU MODULE */}
          <FadeContent blur={true} duration={900} delay={150} easing="ease-out" initialOpacity={0}>
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-l-4 border-[#FF1E2D] pl-4">
                <div>
                  <span className="text-xs font-sans font-bold tracking-widest text-[#FF1E2D] uppercase">
                    CHOOSE YOUR GPU PLATFORM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    GRAPHICS CARDS
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 font-sans">
                  Dedicated ray tracing hardware, tensor AI acceleration & high-density GDDR6X VRAM
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NVIDIA GeForce Card */}
                <Link
                  to="/processors-gpus/gpu/nvidia"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 sm:p-8 hover:border-[#FF1E2D]/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(255, 30, 45,0.3)] cursor-pointer"
                >
                  {/* Background Hardware Watermark Image */}
                  <div className="absolute right-0 bottom-0 w-64 h-48 sm:w-80 sm:h-56 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 overflow-hidden rounded-br-xl">
                    <img
                      src={nvidiaGpuGif}
                      alt="NVIDIA GeForce RTX GPU"
                      className="w-full h-full object-cover object-center filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)] drop-shadow-[0_0_18px_rgba(16,185,129,0.3)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#120F17] via-[#120F17]/40 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/40">
                        ADA LOVELACE SILICON
                      </span>
                      <span className="text-xs text-neutral-500 font-sans">59+ SKUs AVAILABLE</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                      NVIDIA
                    </h3>
                    <div className="text-base sm:text-lg font-bold text-neutral-300 mb-2 font-sans">
                      GeForce RTX™
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
                      Powered by 4th Gen Tensor Cores, 3rd Gen RT Cores, DLSS 3.5 frame generation, and ultra-fast GDDR6X memory architectures for 4K ray tracing.
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-sans text-neutral-400 mb-6">
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RTX 4090 / 4080 Super</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RTX 4070 Ti / 4070</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RTX 4060 Ti / 4060</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] group-hover:text-[#FF1E2D] flex items-center gap-2">
                      EXPLORE NVIDIA GRAPHICS
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>

                {/* AMD Radeon Card */}
                <Link
                  to="/processors-gpus/gpu/radeon"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 sm:p-8 hover:border-[#FF1E2D]/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(255, 30, 45,0.3)] cursor-pointer"
                >
                  {/* Background Hardware Watermark Image */}
                  <div className="absolute right-0 bottom-0 w-64 h-48 sm:w-80 sm:h-56 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 overflow-hidden rounded-br-xl">
                    <img
                      src={radeonGpuGif}
                      alt="AMD Radeon RX GPU"
                      className="w-full h-full object-cover object-center filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)] drop-shadow-[0_0_18px_rgba(255,30,45,0.3)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#120F17] via-[#120F17]/40 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] bg-[#FF1E2D]/15 px-2.5 py-1 rounded border border-[#FF1E2D]/40">
                        RDNA™ 3 CHIPLET ARCHITECTURE
                      </span>
                      <span className="text-xs text-neutral-500 font-sans">43+ SKUs AVAILABLE</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase group-hover:text-[#FF1E2D] transition-colors">
                      AMD RADEON
                    </h3>
                    <div className="text-base sm:text-lg font-bold text-neutral-300 mb-2 font-sans">
                      Radeon™ RX
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
                      Industry-first chiplet gaming GPUs featuring AMD Infinity Cache™, up to 24GB GDDR6 memory, DisplayPort 2.1 readiness, and FSR 3 frame generation.
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-sans text-neutral-400 mb-6">
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RX 7900 XTX / 7900 XT</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RX 7800 XT / 7700 XT</span>
                      <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">RX 7600 XT</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] group-hover:text-[#FF1E2D] flex items-center gap-2">
                      EXPLORE RADEON GRAPHICS
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          </FadeContent>
        </div>
      </div>
    </div>
  );
};

export default ProcessorsGpusPage;
