export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-32 rounded-lg"></div>

      {/* Card List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-200 h-64 rounded-lg"></div>
        <div className="bg-gray-200 h-64 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-200 h-80 rounded-lg"></div>
        <div className="bg-gray-200 h-80 rounded-lg"></div>
      </div>
    </div>
  );
}
