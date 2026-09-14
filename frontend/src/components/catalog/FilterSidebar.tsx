import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, Server, Cpu, ShieldCheck } from 'lucide-react';
import { FilterState, ComponentCategory, CPUSocket, RAMType } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';
import LineSidebar from '../common/LineSidebar';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { cn } from '../../lib/utils';
import { getHardwareIcon } from '../../utils/hardwareIcons';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, totalCount }) => {
  const isServerMode = filters.productClass === 'server';

  // Consumer Categories
  const consumerCategories: { id: ComponentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'cpu', label: 'Processors (CPU)' },
    { id: 'gpu', label: 'Graphics Cards (GPU)' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'ram', label: 'Memory (RAM)' },
    { id: 'ssd', label: 'Solid State Drives (SSD)' },
    { id: 'hdd', label: 'Hard Disk Drives (HDD)' },
    { id: 'cabinet', label: 'PC Cabinets' },
    { id: 'psu', label: 'Power Supplies (PSU)' },
    { id: 'cooler', label: 'CPU Coolers & AIOs' },
    { id: 'coolant', label: 'PC Coolants & Fluids' },
    { id: 'monitor', label: 'Gaming Monitors' },
    { id: 'keyboard', label: 'Keyboards' },
    { id: 'mouse', label: 'Gaming Mice' },
    { id: 'mousepad', label: 'Mousepads & Deskmats' },
    { id: 'headphones', label: 'Headphones & Headsets' },
    { id: 'speakers', label: 'Desktop Speakers' },
    { id: 'webcam', label: 'Webcams & Cameras' },
    { id: 'controller', label: 'Game Controllers' },
    { id: 'console', label: 'Gaming Consoles' },
    { id: 'cables', label: 'Cables & Interconnects' },
    { id: 'prebuilt', label: 'Pre-Built Rigs' },
  ];

  // Server Categories
  const serverCategories: { id: ComponentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Infrastructure' },
    { id: 'server', label: 'Turnkey Server Nodes' },
    { id: 'supercomputer', label: 'Exascale Systems' },
    { id: 'cpu', label: 'Server Processors (EPYC / Xeon)' },
    { id: 'motherboard', label: 'Multi-Socket Motherboards' },
    { id: 'ram', label: 'ECC Registered Memory (RDIMM)' },
    { id: 'cabinet', label: 'Rackmount Chassis (1U-4U)' },
    { id: 'psu', label: 'Redundant Power Supplies' },
    { id: 'ssd', label: 'U.2 / Enterprise NVMe SSDs' },
    { id: 'hdd', label: 'Enterprise Storage HDDs' },
    { id: 'gpu', label: 'AI Accelerators & GPUs' },
  ];

  const currentCategories = isServerMode ? serverCategories : consumerCategories;

  // Facet Options
  const consumerSockets: CPUSocket[] = ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'];
  const serverSockets: CPUSocket[] = ['SP5', 'SP3', 'LGA4677', 'sTR5'];
  const consumerRamTypes: RAMType[] = ['DDR4', 'DDR5'];
  const serverMemoryTypes: ('RDIMM' | 'LRDIMM' | 'UDIMM')[] = ['RDIMM', 'LRDIMM'];
  const serverRackUnits = [1, 2, 4, 5, 6];
  const serverRedundancies: ('single' | 'N+1' | 'N+N')[] = ['N+1', 'N+N', 'single'];
  const serverUseCases = [
    { id: 'ai-training', label: 'AI / LLM Training' },
    { id: 'rendering', label: '3D VFX & Rendering' },
    { id: 'database', label: 'Databases & In-Memory' },
    { id: 'hpc', label: 'HPC Supercomputing' },
    { id: 'virtualization', label: 'Cloud Virtualization' },
    { id: 'storage', label: 'Enterprise Storage & SAN' },
  ];

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

  const toggleServerMemoryType = (mt: 'RDIMM' | 'LRDIMM' | 'UDIMM') => {
    setFilters((prev) => {
      const current = prev.memoryTypes || [];
      return {
        ...prev,
        memoryTypes: current.includes(mt)
          ? current.filter((m) => m !== mt)
          : [...current, mt],
      };
    });
  };

  const toggleRackUnit = (ru: number) => {
    setFilters((prev) => {
      const current = prev.rackUnits || [];
      return {
        ...prev,
        rackUnits: current.includes(ru)
          ? current.filter((r) => r !== ru)
          : [...current, ru],
      };
    });
  };

  const toggleRedundancy = (red: 'single' | 'N+1' | 'N+N') => {
    setFilters((prev) => {
      const current = prev.psuRedundancies || [];
      return {
        ...prev,
        psuRedundancies: current.includes(red)
          ? current.filter((r) => r !== red)
          : [...current, red],
      };
    });
  };

  const toggleUseCase = (uc: string) => {
    setFilters((prev) => {
      const current = prev.useCases || [];
      return {
        ...prev,
        useCases: current.includes(uc)
          ? current.filter((u) => u !== uc)
          : [...current, uc],
      };
    });
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
      priceRange: [500, isServerMode ? 35000000 : 250000],
      sockets: [],
      ramTypes: [],
      resolutions: [],
      refreshRates: [],
      inStockOnly: false,
      sortBy: 'featured',
      productClass: isServerMode ? 'server' : 'consumer',
      rackUnits: [],
      memoryTypes: [],
      psuRedundancies: [],
      useCases: [],
    });
  };

  const setProductClass = (pc: 'consumer' | 'server') => {
    setFilters((prev) => ({
      ...prev,
      productClass: pc,
      category: 'all',
      priceRange: [500, pc === 'server' ? 35000000 : 250000],
      sockets: [],
      ramTypes: [],
      memoryTypes: [],
      rackUnits: [],
      psuRedundancies: [],
      useCases: [],
    }));
  };

  const maxPriceLimit = isServerMode ? 35000000 : 250000;
  const priceStep = isServerMode ? 250000 : 2500;

  return (
    <aside className="w-full lg:w-72 bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 rounded-none sm:rounded-md p-5 space-y-6 shrink-0 backdrop-blur-md self-start sticky top-24 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#FF1E2D]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF1E2D]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {isServerMode ? '// SERVER_FILTERS' : '// FACETED_FILTERS'}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          className="bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border-2 border-neutral-800 hover:border-[#FF1E2D] text-[10px] font-mono font-bold py-1 px-2.5 rounded-none flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <RotateCcw className="w-3 h-3 text-[#FF1E2D]" />
          <span>RESET</span>
        </button>
      </div>

      {/* Product Class Discriminator Tab Toggle (Consumer vs Server) */}
      <div>
        <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2 font-mono">
          // PRODUCT_VERTICAL
        </label>
        <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-none border-2 border-neutral-800 font-mono text-xs">
          <button
            onClick={() => setProductClass('consumer')}
            className={`py-1.5 rounded-none font-bold transition-all cursor-pointer ${
              !isServerMode
                ? 'bg-[#FF1E2D] text-white border-2 border-neutral-900 dark:border-white shadow-[2px_2px_0px_0px_#000000]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Consumer PC
          </button>
          <button
            onClick={() => setProductClass('server')}
            className={`py-1.5 rounded-none font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              isServerMode
                ? 'bg-[#FF1E2D] text-white border-2 border-neutral-900 dark:border-white shadow-[2px_2px_0px_0px_#000000]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3 h-3 text-current" />
            <span>Servers</span>
          </button>
        </div>
      </div>

      {/* Component Category with LineSidebar Animation */}
      <div>
        <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
          {isServerMode ? '// INFRASTRUCTURE_CAT' : '// COMPONENT_CAT'}
        </label>
        <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin overflow-x-hidden pt-1 border border-neutral-800/80 p-1 bg-neutral-950/40">
          <LineSidebar
            items={currentCategories.map((c) => ({
              label: c.label,
              icon: c.id !== 'all' ? getHardwareIcon(c.id) : undefined,
            }))}
            accentColor="#FF1E2D"
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
            defaultActive={Math.max(
              0,
              currentCategories.findIndex((c) => c.id === filters.category)
            )}
            onItemClick={(index: number) => {
              const selectedCat = currentCategories[index];
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
          <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider font-mono">
            // BUDGET_CAP
          </label>
          <span className="text-xs font-mono font-bold text-[#FF1E2D]">
            [{formatCurrency(filters.priceRange[1])}]
          </span>
        </div>
        <input
          type="range"
          min="500"
          max={maxPriceLimit}
          step={priceStep}
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-[#FF1E2D] cursor-pointer h-1.5 bg-neutral-800 rounded-none appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
          <span>₹500</span>
          <span>{formatCurrency(Math.round(maxPriceLimit / 2))}</span>
          <span>{formatCurrency(maxPriceLimit)}+</span>
        </div>
      </div>

      {/* DYNAMIC SERVER-SPECIFIC FILTERS */}
      {isServerMode ? (
        <>
          {/* Server Socket Match (SP5, SP3, LGA4677) */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // SERVER_SOCKET
            </label>
            <div className="flex flex-wrap gap-1.5">
              {serverSockets.map((sock) => {
                const active = filters.sockets.includes(sock);
                return (
                  <button
                    key={sock}
                    type="button"
                    onClick={() => toggleSocket(sock)}
                    className={cn(
                      'text-xs font-mono px-3 py-1.5 cursor-pointer transition-all rounded-none border-2',
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    )}
                  >
                    {sock}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rack Units (1U, 2U, 4U, 5U, 6U) */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // RACK_UNITS
            </label>
            <div className="grid grid-cols-5 gap-1">
              {serverRackUnits.map((ru) => {
                const active = (filters.rackUnits || []).includes(ru);
                return (
                  <button
                    key={ru}
                    type="button"
                    onClick={() => toggleRackUnit(ru)}
                    className={`py-1.5 rounded-none text-xs font-mono font-bold transition-all border-2 ${
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {ru}U
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory Type (RDIMM / LRDIMM) */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // ECC_MEMORY_TYPE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {serverMemoryTypes.map((mt) => {
                const active = (filters.memoryTypes || []).includes(mt);
                return (
                  <button
                    key={mt}
                    type="button"
                    onClick={() => toggleServerMemoryType(mt)}
                    className={`py-1.5 rounded-none text-xs font-mono font-bold transition-all border-2 ${
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {mt} ECC
                  </button>
                );
              })}
            </div>
          </div>

          {/* Power Redundancy (N+1, N+N, Single) */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // POWER_DELIVERY_MODE
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {serverRedundancies.map((red) => {
                const active = (filters.psuRedundancies || []).includes(red);
                return (
                  <button
                    key={red}
                    type="button"
                    onClick={() => toggleRedundancy(red)}
                    className={`py-1.5 rounded-none text-xs font-mono font-bold uppercase transition-all border-2 ${
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {red}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workload Profile Facets */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // TARGET_WORKLOAD
            </label>
            <div className="flex flex-wrap gap-1.5">
              {serverUseCases.map((uc) => {
                const active = (filters.useCases || []).includes(uc.id);
                return (
                  <button
                    key={uc.id}
                    type="button"
                    onClick={() => toggleUseCase(uc.id)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-none transition-all border-2 ${
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {uc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* DYNAMIC CONSUMER-SPECIFIC FILTERS */
        <>
          {/* Consumer Socket Pills */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // CPU_SOCKET_MATCH
            </label>
            <div className="flex flex-wrap gap-1.5">
              {consumerSockets.map((sock) => {
                const active = filters.sockets.includes(sock);
                return (
                  <button
                    key={sock}
                    type="button"
                    onClick={() => toggleSocket(sock)}
                    className={cn(
                      'text-xs font-mono px-3 py-1.5 cursor-pointer transition-all rounded-none border-2',
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    )}
                  >
                    {sock}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RAM Generation Pills */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // MEMORY_GENERATION
            </label>
            <div className="flex gap-2">
              {consumerRamTypes.map((rt) => {
                const active = filters.ramTypes.includes(rt);
                return (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => toggleRamType(rt)}
                    className={cn(
                      'w-full justify-center text-xs font-mono py-1.5 cursor-pointer transition-all rounded-none border-2',
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    )}
                  >
                    {rt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monitor Resolution Pills */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // DISPLAY_RESOLUTION
            </label>
            <div className="flex flex-wrap gap-1.5">
              {resolutions.map((res) => {
                const active = filters.resolutions.includes(res);
                const label =
                  res === '1920x1080' ? '1080p FHD' : res === '2560x1440' ? '1440p QHD' : '4K UHD';
                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => toggleResolution(res)}
                    className={cn(
                      'text-xs font-mono px-2.5 py-1.5 cursor-pointer transition-all rounded-none border-2',
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Refresh Rate Pills */}
          <div>
            <label className="text-xs font-bold text-[#FF1E2D] uppercase tracking-wider block mb-2.5 font-mono">
              // REFRESH_RATE
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {refreshRates.map((hz) => {
                const active = filters.refreshRates.includes(hz);
                return (
                  <button
                    key={hz}
                    type="button"
                    onClick={() => toggleRefreshRate(hz)}
                    className={cn(
                      'w-full justify-center text-xs font-mono py-1 cursor-pointer transition-all rounded-none border-2',
                      active
                        ? 'bg-[#FF1E2D] border-neutral-900 dark:border-white text-white font-bold shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    )}
                  >
                    {hz}Hz
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* In Stock Only Switch */}
      <div className="pt-3 border-t-2 border-neutral-800 flex items-center justify-between font-mono">
        <span className="text-xs text-[#FF1E2D] font-bold">// IN_STOCK_ONLY</span>
        <button
          onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
          className={`w-11 h-6 rounded-none border-2 border-neutral-800 transition-colors relative cursor-pointer ${
            filters.inStockOnly ? 'bg-emerald-600 border-neutral-900 dark:border-white shadow-[2px_2px_0px_0px_#000000]' : 'bg-neutral-950'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-none bg-white transition-transform absolute top-0.5 ${
              filters.inStockOnly ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Results Count footer */}
      <div className="pt-3 border-t-2 border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <span className="text-[#FF1E2D] font-bold uppercase tracking-wider">// VERIFIED_PARTS:</span>
        <span className="text-white font-bold">[{totalCount} ITEMS]</span>
      </div>
    </aside>
  );
};

export default FilterSidebar;
