import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Server,
  Cpu,
  Zap,
  ShieldCheck,
  HardDrive,
  Layers,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { serverProducts } from '../data/serverProducts';
import { useServerBuilderStore } from '../store/useServerBuilderStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { getComponentImage } from '../utils/assetRegistry';
import { formatCurrency, formatWattage } from '../utils/formatters';
import Typography from '../components/ui/Typography';
import ShapeGrid from '../components/common/ShapeGrid';
import FadeContent from '../components/common/FadeContent';
import { Product } from '../types/hardware';

// Enterprise Server Custom Icon Assets
import aiIcon from '../assets/icons/Server/AI.png';
import renderIcon from '../assets/icons/Server/3D RENDER.png';
import dbIcon from '../assets/icons/Server/Database.png';
import serverIcon from '../assets/icons/Server/Server.png';

type FilterCategory = 'all' | 'curated-nodes' | 'turnkey-servers' | 'supercomputers';

export const PreConfiguredServersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const { loadProfile } = useServerBuilderStore();
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();

  const turnkeyServers = serverProducts.filter((p) => p.category === 'server');
  const supercomputers = serverProducts.filter((p) => p.category === 'supercomputer');

  // Curated profiles for the configurator
  const curatedProfiles = [
    {
      id: 'profile-ai-training-4u',
      title: 'AI / LLM Training & Fine-Tuning Node (4U)',
      category: 'curated-nodes',
      badge: 'TOP-TIER DEEP LEARNING',
      icon: aiIcon,
      description: 'Dual AMD EPYC 9654 (192 total threads), 1TB DDR5-4800 ECC LRDIMM, NVIDIA H100 PCIe 80GB HBM3 Accelerator, and 2000W Platinum 2+1 redundant power.',
      price: 5450000,
      rackUnits: 4,
      redundancy: '2+1 Redundant',
      specs: [
        { label: 'Processors', value: '2x AMD EPYC 9654 (96C / 192T each, SP5)' },
        { label: 'Memory', value: '1TB (8x128GB) DDR5-4800 ECC LRDIMM' },
        { label: 'Accelerator', value: 'NVIDIA H100 PCIe 80GB HBM3 Tensor GPU' },
        { label: 'Chassis', value: 'Supermicro 4U GPU Rackmount (4x GPU Bays)' },
        { label: 'Storage', value: 'Kioxia CM6 7.68TB U.3 Dual-Port NVMe' },
        { label: 'Power', value: 'Supermicro 2000W Platinum 2+1 Redundant Hot-Swap' },
      ],
      setupBuild: () => {
        const epyc = serverProducts.find((p) => p.id === 'cpu-srv-amd-epyc-9654') || null;
        const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-h13dsh-dual-sp5') || null;
        const ram = serverProducts.find((p) => p.id === 'ram-srv-samsung-128gb-ddr5-lrdimm') || null;
        const gpu = serverProducts.find((p) => p.id === 'gpu-srv-nvidia-h100-pcie') || null;
        const chassis = serverProducts.find((p) => p.id === 'case-srv-sm-4u-gpu-chassis') || null;
        const psu = serverProducts.find((p) => p.id === 'psu-srv-sm-2000w-redundant') || null;
        const ssd = serverProducts.find((p) => p.id === 'ssd-srv-kioxia-cm6-768tb') || null;

        loadProfile({
          cpu: epyc,
          cpu2: epyc,
          motherboard: mobo,
          ram,
          gpu,
          cabinet: chassis,
          psu,
          primaryStorage: ssd,
        });
        navigate('/servers/builder');
      },
    },
    {
      id: 'profile-vfx-render-2u',
      title: 'Render Farm & VFX Simulation Node (2U)',
      category: 'curated-nodes',
      badge: 'UNREAL ENGINE & BLENDER CLUSTER',
      icon: renderIcon,
      description: 'Dual AMD EPYC 9554 (128 Cores), 512GB DDR5-5600 ECC RDIMM, NVIDIA RTX 6000 Ada Generation 48GB GPU, and dual 1200W Titanium hot-swap PSUs.',
      price: 2950000,
      rackUnits: 2,
      redundancy: '1+1 Redundant',
      specs: [
        { label: 'Processors', value: '2x AMD EPYC 9554 (64C / 128T each, SP5)' },
        { label: 'Memory', value: '512GB (8x64GB) DDR5-5600 ECC Registered RDIMM' },
        { label: 'GPU', value: 'NVIDIA RTX 6000 Ada 48GB ECC Professional' },
        { label: 'Chassis', value: 'Dell PowerEdge 2U Enterprise Rack Chassis' },
        { label: 'Storage', value: 'Samsung PM9A3 3.84TB U.2 NVMe SSD' },
        { label: 'Power', value: 'Delta 1200W Titanium 1+1 Redundant Hot-Swap' },
      ],
      setupBuild: () => {
        const epyc = serverProducts.find((p) => p.id === 'cpu-srv-amd-epyc-9554') || null;
        const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-h13dsh-dual-sp5') || null;
        const ram = serverProducts.find((p) => p.id === 'ram-srv-micron-64gb-ddr5-rdimm') || null;
        const gpu = serverProducts.find((p) => p.id === 'gpu-srv-nvidia-rtx-6000-ada') || null;
        const chassis = serverProducts.find((p) => p.id === 'case-srv-dell-2u-enterprise-chassis') || null;
        const psu = serverProducts.find((p) => p.id === 'psu-srv-delta-1200w-redundant') || null;
        const ssd = serverProducts.find((p) => p.id === 'ssd-srv-samsung-pm9a3-384tb') || null;

        loadProfile({
          cpu: epyc,
          cpu2: epyc,
          motherboard: mobo,
          ram,
          gpu,
          cabinet: chassis,
          psu,
          primaryStorage: ssd,
        });
        navigate('/servers/builder');
      },
    },
    {
      id: 'profile-database-2u',
      title: 'Enterprise Database & SAP HANA Server (2U)',
      category: 'curated-nodes',
      badge: 'SQL SERVER // SAP HANA // ORACLE',
      icon: dbIcon,
      description: 'Dual Intel Xeon Platinum 8480+ (112 Cores), 512GB DDR5-5600 ECC RDIMM, 3.84TB U.2 NVMe Cache + 20TB Enterprise SAS Cold Storage.',
      price: 3380000,
      rackUnits: 2,
      redundancy: '1+1 Redundant',
      specs: [
        { label: 'Processors', value: '2x Intel Xeon Platinum 8480+ (56C / 112T, LGA4677)' },
        { label: 'Memory', value: '512GB (8x64GB) DDR5-5600 ECC RDIMM' },
        { label: 'Chassis', value: 'Dell PowerEdge 2U Enterprise Rack Chassis' },
        { label: 'Storage', value: '3.84TB U.2 NVMe SSD + 20TB Seagate Exos HDD' },
        { label: 'Power', value: 'Delta 1200W Titanium 1+1 Redundant Hot-Swap' },
      ],
      setupBuild: () => {
        const xeon = serverProducts.find((p) => p.id === 'cpu-srv-intel-xeon-plat-8480') || null;
        const mobo = serverProducts.find((p) => p.id === 'mobo-srv-sm-x13dei-dual-lga4677') || null;
        const ram = serverProducts.find((p) => p.id === 'ram-srv-micron-64gb-ddr5-rdimm') || null;
        const chassis = serverProducts.find((p) => p.id === 'case-srv-dell-2u-enterprise-chassis') || null;
        const psu = serverProducts.find((p) => p.id === 'psu-srv-delta-1200w-redundant') || null;
        const ssd = serverProducts.find((p) => p.id === 'ssd-srv-samsung-pm9a3-384tb') || null;
        const hdd = serverProducts.find((p) => p.id === 'hdd-srv-seagate-exos-20tb') || null;

        loadProfile({
          cpu: xeon,
          cpu2: xeon,
          motherboard: mobo,
          ram,
          cabinet: chassis,
          psu,
          primaryStorage: ssd,
          secondaryStorage: hdd,
        });
        navigate('/servers/builder');
      },
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    openCart();
    addToast({
      title: 'Infrastructure System Added',
      message: `${product.name} has been added to your cart.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 relative overflow-hidden font-sans">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <ShapeGrid
          speed={0.3}
          squareSize={48}
          direction="diagonal"
          borderColor="rgba(255, 30, 45, 0.12)"
          hoverFillColor="#FF1E2D"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Page Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 mb-8 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#FF1E2D] mb-1">
                <Server className="w-4 h-4" />
                Infrastructure Profiles
              </div>
              <Typography type="h1" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Pre-Configured Enterprise Nodes &amp; Supercomputers
              </Typography>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-2 max-w-2xl leading-relaxed">
                Turnkey rack configurations and supercomputing topologies tested for thermal headroom, memory bandwidth, and 24/7 mission-critical uptime. Load directly into the Server Studio for customization or order turnkey.
              </p>
            </div>

            <Link
              to="/servers/builder"
              className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/60 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <Cpu className="w-4 h-4" />
              <span>Custom Configurator &rarr;</span>
            </Link>
          </div>
        </FadeContent>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Infrastructure' },
            { id: 'curated-nodes', label: 'Curated HPC Profiles' },
            { id: 'turnkey-servers', label: '16 OEM Turnkey Servers' },
            { id: 'supercomputers', label: 'Exascale Supercomputers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all border ${
                activeFilter === tab.id
                  ? 'bg-red-950 border-[#FF1E2D] text-red-300 shadow-md shadow-red-950/50'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. CURATED HPC PROFILES */}
        {(activeFilter === 'all' || activeFilter === 'curated-nodes') && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-neutral-800">
              <Sparkles className="w-4 h-4 text-[#FF1E2D]" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
                Curated High-Performance Computing Profiles
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {curatedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-[#0E0E11] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-6 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#FF1E2D] flex flex-col justify-between transition-all group font-mono"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        {profile.icon && (
                          <div className="w-10 h-10 rounded-none bg-neutral-900 border-2 border-red-900/60 flex items-center justify-center p-2 shadow-[2px_2px_0px_0px_#FF1E2D] group-hover:border-red-500 transition-colors">
                            <img
                              src={profile.icon}
                              alt={profile.title}
                              className="w-6 h-6 object-contain group-hover:scale-110 transition-transform brightness-0 invert drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                            />
                          </div>
                        )}
                        <span className="text-[10px] font-mono font-bold bg-red-950 text-[#FF1E2D] px-2.5 py-1 rounded-none border border-red-800/60 uppercase">
                          // {profile.badge}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        {profile.rackUnits}U RACK
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-mono text-white tracking-tight">
                      {profile.title}
                    </h3>

                    <p className="text-xs text-neutral-400 font-mono mt-2 leading-relaxed">
                      {profile.description}
                    </p>

                    <div className="mt-5 pt-4 border-t-2 border-neutral-800 space-y-2 font-mono text-xs">
                      {profile.specs.map((sp, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-2">
                          <span className="text-[#FF1E2D] font-bold shrink-0">{sp.label}:</span>
                          <span className="text-neutral-200 text-right font-medium">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t-2 border-neutral-800">
                    <div className="flex items-baseline justify-between mb-4 font-mono">
                      <span className="text-[10px] text-neutral-500 uppercase">// EST. BUILD</span>
                      <span className="text-xl font-black text-white">
                        {formatCurrency(profile.price)}
                      </span>
                    </div>

                    <button
                      onClick={profile.setupBuild}
                      className="w-full py-3 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded-none border-2 border-neutral-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                    >
                      <Cpu className="w-4 h-4" />
                      <span>Customize in Server Studio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 16 TURNKEY OEM SERVER MODELS */}
        {(activeFilter === 'all' || activeFilter === 'turnkey-servers') && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-neutral-800">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
                Dell PowerEdge, HPE ProLiant &amp; Supermicro Turnkey Systems (16 Models)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turnkeyServers.map((srv) => {
                const s = srv.serverSpecs;
                const img = getComponentImage(srv.imageSlug, 'server');

                return (
                  <div
                    key={srv.id}
                    className="bg-[#0E0E11] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-5 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] flex flex-col justify-between transition-all font-mono"
                  >
                    <div>
                      <div className="w-full h-44 bg-neutral-950 rounded-none p-3 border-2 border-neutral-800 mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={img}
                          alt={srv.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                          // {srv.brand} • {s?.formFactor}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-none border border-neutral-700">
                          {s?.managementEngine}
                        </span>
                      </div>

                      <h3 className="text-base font-bold font-mono text-white tracking-tight">
                        {srv.name}
                      </h3>

                      <p className="text-xs text-neutral-400 font-mono mt-1 line-clamp-2">
                        {srv.description}
                      </p>

                      <div className="mt-4 pt-3 border-t-2 border-neutral-800 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-neutral-400">
                          <span>Sockets:</span>
                          <span className="text-white font-bold">{s?.processorSockets}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Max Memory:</span>
                          <span className="text-white font-bold">{s?.maxMemory}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Drive Bays:</span>
                          <span className="text-white font-bold">{s?.storageDriveBays}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Expansion:</span>
                          <span className="text-white font-bold truncate max-w-[160px]">{s?.expansionNetworking}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-neutral-800 flex items-center justify-between gap-2 font-mono">
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase block">
                          // ESTIMATE
                        </span>
                        <span className="text-base font-black text-white">
                          {formatCurrency(srv.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/servers/${srv.id}`}
                          className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-none border-2 border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                        >
                          Specs
                        </Link>
                        <button
                          onClick={() => handleAddToCart(srv)}
                          className="px-4 py-2 bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded-none border-2 border-neutral-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. EXASCALE SUPERCOMPUTERS */}
        {(activeFilter === 'all' || activeFilter === 'supercomputers') && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-neutral-800">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                Leading Top500 Supercomputing Topologies (8 Global Systems)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {supercomputers.map((sc) => {
                const s = sc.supercomputerSpecs;
                const img = getComponentImage(sc.imageSlug, 'supercomputer');

                return (
                  <div
                    key={sc.id}
                    className="bg-[#0E0E11] border-2 border-neutral-800 hover:border-[#FF1E2D] rounded-none p-5 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] flex flex-col justify-between transition-all font-mono"
                  >
                    <div>
                      <div className="w-full h-36 bg-neutral-950 rounded-none p-2.5 border-2 border-neutral-800 mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={img}
                          alt={sc.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1E2D] bg-red-950/60 px-2 py-0.5 rounded-none border border-red-800/50">
                        {s?.peakCompute}
                      </span>

                      <h3 className="text-base font-bold font-mono text-white tracking-tight mt-2">
                        {sc.name}
                      </h3>

                      <p className="text-[11px] font-mono text-neutral-400 mt-1 line-clamp-1">
                        {s?.operatingInstitutionCountry}
                      </p>

                      <div className="mt-3 pt-3 border-t-2 border-neutral-800 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-neutral-400">
                          <span>Topology:</span>
                          <span className="text-white font-bold truncate max-w-[140px]">{s?.coreHardwareTopology}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Fabric:</span>
                          <span className="text-white font-bold">{s?.interconnectFabric}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Cores:</span>
                          <span className="text-white font-bold">{s?.totalCores}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Power:</span>
                          <span className="text-amber-400 font-bold">{s?.powerConsumption}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-neutral-800 flex items-center justify-between gap-2 font-mono">
                      <Link
                        to={`/servers/${sc.id}`}
                        className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-none text-xs font-mono font-bold text-center border-2 border-neutral-700 shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all block"
                      >
                        Inspect Topology &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreConfiguredServersPage;
