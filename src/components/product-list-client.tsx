'use client';
import { ProductGrid } from '@/components/product-grid';
import { Product, ProductsResponse } from '@/types/product';
import { productService } from '@/lib/services/product.service';
import { useProducts } from '@/hooks/use-products';

interface ProductListClientProps {
  initialData?: ProductsResponse;
}

/**
 * Client component that manages product fetching logic and infinite scroll pagination
 * Separates data fetching logic from the presentation layer
 */
export function ProductListClient({
  initialData,
}: ProductListClientProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useProducts(productService, { initialData });

  // Combine all products from all pages
  const allProducts: Product[] = data?.pages.flatMap((page) => page.products) ?? [];

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            Failed to load products
          </p>
          <p className="mt-2 text-gray-600">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <span className="text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <ProductGrid
      initialProducts={allProducts}
      onLoadMore={() => fetchNextPage()}
      isLoading={isFetchingNextPage}
      hasMore={!!hasNextPage}
    />
  );
}
