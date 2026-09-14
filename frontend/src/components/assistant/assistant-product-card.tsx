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
    <div className="my-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 shadow-sm hover:border-[#FF1E2D]/40 transition-colors">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded bg-neutral-100 dark:bg-neutral-800/80 p-1 flex items-center justify-center shrink-0">
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
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF1E2D]">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-400 text-[10px]">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="ml-0.5 text-neutral-600 dark:text-neutral-300 font-bold">
                {product.rating ? Number(product.rating).toFixed(1) : '4.5'}
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate" title={product.name}>
            {product.name}
          </h4>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-neutral-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-2">
        <Link
          to={`/product/${product.id || product.productId || (product as any)._id}`}
          onClick={closeAssistant}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#FF1E2D] dark:hover:text-[#FF1E2D] rounded transition-colors"
        >
          <Eye className="w-3 h-3" />
          Details
        </Link>
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold bg-[#FF1E2D] hover:bg-[#FF3B48] text-white rounded transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
