"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import useWishlistStore from "@/stores/wishlistStore";

const WishlistIcon = () => {
  const { wishlist, hasHydrated } = useWishlistStore();

  // Don't render until hydration is complete to prevent mismatch
  if (!hasHydrated) {
    return null;
  }

  const itemCount = wishlist.length;

  return (
    <Link
      href="/wishlist"
      className="relative group"
      aria-label={`Wishlist with ${itemCount} items`}
    >
      <div className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200">
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg animate-pulse">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default WishlistIcon;
