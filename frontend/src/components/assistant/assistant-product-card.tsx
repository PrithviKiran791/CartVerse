import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { useAssistantStore } from '../../store/useAssistantStore';

interface AssistantProductCardProps {
  product: Product;
}

export const AssistantProductCard: React.FC<AssistantProductCardProps> = ({ product }) => {
  const { addItem, openCart } = useCartStore();
  const toast = useToastStore.getState();
  const { closeAssistant } = useAssistantStore();

  const imgUrl = getComponentImage(product.imageSlug, product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`Added ${product.name} to your cart!`);
    openCart();
  };

  return (
    <div className="my-3 rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#151518] p-3 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#FF1E2D] transition-all">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-none border border-neutral-900 dark:border-neutral-700 bg-neutral-100 dark:bg-black p-1 flex items-center justify-center shrink-0">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[9px] uppercase font-black tracking-widest text-[#FF1E2D] border border-[#FF1E2D]/60 bg-[#FF1E2D]/10 px-1.5 py-0.5 rounded-none">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-400 text-[10px]">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="ml-0.5 font-mono text-neutral-600 dark:text-neutral-300 font-bold">
                {product.rating ? Number(product.rating).toFixed(1) : '4.5'}
              </span>
            </div>
          </div>

          <h4 className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-white truncate mt-1" title={product.name}>
            {product.name}
          </h4>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-xs font-black text-neutral-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono text-[10px] text-neutral-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 pt-2 border-t-2 border-neutral-900/20 dark:border-neutral-800 flex items-center justify-end gap-2">
        <Link
          to={`/product/${product.id || product.productId || (product as any)._id}`}
          onClick={closeAssistant}
          className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 border border-neutral-900 dark:border-neutral-700 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#555555] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:border-[#FF1E2D] hover:text-[#FF1E2D] transition-all"
        >
          <Eye className="w-3 h-3" />
          Details
        </Link>
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border border-neutral-900 dark:border-red-400 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
