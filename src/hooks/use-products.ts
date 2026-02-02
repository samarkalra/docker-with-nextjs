import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductsResponse } from '@/types/product';
import { IProductService } from '@/lib/services/product.service';

interface UseProductsOptions {
  pageSize?: number;
  initialData?: ProductsResponse;
}

/**
 * Hook for fetching products with infinite scroll pagination
 * @param productService - The product service instance to use
 * @param options - Configuration options including pageSize and initialData for SSR
 * @returns InfiniteQuery result with products data and pagination controls
 */
export function useProducts(
  productService: IProductService,
  options: UseProductsOptions = {}
) {
  const pageSize = options.pageSize ?? 20;

  return useInfiniteQuery({
    queryKey: ['products', pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      return productService.fetchProducts(pageSize, pageParam);
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      // Return undefined if we've reached the end
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    initialData: options.initialData
      ? {
          pages: [options.initialData],
          pageParams: [0],
        }
      : undefined,
  });
}
