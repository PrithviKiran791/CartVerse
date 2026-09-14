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
    <div className="my-2.5 overflow-x-auto rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <table className="w-full text-left text-xs border-collapse font-sans">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
            <th className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
              Specification
            </th>
            {products.map((p, idx) => (
              <th key={idx} className="p-2 font-bold text-neutral-900 dark:text-white min-w-[120px]">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {attributes.map((attr, idx) => (
            <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
              <td className="p-2 font-semibold text-neutral-500 text-[11px] uppercase">
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
                  <td key={pIdx} className="p-2 text-neutral-800 dark:text-neutral-200">
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
