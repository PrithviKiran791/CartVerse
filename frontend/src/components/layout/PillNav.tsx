import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Cpu, Search, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';

export interface PillNavItem {
  label: string;
  href: string;
}

export interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items?: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  theme?: 'light' | 'dark';
  initialLoadAnimation?: boolean;
}

export const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'CartVerse Logo',
  items = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/products' },
    { label: 'PC Builder', href: '/builder' },
    { label: 'Cart', href: '/cart' },
  ],
  activeHref,
  className = '',
  baseColor = '#000000',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#000000',
  theme = 'light',
}) => {
  const location = useLocation();
  const currentPath = activeHref || location.pathname;
  const { toggleCart, getItemsCount } = useCartStore();
  const { getFilledSlotsCount } = usePCBuilderStore();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cartCount = getItemsCount();
  const builderCount = getFilledSlotsCount();

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b border-neutral-800/80 px-4 py-3 shadow-2xl transition-all ${className}`}
      style={{ backgroundColor: baseColor === '#000000' ? 'rgba(10, 10, 12, 0.92)' : baseColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          {logo ? (
            <div className="flex items-center gap-2.5">
              <img src={logo} alt={logoAlt} className="h-9 w-9 object-contain rounded-lg shadow-md" />
              <span className="text-xl font-black tracking-tight text-white font-sans">
                CART<span className="text-red-500">VERSE</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-lg shadow-red-950/40">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                CART<span className="text-red-500">VERSE</span>
              </span>
            </div>
          )}
        </Link>

        {/* Animated Pill Navigation Tabs */}
        <div className="hidden md:flex items-center bg-neutral-900/90 border border-neutral-800 p-1.5 rounded-full shadow-inner relative">
          {items.map((item, idx) => {
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            const isHovered = hoveredIdx === idx;

            return (
              <Link
                key={idx}
                to={item.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative px-5 py-2 text-xs font-mono font-bold uppercase rounded-full transition-all duration-300 z-10 whitespace-nowrap"
                style={{
                  color: isHovered
                    ? hoveredPillTextColor
                    : isActive
                    ? pillTextColor
                    : '#a3a3a3',
                }}
              >
                {/* Active Pill Background Pill */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-300 -z-10 shadow-md"
                    style={{ backgroundColor: pillColor }}
                  />
                )}

                {/* Hover Indicator Effect */}
                {isHovered && !isActive && (
                  <div className="absolute inset-0 rounded-full bg-red-600/80 -z-10 animate-in fade-in" />
                )}

                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Cart & PC Builder */}
        <div className="flex items-center gap-3">
          <Link
            to="/builder"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/50"
          >
            <Cpu className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">PC Builder</span>
            {builderCount > 0 && (
              <span className="bg-white text-red-600 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {builderCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:border-neutral-700 transition-all cursor-pointer"
            aria-label="Toggle Cart"
          >
            <ShoppingCart className="w-4 h-4 text-neutral-200" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg border border-neutral-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PillNav;
