import { CoolingProduct } from '../types/cooling';

export const COOLING_CATALOG: CoolingProduct[] = [
  // ================= AIR COOLERS =================
  {
    id: 'clr-air-1',
    sku: 'CLR-DEEP-AG400',
    name: 'DeepCool AG400 Single-Tower ARGB',
    brand: 'DeepCool',
    category: 'cooler',
    price: 1850,
    imageFileName: 'deepcool-ag400.png',
    stock: 24,
    coolerSpecs: {
      coolerType: 'air',
      supportedSockets: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 220,
      heightMm: 150,
      heatpipeCount: 4,
      fanSizeMm: 120
    }
  },
  {
    id: 'clr-air-2',
    sku: 'CLR-THRM-PA120SE',
    name: 'Thermalright Peerless Assassin 120 SE',
    brand: 'Thermalright',
    category: 'cooler',
    price: 3600,
    imageFileName: 'thermalright-pa120se.png',
    stock: 18,
    coolerSpecs: {
      coolerType: 'air',
      supportedSockets: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 260,
      heightMm: 155,
      heatpipeCount: 6,
      fanSizeMm: 120
    }
  },
  {
    id: 'clr-air-3',
    sku: 'CLR-DEEP-AK620-ZD',
    name: 'DeepCool AK620 Zero Dark Dual-Tower',
    brand: 'DeepCool',
    category: 'cooler',
    price: 5600,
    imageFileName: 'deepcool-ak620-zerodark.png',
    stock: 12,
    coolerSpecs: {
      coolerType: 'air',
      supportedSockets: ['AM4', 'AM5', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 260,
      heightMm: 160,
      heatpipeCount: 6,
      fanSizeMm: 120
    }
  },
  {
    id: 'clr-air-4',
    sku: 'CLR-NOCT-NHD15-CB',
    name: 'Noctua NH-D15 chromax.black Dual-Tower',
    brand: 'Noctua',
    category: 'cooler',
    price: 10200,
    imageFileName: 'noctua-nhd15-chromax.png',
    stock: 6,
    coolerSpecs: {
      coolerType: 'air',
      supportedSockets: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 280,
      heightMm: 165,
      heatpipeCount: 6,
      fanSizeMm: 140
    }
  },

  // ================= LIQUID AIO COOLERS =================
  {
    id: 'clr-aio-1',
    sku: 'AIO-CM-ML240L-CORE',
    name: 'Cooler Master MasterLiquid 240L Core ARGB',
    brand: 'Cooler Master',
    category: 'cooler',
    price: 5200,
    imageFileName: 'cm-masterliquid-240l.png',
    stock: 16,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 230,
      radiatorSizeMm: 240,
      radiatorThicknessMm: 27,
      pumpRpm: 3000,
      hasVrmFan: false,
      hasLcdScreen: false
    }
  },
  {
    id: 'clr-aio-2',
    sku: 'AIO-ARCT-LF3-240',
    name: 'Arctic Liquid Freezer III 240 Black',
    brand: 'Arctic',
    category: 'cooler',
    price: 8150,
    imageFileName: 'arctic-lf3-240.png',
    stock: 9,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 280,
      radiatorSizeMm: 240,
      radiatorThicknessMm: 38, // Extra-thick core
      pumpRpm: 2800,
      hasVrmFan: true,
      hasLcdScreen: false
    }
  },
  {
    id: 'clr-aio-3',
    sku: 'AIO-ARCT-LF3-360-ARGB',
    name: 'Arctic Liquid Freezer III 360 ARGB',
    brand: 'Arctic',
    category: 'cooler',
    price: 9800,
    imageFileName: 'arctic-lf3-360-argb.png',
    stock: 11,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 340,
      radiatorSizeMm: 360,
      radiatorThicknessMm: 38,
      pumpRpm: 2800,
      hasVrmFan: true,
      hasLcdScreen: false
    }
  },
  {
    id: 'clr-aio-4',
    sku: 'AIO-DEEP-LT720-360',
    name: 'DeepCool LT720 360mm High-Performance AIO',
    brand: 'DeepCool',
    category: 'cooler',
    price: 9200,
    imageFileName: 'deepcool-lt720.png',
    stock: 10,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 300,
      radiatorSizeMm: 360,
      radiatorThicknessMm: 27,
      pumpRpm: 3100,
      hasVrmFan: false,
      hasLcdScreen: false
    }
  },
  {
    id: 'clr-aio-5',
    sku: 'AIO-NZXT-KRAKEN-360-ELITE',
    name: 'NZXT Kraken Elite 360 RGB (V2)',
    brand: 'NZXT',
    category: 'cooler',
    price: 25500,
    imageFileName: 'nzxt-kraken-elite-360.png',
    stock: 4,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 300,
      radiatorSizeMm: 360,
      radiatorThicknessMm: 27,
      pumpRpm: 3300,
      hasVrmFan: false,
      hasLcdScreen: true,
      lcdScreenSizeInches: 2.36
    }
  },
  {
    id: 'clr-aio-6',
    sku: 'AIO-LIAN-GALAHAD2-LCD',
    name: 'Lian Li Galahad II LCD 360 SL-INF',
    brand: 'Lian Li',
    category: 'cooler',
    price: 22000,
    imageFileName: 'lian-li-galahad2-lcd.png',
    stock: 5,
    coolerSpecs: {
      coolerType: 'aio_liquid',
      supportedSockets: ['AM4', 'AM5', 'LGA1700', 'LGA1851'],
      ratedTdpWatts: 320,
      radiatorSizeMm: 360,
      radiatorThicknessMm: 27,
      pumpRpm: 3600,
      hasVrmFan: false,
      hasLcdScreen: true,
      lcdScreenSizeInches: 2.88
    }
  },

  // ================= PC COOLANTS =================
  {
    id: 'clt-1',
    sku: 'CLT-EK-CRYOFUEL-CLR-1L',
    name: 'EKWB EK-CryoFuel Clear Premix (1000mL)',
    brand: 'EKWB',
    category: 'coolant',
    price: 1999,
    imageFileName: 'ek-cryofuel-clear.png',
    stock: 25,
    coolantSpecs: {
      coolantType: 'transparent',
      volumeMl: 1000,
      baseChemistry: 'High-purity deionized water + biological/scale inhibitors',
      compatibleMetals: ['Copper', 'Brass', 'Nickel'],
      compatibleTubing: ['Acrylic', 'PETG', 'EPDM', 'Glass'],
      drainIntervalMonths: 24,
      readyToUse: true
    }
  },
  {
    id: 'clt-2',
    sku: 'CLT-COR-XL8-BLU-1L',
    name: 'Corsair Hydro X Series XL8 Coolant (Translucent Blue, 1L)',
    brand: 'Corsair',
    category: 'coolant',
    price: 2149,
    imageFileName: 'corsair-xl8-blue.png',
    stock: 14,
    coolantSpecs: {
      coolantType: 'transparent',
      volumeMl: 1000,
      baseChemistry: 'Low-viscosity anti-corrosion/algaecide dyed solution',
      compatibleMetals: ['Copper', 'Brass', 'Nickel'],
      compatibleTubing: ['PMMA', 'Acrylic', 'PETG', 'PVC'],
      drainIntervalMonths: 18,
      readyToUse: true
    }
  },
  {
    id: 'clt-3',
    sku: 'CLT-EK-CRYOFUEL-SOLID-WHT',
    name: 'EKWB EK-CryoFuel Solid Cloud White (1000mL)',
    brand: 'EKWB',
    category: 'coolant',
    price: 2399,
    imageFileName: 'ek-cryofuel-solid-white.png',
    stock: 8,
    coolantSpecs: {
      coolantType: 'opaque_pastel',
      volumeMl: 1000,
      baseChemistry: 'Suspension nano-particulate opaque fluid',
      compatibleMetals: ['Copper', 'Brass', 'Nickel'],
      compatibleTubing: ['Acrylic', 'PETG'],
      drainIntervalMonths: 12,
      readyToUse: true
    }
  },
  {
    id: 'clt-4',
    sku: 'CLT-EK-MYSTIC-FOG-1L',
    name: 'EKWB EK-CryoFuel Mystic Fog (1000mL)',
    brand: 'EKWB',
    category: 'coolant',
    price: 2599,
    imageFileName: 'ek-mystic-fog.png',
    stock: 7,
    coolantSpecs: {
      coolantType: 'opaque_pastel',
      volumeMl: 1000,
      baseChemistry: 'Light-scattering semi-translucent particulate fluid',
      compatibleMetals: ['Copper', 'Brass', 'Nickel'],
      compatibleTubing: ['Acrylic', 'PETG', 'Glass'],
      drainIntervalMonths: 12,
      readyToUse: true
    }
  },
  {
    id: 'clt-5',
    sku: 'CLT-MAY-BLITZ-SYS',
    name: 'Mayhems Blitz Cleaning System (Part 1 & 2)',
    brand: 'Mayhems',
    category: 'coolant',
    price: 2899,
    imageFileName: 'mayhems-blitz-kit.png',
    stock: 12,
    coolantSpecs: {
      coolantType: 'cleaner',
      volumeMl: 250,
      baseChemistry: 'Acidic radiator descaler + loop pH neutralizing flush',
      compatibleMetals: ['Copper', 'Brass'],
      compatibleTubing: ['Acrylic', 'PETG', 'Glass', 'EPDM'],
      drainIntervalMonths: 0,
      readyToUse: false
    }
  },
  {
    id: 'clt-6',
    sku: 'CLT-PRM-UTOPIA-15ML',
    name: 'PrimoChill Liquid Utopia Biocide Additive (15mL)',
    brand: 'PrimoChill',
    category: 'coolant',
    price: 1350,
    imageFileName: 'primochill-utopia.png',
    stock: 20,
    coolantSpecs: {
      coolantType: 'biocide',
      volumeMl: 15,
      baseChemistry: 'Concentrated algae & bacterial inhibitor for DI water',
      compatibleMetals: ['Copper', 'Brass', 'Nickel', 'Aluminum'],
      compatibleTubing: ['Acrylic', 'PETG', 'PVC', 'EPDM'],
      drainIntervalMonths: 12,
      readyToUse: false
    }
  }
];
