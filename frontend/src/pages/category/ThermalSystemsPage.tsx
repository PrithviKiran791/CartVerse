import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Fan, Wind, ArrowRight, ShieldCheck } from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';
import { getComponentImage } from '../../utils/assetRegistry';

export const ThermalSystemsPage: React.FC = () => {
  const thermalCategories = [
    {
      id: 'air-coolers',
      title: 'AIR COOLERS',
      subtitle: 'Dual-Tower Heatpipes & Silent Fins',
      route: '/thermal-systems/air-coolers',
      image: getComponentImage('cooler/Noctua NH-D15.jpg', 'cooler'),
      badge: 'Up to 260W TDP',
      desc: 'High-density aluminum heatsinks with precision copper heatpipes and premium fluid dynamic bearing fans for whisper-quiet thermal dissipation.',
      tags: ['Dual Tower', 'Noctua / DeepCool', 'Zero Maintenance'],
    },
    {
      id: 'aio',
      title: 'AIO LIQUID COOLERS',
      subtitle: '240mm - 420mm Radiators & LCD Pumps',
      route: '/thermal-systems/aio',
      image: getComponentImage('cooler/NZXT Kraken Elite 360 RGB.jpg', 'cooler'),
      badge: '240mm · 360mm · 420mm',
      desc: 'Closed-loop liquid cooling solutions featuring programmable LCD waterblocks, micro-channel copper cold plates, and high-static pressure ARGB fans.',
      tags: ['Custom LCD Screen', 'NZXT / Corsair / Arctic', 'Extreme Overclocking'],
    },
    {
      id: 'case-fans',
      title: 'CASE FANS',
      subtitle: '120mm & 140mm Magnetic Daisy-Chain',
      route: '/thermal-systems/case-fans',
      image: getComponentImage('cooler/Lian Li UNI FAN SL-INFINITY 120.jpg', 'cooler'),
      badge: 'Daisy-Chain Interconnect',
      desc: 'High CFM positive pressure chassis fans with interlocking pin-to-pin magnetic cables, infinity mirror lighting, and PWM zero-RPM silent curves.',
      tags: ['Zero Clutter', 'Lian Li Uni Fan', '5V ARGB Sync'],
    },
    {
      id: 'thermal-paste',
      title: 'THERMAL PASTE & PADS',
      subtitle: 'Micro-Particle Thermal Compounds',
      route: '/thermal-systems/thermal-paste',
      image: getComponentImage('Thermal Paste/Thermal Grizzly Kryonaut.jpg', 'cooler'),
      badge: '14.2+ W/mK',
      desc: 'Electrically non-conductive zinc-oxide and carbon micro-particle compounds designed for maximum heat transfer without pump-out or drying.',
      tags: ['Kryonaut / MX-4', 'Zero Curing Time', 'Sub-Zero Stable'],
    },
    {
      id: 'custom-cooling',
      title: 'CUSTOM COOLANTS',
      subtitle: 'Premixed UV & Clear Reservoirs',
      route: '/thermal-systems/custom-cooling',
      image: getComponentImage('coolant/EKWB CryoFuel Clear.jpg', 'coolant'),
      badge: 'Anti-Corrosive Formula',
      desc: 'Ultra-pure distilled water premixes infused with corrosion and biological growth inhibitors tailored for copper, brass, and nickel open loops.',
      tags: ['EKWB CryoFuel', 'Long-Life Biocides', 'Vibrant Dyes'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-20">
      {/* Background ShapeGrid */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20 z-0">
        <ShapeGrid
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.15)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbNav
          items={[{ label: 'THERMAL SYSTEMS' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        {/* Page Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-8 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Droplets className="w-3.5 h-3.5" />
              <span>THERMODYNAMICS & HEAT TRANSFER</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              THERMAL SYSTEMS
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl font-mono uppercase tracking-wider">
              KEEP YOUR RIG RUNNING COLD.
            </p>
          </div>
        </FadeContent>

        {/* Categories Grid */}
        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thermalCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 hover:border-cyan-500/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <div className="absolute right-[-20px] bottom-[-20px] w-56 h-56 pointer-events-none opacity-20 group-hover:opacity-55 group-hover:scale-105 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors">
                    {cat.title}
                  </h3>
                  <div className="text-xs font-bold text-neutral-300 mb-2 font-mono">
                    {cat.subtitle}
                  </div>

                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-neutral-400 mb-6">
                    {cat.tags.map((t, idx) => (
                      <span key={idx} className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 flex items-center gap-2">
                    EXPLORE {cat.title}
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default ThermalSystemsPage;
