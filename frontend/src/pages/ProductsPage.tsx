import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HeroParallax from '../components/ui/hero-parallax';
import ShapeGrid from '../components/common/ShapeGrid';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import MagicBento from '../components/common/MagicBento';
import { SpinLogo } from '../components/catalog/SpinLogo';
import nvidiaGpuGif from '../assets/icons/Artificial Intelligence Ai GIF by NVIDIA GeForce.gif';
import coolerMasterGif from '../assets/icons/Computer Cooling GIF by Cooler Master.gif';
import memoryGif from '../assets/icons/Memory.gif';
import cablesGif from '../assets/icons/Cables and Peripherals.gif';
import monitorGif from '../assets/icons/monitor-display-clean.gif';
import rogLogoGif from '../assets/animations/rog-clean-metallic.gif';
import { Sparkles, X, Filter, ArrowRight } from 'lucide-react';
import { Boxes } from '../components/ui/background-boxes';
import FadeContent from '../components/common/FadeContent';
import LogoLoop, { LogoItem } from '../components/common/LogoLoop';
import { brandLogos, CatalogBrandItem } from '../data/brandLogos';
import { ProductCard } from '../components/catalog/ProductCard';
import FaultyTerminal from '../components/common/FaultyTerminal';

const catalogBentoCards = [
  {
    color: '#120F17',
    title: 'Extreme Silicon',
    description: 'Unlocked Intel Core, AMD Ryzen & NVIDIA RTX GPUs',
    label: 'Processors & GPUs',
    href: '/processors-gpus',
    image: nvidiaGpuGif,
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'Liquid & Air Cooling',
    description: 'Precision AIO radiators, custom coolants & high-CFM fans',
    label: 'Thermal Systems',
    href: '/thermal-systems',
    image: coolerMasterGif,
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'HIGH-SPEED MEMORY',
    description: 'DDR4 & DDR5 performance modules for gaming and workstation builds.',
    label: 'Memory',
    href: '/memory',
    image: memoryGif,
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'High-Speed Interconnects',
    description: 'Sleeved PSU extensions, chassis IO splitters & Type-C',
    label: 'Cables & Headers',
    href: '/cables-headers',
    image: cablesGif,
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'Fast-IPS & OLED Displays',
    description: 'Ultrawide, 4K UHD & 360Hz esports monitors',
    label: 'Displays',
    href: '/displays',
    image: monitorGif,
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    image: rogLogoGif,
    alt: '',
    ariaHidden: true,
    eager: true,
    hideOverlay: true,
    imageContainerClassName: 'magic-bento-card__image-container--warranty',
    imageClassName: 'magic-bento-card__image--rog',
  }
];

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');
  const isPrebuiltPage = currentCategory === 'prebuilt';

  // Filter products for 3D scroll parallax showcase
  const prebuiltProducts = mockProducts.filter((p) => p.category === 'prebuilt');

  // Multi-category hardware selection for standard products page
  const targetCategories = ['cpu', 'gpu', 'monitor', 'headphones', 'mouse', 'mousepad', 'cabinet'];
  const generalProducts = targetCategories.flatMap((cat) =>
    mockProducts.filter((p) => p.category === cat).slice(0, 2)
  );

  const selectedProducts = isPrebuiltPage
    ? (prebuiltProducts.length >= 15
        ? prebuiltProducts
        : [...prebuiltProducts, ...mockProducts.filter((p) => p.category === 'prebuilt')])
        .slice(0, 15)
    : generalProducts.slice(0, 15);

  const parallaxProducts = selectedProducts.map((p) => ({
    title: p.name,
    link: `/product/${p.id}`,
    thumbnail: getComponentImage(p.imageSlug, p.category),
    category: p.category.toUpperCase(),
    price: formatCurrency(p.price),
  }));

  // If a brand is selected via quick-filter marquee, find matching products
  const brandFilteredProducts = useMemo(() => {
    if (!activeBrand) return [];
    return mockProducts.filter(
      (p) => p.brand.toLowerCase() === activeBrand.toLowerCase()
    );
  }, [activeBrand]);

  const handleBrandClick = (item: LogoItem) => {
    const brandItem = item as CatalogBrandItem;
    // If it's a dedicated category route (AMD/Intel/NVIDIA/Playstation/Xbox/Nintendo)
    if (brandItem.catalogHref && !brandItem.catalogHref.startsWith('/products?brand=')) {
      navigate(brandItem.catalogHref);
      return;
    }

    const brandName = brandItem.name;
    const newParams = new URLSearchParams(searchParams);
    if (activeBrand?.toLowerCase() === brandName.toLowerCase()) {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brandName);
    }
    setSearchParams(newParams);
  };

  const handleClearBrand = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand');
    setSearchParams(newParams);
  };

  const headerTitle = isPrebuiltPage
    ? "Pre-Built Gaming Rigs & Workstations"
    : "Explore 500+ Hardware Products & Rig Components";

  const headerSubtitle = isPrebuiltPage
    ? "Explore signature pre-built desktop systems, fully assembled, cable-managed, and stress-tested."
    : undefined;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0C] flex flex-col space-y-6 pb-16">
      {/* Aceternity Full-Page Background Boxes & Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A0C]/85 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-35" />

      {/* Signature 3D Scroll Parallax Animation Showcase */}
      <div className="relative z-20">
        <HeroParallax
          products={parallaxProducts}
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
        />
      </div>


      {/* Main Hardware Catalog Top Banner & Category Discovery */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 w-full">
        {/* Top Banner (restored from previous catalog design) */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 rounded-none sm:rounded-md p-6 sm:p-10 mb-8 backdrop-blur-xl relative overflow-hidden shadow-[10px_10px_0px_0px_#000000] dark:shadow-[10px_10px_0px_0px_#FF1E2D]">
            {/* Aceternity Animated Background Boxes */}
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-mono text-xs text-[#FF1E2D] font-bold tracking-widest uppercase">
                    // SYS.CATALOG // HARDWARE_INVENTORY_MATRIX
                  </p>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
                  PC HARDWARE &<br />
                  COMPONENTS<br />
                  CATALOG
                </h1>
                <p className="mt-4 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl font-mono">
                  Browse our comprehensive inventory of processors, GPUs, motherboards, high-speed RAM, NVMe SSDs, and peripherals with real-time stock and compatibility validation.
                </p>
              </div>

              {/* Interactive Spinning Fan Logo */}
              <div className="pointer-events-auto shrink-0 flex items-center justify-center lg:justify-end self-center lg:self-auto py-2">
                <SpinLogo size={240} className="sm:scale-105" />
              </div>
            </div>
          </div>
        </FadeContent>

        {/* Brand/Manufacturer Marquee & Quick-Filter Strip */}
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="mb-10 bg-neutral-900/90 border-2 border-neutral-900 dark:border-neutral-700 rounded-none py-4 px-4 sm:px-6 backdrop-blur-md relative overflow-hidden shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#FF1E2D]">
            <LogoLoop
              logos={brandLogos}
              speed={55}
              direction="left"
              logoHeight={28}
              gap={36}
              pauseOnHover={true}
              scaleOnHover={true}
              grayscale={true}
              fadeOut={true}
              fadeOutColor="#131317"
              ariaLabel="Manufacturer brand filter marquee"
              onLogoClick={handleBrandClick}
              activeBrand={activeBrand || undefined}
            />
          </div>
        </FadeContent>

        {/* Active Brand Filter Result Bar */}
        {activeBrand && (
          <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0}>
            <div className="mb-8 p-4 bg-red-950/40 border-2 border-red-600 rounded-none shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-none bg-red-500/20 text-red-400 border border-red-500/40">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-red-400 tracking-wider">
                      // FILTER_ACTIVE:
                    </span>
                    <span className="text-sm font-black text-white uppercase font-mono tracking-wide">
                      [{activeBrand}]
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    {brandFilteredProducts.length} verified authentic components found in catalog
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearBrand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-mono text-neutral-200 hover:text-white hover:border-red-500 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
                <span>CLEAR_FILTER</span>
              </button>
            </div>
          </FadeContent>
        )}

        {/* If brand filter is active, show matching components, else show signature bento */}
        {activeBrand && brandFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {brandFilteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <FadeContent blur={true} duration={900} delay={150} easing="ease-out" initialOpacity={0}>
            <div className="flex flex-col items-center">
              <MagicBento
                cards={catalogBentoCards}
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={true}
                spotlightRadius={400}
                particleCount={12}
                glowColor="255, 30, 45"
                disableAnimations={false}
              />
            </div>
          </FadeContent>
        )}


      </div>
    </div>
  );
};

export default ProductsPage;
