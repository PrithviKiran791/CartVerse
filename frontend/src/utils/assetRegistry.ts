// Local Asset Pipeline & Image Registry for CartVerse
// Resolves local hardware images dynamically using Vite's import.meta.glob

const imageModules = import.meta.glob<{ default: string } | string>(
  '../assets/Components/**/*.{png,jpg,jpeg,webp,avif,svg,PNG,JPG,JPEG,WEBP,AVIF,SVG}',
  { eager: true, import: 'default' }
);

// Pre-index normalized paths
const assetIndex: Record<string, string> = {};
const filenameIndex: Record<string, string> = {};
const categoryIndex: Record<string, Record<string, string>> = {};

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/\\/g, '/')
    .replace(/[^a-z0-9]/g, '');
}

function getBasename(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || path;
}

// Category folder map for CartVerse
const CATEGORY_DIR_MAP: Record<string, string[]> = {
  cpu: ['cpu_image/intel', 'cpu_image/amd'],
  gpu: ['gpu/nvidia', 'gpu/radeon'],
  motherboard: ['motherboard'],
  ssd: ['memory/storage/ssd'],
  hdd: ['memory/storage/hdd'],
  psu: ['power_supply'],
  cabinet: ['pc cabinet'],
  monitor: ['monitors'],
  mouse: ['mouse'],
  keyboard: ['keyboard'],
  headphones: ['headphones'],
  speakers: ['speakers'],
  mousepad: ['mousepad'],
  controller: ['controller'],
  webcam: ['webcam'],
  prebuilt: ['pre-built pc'],
  ram: ['memory/ram'],
  cables: ['cables'],
  cooler: ['cooler', 'liquid cooler'],
  coolant: ['coolant'],
  console: ['console']
};

// Populate indices on startup
Object.entries(imageModules).forEach(([path, resolvedUrl]) => {
  const url = typeof resolvedUrl === 'string' ? resolvedUrl : (resolvedUrl as { default: string })?.default || '';
  if (!url) return;

  const relativeMatch = path.match(/assets\/Components\/(.+)$/i);
  if (relativeMatch && relativeMatch[1]) {
    const relPath = relativeMatch[1].replace(/\\/g, '/');
    assetIndex[relPath] = url;
    assetIndex[relPath.toLowerCase()] = url;
    assetIndex[normalizeKey(relPath)] = url;

    const baseName = getBasename(relPath);
    filenameIndex[baseName] = url;
    filenameIndex[baseName.toLowerCase()] = url;
    filenameIndex[normalizeKey(baseName)] = url;

    // Index by directory
    const dirName = relPath.toLowerCase().substring(0, relPath.lastIndexOf('/'));
    if (!categoryIndex[dirName]) {
      categoryIndex[dirName] = {};
    }
    categoryIndex[dirName][baseName.toLowerCase()] = url;
    categoryIndex[dirName][normalizeKey(baseName)] = url;
  }
});

// Category-themed futuristic SVG Fallback Placeholders
const createCategoryPlaceholderSvg = (category: string, title: string = 'Hardware'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141417"/>
        <stop offset="50%" stop-color="#0e0e11"/>
        <stop offset="100%" stop-color="#050507"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E31B23"/>
        <stop offset="100%" stop-color="#FF5757"/>
      </linearGradient>
      <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <rect x="20" y="20" width="360" height="360" rx="8" fill="none" stroke="url(#grid)" stroke-width="2"/>
    <circle cx="200" cy="180" r="70" fill="#18181f" stroke="#2a2a35" stroke-width="2"/>
    <path d="M170 180 L230 180 M200 150 L200 210" stroke="url(#accent)" stroke-width="4" stroke-linecap="round"/>
    <rect x="180" y="160" width="40" height="40" rx="4" fill="none" stroke="url(#accent)" stroke-width="2"/>
    <text x="200" y="290" text-anchor="middle" fill="#f5f5f5" font-family="system-ui, sans-serif" font-weight="700" font-size="16" letter-spacing="2">${title.toUpperCase()}</text>
    <text x="200" y="315" text-anchor="middle" fill="#888899" font-family="monospace" font-size="12" letter-spacing="1">CARTVERSE GEN-3</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Common hardware path aliases to existing local assets
const ASSET_ALIASES: Record<string, string> = {
  'cpu_image/amd/ryzen_7_7800x3d.jpg': 'cpu_image/amd/amd_ryzen_7_9850x3d.jpeg',
  'ryzen_7_7800x3d.jpg': 'cpu_image/amd/amd_ryzen_7_9850x3d.jpeg',
  'ryzen77800x3d': 'cpu_image/amd/amd_ryzen_7_9850x3d.jpeg',
  'cpu_image/intel/core_i9_14900k.jpg': 'cpu_image/intel/i9_14th_gen.jpg',
  'core_i9_14900k.jpg': 'cpu_image/intel/i9_14th_gen.jpg',
  'corei914900k': 'cpu_image/intel/i9_14th_gen.jpg',
  'gpu/nvidia/rtx_4090.jpg': 'gpu/nvidia/rtx_4080_super.jpg',
  'rtx_4090.jpg': 'gpu/nvidia/rtx_4080_super.jpg',
  'gpu/radeon/radeon_rx_7900_xtx.jpg': 'gpu/radeon/radeon_rx_7900_xtx.jpg',
  'cooler/nzxt kraken elite 360 rgb.jpg': 'liquid cooler/nzxt kraken elite 360 rgb (v2).jpg',
  'cables/psu cables/corsair premium individually sleeved type 4 gen 4.jpg': 'cables/psu cables/custom sleeved cable extension kit.jpg'
};

/**
 * Resolves a local hardware image from the `src/assets/Components/` folder hierarchy.
 * @param imageSlug - The image path, slug or filename
 * @param category - Component category used for strict category matching and fallback
 * @returns Resolved browser image URL or fallback SVG
 */
export const getComponentImage = (imageSlug?: string, category: string = 'hardware'): string => {
  if (!imageSlug) {
    return createCategoryPlaceholderSvg(category, category);
  }

  // 1. Direct match in assetIndex (full path)
  if (assetIndex[imageSlug]) {
    return assetIndex[imageSlug];
  }

  // 2. Normalized lowercase direct match
  const cleanSlug = imageSlug.replace(/\\/g, '/');
  const lowerSlug = cleanSlug.toLowerCase();
  if (assetIndex[lowerSlug]) {
    return assetIndex[lowerSlug];
  }

  // 3. Stripped alphanumeric match
  const normalizedSlug = normalizeKey(cleanSlug);
  if (assetIndex[normalizedSlug]) {
    return assetIndex[normalizedSlug];
  }

  // 3b. Check Hardware Aliases
  const aliased = ASSET_ALIASES[lowerSlug] || ASSET_ALIASES[normalizedSlug];
  if (aliased && assetIndex[aliased]) {
    return assetIndex[aliased];
  }
  if (aliased && assetIndex[normalizeKey(aliased)]) {
    return assetIndex[normalizeKey(aliased)];
  }

  // 4. Category-scoped directory match
  const catKey = category.toLowerCase();
  const validDirs = CATEGORY_DIR_MAP[catKey] || [];
  const baseName = getBasename(cleanSlug);
  const normBase = normalizeKey(baseName);

  for (const dirPrefix of validDirs) {
    for (const [dirKey, files] of Object.entries(categoryIndex)) {
      if (dirKey.startsWith(dirPrefix) || dirKey === dirPrefix) {
        if (files[baseName.toLowerCase()]) return files[baseName.toLowerCase()];
        if (files[normBase]) return files[normBase];
        
        for (const [fKey, fUrl] of Object.entries(files)) {
          if (fKey.includes(normBase) || normBase.includes(fKey)) {
            return fUrl;
          }
        }
      }
    }
  }

  // 5. Global Filename exact match
  if (filenameIndex[baseName]) {
    return filenameIndex[baseName];
  }
  if (filenameIndex[baseName.toLowerCase()]) {
    return filenameIndex[baseName.toLowerCase()];
  }
  if (filenameIndex[normBase]) {
    return filenameIndex[normBase];
  }

  // 6. Return high-tech SVG fallback
  return createCategoryPlaceholderSvg(category, baseName || category);
};

export const resolveAssetUrl = getComponentImage;

export const getAllRegisteredAssetsCount = (): number => {
  return Object.keys(assetIndex).length;
};
