import React from 'react';
import { Link } from 'react-router-dom';
import { Cable, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';
import { getComponentImage } from '../../utils/assetRegistry';

export const CablesHeadersPage: React.FC = () => {
  const cableCategories = [
    {
      id: 'psu',
      title: 'PSU CABLES & 12V-2x6',
      subtitle: 'Modular ATX 3.0 & 600W High-Current Cables',
      route: '/cables-headers/psu',
      image: getComponentImage('Cables/PSU Cables/Corsair Premium Individually Sleeved Type 4 Gen 4.jpg', 'cables'),
      badge: 'PCIe 5.0 / 600W Ready',
      desc: 'Direct-to-power supply modular cables including 16-pin 12VHPWR and 12V-2x6 connectors rated for high-wattage RTX 40 & next-gen graphics cards.',
      tags: ['16AWG High Current', 'Gold Terminals', 'Zero Voltage Drop'],
    },
    {
      id: 'extensions',
      title: 'PSU SLEEVED EXTENSIONS',
      subtitle: 'Universal Braided Kits with Cable Combs',
      route: '/cables-headers/extensions',
      image: getComponentImage('Cables/PSU Cables/Thermaltake TT Premium Mod Sleeve Cable.jpg', 'cables'),
      badge: 'Universal Compatibility',
      desc: 'Multi-layer PET braided extensions compatible with any standard ATX power supply, featuring pre-installed closed combs for clean visible routing.',
      tags: ['24-Pin ATX', 'Dual 8-Pin EPS', 'Triple 8-Pin PCIe'],
    },
    {
      id: 'display',
      title: 'DISPLAY CABLES',
      subtitle: 'VESA DP 1.4 / 2.1 & HDMI 2.1a 48Gbps',
      route: '/cables-headers/display',
      image: getComponentImage('Cables/auxx/DisplayPort 1.4 Cable.jpg', 'cables'),
      badge: '4K 144Hz / 8K 60Hz',
      desc: 'Certified ultra-high-bandwidth display interconnects engineered with triple EMI shielding and gold-plated housings for artifacts-free high refresh rates.',
      tags: ['48 Gbps Bandwidth', 'Dynamic HDR', 'G-Sync Compatible'],
    },
    {
      id: 'usb',
      title: 'USB & TYPE-C CABLES',
      subtitle: 'USB4 40Gbps & 240W Power Delivery',
      route: '/cables-headers/usb',
      image: getComponentImage('Cables/Type-C/Anker 765 USB-C to USB-C Cable (140W Nylon).jpg', 'cables'),
      badge: '240W EPR Fast Charging',
      desc: 'Thunderbolt 4 / USB4 certified interconnects equipped with E-Marker chips for high-speed external storage arrays and ultra-fast peripheral docking.',
      tags: ['40 Gbps Transfer', 'E-Marker Chip', 'Braided Strain Relief'],
    },
    {
      id: 'internal',
      title: 'INTERNAL HEADERS & SPLITTERS',
      subtitle: 'PWM Fan Hubs & 5V 3-Pin ARGB Harnesses',
      route: '/cables-headers/internal',
      image: getComponentImage('Cables/Internal Fan, Pump & RGB Header Splitters/4-Pin PWM Fan Splitter Cable.jpg', 'cables'),
      badge: 'Chassis Hubs & Splitters',
      desc: 'SATA-powered fan distribution hubs and addressable RGB splitters enabling consolidated cable management and sync across all motherboard headers.',
      tags: ['4-Pin PWM', '3-Pin 5V ARGB', 'Front Panel Harness'],
    },
    {
      id: 'sata',
      title: 'SATA DATA & POWER',
      subtitle: 'Locking Latch SATA III 6Gbps Cables',
      route: '/cables-headers/sata',
      image: getComponentImage('Cables/Internal Data, Front Panel & Chassis IO Cables/SATA Data Cable 6Gbps.jpg', 'cables'),
      badge: '6 Gbps SATA III',
      desc: 'Heavy-duty right-angle and straight SATA data cables with spring steel locking clips for solid mechanical connection to SSDs and HDDs.',
      tags: ['Steel Locking Clip', 'Right-Angle 90°', 'EMI Shielded'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-20">
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
          items={[{ label: 'CABLES & HEADERS' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-8 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-800/40 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Cable className="w-3.5 h-3.5" />
              <span>INTERCONNECTS & SIGNAL ROUTING</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              CABLES & HEADERS
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl font-mono uppercase tracking-wider">
              CLEAN ROUTING, CHASSIS IO & MODULAR SLEEVED EXTENSIONS.
            </p>
          </div>
        </FadeContent>

        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cableCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(245,158,11,0.25)] cursor-pointer"
              >
                <div className="absolute right-[-15px] bottom-[-15px] w-52 h-52 pointer-events-none opacity-20 group-hover:opacity-55 group-hover:scale-105 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/40">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-amber-400 transition-colors">
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
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 group-hover:text-amber-300 flex items-center gap-2">
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

export default CablesHeadersPage;
