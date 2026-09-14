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
    id: 'syne',
    label: 'Syne',
    family: '"Syne", sans-serif',
    category: 'sans',
    description: 'Primary UI and body font for CartVerse.',
    bestFor: 'all',
  },
  {
    id: 'archivo-black',
    label: 'Archivo Black',
    family: '"Archivo Black", sans-serif',
    category: 'display',
    description: 'Technical brutalist display font for headings and banners.',
    bestFor: 'heading',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: 'Merriweather, Georgia, serif',
    category: 'display',
    description: 'Editorial serif font strictly reserved for the About Us page.',
    bestFor: 'heading',
  },
];

const DEFAULT_SETTINGS: FontSettings = {
  headingFontId: 'archivo-black',
  bodyFontId: 'syne',
};

interface FontContextType {
  settings: FontSettings;
  activeHeadingFont: FontOption;
  activeBodyFont: FontOption;
  availableFonts: FontOption[];
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const syneFont = AVAILABLE_FONTS[0];
const archivoBlackFont = AVAILABLE_FONTS[1];

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<FontContextType>(
    () => ({
      settings: DEFAULT_SETTINGS,
      activeHeadingFont: archivoBlackFont,
      activeBodyFont: syneFont,
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
