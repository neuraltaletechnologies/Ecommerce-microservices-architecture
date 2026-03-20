export default function CategoriesSkeleton() {
  return (
    <div className="bg-[#FAFAFA] rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="h-4 bg-gray-200 rounded w-52 hidden sm:block"></div>
      </div>

      {/* Scrollable Categories Skeleton */}
      <div className="relative">
        {/* Left Arrow Skeleton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 animate-pulse"></div>

        {/* Right Arrow Skeleton */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 animate-pulse"></div>

        {/* Category Cards Skeleton */}
        <div className="flex gap-4 overflow-hidden pb-3 px-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center p-4 min-w-[110px] animate-pulse"
            >
              {/* Circular Image Container */}
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 border-2 border-gray-100"></div>

              {/* Category Name */}
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>

              {/* Product Count */}
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-300 rounded-full w-1/4 animate-pulse"></div>
        </div>
      </div>

      {/* Footer Stats Skeleton */}
      <div className="mt-5 pt-4 border-t border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
      </div>
    </div>
  );
}
