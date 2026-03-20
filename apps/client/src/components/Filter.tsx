"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { ArrowUpDown, ChevronDown, X } from "lucide-react";

const FilterContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "newest";

  const handleFilter = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const clearSort = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Count active filters (excluding sort)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.get("brands")) count++;
    if (searchParams.get("rating")) count++;
    if (searchParams.get("priceMin") || searchParams.get("priceMax")) count++;
    if (searchParams.get("batteryCapacity")) count++;
    if (searchParams.get("category")) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    // Keep search if exists
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "asc", label: "Price: Low to High" },
    { value: "desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === currentSort)?.label || "Newest First";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-4 border-b border-gray-200">
      {/* Left Side - Active Filters Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {activeFiltersCount > 0 && (
          <>
            <span className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{activeFiltersCount}</span> filter{activeFiltersCount > 1 ? 's' : ''} active
            </span>
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          </>
        )}
        
        {/* Show active filter tags */}
        {searchParams.get("category") && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FDB913]/20 text-[#001E3C] text-xs font-medium rounded-full">
            Category: {searchParams.get("category")}
          </span>
        )}
        {searchParams.get("brands") && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A7EA4]/20 text-[#001E3C] text-xs font-medium rounded-full">
            {searchParams.get("brands")?.split(",").length} brand(s)
          </span>
        )}
        {(searchParams.get("priceMin") || searchParams.get("priceMax")) && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            Price range
          </span>
        )}
        {searchParams.get("rating") && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
            {searchParams.get("rating")}+ stars
          </span>
        )}
      </div>

      {/* Right Side - Sort Dropdown */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowUpDown className="w-4 h-4" />
          <span className="hidden sm:inline">Sort by:</span>
        </div>
        
        <div className="relative">
          <select
            name="sort"
            id="sort"
            value={currentSort}
            onChange={(e) => handleFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium pl-4 pr-10 py-2.5 rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-[#FDB913] cursor-pointer transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {currentSort !== "newest" && (
          <button
            onClick={clearSort}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset sort"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const Filter = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-200 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-40"></div>
      </div>
    }>
      <FilterContent />
    </Suspense>
  );
};

export default Filter;
