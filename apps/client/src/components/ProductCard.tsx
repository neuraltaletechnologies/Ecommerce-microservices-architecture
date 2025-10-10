"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { ShoppingCart, Star, Zap, Check, Heart } from "lucide-react";
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
  const reviewCount = 150 + (product.id * 23);

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
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
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
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick Specs Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-xs space-y-1">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span className="truncate">{product.shortDescription.split(',')[0] || "Premium Quality"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Free shipping & returns</span>
              </div>
            </div>
          </div>

          {/* Availability Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${availability.bg} ${availability.color}`}>
            {availability.status}
          </div>
        </div>
      </Link>

      {/* PRODUCT DETAIL */}
      <div className="p-4 space-y-4">
        {/* Product Name & Rating */}
        <div>
          <Link href={`/products/${product.id}`}>
            <h1 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h1>
          </Link>
          <div className="flex items-center gap-2 mt-1">
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
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>

        {/* PRODUCT TYPES */}
        <div className="space-y-3">
          {/* Storage/Size Options */}
          <div>
            <span className="text-xs font-medium text-gray-700 block mb-1">
              {product.categorySlug === "smartphones" || product.categorySlug === "tablets" ? "Storage" : "Size"}
            </span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 3).map((size) => (
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
              {product.sizes.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{product.sizes.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Colors */}
          <div>
            <span className="text-xs font-medium text-gray-700 block mb-1">Color</span>
            <div className="flex flex-wrap gap-2">
              {product.colors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  onClick={() => handleProductType({ type: "color", value: color })}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    productTypes.color === color
                      ? "border-blue-500 scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase().includes('titanium') ? '#8B7355' :
                                   color.toLowerCase().includes('space') ? '#1a1a1a' :
                                   color.toLowerCase().includes('silver') ? '#C0C0C0' :
                                   color.toLowerCase().includes('gold') ? '#FFD700' :
                                   color.toLowerCase().includes('black') ? '#000000' :
                                   color.toLowerCase().includes('white') ? '#FFFFFF' :
                                   color.toLowerCase().includes('blue') ? '#007AFF' :
                                   color.toLowerCase().includes('purple') ? '#AF52DE' :
                                   color.toLowerCase().includes('pink') ? '#FF2D92' :
                                   color.toLowerCase().includes('yellow') ? '#FFCC00' :
                                   color.toLowerCase().includes('orange') ? '#FF9500' :
                                   color.toLowerCase().includes('red') ? '#FF3B30' :
                                   color.toLowerCase().includes('green') ? '#34C759' :
                                   color.toLowerCase().includes('gray') || color.toLowerCase().includes('grey') ? '#8E8E93' :
                                   '#6B7280'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRICE AND ACTIONS */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </span>
              {/* Show savings if applicable */}
              {product.id % 4 === 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 line-through">
                    ${(product.price * 1.15).toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    Save 15%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 py-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
