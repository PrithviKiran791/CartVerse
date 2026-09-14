import React from 'react';
import { Product } from '../../types/hardware';
import { formatCurrency } from '../../utils/formatters';

interface AssistantComparisonProps {
  products: Product[];
  attributes?: { key: string; label: string }[];
}

export const AssistantComparison: React.FC<AssistantComparisonProps> = ({
  products,
  attributes = [
    { key: 'price', label: 'Price' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'rating', label: 'Rating' },
  ],
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="my-2.5 overflow-x-auto rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#121215] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D]">
      <table className="w-full text-left text-xs border-collapse font-mono">
        <thead>
          <tr className="border-b-2 border-neutral-900 dark:border-neutral-800 bg-neutral-100 dark:bg-[#18181C]">
            <th className="p-2.5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
              // SPECIFICATION
            </th>
            {products.map((p, idx) => (
              <th key={idx} className="p-2.5 font-bold text-neutral-950 dark:text-white min-w-[120px] text-xs">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {attributes.map((attr, idx) => (
            <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
              <td className="p-2.5 font-bold text-[#FF1E2D] text-[10px] uppercase tracking-wider">
                {attr.label}
              </td>
              {products.map((p, pIdx) => {
                let val: any = (p as any)[attr.key];
                if (attr.key === 'price') {
                  val = formatCurrency(p.price);
                } else if (attr.key === 'rating') {
                  val = `${p.rating || 4.5} ★`;
                }
                return (
                  <td key={pIdx} className="p-2.5 text-neutral-900 dark:text-neutral-200 text-xs">
                    {val || '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
