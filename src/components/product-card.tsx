'use client';

import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <div className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{product.discountPercentage}%
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category and Brand */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="text-xs text-gray-400">{product.category}</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-gray-700">
          {product.title}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-600">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.round(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-3 text-xs font-medium">
          {product.stock > 0 ? (
            <span className="text-green-600">In Stock ({product.stock})</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
