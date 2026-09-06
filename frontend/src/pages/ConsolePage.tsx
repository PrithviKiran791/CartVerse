import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Sparkles,
  BookOpen,
  X,
  CheckCircle,
  ShieldCheck,
  Tv,
  Cpu,
  Layers,
  HardDrive,
  Disc,
  ArrowRight,
  Eye,
  ShoppingBag,
  Move,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { Product } from '../types/hardware';
import { ProductCard } from '../components/catalog/ProductCard';
import { ConsoleSpecsModal } from '../components/catalog/ConsoleSpecsModal';
import { motion, AnimatePresence } from 'framer-motion';
import ShapeGrid from '../components/common/ShapeGrid';
import { getComponentImage } from '../utils/assetRegistry';
import { DraggableCardBody, DraggableCardContainer } from '../components/ui/draggable-card';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { cn } from '../lib/utils';
import { Boxes, BackgroundBoxesDemo } from '../components/ui/background-boxes';

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
          Showing <strong className="text-white font-mono">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-white font-mono">{totalItems}</strong> {itemLabel}
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
      <div className="text-xs font-mono text-neutral-500 hidden md:block">
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'draggable' | 'grid'>('draggable');

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

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesArch = p.specs?.consoleSpecs?.cpuGpuArch?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesArch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  };

  const filteredNintendo = useMemo(() => filterList(nintendoProducts, 'nintendo'), [nintendoProducts, activeBrand, genFilter, searchQuery, sortBy]);
  const filteredSony = useMemo(() => filterList(sonyProducts, 'sony'), [sonyProducts, activeBrand, genFilter, searchQuery, sortBy]);
  const filteredXbox = useMemo(() => filterList(xboxProducts, 'xbox'), [xboxProducts, activeBrand, genFilter, searchQuery, sortBy]);

  const { addItem, openCart } = useCartStore();

  const CARD_POSITIONS = [
    'top-10 left-3 sm:left-6 md:left-[4%] lg:left-[5%] rotate-[-3deg]',
    'top-[560px] md:top-10 left-3 sm:left-6 md:left-[36%] lg:left-[37%] rotate-[2deg]',
    'top-[1120px] md:top-10 left-3 sm:left-6 md:left-auto md:right-[4%] lg:right-[5%] rotate-[-2deg]',
    'top-[1680px] md:top-[530px] left-3 sm:left-6 md:left-[5%] lg:left-[6%] rotate-[3deg]',
    'top-[2240px] md:top-[530px] left-3 sm:left-6 md:left-[37%] lg:left-[38%] rotate-[-4deg]',
    'top-[2800px] md:top-[530px] left-3 sm:left-6 md:left-auto md:right-[5%] lg:right-[6%] rotate-[3deg]',
    'top-[3360px] md:top-[1040px] left-3 sm:left-6 md:left-[4%] lg:left-[5%] rotate-[-2deg]',
    'top-[3920px] md:top-[1040px] left-3 sm:left-6 md:left-[36%] lg:left-[37%] rotate-[4deg]',
    'top-[4480px] md:top-[1040px] left-3 sm:left-6 md:left-auto md:right-[4%] lg:right-[5%] rotate-[-3deg]',
  ];

  // Pagination Constants
  const DRAGGABLE_PAGE_SIZE = 9;
  const GRID_PAGE_SIZE = 8;

  // Pagination States for all views and distinct sections
  const [draggablePage, setDraggablePage] = useState<number>(1);
  const [brandGridPage, setBrandGridPage] = useState<number>(1);
  const [nintendoSectionPage, setNintendoSectionPage] = useState<number>(1);
  const [sonySectionPage, setSonySectionPage] = useState<number>(1);
  const [xboxSectionPage, setXboxSectionPage] = useState<number>(1);

  // Black & Red interactive palette for Aceternity Background Boxes
  const blackAndRedBoxColors = useMemo(() => {
    return [
      '#E31B23', // CartVerse Crimson Red
      '#FF2A35', // Bright Red
      '#DC2626', // Deep Red
      '#990000', // Dark Burgundy
      '#7F1D1D', // Dark Red
      '#B91C1C', // Brick Red
      '#EF4444', // Neon Coral Red
      '#FF4D4D', // Light Scarlet
    ];
  }, []);

  // Reset all page counters when filters or search change
  useEffect(() => {
    setDraggablePage(1);
    setBrandGridPage(1);
    setNintendoSectionPage(1);
    setSonySectionPage(1);
    setXboxSectionPage(1);
  }, [activeBrand, genFilter, searchQuery, sortBy]);

  // Full list for Draggable View across all pages
  const draggableFullList = useMemo(() => {
    if (activeBrand === 'nintendo') {
      return filteredNintendo;
    }
    if (activeBrand === 'sony') {
      return filteredSony;
    }
    if (activeBrand === 'xbox') {
      return filteredXbox;
    }

    // 'all' tab: interleave Nintendo, Sony, Xbox consoles so every page is a balanced mix
    const mix: Product[] = [];
    const n = [...filteredNintendo];
    const s = [...filteredSony];
    const x = [...filteredXbox];
    const maxLen = Math.max(n.length, s.length, x.length);
    for (let i = 0; i < maxLen; i++) {
      if (n[i]) mix.push(n[i]);
      if (s[i]) mix.push(s[i]);
      if (x[i]) mix.push(x[i]);
    }
    return mix;
  }, [activeBrand, filteredNintendo, filteredSony, filteredXbox]);

  const totalDraggablePages = Math.max(1, Math.ceil(draggableFullList.length / DRAGGABLE_PAGE_SIZE));
  const currentDraggablePage = Math.min(draggablePage, totalDraggablePages);

  const draggableConsoleProducts = useMemo(() => {
    const startIndex = (currentDraggablePage - 1) * DRAGGABLE_PAGE_SIZE;
    return draggableFullList.slice(startIndex, startIndex + DRAGGABLE_PAGE_SIZE);
  }, [draggableFullList, currentDraggablePage]);

  const handleDraggablePageChange = (newPage: number) => {
    setDraggablePage(newPage);
    const canvas = document.getElementById('draggable-canvas-container');
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const draggableCanvasHeight = useMemo(() => {
    const count = draggableConsoleProducts.length;
    if (count === 0) return 'min-h-[400px]';
    if (count <= 3) return 'min-h-[1750px] md:min-h-[640px]';
    if (count <= 6) return 'min-h-[3400px] md:min-h-[1140px]';
    return 'min-h-[5100px] md:min-h-[1620px]';
  }, [draggableConsoleProducts.length]);

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
      {/* Aceternity Background Boxes - Full Page Background Animation in Black & Red */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-auto z-0 select-none">
        {/* Pure Black Radial Mask Vignette to keep content clear */}
        <div className="absolute inset-0 w-full h-full bg-black/75 z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)] pointer-events-none" />
        <Boxes
          colors={blackAndRedBoxColors}
          className="opacity-70"
        />
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/[0.08] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-red-800/[0.06] rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 z-10 w-full space-y-8 relative pointer-events-none">
        {/* Aceternity Background Boxes Hero Showcase */}
        <div className="relative group pointer-events-auto">
          <BackgroundBoxesDemo
            colors={blackAndRedBoxColors}
            containerBg="bg-black"
            className="h-80 sm:h-96 rounded-3xl bg-black border border-red-900/40 shadow-2xl shadow-red-950/40"
            badge={
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-red-500/30 bg-red-500/10 text-red-400">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>
                  {activeBrand === 'nintendo'
                    ? `Nintendo Hardware Vault (${nintendoProducts.length} Systems)`
                    : activeBrand === 'sony'
                    ? `PlayStation Hardware Hub (${sonyProducts.length} Systems)`
                    : activeBrand === 'xbox'
                    ? `Xbox Hardware Ecosystem (${xboxProducts.length} Systems)`
                    : `Verified Console Catalog (${allConsoleProducts.length} Systems)`}
                </span>
              </div>
            }
            title={
              <h1 className={cn('text-2xl sm:text-4xl md:text-5xl font-black text-white relative z-20 tracking-tight uppercase px-4')}>
                {activeBrand === 'nintendo'
                  ? 'Nintendo Hardware Vault'
                  : activeBrand === 'sony'
                  ? 'PlayStation Hardware Hub'
                  : activeBrand === 'xbox'
                  ? 'Xbox Hardware Ecosystem'
                  : 'Gaming Consoles & Hardware'}
              </h1>
            }
            subtitle={
              <span className="max-w-2xl block text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed px-4">
                {activeBrand === 'nintendo'
                  ? 'Explore authentic Nintendo Switch OLED, Switch 2, 3DS/2DS XL, DS Lite, and Game Boy Advance with interactive 3D physics cards.'
                  : activeBrand === 'sony'
                  ? 'Explore PlayStation 5 Pro (2TB), PS5 Slim Disc & Digital, PS4 Pro 4K, and PS3 Classics with interactive 3D physics cards.'
                  : activeBrand === 'xbox'
                  ? 'Explore Xbox Series X, Series S Carbon, Xbox One X, and 360 Classics with Velocity Architecture and interactive 3D cards.'
                  : 'Explore genuine Nintendo, Sony PlayStation, and Microsoft Xbox consoles with interactive 3D physics cards, generation guides, and full specs.'}
              </span>
            }
          />
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
              <span className="w-2 h-2 rounded-full bg-red-500" />
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
              <span className="w-2 h-2 rounded-full bg-blue-500" />
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
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Xbox ({xboxProducts.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center bg-neutral-950/80 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setViewMode('draggable')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'draggable'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🎴 Draggable Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>⊞ Grid View</span>
              </button>
            </div>

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

        {/* Global Search & Sort Bar */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between backdrop-blur-md pointer-events-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search console models & specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 focus:outline-none focus:border-red-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="featured">Featured Consoles</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {viewMode === 'draggable' ? (
          <div className="space-y-6 pointer-events-auto">
            {/* Draggable View Header & Information Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800/80 px-5 py-3.5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center border shrink-0',
                    activeBrand === 'nintendo'
                      ? 'bg-red-500/20 border-red-500/30 text-red-400'
                      : activeBrand === 'sony'
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : activeBrand === 'xbox'
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                  )}
                >
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>
                      {activeBrand === 'all'
                        ? 'Interactive Console Showroom'
                        : activeBrand === 'nintendo'
                        ? 'Nintendo Vault Desk'
                        : activeBrand === 'sony'
                        ? 'PlayStation Vault Desk'
                        : 'Xbox Vault Desk'}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono border border-neutral-700">
                      Page {currentDraggablePage} of {totalDraggablePages} ({draggableFullList.length} Total)
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Grab, drag, and fling console cards freely. Hover for 3D dynamic glare, inspect hardware specs, or add directly to cart.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className="text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Switch to Grid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Draggable Physics Canvas Container */}
            <div
              id="draggable-canvas-container"
              className={cn(
                'w-full relative rounded-3xl border border-neutral-800/80 bg-neutral-950/70 overflow-hidden shadow-2xl transition-all duration-300',
                draggableCanvasHeight
              )}
            >
              {/* Floating Instruction Pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-4 py-1.5 rounded-full text-xs text-neutral-300 shadow-xl">
                <Move className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span>Drag cards freely anywhere on the desk</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400 font-mono">
                  Page {currentDraggablePage}/{totalDraggablePages}
                </span>
              </div>

              {/* Watermark Branding in Background */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-10 text-center px-4">
                <Gamepad2 className="w-32 h-32 text-white mb-3" />
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-widest text-neutral-400">
                  {activeBrand === 'all'
                    ? 'Console Vault'
                    : activeBrand === 'nintendo'
                    ? 'Nintendo'
                    : activeBrand === 'sony'
                    ? 'PlayStation'
                    : 'Xbox'}
                </h2>
                <p className="text-sm md:text-base font-mono text-neutral-500 mt-2">
                  Interactive Physics Playground • Hover for 3D Glare • Toss to Fling
                </p>
              </div>

              {draggableConsoleProducts.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <Gamepad2 className="w-12 h-12 text-neutral-600 mb-3" />
                  <p className="text-neutral-300 font-medium">No consoles found matching your criteria</p>
                  <p className="text-xs text-neutral-500 mt-1">Try resetting your search query or brand selection</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setGenFilter('all');
                    }}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <DraggableCardContainer className={cn('relative w-full h-full overflow-visible', draggableCanvasHeight)}>
                  {draggableConsoleProducts.map((product, idx) => {
                    const cardPos = CARD_POSITIONS[idx % CARD_POSITIONS.length];
                    const isNintendo =
                      product.brand.toLowerCase().includes('nintendo') ||
                      product.imageSlug.startsWith('Console/Nintendo/');
                    const isSony =
                      product.brand.toLowerCase().includes('sony') ||
                      product.brand.toLowerCase().includes('playstation') ||
                      product.imageSlug.startsWith('Console/Sony/');

                    const badgeColor = isNintendo
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : isSony
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

                    const imgUrl = getComponentImage(product.imageSlug, product.category);

                    return (
                      <DraggableCardBody
                        key={product.id}
                        className={cn(
                          'absolute w-[310px] sm:w-[340px] p-5 rounded-2xl bg-neutral-900/95 border border-neutral-800 shadow-2xl backdrop-blur-md transition-shadow hover:border-neutral-700 hover:shadow-red-950/20 cursor-grab active:cursor-grabbing',
                          cardPos
                        )}
                      >
                        {/* Brand Badge & Price */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border',
                              badgeColor
                            )}
                          >
                            {product.brand}
                          </span>
                          <span className="font-mono text-sm font-black text-white">
                            {formatCurrency(product.price)}
                          </span>
                        </div>

                        {/* Console Hardware Image */}
                        <div className="relative w-full h-44 rounded-xl bg-neutral-950/90 border border-neutral-800/80 flex items-center justify-center p-3 overflow-hidden shadow-inner group">
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-[0_8px_18px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform duration-300"
                            draggable={false}
                          />
                          {product.specs?.consoleSpecs?.generation && (
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-neutral-900/90 text-neutral-400 text-[10px] font-mono border border-neutral-800">
                              {product.specs.consoleSpecs.generation}
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3
                          className="mt-3.5 text-base font-bold text-white line-clamp-1 hover:text-red-400 transition-colors"
                          title={product.name}
                        >
                          {product.name}
                        </h3>

                        {/* Console Description */}
                        <p className="mt-1.5 text-xs text-neutral-400 line-clamp-3 leading-relaxed min-h-[52px]">
                          {product.description}
                        </p>

                        {/* Quick Specs / Storage */}
                        <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                          <span className="truncate max-w-[140px]">
                            {product.specs?.consoleSpecs?.storage || 'Hardware Console'}
                          </span>
                          <span className="text-neutral-600">•</span>
                          <span className="truncate max-w-[130px]">
                            {product.specs?.consoleSpecs?.resolution || 'Authentic Vault'}
                          </span>
                        </div>

                        {/* Interactive Actions */}
                        <div className="mt-3.5 pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSpecModal(product);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-700/60"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Specs</span>
                          </button>
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem(product, 1);
                              openCart();
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </DraggableCardBody>
                    );
                  })}
                </DraggableCardContainer>
              )}
            </div>

            {/* Number Page Navigation for Draggable Showroom */}
            <NumberPagination
              currentPage={currentDraggablePage}
              totalPages={totalDraggablePages}
              totalItems={draggableFullList.length}
              pageSize={DRAGGABLE_PAGE_SIZE}
              onPageChange={handleDraggablePageChange}
              accentColor={
                activeBrand === 'nintendo'
                  ? 'red'
                  : activeBrand === 'sony'
                  ? 'blue'
                  : activeBrand === 'xbox'
                  ? 'emerald'
                  : 'red'
              }
              itemLabel="consoles on table"
            />
          </div>
        ) : (
          <>
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

                <div className="bg-red-950/40 border border-red-800/40 p-5 rounded-2xl flex items-center justify-center shrink-0">
                  <img src={nintendoLogoImg} alt="Nintendo Logo" className="h-16 max-w-xs object-contain" />
                </div>
              </div>
            </div>

            {/* Nintendo Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pr-2">Generation:</span>
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

                <div className="bg-blue-950/40 border border-blue-800/40 p-5 rounded-2xl flex items-center justify-center shrink-0">
                  <img src={sonyLogoImg} alt="PlayStation Logo" className="h-16 max-w-xs object-contain" />
                </div>
              </div>
            </div>

            {/* PlayStation Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pr-2">Generation:</span>
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

                <div className="bg-emerald-950/40 border border-emerald-800/40 p-5 rounded-2xl flex items-center justify-center shrink-0">
                  <img src={xboxLogoImg} alt="Xbox Logo" className="h-16 max-w-xs object-contain" />
                </div>
              </div>
            </div>

            {/* Xbox Generation Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pr-2">Generation:</span>
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
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Verified Console Catalog ({allConsoleProducts.length} Systems)</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  Gaming Consoles & Retro Hardware
                </h1>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Browse our separated brand collections below: Nintendo portable & hybrid systems, Sony PlayStation home powerhouses, and Microsoft Xbox consoles.
                </p>
              </div>

              {/* Quick Jump Brand Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-neutral-800/80">
                <a
                  href="#section-nintendo"
                  className="bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 p-3.5 rounded-2xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs font-bold text-white">Nintendo Section</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{nintendoProducts.length} models</span>
                </a>

                <a
                  href="#section-playstation"
                  className="bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 hover:border-blue-500/50 p-3.5 rounded-2xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-white">PlayStation Section</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{sonyProducts.length} models</span>
                </a>

                <a
                  href="#section-xbox"
                  className="bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 p-3.5 rounded-2xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-white">Xbox Section</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{xboxProducts.length} models</span>
                </a>
              </div>
            </div>

            {/* SECTION 1: STRICTLY NINTENDO CONSOLES */}
            <div id="section-nintendo" className="space-y-6 pt-4 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-7 bg-red-600 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      Nintendo Vault
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly Nintendo Switch, 3DS, DS & Game Boy systems ({filteredNintendo.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('nintendo')}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 rounded-xl border border-red-500/20 transition-all"
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
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      Sony PlayStation Hub
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly PS5, PS4 & PS3 console systems and bundles ({filteredSony.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('sony')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 rounded-xl border border-blue-500/20 transition-all"
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
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      Microsoft Xbox Ecosystem
                    </h2>
                    <p className="text-xs text-neutral-400">Strictly Xbox Series X|S, Xbox One & Xbox 360 systems ({filteredXbox.length} consoles)</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBrandChange('xbox')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 transition-all"
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
          </>
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
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
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
