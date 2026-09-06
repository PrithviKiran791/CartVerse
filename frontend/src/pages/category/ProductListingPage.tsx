import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  X,
  Filter,
  Flame,
  ArrowLeft,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { Product } from '../../types/hardware';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import { ProductCard } from '../../components/catalog/ProductCard';
import { ProductCardSkeleton } from '../../components/catalog/ProductCardSkeleton';
import { ProductFilters } from '../../components/catalog/ProductFilters';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';

export const ProductListingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);

  // Read sort order from URL or fallback
  const sortBy = searchParams.get('sort') || 'recommended';

  // Simulate ultra-fast route transition loading skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 160);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Determine Category, Subcategory, Brands & Route Context
  const routeMeta = useMemo(() => {
    const path = location.pathname;

    // Processors
    if (path.includes('/processors-gpus/processors/amd')) {
      return {
        title: 'AMD PROCESSORS',
        subtitle: 'High-performance unlocked Ryzen processors for gaming and workstation builds.',
        category: 'cpu',
        brand: 'AMD',
        breadcrumbs: [
          { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
          { label: 'PROCESSORS' },
          { label: 'AMD' },
        ],
        backTo: { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
      };
    }
    if (path.includes('/processors-gpus/processors/intel')) {
      return {
        title: 'INTEL PROCESSORS',
        subtitle: 'Core Ultra Series 2 & 14th Gen Hybrid Architecture processors.',
        category: 'cpu',
        brand: 'Intel',
        breadcrumbs: [
          { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
          { label: 'PROCESSORS' },
          { label: 'INTEL' },
        ],
        backTo: { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
      };
    }

    // GPUs
    if (path.includes('/processors-gpus/gpu/nvidia')) {
      return {
        title: 'NVIDIA GRAPHICS CARDS',
        subtitle: 'GeForce RTX 40 & 30 Series graphics cards with DLSS 3.5 & Ray Tracing.',
        category: 'gpu',
        brand: 'NVIDIA',
        breadcrumbs: [
          { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
          { label: 'GRAPHICS CARDS' },
          { label: 'NVIDIA' },
        ],
        backTo: { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
      };
    }
    if (path.includes('/processors-gpus/gpu/radeon')) {
      return {
        title: 'AMD RADEON GRAPHICS CARDS',
        subtitle: 'Radeon RX 7000 & 6000 Series graphics cards powered by RDNA 3 chiplet silicon.',
        category: 'gpu',
        brand: 'AMD',
        breadcrumbs: [
          { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
          { label: 'GRAPHICS CARDS' },
          { label: 'AMD RADEON' },
        ],
        backTo: { label: 'PROCESSORS & GPUs', href: '/processors-gpus' },
      };
    }

    // Memory (Direct Category Listing per Section 26)
    if (path.startsWith('/memory')) {
      return {
        title: 'HIGH-SPEED MEMORY',
        subtitle: 'DDR4 & DDR5 performance memory kits for gaming and workstation builds.',
        category: 'ram',
        breadcrumbs: [
          { label: 'MEMORY' },
        ],
        backTo: { label: 'DASHBOARD', href: '/products' },
      };
    }

    // Thermal Systems
    if (path.includes('/thermal-systems/aio')) {
      return {
        title: 'AIO LIQUID COOLERS',
        subtitle: '240mm, 360mm & 420mm closed-loop radiators with programmable LCD pumps.',
        category: 'cooler',
        subType: 'aio',
        breadcrumbs: [
          { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
          { label: 'AIO LIQUID COOLING' },
        ],
        backTo: { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
      };
    }
    if (path.includes('/thermal-systems/air-coolers')) {
      return {
        title: 'AIR COOLERS',
        subtitle: 'Dual-tower nickel-plated heatpipes and whisper-quiet cooling fans.',
        category: 'cooler',
        subType: 'air',
        breadcrumbs: [
          { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
          { label: 'AIR COOLERS' },
        ],
        backTo: { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
      };
    }
    if (path.includes('/thermal-systems/case-fans')) {
      return {
        title: 'CASE FANS',
        subtitle: '120mm & 140mm modular daisy-chain magnetic ARGB chassis fans.',
        category: 'cooler',
        subType: 'fan',
        breadcrumbs: [
          { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
          { label: 'CASE FANS' },
        ],
        backTo: { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
      };
    }
    if (path.includes('/thermal-systems/thermal-paste')) {
      return {
        title: 'THERMAL PASTE',
        subtitle: 'High-conductivity non-conductive zinc-oxide and carbon micro-particle compounds.',
        category: 'cooler',
        subType: 'paste',
        breadcrumbs: [
          { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
          { label: 'THERMAL PASTE' },
        ],
        backTo: { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
      };
    }
    if (path.includes('/thermal-systems/custom-cooling')) {
      return {
        title: 'CUSTOM COOLANTS',
        subtitle: 'Premixed UV-reactive and clear anti-corrosion coolants for custom reservoirs.',
        category: 'coolant',
        breadcrumbs: [
          { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
          { label: 'CUSTOM COOLANTS' },
        ],
        backTo: { label: 'THERMAL SYSTEMS', href: '/thermal-systems' },
      };
    }

    // Cables & Headers
    if (path.includes('/cables-headers/psu')) {
      return {
        title: 'PSU MODULAR CABLES',
        subtitle: '16-pin 12V-2x6 & ATX 3.0 600W high-current individual modular cables.',
        category: 'cables',
        subType: 'psu',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'PSU CABLES' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }
    if (path.includes('/cables-headers/extensions')) {
      return {
        title: 'PSU SLEEVED EXTENSIONS',
        subtitle: 'Universal custom braided extension kits with pre-installed acrylic cable combs.',
        category: 'cables',
        subType: 'extensions',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'EXTENSIONS' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }
    if (path.includes('/cables-headers/display')) {
      return {
        title: 'DISPLAY CABLES',
        subtitle: 'Certified VESA DisplayPort 1.4/2.1 & Ultra High Speed HDMI 2.1a 48Gbps cables.',
        category: 'cables',
        subType: 'display',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'DISPLAY CABLES' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }
    if (path.includes('/cables-headers/usb')) {
      return {
        title: 'USB & TYPE-C CABLES',
        subtitle: 'USB4 40Gbps & 240W Power Delivery E-Marker fast-charging interconnects.',
        category: 'cables',
        subType: 'usb',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'USB & TYPE-C' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }
    if (path.includes('/cables-headers/internal')) {
      return {
        title: 'INTERNAL HEADERS & SPLITTERS',
        subtitle: '4-Pin PWM fan hubs, 5V 3-pin ARGB splitters & front-panel harnesses.',
        category: 'cables',
        subType: 'internal',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'INTERNAL HEADERS' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }
    if (path.includes('/cables-headers/sata')) {
      return {
        title: 'SATA DATA & POWER',
        subtitle: 'Locking latch SATA III 6Gbps shielded storage data cables and splitters.',
        category: 'cables',
        subType: 'sata',
        breadcrumbs: [
          { label: 'CABLES & HEADERS', href: '/cables-headers' },
          { label: 'SATA CABLES' },
        ],
        backTo: { label: 'CABLES & HEADERS', href: '/cables-headers' },
      };
    }

    // Displays (Direct Listing or filtered by subroute)
    if (path.includes('/displays/oled')) {
      return {
        title: 'OLED GAMING MONITORS',
        subtitle: 'Infinite contrast ratio, true 0.03ms pixel response & per-pixel lighting.',
        category: 'monitor',
        panelType: 'OLED',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: 'OLED' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/4k')) {
      return {
        title: '4K ULTRA HD MONITORS',
        subtitle: '3840 x 2160 pixel resolution for extreme fidelity and workstation clarity.',
        category: 'monitor',
        resolution: '4K',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: '4K UHD' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/1440p')) {
      return {
        title: '1440p QHD MONITORS',
        subtitle: '2560 x 1440 resolution sweet spot for high-framerate competitive gaming.',
        category: 'monitor',
        resolution: '1440p',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: '1440p QHD' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/1080p')) {
      return {
        title: '1080p ESPORTS MONITORS',
        subtitle: '1920 x 1080 Full HD engineered for 240Hz+ esports titles.',
        category: 'monitor',
        resolution: '1080p',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: '1080p FHD' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/ips')) {
      return {
        title: 'FAST-IPS GAMING MONITORS',
        subtitle: 'Wide 178° viewing angles and 99% sRGB color calibration for creators.',
        category: 'monitor',
        panelType: 'IPS',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: 'FAST-IPS' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/ultrawide')) {
      return {
        title: 'ULTRAWIDE MONITORS',
        subtitle: 'Curved panoramic 21:9 and 32:9 displays for immersion and expansive real estate.',
        category: 'monitor',
        subType: 'ultrawide',
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: 'ULTRAWIDE' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path.includes('/displays/high-refresh')) {
      return {
        title: '240Hz+ HIGH REFRESH MONITORS',
        subtitle: 'Fluid 240Hz, 360Hz & 500Hz refresh rate tournament-grade monitors.',
        category: 'monitor',
        minRefresh: 240,
        breadcrumbs: [
          { label: 'DISPLAYS', href: '/displays' },
          { label: '240Hz+' },
        ],
        backTo: { label: 'DISPLAYS', href: '/displays' },
      };
    }
    if (path === '/displays') {
      return {
        title: 'GAMING DISPLAYS & MONITORS',
        subtitle: 'Fast-IPS, OLED, 4K & Ultrawide esports monitors with sub-1ms response times.',
        category: 'monitor',
        breadcrumbs: [
          { label: 'DISPLAYS' },
        ],
        backTo: { label: 'DASHBOARD', href: '/products' },
      };
    }

    // Default
    return {
      title: 'HARDWARE PRODUCTS',
      subtitle: 'Browse all components with verified specifications.',
      category: 'all',
      breadcrumbs: [{ label: 'PRODUCTS' }],
      backTo: { label: 'DASHBOARD', href: '/products' },
    };
  }, [location.pathname]);

  // Read URL filter params
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 300000;
  const urlSockets = searchParams.getAll('socket');
  const urlCores = searchParams.getAll('cores').map(Number);
  const urlVram = searchParams.getAll('vram');
  const urlRamTypes = searchParams.getAll('ramType');
  const urlCapacities = searchParams.getAll('capacity');
  const urlResolutions = searchParams.getAll('resolution');
  const urlPanels = searchParams.getAll('panel');
  const inStockOnly = searchParams.get('inStock') === 'true';

  // Primary filtering query against mockProducts
  const filteredProducts = useMemo(() => {
    let result = mockProducts.filter((p) => {
      // Category match
      if (routeMeta.category !== 'all' && p.category !== routeMeta.category) {
        return false;
      }

      // Brand match (e.g. AMD vs Intel for CPU; NVIDIA vs AMD for GPU)
      if (routeMeta.brand) {
        const brandNorm = p.brand.toLowerCase();
        const targetBrand = routeMeta.brand.toLowerCase();
        if (targetBrand === 'amd') {
          if (!brandNorm.includes('amd') && !p.name.toLowerCase().includes('ryzen') && !p.name.toLowerCase().includes('radeon')) {
            return false;
          }
        } else if (targetBrand === 'intel') {
          if (!brandNorm.includes('intel') && !p.name.toLowerCase().includes('core')) {
            return false;
          }
        } else if (targetBrand === 'nvidia') {
          if (!brandNorm.includes('nvidia') && !brandNorm.includes('geforce') && !p.name.toLowerCase().includes('rtx')) {
            return false;
          }
        } else if (brandNorm !== targetBrand) {
          return false;
        }
      }

      // SubType filtering (for thermal, cables, displays)
      if (routeMeta.subType) {
        const nameLower = p.name.toLowerCase();
        const slugLower = p.imageSlug.toLowerCase();
        if (routeMeta.subType === 'air' && (nameLower.includes('liquid') || nameLower.includes('aio') || nameLower.includes('kraken') || nameLower.includes('icue'))) {
          return false;
        }
        if (routeMeta.subType === 'aio' && !nameLower.includes('aio') && !nameLower.includes('liquid') && !nameLower.includes('kraken') && !nameLower.includes('icue')) {
          return false;
        }
        if (routeMeta.subType === 'fan' && !nameLower.includes('fan') && !slugLower.includes('fan')) {
          return false;
        }
        if (routeMeta.subType === 'paste' && !nameLower.includes('paste') && !nameLower.includes('kryonaut') && !nameLower.includes('mx-4') && !nameLower.includes('thermal')) {
          return false;
        }
        if (routeMeta.subType === 'psu' && !nameLower.includes('psu') && !nameLower.includes('12v') && !slugLower.includes('psu')) {
          return false;
        }
        if (routeMeta.subType === 'display' && !nameLower.includes('displayport') && !nameLower.includes('hdmi') && !slugLower.includes('display')) {
          return false;
        }
        if (routeMeta.subType === 'usb' && !nameLower.includes('usb') && !nameLower.includes('type-c') && !slugLower.includes('type-c')) {
          return false;
        }
        if (routeMeta.subType === 'internal' && !nameLower.includes('internal') && !nameLower.includes('splitter') && !nameLower.includes('header') && !nameLower.includes('pwm')) {
          return false;
        }
        if (routeMeta.subType === 'sata' && !nameLower.includes('sata') && !slugLower.includes('sata')) {
          return false;
        }
        if (routeMeta.subType === 'ultrawide' && !nameLower.includes('ultrawide') && !nameLower.includes('g9') && !nameLower.includes('34"') && !nameLower.includes('49"')) {
          return false;
        }
      }

      // Display Resolution filtering
      if (routeMeta.resolution) {
        const nameLower = p.name.toLowerCase();
        const resLower = (p.specs?.resolution || '').toLowerCase();
        if (routeMeta.resolution === '4K' && !resLower.includes('4k') && !resLower.includes('3840') && !nameLower.includes('4k') && !nameLower.includes('uhd')) {
          return false;
        }
        if (routeMeta.resolution === '1440p' && !resLower.includes('1440') && !resLower.includes('qhd') && !resLower.includes('2k') && !nameLower.includes('1440') && !nameLower.includes('qhd')) {
          return false;
        }
        if (routeMeta.resolution === '1080p' && !resLower.includes('1080') && !resLower.includes('fhd') && !nameLower.includes('1080') && !nameLower.includes('fhd')) {
          return false;
        }
      }

      // Display Panel filtering
      if (routeMeta.panelType) {
        const panelLower = (p.specs?.panelType || '').toLowerCase();
        const nameLower = p.name.toLowerCase();
        if (routeMeta.panelType === 'OLED' && !panelLower.includes('oled') && !nameLower.includes('oled')) {
          return false;
        }
        if (routeMeta.panelType === 'IPS' && !panelLower.includes('ips') && !nameLower.includes('ips')) {
          return false;
        }
      }

      // Min Refresh
      if (routeMeta.minRefresh && (p.specs?.refreshRate || 60) < routeMeta.minRefresh) {
        return false;
      }

      // Live Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchSocket = (p.specs?.socket || '').toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc && !matchSocket) return false;
      }

      // Price Range Filter
      if (p.price < minPriceParam || p.price > maxPriceParam) {
        return false;
      }

      // Socket Filter (URL-based)
      if (urlSockets.length > 0) {
        const sock = p.specs?.socket;
        if (!sock || !urlSockets.includes(sock)) return false;
      }

      // Core Count Filter (URL-based)
      if (urlCores.length > 0) {
        const cores = p.specs?.cores || Number(p.specs?.intelSpecs?.totalCores) || Number(p.specs?.amdSpecs?.totalCores) || 0;
        if (!urlCores.includes(cores)) return false;
      }

      // VRAM Filter (URL-based)
      if (urlVram.length > 0) {
        const vram = p.specs?.vram || `${p.specs?.nvidiaSpecs?.memorySizeGb}GB` || `${p.specs?.amdRadeonSpecs?.memorySizeGb}GB`;
        if (!urlVram.includes(vram)) return false;
      }

      // RAM Type Filter (URL-based)
      if (urlRamTypes.length > 0) {
        const ramType = p.specs?.ramType || (p.name.includes('DDR5') ? 'DDR5' : 'DDR4');
        if (!urlRamTypes.includes(ramType)) return false;
      }

      // Capacity Filter (URL-based)
      if (urlCapacities.length > 0) {
        const cap = p.specs?.capacity || '32GB';
        if (!urlCapacities.includes(cap)) return false;
      }

      // Resolution Filter (URL-based)
      if (urlResolutions.length > 0) {
        const res = p.specs?.resolution || '';
        const match = urlResolutions.some((r) => res.includes(r) || p.name.includes(r));
        if (!match) return false;
      }

      // Panel Filter (URL-based)
      if (urlPanels.length > 0) {
        const panel = p.specs?.panelType || '';
        const match = urlPanels.some((pn) => panel.includes(pn) || p.name.includes(pn));
        if (!match) return false;
      }

      // In-Stock Filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    });

    // Sorting (Section 10: Recommended, Price Low-High, Price High-Low, Rating, Newest, Popularity)
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'popularity':
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        default:
          return 0; // recommended
      }
    });
  }, [
    routeMeta,
    searchQuery,
    minPriceParam,
    maxPriceParam,
    urlSockets,
    urlCores,
    urlVram,
    urlRamTypes,
    urlCapacities,
    urlResolutions,
    urlPanels,
    inStockOnly,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('sort', e.target.value);
    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-24">
      {/* Background ShapeGrid */}
      <div className="absolute top-0 left-0 right-0 h-[360px] overflow-hidden pointer-events-none opacity-15 z-0">
        <ShapeGrid
          speed={0.25}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.15)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Clickable Breadcrumbs & Back Navigation */}
        <BreadcrumbNav
          items={routeMeta.breadcrumbs}
          backTo={routeMeta.backTo}
        />

        {/* Category Header with Product Count Badge */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/40">
                  OFFICIAL HARDWARE CATALOG
                </span>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {filteredProducts.length} PRODUCTS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
                {routeMeta.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-mono">
                {routeMeta.subtitle}
              </p>
            </div>

            {/* Quick Search & Mobile Filter Triggers */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search CPUs, GPUs, RAM..."
                  className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-white cursor-pointer"
              >
                <Filter className="w-4 h-4 text-red-500" />
                <span>FILTERS</span>
              </button>
            </div>
          </div>
        </FadeContent>

        {/* 2-Column Responsive Layout (Filters on Left, Products on Right) */}
        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Reusable ProductFilters Sidebar */}
            <aside
              className={`md:block ${
                isMobileFiltersOpen
                  ? 'block fixed inset-0 z-50 bg-[#0A0A0C]/98 p-6 overflow-y-auto'
                  : 'hidden'
              } md:static md:bg-transparent md:p-0 md:z-auto`}
            >
              {isMobileFiltersOpen && (
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 md:hidden mb-5">
                  <span className="text-sm font-mono font-bold uppercase text-white">
                    FILTER HARDWARE
                  </span>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              <ProductFilters
                category={routeMeta.category}
                subType={routeMeta.subType}
                brand={routeMeta.brand}
                onClearAll={handleClearFilters}
              />

              {isMobileFiltersOpen && (
                <div className="pt-6 md:hidden">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-3 bg-red-600 text-white font-mono font-bold text-xs uppercase rounded-lg"
                  >
                    SHOW {filteredProducts.length} RESULTS
                  </button>
                </div>
              )}
            </aside>

            {/* Product Grid & Top Sort Bar */}
            <main className="md:col-span-3 space-y-6">
              {/* Sort Controls Bar */}
              <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800/80 rounded-lg px-4 py-2.5">
                <span className="text-xs font-mono text-neutral-400">
                  SHOWING <strong className="text-white">{visibleProducts.length}</strong> OF <strong className="text-white">{filteredProducts.length}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-mono uppercase text-neutral-400">SORT:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price — Low to High</option>
                    <option value="price-desc">Price — High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>

              {/* Skeletons Loading State */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                /* Empty Results State */
                <div className="border border-neutral-800 bg-[#120F17] rounded-xl p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800/40 text-red-500 flex items-center justify-center mx-auto">
                    <Flame className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    NO HARDWARE FOUND
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-md mx-auto">
                    Try adjusting your filters or search terms to find available products.
                  </p>
                  <div className="pt-3 flex justify-center gap-3">
                    <button
                      onClick={handleClearFilters}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase rounded transition-colors cursor-pointer"
                    >
                      CLEAR FILTERS
                    </button>
                    <Link
                      to="/products"
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono font-bold uppercase rounded transition-colors"
                    >
                      EXPLORE HARDWARE HUB
                    </Link>
                  </div>
                </div>
              ) : (
                /* Product Grid using reusable ProductCard */
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>

                  {/* Pagination / Load More */}
                  {visibleCount < filteredProducts.length && (
                    <div className="pt-6 text-center">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 18)}
                        className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/80 text-xs font-mono font-bold uppercase tracking-widest text-white rounded-lg transition-colors cursor-pointer"
                      >
                        LOAD MORE HARDWARE (+18)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default ProductListingPage;
