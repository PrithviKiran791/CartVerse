import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCatalog } from '../components/catalog/ProductCatalog';
import HeroParallax from '../components/ui/hero-parallax';
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
    <div className="flex flex-col space-y-12 pb-16">
      {/* Restored 3D Scroll Parallax Animation Showcase */}
      <HeroParallax
        products={parallaxProducts}
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
      />

      {/* Main Hardware Catalog (hidden on pre-built page per layout rules) */}
      {!isPrebuiltPage && <ProductCatalog />}
    </div>
  );
};

export default ProductsPage;
