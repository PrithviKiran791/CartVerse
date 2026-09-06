import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-lg border border-neutral-800/80 bg-[#120F17] p-4 space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-44 bg-neutral-900 rounded border border-neutral-800/60" />

      {/* Meta Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-neutral-800 rounded w-1/4" />
        <div className="h-5 bg-neutral-800 rounded w-3/4" />
      </div>

      {/* Specs Box Skeleton */}
      <div className="h-16 bg-neutral-900/90 rounded border border-neutral-800/80" />

      {/* Description Skeleton */}
      <div className="space-y-1">
        <div className="h-3 bg-neutral-850 rounded w-full" />
        <div className="h-3 bg-neutral-850 rounded w-2/3" />
      </div>

      {/* Price & Rating Skeleton */}
      <div className="flex justify-between items-center pt-2 border-t border-neutral-800/60">
        <div className="h-6 bg-neutral-800 rounded w-1/3" />
        <div className="h-4 bg-neutral-800 rounded w-1/4" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="h-9 bg-neutral-900 rounded border border-neutral-800" />
        <div className="h-9 bg-red-950/40 rounded border border-red-900/40" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
