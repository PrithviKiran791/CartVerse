import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCatalog } from '../components/catalog/ProductCatalog';
import HeroParallax from '../components/ui/hero-parallax';
import ShapeGrid from '../components/common/ShapeGrid';
import { mockProducts } from '../data/mockProducts';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency } from '../utils/formatters';

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
    <div className="flex flex-col space-y-12 pb-16 relative">
      {/* ShapeGrid Canvas Animated Background for Products & Pre-Builts */}
      <div className="absolute top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-auto opacity-45 z-0">
        <ShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.16)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={3}
        />
      </div>

      {/* Restored 3D Scroll Parallax Animation Showcase */}
      <div className="relative z-10">
        <HeroParallax
          products={parallaxProducts}
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
        />
      </div>

      {/* Main Hardware Catalog (hidden on pre-built page per layout rules) */}
      <div className="relative z-10">
        {!isPrebuiltPage && <ProductCatalog />}
      </div>
    </div>
  );
};

export default ProductsPage;
