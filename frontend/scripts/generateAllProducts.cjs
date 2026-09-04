const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'assets', 'Components');
const outputDir = path.join(__dirname, '..', 'src', 'data');

const files = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(png|jpe?g|webp|svg)$/i.test(entry.name)) {
      files.push(path.relative(baseDir, full).replace(/\\/g, '/'));
    }
  }
}

walk(baseDir);
console.log(`Found ${files.length} component image assets.`);

// Helper functions for naming and specs
function cleanFilename(fn) {
  return fn
    .replace(/\.(png|jpe?g|webp|svg)$/i, '')
    .replace(/[,\.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBrand(name, folder) {
  const n = name.toLowerCase();
  const f = folder.toLowerCase();

  if (n.includes('asus') || n.includes('rog') || n.includes('tuf')) return 'ASUS';
  if (n.includes('msi')) return 'MSI';
  if (n.includes('gigabyte') || n.includes('aorus')) return 'Gigabyte';
  if (n.includes('asrock')) return 'ASRock';
  if (n.includes('amd') || n.includes('ryzen') || f.includes('amd') || f.includes('radeon')) return 'AMD';
  if (n.includes('intel') || n.includes('core ') || f.includes('intel')) return 'Intel';
  if (n.includes('nvidia') || n.includes('geforce') || f.includes('nvidia')) return 'NVIDIA';
  if (n.includes('corsair') || f.includes('cosair')) return 'Corsair';
  if (n.includes('gskill') || n.includes('g.skill') || f.includes('gskill')) return 'G.Skill';
  if (n.includes('adata') || n.includes('xpg') || f.includes('adata')) return 'ADATA';
  if (n.includes('kingston') || n.includes('fury') || f.includes('kingston')) return 'Kingston';
  if (n.includes('crucial') || f.includes('crucial')) return 'Crucial';
  if (n.includes('samsung')) return 'Samsung';
  if (n.includes('wd') || n.includes('western digital')) return 'Western Digital';
  if (n.includes('seagate')) return 'Seagate';
  if (n.includes('toshiba')) return 'Toshiba';
  if (n.includes('deepcool') || f.includes('deepcool')) return 'Deepcool';
  if (n.includes('cooler master')) return 'Cooler Master';
  if (n.includes('nzxt')) return 'NZXT';
  if (n.includes('lian li') || n.includes('lancool')) return 'Lian Li';
  if (n.includes('ant esports') || n.includes('ant-esports')) return 'Ant Esports';
  if (n.includes('razer')) return 'Razer';
  if (n.includes('logitech')) return 'Logitech';
  if (n.includes('steelseries')) return 'SteelSeries';
  if (n.includes('hyperx')) return 'HyperX';
  if (n.includes('redragon')) return 'Redragon';
  if (n.includes('wooting')) return 'Wooting';
  if (n.includes('keychron')) return 'Keychron';
  if (n.includes('edifier')) return 'Edifier';
  if (n.includes('creative')) return 'Creative';
  if (n.includes('presonus')) return 'PreSonus';
  if (n.includes('elgato')) return 'Elgato';
  if (n.includes('sony')) return 'Sony';
  if (n.includes('xbox') || n.includes('microsoft')) return 'Microsoft';
  if (n.includes('ugreen')) return 'Ugreen';
  if (n.includes('benq')) return 'BenQ';
  if (n.includes('viewsonic')) return 'ViewSonic';
  if (n.includes('alienware') || n.includes('dell')) return 'Dell';
  if (n.includes('zebronics') || n.includes('zebronic')) return 'Zebronics';
  if (n.includes('frontech')) return 'Frontech';
  if (n.includes('lexar') || f.includes('lexar')) return 'Lexar';
  if (n.includes('teamgroup') || f.includes('teamgroup')) return 'TeamGroup';
  if (n.includes('klev') || f.includes('klev')) return 'Klevv';
  if (n.includes('cougar')) return 'Cougar';
  if (n.includes('antec')) return 'Antec';
  if (n.includes('fractal')) return 'Fractal Design';
  if (n.includes('montech')) return 'Montech';
  if (n.includes('hyte')) return 'HYTE';
  if (n.includes('inwin')) return 'InWin';
  if (n.includes('gamesir')) return 'GameSir';
  if (n.includes('8bitdo')) return '8BitDo';
  if (n.includes('audioengine')) return 'Audioengine';
  if (n.includes('audio-technica')) return 'Audio-Technica';
  if (n.includes('beyerdynamic')) return 'Beyerdynamic';
  if (n.includes('insta360')) return 'Insta360';
  if (n.includes('anker')) return 'Anker';
  if (f.includes('pre-built')) return 'CartVerse Signature';
  return 'CartVerse Custom';
}

function determineCategory(relPath) {
  const p = relPath.toLowerCase();
  if (p.startsWith('cpu_image/')) return 'cpu';
  if (p.startsWith('gpu/')) return 'gpu';
  if (p.startsWith('motherboard/')) return 'motherboard';
  if (p.startsWith('memory/ram/')) return 'ram';
  if (p.startsWith('memory/storage/ssd/')) return 'ssd';
  if (p.startsWith('memory/storage/hdd/')) return 'hdd';
  if (p.startsWith('power_supply/')) return 'psu';
  if (p.startsWith('pc cabinet/')) return 'cabinet';
  if (p.startsWith('monitors/')) return 'monitor';
  if (p.startsWith('keyboard/')) return 'keyboard';
  if (p.startsWith('mouse/')) return 'mouse';
  if (p.startsWith('mousepad/')) return 'mousepad';
  if (p.startsWith('headphones/')) return 'headphones';
  if (p.startsWith('speakers/')) return 'speakers';
  if (p.startsWith('webcam/')) return 'webcam';
  if (p.startsWith('controller/')) return 'controller';
  if (p.startsWith('cables/')) return 'cables';
  if (p.startsWith('pre-built pc/')) return 'prebuilt';
  return 'accessory';
}

const products = [];

files.forEach((file, index) => {
  const parts = file.split('/');
  const filename = parts[parts.length - 1];
  const rawName = cleanFilename(filename);
  const folder = parts[0];
  const category = determineCategory(file);
  const brand = extractBrand(rawName, file);

  // Skip pure logo images
  if (/logo/i.test(rawName) && !rawName.includes('AMD_Ryzen') && !rawName.includes('Intel_Core')) {
    return;
  }

  let name = rawName;
  if (!name.toLowerCase().includes(brand.toLowerCase()) && brand !== 'CartVerse Custom' && brand !== 'CartVerse Signature') {
    name = `${brand} ${name}`;
  }
  name = name.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

  // Create unique ID & SKU
  const safeId = `prod-${category}-${index + 1}-${rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}`;
  const sku = `CV-${category.slice(0, 3).toUpperCase()}-${(1000 + index).toString()}`;

  let price = 5000;
  let originalPrice = undefined;
  let specs = {};
  let tags = [];
  let description = `${name} engineered for high reliability, premium build quality, and superior performance.`;

  const n = name.toLowerCase();

  // Category specific deductions:
  if (category === 'cpu') {
    if (n.includes('threadripper')) {
      price = 185000;
      specs = { socket: 'sTR5', cores: 32, threads: 64, tdp: 350, speed: '5.1 GHz Boost', ramType: 'DDR5' };
      tags = ['sTR5', 'Workstation', '32-Core', 'DDR5'];
    } else if (n.includes('epyc')) {
      price = 145000;
      specs = { socket: 'SP3', cores: 32, threads: 64, tdp: 200, speed: '3.35 GHz', ramType: 'DDR4' };
      tags = ['SP3', 'Server', '32-Core', 'DDR4'];
    } else if (n.includes('9950') || n.includes('9900')) {
      price = 59999;
      specs = { socket: 'AM5', cores: 16, threads: 32, tdp: 170, speed: '5.7 GHz Boost', ramType: 'DDR5' };
      tags = ['AM5', 'Zen 5', '16-Core', 'DDR5'];
    } else if (n.includes('9850') || n.includes('9800') || n.includes('7800x3d') || n.includes('7500x3d')) {
      price = 44999;
      specs = { socket: 'AM5', cores: 8, threads: 16, tdp: 120, speed: '5.2 GHz Boost', ramType: 'DDR5' };
      tags = ['AM5', '3D V-Cache', '8-Core', 'Gaming King', 'DDR5'];
    } else if (n.includes('7700') || n.includes('7600') || n.includes('7th') || n.includes('8700g') || n.includes('8600g') || n.includes('8500g') || n.includes('9th') || n.includes('8th')) {
      price = n.includes('7700') ? 29999 : 19499;
      specs = { socket: 'AM5', cores: 8, threads: 16, tdp: 105, speed: '5.4 GHz Boost', ramType: 'DDR5' };
      tags = ['AM5', 'DDR5', 'PCIe 5.0'];
    } else if (n.includes('5th') || n.includes('4th') || n.includes('3rd') || n.includes('5600') || n.includes('5700') || n.includes('3600')) {
      price = n.includes('7') ? 16499 : n.includes('5') ? 11999 : 7999;
      specs = { socket: 'AM4', cores: 6, threads: 12, tdp: 65, speed: '4.6 GHz Boost', ramType: 'DDR4' };
      tags = ['AM4', 'DDR4', 'Value'];
    } else if (n.includes('ultra 9') || n.includes('ultra 7') || n.includes('ultra 5') || n.includes('ultra')) {
      price = n.includes('9') ? 56999 : n.includes('7') ? 41999 : 28999;
      specs = { socket: 'LGA1851', cores: 20, threads: 20, tdp: 125, speed: '5.5 GHz Boost', ramType: 'DDR5' };
      tags = ['LGA1851', 'Arrow Lake', 'AI NPU', 'DDR5'];
    } else if (n.includes('i9')) {
      price = n.includes('14') ? 52999 : n.includes('13') ? 44999 : n.includes('12') ? 34999 : 27999;
      specs = { socket: n.includes('11') ? 'LGA1200' : 'LGA1700', cores: 24, threads: 32, tdp: 125, speed: '5.8 GHz Turbo', ramType: 'DDR5' };
      tags = [n.includes('11') ? 'LGA1200' : 'LGA1700', 'Flagship Multi-Core'];
    } else if (n.includes('i7')) {
      price = n.includes('14') ? 36999 : n.includes('13') ? 31999 : n.includes('12') ? 24999 : 18999;
      specs = { socket: n.includes('11') ? 'LGA1200' : 'LGA1700', cores: 20, threads: 28, tdp: 125, speed: '5.6 GHz Turbo', ramType: 'DDR5' };
      tags = [n.includes('11') ? 'LGA1200' : 'LGA1700', 'Enthusiast Gaming'];
    } else if (n.includes('i5')) {
      price = n.includes('14') ? 19999 : n.includes('13') ? 16999 : n.includes('12') ? 12999 : 9999;
      specs = { socket: n.includes('11') ? 'LGA1200' : 'LGA1700', cores: 14, threads: 20, tdp: 65, speed: '4.8 GHz Turbo', ramType: 'DDR5' };
      tags = [n.includes('11') ? 'LGA1200' : 'LGA1700', 'Mainstream'];
    } else {
      price = 8499;
      specs = { socket: 'LGA1700', cores: 4, threads: 8, tdp: 60, speed: '4.5 GHz', ramType: 'DDR4' };
      tags = ['LGA1700', 'Entry Level'];
    }
  } else if (category === 'gpu') {
    if (n.includes('5090') || n.includes('4090')) {
      price = n.includes('5090') ? 289999 : 219999;
      specs = { tdp: 450, vram: '24GB GDDR6X', gpuLengthMm: 357, speed: '2640 MHz Boost' };
      tags = ['24GB VRAM', '4K Extreme', 'DLSS 3.5'];
    } else if (n.includes('5080') || n.includes('4080')) {
      price = 104999;
      specs = { tdp: 320, vram: '16GB GDDR6X', gpuLengthMm: 342, speed: '2595 MHz Boost' };
      tags = ['16GB VRAM', '4K Gaming'];
    } else if (n.includes('5070') || n.includes('4070 ti') || n.includes('7900 xtx') || n.includes('7900 xt')) {
      price = 82999;
      specs = { tdp: 285, vram: '16GB GDDR6X', gpuLengthMm: 308, speed: '2625 MHz Boost' };
      tags = ['16GB VRAM', '1440p / 4K'];
    } else if (n.includes('4070') || n.includes('7800 xt') || n.includes('7700 xt') || n.includes('3080')) {
      price = 54999;
      specs = { tdp: 220, vram: '12GB GDDR6X', gpuLengthMm: 290, speed: '2475 MHz Boost' };
      tags = ['12GB VRAM', '1440p Master'];
    } else if (n.includes('4060 ti') || n.includes('6750') || n.includes('3070')) {
      price = 37999;
      specs = { tdp: 160, vram: '8GB GDDR6', gpuLengthMm: 245, speed: '2535 MHz Boost' };
      tags = ['8GB VRAM', 'High FPS 1080p/1440p'];
    } else if (n.includes('4060') || n.includes('7600') || n.includes('3060') || n.includes('6600')) {
      price = 26999;
      specs = { tdp: 115, vram: '8GB GDDR6', gpuLengthMm: 215, speed: '2460 MHz Boost' };
      tags = ['8GB VRAM', '1080p Esports'];
    } else if (n.includes('3050') || n.includes('1660') || n.includes('1650') || n.includes('5500') || n.includes('580') || n.includes('570')) {
      price = 14999;
      specs = { tdp: 90, vram: '6GB GDDR6', gpuLengthMm: 200, speed: '1800 MHz' };
      tags = ['6GB VRAM', 'Budget'];
    } else {
      price = 4999;
      specs = { tdp: 40, vram: '2GB GDDR5', gpuLengthMm: 160, speed: '1200 MHz' };
      tags = ['Display Out', 'Low Power'];
    }
  } else if (category === 'motherboard') {
    if (n.includes('x870') || n.includes('x670')) {
      price = 34999;
      specs = { socket: 'AM5', ramType: 'DDR5', ramSlots: 4, formFactor: 'ATX', tdp: 45 };
      tags = ['AM5', 'DDR5', 'PCIe 5.0', 'WiFi 7', 'ATX'];
    } else if (n.includes('z890') || n.includes('b860')) {
      price = n.includes('z890') ? 42999 : 19999;
      specs = { socket: 'LGA1851', ramType: 'DDR5', ramSlots: 4, formFactor: n.includes('m-') ? 'Micro-ATX' : 'ATX', tdp: 45 };
      tags = ['LGA1851', 'DDR5', 'Arrow Lake Ready'];
    } else if (n.includes('z790')) {
      price = 28999;
      specs = { socket: 'LGA1700', ramType: 'DDR5', ramSlots: 4, formFactor: 'ATX', tdp: 40 };
      tags = ['LGA1700', 'DDR5', 'PCIe 5.0', 'ATX'];
    } else if (n.includes('b650')) {
      price = 15999;
      specs = { socket: 'AM5', ramType: 'DDR5', ramSlots: 4, formFactor: n.includes('m-') || n.includes('m ') || n.includes('b650m') ? 'Micro-ATX' : 'ATX', tdp: 35 };
      tags = ['AM5', 'DDR5', 'Mainstream AM5'];
    } else if (n.includes('b760')) {
      const isD4 = n.includes('d4') || n.includes('ddr4');
      price = 13999;
      specs = { socket: 'LGA1700', ramType: isD4 ? 'DDR4' : 'DDR5', ramSlots: 4, formFactor: n.includes('m') ? 'Micro-ATX' : 'ATX', tdp: 35 };
      tags = ['LGA1700', isD4 ? 'DDR4' : 'DDR5'];
    } else if (n.includes('b550') || n.includes('b450')) {
      price = 8499;
      specs = { socket: 'AM4', ramType: 'DDR4', ramSlots: 4, formFactor: 'Micro-ATX', tdp: 25 };
      tags = ['AM4', 'DDR4', 'Budget Legend'];
    } else if (n.includes('h610') || n.includes('h510')) {
      price = 6299;
      specs = { socket: n.includes('h510') ? 'LGA1200' : 'LGA1700', ramType: 'DDR4', ramSlots: 2, formFactor: 'Micro-ATX', tdp: 25 };
      tags = ['Entry Level', 'Micro-ATX', 'DDR4'];
    } else {
      price = 12999;
      specs = { socket: 'AM5', ramType: 'DDR5', ramSlots: 4, formFactor: 'ATX', tdp: 35 };
      tags = ['AM5', 'DDR5'];
    }
  } else if (category === 'ram') {
    const isD5 = n.includes('ddr5') || n.includes('6000') || n.includes('6400') || n.includes('6600') || n.includes('5600') || n.includes('5200');
    const is64 = n.includes('64');
    const is32 = n.includes('32');
    const is8 = n.includes('8gb') || n.includes('8_') || n.includes('8.');
    const capacity = is64 ? '64GB (2x32GB)' : is32 ? '32GB (2x16GB)' : is8 ? '8GB (1x8GB)' : '16GB (2x8GB)';
    price = is64 ? (isD5 ? 21999 : 14999) : is32 ? (isD5 ? 10499 : 6499) : is8 ? (isD5 ? 3299 : 1899) : (isD5 ? 5499 : 3499);
    specs = { ramType: isD5 ? 'DDR5' : 'DDR4', capacity, speed: isD5 ? '6000 MT/s' : '3200 MT/s', tdp: 15 };
    tags = [isD5 ? 'DDR5' : 'DDR4', capacity, isD5 ? 'AMD EXPO / Intel XMP' : 'XMP 2.0'];
  } else if (category === 'ssd') {
    const isGen5 = n.includes('t705') || n.includes('t700') || n.includes('gen5');
    const is4TB = n.includes('4tb');
    const is2TB = n.includes('2tb');
    const is500GB = n.includes('500gb');
    const isSATA = n.includes('bx500') || n.includes('870 evo') || n.includes('a400') || n.includes('sa510') || n.includes('green');
    const capacity = is4TB ? '4TB' : is2TB ? '2TB' : is500GB ? '500GB' : '1TB';
    price = isGen5 ? (is2TB ? 29999 : 17999) : isSATA ? (is2TB ? 11999 : is500GB ? 2899 : 5299) : (is4TB ? 34999 : is2TB ? 16999 : is500GB ? 3699 : 7999);
    specs = { storageInterface: isSATA ? 'SATA III' : isGen5 ? 'PCIe 5.0 NVMe' : 'PCIe 4.0 NVMe', capacity, speed: isGen5 ? '14,500 MB/s' : isSATA ? '560 MB/s' : '7400 MB/s', tdp: 8 };
    tags = [isSATA ? '2.5" SATA' : isGen5 ? 'PCIe 5.0 NVMe' : 'PCIe 4.0 NVMe', capacity];
  } else if (category === 'hdd') {
    const matchTB = n.match(/(\d+)tb/i);
    const tb = matchTB ? parseInt(matchTB[1]) : 2;
    price = tb >= 20 ? 44999 : tb >= 16 ? 32999 : tb >= 12 ? 24999 : tb >= 8 ? 16999 : tb >= 4 ? 8999 : 4999;
    specs = { storageInterface: 'SATA III', capacity: `${tb}TB`, speed: '7200 RPM', tdp: 8 };
    tags = [`${tb}TB`, '7200 RPM', 'SATA 6Gb/s'];
  } else if (category === 'psu') {
    const matchW = n.match(/(\d{3,4})w?/i);
    let wattage = 750;
    if (matchW) {
      const parsed = parseInt(matchW[1]);
      if (parsed >= 400 && parsed <= 1600) wattage = parsed;
    }
    const isGold = n.includes('gold') || wattage >= 750;
    const isPlatinum = n.includes('ai1000p') || n.includes('platinum');
    const rating = isPlatinum ? '80+ Platinum' : isGold ? '80+ Gold' : '80+ Bronze';
    price = wattage >= 1200 ? 21999 : wattage >= 1000 ? 15499 : wattage >= 850 ? 11499 : wattage >= 750 ? 7999 : wattage >= 650 ? 4999 : 2899;
    specs = { wattage, efficiencyRating: rating, modular: wattage >= 750 ? 'Full' : 'Non-Modular' };
    tags = [`${wattage}W`, rating, wattage >= 750 ? 'ATX 3.0 / PCIe 5.0' : 'DC-to-DC'];
  } else if (category === 'cabinet') {
    const isMini = n.includes('mini') || n.includes('ch370') || n.includes('205');
    const isFlagship = n.includes('o11') || n.includes('h9') || n.includes('y70') || n.includes('cosmos') || n.includes('conquer') || n.includes('quadstellar');
    price = isFlagship ? 16999 : isMini ? 3499 : 6499;
    specs = {
      formFactor: isMini ? 'Micro-ATX' : 'ATX',
      supportedFormFactors: isFlagship ? ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'] : isMini ? ['Micro-ATX', 'Mini-ITX'] : ['ATX', 'Micro-ATX', 'Mini-ITX'],
      maxGpuLengthMm: isFlagship ? 435 : isMini ? 320 : 370,
      radiatorSupportMm: isMini ? [120, 240] : [120, 240, 280, 360]
    };
    tags = [isMini ? 'Micro-ATX' : 'Mid-Tower ATX', 'Tempered Glass'];
  } else if (category === 'monitor') {
    const isOLED = n.includes('oled');
    const is4K = n.includes('4k') || n.includes('g8') || n.includes('neo g7') || n.includes('m28u') || n.includes('vx1655');
    const is1440 = n.includes('27') || n.includes('qhd') || n.includes('1440') || n.includes('m27q') || n.includes('ex2710q');
    const is360 = n.includes('360') || n.includes('aw2725df') || n.includes('aw2524hf');
    const is240 = n.includes('240') || isOLED;
    const hz = is360 ? 360 : is240 ? 240 : 180;
    const res = is4K ? '3840x2160' : is1440 ? '2560x1440' : '1920x1080';
    price = isOLED ? (is4K ? 109999 : 69999) : is4K ? 44999 : is1440 ? 24999 : 11999;
    specs = { resolution: res, refreshRateHz: hz, panelType: isOLED ? 'QD-OLED' : 'Fast IPS', tdp: 45 };
    tags = [is4K ? '4K UHD' : is1440 ? '1440p QHD' : '1080p FHD', `${hz}Hz`, isOLED ? 'OLED' : 'Fast IPS'];
  } else if (category === 'keyboard') {
    const isHall = n.includes('wooting') || n.includes('analog') || n.includes('rapid');
    const isCustom = n.includes('azoth') || n.includes('keychron') || n.includes('apex pro');
    price = isHall ? 19999 : isCustom ? 16999 : n.includes('redragon') || n.includes('zebronics') ? 2499 : 7999;
    specs = { switchType: isHall ? 'Hall Effect Magnetic' : 'Mechanical Hot-Swap', connectivity: 'Tri-Mode Wireless / USB-C' };
    tags = [isHall ? 'Rapid Trigger' : 'RGB Mechanical'];
  } else if (category === 'mouse') {
    const isPro = n.includes('superlight') || n.includes('viper v3') || n.includes('deathadder v3') || n.includes('keris ii');
    price = isPro ? 13999 : n.includes('g502') || n.includes('basilisk') ? 4999 : n.includes('ant') || n.includes('zebronic') ? 899 : 2499;
    specs = { sensorDpi: isPro ? 35000 : 16000, connectivity: isPro ? 'HyperSpeed 2.4GHz (8K Polling)' : 'USB Wired' };
    tags = [isPro ? 'Ultralight (<60g)' : 'High Precision'];
  } else if (category === 'mousepad') {
    price = n.includes('artisan') ? 6499 : n.includes('razer atlas') ? 8999 : n.includes('qck') || n.includes('strider') ? 2499 : 699;
    specs = { capacity: 'XL Desktop (490x420mm)' };
    tags = ['Micro-Woven Cloth', 'Anti-Slip Base'];
  } else if (category === 'headphones') {
    const isAudiophile = n.includes('nova pro') || n.includes('dt 770') || n.includes('dt 990') || n.includes('m50x');
    price = isAudiophile ? 29999 : n.includes('cloud iii') || n.includes('blackshark') ? 7999 : n.includes('ant') || n.includes('cosmic') ? 1499 : 3499;
    specs = { connectivity: isAudiophile ? 'Dual 2.4G + Bluetooth / DAC' : '3.5mm + USB' };
    tags = [isAudiophile ? 'Audiophile Grade' : 'Spatial Audio'];
  } else if (category === 'speakers') {
    price = n.includes('audioengine') || n.includes('yamaha') || n.includes('s880db') ? 24999 : n.includes('z623') || n.includes('leviathan') ? 12999 : n.includes('g2000') || n.includes('r1280') ? 6999 : 1499;
    specs = { connectivity: 'Bluetooth 5.3 + Optical + AUX' };
    tags = ['Hi-Res Audio', 'Subwoofer Ready'];
  } else if (category === 'webcam') {
    price = n.includes('facecam') || n.includes('link 2c') || n.includes('mx brio') ? 15499 : n.includes('c922') || n.includes('brio 500') || n.includes('kiyo') ? 7999 : 2499;
    specs = { resolution: n.includes('4k') ? '4K 30FPS' : '1080p 60FPS HDR', connectivity: 'USB-C 3.0' };
    tags = ['HDR Broadcast', 'Auto-Focus'];
  } else if (category === 'controller') {
    price = n.includes('elite') ? 15999 : n.includes('dualsense') || n.includes('xbox') ? 5990 : n.includes('8bitdo') || n.includes('gamesir') ? 3499 : 1499;
    specs = { connectivity: 'Bluetooth + 2.4G Wireless + USB-C' };
    tags = ['Hall Effect Joysticks', 'PC / Console'];
  } else if (category === 'cables') {
    price = n.includes('8k') ? 1499 : n.includes('240w') || n.includes('100w') ? 999 : 499;
    specs = { speed: 'High Speed Gold-Plated' };
    tags = ['Braided', 'Shielded'];
  } else if (category === 'prebuilt') {
    price = n.includes('ares') ? 289999 : n.includes('octans') || n.includes('sagitta') || n.includes('blaze') ? 169999 : 79999;
    specs = { tdp: 650, wattage: 1000 };
    tags = ['Turnkey Ready', 'VIP Warranty'];
  }

  originalPrice = Math.round(price * 1.15);

  const rating = Number((4.3 + (index % 8) * 0.1).toFixed(1));
  const reviewsCount = 15 + ((index * 37) % 450);
  const stock = 5 + ((index * 13) % 45);
  const featured = index % 8 === 0;
  const bestSeller = index % 7 === 0;
  const isNew = index % 10 === 0;

  products.push({
    id: safeId,
    sku,
    name,
    brand,
    category,
    subcategory: `${brand} Hardware`,
    price,
    originalPrice,
    imageSlug: file,
    stock,
    rating,
    reviewsCount,
    featured,
    bestSeller,
    isNew,
    tags,
    specs,
    description
  });
});

console.log(`Generated ${products.length} products successfully.`);

const tsContent = `// Comprehensive CartVerse Hardware Catalog
// Auto-generated catalog containing ALL ${products.length} local hardware assets
import { Product } from '../types/hardware';

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(outputDir, 'mockProducts.ts'), tsContent, 'utf8');
console.log('Successfully wrote to src/data/mockProducts.ts');
