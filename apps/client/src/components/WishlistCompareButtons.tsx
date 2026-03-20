"use client";

import { ProductType } from "@repo/types";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useWishlistStore from "@/stores/wishlistStore";

interface WishlistCompareButtonsProps {
  product: ProductType;
}

export default function WishlistCompareButtons({ product }: WishlistCompareButtonsProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check wishlist status after hydration
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <button 
      onClick={handleWishlist}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-lg font-semibold transition-all ${
        isWishlisted
          ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-gray-900 text-gray-900 hover:bg-gray-50"
      }`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
      {isWishlisted ? "Wishlisted" : "Wishlist"}
    </button>
  );
}
