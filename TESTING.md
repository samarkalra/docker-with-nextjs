# Testing Guide

This document provides comprehensive guidance on how to test the product listing page implementation.

## Testing Philosophy

The code is designed with **testability first** principles:

1. **Dependency Injection** - Services are passed as props, not globally instantiated
2. **Mockable Interfaces** - `IProductService` defines the contract
3. **Separation of Concerns** - Each component has a single responsibility
4. **No Side Effects** - Pure functions and clear data flow
5. **Observable Behavior** - Can verify actions through parameters and outputs

## Unit Testing Components

### Example: Testing `ProductListClient`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductListClient } from '@/components/product-list-client';
import { IProductService } from '@/lib/services/product.service';
import { vi } from 'vitest';

describe('ProductListClient', () => {
  const mockInitialData = {
    products: [
      {
        id: 1,
        title: 'Test Product 1',
        description: 'A test product',
        category: 'Electronics',
        price: 99.99,
        discountPercentage: 10,
        rating: 4.5,
        stock: 5,
        tags: ['test'],
        brand: 'TestBrand',
        sku: 'TEST-001',
        weight: 1,
        dimensions: { width: 10, height: 10, depth: 10 },
        warrantyInformation: '1 year',
        shippingInformation: 'Ships worldwide',
        availabilityStatus: 'In Stock',
        reviews: [],
        returnPolicy: '30 days',
        minimumOrderQuantity: 1,
        meta: {
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          barcode: '123456',
          qrCode: 'qr123',
        },
        images: ['https://example.com/image.jpg'],
        thumbnail: 'https://example.com/thumb.jpg',
      },
    ],
    total: 1,
    skip: 0,
    limit: 20,
  };

  it('displays initial products from SSR data', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ProductListClient initialData={mockInitialData} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });
  });

  it('handles loading state when no initial data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const mockService: IProductService = {
      fetchProducts: vi.fn().mockResolvedValue(mockInitialData),
    };

    // Note: In real tests, you'd need to provide the service to the component
    // This is a simplified example
  });

  it('displays error state when fetch fails', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const mockService: IProductService = {
      fetchProducts: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    // Render component and verify error message is displayed
  });
});
```

### Example: Testing `ProductCard`

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/types/product';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Premium Headphones',
    description: 'High-quality wireless headphones',
    category: 'Electronics',
    price: 199.99,
    discountPercentage: 20,
    rating: 4.8,
    stock: 10,
    tags: ['audio', 'wireless'],
    brand: 'AudioBrand',
    sku: 'AUDIO-001',
    weight: 0.2,
    dimensions: { width: 20, height: 20, depth: 10 },
    warrantyInformation: '2 years',
    shippingInformation: 'Free worldwide shipping',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '60 days',
    minimumOrderQuantity: 1,
    meta: {
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      barcode: '1234567890',
      qrCode: 'qr123',
    },
    images: ['https://example.com/image.jpg'],
    thumbnail: 'https://example.com/thumb.jpg',
  };

  it('displays product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Premium Headphones')).toBeInTheDocument();
  });

  it('displays discount percentage badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('displays discounted price correctly', () => {
    render(<ProductCard product={mockProduct} />);
    const discountedPrice = (199.99 * 0.8).toFixed(2);
    expect(screen.getByText(`$${discountedPrice}`)).toBeInTheDocument();
  });

  it('displays original price crossed out', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$199.99')).toBeInTheDocument();
  });

  it('displays stock status as in stock', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/In Stock/)).toBeInTheDocument();
  });

  it('displays out of stock status when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
```

### Example: Testing `useProducts` Hook

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/hooks/use-products';
import { IProductService } from '@/lib/services/product.service';
import { vi } from 'vitest';
import { ReactNode } from 'react';

describe('useProducts', () => {
  const mockProducts = {
    products: [
      {
        id: 1,
        title: 'Product 1',
        description: 'Desc 1',
        category: 'Cat1',
        price: 10,
        discountPercentage: 0,
        rating: 4,
        stock: 5,
        tags: [],
        brand: 'Brand1',
        sku: 'SKU1',
        weight: 1,
        dimensions: { width: 1, height: 1, depth: 1 },
        warrantyInformation: 'None',
        shippingInformation: 'Standard',
        availabilityStatus: 'In Stock',
        reviews: [],
        returnPolicy: 'None',
        minimumOrderQuantity: 1,
        meta: {
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          barcode: 'bar1',
          qrCode: 'qr1',
        },
        images: [],
        thumbnail: 'thumb1',
      },
    ],
    total: 100,
    skip: 0,
    limit: 20,
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it('fetches initial products with correct parameters', async () => {
    const mockService: IProductService = {
      fetchProducts: vi.fn().mockResolvedValue(mockProducts),
    };

    const { result } = renderHook(() => useProducts(mockService), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.fetchProducts).toHaveBeenCalledWith(20, 0);
    expect(result.current.data?.pages).toHaveLength(1);
  });

  it('calculates next page param correctly', async () => {
    const mockService: IProductService = {
      fetchProducts: vi.fn().mockResolvedValue(mockProducts),
    };

    const { result } = renderHook(() => useProducts(mockService), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns undefined hasNextPage when all products are loaded', async () => {
    const mockService: IProductService = {
      fetchProducts: vi.fn().mockResolvedValue({
        ...mockProducts,
        total: 20,
        skip: 0,
      }),
    };

    const { result } = renderHook(() => useProducts(mockService), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });
});
```

### Example: Testing `ProductService`

```typescript
import { ProductService } from '@/lib/services/product.service';
import { vi } from 'vitest';

describe('ProductService', () => {
  it('fetches products with correct URL parameters', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [],
        total: 0,
        skip: 0,
        limit: 20,
      }),
    });

    const service = new ProductService();
    await service.fetchProducts(20, 0);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=0',
      expect.objectContaining({
        next: { revalidate: 60 },
      })
    );
  });

  it('throws error on failed fetch', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    const service = new ProductService();
    await expect(service.fetchProducts(20, 0)).rejects.toThrow(
      'Failed to fetch products'
    );
  });
});
```

## Integration Testing

### Example: Testing Full Infinite Scroll Flow

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { Product } from '@/types/product';

describe('Infinite Scroll Integration', () => {
  it('loads more products when scrolling to bottom', async () => {
    const mockOnLoadMore = vi.fn();
    const products: Product[] = Array.from({ length: 20 }, (_, i) => ({
      // Product data...
    }));

    const { container } = render(
      <ProductGrid
        initialProducts={products}
        onLoadMore={mockOnLoadMore}
        isLoading={false}
        hasMore={true}
      />
    );

    // Trigger intersection observer target
    const target = container.querySelector('[class="mt-8 h-1"]');
    
    // Simulate scrolling with intersection observer
    // This depends on your test setup and how you mock IntersectionObserver
  });
});
```

## Mocking Strategies

### 1. Mock Service for Testing

```typescript
const createMockService = (data: ProductsResponse): IProductService => ({
  fetchProducts: vi.fn().mockResolvedValue(data),
});
```

### 2. Mock Fetch API

```typescript
global.fetch = vi.fn();
(global.fetch as any).mockResolvedValue({
  ok: true,
  json: async () => mockData,
});
```

### 3. Mock Intersection Observer

```typescript
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver as any;
```

## Test Setup Example

```typescript
// test/setup.ts
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock next/image
vi.mock('next/image', () => ({
  default: (props) => <img {...props} />,
}));
```

## Running Tests

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/dom @testing-library/user-event jsdom

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Key Testing Principles

1. **Test Behavior, Not Implementation**
   - Test what the component does, not how it does it
   - Focus on user interactions and results

2. **Use Meaningful Mocks**
   - Mock only what's necessary
   - Keep mocks close to reality

3. **Test Edge Cases**
   - Empty states
   - Error states
   - Loading states
   - No more items state

4. **Isolate Components**
   - Test components independently
   - Use dependency injection for services

5. **Verify Integration**
   - Test how components work together
   - Verify data flow between components

## Benefits of This Architecture for Testing

✅ **Mockable Services** - Easy to inject test implementations  
✅ **Clear Contracts** - `IProductService` interface is the contract  
✅ **No Global State** - No singletons or global fetches  
✅ **Testable Hooks** - `useProducts` can be tested independently  
✅ **Component Isolation** - Each component can be tested in isolation  
✅ **Observable Behavior** - Can verify calls through mock functions  

## Conclusion

The code is designed to be easily testable with minimal modifications needed. The separation of concerns, dependency injection pattern, and clear interfaces make it straightforward to write comprehensive unit and integration tests.
