import React from 'react';
import { Cpu, HeartHandshake, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Topography from '../components/ui/Topography';

/**
 * AboutPage
 * Technical Brutalism manifesto and platform overview of CartVerse.
 * Exclusively themed in high-contrast White and Red with sharp geometric borders,
 * hard offset pixel drop shadows, and strict Merriweather serif typography.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen relative bg-[#FFFFFF] text-neutral-950 overflow-hidden merriweather-about pb-20">
      {/* Red Topography Elevation Lines Background Animation across White Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <Topography
          lowColor="#FFE4E6"
          midColor="#FF1E2D"
          highColor="#99000D"
          speed={0.35}
          morphAmount={3.0}
          morphSpeed={0.06}
          bands={6.0}
          thickness={0.03}
          scale={1.5}
          pixelSize={1}
          glow={0.8}
          colorMode="elevation"
          contrast={1.1}
          brightness={1.2}
          fillBands={false}
          opacity={0.65}
          grain={true}
          grainIntensity={0.03}
          mouseInteraction={true}
          mouseRadius={0.35}
          mouseStrength={0.5}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none border-2 border-[#FF1E2D] bg-white text-[#FF1E2D] font-bold text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <ArrowLeft size={14} /> Back to Hardware Store
          </Link>
        </div>

        {/* Hero Manifesto Box */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="rounded-none border-2 sm:border-[3px] border-[#FF1E2D] bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#FF1E2D]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b-2 border-red-200">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF1E2D] bg-red-50 px-2.5 py-1 border border-[#FF1E2D]">
                // SYS.MANIFESTO_V1
              </span>
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
                [STATUS: VERIFIED_HARDWARE_INDEX]
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-neutral-950 uppercase tracking-tight mb-6">
              We help you build a PC you don't have to worry about.
            </h1>

            <div className="p-4 sm:p-5 bg-red-50/70 border-l-4 border-[#FF1E2D]">
              <p className="text-[#FF1E2D] text-base sm:text-lg font-medium leading-relaxed">
                CartVerse is a place to shop for PC parts and put together a complete build without guessing whether everything will actually fit and work together. Pick your parts, and we'll tell you plainly if something doesn't match.
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Why We Started */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="rounded-none border-2 border-neutral-950 bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#FF1E2D]">
            <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950 bg-neutral-100 px-2.5 py-1 border border-neutral-900">
                // SECTION_01: ORIGIN_LOG
              </span>
              <span className="text-xs text-[#FF1E2D] font-bold uppercase tracking-wider">
                WHY WE STARTED
              </span>
            </div>

            <div className="grid md:grid-cols-[220px_1fr] gap-8">
              <div className="border-l-4 border-[#FF1E2D] pl-4">
                <span className="text-xs text-[#FF1E2D] font-bold uppercase tracking-widest block mb-1">
                  THE PROBLEM
                </span>
                <h2 className="text-2xl font-bold text-neutral-950 uppercase leading-tight">
                  Hardware Compatibility Chaos
                </h2>
              </div>
              <div className="space-y-4 text-neutral-800 leading-relaxed text-sm sm:text-base">
                <p className="p-4 bg-neutral-50 border border-neutral-200">
                  Buying PC parts on your own is confusing. It's easy to pick a processor and a motherboard that don't fit together, or a power supply that's too weak for the rest of your build. Most stores just sell you the parts and leave the rest to you.
                </p>
                <p className="p-4 bg-red-50/60 border border-red-200 text-[#FF1E2D] font-medium">
                  We built CartVerse so that part of the process is handled for you. As you add components to a build, we quietly check that they belong together, and let you know before you check out — not after the box arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What We Care About (Core Pillars Grid) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-neutral-950">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1E2D] bg-red-50 px-2.5 py-1 border border-[#FF1E2D]">
              // SECTION_02: CORE_PRINCIPLES
            </span>
            <span className="text-xs text-neutral-950 font-bold uppercase tracking-wider">
              WHAT WE CARE ABOUT
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-none border-2 border-neutral-950 bg-white p-6 shadow-[5px_5px_0px_0px_#FF1E2D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#FF1E2D] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-none border-2 border-[#FF1E2D] bg-red-50 text-[#FF1E2D] flex items-center justify-center shadow-[2px_2px_0px_0px_#FF1E2D]">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs font-bold text-neutral-400">[01]</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-950 uppercase mb-2">
                  No Surprises
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  If two parts won't work together, we tell you clearly, before you buy.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[11px] font-bold text-[#FF1E2D] uppercase tracking-wider">
                AUTOMATED_RULE_CHECK
              </div>
            </div>

            <div className="rounded-none border-2 border-neutral-950 bg-white p-6 shadow-[5px_5px_0px_0px_#FF1E2D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#FF1E2D] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-none border-2 border-[#FF1E2D] bg-red-50 text-[#FF1E2D] flex items-center justify-center shadow-[2px_2px_0px_0px_#FF1E2D]">
                    <Cpu size={20} />
                  </div>
                  <span className="text-xs font-bold text-neutral-400">[02]</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-950 uppercase mb-2">
                  Real Parts, Real Prices
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  Every component listed is one you can actually buy, priced in rupees.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[11px] font-bold text-[#FF1E2D] uppercase tracking-wider">
                LIVE_INR_CURRENCY
              </div>
            </div>

            <div className="rounded-none border-2 border-neutral-950 bg-white p-6 shadow-[5px_5px_0px_0px_#FF1E2D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#FF1E2D] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-none border-2 border-[#FF1E2D] bg-red-50 text-[#FF1E2D] flex items-center justify-center shadow-[2px_2px_0px_0px_#FF1E2D]">
                    <HeartHandshake size={20} />
                  </div>
                  <span className="text-xs font-bold text-neutral-400">[03]</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-950 uppercase mb-2">
                  Built for Beginners
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  You shouldn't need years of experience to put together a good PC.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[11px] font-bold text-[#FF1E2D] uppercase tracking-wider">
                GUIDED_SELECTION
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Technical Specifications Matrix */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="rounded-none border-2 sm:border-[3px] border-[#FF1E2D] bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
            <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF1E2D] bg-red-50 px-2.5 py-1 border border-[#FF1E2D]">
                // SECTION_03: TELEMETRY
              </span>
              <span className="text-xs text-neutral-950 font-bold uppercase tracking-wider">
                PLATFORM SPECIFICATION
              </span>
            </div>

            <div className="divide-y-2 divide-neutral-200 border-2 border-neutral-950">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-white hover:bg-red-50/40 transition-colors">
                <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider">What It Is</span>
                <span className="text-sm font-bold text-neutral-950">A Next-Gen PC Parts Store & Custom Build Planner</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-white hover:bg-red-50/40 transition-colors">
                <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider">Catalog Size</span>
                <span className="text-sm font-bold text-neutral-950">500+ Verified Silicon, Servers & Auxiliary Components</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-white hover:bg-red-50/40 transition-colors">
                <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider">Currency Standard</span>
                <span className="text-sm font-bold text-neutral-950">Indian Rupees (₹) with Real-Time Stock Tracking</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-white hover:bg-red-50/40 transition-colors">
                <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider">Extended Workspace</span>
                <span className="text-sm font-bold text-neutral-950">40 Curated Ergonomic Desks & Gaming Chairs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Closing CTA Box */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-none border-2 sm:border-[3px] border-neutral-950 bg-white p-8 sm:p-12 text-center shadow-[8px_8px_0px_0px_#FF1E2D]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-red-50 border border-[#FF1E2D] text-[#FF1E2D] text-xs font-bold uppercase tracking-widest mb-4">
              // READY_FOR_DISPATCH
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 uppercase mb-4">
              Have a question, or ready to build?
            </h2>
            <p className="text-neutral-700 max-w-lg mx-auto text-sm sm:text-base mb-8">
              Jump straight into the PC Builder Studio or get in touch with our engineering team.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/builder"
                className="inline-flex items-center justify-center gap-2 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white px-8 py-3.5 rounded-none font-bold text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Start PC Build →
              </Link>
              <a
                href="mailto:support@cartverse.com"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-[#FF1E2D] px-8 py-3.5 rounded-none font-bold text-sm uppercase tracking-wider border-2 border-[#FF1E2D] shadow-[4px_4px_0px_0px_#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
