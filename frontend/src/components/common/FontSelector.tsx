import React, { useState, useRef, useEffect } from 'react';
import { useFont, Font } from '../font-provider';
import { Type, Check, ChevronDown } from 'lucide-react';

const availableFonts: { name: Font; label: string; previewFont: string }[] = [
  { name: 'Inter', label: 'Inter (Default Modern)', previewFont: "'Inter', sans-serif" },
  { name: 'Roboto', label: 'Roboto (Google Clean)', previewFont: "'Roboto', sans-serif" },
  { name: 'Open Sans', label: 'Open Sans (Neutral)', previewFont: "'Open Sans', sans-serif" },
  { name: 'Arial', label: 'Arial (Standard Sans)', previewFont: "Arial, sans-serif" },
  { name: 'Times New Roman', label: 'Times New Roman (Serif)', previewFont: "'Times New Roman', serif" },
  { name: 'JetBrains Mono', label: 'JetBrains Mono (Code)', previewFont: "'JetBrains Mono', monospace" },
];

export const FontSelector: React.FC = () => {
  const { font, setFont } = useFont();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all cursor-pointer shadow-sm"
        title="Change Website Font Family"
      >
        <Type className="w-3.5 h-3.5 text-red-500" />
        <span className="truncate max-w-[90px]">{font}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-950/95 border border-neutral-800 shadow-2xl backdrop-blur-xl z-50 p-1.5 space-y-1">
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-850">
            Website Font Family
          </div>
          {availableFonts.map((f) => (
            <button
              key={f.name}
              onClick={() => {
                setFont(f.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-all cursor-pointer ${
                font === f.name
                  ? 'bg-red-600/10 text-red-400 font-bold border border-red-500/30'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
              style={{ fontFamily: f.previewFont }}
            >
              <span className="truncate">{f.label}</span>
              {font === f.name && <Check className="w-3.5 h-3.5 text-red-500 shrink-0 ml-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontSelector;
