"use client";

import { ProductType } from "@repo/types";
import ProductCard from "./ProductCard";
import { Grid, List } from "lucide-react";
import { useState } from "react";
import { formatTZS } from "@/lib/utils/currency";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";

interface MobileProductGridProps {
  products: ProductType[];
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <span className="text-sm text-gray-600">
          {products.length} products
        </span>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${viewMode === "grid"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
              }`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${viewMode === "list"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
              }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={
              viewMode === "list"
                ? "bg-white border border-gray-200 rounded-lg overflow-hidden"
                : ""
            }
          >
            {viewMode === "list" ? (
              <MobileProductListItem product={product} />
            ) : (
              <ProductCard product={product} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// List view component for mobile
const MobileProductListItem = ({ product }: { product: ProductType }) => {
  // Get the first available image more robustly
  const getFirstImage = (): string => {
    const images = product.images as Record<string, string | string[]>;
    if (!images || Object.keys(images).length === 0) {
      return "https://via.placeholder.com/600x600?text=Product+Image";
    }

    const firstValue = Object.values(images)[0];
    if (typeof firstValue === 'string') return firstValue;
    if (Array.isArray(firstValue) && firstValue.length > 0 && typeof firstValue[0] === 'string') return firstValue[0];

    return "https://via.placeholder.com/600x600?text=Product+Image";
  };

  const firstImage = getFirstImage();
  const optimizedImageUrl = getCloudinaryUrl(firstImage, { width: 200, crop: 'fill' });
  const rating = 4.3 + (product.id % 10) * 0.06;

  return (
    <div className="flex gap-4 p-4">
      {/* Image */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
        <img
          src={optimizedImageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating)
                  ? "text-[#FDB913]"
                  : "text-gray-300"
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-900">
              {formatTZS(product.price)}
            </span>
            {product.id % 4 === 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                15% off
              </span>
            )}
          </div>
          <button className="bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] text-sm font-semibold py-1.5 px-3 rounded transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileProductGrid;