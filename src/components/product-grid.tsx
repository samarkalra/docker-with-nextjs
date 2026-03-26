'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product-card';

interface ProductGridProps {
  initialProducts: Product[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

/**
 * Product grid component with infinite scroll pagination
 * Observes the last product card and triggers onLoadMore when it's near the bottom of viewport
 */
export function ProductGrid({
  initialProducts,
  onLoadMore,
  isLoading,
  hasMore,
}: ProductGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px', // Start loading 100px before reaching the bottom
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection]);

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {initialProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
            <span className="text-sm text-gray-600">Loading more products...</span>
          </div>
        </div>
      )}

      {/* No More Products */}
      {!hasMore && initialProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <p className="text-center text-gray-600">
            No more products to load
          </p>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="mt-8 h-1" />
    </div>
  );
}
