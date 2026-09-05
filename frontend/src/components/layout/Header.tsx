import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PillNav from './PillNav';
import CurvedInput from '../common/CurvedInput';
import { ShoppingBag, Search, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { QuickSearchModal } from '../common/QuickSearchModal';
import { MagneticButton } from '../ui/magnetic-button';
import { NoiseBackground } from '../ui/noise-background';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import webIcon from '../../assets/icons/web_icon.png';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemsCount, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemsCount = getItemsCount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Global hotkey listener (Ctrl+K or Cmd+K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/products' },
    { label: 'PC Builder', href: '/builder' },
    { label: 'Pre-Builts', href: '/products?category=prebuilt' },
  ];

  const handleSearchSubmit = (val?: string) => {
    const term = val || searchValue;
    if (term && term.trim()) {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl">
      {/* Main Navigation Bar Container */}
      <div className="w-full px-4 sm:px-8 flex items-center justify-between py-2.5 gap-6">
        {/* PillNav Component Aligned Flush Left */}
        <div className="shrink-0 flex items-center">
          <PillNav
            logo={webIcon}
            logoAlt="CartVerse Hardware Logo"
            items={navItems}
            activeHref={location.pathname}
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0a0a0c"
            pillColor="#16151f"
            hoverCircleColor="#ffffff"
            activeDotColor="#e31b23"
            pillTextColor="#ffffff"
            hoveredPillTextColor="#000000"
            initialLoadAnimation={false}
          />
        </div>

        {/* Extended Curved Search Bar & Cart Drawer Trigger */}
        <div className="flex-1 flex items-center justify-end gap-4 max-w-2xl">
          {/* React-Bits CurvedInput Search Bar */}
          <div className="flex-1 max-w-lg min-w-[240px]" onClick={() => setIsSearchOpen(true)}>
            <CurvedInput
              placeholder="Search components (Ctrl+K)..."
              buttonText="Search"
              theme="dark"
              bend={14}
              height={44}
              width="100%"
              cornerRadius={18}
              borderWidth={1.5}
              fontSize={14}
              backgroundColor="#16151f"
              textColor="#f5f5f5"
              placeholderColor="#a1a1aa"
              borderColor="#392e4e"
              buttonColor="#E31B23"
              buttonTextColor="#ffffff"
              showButton={true}
              showIcon={true}
              icon={
                <g transform="translate(0, 0)">
                  <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#E31B23" />
                  <path d="M-4 -4 L2 2 M1 1 A 4 4 0 1 0 -4 -4" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </g>
              }
              value={searchValue}
              onChange={(val: string) => setSearchValue(val)}
              onSubmit={handleSearchSubmit}
            />
          </div>

          {/* User Auth Profile / Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-[#16151f] border border-[#392e4e] rounded-full px-3 py-1.5 shadow-md">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold font-mono shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-mono text-neutral-200 hidden lg:inline max-w-[110px] truncate" title={user?.name || user?.email}>
                {user?.name || 'Gamer'}
              </span>
              <button
                onClick={() => logout()}
                className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link to="/login" title="Sign In to CartVerse" className="shrink-0">
              <NoiseBackground
                containerClassName="w-fit p-0.5 rounded-full mx-auto shadow-lg"
                gradientColors={[
                  "rgb(255, 100, 150)",
                  "rgb(100, 150, 255)",
                  "rgb(255, 200, 100)",
                ]}
              >
                <button className="h-full w-full cursor-pointer rounded-full bg-neutral-950 hover:bg-neutral-900 px-4 py-1.5 text-xs font-rajdhani font-bold uppercase tracking-widest text-white flex items-center gap-1.5 transition-all duration-100 active:scale-98">
                  <LogIn className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Log In &rarr;</span>
                </button>
              </NoiseBackground>
            </Link>
          )}

          {/* Quick Cart Drawer Trigger Button */}
          <MagneticButton>
            <NoiseBackground containerClassName="rounded-full shadow-lg">
              <button
                onClick={openCart}
                className="relative flex items-center justify-center p-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer shrink-0"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600 shadow-md">
                    {itemsCount}
                  </span>
                )}
              </button>
            </NoiseBackground>
          </MagneticButton>
        </div>
      </div>

      {/* Interactive Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
