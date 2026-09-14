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
          <div className="space-y-1.5 my-2">
            <div className="text-[11px] font-bold text-neutral-500 uppercase">
              Found {result.products.length} Products:
            </div>
            {result.products.map((p: Product) => (
              <AssistantProductCard key={p.id || p.productId || (p as any)._id} product={p} />
            ))}
          </div>
        );
      }
      return (
        <div className="text-xs text-neutral-500 italic my-2">
          No matching components found in the CartVerse catalog.
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
        <div className={`p-3 rounded border my-2 text-xs ${
          result.isCompatible
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {result.isCompatible ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{result.isCompatible ? 'Build Configuration is Compatible' : 'Compatibility Issues Detected'}</span>
          </div>
          {result.warnings?.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
              {result.warnings.map((w: string, i: number) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          {result.estimatedWattage > 0 && (
            <div className="mt-2 text-[11px] font-medium">
              Estimated Wattage: {result.estimatedWattage}W (Recommended PSU: {result.recommendedPsuWattage || Math.round(result.estimatedWattage * 1.3)}W)
            </div>
          )}
        </div>
      );

    case 'getCart':
      return (
        <div className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 my-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white mb-1">
            <ShoppingCart className="w-3.5 h-3.5 text-[#FF1E2D]" />
            <span>Current Cart Summary ({result.itemCount} items)</span>
          </div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
            Total: ₹{result.grandTotal?.toLocaleString('en-IN') || 0}
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
