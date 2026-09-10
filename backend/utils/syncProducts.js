import fs from 'fs';
import path from 'path';

const mockPath = path.resolve('frontend/src/data/mockProducts.ts');
const raw = fs.readFileSync(mockPath, 'utf8');

// Find index of `= [`
const assignmentIndex = raw.indexOf('= [');
if (assignmentIndex !== -1) {
  const jsonStart = assignmentIndex + 2;
  const jsonEnd = raw.lastIndexOf(']');
  const jsonStr = raw.substring(jsonStart, jsonEnd + 1);
  try {
    const products = JSON.parse(jsonStr);
    console.log(`[Sync] Successfully extracted ${products.length} products from frontend catalog.`);
    fs.writeFileSync('backend/data/products.json', JSON.stringify(products, null, 2), 'utf8');
    console.log('[Sync] Created backend/data/products.json');
  } catch (err) {
    console.error('[Sync Error] Failed parsing JSON:', err.message);
  }
} else {
  console.error('[Sync Error] Could not find "= [" in mockProducts.ts');
}
