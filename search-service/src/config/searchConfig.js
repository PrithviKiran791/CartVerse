export const searchConfig = {
  // Field weights for relevance scoring
  queryBy: 'name,tags,sku,brand,category,specsText,subcategory,description',
  queryByWeights: '10,8,9,7,6,5,4,2',

  // Typo tolerance configuration
  numTypos: 2,
  minLen1Typo: 4,
  minLen2Typos: 8,
  dropTokensThreshold: 2,
  typoTokensThreshold: 1,

  // Hardware model code token separators
  // Enables queries like "rtx-4070", "rtx4070", "rtx 4070", "ddr5-6000", "b650-plus" to match consistently
  tokenSeparators: ['-', '_', '/', '.', '+'],
  symbolsToIndex: ['-'],

  // Default faceting fields
  facetBy: 'category,brand,inStock,featured,bestSeller',
  maxFacetValues: 30,

  // Hardware domain synonym dictionary
  synonyms: [
    {
      id: 'gpu-synonyms',
      synonyms: ['gpu', 'graphics card', 'video card', 'rtx', 'gtx', 'radeon', 'geforce'],
    },
    {
      id: 'cpu-synonyms',
      synonyms: ['cpu', 'processor', 'chip', 'ryzen', 'intel core', 'core ultra'],
    },
    {
      id: 'ram-synonyms',
      synonyms: ['ram', 'memory', 'system memory', 'ddr4', 'ddr5'],
    },
    {
      id: 'ssd-synonyms',
      synonyms: ['ssd', 'solid state drive', 'nvme', 'm.2', 'storage'],
    },
    {
      id: 'hdd-synonyms',
      synonyms: ['hdd', 'hard drive', 'hard disk', 'mechanical drive'],
    },
    {
      id: 'motherboard-synonyms',
      synonyms: ['motherboard', 'mobo', 'mainboard', 'system board'],
    },
    {
      id: 'psu-synonyms',
      synonyms: ['psu', 'power supply', 'smps', 'power unit'],
    },
    {
      id: 'case-synonyms',
      synonyms: ['cabinet', 'case', 'chassis', 'pc case', 'tower'],
    },
    {
      id: 'cooler-synonyms',
      synonyms: ['cooler', 'cpu cooler', 'aio', 'liquid cooler', 'heatsink', 'fan'],
    },
    {
      id: 'display-synonyms',
      synonyms: ['monitor', 'screen', 'display', 'gaming monitor'],
    },
    {
      id: 'audio-synonyms',
      synonyms: ['headphones', 'headset', 'earphones', 'gaming headset'],
    },
    {
      id: 'wheel-synonyms',
      synonyms: ['wheel', 'steering wheel', 'sim racing', 'racing wheel', 'pedals', 'wheelbase'],
    },
    {
      id: 'keyboard-synonyms',
      synonyms: ['keyboard', 'keeb', 'mechanical keyboard'],
    },
    {
      id: 'mouse-synonyms',
      synonyms: ['mouse', 'gaming mouse', 'mice'],
    },
  ],

  // Common hardware queries and search terms
  popularSearches: [
    'RTX 4070 Super',
    'Ryzen 7 7800X3D',
    'DDR5 RAM',
    'NVMe Gen4 SSD',
    'B650 Motherboard',
    '850W Gold PSU',
    'Sim Racing Wheel',
    '144Hz Gaming Monitor',
  ],

  // Stopwords to avoid diluting PC hardware searches
  stopwords: ['the', 'a', 'an', 'and', 'or', 'for', 'with', 'in', 'of', 'to', 'at', 'by'],
};
