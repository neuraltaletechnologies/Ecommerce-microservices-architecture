"use client";

import useCartStore from "@/stores/cartStore";
import { formatTzs } from "@/utils/currency";
import { ProductType } from "@repo/types";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0]!,
    color: product.colors[0]!,
  });
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCartStore();

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
    });
    toast.success("Product added to cart");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // Generate a realistic rating for demo purposes
  const rating = 4.3 + (product.id % 10) * 0.06;

  // Determine availability status
  const getAvailabilityStatus = () => {
    if (product.id % 3 === 0) return { status: "Limited Stock", color: "text-orange-600", bg: "bg-orange-50" };
    if (product.id % 7 === 0) return { status: "Pre-Order", color: "text-blue-600", bg: "bg-blue-50" };
    return { status: "In Stock", color: "text-green-600", bg: "bg-green-50" };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="group bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={(product.images as Record<string,string>)?.[productTypes.color] || "/products/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Availability Badge */}
          <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-medium ${availability.bg} ${availability.color}`}>
            {availability.status}
          </div>
        </div>
      </Link>

      {/* PRODUCT DETAIL */}
      <div className="p-3 space-y-3">
        {/* Product Name & Rating */}
        <div>
          <Link href={`/products/${product.id}`}>
            <h1 className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
              {product.name}
            </h1>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* PRODUCT TYPES - Simplified for mobile */}
        <div className="space-y-2 sm:space-y-3">
          {/* Storage/Size Options - Show only 2 on mobile */}
          <div className="sm:block hidden">
            <span className="text-xs font-medium text-gray-700 block mb-1">
              {product.categorySlug === "smartphones" || product.categorySlug === "tablets" ? "Storage" : "Size"}
            </span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 2).map((size) => (
                <button
                  key={size}
                  onClick={() => handleProductType({ type: "size", value: size })}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    productTypes.size === size
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Options - Show only 3 on mobile */}
          <div className="sm:block hidden">
            <span className="text-xs font-medium text-gray-700 block mb-1">Color</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color}
                  onClick={() => handleProductType({ type: "color", value: color })}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    productTypes.color === color
                      ? "border-blue-500 ring-1 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  data-color={color}
                  aria-label={`Select ${color} color`}
                  title={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PRICE AND ACTIONS */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatTzs(product.price, true)}
              </span>
              {/* Show savings if applicable */}
              {product.id % 4 === 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500 line-through">
                    {formatTzs(product.price * 1.15, true)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                    Save 15%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="text-xs sm:text-sm">Add to Cart</span>
          </button>
          
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 py-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
