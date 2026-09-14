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
        'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-md shadow-xl select-none',
        className
      )}
    >
      {/* Items count summary */}
      <div className="text-xs text-neutral-400 font-medium flex items-center gap-2">
        <span
          className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            accentColor === 'blue'
              ? 'bg-blue-500'
              : accentColor === 'emerald'
              ? 'bg-emerald-500'
              : 'bg-red-500'
          )}
        />
        <span>
          Showing <strong className="text-white font-sans">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-white font-sans">{totalItems}</strong> {itemLabel}
        </span>
      </div>

      {/* Numbered Page Buttons & Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border cursor-pointer',
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed text-neutral-500 border-neutral-800/50 bg-neutral-950/50'
              : 'text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={cn(
              'min-w-[34px] h-[34px] px-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer',
              getAccentClass(pageNum === currentPage)
            )}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border cursor-pointer',
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed text-neutral-500 border-neutral-800/50 bg-neutral-950/50'
              : 'text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page X of Y Badge */}
      <div className="text-xs font-sans text-neutral-500 hidden md:block">
        Page <span className="text-neutral-300 font-bold">{currentPage}</span> / {totalPages}
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
            className="min-h-[22rem] sm:min-h-[25rem] py-8 px-6 sm:px-10 rounded-3xl bg-black border border-red-900/40 shadow-2xl shadow-red-950/40"
          >
            <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Column: Badge, Title, Subtitle */}
              <div className="flex-1 text-center lg:text-left space-y-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-red-500/30 bg-red-500/10 text-red-400">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>
                    {activeBrand === 'nintendo'
                      ? `Nintendo Hardware Vault (${nintendoProducts.length} Systems)`
                      : activeBrand === 'sony'
                      ? `PlayStation Hardware Hub (${sonyProducts.length} Systems)`
                      : activeBrand === 'xbox'
                      ? `Xbox Hardware Ecosystem (${xboxProducts.length} Systems)`
                      : `Consoles & Gaming Ecosystem (${allConsoleProducts.length} Systems)`}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                  {activeBrand === 'nintendo'
                    ? 'Nintendo Hardware Vault'
                    : activeBrand === 'sony'
                    ? 'PlayStation Hardware Hub'
                    : activeBrand === 'xbox'
                    ? 'Xbox Hardware Ecosystem'
                    : 'Gaming Consoles & Hardware'}
                </h1>

                <p className="max-w-2xl text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  {activeBrand === 'nintendo'
                    ? 'Explore authentic Nintendo Switch OLED, Switch 2, 3DS/2DS XL, DS Lite, and Game Boy Advance.'
                    : activeBrand === 'sony'
                    ? 'Explore PlayStation 5 Pro (2TB), PS5 Slim Disc & Digital, PS4 Pro 4K, and PS3 Classics.'
                    : activeBrand === 'xbox'
                    ? 'Explore Xbox Series X, Series S Carbon, Xbox One X, and 360 Classics with Velocity Architecture.'
                    : 'Explore genuine Nintendo, Sony PlayStation, and Microsoft Xbox consoles with generation guides and full technical specifications.'}
                </p>
              </div>

              {/* Right Column: Hero Visual (Console.gif for All, Brand Logos for Nintendo / PlayStation / Xbox) */}
              <div className="shrink-0 relative group/hero">
                <div className="relative w-64 sm:w-72 md:w-80 aspect-video rounded-2xl overflow-hidden border border-neutral-800 group-hover/hero:border-[#FF1E2D]/80 bg-[#120F17]/95 shadow-[0_0_35px_rgba(255,30,45,0.25)] transition-all duration-300 flex items-center justify-center p-6">
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
        <div className="flex flex-col md:flex-row items-center justify-between bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-2xl backdrop-blur-md shadow-2xl gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
            <button
              onClick={() => handleBrandChange('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
                activeBrand === 'all'
                  ? 'bg-neutral-800 text-white border border-neutral-700 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-red-500" />
              <span>All Consoles ({allConsoleProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('nintendo')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2.5 shrink-0 ${
                activeBrand === 'nintendo'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-950/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <img
                src={nintendoIcon}
                alt="Nintendo"
                className="h-3.5 w-auto object-contain transition-all"
              />
              <span>Nintendo ({nintendoProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('sony')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2.5 shrink-0 ${
                activeBrand === 'sony'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <img
                src={playstationIcon}
                alt="PlayStation"
                className="w-4 h-4 object-contain transition-all"
              />
              <span>PlayStation ({sonyProducts.length})</span>
            </button>

            <button
              onClick={() => handleBrandChange('xbox')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2.5 shrink-0 ${
                activeBrand === 'xbox'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <img
                src={xboxIcon}
                alt="Xbox"
                className={`w-4 h-4 object-contain transition-all ${
                  activeBrand === 'xbox' ? 'brightness-0 invert' : ''
                }`}
              />
              <span>Xbox ({xboxProducts.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsArchModalOpen(true)}
              className="px-4 py-2 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 justify-center cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>Architecture Guide</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED NINTENDO VAULT SUB-PAGE                                */}
        {/* ========================================================================= */}
        {activeBrand === 'nintendo' && (
          <div className="space-y-8 pointer-events-auto">
            {/* Nintendo Banner */}
            <div className="relative bg-gradient-to-br from-red-950/40 via-neutral-900/90 to-neutral-950 p-8 rounded-3xl border border-red-900/40 shadow-2xl overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
                    <span>Exclusive Brand Vault</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Nintendo Hardware Vault
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Explore genuine Nintendo systems including Switch OLED, Switch 2, Nintendo 3DS/2DS XL, Nintendo DS Lite, and Game Boy Advance.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-2xl overflow-hidden border border-red-800/50 bg-[#120F17]/90 shadow-[0_0_30px_rgba(255,30,45,0.25)] flex items-center justify-center p-6 relative group">
                  <img
                    src={nintendoIcon}
                    alt="Nintendo Logo"
                    className="max-h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,30,45,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Nintendo Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">Generation:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'all' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                All Nintendo ({nintendoProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('switch')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'switch' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                Switch & OLED Models
              </button>
              <button
                onClick={() => setGenFilter('ds-3ds')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'ds-3ds' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                Dual-Screen (DS & 3DS / 2DS)
              </button>
              <button
                onClick={() => setGenFilter('gba')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'gba' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
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
            <div className="relative bg-gradient-to-br from-blue-950/40 via-neutral-900/90 to-neutral-950 p-8 rounded-3xl border border-blue-900/40 shadow-2xl overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                    <span>Exclusive Brand Vault</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    PlayStation Hardware Hub
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Explore PlayStation 5 Pro (2TB), PS5 Slim Disc & Digital, PS4 Pro 4K, PS4 Slim Special Editions, and PS3 Classics.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-2xl overflow-hidden border border-blue-800/50 bg-[#120F17]/90 shadow-[0_0_30px_rgba(59,130,246,0.25)] flex items-center justify-center p-6 relative group">
                  <img
                    src={playstationIcon}
                    alt="PlayStation Logo"
                    className="max-h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* PlayStation Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">Generation:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'all' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                All PlayStation ({sonyProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('ps5')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'ps5' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                PS5 Generation (Base / Slim / Pro)
              </button>
              <button
                onClick={() => setGenFilter('ps4')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'ps4' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                PS4 Generation (Slim & Pro 4K)
              </button>
              <button
                onClick={() => setGenFilter('ps3')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'ps3' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
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
            <div className="relative bg-gradient-to-br from-emerald-950/40 via-neutral-900/90 to-neutral-950 p-8 rounded-3xl border border-emerald-900/40 shadow-2xl overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                    <span>Exclusive Brand Vault</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Microsoft Xbox Ecosystem
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Explore Xbox Series X 1TB, Xbox Series S Carbon Black, Xbox One X Native 4K, Xbox One S, and Xbox 360 Slim systems.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-64 md:w-72 aspect-video rounded-2xl overflow-hidden border border-emerald-800/50 bg-[#120F17]/90 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center p-6 relative group">
                  <img
                    src={xboxIcon}
                    alt="Xbox Logo"
                    className="max-h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Xbox Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider pr-2">Generation:</span>
              <button
                onClick={() => setGenFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                All Xbox ({xboxProducts.length})
              </button>
              <button
                onClick={() => setGenFilter('series')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'series' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                Xbox Series X | S
              </button>
              <button
                onClick={() => setGenFilter('one')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === 'one' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                Xbox One Series (One, One S, One X)
              </button>
              <button
                onClick={() => setGenFilter('360')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  genFilter === '360' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
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
            <div className="relative bg-gradient-to-br from-neutral-900/90 via-neutral-900/50 to-neutral-950 p-8 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Gaming Consoles & Retro Hardware
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Browse our separated brand collections below: Nintendo portable & hybrid systems, Sony PlayStation home powerhouses, and Microsoft Xbox consoles.
                  </p>
                </div>
              </div>

              {/* Brand Animated Showcase Cards featuring nintendo.gif, Playstation.gif, Xbox.gif */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-neutral-800/80">
                {/* Nintendo Card */}
                <a
                  href="#section-nintendo"
                  className="relative overflow-hidden rounded-2xl border border-neutral-800 hover:border-red-500/60 bg-neutral-950/80 p-5 transition-all duration-300 group hover:shadow-[0_10px_30px_-10px_rgba(255,30,45,0.3)] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 border border-neutral-800/80">
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
                      <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Nintendo Vault</span>
                    </div>
                    <span className="text-xs font-sans text-neutral-400">{nintendoProducts.length} models</span>
                  </div>
                </a>

                {/* PlayStation Card */}
                <a
                  href="#section-playstation"
                  className="relative overflow-hidden rounded-2xl border border-neutral-800 hover:border-blue-500/60 bg-neutral-950/80 p-5 transition-all duration-300 group hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 border border-neutral-800/80">
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
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">PlayStation Hub</span>
                    </div>
                    <span className="text-xs font-sans text-neutral-400">{sonyProducts.length} models</span>
                  </div>
                </a>

                {/* Xbox Card */}
                <a
                  href="#section-xbox"
                  className="relative overflow-hidden rounded-2xl border border-neutral-800 hover:border-emerald-500/60 bg-neutral-950/80 p-5 transition-all duration-300 group hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 border border-neutral-800/80">
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
                      <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Xbox Ecosystem</span>
                    </div>
                    <span className="text-xs font-sans text-neutral-400">{xboxProducts.length} models</span>
                  </div>
                </a>
              </div>
            </div>

            {/* SECTION 1: STRICTLY NINTENDO CONSOLES */}
            <div id="section-nintendo" className="space-y-6 pt-4 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-7 bg-red-600 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                      <img src={nintendoIcon} alt="Nintendo" className="h-5 w-auto object-contain" />
                      <span>Nintendo Vault</span>
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly Nintendo Switch, 3DS, DS & Game Boy systems ({filteredNintendo.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('nintendo')}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 rounded-xl border border-red-500/20 transition-all cursor-pointer"
                >
                  <span>Open Nintendo Section</span>
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
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-7 bg-blue-600 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                      <img src={playstationIcon} alt="PlayStation" className="w-5 h-5 object-contain" />
                      <span>Sony PlayStation Hub</span>
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly PS5, PS4 & PS3 console systems and bundles ({filteredSony.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('sony')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 rounded-xl border border-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Open PlayStation Section</span>
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
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-7 bg-emerald-600 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                      <img src={xboxIcon} alt="Xbox" className="w-5 h-5 object-contain" />
                      <span>Microsoft Xbox Ecosystem</span>
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly Xbox Series X|S, Xbox One & Xbox 360 systems ({filteredXbox.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('xbox')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 transition-all cursor-pointer"
                >
                  <span>Open Xbox Section</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#0E0E12] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white">Console Hardware Architecture Evolution</h2>
                </div>
                <button
                  onClick={() => setIsArchModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white bg-neutral-800/50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Extracted directly from the official CartVerse Console Silicon Database, detailing the architectural breakthroughs across Nintendo, PlayStation, and Xbox generations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ARCHITECTURE_EVOLUTION_GUIDES.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-400">{item.era}</span>
                        <span className="text-[10px] uppercase font-sans px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {item.brand}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{item.silicon}</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">{item.impact}</p>
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
