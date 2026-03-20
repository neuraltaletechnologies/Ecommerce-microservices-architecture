"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import useWishlistStore from "@/stores/wishlistStore";
import useCartStore from "@/stores/cartStore";
import { formatTzs } from "@/utils/currency";
import { useRouter } from "next/navigation";
import { ProductType } from "@repo/types";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Loading wishlist...</span>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: ProductType) => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: product.sizes?.[0] || "M",
      selectedColor: product.colors?.[0] || Object.keys(product.images || {})[0] || "default",
    });
  };

  const isEmpty = wishlist.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 text-sm lg:text-base">
            {isEmpty ? "Your wishlist is empty" : `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} saved for later`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8">Save items you love for later!</p>
            <button
              onClick={() => router.push("/products")}
              className="inline-flex items-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#FDB913]/20 hover:shadow-xl hover:shadow-[#FDB913]/30 hover:scale-105"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <Link href={`/products/${product.id}`} className="block relative h-56 bg-gray-50">
                  <Image
                    src={(() => {
                      try {
                        const images = product.images as Record<string, string | string[]>;
                        const firstColor = Object.keys(images)[0];
                        if (!firstColor) return "/products/placeholder.jpg";
                        const imageValue = images[firstColor];
                        if (typeof imageValue === 'string' && imageValue.trim() !== '') {
                          return imageValue;
                        } else if (Array.isArray(imageValue)) {
                          const validUrl = imageValue.find((url: string) => url && typeof url === 'string' && url.trim() !== '');
                          return validUrl || "/products/placeholder.jpg";
                        }
                        return "/products/placeholder.jpg";
                      } catch {
                        return "/products/placeholder.jpg";
                      }
                    })()}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </Link>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#0A7EA4] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-xl font-bold text-gray-900">
                    {formatTzs(product.price)}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] hover:from-[#0A7EA4] hover:to-[#001E3C] text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
