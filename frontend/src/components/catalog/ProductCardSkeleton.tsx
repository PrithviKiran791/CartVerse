import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#121215] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] p-4 space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-44 bg-neutral-900 rounded-none border-2 border-neutral-800" />

      {/* Meta Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-neutral-800 rounded-none w-1/4" />
        <div className="h-5 bg-neutral-800 rounded-none w-3/4" />
      </div>

      {/* Specs Box Skeleton */}
      <div className="h-16 bg-neutral-900 rounded-none border-2 border-neutral-800" />

      {/* Description Skeleton */}
      <div className="space-y-1">
        <div className="h-3 bg-neutral-850 rounded-none w-full" />
        <div className="h-3 bg-neutral-850 rounded-none w-2/3" />
      </div>

      {/* Price & Rating Skeleton */}
      <div className="flex justify-between items-center pt-2 border-t-2 border-neutral-800">
        <div className="h-6 bg-neutral-800 rounded-none w-1/3" />
        <div className="h-4 bg-neutral-800 rounded-none w-1/4" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="h-9 bg-neutral-900 rounded-none border-2 border-neutral-800 shadow-[2px_2px_0px_0px_#000000]" />
        <div className="h-9 bg-red-950/40 rounded-none border-2 border-red-900/40 shadow-[2px_2px_0px_0px_#FF1E2D]" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
