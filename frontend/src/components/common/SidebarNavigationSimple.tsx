import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Home,
  LayoutGrid,
  Cpu,
  Tv,
  Flame,
  Layers,
  Zap,
  Sparkles,
  Box,
  ShieldCheck,
  Monitor,
  Wrench,
  CheckCircle2,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Volume2,
  Camera,
  Gamepad2,
  Cable,
  Fan,
  Droplets,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Typography from '../ui/Typography';

export interface NavSubItem {
  label: string;
  href: string;
  category?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
}

export interface NavItemType {
  label: string;
  href: string;
  category?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  items?: NavSubItem[];
}

export interface SidebarNavigationSimpleProps {
  items?: NavItemType[];
  footerItems?: NavItemType[];
  featureCard?: React.ReactNode;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const defaultNavItems: NavItemType[] = [
  {
    label: 'Hardware Catalog',
    href: '/products',
    category: 'all',
    icon: Home,
    items: [
      { label: 'Catalog Overview', href: '/products', category: 'all', icon: LayoutGrid },
      { label: 'Processors (CPUs)', href: '/products?category=cpu', category: 'cpu', icon: Cpu, badge: '282' },
      { label: 'Graphics Cards (GPUs)', href: '/products?category=gpu', category: 'gpu', icon: Tv, badge: '102' },
      { label: 'Pre-Built Systems', href: '/products?category=prebuilt', category: 'prebuilt', icon: Flame, badge: 'SIGNATURE' },
    ],
  },
  {
    label: 'Core Components',
    href: '/products',
    icon: Layers,
    items: [
      { label: 'Motherboards', href: '/products?category=motherboard', category: 'motherboard', icon: Layers },
      { label: 'Memory (DDR4 / DDR5)', href: '/products?category=ram', category: 'ram', icon: Zap },
      { label: 'NVMe SSD Storage', href: '/products?category=ssd', category: 'ssd', icon: Sparkles },
      { label: 'Hard Drives (HDD)', href: '/products?category=hdd', category: 'hdd', icon: HardDrive },
      { label: 'CPU Coolers & AIOs', href: '/products?category=cooler', category: 'cooler', icon: Fan, badge: 'AIO & AIR' },
      { label: 'PC Coolants & Fluids', href: '/products?category=coolant', category: 'coolant', icon: Droplets },
      { label: 'Power Supplies (PSU)', href: '/products?category=psu', category: 'psu', icon: Zap },
      { label: 'PC Cabinets & Cases', href: '/products?category=cabinet', category: 'cabinet', icon: Box },
    ],
  },
  {
    label: 'Peripherals & Accessories',
    href: '/products',
    icon: Gamepad2,
    items: [
      { label: 'Gaming Monitors', href: '/products?category=monitor', category: 'monitor', icon: Monitor },
      { label: 'Mechanical Keyboards', href: '/products?category=keyboard', category: 'keyboard', icon: Keyboard },
      { label: 'Esports Gaming Mice', href: '/products?category=mouse', category: 'mouse', icon: Mouse },
      { label: 'Mousepads & Deskmats', href: '/products?category=mousepad', category: 'mousepad', icon: Sparkles },
      { label: 'Headphones & Headsets', href: '/products?category=headphones', category: 'headphones', icon: Headphones },
      { label: 'Desktop Speakers', href: '/products?category=speakers', category: 'speakers', icon: Volume2 },
      { label: 'Game Controllers', href: '/products?category=controller', category: 'controller', icon: Gamepad2 },
      { label: 'Gaming Consoles', href: '/console', category: 'console', icon: Gamepad2, badge: 'NINTENDO / SONY / XBOX' },
      { label: 'Webcams & Streaming', href: '/products?category=webcam', category: 'webcam', icon: Camera },
      { label: 'Cables & Custom Extensions', href: '/products?category=cables', category: 'cables', icon: Cable },
    ],
  },
  {
    label: 'PC Builder Studio',
    href: '/builder',
    icon: Wrench,
    badge: 'LIVE',
  },
];

export const defaultFooterItems: NavItemType[] = [
  {
    label: 'Socket Compatibility',
    href: '/builder',
    icon: ShieldCheck,
    badge: '100% OK',
  },
  {
    label: 'Indian Warranty RMA',
    href: '/products',
    icon: CheckCircle2,
  },
];

const DefaultFeatureCard = () => (
  <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
        <Zap className="w-4 h-4 text-amber-400" />
        <span>Power & Headroom</span>
      </div>
      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
        OPTIMAL
      </span>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-mono text-neutral-400">
        <span>Suggested PSU</span>
        <span className="text-white font-bold">850W Gold</span>
      </div>
      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full w-[68%]" />
      </div>
    </div>
    <p className="text-[10px] text-neutral-400 leading-tight">
      Real-time wattage estimation calculated live against active build selections.
    </p>
  </div>
);

export const SidebarNavigationSimple: React.FC<SidebarNavigationSimpleProps> = ({
  items = defaultNavItems,
  footerItems = defaultFooterItems,
  featureCard,
  activeCategory = 'all',
  onSelectCategory,
  className,
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Hardware Catalog': true,
    'Core Components': true,
    'Peripherals & Accessories': true,
  });

  const location = useLocation();

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleItemClick = (e: React.MouseEvent, cat?: string, href?: string) => {
    if (cat && onSelectCategory) {
      e.preventDefault();
      onSelectCategory(cat);
    }
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-72 bg-neutral-900/95 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-xl space-y-6',
        className
      )}
    >
      <div className="space-y-6">
        {/* Navigation Section Title */}
        <div className="pb-3 border-b border-neutral-800 flex items-center justify-between">
          <Typography type="h4" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            Navigation Menu
          </Typography>
          <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold">
            UNTITLED UI
          </span>
        </div>

        {/* Main Nav Items */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon || Home;
            const hasSub = item.items && item.items.length > 0;
            const isOpen = openGroups[item.label] ?? false;

            return (
              <div key={item.label} className="space-y-1">
                {hasSub ? (
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                    </div>
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    onClick={(e) => handleItemClick(e, item.category, item.href)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all',
                      activeCategory === item.category
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub-items collapse */}
                {hasSub && isOpen && (
                  <div className="pl-6 space-y-1 pt-0.5 border-l border-neutral-800 ml-5">
                    {item.items?.map((sub) => {
                      const SubIcon = sub.icon || LayoutGrid;
                      const isSubActive = activeCategory === sub.category;

                      return (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          onClick={(e) => handleItemClick(e, sub.category, sub.href)}
                          className={cn(
                            'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                            isSubActive
                              ? 'bg-red-600/20 text-red-400 border border-red-500/40 font-bold'
                              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span className="text-[9px] font-mono bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Feature Card Slot */}
      <div className="pt-2">{featureCard || <DefaultFeatureCard />}</div>

      {/* Footer Items */}
      {footerItems && footerItems.length > 0 && (
        <div className="pt-4 border-t border-neutral-800 space-y-1">
          {footerItems.map((fItem) => {
            const FIcon = fItem.icon || CheckCircle2;
            return (
              <Link
                key={fItem.label}
                to={fItem.href}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>{fItem.label}</span>
                </div>
                {fItem.badge && (
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                    {fItem.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default SidebarNavigationSimple;
