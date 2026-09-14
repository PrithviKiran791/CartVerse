import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Gamepad2,
  BookOpen,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { Product } from '../types/hardware';
import { ProductCard } from '../components/catalog/ProductCard';
import { ConsoleSpecsModal } from '../components/catalog/ConsoleSpecsModal';
import { motion, AnimatePresence } from 'framer-motion';
import { getComponentImage } from '../utils/assetRegistry';
import { cn } from '../lib/utils';
import { BackgroundBoxesDemo } from '../components/ui/background-boxes';
import playstationIcon from '../assets/icons/Playstation.png';
import nintendoIcon from '../assets/icons/nintendo.png';
import xboxIcon from '../assets/icons/xbox.png';
import consoleGif from '../assets/icons/Console.gif';
import playstationGif from '../assets/icons/Playstation.gif';
import nintendoGif from '../assets/icons/nintendo.gif';
import xboxGif from '../assets/icons/Xbox.gif';
import FaultyTerminal from '../components/common/FaultyTerminal';

type BrandTab = 'all' | 'nintendo' | 'sony' | 'xbox';

interface ArchGuide {
  era: string;
  silicon: string;
  impact: string;
  brand: 'nintendo' | 'sony' | 'xbox';
}

const ARCHITECTURE_EVOLUTION_GUIDES: ArchGuide[] = [
  // Sony
  {
    era: 'The PS3 Era (2006–2013)',
    silicon: 'Cell Broadband Engine & Split RAM',
    impact: 'The Cell processor featured a PowerPC core (PPE) with 8 Synergistic Processing Elements (SPEs). Split 256MB System + 256MB Video RAM bottlenecked multiplatform engines but unlocked legendary exclusives like The Last of Us.',
    brand: 'sony'
  },
  {
    era: 'The PS4 Era (2013–2020)',
    silicon: 'x86 Transition & Unified GDDR5',
    impact: 'Sony adopted standard x86 silicon with a custom AMD Jaguar APU and a massive 8GB unified GDDR5 memory pool, eliminating split-RAM bottlenecks for massive open-world streaming.',
    brand: 'sony'
  },
  {
    era: 'The PS4 Pro (2016)',
    silicon: 'Checkerboard 4K & Dual-GPU Engine',
    impact: 'Doubled GPU compute power (1.84 to 4.2 TFLOPs) and pioneered Checkerboard Rendering to reconstruct 1440p/1800p into 4K without crushing framerates.',
    brand: 'sony'
  },
  {
    era: 'The PS5 & PS5 Pro (2020–2024)',
    silicon: 'Custom Gen4 NVMe SSD & PSSR AI Upscaling',
    impact: 'Raw 5.5 GB/s bandwidth SSD eliminated loading screens. PS5 Pro introduced PlayStation Spectral Super Resolution (PSSR) machine-learning hardware upscaling for 4K 60FPS Ray Tracing.',
    brand: 'sony'
  },
  // Xbox
  {
    era: 'The Xbox 360 Era (2005–2013)',
    silicon: 'Custom IBM PowerPC & ATI Xenos Unified Shaders',
    impact: 'Pioneered unified shader architecture before PC standards. 512MB unified GDDR3 RAM ensured superior multiplatform performance and established Xbox Live as the gold standard.',
    brand: 'xbox'
  },
  {
    era: 'The Xbox One Era (2013–2016)',
    silicon: 'AMD Jaguar & 32MB eSRAM Cache',
    impact: '8GB DDR3 paired with 32MB high-speed eSRAM. Microsoft later pivoted from TV passthrough to pure gaming performance with the Xbox One S.',
    brand: 'xbox'
  },
  {
    era: 'The Xbox One X (2017)',
    silicon: 'Scorpio Engine (6.0 TFLOPs & Vapor Chamber)',
    impact: 'Reclaimed performance dominance with 12GB GDDR5 and 6 TFLOP GPU capable of native 4K output and vapor chamber thermal cooling.',
    brand: 'xbox'
  },
  {
    era: 'The Xbox Series Era (2020–2024)',
    silicon: 'AMD Zen 2, RDNA 2 & Velocity Architecture',
    impact: 'Dual-SKU design (Series X 12.15 TFLOPs 4K, Series S 4 TFLOPs 1440p). Xbox Velocity Architecture enables instant hardware Quick Resume across multiple games.',
    brand: 'xbox'
  },
  // Nintendo
  {
    era: 'Handheld Legacy & Dual Screens (2001–2017)',
    silicon: 'ARM Architecture, Dual Screens & Glasses-Free 3D',
    impact: 'Pioneered dual-screen touch gameplay with the DS, custom autostereoscopic 3D screens with 3DS, and ultra-portable ARM power efficiency.',
    brand: 'nintendo'
  },
  {
    era: 'The Nintendo Switch Era (2017–2024)',
    silicon: 'Custom NVIDIA Tegra & Hybrid Docking',
    impact: 'Unified home console and handheld gaming into a single hybrid system. The OLED model refined the experience with 7-inch vibrant display technology.',
    brand: 'nintendo'
  }
];

interface NumberPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  accentColor?: 'red' | 'blue' | 'emerald' | 'default';
  className?: string;
  itemLabel?: string;
}

const NumberPagination: React.FC<NumberPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  accentColor = 'default',
  className = '',
  itemLabel = 'consoles',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getAccentClass = (isActive: boolean) => {
    if (!isActive) {
      return 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border-neutral-800';
    }
    switch (accentColor) {
      case 'red':
        return 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50 ring-2 ring-red-500/30';
      case 'blue':
        return 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-950/50 ring-2 ring-blue-500/30';
      case 'emerald':
        return 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/30';
      default:
        return 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50 ring-2 ring-red-500/30';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-none bg-[#0E0C13] border-2 border-neutral-800 shadow-[5px_5px_0px_0px_#000000] select-none',
        className
      )}
    >
      {/* Items count summary */}
      <div className="text-xs text-neutral-400 font-mono font-bold flex items-center gap-2 uppercase tracking-wider">
        <span
          className={cn(
            'w-2 h-2 rounded-none animate-pulse',
            accentColor === 'blue'
              ? 'bg-blue-500'
              : accentColor === 'emerald'
              ? 'bg-emerald-500'
              : 'bg-[#FF1E2D]'
          )}
        />
        <span>
          Showing <strong className="text-white font-mono">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-white font-mono">{totalItems}</strong> {itemLabel}
        </span>
      </div>

      {/* Numbered Page Buttons & Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center font-mono">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className={cn(
            'px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all border-2 cursor-pointer',
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed text-neutral-600 border-neutral-800 bg-neutral-950'
              : 'text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]'
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        {/* Page Number Buttons */}
        {pages.map((pageNum) => {
          const isActive = pageNum === currentPage;
          let activeClass = 'bg-[#FF1E2D] text-white border-white shadow-[2px_2px_0px_0px_#ffffff]';
          if (accentColor === 'blue') activeClass = 'bg-blue-600 text-white border-white shadow-[2px_2px_0px_0px_#ffffff]';
          if (accentColor === 'emerald') activeClass = 'bg-emerald-600 text-white border-white shadow-[2px_2px_0px_0px_#ffffff]';

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'min-w-[34px] h-[34px] px-2.5 rounded-none text-xs font-mono font-bold transition-all border-2 flex items-center justify-center cursor-pointer',
                isActive
                  ? activeClass
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={cn(
            'px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all border-2 cursor-pointer',
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed text-neutral-600 border-neutral-800 bg-neutral-950'
              : 'text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]'
          )}
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page X of Y Badge */}
      <div className="text-xs font-mono text-neutral-500 uppercase hidden md:block">
        PAGE <span className="text-neutral-200 font-bold">{currentPage}</span> / {totalPages}
      </div>
    </div>
  );
};

export const ConsolePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const brandQuery = (searchParams.get('brand') || 'all').toLowerCase();
  const initialBrand: BrandTab =
    brandQuery === 'nintendo' || brandQuery === 'sony' || brandQuery === 'xbox'
      ? brandQuery
      : 'all';

  const [activeBrand, setActiveBrand] = useState<BrandTab>(initialBrand);
  const [genFilter, setGenFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Synchronize state with URL search param
  useEffect(() => {
    const q = (searchParams.get('brand') || 'all').toLowerCase() as BrandTab;
    if (q !== activeBrand && (q === 'all' || q === 'nintendo' || q === 'sony' || q === 'xbox')) {
      setActiveBrand(q);
      setGenFilter('all');
    }
  }, [searchParams]);

  const handleBrandChange = (brand: BrandTab) => {
    setActiveBrand(brand);
    setGenFilter('all');
    if (brand === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ brand });
    }
  };

  // Brand logo URLs
  const nintendoLogoImg = getComponentImage('Console/Nintendo/Nintendo_logo.jpg', 'console');
  const sonyLogoImg = getComponentImage('Console/Sony/Playstation_Logo.jpeg', 'console');
  const xboxLogoImg = getComponentImage('Console/Xbox/Xbox_logo.png', 'console');

  // Strict Brand Partitions (Zero Cross-Contamination)
  const allConsoleProducts = useMemo(() => {
    return mockProducts.filter(
      (p) =>
        p.category === 'console' &&
        !p.name.toLowerCase().includes('logo') &&
        !p.imageSlug.toLowerCase().includes('logo')
    );
  }, []);

  // Strict Brand Lists based on directory path & brand name
  const nintendoProducts = useMemo(() => {
    return allConsoleProducts.filter(
      (p) => p.brand === 'Nintendo' || p.imageSlug.startsWith('Console/Nintendo/')
    );
  }, [allConsoleProducts]);

  const sonyProducts = useMemo(() => {
    return allConsoleProducts.filter(
      (p) => p.brand === 'Sony' || p.imageSlug.startsWith('Console/Sony/')
    );
  }, [allConsoleProducts]);

  const xboxProducts = useMemo(() => {
    return allConsoleProducts.filter(
      (p) => p.brand === 'Xbox' || p.imageSlug.startsWith('Console/Xbox/')
    );
  }, [allConsoleProducts]);


  // Filter helper applied to a specific brand list
  const filterList = (list: Product[], brandName: 'nintendo' | 'sony' | 'xbox') => {
    return list
      .filter((p) => {
        // Sub-generation filter if active on this brand
        if (activeBrand === brandName && genFilter !== 'all') {
          const nameLower = p.name.toLowerCase();
          if (genFilter === 'switch' && !nameLower.includes('switch')) return false;
          if (genFilter === 'ds-3ds' && !nameLower.includes('ds') && !nameLower.includes('3ds') && !nameLower.includes('2ds')) return false;
          if (genFilter === 'gba' && !nameLower.includes('game boy') && !nameLower.includes('gba')) return false;

          if (genFilter === 'ps5' && !nameLower.includes('ps5') && !nameLower.includes('playstation 5')) return false;
          if (genFilter === 'ps4' && !nameLower.includes('ps4') && !nameLower.includes('playstation 4')) return false;
          if (genFilter === 'ps3' && !nameLower.includes('ps3') && !nameLower.includes('playstation 3')) return false;

          if (genFilter === 'series' && !nameLower.includes('series')) return false;
          if (genFilter === 'one' && !nameLower.includes('xbox one')) return false;
          if (genFilter === '360' && !nameLower.includes('360')) return false;
        }

        return true;
      })
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  };

  const filteredNintendo = useMemo(() => filterList(nintendoProducts, 'nintendo'), [nintendoProducts, activeBrand, genFilter]);
  const filteredSony = useMemo(() => filterList(sonyProducts, 'sony'), [sonyProducts, activeBrand, genFilter]);
  const filteredXbox = useMemo(() => filterList(xboxProducts, 'xbox'), [xboxProducts, activeBrand, genFilter]);

  // Pagination Constants
  const GRID_PAGE_SIZE = 8;

  // Pagination States for distinct sections
  const [brandGridPage, setBrandGridPage] = useState<number>(1);
  const [nintendoSectionPage, setNintendoSectionPage] = useState<number>(1);
  const [sonySectionPage, setSonySectionPage] = useState<number>(1);
  const [xboxSectionPage, setXboxSectionPage] = useState<number>(1);

  // Black & Red interactive palette for Aceternity Background Boxes
  const blackAndRedBoxColors = useMemo(() => {
    return [
      '#FF1E2D', // CartVerse Crimson Red
      '#FF2A35', // Bright Red
      '#FF1E2D', // Deep Red
      '#990000', // Dark Burgundy
      '#7F1D1D', // Dark Red
      '#B91C1C', // Brick Red
      '#EF4444', // Neon Coral Red
      '#FF4D4D', // Light Scarlet
    ];
  }, []);

  // Dynamic WebGL matrix tint for FaultyTerminal
  const terminalTint = useMemo(() => {
    if (activeBrand === 'sony') return '#3B82F6';
    if (activeBrand === 'nintendo') return '#FF1E2D';
    if (activeBrand === 'xbox') return '#A7EF9E';
    return '#A7EF9E';
  }, [activeBrand]);

  // Reset page counters when brand or generation filters change
  useEffect(() => {
    setBrandGridPage(1);
    setNintendoSectionPage(1);
    setSonySectionPage(1);
    setXboxSectionPage(1);
  }, [activeBrand, genFilter]);

  // Paginated products for dedicated Brand Sub-Pages (Grid View)
  const currentBrandProducts = useMemo(() => {
    if (activeBrand === 'nintendo') return filteredNintendo;
    if (activeBrand === 'sony') return filteredSony;
    if (activeBrand === 'xbox') return filteredXbox;
    return [];
  }, [activeBrand, filteredNintendo, filteredSony, filteredXbox]);

  const totalBrandPages = Math.max(1, Math.ceil(currentBrandProducts.length / GRID_PAGE_SIZE));
  const currentBrandGridPage = Math.min(brandGridPage, totalBrandPages);
  const pagedBrandProducts = useMemo(() => {
    const start = (currentBrandGridPage - 1) * GRID_PAGE_SIZE;
    return currentBrandProducts.slice(start, start + GRID_PAGE_SIZE);
  }, [currentBrandProducts, currentBrandGridPage]);

  // Paginated products for 3 distinct sections in 'all' view (Grid View)
  const totalNintendoPages = Math.max(1, Math.ceil(filteredNintendo.length / GRID_PAGE_SIZE));
  const currentNintendoSectionPage = Math.min(nintendoSectionPage, totalNintendoPages);
  const pagedNintendo = useMemo(() => {
    const start = (currentNintendoSectionPage - 1) * GRID_PAGE_SIZE;
    return filteredNintendo.slice(start, start + GRID_PAGE_SIZE);
  }, [filteredNintendo, currentNintendoSectionPage]);

  const totalSonyPages = Math.max(1, Math.ceil(filteredSony.length / GRID_PAGE_SIZE));
  const currentSonySectionPage = Math.min(sonySectionPage, totalSonyPages);
  const pagedSony = useMemo(() => {
    const start = (currentSonySectionPage - 1) * GRID_PAGE_SIZE;
    return filteredSony.slice(start, start + GRID_PAGE_SIZE);
  }, [filteredSony, currentSonySectionPage]);

  const totalXboxPages = Math.max(1, Math.ceil(filteredXbox.length / GRID_PAGE_SIZE));
  const currentXboxSectionPage = Math.min(xboxSectionPage, totalXboxPages);
  const pagedXbox = useMemo(() => {
    const start = (currentXboxSectionPage - 1) * GRID_PAGE_SIZE;
    return filteredXbox.slice(start, start + GRID_PAGE_SIZE);
  }, [filteredXbox, currentXboxSectionPage]);

  const handleOpenSpecModal = (product: Product) => {
    setSelectedProduct(product);
    setIsSpecModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col pb-24 relative overflow-hidden">
      {/* Full-Page Dynamic Faulty Terminal WebGL Matrix Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none opacity-60">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint={terminalTint}
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={true}
          brightness={0.6}
        />
        {/* Pure Black Vignette Gradients to keep console cards and typography 100% crisp & readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,black_85%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 z-10 w-full space-y-8 relative pointer-events-none">
        {/* Aceternity Background Boxes Hero Showcase */}
        <div className="relative group pointer-events-auto">
          <BackgroundBoxesDemo
            colors={blackAndRedBoxColors}
            containerBg="bg-black"
            className="min-h-[22rem] sm:min-h-[25rem] py-8 px-6 sm:px-10 rounded-none bg-[#0A080F] border-2 sm:border-[3px] border-neutral-800 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D] relative"
          >
            {/* Viewport Corner Crosshairs */}
            <span className="absolute top-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute top-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute bottom-2 left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>
            <span className="absolute bottom-2 right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none z-30">+</span>

            <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Column: Badge, Title, Subtitle */}
              <div className="flex-1 text-center lg:text-left space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#FF1E2D] bg-[#FF1E2D]/15 text-[#FF1E2D] shadow-[3px_3px_0px_0px_#FF1E2D]">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>
                    //{' '}
                    {activeBrand === 'nintendo'
                      ? `NINTENDO HARDWARE VAULT (${nintendoProducts.length} SYSTEMS)`
                      : activeBrand === 'sony'
                      ? `PLAYSTATION HARDWARE HUB (${sonyProducts.length} SYSTEMS)`
                      : activeBrand === 'xbox'
                      ? `XBOX HARDWARE ECOSYSTEM (${xboxProducts.length} SYSTEMS)`
                      : `CONSOLES & GAMING ECOSYSTEM (${allConsoleProducts.length} SYSTEMS)`}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
                  {activeBrand === 'nintendo'
                    ? 'Nintendo Hardware Vault'
                    : activeBrand === 'sony'
                    ? 'PlayStation Hardware Hub'
                    : activeBrand === 'xbox'
                    ? 'Xbox Hardware Ecosystem'
                    : 'Gaming Consoles & Hardware'}
                </h1>

                <p className="max-w-2xl text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
                  {activeBrand === 'nintendo'
                    ? 'Explore authentic Nintendo Switch OLED, Switch 2, 3DS/2DS XL, DS Lite, and Game Boy Advance.'
                    : activeBrand === 'sony'
                    ? 'Explore PlayStation 5 Pro (2TB), PS5 Slim Disc & Digital, PS4 Pro 4K, and PS3 Classics.'
                    : activeBrand === 'xbox'
                    ? 'Explore Xbox Series X, Series S Carbon, Xbox One X, and 360 Classics with Velocity Architecture.'
                    : 'Explore genuine Nintendo, Sony PlayStation, and Microsoft Xbox consoles with generation guides and full technical specifications.'}
                </p>
              </div>

              {/* Right Column: Hero Visual Box */}
              <div className="shrink-0 relative group/hero">
                <div className="relative w-64 sm:w-72 md:w-80 aspect-video rounded-none overflow-hidden border-2 border-neutral-700 bg-neutral-950 shadow-[6px_6px_0px_0px_#FF1E2D] transition-all duration-300 flex items-center justify-center p-6">
                  {/* Chamber top label */}
                  <div className="absolute top-1 left-2 right-2 flex items-center justify-between text-[8px] font-mono text-neutral-400 border-b border-neutral-900 pb-0.5 z-10">
                    <span>HARDWARE // VIEWPORT</span>
                    <span className="text-[#FF1E2D] font-bold">ONLINE</span>
                  </div>

                  {activeBrand === 'all' ? (
                    <>
                      <img
                        src={consoleGif}
                        alt="Console Animation"
                        className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : activeBrand === 'nintendo' ? (
                    <img
                      src={nintendoIcon}
                      alt="Nintendo Logo"
                      className="max-h-16 w-auto object-contain group-hover/hero:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,30,45,0.5)]"
                    />
                  ) : activeBrand === 'sony' ? (
                    <img
                      src={playstationIcon}
                      alt="PlayStation Logo"
                      className="max-h-20 w-auto object-contain group-hover/hero:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    />
                  ) : (
                    <img
                      src={xboxIcon}
                      alt="Xbox Logo"
                      className="max-h-20 w-auto object-contain group-hover/hero:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    />
                  )}
                </div>
              </div>
            </div>
          </BackgroundBoxesDemo>
        </div>

        {/* Navigation Tabs Bar for Consoles & Brand Sub-Pages */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#0E0C13] border-2 border-neutral-800 p-3 rounded-none shadow-[6px_6px_0px_0px_#000000] gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar font-mono">
            <button
              onClick={() => handleBrandChange('all')}
              className={`px-4 py-2 rounded-none font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 border-2 cursor-pointer ${
                activeBrand === 'all'
                  ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#ffffff]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-white" />
              <span>[ALL] CONSOLES ({allConsoleProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('nintendo')}
              className={`px-4 py-2 rounded-none font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shrink-0 border-2 cursor-pointer ${
                activeBrand === 'nintendo'
                  ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#FF1E2D]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
              }`}
            >
              <img
                src={nintendoIcon}
                alt="Nintendo"
                className="h-3.5 w-auto object-contain transition-all"
              />
              <span>NINTENDO ({nintendoProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('sony')}
              className={`px-4 py-2 rounded-none font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shrink-0 border-2 cursor-pointer ${
                activeBrand === 'sony'
                  ? 'bg-blue-600 text-white border-white shadow-[3px_3px_0px_0px_#3B82F6]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
              }`}
            >
              <img
                src={playstationIcon}
                alt="PlayStation"
                className="w-4 h-4 object-contain transition-all"
              />
              <span>PLAYSTATION ({sonyProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('xbox')}
              className={`px-4 py-2 rounded-none font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shrink-0 border-2 cursor-pointer ${
                activeBrand === 'xbox'
                  ? 'bg-emerald-600 text-white border-white shadow-[3px_3px_0px_0px_#10B981]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
              }`}
            >
              <img
                src={xboxIcon}
                alt="Xbox"
                className={`w-4 h-4 object-contain transition-all ${
                  activeBrand === 'xbox' ? 'brightness-0 invert' : ''
                }`}
              />
              <span>XBOX ({xboxProducts.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsArchModalOpen(true)}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 border-2 border-neutral-700 hover:border-[#FF1E2D] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 transition-all shrink-0 justify-center cursor-pointer shadow-[3px_3px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <BookOpen className="w-4 h-4 text-[#FF1E2D]" />
              <span>// ARCHITECTURE GUIDE</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED NINTENDO VAULT SUB-PAGE                                */}
        {/* ========================================================================= */}
        {activeBrand === 'nintendo' && (
          <div className="space-y-8 pointer-events-auto">
            {/* Nintendo Banner */}
            <div className="relative bg-[#12080A] p-6 sm:p-8 rounded-none border-2 sm:border-[3px] border-red-700 shadow-[8px_8px_0px_0px_#FF1E2D] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none bg-red-950/80 text-red-400 text-xs font-mono font-bold uppercase tracking-wider border-2 border-red-500 shadow-[2px_2px_0px_0px_#FF1E2D]">
                    <span>// EXCLUSIVE BRAND VAULT: NINTENDO</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
                    Nintendo Hardware Vault
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    Explore genuine Nintendo systems including Switch OLED, Switch 2, Nintendo 3DS/2DS XL, Nintendo DS Lite, and Game Boy Advance.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-none overflow-hidden border-2 border-red-700 bg-neutral-950 shadow-[4px_4px_0px_0px_#FF1E2D] flex items-center justify-center p-6 relative group">
                  <img
                    src={nintendoIcon}
                    alt="Nintendo Logo"
                    className="max-h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,30,45,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Nintendo Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b-2 border-neutral-800 font-mono">
              <span className="text-xs font-mono font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">// GEN:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'all'
                    ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#FF1E2D]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                All Nintendo ({nintendoProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('switch')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'switch'
                    ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#FF1E2D]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Switch & OLED Models
              </button>
              <button
                onClick={() => setGenFilter('ds-3ds')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'ds-3ds'
                    ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#FF1E2D]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Dual-Screen (DS & 3DS / 2DS)
              </button>
              <button
                onClick={() => setGenFilter('gba')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'gba'
                    ? 'bg-[#FF1E2D] text-white border-white shadow-[3px_3px_0px_0px_#FF1E2D]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Game Boy Advance & Micro
              </button>
            </div>

            {/* Nintendo Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pagedBrandProducts.map((product) => (
                <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Number Page Navigation */}
            <NumberPagination
              currentPage={currentBrandGridPage}
              totalPages={totalBrandPages}
              totalItems={filteredNintendo.length}
              pageSize={GRID_PAGE_SIZE}
              onPageChange={(p) => setBrandGridPage(p)}
              accentColor="red"
              itemLabel="Nintendo systems"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEDICATED SONY PLAYSTATION HUB SUB-PAGE                          */}
        {/* ========================================================================= */}
        {activeBrand === 'sony' && (
          <div className="space-y-8 pointer-events-auto">
            {/* PlayStation Banner */}
            <div className="relative bg-[#080D18] p-6 sm:p-8 rounded-none border-2 sm:border-[3px] border-blue-600 shadow-[8px_8px_0px_0px_#2563EB] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none bg-blue-950/80 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border-2 border-blue-500 shadow-[2px_2px_0px_0px_#2563EB]">
                    <span>// EXCLUSIVE BRAND VAULT: PLAYSTATION</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
                    PlayStation Hardware Hub
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    Explore PlayStation 5 Pro (2TB), PS5 Slim Disc & Digital, PS4 Pro 4K, PS4 Slim Special Editions, and PS3 Classics.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-none overflow-hidden border-2 border-blue-600 bg-neutral-950 shadow-[4px_4px_0px_0px_#2563EB] flex items-center justify-center p-6 relative group">
                  <img
                    src={playstationIcon}
                    alt="PlayStation Logo"
                    className="max-h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* PlayStation Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b-2 border-neutral-800 font-mono">
              <span className="text-xs font-mono font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">// GEN:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'all'
                    ? 'bg-blue-600 text-white border-white shadow-[3px_3px_0px_0px_#2563EB]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                All PlayStation ({sonyProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('ps5')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'ps5'
                    ? 'bg-blue-600 text-white border-white shadow-[3px_3px_0px_0px_#2563EB]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                PS5 Generation (Base / Slim / Pro)
              </button>
              <button
                onClick={() => setGenFilter('ps4')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'ps4'
                    ? 'bg-blue-600 text-white border-white shadow-[3px_3px_0px_0px_#2563EB]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                PS4 Generation (Slim & Pro 4K)
              </button>
              <button
                onClick={() => setGenFilter('ps3')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'ps3'
                    ? 'bg-blue-600 text-white border-white shadow-[3px_3px_0px_0px_#2563EB]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                PS3 Generation (Fat / Slim / Super Slim)
              </button>
            </div>

            {/* PlayStation Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pagedBrandProducts.map((product) => (
                <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Number Page Navigation */}
            <NumberPagination
              currentPage={currentBrandGridPage}
              totalPages={totalBrandPages}
              totalItems={filteredSony.length}
              pageSize={GRID_PAGE_SIZE}
              onPageChange={(p) => setBrandGridPage(p)}
              accentColor="blue"
              itemLabel="PlayStation systems"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DEDICATED MICROSOFT XBOX ECOSYSTEM SUB-PAGE                      */}
        {/* ========================================================================= */}
        {activeBrand === 'xbox' && (
          <div className="space-y-8 pointer-events-auto">
            {/* Xbox Banner */}
            <div className="relative bg-[#07130E] p-6 sm:p-8 rounded-none border-2 sm:border-[3px] border-emerald-600 shadow-[8px_8px_0px_0px_#059669] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none bg-emerald-950/80 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border-2 border-emerald-500 shadow-[2px_2px_0px_0px_#059669]">
                    <span>// EXCLUSIVE BRAND VAULT: MICROSOFT XBOX</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
                    Microsoft Xbox Ecosystem
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    Explore Xbox Series X 1TB, Xbox Series S Carbon Black, Xbox One X Native 4K, Xbox One S, and Xbox 360 Slim systems.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-none overflow-hidden border-2 border-emerald-600 bg-neutral-950 shadow-[4px_4px_0px_0px_#059669] flex items-center justify-center p-6 relative group">
                  <img
                    src={xboxIcon}
                    alt="Xbox Logo"
                    className="max-h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Xbox Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b-2 border-neutral-800 font-mono">
              <span className="text-xs font-mono font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">// GEN:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'all'
                    ? 'bg-emerald-600 text-white border-white shadow-[3px_3px_0px_0px_#059669]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                All Xbox ({xboxProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('series')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'series'
                    ? 'bg-emerald-600 text-white border-white shadow-[3px_3px_0px_0px_#059669]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Xbox Series X | S
              </button>
              <button
                onClick={() => setGenFilter('one')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === 'one'
                    ? 'bg-emerald-600 text-white border-white shadow-[3px_3px_0px_0px_#059669]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Xbox One Series (One, One S, One X)
              </button>
              <button
                onClick={() => setGenFilter('360')}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                  genFilter === '360'
                    ? 'bg-emerald-600 text-white border-white shadow-[3px_3px_0px_0px_#059669]'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                Xbox 360 Era (Arcade, Slim, E)
              </button>
            </div>

            {/* Xbox Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pagedBrandProducts.map((product) => (
                <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Number Page Navigation */}
            <NumberPagination
              currentPage={currentBrandGridPage}
              totalPages={totalBrandPages}
              totalItems={filteredXbox.length}
              pageSize={GRID_PAGE_SIZE}
              onPageChange={(p) => setBrandGridPage(p)}
              accentColor="emerald"
              itemLabel="Xbox systems"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: ALL CONSOLES OVERVIEW (3 SEPARATED DISTINCT BRAND SECTIONS)      */}
        {/* ========================================================================= */}
        {activeBrand === 'all' && (
          <div className="space-y-16 pointer-events-auto">
            {/* Top Overview Banner */}
            <div className="relative bg-[#0E0C13] p-6 sm:p-8 rounded-none border-2 sm:border-[3px] border-neutral-800 shadow-[8px_8px_0px_0px_#FF1E2D] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none bg-red-950/80 text-[#FF1E2D] text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#FF1E2D] shadow-[2px_2px_0px_0px_#000000]">
                    <span>// MULTI-PLATFORM CATALOGUE</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
                    Gaming Consoles & Hardware
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    Browse our separated brand collections below: Nintendo portable & hybrid systems, Sony PlayStation home powerhouses, and Microsoft Xbox consoles.
                  </p>
                </div>
              </div>

              {/* Brand Animated Showcase Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t-2 border-neutral-800">
                {/* Nintendo Card */}
                <a
                  href="#section-nintendo"
                  className="relative overflow-hidden rounded-none border-2 border-neutral-800 hover:border-red-500 bg-[#0E0C13] p-5 transition-all duration-200 group shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#FF1E2D] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black mb-4 border-2 border-neutral-800">
                    <img
                      src={nintendoGif}
                      alt="Nintendo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={nintendoIcon} alt="Nintendo" className="h-4 w-auto object-contain" />
                      <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors uppercase font-mono">Nintendo Vault</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">[{nintendoProducts.length} models]</span>
                  </div>
                </a>

                {/* PlayStation Card */}
                <a
                  href="#section-playstation"
                  className="relative overflow-hidden rounded-none border-2 border-neutral-800 hover:border-blue-500 bg-[#0E0C13] p-5 transition-all duration-200 group shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#2563EB] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black mb-4 border-2 border-neutral-800">
                    <img
                      src={playstationGif}
                      alt="PlayStation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={playstationIcon} alt="PlayStation" className="w-4 h-4 object-contain" />
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase font-mono">PlayStation Hub</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">[{sonyProducts.length} models]</span>
                  </div>
                </a>

                {/* Xbox Card */}
                <a
                  href="#section-xbox"
                  className="relative overflow-hidden rounded-none border-2 border-neutral-800 hover:border-emerald-500 bg-[#0E0C13] p-5 transition-all duration-200 group shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#059669] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black mb-4 border-2 border-neutral-800">
                    <img
                      src={xboxGif}
                      alt="Xbox"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={xboxIcon} alt="Xbox" className="w-4 h-4 object-contain" />
                      <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase font-mono">Xbox Ecosystem</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">[{xboxProducts.length} models]</span>
                  </div>
                </a>
              </div>
            </div>

            {/* SECTION 1: STRICTLY NINTENDO CONSOLES */}
            <div id="section-nintendo" className="space-y-6 pt-4 scroll-mt-24">
              <div className="flex items-center justify-between border-b-2 border-red-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-7 bg-red-600 rounded-none border border-black shadow-[2px_2px_0px_0px_#000000]" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5 uppercase font-sans">
                      <img src={nintendoIcon} alt="Nintendo" className="h-5 w-auto object-contain" />
                      <span>Nintendo Vault</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">// STRICTLY NINTENDO SWITCH, 3DS, DS & GBA ({filteredNintendo.length} SYSTEMS)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('nintendo')}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 hover:text-white flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 px-3.5 py-1.5 rounded-none border-2 border-red-500/50 shadow-[3px_3px_0px_0px_#FF1E2D] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pagedNintendo.map((product) => (
                  <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Nintendo Section Number Pagination */}
              <NumberPagination
                currentPage={currentNintendoSectionPage}
                totalPages={totalNintendoPages}
                totalItems={filteredNintendo.length}
                pageSize={GRID_PAGE_SIZE}
                onPageChange={(p) => setNintendoSectionPage(p)}
                accentColor="red"
                itemLabel="Nintendo consoles"
              />
            </div>

            {/* SECTION 2: STRICTLY SONY PLAYSTATION CONSOLES */}
            <div id="section-playstation" className="space-y-6 pt-6 scroll-mt-24">
              <div className="flex items-center justify-between border-b-2 border-blue-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-7 bg-blue-600 rounded-none border border-black shadow-[2px_2px_0px_0px_#000000]" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5 uppercase font-sans">
                      <img src={playstationIcon} alt="PlayStation" className="w-5 h-5 object-contain" />
                      <span>Sony PlayStation Hub</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">// STRICTLY PS5, PS4 & PS3 CONSOLE SYSTEMS ({filteredSony.length} SYSTEMS)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('sony')}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 hover:text-white flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900 px-3.5 py-1.5 rounded-none border-2 border-blue-500/50 shadow-[3px_3px_0px_0px_#2563EB] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pagedSony.map((product) => (
                  <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Sony PlayStation Section Number Pagination */}
              <NumberPagination
                currentPage={currentSonySectionPage}
                totalPages={totalSonyPages}
                totalItems={filteredSony.length}
                pageSize={GRID_PAGE_SIZE}
                onPageChange={(p) => setSonySectionPage(p)}
                accentColor="blue"
                itemLabel="PlayStation consoles"
              />
            </div>

            {/* SECTION 3: STRICTLY MICROSOFT XBOX CONSOLES */}
            <div id="section-xbox" className="space-y-6 pt-6 scroll-mt-24">
              <div className="flex items-center justify-between border-b-2 border-emerald-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-7 bg-emerald-600 rounded-none border border-black shadow-[2px_2px_0px_0px_#000000]" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5 uppercase font-sans">
                      <img src={xboxIcon} alt="Xbox" className="w-5 h-5 object-contain" />
                      <span>Microsoft Xbox Ecosystem</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">// STRICTLY XBOX SERIES X|S, ONE & 360 ({filteredXbox.length} SYSTEMS)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('xbox')}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 hover:text-white flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 px-3.5 py-1.5 rounded-none border-2 border-emerald-500/50 shadow-[3px_3px_0px_0px_#059669] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pagedXbox.map((product) => (
                  <div key={product.id} onClick={() => handleOpenSpecModal(product)} className="cursor-pointer">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Xbox Section Number Pagination */}
              <NumberPagination
                currentPage={currentXboxSectionPage}
                totalPages={totalXboxPages}
                totalItems={filteredXbox.length}
                pageSize={GRID_PAGE_SIZE}
                onPageChange={(p) => setXboxSectionPage(p)}
                accentColor="emerald"
                itemLabel="Xbox consoles"
              />
            </div>
          </div>
        )}
      </div>

      {/* Detailed Spec Modal */}
      <ConsoleSpecsModal
        product={selectedProduct}
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />

      {/* Architecture Evolution Modal */}
      <AnimatePresence>
        {isArchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#0E0C13] border-2 sm:border-[3px] border-neutral-700 rounded-none shadow-[10px_10px_0px_0px_#FF1E2D] overflow-hidden flex flex-col text-neutral-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-neutral-800 bg-neutral-950">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#FF1E2D]" />
                  <h2 className="text-base sm:text-lg font-black text-white uppercase font-sans tracking-wide">
                    Console Silicon Architecture Evolution
                  </h2>
                </div>
                <button
                  onClick={() => setIsArchModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border-2 border-neutral-700 hover:border-[#FF1E2D] rounded-none transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <p className="text-xs font-mono text-neutral-400 leading-relaxed uppercase tracking-wider">
                  // EXTRACTED DIRECTLY FROM THE OFFICIAL CARTVERSE SILICON ARCHIVE // CHIP TELEMETRY
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ARCHITECTURE_EVOLUTION_GUIDES.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-950 p-4 rounded-none border-2 border-neutral-800 shadow-[4px_4px_0px_0px_#000000] hover:border-red-500/80 hover:shadow-[4px_4px_0px_0px_#FF1E2D] transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#FF1E2D] uppercase">{item.era}</span>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-none border border-neutral-700 bg-neutral-900 text-neutral-300">
                          {item.brand}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase font-sans group-hover:text-red-400 transition-colors">{item.silicon}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">{item.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsolePage;
