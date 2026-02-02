# Product Listing Page - Implementation Guide

## Overview

This is a production-ready product listing page with infinite scroll pagination, built with Next.js 16, React 19, TanStack Query, and Tailwind CSS.

## Architecture & Design Patterns

### Key Features
- ✅ **Server-Side Rendering (SSR)** - Initial products loaded on the server for better performance and SEO
- ✅ **Infinite Scroll Pagination** - Uses Intersection Observer API to load more products when user scrolls to bottom
- ✅ **TanStack Query** - Handles data fetching, caching, and synchronization with built-in request deduplication
- ✅ **Dependency Injection** - Service layer accepts injectable dependencies for easy testing and mocking
- ✅ **Minimal & Elegant Design** - Clean product cards with responsive grid layout
- ✅ **Testable & Mockable** - Clear separation of concerns with minimal coupling

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with QueryProvider wrapper
│   ├── page.tsx             # Home page
│   └── products/
│       └── page.tsx         # Products page (SSR)
├── types/
│   └── product.ts           # Product interfaces and types
├── lib/
│   └── services/
│       └── product.service.ts  # Product API service (mockable)
├── providers/
│   └── query-provider.tsx   # TanStack Query provider setup
├── hooks/
│   └── use-products.ts      # Custom hook for infinite scroll pagination
└── components/
    ├── product-card.tsx     # Individual product card component
    ├── product-grid.tsx     # Grid layout with infinite scroll trigger
    └── product-list-container.tsx  # Data fetching container component
```

## Component Architecture

### Separation of Concerns

1. **Page Component** (`products/page.tsx`)
   - Server component for SSR
   - Fetches initial data on the server
   - Passes data to client components

2. **Container Component** (`product-list-container.tsx`)
   - Client component
   - Manages data fetching logic using `useProducts` hook
   - Handles error states and loading states
   - Passes processed data to presentation components

3. **Presentation Components**
   - `ProductGrid` - Handles scroll detection and layout
   - `ProductCard` - Renders individual product UI

### Data Flow

```
ProductsPage (Server Component)
    ↓ fetches initial data
ProductListContainer (Client Component)
    ↓ uses hook to manage queries
useProducts Hook
    ↓ manages infinite query
ProductGrid + ProductCard
    ↓ renders UI
```

## Service Layer Design

### ProductService Pattern

The service layer is designed for testability with dependency injection:

```typescript
// Interface for dependency injection
interface IProductService {
  fetchProducts(limit: number, skip: number): Promise<ProductsResponse>;
}

// Default implementation
class ProductService implements IProductService {
  async fetchProducts(limit: number, skip: number): Promise<ProductsResponse> {
    // Actual API call
  }
}
```

### Why This Design?

1. **Mockable** - Inject a mock service in tests:
   ```typescript
   const mockService: IProductService = {
     fetchProducts: vi.fn().mockResolvedValue(mockData),
   };
   render(<ProductListContainer productService={mockService} />);
   ```

2. **Reusable** - Use the service anywhere:
   ```typescript
   const products = await productService.fetchProducts(20, 0);
   ```

3. **Type-Safe** - Full TypeScript support
4. **Testable** - No global state or singletons in tests

## Infinite Scroll Implementation

The `ProductGrid` component uses the Intersection Observer API:

```typescript
const observer = new IntersectionObserver(handleIntersection, {
  rootMargin: '100px', // Start loading 100px before reaching bottom
  threshold: 0.1,
});
```

**Benefits:**
- Efficient - doesn't spam scroll event listeners
- Customizable - adjust `rootMargin` to change trigger distance
- Accessible - works with keyboard navigation

## TanStack Query Setup

### Query Configuration

```typescript
useInfiniteQuery({
  queryKey: ['products', pageSize],
  queryFn: async ({ pageParam = 0 }) => {
    return productService.fetchProducts(pageSize, pageParam);
  },
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
  initialPageParam: 0,
  initialData: options.initialData, // SSR hydration
});
```

### Key Features:

1. **SSR Hydration** - Initial data from server prevents loading state on page load
2. **Automatic Deduplication** - Duplicate requests within staleTime are deduplicated
3. **Request Coalescing** - Multiple `fetchNextPage()` calls only trigger one request
4. **Caching** - Pages are cached and reused
5. **Stale Time** - Set to 5 minutes (configurable)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@tanstack/react-query` - Data fetching and caching
- Next.js 16, React 19, TypeScript, Tailwind CSS

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Browse Products"

### 3. Build for Production

```bash
npm run build
npm start
```

## Testing Strategy

The code is designed to be easily testable and mockable:

### Example Test Setup

```typescript
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryProvider } from '@/providers/query-provider';
import { ProductListContainer } from '@/components/product-list-container';

describe('ProductListContainer', () => {
  it('displays products from service', async () => {
    const mockService: IProductService = {
      fetchProducts: vi.fn().mockResolvedValue({
        products: [{ id: 1, title: 'Test Product', ... }],
        total: 1,
        skip: 0,
        limit: 20,
      }),
    };

    render(
      <QueryProvider>
        <ProductListContainer productService={mockService} />
      </QueryProvider>
    );

    await screen.findByText('Test Product');
    expect(mockService.fetchProducts).toHaveBeenCalledWith(20, 0);
  });
});
```

### Why It's Testable

1. **Dependency Injection** - Services are passed as props
2. **Clear Interfaces** - `IProductService` defines exact contract
3. **Functional Components** - No lifecycle complications
4. **Separated Concerns** - Each component has single responsibility
5. **Observable Patterns** - Can observe behavior through parameters

## Performance Optimizations

1. **SSR Hydration** - No loading state on initial page load
2. **Request Deduplication** - TanStack Query prevents duplicate requests
3. **Caching** - Products cached for 5 minutes
4. **Image Optimization** - Next.js Image component with responsive sizes
5. **Intersection Observer** - Efficient scroll detection
6. **No Page Refetch** - Only new pages are fetched

## Design Highlights

### Product Card
- Responsive grid (1, 2, 3, 4 columns based on screen size)
- Discount badge
- Star rating
- Stock status indicator
- Image hover effect
- Price with discount calculation

### Color Scheme
- Neutral grays (production-ready)
- Red accents for discounts
- Green for in-stock, Red for out-of-stock
- Smooth hover transitions

### Responsive Breakpoints
- `sm`: 640px - 2 columns
- `lg`: 1024px - 3 columns
- `xl`: 1280px - 4 columns

## Customization

### Change Page Size
In `use-products.ts`, modify the hook:
```typescript
const pageSize = options.pageSize ?? 20; // Change 20 to desired size
```

Or pass option when using hook:
```typescript
useProducts(productService, { pageSize: 10 })
```

### Adjust Scroll Trigger Distance
In `product-grid.tsx`:
```typescript
rootMargin: '100px', // Change to trigger earlier/later
```

### Change API Endpoint
In `product.service.ts`:
```typescript
const API_BASE_URL = 'https://your-api.com'; // Change this
```

## Production Considerations

1. **Error Handling** - Implemented with user-friendly messages
2. **Loading States** - Clear indicators for fetching
3. **Cache Strategy** - Configured for optimal performance
4. **TypeScript** - Full type coverage for safety
5. **Accessibility** - Semantic HTML and keyboard navigation support
6. **SEO** - SSR ensures proper server rendering

## Browser Compatibility

- Modern browsers with Intersection Observer support
- Next.js 16+ provides polyfills where needed
- Graceful degradation for older browsers

## License

MIT
