import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HeroParallax from '../components/ui/hero-parallax';
import ShapeGrid from '../components/common/ShapeGrid';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import MagicBento from '../components/common/MagicBento';
import warrantyBoxSvg from '../assets/warranty-shipping-box.svg';
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
    badge: 'AMD · INTEL · NVIDIA',
    composedImages: {
      gpu: getComponentImage('GPU/Nvidia/rtx_4080_super.jpg', 'gpu'),
      cpu: getComponentImage('CPU_Image/AMD/AMD_Ryzen_7_9850x3d.jpeg', 'cpu'),
    },
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'Liquid & Air Cooling',
    description: 'Precision AIO radiators, custom coolants & high-CFM fans',
    label: 'Thermal Systems',
    href: '/thermal-systems',
    badge: 'AIO & AIR SYSTEMS',
    image: getComponentImage('liquid cooler/NZXT Kraken Elite 360 RGB (V2).jpg', 'cooler'),
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'HIGH-SPEED MEMORY',
    description: 'DDR4 & DDR5 performance modules for gaming and workstation builds.',
    label: 'Memory',
    href: '/memory',
    badge: 'DDR4 · DDR5',
    image: getComponentImage('Memory/Ram/adata/Adata-XPG-Lancer-RGB-ROG-Certified-32GB-16GBx2-DDR5-6600MHz-Desktop-Ram-2.jpg', 'ram'),
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'High-Speed Interconnects',
    description: 'Sleeved PSU extensions, chassis IO splitters & Type-C',
    label: 'Cables & Headers',
    href: '/cables-headers',
    badge: 'ATX 3.0 & 40GBPS',
    image: getComponentImage('Cables/PSU Cables/Custom Sleeved Cable Extension Kit.jpg', 'cables'),
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'Fast-IPS & OLED Displays',
    description: 'Ultrawide, 4K UHD & 360Hz esports monitors',
    label: 'Displays',
    href: '/displays',
    badge: '0.03MS · 4K OLED',
    image: getComponentImage('Monitors/Samsung Odyssey OLED G8 (G80SD).jpeg', 'monitor'),
    ctaText: 'EXPLORE CATEGORY',
  },
  {
    color: '#120F17',
    title: 'Direct Brand RMA',
    description: '100% authentic inventory with pan-India insured shipping',
    label: 'Warranty & Delivery',
    href: '/warranty-delivery',
    badge: 'TRUSTED SERVICE HUB',
    image: warrantyBoxSvg,
    ctaText: 'VIEW POLICIES',
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
    ? "Explore signature pre-built desktop systems, fully assembled, cable-managed, stress-tested, and covered with 100% Indian warranty."
    : "3D scroll parallax gallery showcasing Processors, GPUs, Gaming Monitors, Headphones, Mice, Mousepads, and Custom PC Cabinets.";

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
          <div className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-10 mb-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Aceternity Animated Background Boxes */}
            <div className="absolute inset-0 w-full h-full bg-neutral-950/70 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Direct Indian Channel Hardware</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
                PC HARDWARE &<br />
                COMPONENTS<br />
                CATALOG
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
                Browse our comprehensive inventory of processors, GPUs, motherboards, high-speed RAM, NVMe SSDs, and peripherals with real-time stock and compatibility validation.
              </p>
            </div>
          </div>
        </FadeContent>

        {/* Brand/Manufacturer Marquee & Quick-Filter Strip */}
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="mb-10 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl py-4 px-4 sm:px-6 backdrop-blur-md relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-semibold">HARDWARE ECOSYSTEM // DIRECT BRAND INVENTORY</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                CLICK ANY BRAND FOR RAPID SPEC FILTER
              </span>
            </div>

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
            <div className="mb-8 p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-red-400 tracking-wider">
                      Active Brand Filter:
                    </span>
                    <span className="text-sm font-black text-white uppercase font-mono">
                      {activeBrand}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-200 hover:text-white hover:border-red-500/60 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
                <span>Clear Brand Filter</span>
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
                glowColor="227, 27, 35"
                disableAnimations={false}
              />
            </div>
          </FadeContent>
        )}

        {/* Hardware Telemetry Terminal Matrix (Catalog Below Part) */}
        <FadeContent blur={true} duration={900} delay={200} easing="ease-out" initialOpacity={0}>
          <div className="relative w-full h-[320px] sm:h-[380px] mt-16 rounded-3xl border border-neutral-800/90 overflow-hidden bg-neutral-950 shadow-2xl">
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

            {/* Gradient Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-10" />

            {/* Content overlay */}
            <div className="relative z-20 h-full p-6 sm:p-10 flex flex-col justify-between pointer-events-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase bg-red-950/80 px-2.5 py-1 rounded border border-red-800/60">
                    CATALOG TELEMETRY STREAM // LIVE COMPONENT BUS
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                  MULTI-COLOR MATRIX // RED • YELLOW • GREY • BLACK
                </span>
              </div>

              <div className="max-w-xl">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  Comprehensive Hardware Catalog Engine
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-1.5 leading-relaxed">
                  Real-time stock tracking, verified component architectural specifications, and direct tier-1 OEM warranty protection across all hardware tiers.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80 text-xs font-mono pointer-events-auto">
                <div className="flex items-center gap-4 text-neutral-400">
                  <span className="text-red-400 font-bold">● RED // ARCHITECTURE</span>
                  <span className="text-amber-400 font-bold">● YELLOW // GLITCH/BUS</span>
                  <span className="text-neutral-400 font-bold">● GREY // TELEMETRY</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/60 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  <span>Back to Top Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default ProductsPage;
