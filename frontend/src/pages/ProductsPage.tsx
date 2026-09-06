import React from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroParallax from '../components/ui/hero-parallax';
import ShapeGrid from '../components/common/ShapeGrid';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';
import MagicBento from '../components/common/MagicBento';
import warrantyBoxSvg from '../assets/warranty-shipping-box.svg';
import { Sparkles } from 'lucide-react';
import { Boxes } from '../components/ui/background-boxes';
import FadeContent from '../components/common/FadeContent';

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
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
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

  const headerTitle = isPrebuiltPage
    ? "Pre-Built Gaming Rigs & Workstations"
    : "Explore 500+ Hardware Products & Rig Components";

  const headerSubtitle = isPrebuiltPage
    ? "Explore signature pre-built desktop systems, fully assembled, cable-managed, stress-tested, and covered with 100% Indian warranty."
    : "3D scroll parallax gallery showcasing Processors, GPUs, Gaming Monitors, Headphones, Mice, Mousepads, and Custom PC Cabinets.";

  return (
    <div className="flex flex-col space-y-6 pb-16 relative">
      {/* ShapeGrid Canvas Animated Background */}
      <div className="absolute top-0 left-0 right-0 h-[450px] overflow-hidden pointer-events-auto opacity-35 z-0">
        <ShapeGrid
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.14)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      {/* Signature 3D Scroll Parallax Animation Showcase */}
      <div className="relative z-10">
        <HeroParallax
          products={parallaxProducts}
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
        />
      </div>


      {/* Main Hardware Catalog Top Banner & Category Discovery */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 w-full">
        {/* Top Banner (restored from previous catalog design) */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-10 mb-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
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
      </div>
    </div>
  );
};

export default ProductsPage;
