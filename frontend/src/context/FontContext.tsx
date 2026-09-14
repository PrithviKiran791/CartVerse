/**
 * FontContext — simplified to CartVerse typography system.
 * Inter Tight is the single primary font. Merriweather is available
 * for display/editorial headings only. No runtime font-switching.
 */
import React, { createContext, useContext, useMemo } from 'react';

export type FontCategory = 'display' | 'sans';

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  description: string;
  bestFor: 'heading' | 'body' | 'all';
}

export interface FontSettings {
  headingFontId: string;
  bodyFontId: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'inter-tight',
    label: 'Inter Tight',
    family: '"Inter Tight", Inter, system-ui, sans-serif',
    category: 'sans',
    description: 'Primary UI font for all CartVerse interfaces.',
    bestFor: 'all',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: 'Merriweather, Georgia, serif',
    category: 'display',
    description: 'Editorial/display font for hero headings and promotional content.',
    bestFor: 'heading',
  },
];

const DEFAULT_SETTINGS: FontSettings = {
  headingFontId: 'inter-tight',
  bodyFontId: 'inter-tight',
};

interface FontContextType {
  settings: FontSettings;
  activeHeadingFont: FontOption;
  activeBodyFont: FontOption;
  availableFonts: FontOption[];
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const interTight = AVAILABLE_FONTS[0];

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<FontContextType>(
    () => ({
      settings: DEFAULT_SETTINGS,
      activeHeadingFont: interTight,
      activeBodyFont: interTight,
      availableFonts: AVAILABLE_FONTS,
    }),
    []
  );

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export default FontProvider;
