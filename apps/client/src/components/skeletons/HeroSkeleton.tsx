export default function HeroSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden h-screen min-h-[600px] -mt-2 sm:-mt-4 md:-mt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-12">
          {/* Left Content Skeleton */}
          <div className="space-y-6 animate-pulse">
            {/* Badge skeleton */}
            <div className="h-8 w-32 bg-blue-400/20 rounded-full"></div>
            
            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-12 bg-slate-700/50 rounded-lg w-3/4"></div>
              <div className="h-12 bg-slate-700/50 rounded-lg w-full"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-700/30 rounded w-full"></div>
              <div className="h-4 bg-slate-700/30 rounded w-5/6"></div>
            </div>
            
            {/* Price skeleton */}
            <div className="h-16 bg-blue-500/20 rounded-lg w-48"></div>
            
            {/* Features skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-700/30 rounded-lg"></div>
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-4">
              <div className="h-14 bg-blue-500/40 rounded-xl w-40"></div>
              <div className="h-14 bg-slate-700/40 rounded-xl w-32"></div>
            </div>
          </div>
          
          {/* Right Image Skeleton */}
          <div className="relative h-[500px] animate-pulse">
            <div className="absolute inset-0 bg-slate-700/30 rounded-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-32 w-32 bg-slate-600/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dots skeleton */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-2 w-8 bg-slate-600/50 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}
