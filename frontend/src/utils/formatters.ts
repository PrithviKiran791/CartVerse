import { PCBuildState, Product, BuilderSlotKey } from '../types/hardware';

/**
 * Formats numbers into Indian Rupee (INR / ₹) with standard Indian numbering grouping (e.g. ₹1,49,990)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats power rating in Watts
 */
export const formatWattage = (watts: number): string => {
  return `${watts}W`;
};

/**
 * Serializes the PC builder configuration into a compact URL query string
 */
export const encodeBuildToUrl = (build: PCBuildState): string => {
  const params = new URLSearchParams();
  const slots: (keyof PCBuildState)[] = [
    'cpu',
    'motherboard',
    'ram',
    'gpu',
    'primaryStorage',
    'secondaryStorage',
    'psu',
    'cabinet',
    'cooler',
    'monitor',
    'keyboard',
    'mouse',
    'headphones',
  ];

  slots.forEach((slot) => {
    const item = build[slot];
    if (item && item.id) {
      params.set(slot, item.id);
    }
  });

  return params.toString();
};

/**
 * Restores a PC builder configuration from URL query params
 */
export const decodeBuildFromUrl = (
  paramString: string,
  catalog: Product[]
): Partial<Record<BuilderSlotKey, Product>> => {
  const params = new URLSearchParams(paramString);
  const result: Partial<Record<BuilderSlotKey, Product>> = {};

  const slots: BuilderSlotKey[] = [
    'cpu',
    'motherboard',
    'ram',
    'gpu',
    'primaryStorage',
    'secondaryStorage',
    'psu',
    'cabinet',
    'cooler',
    'monitor',
    'keyboard',
    'mouse',
    'headphones',
  ];

  slots.forEach((slot) => {
    const productId = params.get(slot);
    if (productId) {
      const product = catalog.find((p) => p.id === productId || p.sku === productId);
      if (product) {
        result[slot] = product;
      }
    }
  });

  return result;
};

/**
 * Formats custom PC build into a clean monospace hardware breakdown sheet
 */
export const generateBuildTextSpec = (
  build: PCBuildState,
  totalCost: number,
  estimatedWattage: number
): string => {
  const date = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let spec = `=================================================================\n`;
  spec += `               CARTVERSE CUSTOM PC BUILD SPECIFICATION           \n`;
  spec += `=================================================================\n`;
  spec += `Generated: ${date}\n`;
  spec += `Estimated Total Wattage: ${estimatedWattage} W\n`;
  spec += `Total Build Cost: ${formatCurrency(totalCost)} (Incl. 18% GST)\n`;
  spec += `-----------------------------------------------------------------\n`;
  spec += `SLOT                COMPONENT                                 PRICE\n`;
  spec += `-----------------------------------------------------------------\n`;

  const slotLabels: { key: keyof PCBuildState; label: string }[] = [
    { key: 'cpu', label: 'Processor (CPU)' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'ram', label: 'Memory (RAM)' },
    { key: 'gpu', label: 'Graphics Card' },
    { key: 'primaryStorage', label: 'Primary SSD' },
    { key: 'secondaryStorage', label: 'Secondary Storage' },
    { key: 'psu', label: 'Power Supply (PSU)' },
    { key: 'cabinet', label: 'PC Cabinet' },
    { key: 'cooler', label: 'CPU Cooler' },
    { key: 'monitor', label: 'Monitor' },
    { key: 'keyboard', label: 'Keyboard' },
    { key: 'mouse', label: 'Gaming Mouse' },
    { key: 'headphones', label: 'Headphones' },
  ];

  slotLabels.forEach(({ key, label }) => {
    const item = build[key];
    if (item) {
      const paddedLabel = label.padEnd(19, ' ');
      const paddedName = item.name.length > 39 ? item.name.substring(0, 36) + '...' : item.name.padEnd(39, ' ');
      spec += `${paddedLabel} ${paddedName} ${formatCurrency(item.price).padStart(12, ' ')}\n`;
    }
  });

  spec += `-----------------------------------------------------------------\n`;
  spec += `TOTAL (INR):                                     ${formatCurrency(totalCost).padStart(16, ' ')}\n`;
  spec += `=================================================================\n`;
  spec += `Built on CartVerse Configurator - https://cartverse.in/builder\n`;

  return spec;
};

/**
 * Triggers clean print/PDF view in browser
 */
export const printBuildSpec = (build: PCBuildState, totalCost: number, estimatedWattage: number) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const items = Object.entries(build)
    .filter(([_, prod]) => prod !== null)
    .map(([slot, prod]) => `
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 12px; text-transform: uppercase; font-weight: bold; color: #888; font-size: 12px;">${slot}</td>
        <td style="padding: 12px; font-weight: 600;">${prod.name}</td>
        <td style="padding: 12px; color: #666; font-size: 12px;">${prod.specs.capacity || prod.specs.socket || prod.specs.wattage ? `${prod.specs.socket || ''} ${prod.specs.capacity || ''} ${prod.specs.wattage ? prod.specs.wattage + 'W' : ''}` : '-'}</td>
        <td style="padding: 12px; text-align: right; font-weight: bold;">${formatCurrency(prod.price)}</td>
      </tr>
    `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CartVerse Build Spec - ${new Date().toISOString().split('T')[0]}</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0c0c0e; color: #eee; padding: 40px; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: #141418; padding: 32px; border-radius: 12px; border: 1px solid #282830; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E31B23; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
          .logo span { color: #E31B23; }
          .meta { font-size: 13px; color: #888; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          th { text-align: left; padding: 12px; color: #aaa; font-size: 12px; border-bottom: 2px solid #333; }
          .total-box { margin-top: 30px; background: #1a1a22; padding: 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 14px; text-transform: uppercase; color: #aaa; }
          .total-val { font-size: 28px; font-weight: 800; color: #E31B23; }
          .btn-print { margin-top: 24px; padding: 12px 24px; background: #E31B23; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
          @media print { .btn-print { display: none; } body { background: #fff; color: #111; } .container { border: none; background: #fff; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CART<span>VERSE</span></div>
            <div class="meta">
              <div>Custom PC Specification</div>
              <div>Estimated TDP: <strong>${estimatedWattage} W</strong></div>
              <div>Date: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>SLOT</th>
                <th>COMPONENT</th>
                <th>KEY SPEC</th>
                <th style="text-align: right;">PRICE</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
          <div class="total-box">
            <div>
              <div class="total-label">Total Estimated Investment</div>
              <div style="font-size: 12px; color: #888;">Includes 18% GST & Free Express Insured Shipping</div>
            </div>
            <div class="total-val">${formatCurrency(totalCost)}</div>
          </div>
          <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
};
