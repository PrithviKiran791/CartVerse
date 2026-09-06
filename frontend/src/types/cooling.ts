export type CoolingCategory = 'cooler' | 'coolant';
export type CoolerType = 'air' | 'aio_liquid';
export type CoolantType = 'transparent' | 'opaque_pastel' | 'concentrate' | 'cleaner' | 'biocide';

export interface CoolerSpecs {
  coolerType: CoolerType;
  supportedSockets: ('AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851')[];
  ratedTdpWatts: number;
  // Air Cooler specific
  heightMm?: number;
  heatpipeCount?: number;
  fanSizeMm?: number;
  // Liquid AIO specific
  radiatorSizeMm?: 120 | 240 | 280 | 360 | 420;
  radiatorThicknessMm?: number;
  pumpRpm?: number;
  hasVrmFan?: boolean;
  hasLcdScreen?: boolean;
  lcdScreenSizeInches?: number;
}

export interface CoolantSpecs {
  coolantType: CoolantType;
  volumeMl: number;
  baseChemistry: string;
  compatibleMetals: ('Copper' | 'Brass' | 'Nickel' | 'Aluminum')[];
  compatibleTubing: ('Acrylic' | 'PETG' | 'EPDM' | 'PVC' | 'Glass')[];
  drainIntervalMonths: number;
  readyToUse: boolean; // false for concentrates
}

export interface CoolingProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: CoolingCategory;
  price: number; // in INR
  imageFileName: string; // mapped to src/assets/Components/cooler/ or /coolant/
  stock: number;
  coolerSpecs?: CoolerSpecs;
  coolantSpecs?: CoolantSpecs;
}
