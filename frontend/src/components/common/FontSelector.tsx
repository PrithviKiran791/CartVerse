import React, { useState, useRef, useEffect } from 'react';
import { Type, Sparkles, Check, RotateCcw, X, Layers, Heading, FileText, Binary } from 'lucide-react';
import { useFont, FontOption, PRESET_PAIRINGS } from '../../context/FontContext';
import { useTheme } from '../../context/ThemeContext';

type Tab = 'presets' | 'display' | 'sans' | 'mono' | 'all';

export const FontSelector: React.FC = () => {
  const {
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
    availableFonts,
    presets,
  } = useFont();

  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('presets');
  const [targetSlot, setTargetSlot] = useState<'heading' | 'body' | 'mono'>('heading');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredFonts = availableFonts.filter((f) => {
    if (activeTab === 'presets') return true;
    if (activeTab === 'all') return true;
    if (activeTab === 'display') return f.category === 'display';
    if (activeTab === 'sans') return f.category === 'sans' || (f.category === 'classic' && f.id !== 'times');
    if (activeTab === 'mono') return f.category === 'mono';
    return true;
  });

  const handleSelectFont = (font: FontOption) => {
    if (!settings.isPairedMode) {
      setGlobalFont(font.id);
      return;
    }

    if (targetSlot === 'heading') {
      setHeadingFont(font.id);
    } else if (targetSlot === 'body') {
      setBodyFont(font.id);
    } else {
      setMonoFont(font.id);
    }
  };

  const isFontActiveForCurrentSlot = (font: FontOption): boolean => {
    if (!settings.isPairedMode) {
      return settings.globalFontId === font.id;
    }
    if (targetSlot === 'heading') return settings.headingFontId === font.id;
    if (targetSlot === 'body') return settings.bodyFontId === font.id;
    return settings.monoFontId === font.id;
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm relative ${
          isOpen
            ? 'bg-red-500/15 border-red-500 text-red-500 ring-2 ring-red-500/20'
            : isDarkMode
            ? 'bg-[#16151f] hover:bg-[#221f2f] border border-[#392e4e] hover:border-red-500/50 text-neutral-100'
            : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 hover:border-red-500/50 text-neutral-900'
        }`}
        title={`Typography Engine: ${activeHeadingFont.label} / ${activeBodyFont.label}`}
        aria-label="Typography Engine and Font Switcher"
      >
        <Type className="w-5 h-5 transition-transform hover:scale-110" />
        <span className="sr-only">Toggle Typography Engine</span>

        {/* Small Active Dot */}
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-neutral-950" />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[380px] sm:w-[440px] max-w-[95vw] rounded-2xl bg-white dark:bg-[#0E0E12] border border-neutral-300 dark:border-neutral-800 shadow-2xl z-50 overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Typography Engine
                </h3>
              </div>
              <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                Technical Brutalist Typefaces &amp; Pairings
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetToDefault}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Reset to Default Typefaces"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher: Paired vs Unified */}
          <div className="px-4 py-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400">
              Engine Configuration
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-0.5 rounded-xl text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setPairedMode(true)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  settings.isPairedMode
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Paired Engine
              </button>
              <button
                type="button"
                onClick={() => setPairedMode(false)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  !settings.isPairedMode
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Single Unified
              </button>
            </div>
          </div>

          {/* If in Paired Mode: Target Slot Picker */}
          {settings.isPairedMode && activeTab !== 'presets' && (
            <div className="px-4 py-2 bg-neutral-50 dark:bg-black/40 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Customizing:</span>
              <div className="flex items-center gap-1.5 flex-1">
                <button
                  type="button"
                  onClick={() => setTargetSlot('heading')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 border transition-all ${
                    targetSlot === 'heading'
                      ? 'bg-red-950/80 border-red-700 text-red-300'
                      : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-white'
                  }`}
                >
                  <Heading className="w-3 h-3" />
                  <span>Headings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSlot('body')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 border transition-all ${
                    targetSlot === 'body'
                      ? 'bg-red-950/80 border-red-700 text-red-300'
                      : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Body &amp; UI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSlot('mono')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 border transition-all ${
                    targetSlot === 'mono'
                      ? 'bg-red-950/80 border-red-700 text-red-300'
                      : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-white'
                  }`}
                >
                  <Binary className="w-3 h-3" />
                  <span>Specs &amp; Code</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="px-4 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono font-semibold">
            {[
              { id: 'presets', label: 'Presets', icon: Sparkles },
              { id: 'display', label: 'Display', icon: Heading },
              { id: 'sans', label: 'Body UI', icon: FileText },
              { id: 'mono', label: 'Monospace', icon: Binary },
              { id: 'all', label: 'All Fonts', icon: Layers },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as Tab)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                    activeTab === t.id
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-red-600 dark:text-red-400 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="p-3 max-h-[320px] overflow-y-auto space-y-2 select-none">
            {/* Presets View */}
            {activeTab === 'presets' ? (
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-neutral-500 uppercase px-1">
                  Engineered Pairings
                </div>
                {presets.map((preset) => {
                  const heading = availableFonts.find((f) => f.id === preset.headingFontId);
                  const body = availableFonts.find((f) => f.id === preset.bodyFontId);
                  const mono = availableFonts.find((f) => f.id === preset.monoFontId);

                  const isActive =
                    settings.isPairedMode &&
                    settings.headingFontId === preset.headingFontId &&
                    settings.bodyFontId === preset.bodyFontId &&
                    settings.monoFontId === preset.monoFontId;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-950/40 border-red-600 ring-1 ring-red-500/50'
                          : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight"
                          style={{ fontFamily: heading?.family }}
                        >
                          {preset.name}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <p
                        className="text-xs text-neutral-600 dark:text-neutral-300 mb-2 leading-relaxed"
                        style={{ fontFamily: body?.family }}
                      >
                        Next-Gen PC Hardware &amp; Enterprise Supercomputing Fabric
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="bg-neutral-200 dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                          H: {heading?.label}
                        </span>
                        <span className="bg-neutral-200 dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                          B: {body?.label}
                        </span>
                        <span className="bg-neutral-200 dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                          M: {mono?.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Font List with In-Place Previews */
              <div className="space-y-1.5">
                {filteredFonts.map((font) => {
                  const isSelected = isFontActiveForCurrentSlot(font);

                  return (
                    <div
                      key={font.id}
                      onClick={() => handleSelectFont(font)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-red-950/40 border-red-600 ring-1 ring-red-500/40'
                          : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-red-500/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {/* Live In-Place Typeface Label */}
                          <span
                            className="text-base font-bold text-neutral-900 dark:text-white tracking-tight"
                            style={{ fontFamily: font.family }}
                          >
                            {font.label}
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-neutral-200 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-800 shrink-0">
                            {font.category}
                          </span>
                        </div>

                        {/* Live Sample Phrase in this exact font */}
                        <div
                          className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5"
                          style={{ fontFamily: font.family }}
                        >
                          Apex Performance Studio &amp; Hardware Telemetry (0-9)
                        </div>

                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1">
                          {font.description}
                        </p>
                      </div>

                      {/* Selection Status */}
                      <div className="shrink-0 flex items-center">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 group-hover:border-red-500 flex items-center justify-center transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Live Composite Preview */}
          <div className="p-3 bg-neutral-100/90 dark:bg-black/90 border-t border-neutral-200 dark:border-neutral-800/90">
            <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex justify-between">
              <span>Live System Composite Preview</span>
              <span className="text-red-500 font-bold">
                {settings.isPairedMode ? 'PAIRED ENGINE' : 'SINGLE UNIFIED'}
              </span>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800/80 shadow-inner space-y-1">
              <div
                className="text-sm font-black tracking-tight text-neutral-900 dark:text-white uppercase truncate"
                style={{ fontFamily: activeHeadingFont.family }}
              >
                CARTVERSE // {activeHeadingFont.label}
              </div>
              <p
                className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-snug"
                style={{ fontFamily: activeBodyFont.family }}
              >
                Engineered with high-density GPU nodes and ECC RDIMM memory.
              </p>
              <div
                className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-900"
                style={{ fontFamily: activeMonoFont.family }}
              >
                <span>SPEC: 256 CORES / 8TB DDR5</span>
                <span className="text-emerald-500 font-bold">₹5,450,000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
