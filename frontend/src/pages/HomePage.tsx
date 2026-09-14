import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Tv,
  Zap,
  Flame,
  ArrowRight,
  Layers,
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
  Server,
  Database,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { getHardwareIcon, isMonochromeHardwareIcon } from '../utils/hardwareIcons';
import { ComponentCategory } from '../types/hardware';
import DepthCarousel from '../components/common/DepthCarousel';
import DriftWall from '../components/common/DriftWall';
import LogoLoop from '../components/common/LogoLoop';
import { brandLogos } from '../data/brandLogos';
import { MagneticButton } from '../components/ui/magnetic-button';
import { NoiseBackground } from '../components/ui/noise-background';
import GradientText from '../components/common/GradientText';
import ShapeGrid from '../components/common/ShapeGrid';
import Typography from '../components/ui/Typography';
import FadeContent from '../components/common/FadeContent';
import { useTheme } from '../context/ThemeContext';

export const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [selectedPrebuiltIndex, setSelectedPrebuiltIndex] = useState(0);

  // ── Drift Wall items ──────────────────────────────────────────────────────
  const driftWallItems = useMemo(() => {
    const categories: ComponentCategory[] = [
      'gpu', 'prebuilt', 'console', 'cooler', 'monitor', 'keyboard',
      'cpu', 'cabinet', 'mouse', 'controller', 'motherboard', 'ram',
      'headphones', 'speakers', 'ssd', 'cables', 'mousepad', 'psu',
      'coolant', 'webcam',
    ];

    const curatedByCat: Record<string, { id: string; image: string; title: string; href: string; price: string; brand: string; category: ComponentCategory }[]> = {};
    const seenSlugs = new Set<string>();

    categories.forEach((cat) => {
      const prods = mockProducts
        .filter((p) => p.category === cat && !p.imageSlug.toLowerCase().includes('logo'))
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      const selectedInCat: typeof curatedByCat[string] = [];
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

    const interleaved: typeof curatedByCat[string] = [];
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

  // ── Pre-built carousel ────────────────────────────────────────────────────
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
      <div className="font-sans text-xs space-y-1 bg-neutral-950/85 p-3 rounded-xl border border-neutral-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1">
          <p className="font-extrabold text-white text-sm truncate">{pc.name}</p>
          <span className="text-[9px] bg-[#FF1E2D]/20 text-[#FF1E2D] border border-[#FF1E2D]/50 px-1.5 py-0.5 rounded font-bold shrink-0">
            {pc.tier}
          </span>
        </div>
        <p className="text-neutral-300 text-[10px] line-clamp-1">{pc.specs}</p>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-[#FF1E2D] uppercase font-bold">Price:</span>
          <span className="bg-[#FF1E2D] text-white font-black text-xs px-2 py-0.5 rounded font-sans shadow-md">
            {pc.price}
          </span>
        </div>
      </div>
    ),
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedPrebuiltIndex((prev) => (prev + 1) % prebuiltPcs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [prebuiltPcs.length]);

  return (
    <div className="relative min-h-screen pb-20">
      <div className="space-y-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          id="hero-overview"
          className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200"
        >
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-50">
            <ShapeGrid
              speed={0.5}
              squareSize={40}
              direction="diagonal"
              borderColor={isDarkMode ? 'rgba(255, 30, 45, 0.18)' : 'rgba(255, 30, 45, 0.12)'}
              hoverFillColor="#FF1E2D"
              shape="square"
              hoverTrailAmount={3}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1E2D]/10 dark:bg-[#FF1E2D]/15 rounded-full blur-[140px] pointer-events-none z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-6 text-left">
                <div className="py-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight drop-shadow-md">
                    <GradientText
                      colors={isDarkMode ? ['#FFFFFF', '#FF1E2D', '#FF6B6B', '#FFFFFF', '#FF1E2D'] : ['#0F172A', '#FF1E2D', '#FF1E2D', '#0F172A', '#FF1E2D']}
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
                  Real-Time Socket & Wattage Matching for 500+ Verified Components
                </Typography>

                <Typography type="body" color="muted" className="max-w-xl text-neutral-600 dark:text-neutral-400">
                  Guaranteed socket compatibility, wattage headroom estimation, and authentic hardware.
                </Typography>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <NoiseBackground
                    containerClassName="w-fit p-1.5 rounded-full shadow-2xl"
                    gradientColors={['rgb(255,100,150)', 'rgb(100,150,255)', 'rgb(255,200,100)']}
                  >
                    <Link
                      to="/builder"
                      className="h-full w-full cursor-pointer rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-all duration-100 active:scale-98 flex items-center justify-center gap-2"
                    >
                      Start Custom Build →
                    </Link>
                  </NoiseBackground>

                  <MagneticButton>
                    <Link
                      to="/products"
                      className="px-7 py-3 bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-200 hover:text-[#FF1E2D] font-bold text-xs uppercase tracking-wider rounded-full transition-all border border-neutral-300 dark:border-neutral-800 shadow-sm block cursor-pointer"
                    >
                      Explore Catalog
                    </Link>
                  </MagneticButton>
                </div>
              </div>

              {/* Right — Pre-built 3D carousel */}
              <div className="relative flex flex-col items-center justify-center w-full">
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
                    className="py-2.5 px-5 bg-white hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-sm transition-colors"
                  >
                    View All Pre-Builts
                  </Link>
                  <Link
                    to="/builder"
                    className="py-2.5 px-5 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                  >
                    Customize in Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Brand logo marquee ────────────────────────────────────────────── */}
        <section className="py-6 border-y border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#0A0A0C] relative overflow-hidden">
          <LogoLoop
            logos={brandLogos}
            speed={60}
            direction="left"
            logoHeight={32}
            gap={48}
            pauseOnHover={true}
            scaleOnHover={true}
            grayscale={true}
            fadeOut={true}
            fadeOutColor={isDarkMode ? '#0A0A0C' : '#ffffff'}
            ariaLabel="Hardware brand partners"
          />
        </section>

        {/* ── Drift Wall ────────────────────────────────────────────────────── */}
        <FadeContent blur={true} duration={900} easing="ease-out" initialOpacity={0}>
          <section id="drift-wall" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Typography type="h2" className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                Browse Hardware
              </Typography>
            </div>

            <div className="h-[560px] sm:h-[640px] lg:h-[700px] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/60 dark:bg-neutral-950/95 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF1E2D]/[0.03] via-transparent to-[#FF1E2D]/[0.03] pointer-events-none z-10" />
              <DriftWall
                items={driftWallItems}
                columns={5}
                tileWidth={230}
                tileHeight={175}
                gap={20}
                tilt={13}
                turn={-11}
                perspective={1350}
                depth={110}
                speed={34}
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

        {/* ── Hardware Categories ───────────────────────────────────────────── */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <section id="hardware-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Typography type="h2" className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Shop by Category
                </Typography>
                <Typography type="body-sm" color="muted" className="mt-1">
                  Authorized stock with official Indian distributor RMA
                </Typography>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-[#FF1E2D] hover:text-[#FF3B48] flex items-center gap-1"
              >
                <span>All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Processors',          iconKey: 'cpu',         icon: Cpu,       href: '/products?category=cpu',                    count: '282 Models' },
                { name: 'Graphics Cards',      iconKey: 'gpu',         icon: Tv,        href: '/products?category=gpu',                    count: '102 Models' },
                { name: 'Motherboards',        iconKey: 'motherboard', icon: Layers,    href: '/products?category=motherboard',            count: '24 Models'  },
                { name: 'Memory (RAM)',         iconKey: 'ram',         icon: Zap,       href: '/products?category=ram',                    count: '28 Kits'    },
                { name: 'NVMe SSDs',           iconKey: 'ssd',         icon: Sparkles,  href: '/products?category=ssd',                    count: '32 Drives'  },
                { name: 'Hard Drives',         iconKey: 'hdd',         icon: HardDrive, href: '/products?category=hdd',                    count: '38 Drives'  },
                { name: 'PC Cabinets',         iconKey: 'cabinet',     icon: Box,       href: '/products?category=cabinet',                count: '20 Cases'   },
                { name: 'Power Supplies',      iconKey: 'psu',         icon: Zap,       href: '/products?category=psu',                    count: '20 Models'  },
                { name: 'CPU Coolers & AIOs',  iconKey: 'cooler',      icon: Fan,       href: '/products?category=cooler',                 count: '10 Coolers' },
                { name: 'Coolants & Fluids',   iconKey: 'coolant',     icon: Droplets,  href: '/products?category=coolant',                count: '6 Fluids'   },
                { name: 'Gaming Monitors',     iconKey: 'monitor',     icon: Monitor,   href: '/products?category=monitor',                count: '37 Displays'},
                { name: 'Keyboards',           iconKey: 'keyboard',    icon: Keyboard,  href: '/products?category=keyboard',               count: '38 Boards'  },
                { name: 'Gaming Mice',         iconKey: 'mouse',       icon: Mouse,     href: '/products?category=mouse',                  count: '35 Mice'    },
                { name: 'Mousepads',           iconKey: 'mousepad',    icon: Layers,    href: '/products?category=mousepad',               count: '30 Mats'    },
                { name: 'Headphones',          iconKey: 'headphones',  icon: Headphones,href: '/products?category=headphones',            count: '20 Models'  },
                { name: 'Speakers',            iconKey: 'speakers',    icon: Volume2,   href: '/products?category=speakers',               count: '20 Systems' },
                { name: 'Controllers',         iconKey: 'controller',  icon: Gamepad2,  href: '/products?category=controller',             count: '20 Gamepads'},
                { name: 'Webcams',             iconKey: 'webcam',      icon: Camera,    href: '/products?category=webcam',                 count: '10 Cameras' },
                { name: 'Cables',              iconKey: 'cables',      icon: Cable,     href: '/products?category=cables',                 count: '12 Cables'  },
                { name: 'Pre-Built PCs',       iconKey: 'prebuilt',    icon: Flame,     href: '/products?category=prebuilt',               count: '10 Rigs'    },
                { name: 'Servers',             iconKey: 'server',      icon: Server,    href: '/servers',                                  count: 'HPC'        },
                { name: 'AI Systems',          iconKey: 'ai',          icon: Sparkles,  href: '/servers?useCase=ai-training',              count: 'Exascale'   },
                { name: 'Storage Arrays',      iconKey: 'database',    icon: Database,  href: '/servers?useCase=storage',                  count: 'SAN'        },
                { name: 'Consoles',            iconKey: 'console',     icon: Gamepad2,  href: '/console',                                  count: 'PS / Xbox'  },
              ].map((cat, idx) => {
                const Icon = cat.icon;
                const iconSrc = getHardwareIcon(cat.iconKey);
                const isMono = isMonochromeHardwareIcon(cat.iconKey);
                return (
                  <Link
                    key={idx}
                    to={cat.href}
                    className="group bg-white hover:bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF1E2D]/60 rounded-2xl p-4 transition-all flex flex-col items-center text-center shadow-sm hover:shadow-lg dark:shadow-none"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 group-hover:border-[#FF1E2D]/50 group-hover:bg-[#FF1E2D]/10 flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-110 shadow-inner text-[#FF1E2D]">
                      {iconSrc ? (
                        <img
                          src={iconSrc}
                          alt={cat.name}
                          className={`w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110 ${
                            isMono ? 'dark:invert dark:brightness-125' : ''
                          }`}
                          loading="lazy"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-[#FF1E2D] transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-[#FF1E2D] dark:group-hover:text-[#FF1E2D] transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#FF1E2D] font-bold mt-1">{cat.count}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeContent>

      </div>
    </div>
  );
};

export default HomePage;
