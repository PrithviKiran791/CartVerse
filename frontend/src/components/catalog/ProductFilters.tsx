import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Check, X, RotateCcw, Cpu, Zap, Tv, Cable, Droplets } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ProductFiltersProps {
  category: string;
  subType?: string;
  brand?: string;
  onClearAll?: () => void;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  category,
  subType,
  brand,
  onClearAll,
  className = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from URL params
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 300000;
  const selectedSockets = searchParams.getAll('socket');
  const selectedCores = searchParams.getAll('cores').map(Number);
  const selectedVram = searchParams.getAll('vram');
  const selectedRamTypes = searchParams.getAll('ramType');
  const selectedCapacities = searchParams.getAll('capacity');
  const selectedResolutions = searchParams.getAll('resolution');
  const selectedPanels = searchParams.getAll('panel');
  const selectedBrands = searchParams.getAll('brand');
  const inStockOnly = searchParams.get('inStock') === 'true';


  // Helper to toggle a param in URL
  const toggleArrayParam = (key: string, value: string | number) => {
    const stringVal = String(value);
    const existing = searchParams.getAll(key);
    const updatedParams = new URLSearchParams(searchParams);

    if (existing.includes(stringVal)) {
      // Remove
      updatedParams.delete(key);
      existing.filter((v) => v !== stringVal).forEach((v) => updatedParams.append(key, v));
    } else {
      // Add
      updatedParams.append(key, stringVal);
    }
    setSearchParams(updatedParams);
  };

  const handlePriceChange = (min: number, max: number) => {
    const updated = new URLSearchParams(searchParams);
    if (min > 0) updated.set('minPrice', String(min));
    else updated.delete('minPrice');

    if (max < 300000) updated.set('maxPrice', String(max));
    else updated.delete('maxPrice');

    setSearchParams(updated);
  };

  const handleInStockToggle = () => {
    const updated = new URLSearchParams(searchParams);
    if (inStockOnly) {
      updated.delete('inStock');
    } else {
      updated.set('inStock', 'true');
    }
    setSearchParams(updated);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    if (onClearAll) onClearAll();
  };

  const hasActiveFilters =
    minPrice > 0 ||
    maxPrice < 300000 ||
    selectedSockets.length > 0 ||
    selectedCores.length > 0 ||
    selectedVram.length > 0 ||
    selectedRamTypes.length > 0 ||
    selectedCapacities.length > 0 ||
    selectedResolutions.length > 0 ||
    selectedPanels.length > 0 ||
    selectedBrands.length > 0 ||
    inStockOnly;


  return (
    <div className={`space-y-5 ${className}`}>
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
          <span>// SPEC_FILTERS</span>
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase tracking-widest flex items-center gap-1 cursor-pointer font-bold underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>[RESET]</span>
          </button>
        )}
      </div>

      {/* CPU SPECIFIC FILTERS */}
      {category === 'cpu' && (
        <>
          {/* Socket Filter */}
          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // SOCKET
            </span>
            <div className="space-y-1.5">
              {(brand === 'Intel'
                ? ['LGA1851', 'LGA1700', 'LGA1200']
                : brand === 'AMD'
                ? ['AM5', 'AM4']
                : ['AM5', 'AM4', 'LGA1851', 'LGA1700']
              ).map((sock) => {
                const isSelected = selectedSockets.includes(sock);
                return (
                  <label
                    key={sock}
                    className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleArrayParam('socket', sock)}
                      className="rounded-none bg-neutral-900 border-2 border-neutral-700 text-red-600 focus:ring-0"
                    />
                    <span>{sock}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cores Filter */}
          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // CORE_COUNT
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[6, 8, 12, 16, 24].map((cores) => {
                const isSelected = selectedCores.includes(cores);
                return (
                  <button
                    key={cores}
                    type="button"
                    onClick={() => toggleArrayParam('cores', cores)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-none text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-red-950 border-red-600 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {cores} CORES
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* GPU SPECIFIC FILTERS */}
      {category === 'gpu' && (
        <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
            // VRAM_CAPACITY
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {['8GB', '12GB', '16GB', '24GB'].map((vram) => {
              const isSelected = selectedVram.includes(vram);
              return (
                <button
                  key={vram}
                  type="button"
                  onClick={() => toggleArrayParam('vram', vram)}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-none text-center transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-600 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {vram}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MEMORY SPECIFIC FILTERS */}
      {category === 'ram' && (
        <>
          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // DDR_GENERATION
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['DDR5', 'DDR4'].map((type) => {
                const isSelected = selectedRamTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleArrayParam('ramType', type)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-none text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-red-950 border-red-600 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // KIT_CAPACITY
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['8GB', '16GB', '32GB', '64GB'].map((cap) => {
                const isSelected = selectedCapacities.includes(cap);
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleArrayParam('capacity', cap)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-none text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-red-950 border-red-600 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* DISPLAYS SPECIFIC FILTERS */}
      {category === 'monitor' && (
        <>
          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // RESOLUTION
            </span>
            <div className="space-y-1.5">
              {['4K', '1440p', '1080p'].map((res) => {
                const isSelected = selectedResolutions.includes(res);
                return (
                  <label
                    key={res}
                    className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleArrayParam('resolution', res)}
                      className="rounded-none bg-neutral-900 border-2 border-neutral-700 text-red-600 focus:ring-0"
                    />
                    <span>{res}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              // PANEL_TYPE
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['OLED', 'IPS', 'VA'].map((p) => {
                const isSelected = selectedPanels.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleArrayParam('panel', p)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-none text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-indigo-950 border-indigo-600 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* SIMULATOR SPECIFIC FILTERS */}
      {category === 'simulator' && (
        <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
            // SIMULATOR_BRANDS
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {[
              'Logitech G',
              'Thrustmaster',
              'Moza Racing',
              'Fanatec',
              'Simagic',
              'Simucube',
              'Asetek',
              'Heusinkveld',
              'Next Level Racing',
              'Playseat',
              'Trak Racer',
              'Sim-Lab',
            ].map((b) => {
              const isSelected = selectedBrands.includes(b);
              return (
                <label
                  key={b}
                  className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleArrayParam('brand', b)}
                    className="rounded-none bg-neutral-900 border-2 border-neutral-700 text-red-600 focus:ring-0"
                  />
                  <span>{b}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* PRICE RANGE FILTER */}
      <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 space-y-3 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
        <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase text-neutral-300">
          <span>// PRICE_RANGE</span>
          <span className="text-red-400 font-bold">
            [{formatCurrency(maxPrice)}]
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={300000}
          step={1000}
          value={maxPrice}
          onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
          className="w-full accent-red-600 cursor-pointer h-1.5 bg-neutral-800 rounded-none appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
          <span>₹500</span>
          <span>₹3,00,000+</span>
        </div>
      </div>

      {/* IN STOCK ONLY TOGGLE */}
      {category !== 'simulator' && (
        <div className="border-2 border-neutral-800 dark:border-neutral-700 bg-[#0E0C12] rounded-none p-3.5 flex items-center justify-between shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
            // IN_STOCK_ONLY
          </span>
          <button
            type="button"
            onClick={handleInStockToggle}
            className={`w-10 h-5 flex items-center rounded-none p-0.5 border-2 border-neutral-800 transition-colors cursor-pointer ${
              inStockOnly ? 'bg-red-600 border-neutral-900 dark:border-white shadow-[2px_2px_0px_0px_#000000]' : 'bg-neutral-900'
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-none shadow-md transform transition-transform ${
                inStockOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
