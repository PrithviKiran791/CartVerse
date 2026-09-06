import { CoolerSpecs, CoolantSpecs } from './cooling';

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
  | 'coolant'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'mousepad'
  | 'headphones'
  | 'speakers'
  | 'webcam'
  | 'controller'
  | 'cables'
  | 'console'
  | 'prebuilt';

export type CPUSocket = 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851' | 'sTR5' | 'SP3';
export type RAMType = 'DDR4' | 'DDR5';
export type FormFactor = 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
export type StorageInterface = 'SATA III' | 'PCIe 3.0 NVMe' | 'PCIe 4.0 NVMe' | 'PCIe 5.0 NVMe';
export type PanelType = 'Fast IPS' | 'IPS' | 'VA' | 'OLED' | 'QD-OLED';

export interface IntelProcessorSpecs {
  generation: string; // e.g. "14th Gen Core", "Core Ultra Series 2"
  tier: string; // e.g. "Core i9", "Ultra 9"
  exactModel: string; // e.g. "Core i9-14900K"
  suffix: string; // e.g. "K", "HX", "U", "H"
  codename: string; // e.g. "Raptor Lake Refresh-S", "Arrow Lake-S"
  totalCores: number;
  pCores: number;
  eCores: string; // e.g. "16", "8+4 LPE", "0"
  threads: number;
  baseClock: string; // e.g. "3.20 GHz"
  turboClock: string; // e.g. "6.00 GHz"
  l3Cache: string; // e.g. "36 MB"
  baseTdp: string; // e.g. "125W"
  maxTurboPowerPl2: string; // e.g. "253W"
  igpu: string; // e.g. "Intel UHD Graphics 770"
  memorySupport: string; // e.g. "DDR5-5600 / DDR4-3200"
  architecturalNotes: string; // Architectural role & key notes
}

export interface AMDRyzenSpecs {
  generation: string; // e.g. "Ryzen 9000 Series", "Ryzen 7000 Series"
  tier: string; // e.g. "Ryzen 7", "Ryzen 9", "Ryzen AI 9"
  modelName: string; // e.g. "Ryzen 7 9800X3D", "Ryzen 9 9950X"
  platform: string; // e.g. "Desktop CPU", "Desktop APU", "Mobile"
  suffix: string; // e.g. "X3D", "X", "G", "GE", "HX"
  architecture: string; // e.g. "Zen 5", "Zen 4", "Zen 3"
  codename: string; // e.g. "Granite Ridge", "Raphael", "Vermeer"
  processNode: string; // e.g. "TSMC 4nm / 6nm"
  totalCores: number;
  coreBreakdown: string; // e.g. "8x Zen 5", "16x Zen 5"
  threads: number;
  baseClock: string; // e.g. "4.70 GHz"
  boostClock: string; // e.g. "5.20 GHz"
  l3Cache: string; // e.g. "96 MB (3D V-Cache)", "64 MB"
  tdp: string; // e.g. "120W (cTDP 65-105W)"
  igpu: string; // e.g. "AMD Radeon Graphics (2 CU RDNA 2)"
  npu: string; // e.g. "AMD XDNA 2 (50 NPU TOPS)" or "None"
  memorySupport: string; // e.g. "DDR5-5600 (Dual-Channel)"
  architecturalNotes: string; // Architectural notes & features
}

export interface AMDRadeonSpecs {
  series: string; // e.g. "Radeon RX 7000 Series"
  architecture: string; // e.g. "RDNA 3.0", "RDNA 2.0"
  gpuCodename: string; // e.g. "Navi 31 XTX", "Navi 32 XT"
  modelName: string; // e.g. "Radeon RX 7900 XTX"
  marketSegment: string; // e.g. "Desktop Enthusiast", "Desktop Retail"
  processNode: string; // e.g. "TSMC 5nm (GCD) + 6nm (MCD)"
  computeUnits: number; // e.g. 96
  streamProcessors: number; // e.g. 6144
  rayAccelerators: string; // e.g. "96 (2nd Gen)"
  aiAccelerators: string; // e.g. "192 AI Accelerators"
  baseClock: string; // e.g. "1900 MHz"
  gameClock: string; // e.g. "2300 MHz"
  boostClock: string; // e.g. "2500 MHz"
  vram: string; // e.g. "24 GB GDDR6"
  memoryBusWidth: string; // e.g. "384-bit"
  memoryBandwidth: string; // e.g. "960.0 GB/s"
  infinityCache: string; // e.g. "96 MB (2nd Gen)"
  boardPowerTbp: string; // e.g. "355W"
  pcieInterface: string; // e.g. "PCIe 4.0 x16"
  displayOutputs: string; // e.g. "DisplayPort 2.1 (UHBR 13.5), HDMI 2.1a"
  mediaEngine: string; // e.g. "Dual Media Engine with AV1 Encode/Decode"
  apiSupport: string; // e.g. "DirectX 12 Ultimate (12_2), Vulkan 1.3"
  architecturalNotes: string; // Architectural innovations & key technical notes
}

export interface NvidiaGpuSpecs {
  vendor: string; // "NVIDIA"
  brand: string; // "GeForce"
  series: string; // e.g. "RTX 40 Series", "RTX 50 Series", "GTX 10 Series"
  model: string; // e.g. "RTX 4090", "RTX 5090"
  variant: string; // e.g. "Base", "Ti", "Super", "Ti Super", "16GB"
  architecture: string; // e.g. "Ada Lovelace", "Blackwell", "Ampere", "Turing", "Pascal"
  generation: string; // e.g. "Ada", "Blackwell", "Ampere", "Turing"
  isCurrent: string; // "Yes" | "No"
  releaseDate: string; // e.g. "Oct 2022"
  cudaCores: string; // e.g. "16384"
  rtCores: string; // e.g. "128"
  tensorCores: string; // e.g. "512"
  baseClock: string; // e.g. "2235 MHz"
  boostClock: string; // e.g. "2520 MHz"
  vram: string; // e.g. "24GB"
  memoryType: string; // e.g. "GDDR6X", "GDDR7", "GDDR6"
  memoryBus: string; // e.g. "384-bit"
  bandwidth: string; // e.g. "1008 GB/s"
  tgpPower: string; // e.g. "450W"
  pcieInterface: string; // e.g. "PCIe 4.0 x16"
  displaySupport: string; // e.g. "HDMI 2.1a, 3x DisplayPort 1.4a"
  dlssAiFeatures: string; // e.g. "DLSS 3.5 (Frame Gen)", "DLSS 4 (Multi-Frame Gen)"
  mediaEngines: string; // e.g. "2x NVENC (8th Gen AV1) / NVDEC (5th Gen)"
}

export interface MotherboardDetailedSpecs {
  platform: string; // e.g. "AMD AM5", "Intel LGA1700"
  socket: string; // e.g. "AM5", "LGA1700", "LGA1851"
  chipset: string; // e.g. "X870", "B650", "Z790", "B760"
  formFactor: string; // e.g. "ATX", "Micro-ATX", "Mini-ITX"
  ramSlots: string; // e.g. "4x DDR5 (Up to 8000+ MHz OC)"
  networking: string; // e.g. "Wi-Fi 7 + 2.5G LAN"
  targetCpuPairing: string; // e.g. "Ryzen 7 9800X3D, Ryzen 9 9950X"
  pcieSlots?: string;
  m2Slots?: string;
  vrmPhases?: string;
  audioChipset?: string;
  rearIo?: string;
}

export interface SsdDetailedSpecs {
  model: string;
  formFactor: string; // e.g. "M.2 2280 NVMe", "2.5\" SATA III"
  interface: string; // e.g. "PCIe 4.0 x4", "PCIe 5.0 x4", "SATA III"
  readSpeed: string; // e.g. "7450 MB/s"
  writeSpeed: string; // e.g. "6900 MB/s"
  nandType: string; // e.g. "3D TLC", "3D QLC", "BiCS5"
  dramCache: string; // e.g. "2GB LPDDR4", "DRAM-less (HMB)"
  targetWorkload: string; // e.g. "High-end Gaming, 4K/8K Video Editing"
  tbwEndurance?: string;
}

export interface HddDetailedSpecs {
  model: string;
  capacity: string; // e.g. "4TB", "8TB", "16TB"
  rpm: string; // e.g. "7200 RPM", "5400 RPM"
  cache: string; // e.g. "256 MB", "512 MB"
  recordingTech: string; // e.g. "CMR (Conventional)", "SMR"
  workloadRating: string; // e.g. "550 TB/year (24/7 Enterprise)"
  targetDeployment: string; // e.g. "NAS, Video Surveillance, Cold Storage"
  interface: string; // e.g. "SATA III 6Gb/s"
}

export interface PsuDetailedSpecs {
  model: string;
  wattage: string; // e.g. "850W", "1000W"
  efficiencyRating: string; // e.g. "80+ Gold", "80+ Platinum", "80+ Titanium"
  modularity: string; // e.g. "Fully Modular", "Semi-Modular", "Non-Modular"
  atxStandard: string; // e.g. "ATX 3.0 (Native 12VHPWR PCIe 5.0)"
  idealBuild: string; // e.g. "RTX 4080 / 4090 + Core i9 / Ryzen 9"
  fanBearing?: string;
  protectionCircuits?: string;
}

export interface CabinetDetailedSpecs {
  model: string;
  designTheme: string; // e.g. "Open-Air Angular Gunmetal Mecha", "Dual-Chamber Panoramic Glass"
  formFactor: string; // e.g. "ATX / Micro-ATX / E-ATX"
  radiatorSupport: string; // e.g. "Up to 360mm Top & Side"
  gpuClearance: string; // e.g. "Up to 420 mm"
  standoutFeature: string; // e.g. "CNC-Milled Aluminum Armor Wings with 45° Tilted Tray"
  driveBays?: string;
  includedFans?: string;
}

export interface MonitorDetailedSpecs {
  model: string;
  screenSize: string; // e.g. "27\"", "32\"", "34\" Curved Ultrawide"
  resolution: string; // e.g. "2560x1440 (2K QHD)", "3840x2160 (4K UHD)"
  panelType: string; // e.g. "Fast IPS", "QD-OLED", "Fast VA"
  refreshRate: string; // e.g. "240Hz", "360Hz", "180Hz"
  responseTime: string; // e.g. "0.03ms GtG", "1ms GtG"
  hdrSupport?: string; // e.g. "VESA DisplayHDR 400", "HDR True Black 400"
  colorGamut?: string; // e.g. "99% DCI-P3, 135% sRGB"
  ports: string; // e.g. "2x DisplayPort 1.4, 2x HDMI 2.1, USB Hub"
  standFeatures?: string; // e.g. "Height, Pivot, Swivel, Tilt"
  targetUse: string; // e.g. "Competitive Esports & Content Creation"
}

export interface MouseDetailedSpecs {
  model: string;
  sensor: string; // e.g. "Focus Pro 35K Gen-2", "HERO 2", "PixArt PAW3395"
  maxDpi: string; // e.g. "35,000 DPI", "32,000 DPI"
  pollingRate: string; // e.g. "8000Hz (0.125ms)", "4000Hz Wireless"
  switchType: string; // e.g. "Optical Gen-3 (90M clicks)", "Omron Optical"
  weight: string; // e.g. "49g Ultra-Lightweight", "60g"
  connectivity: string; // e.g. "Razer HyperSpeed Wireless + Type-C"
  batteryLife: string; // e.g. "Up to 95 Hours"
  gripStyle: string; // e.g. "Claw / Fingertip (Right-Handed Ergonomic)"
}

export interface KeyboardDetailedSpecs {
  model: string;
  layout: string; // e.g. "75% Compact", "TKL (80%)", "Full Size 100%"
  switchType: string; // e.g. "Magnetic Hall Effect Analog Switches", "Gateron Brown Linear"
  hotSwap: string; // e.g. "Hot-Swappable 5-Pin PCB"
  keycaps: string; // e.g. "Double-Shot PBT Cherry Profile"
  connectivity: string; // e.g. "Tri-Mode (2.4GHz / Bluetooth 5.1 / Type-C)"
  rapidTrigger?: string; // e.g. "Rapid Trigger with 0.1mm - 4.0mm adjustable actuation"
  acousticDampening: string; // e.g. "Gasket Mount with 5-layer Poron foam"
  batteryLife?: string;
}

export interface HeadphonesDetailedSpecs {
  model: string;
  driverType: string; // e.g. "50mm Planar Magnetic", "50mm Titanium-Coated Neodymium"
  frequencyResponse: string; // e.g. "10Hz – 40,000Hz Hi-Res"
  impedance: string; // e.g. "32 Ohms", "250 Ohms"
  acousticDesign: string; // e.g. "Closed-Back Over-Ear", "Open-Back Reference"
  microphone: string; // e.g. "Broadcast-Grade Detachable Cardioid Mic"
  connectivity: string; // e.g. "2.4GHz Ultra-Low Latency + Bluetooth + 3.5mm"
  batteryLife?: string;
  surroundSound?: string; // e.g. "Dolby Atmos, Spatial Audio 7.1"
}

export interface SpeakersDetailedSpecs {
  model: string;
  channelConfig: string; // e.g. "2.0 Desktop Studio Monitors", "2.1 with Subwoofer"
  powerOutput: string; // e.g. "50W RMS (100W Peak)"
  driverConfiguration: string; // e.g. "3.5\" Woven Composite Woofer + 1\" Silk Dome Tweeter"
  frequencyRange: string; // e.g. "80Hz – 20,000Hz"
  inputs: string; // e.g. "Bluetooth 5.0, RCA, 1/4\" TRS Balanced, 3.5mm Aux"
  standoutAcoustics: string; // e.g. "Front-Firing Acoustic Port with Acoustic Tuning Controls"
}

export interface MousepadDetailedSpecs {
  model: string;
  dimensions: string; // e.g. "490 x 420 x 4 mm", "900 x 400 x 4 mm XXL"
  surfaceTexture: string; // e.g. "Micro-Woven Control Cloth", "Aluminosilicate Tempered Glass"
  glideSpeed: string; // e.g. "Zero Friction Ultra-Fast Glide", "High Stopping Power Balance"
  baseMaterial: string; // e.g. "Poron Anti-Slip Base", "Natural Open-Cell Rubber"
  edgeFinish: string; // e.g. "Sub-Surface Ultra-Fine Micro-Stitching"
  targetCompetitiveFit: string; // e.g. "Tactical FPS (Valorant, CS2), Tracking Games (Apex)"
}

export interface ControllerDetailedSpecs {
  model: string;
  layoutStyle: string; // e.g. "Asymmetrical Xbox Style", "Symmetrical PS Style"
  stickTech: string; // e.g. "Hall Effect Contactless Magnetic Sensors (Anti-Drift)"
  triggerTech: string; // e.g. "Microswitch / Hall Effect Dual-Stage Hair Triggers"
  connectivity: string; // e.g. "2.4GHz Wireless Dongle + Bluetooth + Wired USB-C"
  pollingRate: string; // e.g. "1000Hz Ultra-Low Latency"
  inputProtocols: string; // e.g. "X-Input, DirectInput, Switch Mode"
  extraButtons: string; // e.g. "4x Remappable Back Paddles with Mechanical Switches"
}

export interface WebcamDetailedSpecs {
  model: string;
  maxResolution: string; // e.g. "4K @ 30 FPS / 1080p @ 60 FPS"
  sensorType: string; // e.g. "1/2\" Sony STARVIS CMOS Sensor"
  fieldOfView: string; // e.g. "90° / 78° / 65° Adjustable FOV"
  focusSystem: string; // e.g. "Dual Pixel Phase Detection Autofocus (PDAF)"
  microphone: string; // e.g. "Dual Stereo Beamforming Microphones with AI Noise Cancellation"
  privacyShutter: string; // e.g. "Integrated Magnetic Privacy Shutter"
  mounting: string; // e.g. "Universal Clip + 1/4\" Tripod Thread"
}

export interface PrebuiltDetailedSpecs {
  tierName: string; // e.g. "God Tier (Apex Predator)", "Ultra Enthusiast", "Budget Champion"
  targetPerformance: string; // e.g. "4K Ultra Ray-Tracing 144+ FPS", "1440p High 180+ FPS"
  cpuModel: string;
  gpuModel: string;
  motherboard: string;
  ram: string;
  primaryStorage: string;
  psu: string;
  cooler: string;
  cabinet: string;
  operatingSystem: string;
  warranty: string;
}

export interface ConsoleDetailedSpecs {
  consoleModel: string;
  brand: 'Nintendo' | 'Sony' | 'Microsoft' | string;
  releaseYear: string;
  cpuGpuArch?: string;
  memoryStorage?: string;
  displayScreenSpecs?: string;
  targetResolutionFps?: string;
  mediaFormatCompatibility?: string;
  standoutFeaturesLegacy?: string;
  approxMarketPriceInr?: string;
  generation?: string;
}

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
  intelSpecs?: IntelProcessorSpecs;
  ryzenSpecs?: AMDRyzenSpecs;
  radeonSpecs?: AMDRadeonSpecs;
  nvidiaSpecs?: NvidiaGpuSpecs;
  motherboardSpecs?: MotherboardDetailedSpecs;
  ssdSpecs?: SsdDetailedSpecs;
  hddSpecs?: HddDetailedSpecs;
  psuSpecs?: PsuDetailedSpecs;
  cabinetSpecs?: CabinetDetailedSpecs;
  monitorSpecs?: MonitorDetailedSpecs;
  mouseSpecs?: MouseDetailedSpecs;
  keyboardSpecs?: KeyboardDetailedSpecs;
  headphonesSpecs?: HeadphonesDetailedSpecs;
  speakersSpecs?: SpeakersDetailedSpecs;
  mousepadSpecs?: MousepadDetailedSpecs;
  controllerSpecs?: ControllerDetailedSpecs;
  webcamSpecs?: WebcamDetailedSpecs;
  prebuiltSpecs?: PrebuiltDetailedSpecs;
  coolerSpecs?: CoolerSpecs;
  coolantSpecs?: CoolantSpecs;
  consoleSpecs?: ConsoleDetailedSpecs;
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
