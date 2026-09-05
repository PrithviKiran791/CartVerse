import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShoppingCart, Cpu, ChevronRight, Sparkles } from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { Product } from '../../types/hardware';
import { getComponentImage } from '../../utils/assetRegistry';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import CloseButton from '../ui/CloseButton';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const filtered = mockProducts
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 8); // Top 8 matches

    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    addToast({
      title: 'Added to Cart',
      message: `${product.name} added to your shopping cart.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Modal backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#121118] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-[#16151f]">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search processors, GPUs, motherboards, prebuilt PCs..."
            className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 font-medium focus:outline-none text-base"
          />
          {query && (
            <CloseButton onClick={() => setQuery('')} size="sm" variant="ghost" />
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-400 bg-neutral-800 hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results Body */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-800/60 custom-scrollbar">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-neutral-400">
              <div className="flex justify-center mb-3">
                <Sparkles className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-neutral-300">Start typing to search 500+ hardware components</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['RTX 4070', 'Ryzen 7', 'Pre-Built PC', 'DDR5', 'OLED'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1 rounded-full bg-neutral-800/80 text-xs text-neutral-300 hover:bg-red-600 hover:text-white transition-all border border-neutral-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Cpu className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-300">No hardware found for "{query}"</p>
              <p className="text-xs text-neutral-500 mt-1">Try checking for typos or search generic terms like "i7" or "GPU".</p>
            </div>
          ) : (
            results.map((product) => {
              const imgUrl = getComponentImage(product.imageSlug, product.category);
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/60 cursor-pointer transition-all gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0 p-1">
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/50">
                          {product.category}
                        </span>
                        <span className="text-xs text-neutral-400 truncate">{product.brand}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-100 group-hover:text-red-400 transition-colors truncate mt-0.5">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-neutral-100">{formatCurrency(product.price)}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all shadow-md active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 bg-[#16151f] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Showing top {results.length} results</span>
            <button
              onClick={() => {
                onClose();
                navigate(`/products?search=${encodeURIComponent(query)}`);
              }}
              className="text-red-400 font-medium hover:underline flex items-center gap-1"
            >
              View all results in Catalog <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickSearchModal;
