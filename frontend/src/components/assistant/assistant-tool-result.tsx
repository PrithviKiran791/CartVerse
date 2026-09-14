import React from 'react';
import { AssistantProductCard } from './assistant-product-card';
import { AssistantComparison } from './assistant-comparison';
import { AssistantBuildCard } from './assistant-build-card';
import { ShieldCheck, AlertCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../../types/hardware';

interface AssistantToolResultProps {
  toolName: string;
  result: any;
}

export const AssistantToolResult: React.FC<AssistantToolResultProps> = ({
  toolName,
  result,
}) => {
  if (!result) return null;

  switch (toolName) {
    case 'searchProducts':
      if (Array.isArray(result.products) && result.products.length > 0) {
        return (
          <div className="space-y-2 my-2">
            <div className="text-[10px] font-mono font-bold text-[#FF1E2D] uppercase tracking-wider">
              // CATALOG_MATCHES [{result.products.length}]
            </div>
            {result.products.map((p: Product) => (
              <AssistantProductCard key={p.id || p.productId || (p as any)._id} product={p} />
            ))}
          </div>
        );
      }
      return (
        <div className="text-xs font-mono text-neutral-500 italic my-2">
          // NO_MATCHES_FOUND in the CartVerse catalog.
        </div>
      );

    case 'getProduct':
      if (result.product) {
        return <AssistantProductCard product={result.product} />;
      }
      return null;

    case 'compareProducts':
      if (Array.isArray(result.products) && result.products.length > 0) {
        return <AssistantComparison products={result.products} attributes={result.attributes} />;
      }
      return null;

    case 'checkCompatibility':
      return (
        <div className={`p-3 rounded-none border-2 my-2 text-xs font-mono shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D] ${
          result.isCompatible
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-600 text-emerald-900 dark:text-emerald-200'
            : 'bg-red-50 dark:bg-red-950/20 border-red-600 text-red-900 dark:text-red-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-1 uppercase tracking-wider">
            {result.isCompatible ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <span>{result.isCompatible ? '// CONFIGURATION_COMPATIBLE' : '// COMPATIBILITY_WARNING'}</span>
          </div>
          {result.warnings?.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 mt-1">
              {result.warnings.map((w: string, i: number) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          {result.estimatedWattage > 0 && (
            <div className="mt-2 text-[11px] font-bold">
              EST. WATTAGE: {result.estimatedWattage}W (RECOMMENDED PSU: {result.recommendedPsuWattage || Math.round(result.estimatedWattage * 1.3)}W)
            </div>
          )}
        </div>
      );

    case 'getCart':
      return (
        <div className="p-3 rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#151518] my-2 text-xs font-mono shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-wider text-xs">
            <ShoppingCart className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span>// ACTIVE_CART [{result.itemCount} ITEMS]</span>
          </div>
          <div className="text-[11px] text-neutral-700 dark:text-neutral-300 font-bold">
            TOTAL: ₹{result.grandTotal?.toLocaleString('en-IN') || 0}
          </div>
        </div>
      );

    case 'getBuild':
      if (result.build) {
        return (
          <AssistantBuildCard
            title={result.title || 'Your Active PC Configuration'}
            build={result.build}
            estimatedTotal={result.totalPrice}
            estimatedWattage={result.estimatedWattage}
            notes={result.notes}
          />
        );
      }
      return null;

    default:
      return null;
  }
};
