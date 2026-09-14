import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PillNav from './PillNav';
import { GooeyInput } from '../ui/gooey-input';
import { ShoppingBag, Search, LogIn, LogOut, User as UserIcon, Package, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { QuickSearchModal } from '../common/QuickSearchModal';
import { MagneticButton } from '../ui/magnetic-button';
import { NoiseBackground } from '../ui/noise-background';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import webIcon from '../../assets/icons/web_icon.png';
import chatbotIcon from '../../assets/icons/chatbot.png';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { FontSelector } from '../common/FontSelector';
import { useTheme } from '../../context/ThemeContext';
import { useAssistantStore } from '../../store/useAssistantStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemsCount, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleAssistant } = useAssistantStore();
  const { isDarkMode } = useTheme();
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
    { label: 'Servers', href: '/servers' },
    { label: 'Simulators', href: '/simulators' },
    { label: 'Consoles', href: '/console' },
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
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-sm dark:shadow-2xl transition-colors duration-200">
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
            baseColor={isDarkMode ? "#0a0a0c" : "#ffffff"}
            pillColor={isDarkMode ? "#16151f" : "#f1f5f9"}
            hoverCircleColor={isDarkMode ? "#ffffff" : "#0f172a"}
            activeDotColor="#FF1E2D"
            pillTextColor={isDarkMode ? "#ffffff" : "#0f172a"}
            hoveredPillTextColor={isDarkMode ? "#000000" : "#ffffff"}
            initialLoadAnimation={false}
          />
        </div>

        {/* Aceternity UI Gooey Search Bar, Theme Switcher & Cart Drawer Trigger */}
        <div className="flex-1 flex items-center justify-end gap-3 max-w-2xl">
          {/* GooeyInput Search Bar */}
          <div className="flex items-center gap-2">
            <GooeyInput
              placeholder="Search components..."
              collapsedWidth={135}
              expandedWidth={280}
              expandedOffset={48}
              gooeyBlur={5}
              value={searchValue}
              onValueChange={(val) => setSearchValue(val)}
              onSubmit={handleSearchSubmit}
              classNames={{
                root: "relative",
                trigger: "bg-neutral-100 dark:bg-[#16151f] text-neutral-800 dark:text-neutral-200 ring-1 ring-neutral-300 dark:ring-[#392e4e] hover:ring-[#FF1E2D]/50 shadow-sm dark:shadow-md font-sans",
                bubbleSurface: "bg-neutral-100 dark:bg-[#16151f] text-[#FF1E2D] ring-1 ring-neutral-300 dark:ring-[#392e4e] hover:ring-[#FF1E2D] shadow-sm dark:shadow-md",
                input: "text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 font-sans",
              }}
            />
          </div>

          {/* White and Dark Theme Switcher */}
          <ThemeSwitcher size={20} />

          {/* Dynamic Typography Engine & Font Selector */}
          <FontSelector />

          {/* AI Chatbot Assistant Button */}
          <button
            onClick={toggleAssistant}
            className="relative p-2 rounded-full text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#16151f] border border-neutral-300 dark:border-[#392e4e] transition-all shrink-0 cursor-pointer shadow-xs"
            title="CartVerse AI Hardware Assistant"
            aria-label="Open CartVerse AI Chatbot"
          >
            <img
              src={chatbotIcon}
              alt="Chatbot"
              className="w-4 h-4 object-contain dark:brightness-0 dark:invert transition-transform hover:scale-110"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1E2D]"></span>
            </span>
          </button>

          {/* User Auth Profile / Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-[#16151f] border border-neutral-300 dark:border-[#392e4e] rounded-full px-3 py-1.5 shadow-sm dark:shadow-md">
              <Link to="/orders" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 rounded-full bg-[#FF1E2D] text-white flex items-center justify-center text-[11px] font-bold font-sans shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-sans text-neutral-800 dark:text-neutral-200 hidden lg:inline max-w-[100px] truncate" title={user?.name || user?.email}>
                  {user?.name || 'Gamer'}
                </span>
              </Link>

              <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-0.5" />

              <Link
                to="/orders"
                className="text-neutral-500 dark:text-neutral-400 hover:text-[#FF1E2D] transition-colors p-1 cursor-pointer"
                title="Hardware Orders"
                aria-label="Hardware Orders"
              >
                <Package className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/account/transactions"
                className="text-neutral-500 dark:text-neutral-400 hover:text-[#FF1E2D] transition-colors p-1 cursor-pointer"
                title="Transactions & Billing"
                aria-label="Transactions & Billing"
              >
                <CreditCard className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => logout()}
                className="text-neutral-500 dark:text-neutral-400 hover:text-[#FF1E2D] transition-colors p-1 cursor-pointer"
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
                <button className="h-full w-full cursor-pointer rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-widest text-white flex items-center gap-1.5 transition-all duration-100 active:scale-98 shadow-sm">
                  <LogIn className="w-3.5 h-3.5 text-[#FF1E2D]" />
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
                className="relative flex items-center justify-center p-2.5 rounded-full bg-[#FF1E2D] hover:bg-[#FF3B48] text-white transition-all cursor-pointer shrink-0"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FF1E2D] shadow-md">
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
