import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: (checked?: boolean) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'cartverse-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
    // Default to dark mode for CartVerse gaming hardware aesthetic
    return 'dark';
  });

  const isDarkMode = theme === 'dark';

  const applyTheme = useCallback((currentTheme: Theme) => {
    const root = document.documentElement;
    const isDark = currentTheme === 'dark';

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleDarkMode = useCallback((checked?: boolean) => {
    setThemeState((prev) => {
      if (typeof checked === 'boolean') {
        return checked ? 'dark' : 'light';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      toggleDarkMode,
      setTheme,
    }),
    [theme, isDarkMode, toggleDarkMode, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
