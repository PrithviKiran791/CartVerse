import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Tv,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  Layers,
  Wrench,
  CheckCircle2,
  Sparkles,
  Monitor,
  Box,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { getComponentImage } from '../utils/assetRegistry';
import TiltedCard from './TiltedCard';
import DriftWall from '../components/common/DriftWall';
import TextType from '../components/common/TextType';
import HoverEffect from '../components/ui/card-hover-effect';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import MaskedHeading from '../components/common/MaskedHeading';
import DepthCarousel from '../components/common/DepthCarousel';

export const HomePage: React.FC = () => {
  const [selectedPrebuiltIndex, setSelectedPrebuiltIndex] = useState(0);
  const [maskedBgIndex, setMaskedBgIndex] = useState(0);

  const maskedBgImages = [
    getComponentImage('Pre-Built PC/ARES Gaming PC.jpeg', 'prebuilt'),
    getComponentImage('GPU/Nvidia/rtx_5090.jpeg', 'gpu'),
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
    getComponentImage('Pre-Built PC/Bitkart Blaze P4.jpeg', 'prebuilt'),
    getComponentImage('ASUS ROG Strix X870-A Gaming WiFi.jpg', 'motherboard'),
    getComponentImage('CPU_Image/AMD/AMD_Ryzen_7_9850x3d.jpeg', 'cpu'),
  ];

  // Automated cyclic animation for background text mask images
  useEffect(() => {
    const timer = setInterval(() => {
      setMaskedBgIndex((prev) => (prev + 1) % maskedBgImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [maskedBgImages.length]);

  const currentMaskedBg = maskedBgImages[maskedBgIndex];

  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 8);

  const prebuiltPcs = [
    {
      id: 'ares-apex',
      name: 'ARES Apex Gaming PC',
      price: '₹2,89,999',
      specs: 'Ryzen 7 9800X3D · RTX 4080 Super · 32GB DDR5',
      imageSlug: 'Pre-Built PC/ARES Gaming PC.jpeg',
      tier: 'ULTRA FLAGSHIP',
    },
    {
      id: 'bitkart-blaze',
      name: 'Bitkart Blaze P4 Rig',
      price: '₹1,69,999',
      specs: 'Core i7-14700K · RTX 4070 Ti Super · 32GB DDR5',
      imageSlug: 'Pre-Built PC/Bitkart Blaze P4.jpeg',
      tier: 'HIGH PERFORMANCE',
    },
    {
      id: 'nzxt-player-one',
      name: 'NZXT Player One Edition',
      price: '₹79,999',
      specs: 'Core i5-13400F · RTX 4060 8GB · 16GB DDR4',
      imageSlug: 'Pre-Built PC/Bitkart NZXT Player One.jpeg',
      tier: 'MID-TOWER GAMING',
    },
    {
      id: 'genesis-creator',
      name: 'Genesis Workstation PC',
      price: '₹2,19,999',
      specs: 'Ryzen 9 7950X · RTX 4080 16GB · 64GB DDR5',
      imageSlug: 'Pre-Built PC/Genesis.jpeg',
      tier: 'CREATOR & 3D STUDIO',
    },
  ];

  const depthCarouselItems = prebuiltPcs.map((pc) => ({
    image: getComponentImage(pc.imageSlug, 'prebuilt'),
    alt: pc.name,
    overlay: (
      <div className="font-mono text-xs space-y-1 bg-neutral-950/85 p-3 rounded-xl border border-neutral-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1">
          <p className="font-extrabold text-white text-sm truncate">{pc.name}</p>
          <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-bold shrink-0">
            {pc.tier}
          </span>
        </div>
        <p className="text-neutral-300 text-[10px] line-clamp-1">{pc.specs}</p>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">PRICE (GST INCL):</span>
          <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded font-mono shadow-md">
            {pc.price}
          </span>
        </div>
      </div>
    ),
  }));

  // Automated cyclic animation for Pre-Built PC Showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedPrebuiltIndex((prev) => (prev + 1) % prebuiltPcs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [prebuiltPcs.length]);

  const currentPrebuilt = prebuiltPcs[selectedPrebuiltIndex];
  const prebuiltPcImage = getComponentImage(currentPrebuilt.imageSlug, 'prebuilt');

  const heroStats = [
    { label: 'Compatible Combinations', val: '500,000+' },
    { label: 'Genuine Brand Warranty', val: '100% Direct' },
    { label: 'Dispatch Lead Time', val: '24-48 Hrs' },
    { label: 'Indian Pin Codes Served', val: '19,000+' },
  ];

  return (
    <div className="relative min-h-screen pb-20">
      <div className="space-y-16">
        {/* Hero Section */}
        <section id="hero-overview" className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Left Content */}
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-red-400 font-semibold shadow-inner">
                  <Flame className="w-4 h-4 text-red-500 shrink-0" />
                  <TextType
                    text={[
                      "Next-Gen PC Hardware & Custom Studio",
                      "500+ Verified CPUs, GPUs & Rig Components",
                      "Real-Time Pin Socket & Wattage Headroom Check",
                      "100% Authentic Indian Warranty & Free Shipping"
                    ]}
                    typingSpeed={65}
                    deletingSpeed={35}
                    pauseDuration={2200}
                    showCursor={true}
                    cursorCharacter="_"
                    cursorClassName="text-red-400 font-bold"
                  />
                </div>

                {/* React Bits MaskedHeading Animation for Enlarged Title with Cyclic Background Animation */}
                <div className="py-2">
                  <MaskedHeading
                    key={currentMaskedBg}
                    text="BUILD YOUR APEX RIG WITH CARTVERSE"
                    tag="h1"
                    src={currentMaskedBg}
                    fillScale={1.35}
                    parallax={28}
                    reveal="rise"
                    trigger="view"
                    drift={20}
                    brightness={1.3}
                    saturation={1.5}
                    duration={1.2}
                    stagger={0.08}
                    align="left"
                    weight={900}
                    tracking={-0.03}
                    lineHeight={1.05}
                    textScale={0.075}
                    className="text-red-500 uppercase tracking-tight font-black"
                  />
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-neutral-200 tracking-tight leading-snug">
                  Real-Time Pin Socket & Wattage Headroom Matching for 500+ Verified Components
                </h2>

                <p className="text-base text-neutral-400 max-w-xl leading-relaxed">
                  CartVerse empowers PC enthusiasts, gamers, and architects with guaranteed socket compatibility, wattage headroom estimation, and authentic hardware with 100% Indian warranty.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <NoiseBackground
                    containerClassName="w-fit p-1.5 rounded-full shadow-2xl"
                    gradientColors={[
                      'rgb(255, 100, 150)',
                      'rgb(100, 150, 255)',
                      'rgb(255, 200, 100)',
                    ]}
                  >
                    <Link
                      to="/builder"
                      className="h-full w-full cursor-pointer rounded-full bg-neutral-950 hover:bg-neutral-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0px_1px_0px_0px_rgba(255,255,255,0.25)_inset,0px_1px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-100 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>Start Custom Build Studio &rarr;</span>
                    </Link>
                  </NoiseBackground>

                  <MagneticButton>
                    <Link
                      to="/products"
                      className="px-7 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all border border-neutral-800 hover:border-neutral-700 block cursor-pointer"
                    >
                      Explore Catalog
                    </Link>
                  </MagneticButton>
                </div>

                {/* Stat ticker */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/80">
                  {heroStats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-lg font-black font-mono text-white">{stat.val}</div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Right Interactive 3D DepthCarousel Showcase */}
              <div className="relative flex flex-col items-center justify-center w-full">
                <div className="mb-2 text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>PRE-BUILT RIG SHOWCASE — 3D DEPTH CAROUSEL</span>
                </div>

                <div className="w-full h-[450px] relative">
                  <DepthCarousel
                    items={depthCarouselItems}
                    cardWidth={310}
                    cardHeight={390}
                    radius={18}
                    depth={180}
                    spread={85}
                    tilt={18}
                    perspective={1200}
                    visibleCards={3}
                    autoplay={true}
                    autoplayDelay={3500}
                    loop={true}
                    showControls={true}
                    showIndicators={true}
                  />
                </div>

                <div className="mt-2 flex items-center justify-center gap-3">
                  <Link
                    to="/products?category=prebuilt"
                    className="py-2.5 px-5 bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Inspect All Pre-Builts
                  </Link>
                  <Link
                    to="/builder"
                    className="py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Customize in Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware Categories Shortcuts */}
        <section id="hardware-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Shop by Hardware Category</h2>
              <p className="text-xs text-neutral-400 mt-1">Direct authorized stock with official Indian distributor RMA</p>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Processors', icon: Cpu, href: '/products?category=cpu', count: '8 Models' },
              { name: 'Graphics Cards', icon: Tv, href: '/products?category=gpu', count: '6 Models' },
              { name: 'Motherboards', icon: Layers, href: '/products?category=motherboard', count: '6 Models' },
              { name: 'DDR5 / RAM', icon: Zap, href: '/products?category=ram', count: '4 Kits' },
              { name: 'NVMe Storage', icon: Sparkles, href: '/products?category=ssd', count: '4 Models' },
              { name: 'PC Cabinets', icon: Box, href: '/products?category=cabinet', count: '5 Cases' },
              { name: 'Power Supplies', icon: Zap, href: '/products?category=psu', count: '4 Models' },
              { name: 'Monitors', icon: Monitor, href: '/products?category=monitor', count: '4 Displays' },
              { name: 'Keyboards', icon: Sparkles, href: '/products?category=keyboard', count: '3 Boards' },
              { name: 'Gaming Mice', icon: Sparkles, href: '/products?category=mouse', count: '3 Mice' },
              { name: 'Audio & Gear', icon: Sparkles, href: '/products?category=headphones', count: '4 Models' },
              { name: 'Pre-Built PCs', icon: Flame, href: '/products?category=prebuilt', count: 'Signature' },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={cat.href}
                  className="group bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 hover:border-red-500/60 rounded-2xl p-5 transition-all flex flex-col items-center text-center shadow-lg hover:shadow-red-950/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 group-hover:border-red-500/50 group-hover:bg-red-950/20 flex items-center justify-center text-red-500 mb-3 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 mt-1">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3D Hardware Drift Wall Section */}
        <section id="drift-wall-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
              Interactive 3D Hardware Wall
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Explore 500+ Local Components & Rig Gear
            </h2>
            <p className="text-xs text-neutral-400 max-w-lg mx-auto mt-1">
              Hover over tiles to pause, lift, and inspect premium GPUs, CPUs, cooling systems, and custom gaming chassis.
            </p>
          </div>

          <div className="h-[480px] sm:h-[550px] w-full rounded-3xl overflow-hidden border border-neutral-800 bg-[#060010] shadow-2xl relative">
            <DriftWall
              items={mockProducts.slice(0, 20).map((p) => ({
                image: getComponentImage(p.imageSlug, p.category),
                title: p.name,
                href: `/product/${p.id}`,
              }))}
              columns={5}
              tileWidth={210}
              tileHeight={140}
              gap={18}
              tilt={14}
              turn={-12}
              perspective={1200}
              depth={100}
              speed={38}
              direction="up"
              variance={0.4}
              parallax={0.5}
              lift={58}
              fade={0.6}
              dim={0.5}
              overlayColor="#060010"
              radius={14}
              pauseOnHover={true}
            />
          </div>
        </section>

        {/* Card Hover Effect Feature Showcase */}
        <section id="studio-highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
              CartVerse Advantage
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Why Enthusiasts & Engineers Trust CartVerse
            </h2>
            <p className="text-xs text-neutral-400 max-w-lg mx-auto mt-1">
              Hover over cards below to experience dynamic animated background highlight cards.
            </p>
          </div>

          <HoverEffect
            items={[
              {
                title: "100% Guaranteed Socket Matching",
                description:
                  "Automated real-time verification for AM4, AM5, LGA1700, and LGA1851 pin sockets, motherboard chipset revs, and memory generation.",
                link: "/builder",
                badge: "SMART DIAGNOSTICS",
                icon: <Cpu className="w-5 h-5" />,
              },
              {
                title: "Real-Time PSU Wattage Headroom",
                description:
                  "Calculates peak GPU transients, CPU power limits, and total system thermal dissipation with safety margin alerts.",
                link: "/builder",
                badge: "POWER SAFETY",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                title: "Direct Brand Authorized Warranty",
                description:
                  "Every CPU, GPU, motherboard, and peripheral originates from authorized Indian distributors with full serial number tracking.",
                link: "/products",
                badge: "100% GENUINE",
                icon: <ShieldCheck className="w-5 h-5" />,
              },
              {
                title: "Chassis Clearance Diagnostics",
                description:
                  "Verifies maximum GPU length clearance, liquid radiator mounting limits, and CPU tower height before checkout.",
                link: "/builder",
                badge: "ZERO FITMENT ISSUES",
                icon: <Wrench className="w-5 h-5" />,
              },
              {
                title: "24-48 Hour Priority Express Dispatch",
                description:
                  "Custom foam-padded packaging for pre-built PCs and individual components dispatched across 19,000+ Indian pincodes.",
                link: "/products",
                badge: "EXPRESS LOGISTICS",
                icon: <Sparkles className="w-5 h-5" />,
              },
              {
                title: "Rig Architecture Intelligence",
                description:
                  "Explore detailed specifications, P-core/E-core counts, VRAM bandwidth, and IPC generation comparisons in real-time.",
                link: "/products",
                badge: "HARDWARE LAB",
                icon: <Layers className="w-5 h-5" />,
              },
            ]}
          />
        </section>

        {/* Interactive Builder Feature Promo Banner */}
        <section id="compatibility-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-950/60 via-neutral-900 to-neutral-950 border border-red-800/50 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold bg-red-950/80 px-3 py-1 rounded-full border border-red-700/50">
                  CartVerse Compatibility Engine
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Eliminate Guesswork with Live Architecture Verification.
                </h2>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pin Socket Matching (AM4, AM5, LGA1700, LGA1851)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>DDR4 vs DDR5 Memory Generation & Channel Topology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>GPU Length vs Chassis Max Clearance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-Time TDP & PSU 20% Transient Headroom Safety Margin</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <MagneticButton>
                    <NoiseBackground containerClassName="rounded-xl shadow-lg">
                      <Link
                        to="/builder"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Start Custom Build</span>
                      </Link>
                    </NoiseBackground>
                  </MagneticButton>
                </div>
              </div>

              <div id="showcase-banner" className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400">
                  <span>Real-Time Hardware Diagnostics</span>
                  <span className="text-emerald-400">Online</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="text-neutral-400 flex justify-between">
                    <span>AMD Ryzen 7 9800X3D (AM5)</span>
                    <span className="text-emerald-400">Socket Match ✓</span>
                  </div>
                  <div className="text-neutral-400 flex justify-between">
                    <span>ASUS ROG Strix X870-A Gaming</span>
                    <span className="text-emerald-400">DDR5 Channel Ready ✓</span>
                  </div>
                  <div className="text-neutral-400 flex justify-between">
                    <span>GeForce RTX 4080 Super (342mm)</span>
                    <span className="text-emerald-400">Clearance 455mm Max ✓</span>
                  </div>
                  <div className="text-neutral-400 flex justify-between">
                    <span>Corsair RM1000e 1000W</span>
                    <span className="text-emerald-400">38% Safe Headroom ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
