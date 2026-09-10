import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type FontCategory = 'display' | 'sans' | 'mono' | 'classic';

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  description: string;
  bestFor: 'heading' | 'body' | 'mono' | 'all';
}

export interface PresetPairing {
  id: string;
  name: string;
  tagline: string;
  headingFontId: string;
  bodyFontId: string;
  monoFontId: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  // Technical Brutalist & Display
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    family: "'Space Grotesk', 'Inter', sans-serif",
    category: 'display',
    description: 'Geometric grotesque with an engineered brutalist presence. Sharp at large hero sizes.',
    bestFor: 'heading',
  },
  {
    id: 'unbounded',
    label: 'Unbounded',
    family: "'Unbounded', sans-serif",
    category: 'display',
    description: 'Heavy mechanical geometric display with sharp modern terminal angles.',
    bestFor: 'heading',
  },
  {
    id: 'orbitron',
    label: 'Orbitron',
    family: "'Orbitron', sans-serif",
    category: 'display',
    description: 'Cybernetic futuristic display typeface with high-impact sci-fi geometry.',
    bestFor: 'heading',
  },
  {
    id: 'rajdhani',
    label: 'Rajdhani',
    family: "'Rajdhani', sans-serif",
    category: 'display',
    description: 'Condensed tactical technical typeface built for telemetry and dense headers.',
    bestFor: 'heading',
  },

  // Modern Technical Body & UI
  {
    id: 'geist',
    label: 'Geist',
    family: "'Geist', sans-serif",
    category: 'sans',
    description: 'Crisp, precision technical sans with ultra-clean rhythm and modern geometric balance.',
    bestFor: 'body',
  },
  {
    id: 'inter',
    label: 'Inter',
    family: "'Inter', system-ui, -apple-system, sans-serif",
    category: 'sans',
    description: 'Industry-standard UI typeface engineered for micro-legibility on computer screens.',
    bestFor: 'body',
  },
  {
    id: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    family: "'IBM Plex Sans', sans-serif",
    category: 'sans',
    description: 'Industrial documentation feel balancing neutral utility and human engineering.',
    bestFor: 'body',
  },

  // Monospace & Hardware Specs
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    category: 'mono',
    description: 'Developer-grade monospace with increased letter height and distinct 0/O distinction.',
    bestFor: 'mono',
  },
  {
    id: 'ibm-plex-mono',
    label: 'IBM Plex Mono',
    family: "'IBM Plex Mono', monospace",
    category: 'mono',
    description: 'Industrial mainframe monospace with distinctive zero slashed glyphs and high spec fidelity.',
    bestFor: 'mono',
  },
  {
    id: 'space-mono',
    label: 'Space Mono',
    family: "'Space Mono', monospace",
    category: 'mono',
    description: 'Retro-futuristic mechanical monospace ideal for telemetry counters and specs.',
    bestFor: 'mono',
  },

  // Classic Standard Typefaces
  {
    id: 'roboto',
    label: 'Roboto',
    family: "'Roboto', sans-serif",
    category: 'classic',
    description: 'Dual-nature sans with friendly curves and structured geometric skeleton.',
    bestFor: 'all',
  },
  {
    id: 'open-sans',
    label: 'Open Sans',
    family: "'Open Sans', sans-serif",
    category: 'classic',
    description: 'Neutral open sans-serif with upright stress and friendly open apertures.',
    bestFor: 'all',
  },
  {
    id: 'arial',
    label: 'Arial',
    family: "Arial, Helvetica, sans-serif",
    category: 'classic',
    description: 'Universal fallback sans-serif found natively on every desktop operating system.',
    bestFor: 'all',
  },
  {
    id: 'times',
    label: 'Times New Roman',
    family: "'Times New Roman', Times, serif",
    category: 'classic',
    description: 'Traditional editorial serif with sharp bracketed serifs and high stroke contrast.',
    bestFor: 'all',
  },
];

export const PRESET_PAIRINGS: PresetPairing[] = [
  {
    id: 'apex-brutalist',
    name: 'Apex Brutalist (Default)',
    tagline: 'Space Grotesk Headings + Inter UI + JetBrains Specs',
    headingFontId: 'space-grotesk',
    bodyFontId: 'inter',
    monoFontId: 'jetbrains-mono',
  },
  {
    id: 'cyber-engineering',
    name: 'Cybernetic Lab',
    tagline: 'Unbounded Headings + Geist UI + IBM Plex Mono',
    headingFontId: 'unbounded',
    bodyFontId: 'geist',
    monoFontId: 'ibm-plex-mono',
  },
  {
    id: 'industrial-hpc',
    name: 'Industrial Telemetry',
    tagline: 'Space Grotesk Headings + IBM Plex Sans + Space Mono',
    headingFontId: 'space-grotesk',
    bodyFontId: 'ibm-plex-sans',
    monoFontId: 'space-mono',
  },
  {
    id: 'tactical-datacenter',
    name: 'Tactical Datacenter',
    tagline: 'Rajdhani Headings + Geist UI + JetBrains Mono',
    headingFontId: 'rajdhani',
    bodyFontId: 'geist',
    monoFontId: 'jetbrains-mono',
  },
  {
    id: 'clean-standard',
    name: 'Classic Standard',
    tagline: 'Inter Headings + Roboto Body + JetBrains Specs',
    headingFontId: 'inter',
    bodyFontId: 'roboto',
    monoFontId: 'jetbrains-mono',
  },
];

export interface FontSettings {
  isPairedMode: boolean;
  globalFontId: string;
  headingFontId: string;
  bodyFontId: string;
  monoFontId: string;
}

const DEFAULT_SETTINGS: FontSettings = {
  isPairedMode: true,
  globalFontId: 'inter',
  headingFontId: 'space-grotesk',
  bodyFontId: 'inter',
  monoFontId: 'jetbrains-mono',
};

const FONT_STORAGE_KEY = 'cartverse-font-settings';

interface FontContextType {
  settings: FontSettings;
  activeHeadingFont: FontOption;
  activeBodyFont: FontOption;
  activeMonoFont: FontOption;
  setGlobalFont: (fontId: string) => void;
  setHeadingFont: (fontId: string) => void;
  setBodyFont: (fontId: string) => void;
  setMonoFont: (fontId: string) => void;
  setPairedMode: (enabled: boolean) => void;
  applyPreset: (presetId: string) => void;
  resetToDefault: () => void;
  availableFonts: FontOption[];
  presets: PresetPairing[];
}

const FontContext = createContext<FontContextType | undefined>(undefined);

function getSafeFont(id: string, fallbackId: string): FontOption {
  const found = AVAILABLE_FONTS.find((f) => f.id === id);
  if (found) return found;
  const fallback = AVAILABLE_FONTS.find((f) => f.id === fallbackId);
  return fallback || AVAILABLE_FONTS[0];
}

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FontSettings>(() => {
    try {
      const stored = localStorage.getItem(FONT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          isPairedMode: typeof parsed.isPairedMode === 'boolean' ? parsed.isPairedMode : true,
          globalFontId: getSafeFont(parsed.globalFontId, DEFAULT_SETTINGS.globalFontId).id,
          headingFontId: getSafeFont(parsed.headingFontId, DEFAULT_SETTINGS.headingFontId).id,
          bodyFontId: getSafeFont(parsed.bodyFontId, DEFAULT_SETTINGS.bodyFontId).id,
          monoFontId: getSafeFont(parsed.monoFontId, DEFAULT_SETTINGS.monoFontId).id,
        };
      }
    } catch (e) {
      console.warn('Could not read font settings from localStorage, using defaults', e);
    }
    return DEFAULT_SETTINGS;
  });

  const activeHeadingFont = useMemo(
    () => getSafeFont(settings.isPairedMode ? settings.headingFontId : settings.globalFontId, 'space-grotesk'),
    [settings.isPairedMode, settings.headingFontId, settings.globalFontId]
  );

  const activeBodyFont = useMemo(
    () => getSafeFont(settings.isPairedMode ? settings.bodyFontId : settings.globalFontId, 'inter'),
    [settings.isPairedMode, settings.bodyFontId, settings.globalFontId]
  );

  const activeMonoFont = useMemo(
    () => getSafeFont(settings.monoFontId, 'jetbrains-mono'),
    [settings.monoFontId]
  );

  // Apply CSS custom properties to document root dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-font-family', activeBodyFont.family);
    root.style.setProperty('--app-font-heading', activeHeadingFont.family);
    root.style.setProperty('--app-font-mono', activeMonoFont.family);

    try {
      localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors in sandbox
    }
  }, [settings, activeBodyFont, activeHeadingFont, activeMonoFont]);

  const setGlobalFont = useCallback((fontId: string) => {
    const safe = getSafeFont(fontId, DEFAULT_SETTINGS.globalFontId);
    setSettings((prev) => ({
      ...prev,
      isPairedMode: false,
      globalFontId: safe.id,
      bodyFontId: safe.id,
      headingFontId: safe.id,
    }));
  }, []);

  const setHeadingFont = useCallback((fontId: string) => {
    const safe = getSafeFont(fontId, DEFAULT_SETTINGS.headingFontId);
    setSettings((prev) => ({
      ...prev,
      headingFontId: safe.id,
    }));
  }, []);

  const setBodyFont = useCallback((fontId: string) => {
    const safe = getSafeFont(fontId, DEFAULT_SETTINGS.bodyFontId);
    setSettings((prev) => ({
      ...prev,
      bodyFontId: safe.id,
    }));
  }, []);

  const setMonoFont = useCallback((fontId: string) => {
    const safe = getSafeFont(fontId, DEFAULT_SETTINGS.monoFontId);
    setSettings((prev) => ({
      ...prev,
      monoFontId: safe.id,
    }));
  }, []);

  const setPairedMode = useCallback((enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      isPairedMode: enabled,
    }));
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESET_PAIRINGS.find((p) => p.id === presetId);
    if (!preset) return;
    setSettings({
      isPairedMode: true,
      globalFontId: preset.bodyFontId,
      headingFontId: preset.headingFontId,
      bodyFontId: preset.bodyFontId,
      monoFontId: preset.monoFontId,
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      activeHeadingFont,
      activeBodyFont,
      activeMonoFont,
      setGlobalFont,
      setHeadingFont,
      setBodyFont,
      setMonoFont,
      setPairedMode,
      applyPreset,
      resetToDefault,
      availableFonts: AVAILABLE_FONTS,
      presets: PRESET_PAIRINGS,
    }),
    [
      settings,
      activeHeadingFont,
      activeBodyFont,
      activeMonoFont,
      setGlobalFont,
      setHeadingFont,
      setBodyFont,
      setMonoFont,
      setPairedMode,
      applyPreset,
      resetToDefault,
    ]
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
