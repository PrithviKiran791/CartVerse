import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Box,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Gamepad2,
  Cable,
  Flame,
  ArrowRight,
  Camera,
  Volume2,
  Disc,
  ChevronDown,
} from 'lucide-react';
import { Product, ComponentCategory } from '../../types/hardware';
import { ProductCard } from './ProductCard';

interface CategorySectionViewProps {
  products: Product[];
  onSelectCategory?: (category: ComponentCategory) => void;
}

interface SectionConfig {
  category: ComponentCategory;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const CategorySectionView: React.FC<CategorySectionViewProps> = ({ products, onSelectCategory }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleExpand = (cat: string) => {
    setExpandedSections((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const sections: SectionConfig[] = [
    {
      category: 'cpu',
      title: 'Processors (CPU)',
      subtitle: 'AMD Ryzen 9000/7000 Series, Threadripper & Intel Core Ultra / 14th Gen',
      icon: Cpu,
      accentColor: 'from-red-600/20 to-orange-600/10 border-red-500/30',
    },
    {
      category: 'gpu',
      title: 'Graphics Cards (GPU)',
      subtitle: 'NVIDIA GeForce RTX 50/40/30 Series & AMD Radeon RX 7000 Series',
      icon: Tv,
      accentColor: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30',
    },
    {
      category: 'motherboard',
      title: 'Motherboards',
      subtitle: 'AM5, AM4, LGA1851 & LGA1700 Chipsets from ASUS, MSI, Gigabyte & ASRock',
      icon: Layers,
      accentColor: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30',
    },
    {
      category: 'ram',
      title: 'Memory (RAM)',
      subtitle: 'High-Frequency DDR5 & DDR4 Kits from Corsair, G.Skill, ADATA, Kingston & Crucial',
      icon: HardDrive,
      accentColor: 'from-purple-600/20 to-pink-600/10 border-purple-500/30',
    },
    {
      category: 'ssd',
      title: 'Solid State Storage (SSD)',
      subtitle: 'PCIe Gen5 & Gen4 Ultrafast NVMe M.2 Drives with Up to 14,500 MB/s',
      icon: Disc,
      accentColor: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30',
    },
    {
      category: 'hdd',
      title: 'Hard Disk Drives (HDD)',
      subtitle: 'High-Capacity 7200 RPM Enterprise & Surveillance Storage up to 24TB',
      icon: HardDrive,
      accentColor: 'from-sky-600/20 to-cyan-600/10 border-sky-500/30',
    },
    {
      category: 'psu',
      title: 'Power Supply Units (PSU)',
      subtitle: '80+ Gold & Platinum ATX 3.0 Modular Power Supplies with 12VHPWR Support',
      icon: Zap,
      accentColor: 'from-yellow-600/20 to-amber-600/10 border-yellow-500/30',
    },
    {
      category: 'cabinet',
      title: 'PC Cabinets & Chassis',
      subtitle: 'Panoramic Showcase, High-Airflow & Dual-Chamber Tempered Glass Cases',
      icon: Box,
      accentColor: 'from-rose-600/20 to-red-600/10 border-rose-500/30',
    },
    {
      category: 'monitor',
      title: 'Gaming Monitors',
      subtitle: 'OLED, QD-OLED & Fast-IPS Displays with Up to 360Hz Refresh Rate',
      icon: Monitor,
      accentColor: 'from-violet-600/20 to-purple-600/10 border-violet-500/30',
    },
    {
      category: 'keyboard',
      title: 'Mechanical & Rapid-Trigger Keyboards',
      subtitle: 'Hall Effect Analog, Custom Gasket Mount & Wireless Mechanical Boards',
      icon: Keyboard,
      accentColor: 'from-amber-600/20 to-yellow-600/10 border-amber-500/30',
    },
    {
      category: 'mouse',
      title: 'Esports Gaming Mice',
      subtitle: 'Ultralight Sub-60g Wireless Mice with 8000Hz HyperPolling Sensors',
      icon: Mouse,
      accentColor: 'from-emerald-600/20 to-green-600/10 border-emerald-500/30',
    },
    {
      category: 'mousepad',
      title: 'Gaming Mousepads & Surfaces',
      subtitle: 'Artisan Poron Japanese Pads, Cordura & Glass Surfaces',
      icon: Disc,
      accentColor: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/30',
    },
    {
      category: 'headphones',
      title: 'Headphones & Headsets',
      subtitle: 'Audiophile Wireless Gaming Headsets & Studio Reference Cans',
      icon: Headphones,
      accentColor: 'from-blue-600/20 to-cyan-600/10 border-blue-500/30',
    },
    {
      category: 'speakers',
      title: 'Desktop Speakers & Soundbars',
      subtitle: 'Hi-Res Powered Bluetooth Studio Monitors & RGB Gaming Soundbars',
      icon: Volume2,
      accentColor: 'from-teal-600/20 to-emerald-600/10 border-teal-500/30',
    },
    {
      category: 'webcam',
      title: 'Webcams & Broadcast Cameras',
      subtitle: '4K & 1080p 60FPS Streaming Webcams with Sony STARVIS Sensors',
      icon: Camera,
      accentColor: 'from-pink-600/20 to-rose-600/10 border-pink-500/30',
    },
    {
      category: 'controller',
      title: 'Gamepads & Controllers',
      subtitle: 'PlayStation DualSense, Xbox Elite & Hall Effect Wireless Gamepads',
      icon: Gamepad2,
      accentColor: 'from-orange-600/20 to-amber-600/10 border-orange-500/30',
    },
    {
      category: 'cables',
      title: 'Cables & High-Speed Interconnects',
      subtitle: '8K Ultra HDMI 2.1, 240W USB-C & Braided Audio Interconnects',
      icon: Cable,
      accentColor: 'from-neutral-600/20 to-zinc-600/10 border-neutral-500/30',
    },
    {
      category: 'prebuilt',
      title: 'Signature Custom Pre-Built PCs',
      subtitle: 'Hand-Crafted, Thermally Validated & Turnkey Gaming Rigs',
      icon: Flame,
      accentColor: 'from-red-600/30 to-orange-600/20 border-red-500/50',
    },
  ];

  return (
    <div className="space-y-16">
      {sections.map((section) => {
        const categoryProducts = products.filter((p) => p.category === section.category);
        if (categoryProducts.length === 0) return null;

        const isExpanded = expandedSections[section.category] ?? false;
        const visibleProducts = isExpanded ? categoryProducts : categoryProducts.slice(0, 8);
        const Icon = section.icon;

        return (
          <section
            key={section.category}
            id={`section-${section.category}`}
            className="scroll-mt-28 relative"
          >
            {/* Section Header Card */}
            <div
              className={`bg-gradient-to-r ${section.accentColor} border rounded-2xl p-6 mb-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    {section.title}
                    <span className="text-xs font-mono font-normal text-neutral-400 bg-neutral-900/90 px-2.5 py-0.5 rounded-full border border-neutral-800">
                      {categoryProducts.length} Models
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-300 mt-1">{section.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/products?category=${section.category}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-lg transition-all"
                >
                  <span>Filter {section.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Product Grid for this specific category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Show more/less for categories with > 8 products */}
            {categoryProducts.length > 8 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => toggleExpand(section.category)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-200 transition-all cursor-pointer shadow-lg"
                >
                  <span>
                    {isExpanded
                      ? 'Show Less'
                      : `View All ${categoryProducts.length} ${section.title} (+${categoryProducts.length - 8} more)`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default CategorySectionView;
