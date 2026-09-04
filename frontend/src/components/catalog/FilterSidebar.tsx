import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FilterState, ComponentCategory, CPUSocket, RAMType } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import LineSidebar from '../common/LineSidebar';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, totalCount }) => {
  const categories: { id: ComponentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'cpu', label: 'Processors (CPU)' },
    { id: 'gpu', label: 'Graphics Cards (GPU)' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'ram', label: 'Memory (RAM)' },
    { id: 'ssd', label: 'Solid State Drives (SSD)' },
    { id: 'hdd', label: 'Hard Drives (HDD)' },
    { id: 'cabinet', label: 'PC Cabinets' },
    { id: 'psu', label: 'Power Supplies (PSU)' },
    { id: 'monitor', label: 'Gaming Monitors' },
    { id: 'keyboard', label: 'Keyboards' },
    { id: 'mouse', label: 'Mice' },
    { id: 'headphones', label: 'Headphones & Audio' },
    { id: 'controller', label: 'Controllers' },
    { id: 'cables', label: 'Cables & Accessories' },
    { id: 'prebuilt', label: 'Pre-Built Rigs' },
  ];

  const sockets: CPUSocket[] = ['AM4', 'AM5', 'LGA1700', 'LGA1851'];
  const ramTypes: RAMType[] = ['DDR4', 'DDR5'];
  const resolutions = ['1920x1080', '2560x1440', '3840x2160'];
  const refreshRates = [144, 180, 240, 360];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], val],
    }));
  };

  const toggleSocket = (sock: CPUSocket) => {
    setFilters((prev) => ({
      ...prev,
      sockets: prev.sockets.includes(sock)
        ? prev.sockets.filter((s) => s !== sock)
        : [...prev.sockets, sock],
    }));
  };

  const toggleRamType = (rt: RAMType) => {
    setFilters((prev) => ({
      ...prev,
      ramTypes: prev.ramTypes.includes(rt)
        ? prev.ramTypes.filter((r) => r !== rt)
        : [...prev.ramTypes, rt],
    }));
  };

  const toggleResolution = (res: string) => {
    setFilters((prev) => ({
      ...prev,
      resolutions: prev.resolutions.includes(res)
        ? prev.resolutions.filter((r) => r !== res)
        : [...prev.resolutions, res],
    }));
  };

  const toggleRefreshRate = (hz: number) => {
    setFilters((prev) => ({
      ...prev,
      refreshRates: prev.refreshRates.includes(hz)
        ? prev.refreshRates.filter((h) => h !== hz)
        : [...prev.refreshRates, hz],
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      brands: [],
      priceRange: [500, 250000],
      sockets: [],
      ramTypes: [],
      resolutions: [],
      refreshRates: [],
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <aside className="w-full lg:w-72 bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-5 space-y-6 shrink-0 backdrop-blur-md self-start sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Faceted Filters</h3>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors font-mono cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Component Category with LineSidebar Animation */}
      <div>
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
          Component Category
        </label>
        <div className="max-h-72 overflow-y-auto pr-1 scrollbar-thin overflow-x-hidden pt-1">
          <LineSidebar
            items={categories.map((c) => c.label)}
            accentColor="#e31b23"
            textColor="#a1a1aa"
            markerColor="#52525b"
            showIndex={true}
            showMarker={true}
            proximityRadius={90}
            maxShift={18}
            falloff="smooth"
            markerLength={30}
            markerGap={0}
            tickScale={0.5}
            scaleTick={true}
            itemGap={10}
            fontSize={0.8}
            smoothing={100}
            defaultActive={Math.max(0, categories.findIndex((c) => c.id === filters.category))}
            onItemClick={(index: number) => {
              const selectedCat = categories[index];
              if (selectedCat) {
                setFilters((prev) => ({ ...prev, category: selectedCat.id }));
              }
            }}
          />
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-xs font-mono font-bold text-red-400">
            Up to {formatCurrency(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="250000"
          step="2500"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-red-600 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
          <span>₹500</span>
          <span>₹1,25,000</span>
          <span>₹2,50,000+</span>
        </div>
      </div>

      {/* Hardware Socket Pills */}
      <div>
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
          CPU Socket Match
        </label>
        <div className="flex flex-wrap gap-1.5">
          {sockets.map((sock) => {
            const active = filters.sockets.includes(sock);
            return (
              <button
                key={sock}
                onClick={() => toggleSocket(sock)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  active
                    ? 'bg-red-950/70 border-red-500 text-red-400 font-bold'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                }`}
              >
                {sock}
              </button>
            );
          })}
        </div>
      </div>

      {/* RAM Generation Pills */}
      <div>
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
          Memory Generation
        </label>
        <div className="flex gap-2">
          {ramTypes.map((rt) => {
            const active = filters.ramTypes.includes(rt);
            return (
              <button
                key={rt}
                onClick={() => toggleRamType(rt)}
                className={`flex-1 text-xs font-mono py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-red-950/70 border-red-500 text-red-400 font-bold'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                }`}
              >
                {rt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitor Resolution Pills */}
      <div>
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
          Display Resolution
        </label>
        <div className="flex flex-wrap gap-1.5">
          {resolutions.map((res) => {
            const active = filters.resolutions.includes(res);
            const label = res === '1920x1080' ? '1080p FHD' : res === '2560x1440' ? '1440p QHD' : '4K UHD';
            return (
              <button
                key={res}
                onClick={() => toggleResolution(res)}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  active
                    ? 'bg-red-950/70 border-red-500 text-red-400 font-bold'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Refresh Rate Pills */}
      <div>
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
          Refresh Rate
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {refreshRates.map((hz) => {
            const active = filters.refreshRates.includes(hz);
            return (
              <button
                key={hz}
                onClick={() => toggleRefreshRate(hz)}
                className={`text-xs font-mono py-1 rounded-md border text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-red-950/70 border-red-500 text-red-400 font-bold'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                }`}
              >
                {hz}Hz
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Only Switch */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-300 font-medium">In Stock Only</span>
        <button
          onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            filters.inStockOnly ? 'bg-emerald-600' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
              filters.inStockOnly ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Results Count footer */}
      <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <span>Matching Parts:</span>
        <span className="text-white font-bold">{totalCount} items</span>
      </div>
    </aside>
  );
};

export default FilterSidebar;
