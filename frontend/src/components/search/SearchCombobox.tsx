import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight, Sparkles, Tag, Layers } from 'lucide-react';
import { suggestQueries, SuggestResponse } from '../../api/searchApi';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency } from '../../utils/formatters';

interface SearchComboboxProps {
  placeholder?: string;
  className?: string;
  onSelect?: () => void;
  autoFocus?: boolean;
}

export const SearchCombobox: React.FC<SearchComboboxProps> = ({
  placeholder = 'Search PC parts, GPUs, CPUs...',
  className = '',
  onSelect,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  // Focus on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 250ms Debounced Suggestion Fetching with In-Flight Cancellation
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const data = await suggestQueries(trimmed, controller.signal);
        setSuggestions(data);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('[SearchCombobox] Suggestion error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Flat list of selectable items for keyboard navigation
  const selectableItems = React.useMemo(() => {
    if (!suggestions) return [];
    const items: Array<{ type: 'product' | 'category' | 'brand' | 'popular'; data: any }> = [];

    (suggestions.products || []).forEach((p) => items.push({ type: 'product', data: p }));
    (suggestions.categories || []).forEach((c) => items.push({ type: 'category', data: c }));
    (suggestions.brands || []).forEach((b) => items.push({ type: 'brand', data: b }));
    (suggestions.popular || []).forEach((pop) => items.push({ type: 'popular', data: pop }));

    return items;
  }, [suggestions]);

  const handleExecuteSearch = useCallback((searchTerm: string) => {
    const term = searchTerm.trim();
    if (term) {
      setIsOpen(false);
      onSelect?.();
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  }, [navigate, onSelect]);

  const handleSelectProduct = useCallback((productId: string) => {
    setIsOpen(false);
    onSelect?.();
    navigate(`/product/${productId}`);
  }, [navigate, onSelect]);

  const handleSelectCategory = useCallback((category: string) => {
    setIsOpen(false);
    onSelect?.();
    navigate(`/search?category=${encodeURIComponent(category)}`);
  }, [navigate, onSelect]);

  const handleSelectBrand = useCallback((brand: string) => {
    setIsOpen(false);
    onSelect?.();
    navigate(`/search?brand=${encodeURIComponent(brand)}`);
  }, [navigate, onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (selectableItems.length > 0) {
        setActiveIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen && selectableItems.length > 0) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && activeIndex < selectableItems.length) {
        const item = selectableItems[activeIndex];
        if (item.type === 'product') handleSelectProduct(item.data.id);
        else if (item.type === 'category') handleSelectCategory(item.data);
        else if (item.type === 'brand') handleSelectBrand(item.data);
        else if (item.type === 'popular') handleExecuteSearch(item.data);
      } else {
        handleExecuteSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const hasSuggestions =
    suggestions &&
    ((suggestions.products && suggestions.products.length > 0) ||
      (suggestions.categories && suggestions.categories.length > 0) ||
      (suggestions.brands && suggestions.brands.length > 0) ||
      (suggestions.popular && suggestions.popular.length > 0));

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Combobox Search Input Bar */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="search-suggestions-popup"
        className="relative flex items-center w-full"
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FF1E2D]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-option-${activeIndex}` : undefined}
          className="w-full pl-10 pr-16 py-2 text-sm rounded-full bg-neutral-100 dark:bg-[#16151f] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-300/80 dark:border-[#392e4e] focus:outline-none focus:ring-2 focus:ring-[#FF1E2D]/50 focus:border-[#FF1E2D] shadow-xs transition-all"
        />

        {/* Shortcut Hint Badge */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-200/70 dark:bg-[#201d2d] rounded border border-neutral-300 dark:border-neutral-700">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Grouped Suggestions Dropdown */}
      {isOpen && (
        <div
          id="search-suggestions-popup"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111018] border border-neutral-200 dark:border-[#2d253d] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto"
        >
          {hasSuggestions ? (
            <div className="p-3 space-y-4">
              {/* Category & Brand Pills */}
              {((suggestions.categories && suggestions.categories.length > 0) ||
                (suggestions.brands && suggestions.brands.length > 0)) && (
                <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                    Categories & Brands
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.categories?.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-[#1b1827] hover:bg-[#FF1E2D]/10 hover:text-[#FF1E2D] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer border border-neutral-200 dark:border-[#2d253d]"
                      >
                        <Layers className="w-3 h-3 text-neutral-400" />
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                    {suggestions.brands?.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleSelectBrand(brand)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-[#1b1827] hover:bg-[#FF1E2D]/10 hover:text-[#FF1E2D] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer border border-neutral-200 dark:border-[#2d253d]"
                      >
                        <Tag className="w-3 h-3 text-neutral-400" />
                        <span>{brand}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products */}
              {suggestions.products && suggestions.products.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                    Matching Products
                  </div>
                  <div className="space-y-1">
                    {suggestions.products.map((p, idx) => {
                      const isSelected = activeIndex === idx;
                      return (
                        <div
                          key={p.id}
                          id={`suggestion-option-${idx}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectProduct(p.id)}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#FF1E2D]/10 text-[#FF1E2D]'
                              : 'hover:bg-neutral-100 dark:hover:bg-[#1b1827] text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-[#1e1c2b] p-1 shrink-0 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-800">
                              <img
                                src={getComponentImage(p.imageSlug, p.category)}
                                alt={p.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate leading-tight">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                                <span className="capitalize">{p.brand}</span>
                                <span>•</span>
                                <span className="capitalize">{p.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs font-bold text-[#FF1E2D] shrink-0 ml-3">
                            {formatCurrency(p.price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {suggestions.popular && suggestions.popular.length > 0 && (
                <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FF1E2D]" />
                    Popular Hardware Queries
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.popular.map((pop) => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => handleExecuteSearch(pop)}
                        className="text-xs px-2.5 py-1 rounded-md bg-neutral-50 dark:bg-[#181622] hover:bg-neutral-200 dark:hover:bg-[#252233] text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : query.trim() && !isLoading ? (
            <div className="py-6 px-4 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No instant suggestions for "{query}"
              </p>
              <button
                type="button"
                onClick={() => handleExecuteSearch(query)}
                className="mt-2 text-xs font-semibold text-[#FF1E2D] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Search all catalog items for "{query}" <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          {/* Footer CTA: View All Results */}
          {query.trim() && (
            <div className="p-2.5 bg-neutral-50 dark:bg-[#0c0b12] border-t border-neutral-200 dark:border-[#201c2c] flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Press <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">Enter</kbd> to search full catalog
              </span>
              <button
                type="button"
                onClick={() => handleExecuteSearch(query)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF1E2D] hover:bg-[#E5252A] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                View all results <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
