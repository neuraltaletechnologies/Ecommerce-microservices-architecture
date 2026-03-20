export default function ProductCardSkeleton() {
  return (
    <div className="group bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <div className="flex gap-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-12 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-24"></div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}
