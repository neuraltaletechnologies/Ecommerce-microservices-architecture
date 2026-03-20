"use client";

import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { formatTzs } from "@/utils/currency";
import { ProductType } from "@repo/types";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes?.[0] || "",
    color: product.colors?.[0] || "",
  });

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check wishlist status after hydration
  useEffect(() => {
    setMounted(true);
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

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
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast.success("Added to wishlist");
    }
  };

  // Generate a realistic rating for demo purposes
  const rating = 4.3 + (product.id % 10) * 0.06;

  // Determine availability status from database
  // Client view: Show "Pre-Order" for both out_of_stock and pre_order statuses
  const getAvailabilityStatus = () => {
    const stockStatus = product.stockStatus || "in_stock";
    const stock = product.stockQuantity || 0;
    const threshold = product.lowStockThreshold || 10;

    // Client side: Display "Pre-Order" for out of stock items
    if (stockStatus === "out_of_stock" || stockStatus === "pre_order" || stock === 0) {
      return { status: "Pre-Order", color: "text-[#0A7EA4]", bg: "bg-[#0A7EA4]/10" };
    }
    if (stockStatus === "limited_stock" || stock <= threshold) {
      return { status: "Limited Stock", color: "text-[#FDB913]", bg: "bg-[#FDB913]/10" };
    }
    return { status: "In Stock", color: "text-green-600", bg: "bg-green-50" };
  };

  const availability = getAvailabilityStatus();

  // Get the image URL for the selected color
  const getImageUrl = (): string => {
    const images = product.images as Record<string, string | string[]>;
    const colorImages = images?.[productTypes.color];

    // Handle both string and array formats
    if (typeof colorImages === 'string' && colorImages.trim() !== '') {
      return colorImages;
    } else if (Array.isArray(colorImages)) {
      const validImage = colorImages.find((url: string) => url && url.trim() !== '');
      if (validImage) {
        return validImage; // Use first valid image
      }
    }

    // Fallback to first available color
    const firstColor = Object.keys(images || {})[0];
    if (firstColor) {
      const firstColorImages = images[firstColor];
      if (typeof firstColorImages === 'string' && firstColorImages.trim() !== '') {
        return firstColorImages;
      } else if (Array.isArray(firstColorImages)) {
        const validImage = firstColorImages.find((url: string) => url && url.trim() !== '');
        if (validImage) {
          return validImage;
        }
      }
    }

    return "https://via.placeholder.com/600x600?text=Product+Image";
  };

  const imageUrl = getImageUrl();

  // Optimize Cloudinary images with transformations
  const optimizedImageUrl = getCloudinaryUrl(imageUrl, {
    width: 400,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });

  return (
    <div className="group bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-[#FDB913]/30 transition-all duration-300 transform hover:-translate-y-1">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={optimizedImageUrl}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-all duration-300"
          />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${isWishlisted
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
            <h1 className="font-medium text-sm text-[#001E3C] hover:text-[#0A7EA4] transition-colors duration-200 line-clamp-2 mb-1">
              {product.name}
            </h1>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating)
                      ? "text-[#FDB913] fill-current"
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


        {/* PRICE AND ACTIONS */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-lg font-bold text-[#001E3C]">
                {formatTzs(product.price)}
              </span>
              {/* Show savings if applicable */}
              {product.id % 4 === 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500 line-through">
                    {formatTzs(product.price * 1.15)}
                  </span>
                  <span className="text-xs bg-[#FDB913]/20 text-[#001E3C] px-1.5 py-0.5 rounded font-medium">
                    Save 15%
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] font-bold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="text-xs sm:text-sm">Add to Cart</span>
          </button>


        </div>
      </div>
    </div>
  );
};

export default ProductCard;
