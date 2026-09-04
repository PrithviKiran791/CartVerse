// Local Asset Pipeline & Image Registry for CartVerse
// Resolves local hardware images dynamically using Vite's import.meta.glob

const imageModules = import.meta.glob<{ default: string } | string>(
  '../assets/Components/**/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}',
  { eager: true, import: 'default' }
);

// Pre-index normalized paths for resilient fuzzy matching
const assetIndex: Record<string, string> = {};
const filenameIndex: Record<string, string> = {};

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

// Populate indices on startup
Object.entries(imageModules).forEach(([path, resolvedUrl]) => {
  const url = typeof resolvedUrl === 'string' ? resolvedUrl : (resolvedUrl as { default: string })?.default || '';
  if (!url) return;

  // Key relative to assets/Components
  const relativeMatch = path.match(/assets\/Components\/(.+)$/i);
  if (relativeMatch && relativeMatch[1]) {
    const relPath = relativeMatch[1];
    assetIndex[relPath] = url;
    assetIndex[relPath.toLowerCase()] = url;
    assetIndex[normalizeKey(relPath)] = url;

    const baseName = getBasename(relPath);
    filenameIndex[baseName] = url;
    filenameIndex[baseName.toLowerCase()] = url;
    filenameIndex[normalizeKey(baseName)] = url;
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

/**
 * Resolves a local hardware image from the `src/assets/Components/` folder hierarchy.
 * @param imageSlug - The image path, slug or filename (e.g. "CPU_Image/AMD/Ryzen_7_7th_gen.jpg" or "Ryzen_7_7th_gen.jpg")
 * @param category - Component category used for custom SVG placeholder fallback
 * @returns Resolved browser image URL or fallback SVG
 */
export const getComponentImage = (imageSlug?: string, category: string = 'hardware'): string => {
  if (!imageSlug) {
    return createCategoryPlaceholderSvg(category, category);
  }

  // 1. Direct match in assetIndex
  if (assetIndex[imageSlug]) {
    return assetIndex[imageSlug];
  }

  // 2. Normalized lowercase direct match
  const lowerSlug = imageSlug.toLowerCase().replace(/\\/g, '/');
  if (assetIndex[lowerSlug]) {
    return assetIndex[lowerSlug];
  }

  // 3. Stripped alphanumeric match
  const normalizedSlug = normalizeKey(imageSlug);
  if (assetIndex[normalizedSlug]) {
    return assetIndex[normalizedSlug];
  }

  // 4. Filename only match
  const baseName = getBasename(imageSlug);
  if (filenameIndex[baseName]) {
    return filenameIndex[baseName];
  }
  if (filenameIndex[baseName.toLowerCase()]) {
    return filenameIndex[baseName.toLowerCase()];
  }
  const normBase = normalizeKey(baseName);
  if (filenameIndex[normBase]) {
    return filenameIndex[normBase];
  }

  // 5. Category-based search fallback
  const allEntries = Object.entries(assetIndex);
  const matched = allEntries.find(([key]) => key.toLowerCase().includes(normBase) || normBase.includes(key.toLowerCase()));
  if (matched) {
    return matched[1];
  }

  // 6. Return high-tech SVG fallback
  return createCategoryPlaceholderSvg(category, baseName || category);
};

export const resolveAssetUrl = getComponentImage;

export const getAllRegisteredAssetsCount = (): number => {
  return Object.keys(assetIndex).length;
};
