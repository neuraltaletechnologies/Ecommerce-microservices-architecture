export default function HeroSkeleton() {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F8F8F8] overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-0">
          
          {/* Left Column - Text Content Skeleton */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1 z-10">
            {/* Category Badge Skeleton */}
            <div className="animate-pulse">
              <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
            </div>

            {/* Headline Skeleton */}
            <div className="space-y-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-12 sm:h-14 lg:h-16 bg-gray-200 rounded-lg w-4/5"></div>
                <div className="h-12 sm:h-14 lg:h-16 bg-gray-200 rounded-lg w-3/5"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 max-w-md"></div>
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-48"></div>
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="h-14 bg-gray-300 rounded-md w-36"></div>
              <div className="h-14 bg-gray-200 border-2 border-gray-300 rounded-md w-44"></div>
            </div>

            {/* Pagination Dots Skeleton */}
            <div className="hidden lg:flex items-center gap-2 pt-8 animate-pulse">
              <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Right Column - Product Image Skeleton */}
          <div className="lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2">
            {/* Background Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-50 animate-pulse" />
            </div>

            {/* Main Product Image Skeleton */}
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gray-200 rounded-3xl"></div>
              </div>
            </div>

            {/* Floating Product Card Skeleton */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-0 bg-white rounded-xl shadow-xl p-4 sm:p-5 w-[200px] sm:w-[240px] animate-pulse">
              <div className="w-full h-24 sm:h-28 mb-3 bg-gray-100 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="mt-3 h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>

            {/* Stock Badge Skeleton */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 lg:top-12 lg:left-0 animate-pulse">
              <div className="bg-white/90 rounded-full px-3 py-1.5 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-14 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows Skeleton */}
      <div className="absolute bottom-8 right-4 sm:right-8 lg:right-12 flex items-center gap-3 z-20 animate-pulse">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 bg-gray-100"></div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 bg-gray-100"></div>
      </div>

      {/* Mobile Pagination Dots Skeleton */}
      <div className="lg:hidden absolute bottom-8 left-4 sm:left-8 flex items-center gap-2 z-20 animate-pulse">
        <div className="w-6 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
      </div>

      {/* Slide Counter Skeleton */}
      <div className="absolute top-8 right-4 sm:right-8 lg:right-12 z-20 animate-pulse">
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>
    </section>
  );
}
