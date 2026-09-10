import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from '../../context/ThemeContext';

export const defaultProperties = {
  dark: {
    circle: {
      r: 9,
    },
    mask: {
      cx: '50%',
      cy: '23%',
    },
    svg: {
      transform: 'rotate(40deg)',
    },
    lines: {
      opacity: 0,
    },
  },
  light: {
    circle: {
      r: 5,
    },
    mask: {
      cx: '100%',
      cy: '0%',
    },
    svg: {
      transform: 'rotate(90deg)',
    },
    lines: {
      opacity: 1,
    },
  },
  springConfig: { mass: 4, tension: 250, friction: 35 },
};

export interface ThemeSwitcherProps {
  size?: number;
  className?: string;
  showTooltip?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  size = 20,
  className = '',
  showTooltip = true,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div
      className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
        isDarkMode
          ? 'bg-[#16151f] hover:bg-[#221f2f] border border-[#392e4e] hover:border-red-500/50 text-neutral-100'
          : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 hover:border-red-500/50 text-neutral-900'
      } ${className}`}
      title={showTooltip ? (isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme') : undefined}
      aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <DarkModeSwitch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={size}
        animationProperties={defaultProperties}
        moonColor="#F8FAFC"
        sunColor="#F59E0B"
        aria-label="Toggle White and Dark theme"
      />
    </div>
  );
};

export default ThemeSwitcher;
