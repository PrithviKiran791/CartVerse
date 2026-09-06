import React, { useState, useMemo } from 'react';
import { CoolingProduct, CoolerType, CoolantType } from '../../types/cooling';
import { COOLING_CATALOG } from '../../data/coolingProducts';
import { validateCoolerSelection } from '../../utils/coolingCompatibility';
import { getComponentImage } from '../../utils/assetRegistry';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { 
  Fan, Droplets, CheckCircle, AlertTriangle, XCircle, 
  ThermometerSnowflake, ShieldCheck, Gauge, Layers 
} from 'lucide-react';

export const CoolingSelector: React.FC = () => {
  const { build, setSlot } = usePCBuilderStore();
  const [selectedTab, setSelectedTab] = useState<'air' | 'aio_liquid' | 'coolant'>('air');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');

  // Filter catalog based on active tab and brand
  const filteredProducts = useMemo(() => {
    return COOLING_CATALOG.filter((item) => {
      const matchesTab =
        item.category === 'coolant'
          ? selectedTab === 'coolant'
          : item.coolerSpecs?.coolerType === selectedTab;

      const matchesBrand = brandFilter === 'ALL' || item.brand === brandFilter;
      return matchesTab && matchesBrand;
    });
  }, [selectedTab, brandFilter]);

  const uniqueBrands = useMemo(() => {
    const brands = COOLING_CATALOG
      .filter((i) => (selectedTab === 'coolant' ? i.category === 'coolant' : i.coolerSpecs?.coolerType === selectedTab))
      .map((i) => i.brand);
    return ['ALL', ...Array.from(new Set(brands))];
  }, [selectedTab]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Component Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5 text-white">
            <ThermometerSnowflake className="w-6 h-6 text-sky-400" />
            Thermal Management & Coolants
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare tower heatsinks, AIO closed-loops, and custom-loop fluids with active socket and TDP verification.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setSelectedTab('air'); setBrandFilter('ALL'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              selectedTab === 'air' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fan className="w-3.5 h-3.5" /> Air Coolers
          </button>
          <button
            onClick={() => { setSelectedTab('aio_liquid'); setBrandFilter('ALL'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              selectedTab === 'aio_liquid' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Liquid AIO
          </button>
          <button
            onClick={() => { setSelectedTab('coolant'); setBrandFilter('ALL'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              selectedTab === 'coolant' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> PC Coolants
          </button>
        </div>
      </div>

      {/* Brand Filters Bar */}
      <div className="flex items-center gap-2 py-4 overflow-x-auto">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mr-1">Brand:</span>
        {uniqueBrands.map((b) => (
          <button
            key={b}
            onClick={() => setBrandFilter(b)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
              brandFilter === b
                ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {filteredProducts.map((prod) => {
          const isSelected = build.cooler?.id === prod.id;
          
          const subfolder = prod.category === 'coolant' ? 'coolant' : 'cooler';
          const resolvedImg = getComponentImage(subfolder + '/' + prod.imageFileName, prod.category);

          // Real-time verification against selected CPU & Cabinet in Zustand
          const validation = prod.category === 'cooler'
            ? validateCoolerSelection(prod, build.cpu, build.cabinet)
            : null;

          return (
            <div
              key={prod.id}
              className={`bg-slate-950/80 border rounded-xl p-4 flex flex-col justify-between transition relative ${
                isSelected
                  ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Product Card Top */}
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wide">
                    {prod.brand}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Product Local Image */}
                <div className="w-full h-36 my-3 bg-slate-900/60 border border-slate-800/50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={resolvedImg}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getComponentImage(undefined, subfolder);
                    }}
                  />
                </div>

                <h3 className="font-semibold text-sm text-white leading-snug line-clamp-2">
                  {prod.name}
                </h3>

                {/* Technical Specifications Pills */}
                {prod.coolerSpecs && (
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      TDP: {prod.coolerSpecs.ratedTdpWatts}W
                    </span>
                    {prod.coolerSpecs.heightMm && (
                      <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Height: {prod.coolerSpecs.heightMm}mm
                      </span>
                    )}
                    {prod.coolerSpecs.radiatorSizeMm && (
                      <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Rad: {prod.coolerSpecs.radiatorSizeMm}mm ({prod.coolerSpecs.radiatorThicknessMm}mm)
                      </span>
                    )}
                    {prod.coolerSpecs.hasVrmFan && (
                      <span className="bg-indigo-950/80 border border-indigo-800 text-indigo-300 px-2 py-0.5 rounded">
                        VRM Fan
                      </span>
                    )}
                    {prod.coolerSpecs.hasLcdScreen && (
                      <span className="bg-purple-950/80 border border-purple-800 text-purple-300 px-2 py-0.5 rounded">
                        {prod.coolerSpecs.lcdScreenSizeInches}" LCD
                      </span>
                    )}
                  </div>
                )}

                {prod.coolantSpecs && (
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {prod.coolantSpecs.volumeMl} mL
                    </span>
                    <span className="bg-slate-900 border border-slate-800 text-sky-300 px-2 py-0.5 rounded capitalize">
                      {prod.coolantSpecs.coolantType.replace('_', ' ')}
                    </span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Drain: {prod.coolantSpecs.drainIntervalMonths} mo
                    </span>
                  </div>
                )}

                {/* Compatibility Validation Notice */}
                {validation && (
                  <div className="mt-3 text-[11px] space-y-1">
                    {validation.errors.map((err, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-rose-400">
                        <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    ))}
                    {validation.warnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                    {validation.isCompatible && validation.errors.length === 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Socket & Clearance Verified ({validation.tdpHeadroomPercent}% TDP Headroom)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-900">
                {prod.category === 'cooler' ? (
                  <button
                    disabled={validation ? !validation.isCompatible : false}
                    onClick={() => setSlot('cooler', prod as any)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : validation && !validation.isCompatible
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isSelected ? '✓ Selected in Rig' : 'Select Cooler'}
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Added ${prod.name} (Custom Loop Fluid) to cart!`)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    Add Fluid to Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoolingSelector;
