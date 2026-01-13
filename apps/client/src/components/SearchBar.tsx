"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const SearchBarContent = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize search value from URL params
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setValue(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) return;
    
    const params = new URLSearchParams(searchParams);
    params.set("search", searchValue.trim());
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="relative">
      {/* Desktop Search */}
      <div className="hidden md:flex items-center">
        <div className="relative">
          <div className="flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 transition-colors duration-200 focus-within:ring-2 focus-within:ring-[#FDB913] focus-within:border-[#FDB913]">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 w-full min-w-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(value);
                }
              }}
            />
            {value && (
              <button
                onClick={clearSearch}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#FDB913] focus-within:border-[#FDB913]">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(value);
              }
            }}
          />
          {value && (
            <button
              onClick={clearSearch}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchBar = () => {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <SearchBarContent />
    </Suspense>
  );
};

export default SearchBar;
