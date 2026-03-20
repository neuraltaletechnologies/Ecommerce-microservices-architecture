export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-6">
        <div className="h-7 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-96 bg-gray-300/70 rounded"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="pb-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Current Hero Products Card Skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-yellow-200 rounded"></div>
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-80 bg-gray-100 rounded"></div>
        </div>
        <div className="p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
              {/* Order badge and arrows */}
              <div className="flex flex-col gap-2">
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
                <div className="flex flex-col gap-1">
                  <div className="h-6 w-6 bg-gray-100 rounded"></div>
                  <div className="h-6 w-6 bg-gray-100 rounded"></div>
                </div>
              </div>
              {/* Product image */}
              <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
              {/* Product info */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-64 bg-gray-100 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
              {/* Action button */}
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Products Card Skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="h-5 w-36 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-72 bg-gray-100 rounded"></div>
        </div>
        <div className="p-6">
          {/* Search and filter */}
          <div className="flex gap-4 mb-4">
            <div className="h-10 flex-1 bg-gray-100 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-100 rounded-md"></div>
          </div>
          {/* Product grid */}
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-64 bg-gray-100 rounded"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Card Skeleton */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
          <div className="h-5 w-56 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded mt-0.5"></div>
              <div className="h-4 flex-1 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
