import { ProductsResponse } from '@/types/product';

const API_BASE_URL = 'https://dummyjson.com';

export interface IProductService {
  fetchProducts(limit: number, skip: number): Promise<ProductsResponse>;
}

/**
 * Default implementation of ProductService using the DummyJSON API
 * This implementation is mockable for testing purposes
 */
class ProductService implements IProductService {
  async fetchProducts(limit: number, skip: number): Promise<ProductsResponse> {
    const url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;
    
    const response = await fetch(url, {
      // Cache strategy for SSR - revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const productService = new ProductService();

// Export class for testing/mocking
export { ProductService };
