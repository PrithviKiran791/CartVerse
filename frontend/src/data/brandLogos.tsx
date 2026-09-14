import React from 'react';
import amdLogo from '../assets/Brands/amd.png';
import corsairLogo from '../assets/Brands/corsair.png';
import nvidiaLogo from '../assets/Brands/nvidia.png';
import razerLogo from '../assets/Brands/razer.png';
import rogLogo from '../assets/Brands/rog.png';
import playstationLogo from '../assets/icons/Playstation.png';
import xboxLogo from '../assets/icons/xbox.png';
import nintendoLogo from '../assets/icons/nintendo.png';
import { LogoItem } from '../components/common/LogoLoop';

// Authentic Hardware Manufacturer Brand Logos from CartVerse Catalog (mockProducts.ts)
export interface CatalogBrandItem extends LogoItem {
  id: string;
  name: string;
  categoryHint?: string;
  catalogHref: string;
}

export const brandLogos: CatalogBrandItem[] = [
  {
    id: 'amd',
    name: 'AMD',
    title: 'AMD Ryzen & Radeon Silicon',
    src: amdLogo,
    alt: 'AMD',
    catalogHref: '/processors-gpus/processors/amd',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    title: 'NVIDIA GeForce RTX Architecture',
    src: nvidiaLogo,
    alt: 'NVIDIA',
    catalogHref: '/processors-gpus/gpu/nvidia',
  },
  {
    id: 'intel',
    name: 'Intel',
    title: 'Intel Core Ultra Processors',
    alt: 'Intel',
    catalogHref: '/processors-gpus/processors/intel',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current text-white tracking-widest" aria-hidden="true">
          <text x="5" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1px">
            intel
          </text>
          <circle cx="48" cy="10" r="3.5" fill="#FF1E2D" />
        </svg>
      </div>
    ),
  },
  {
    id: 'rog',
    name: 'ASUS ROG',
    title: 'ASUS Republic of Gamers',
    src: rogLogo,
    alt: 'ASUS ROG',
    catalogHref: '/products?brand=ASUS',
  },
  {
    id: 'corsair',
    name: 'Corsair',
    title: 'Corsair Vengeance & Hydro X Cooling',
    src: corsairLogo,
    alt: 'Corsair',
    catalogHref: '/thermal-systems',
  },
  {
    id: 'msi',
    name: 'MSI',
    title: 'MSI Gaming Motherboards & Rigs',
    alt: 'MSI',
    catalogHref: '/products?brand=MSI',
    node: (
      <div className="flex items-center gap-2 px-2 py-1 select-none">
        <span className="text-xl font-black italic tracking-widest text-white">
          msi
        </span>
      </div>
    ),
  },
  {
    id: 'gigabyte',
    name: 'Gigabyte',
    title: 'Gigabyte AORUS Gaming Hardware',
    alt: 'Gigabyte',
    catalogHref: '/products?brand=Gigabyte',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <span className="text-lg font-black uppercase tracking-wider text-white">
          GIGABYTE
        </span>
      </div>
    ),
  },
  {
    id: 'nzxt',
    name: 'NZXT',
    title: 'NZXT Kraken AIO & Elite Chassis',
    alt: 'NZXT',
    catalogHref: '/thermal-systems',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <span className="text-xl font-black uppercase tracking-widest text-white">
          NZXT<span className="text-red-500">.</span>
        </span>
      </div>
    ),
  },
  {
    id: 'samsung',
    name: 'Samsung',
    title: 'Samsung Odyssey Displays & 990 Pro SSDs',
    alt: 'Samsung',
    catalogHref: '/displays',
    node: (
      <div className="flex items-center px-2 py-1 select-none">
        <span className="text-lg font-black tracking-tight text-white uppercase">
          SAMSUNG
        </span>
      </div>
    ),
  },
  {
    id: 'razer',
    name: 'Razer',
    title: 'Razer Chroma Peripherals & Blades',
    src: razerLogo,
    alt: 'Razer',
    catalogHref: '/products?brand=Razer',
  },
  {
    id: 'kingston',
    name: 'Kingston',
    title: 'Kingston FURY Beast & Renegade DDR5',
    alt: 'Kingston',
    catalogHref: '/memory',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <span className="text-lg font-bold uppercase tracking-wider text-white">
          Kingston
        </span>
      </div>
    ),
  },
  {
    id: 'lianli',
    name: 'Lian Li',
    title: 'Lian Li O11 Dynamic & UNI Fan Systems',
    alt: 'Lian Li',
    catalogHref: '/thermal-systems',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <span className="text-base font-black tracking-widest text-white uppercase border border-neutral-700 px-2 py-0.5 rounded">
          LIAN LI
        </span>
      </div>
    ),
  },
  {
    id: 'noctua',
    name: 'Noctua',
    title: 'Noctua NH-D15 & Premium Silent Air Coolers',
    alt: 'Noctua',
    catalogHref: '/thermal-systems',
    node: (
      <div className="flex items-center gap-1.5 px-2 py-1 select-none">
        <span className="text-lg font-black tracking-widest text-amber-100 uppercase">
          noctua
        </span>
      </div>
    ),
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    title: 'Sony PlayStation 5 & DualSense Ecosystem',
    src: playstationLogo,
    alt: 'PlayStation',
    catalogHref: '/console?brand=playstation',
  },
  {
    id: 'xbox',
    name: 'Xbox',
    title: 'Microsoft Xbox Series X|S Hardware',
    src: xboxLogo,
    alt: 'Xbox',
    catalogHref: '/console?brand=xbox',
  },
  {
    id: 'nintendo',
    name: 'Nintendo',
    title: 'Nintendo Switch OLED & Joy-Con Systems',
    src: nintendoLogo,
    alt: 'Nintendo',
    catalogHref: '/console?brand=nintendo',
  },
];

export const enterpriseBrandLogos: CatalogBrandItem[] = [
  {
    id: 'amd-epyc',
    name: 'AMD EPYC',
    title: 'AMD EPYC Server Processors',
    alt: 'AMD EPYC',
    catalogHref: '/servers/catalog?brand=AMD',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-black tracking-wider text-white font-sans">AMD</span>
        <span className="text-xs font-bold text-red-500 font-sans bg-red-950 px-1 rounded">EPYC</span>
      </div>
    ),
  },
  {
    id: 'intel-xeon',
    name: 'Intel Xeon',
    title: 'Intel Xeon Scalable Processors',
    alt: 'Intel Xeon',
    catalogHref: '/servers/catalog?brand=Intel',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-black tracking-wider text-cyan-400 font-sans">intel</span>
        <span className="text-xs font-bold text-white font-sans uppercase">XEON</span>
      </div>
    ),
  },
  {
    id: 'dell-tech',
    name: 'Dell',
    title: 'Dell PowerEdge Enterprise Servers',
    alt: 'Dell',
    catalogHref: '/servers/catalog?brand=Dell',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-black tracking-widest text-white font-sans">DELL</span>
        <span className="text-[10px] text-neutral-400 font-sans">PowerEdge</span>
      </div>
    ),
  },
  {
    id: 'hpe-proliant',
    name: 'HPE',
    title: 'HPE ProLiant Compute Infrastructure',
    alt: 'HPE',
    catalogHref: '/servers/catalog?brand=HPE',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-black tracking-wider text-emerald-400 font-sans">HPE</span>
        <span className="text-[10px] text-neutral-300 font-sans">ProLiant</span>
      </div>
    ),
  },
  {
    id: 'supermicro',
    name: 'Supermicro',
    title: 'Supermicro Server Building Blocks',
    alt: 'Supermicro',
    catalogHref: '/servers/catalog?brand=Supermicro',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-bold tracking-tight text-white font-sans">SUPERMICRO</span>
      </div>
    ),
  },
  {
    id: 'nvidia-enterprise',
    name: 'NVIDIA',
    title: 'NVIDIA AI & Data Center Accelerators',
    alt: 'NVIDIA',
    catalogHref: '/servers/catalog?brand=NVIDIA',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-black tracking-wider text-[#76B900] font-sans">NVIDIA</span>
        <span className="text-[10px] text-neutral-400 font-sans">Hopper/Ada</span>
      </div>
    ),
  },
  {
    id: 'broadcom',
    name: 'Broadcom',
    title: 'Broadcom MegaRAID & Ethernet Fabrics',
    alt: 'Broadcom',
    catalogHref: '/servers/catalog?brand=Broadcom',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-xs font-bold tracking-wider text-red-400 font-sans uppercase">BROADCOM</span>
      </div>
    ),
  },
  {
    id: 'seagate-enterprise',
    name: 'Seagate',
    title: 'Seagate Exos Enterprise Storage',
    alt: 'Seagate',
    catalogHref: '/servers/catalog?brand=Seagate',
    node: (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-sm font-bold text-white font-sans">SEAGATE</span>
        <span className="text-[10px] text-emerald-400 font-sans">EXOS</span>
      </div>
    ),
  },
];

