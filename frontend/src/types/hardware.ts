export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'ssd'
  | 'hdd'
  | 'psu'
  | 'cabinet'
  | 'cooler'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'mousepad'
  | 'headphones'
  | 'speakers'
  | 'webcam'
  | 'controller'
  | 'cables'
  | 'prebuilt';

export type CPUSocket = 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851' | 'sTR5' | 'SP3';
export type RAMType = 'DDR4' | 'DDR5';
export type FormFactor = 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
export type StorageInterface = 'SATA III' | 'PCIe 3.0 NVMe' | 'PCIe 4.0 NVMe' | 'PCIe 5.0 NVMe';
export type PanelType = 'Fast IPS' | 'IPS' | 'VA' | 'OLED' | 'QD-OLED';

export interface HardwareSpecs {
  socket?: CPUSocket;
  ramType?: RAMType;
  ramSlots?: number;
  tdp?: number; // in Watts
  wattage?: number; // for PSU in Watts
  formFactor?: FormFactor;
  supportedFormFactors?: FormFactor[];
  gpuLengthMm?: number;
  maxGpuLengthMm?: number;
  radiatorSupportMm?: number[]; // e.g. [120, 240, 280, 360]
  radiatorSizeMm?: number; // for coolers e.g. 240, 360
  refreshRateHz?: number;
  resolution?: string; // e.g. "1920x1080", "2560x1440", "3840x2160"
  panelType?: PanelType;
  storageInterface?: StorageInterface;
  capacity?: string; // e.g. "16GB (2x8GB)", "1TB", "2TB", "850W"
  speed?: string; // e.g. "6000MHz", "7400 MB/s", "5.4GHz"
  cores?: number;
  threads?: number;
  vram?: string; // e.g. "16GB GDDR6X"
  efficiencyRating?: string; // e.g. "80+ Gold", "80+ Bronze", "80+ Platinum"
  modular?: 'Full' | 'Semi' | 'Non-Modular';
  connectivity?: string; // e.g. "Tri-Mode (2.4G / BT / Wired)", "Wired USB-C"
  sensorDpi?: number;
  switchType?: string; // e.g. "Cherry MX Red", "Optical Magnetic"
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  subcategory?: string;
  price: number; // in INR (₹)
  originalPrice?: number;
  imageSlug: string; // Relative asset path or filename mapped in assetRegistry
  stock: number;
  rating: number;
  reviewsCount: number;
  specs: HardwareSpecs;
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  tags?: string[];
  description: string;
}

export type BuilderSlotKey =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'primaryStorage'
  | 'secondaryStorage'
  | 'psu'
  | 'cabinet'
  | 'cooler'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headphones';

export interface PCBuildState {
  cpu: Product | null;
  motherboard: Product | null;
  ram: Product | null;
  gpu: Product | null;
  primaryStorage: Product | null;
  secondaryStorage: Product | null;
  psu: Product | null;
  cabinet: Product | null;
  cooler: Product | null;
  monitor: Product | null;
  keyboard: Product | null;
  mouse: Product | null;
  headphones: Product | null;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: 'socket' | 'memory' | 'clearance' | 'power' | 'formfactor' | 'cooler';
  title: string;
  message: string;
}

export interface CompatibilityReport {
  isCompatible: boolean;
  warnings: string[];
  errors: string[];
  issues: CompatibilityIssue[];
  estimatedWattage: number;
  recommendedPsuWattage: number;
  psuHeadroomPercentage: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartBuildBundle {
  id: string;
  title: string;
  build: PCBuildState;
  items: CartItem[];
  totalPrice: number;
  totalWattage: number;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: ComponentCategory | 'all';
  brands: string[];
  priceRange: [number, number];
  sockets: CPUSocket[];
  ramTypes: RAMType[];
  resolutions: string[];
  refreshRates: number[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
