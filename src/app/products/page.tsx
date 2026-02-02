import { Metadata } from 'next';
import { productService } from '@/lib/services/product.service';
import { ProductListClient } from '@/components/product-list-client';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our collection of products',
};

/**
 * Server component for the products page
 * Handles SSR by fetching initial data on the server
 */
async function getInitialProducts() {
  try {
    return await productService.fetchProducts(20, 0);
  } catch (error) {
    console.error('Failed to fetch initial products:', error);
    return null;
  }
}

export default async function ProductsPage() {
  const initialData = await getInitialProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Explore our collection of products~
          </p>
        </div>

        {/* Product List */}
        <ProductListClient initialData={initialData ?? undefined} />
      </div>
    </div>
  );
}

