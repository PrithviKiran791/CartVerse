import React, { useState, useEffect, useMemo } from 'react';
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
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Volume2,
  Camera,
  Gamepad2,
  Cable,
  Fan,
  Droplets,
  Play,
  Pause,
  SlidersHorizontal,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { getComponentImage } from '../utils/assetRegistry';
import { ComponentCategory } from '../types/hardware';
import TiltedCard from './TiltedCard';
import DriftWall from '../components/common/DriftWall';
import TextType from '../components/common/TextType';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import GradientText from '../components/common/GradientText';
import DepthCarousel from '../components/common/DepthCarousel';
import ShapeGrid from '../components/common/ShapeGrid';
import Typography from '../components/ui/Typography';
import { Boxes } from '../components/ui/background-boxes';
import ScrollReveal from '../components/common/ScrollReveal';
import FadeContent from '../components/common/FadeContent';
import LogoLoop from '../components/common/LogoLoop';
import { brandLogos } from '../data/brandLogos';
import { useTheme } from '../context/ThemeContext';
import FaultyTerminal from '../components/common/FaultyTerminal';

export const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [selectedPrebuiltIndex, setSelectedPrebuiltIndex] = useState(0);
  const [driftCategoryFilter, setDriftCategoryFilter] = useState<string>('all');

  // Curate comprehensive local hardware inventory for 3D Drift Wall with authentic PC hardware
  const driftWallItems = useMemo(() => {
    const categories: ComponentCategory[] = [
      'gpu',
      'prebuilt',
      'console',
      'cooler',
      'monitor',
      'keyboard',
      'cpu',
      'cabinet',
      'mouse',
      'controller',
      'motherboard',
      'ram',
      'headphones',
      'speakers',
      'ssd',
      'cables',
      'mousepad',
      'psu',
      'coolant',
      'webcam',
    ];

    const curatedByCat: Record<
      string,
      {
        id: string;
        image: string;
        title: string;
        href: string;
        price: string;
        brand: string;
        category: ComponentCategory;
      }[]
    > = {};
    const seenSlugs = new Set<string>();

    categories.forEach((cat) => {
      const prods = mockProducts
        .filter((p) => p.category === cat && !p.imageSlug.toLowerCase().includes('logo'))
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      const selectedInCat: {
        id: string;
        image: string;
        title: string;
        href: string;
        price: string;
        brand: string;
        category: ComponentCategory;
      }[] = [];

      for (const p of prods) {
        if (selectedInCat.length >= 18) break;
        const slugKey = p.imageSlug.toLowerCase();
        if (!seenSlugs.has(slugKey)) {
          seenSlugs.add(slugKey);
          selectedInCat.push({
            id: p.id,
            image: getComponentImage(p.imageSlug, p.category),
            title: p.name,
            href: `/product/${p.id}`,
            price: `₹${p.price.toLocaleString('en-IN')}`,
            brand: p.brand,
            category: p.category,
          });
        }
      }
      curatedByCat[cat] = selectedInCat;
    });

    // Interleave round-robin across categories so every column has completely different items
    const interleaved: {
      id: string;
      image: string;
      title: string;
      href: string;
      price: string;
      brand: string;
      category: ComponentCategory;
    }[] = [];
    const maxLen = Math.max(...Object.values(curatedByCat).map((arr) => arr.length), 0);

    for (let idx = 0; idx < maxLen; idx++) {
      for (const cat of categories) {
        if (curatedByCat[cat] && idx < curatedByCat[cat].length) {
          interleaved.push(curatedByCat[cat][idx]);
        }
      }
    }

    return interleaved;
  }, []);

  const filteredDriftWallItems = useMemo(() => {
    if (driftCategoryFilter === 'all') return driftWallItems;
    if (driftCategoryFilter === 'peripherals') {
      return driftWallItems.filter((item) =>
        ['keyboard', 'mouse', 'headphones', 'controller', 'mousepad', 'speakers'].includes(item.category)
      );
    }
    return driftWallItems.filter((item) => item.category === driftCategoryFilter);
  }, [driftWallItems, driftCategoryFilter]);

  const currentDriftSpeed = 34;

  // Curated flagship hardware spotlight across diverse categories
  const flagshipProducts = useMemo(() => {
    const flagshipCategories: ComponentCategory[] = [
      'gpu',
      'cpu',
      'motherboard',
      'monitor',
      'keyboard',
      'mouse',
      'controller',
      'headphones',
    ];
    return flagshipCategories
      .map((cat) => {
        const prods = mockProducts.filter((p) => p.category === cat);
        if (cat === 'cpu') {
          // Select an apex CPU with an authentic box/chip photo (e.g. Ryzen 7 9800X3D or Core Ultra)
          return (
            prods.find((p) => !p.imageSlug.includes('Intel_logo') && p.featured) ||
            prods.find((p) => !p.imageSlug.includes('Intel_logo')) ||
            prods[0]
          );
        }
        return prods.find((p) => p.featured) || prods[0];
      })
      .filter((p): p is typeof mockProducts[0] => Boolean(p));
  }, []);

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
        <section id="hero-overview" className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
          {/* React Bits ShapeGrid Canvas Animated Background */}
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-50">
            <ShapeGrid
              speed={0.5}
              squareSize={40}
              direction="diagonal"
              borderColor={isDarkMode ? "rgba(227, 27, 35, 0.18)" : "rgba(227, 27, 35, 0.12)"}
              hoverFillColor="#E31B23"
              shape="square"
              hoverTrailAmount={3}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 dark:bg-red-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Left Content */}
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-red-600 dark:text-red-400 font-semibold shadow-inner">
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
                    cursorClassName="text-red-600 dark:text-red-400 font-bold"
                  />
                </div>

                {/* React Bits GradientText Animation for Hero Title */}
                <div className="py-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight drop-shadow-md">
                    <GradientText
                      colors={isDarkMode ? ['#FFFFFF', '#E31B23', '#FF6B6B', '#FFFFFF', '#E31B23'] : ['#0F172A', '#E31B23', '#DC2626', '#0F172A', '#E31B23']}
                      animationSpeed={6}
                      showBorder={false}
                      direction="horizontal"
                      pauseOnHover={false}
                      yoyo={true}
                    >
                      BUILD YOUR APEX RIG WITH CARTVERSE
                    </GradientText>
                  </h1>
                </div>

                <Typography type="h2" className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-200 tracking-tight leading-snug">
                  Real-Time Pin Socket & Wattage Headroom Matching for 500+ Verified Components
                </Typography>

                <Typography type="body" color="muted" className="max-w-xl text-neutral-600 dark:text-neutral-400">
                  CartVerse empowers PC enthusiasts, gamers, and architects with guaranteed socket compatibility, wattage headroom estimation, and authentic hardware with 100% Indian warranty.
                </Typography>

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
                      className="h-full w-full cursor-pointer rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0px_1px_0px_0px_rgba(255,255,255,0.25)_inset,0px_1px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-100 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>Start Custom Build Studio &rarr;</span>
                    </Link>
                  </NoiseBackground>

                  <MagneticButton>
                    <Link
                      to="/products"
                      className="px-7 py-3 bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-200 hover:text-red-600 dark:hover:text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all border border-neutral-300 dark:border-neutral-800 shadow-sm block cursor-pointer"
                    >
                      Explore Catalog
                    </Link>
                  </MagneticButton>
                </div>

                {/* Stat ticker */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800/80">
                  {heroStats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-lg font-black font-mono text-neutral-900 dark:text-white">{stat.val}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Right Interactive 3D DepthCarousel Showcase */}
              <div className="relative flex flex-col items-center justify-center w-full">
                <div className="mb-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
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
                    className="py-2.5 px-5 bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-900 dark:text-white font-bold text-xs rounded-xl text-center border border-neutral-300 dark:border-neutral-700 shadow-sm transition-colors"
                  >
                    Inspect All Pre-Builts
                  </Link>
                  <Link
                    to="/builder"
                    className="py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl text-center transition-colors shadow-md"
                  >
                    Customize in Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware Partner Network & Manufacturer Trust Marquee */}
        <section className="py-7 border-y border-neutral-900/80 bg-[#0A0A0C]/90 backdrop-blur-md relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#e31b23]" />
              <span className="text-white font-bold">POWERED BY INDUSTRY-LEADING HARDWARE</span>
              <span className="text-neutral-500">//</span>
              <span className="text-neutral-400">AUTHORIZED DISTRIBUTOR NETWORK</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              100% Direct Channel Indian Warranty · Zero Gray Market
            </span>
          </div>

          <LogoLoop
            logos={brandLogos}
            speed={60}
            direction="left"
            logoHeight={34}
            gap={48}
            pauseOnHover={true}
            scaleOnHover={true}
            grayscale={true}
            fadeOut={true}
            fadeOutColor="#0A0A0C"
            ariaLabel="Authorized hardware manufacturer brand partners"
          />
        </section>

        {/* 3D Hardware Drift Wall Section */}
        <FadeContent blur={true} duration={900} easing="ease-out" initialOpacity={0}>
          <section id="drift-wall-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-red-400 font-semibold mb-3 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>Interactive 3D Hardware Matrix</span>
                </div>
                <Typography type="h2" className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Apex Hardware Drift Wall
                </Typography>
                <Typography type="body-sm" color="muted" className="max-w-2xl mt-2 text-neutral-600 dark:text-neutral-400">
                  Glide over any hardware card to pause motion, lift into 3D, and inspect apex GPUs, custom rigs, OLED displays, consoles & mechanical peripherals. Click any card to inspect detailed architecture diagnostics.
                </Typography>
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
              {[
                { id: 'all', label: 'All Apex Hardware', count: driftWallItems.length },
                { id: 'gpu', label: 'Flagship GPUs' },
                { id: 'cpu', label: 'Processors' },
                { id: 'prebuilt', label: 'Pre-Built PCs' },
                { id: 'cooler', label: 'Coolers & AIO' },
                { id: 'monitor', label: 'Displays' },
                { id: 'console', label: 'Consoles' },
                { id: 'peripherals', label: 'Peripherals' },
              ].map((tab) => {
                const isActive = driftCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDriftCategoryFilter(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg shadow-red-950/40 border border-red-500'
                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/80 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === 'all' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white text-red-600' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Drift Wall Display Stage */}
            <div className="h-[560px] sm:h-[640px] lg:h-[700px] w-full rounded-3xl overflow-hidden border border-neutral-300 dark:border-neutral-800/80 bg-neutral-100/60 dark:bg-neutral-950/95 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/[0.03] via-transparent to-red-600/[0.03] pointer-events-none z-10" />
              <DriftWall
                items={filteredDriftWallItems}
                columns={5}
                tileWidth={230}
                tileHeight={175}
                gap={20}
                tilt={13}
                turn={-11}
                perspective={1350}
                depth={110}
                speed={currentDriftSpeed}
                direction="up"
                variance={0.35}
                parallax={0.65}
                lift={72}
                fade={0.52}
                dim={0.92}
                overlayColor="#000000"
                radius={16}
                pauseOnHover={true}
              />
            </div>
          </section>
        </FadeContent>

        {/* Hardware Categories Shortcuts */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <section id="hardware-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Typography type="h2" className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Shop by Hardware Category</Typography>
                <Typography type="body-sm" color="muted" className="mt-1">Direct authorized stock with official Indian distributor RMA</Typography>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 font-mono"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Processors', icon: Cpu, href: '/products?category=cpu', count: '282 Models' },
                { name: 'Graphics Cards', icon: Tv, href: '/products?category=gpu', count: '102 Models' },
                { name: 'Motherboards', icon: Layers, href: '/products?category=motherboard', count: '24 Models' },
                { name: 'Memory (RAM)', icon: Zap, href: '/products?category=ram', count: '28 Kits' },
                { name: 'NVMe SSDs', icon: Sparkles, href: '/products?category=ssd', count: '32 Drives' },
                { name: 'Hard Drives', icon: HardDrive, href: '/products?category=hdd', count: '38 Drives' },
                { name: 'PC Cabinets', icon: Box, href: '/products?category=cabinet', count: '20 Cases' },
                { name: 'Power Supplies', icon: Zap, href: '/products?category=psu', count: '20 Models' },
                { name: 'CPU Coolers & AIOs', icon: Fan, href: '/products?category=cooler', count: '10 Coolers' },
                { name: 'PC Coolants & Fluids', icon: Droplets, href: '/products?category=coolant', count: '6 Fluids' },
                { name: 'Gaming Monitors', icon: Monitor, href: '/products?category=monitor', count: '37 Displays' },
                { name: 'Keyboards', icon: Keyboard, href: '/products?category=keyboard', count: '38 Boards' },
                { name: 'Gaming Mice', icon: Mouse, href: '/products?category=mouse', count: '35 Mice' },
                { name: 'Mousepads', icon: Layers, href: '/products?category=mousepad', count: '30 Mats' },
                { name: 'Headphones', icon: Headphones, href: '/products?category=headphones', count: '20 Models' },
                { name: 'Desktop Speakers', icon: Volume2, href: '/products?category=speakers', count: '20 Systems' },
                { name: 'Game Controllers', icon: Gamepad2, href: '/products?category=controller', count: '20 Gamepads' },
                { name: 'Webcams & Cam', icon: Camera, href: '/products?category=webcam', count: '10 Cameras' },
                { name: 'Cables & Links', icon: Cable, href: '/products?category=cables', count: '12 Cables' },
                { name: 'Pre-Built PCs', icon: Flame, href: '/products?category=prebuilt', count: '10 Signature' },
              ].map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={idx}
                    to={cat.href}
                    className="group bg-white hover:bg-neutral-50 dark:bg-neutral-900/80 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 hover:border-red-500/60 rounded-2xl p-4 transition-all flex flex-col items-center text-center shadow-sm hover:shadow-lg dark:shadow-none"
                  >
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 group-hover:border-red-500/50 group-hover:bg-red-50 dark:group-hover:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-2.5 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-1">{cat.count}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeContent>

        {/* Featured Flagship Hardware Showcase */}
        <FadeContent blur={true} duration={900} easing="ease-out" initialOpacity={0}>
          <section id="flagship-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 px-3 py-1 rounded-full text-xs font-mono text-red-600 dark:text-red-400 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Hardware Spotlight</span>
                </div>
                <Typography type="h2" className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Flagship Components & Peripherals
                </Typography>
                <Typography type="body-sm" color="muted" className="mt-1">
                  Hand-picked apex tier GPUs, CPUs, QD-OLED displays, Hall Effect controllers & audiophile headsets.
                </Typography>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto"
              >
                <span>Explore All 794 Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {flagshipProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </FadeContent>

        {/* Cinematic Scroll Reveal Manifesto Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center relative">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 px-3.5 py-1 rounded-full text-xs font-mono text-red-600 dark:text-red-400 font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Philosophy & Legacy</span>
          </div>

          <ScrollReveal
            baseOpacity={0.12}
            enableBlur
            baseRotation={2}
            blurStrength={4}
            containerClassName="text-center max-w-4xl mx-auto"
            textClassName="text-neutral-900 dark:text-white font-black tracking-tight font-sans text-xl sm:text-3xl lg:text-4xl leading-relaxed"
          >
            "We can't change what's done, we can only move on. But you have to love the irony... we've spent our whole lives fighting the system, fighting the civilized world, trying to stay free. And now? The world has caught up to us. We're ghosts, Arthur. Ghosts in a world that doesn't want us anymore. Our time has passed. We're a dying breed, and the lawmen, the banks, the politicians... they're just waiting to bury us. But I'll tell you this: they won't bury us easily, and they won't bury us alive."
          </ScrollReveal>

          <div className="mt-10 flex items-center justify-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
            <span className="w-12 h-px bg-red-600/60" />
            <span className="text-red-600 dark:text-red-400 font-bold">Dutch van der Linde</span>
            <span className="text-neutral-400 dark:text-neutral-600">•</span>
            <span className="text-neutral-700 dark:text-neutral-300">Red Dead Redemption II</span>
            <span className="w-12 h-px bg-red-600/60" />
          </div>
        </section>

        {/* Interactive Builder Feature Promo Banner */}
        <FadeContent blur={true} duration={900} easing="ease-out" initialOpacity={0}>
          <section id="compatibility-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-950/70 via-neutral-900 to-neutral-950 border border-red-800/50 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              {/* Dynamic Faulty Terminal WebGL Matrix in Compatibility Banner */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-45">
                <FaultyTerminal
                  scale={1.5}
                  gridMul={[2, 1]}
                  digitSize={1.2}
                  timeScale={0.35}
                  scanlineIntensity={0.4}
                  glitchAmount={1.05}
                  flickerAmount={0.8}
                  noiseAmp={1}
                  curvature={0.06}
                  tint="#E31B23"
                  secondaryTint="#F59E0B"
                  greyTint="#6B7280"
                  multiColorMix={true}
                  mouseReact={true}
                  mouseStrength={0.4}
                  brightness={0.8}
                />
              </div>
              <div className="absolute inset-0 w-full h-full bg-neutral-950/60 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
              <Boxes />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
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
        </FadeContent>

        {/* Hardware Telemetry Terminal Matrix (Home Below Part) */}
        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 relative">
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-3xl border border-neutral-800/90 overflow-hidden bg-neutral-950 shadow-2xl">
              {/* WebGL FaultyTerminal Canvas */}
              <div className="absolute inset-0 z-0">
                <FaultyTerminal
                  scale={1.5}
                  gridMul={[2, 1]}
                  digitSize={1.2}
                  timeScale={0.4}
                  scanlineIntensity={0.45}
                  glitchAmount={1.05}
                  flickerAmount={0.8}
                  noiseAmp={1.0}
                  chromaticAberration={0.25}
                  curvature={0.08}
                  tint="#E31B23"
                  secondaryTint="#F59E0B"
                  greyTint="#6B7280"
                  multiColorMix={true}
                  mouseReact={true}
                  mouseStrength={0.5}
                  brightness={0.85}
                />
              </div>

              {/* Gradient Vignette Overlays for Maximum Foreground Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-10" />

              {/* Interactive Telemetry Overlay Content */}
              <div className="relative z-20 h-full p-6 sm:p-10 flex flex-col justify-between pointer-events-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase bg-red-950/80 px-2.5 py-1 rounded border border-red-800/60">
                      LIVE HARDWARE TELEMETRY // REAL-TIME KERNEL MATRIX
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                    CURSOR INTERACTIVE • MULTI-COLOR MATRIX
                  </span>
                </div>

                <div className="max-w-xl">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                    Precision Engineered Hardware Verification
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-1.5 leading-relaxed">
                    Automated pin compatibility, dynamic PCIe lane allocation & thermal dissipation headroom algorithms running at bare-metal speed.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80 text-xs font-mono pointer-events-auto">
                  <div className="flex items-center gap-4 text-neutral-400">
                    <span className="text-red-400 font-bold">● RED // ARCHITECTURE</span>
                    <span className="text-amber-400 font-bold">● YELLOW // GLITCH/BUS</span>
                    <span className="text-neutral-400 font-bold">● GREY // TELEMETRY</span>
                  </div>
                  <Link
                    to="/builder"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    <span>Launch System Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </FadeContent>
      </div>
    </div>
  );
};

export default HomePage;
