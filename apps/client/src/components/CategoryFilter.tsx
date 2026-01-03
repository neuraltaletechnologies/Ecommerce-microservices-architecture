"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, X, SlidersHorizontal } from "lucide-react";
import { FilterState } from "@/types/filters";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CategoryFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  isSheet?: boolean;
  onClose?: () => void;
}

const CategoryFilter = ({ onFilterChange, isSheet = false, onClose }: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true,
    rating: true,
    battery: true,
  });

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    rating: Number(searchParams.get('rating')) || 0,
    priceMin: searchParams.get('priceMin') || "",
    priceMax: searchParams.get('priceMax') || "",
    batteryCapacity: searchParams.get('batteryCapacity')?.split(',').filter(Boolean) || [],
  }));

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams);
    
    // Update or remove brands
    if (newFilters.brands.length > 0) {
      params.set('brands', newFilters.brands.join(','));
    } else {
      params.delete('brands');
    }
    
    // Update or remove rating
    if (newFilters.rating > 0) {
      params.set('rating', newFilters.rating.toString());
    } else {
      params.delete('rating');
    }
    
    // Update or remove price range
    if (newFilters.priceMin) {
      params.set('priceMin', newFilters.priceMin);
    } else {
      params.delete('priceMin');
    }
    if (newFilters.priceMax) {
      params.set('priceMax', newFilters.priceMax);
    } else {
      params.delete('priceMax');
    }
    
    // Update or remove battery capacity
    if (newFilters.batteryCapacity.length > 0) {
      params.set('batteryCapacity', newFilters.batteryCapacity.join(','));
    } else {
      params.delete('batteryCapacity');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Microsoft",
    "LG",
    "Canon",
    "Nikon",
    "JBL",
  ];

  const batteryOptions = [
    "Up to 3000mAh",
    "3000-4000mAh",
    "4000-5000mAh",
    "5000mAh+",
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    updateURL(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    updateURL(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const newFilters = {
      ...filters,
      [type === "min" ? "priceMin" : "priceMax"]: value,
    };
    setFilters(newFilters);
    updateURL(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleBatteryToggle = (capacity: string) => {
    const newBattery = filters.batteryCapacity.includes(capacity)
      ? filters.batteryCapacity.filter((b) => b !== capacity)
      : [...filters.batteryCapacity, capacity];
    
    const newFilters = { ...filters, batteryCapacity: newBattery };
    setFilters(newFilters);
    updateURL(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      brands: [],
      rating: 0,
      priceMin: "",
      priceMax: "",
      batteryCapacity: [],
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const activeFiltersCount =
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    filters.batteryCapacity.length;

  return (
    <div className={`${isSheet ? "h-full" : ""} bg-white rounded-lg ${!isSheet ? "border border-gray-200 shadow-sm" : ""}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isSheet ? "p-4 border-b" : "p-6 border-b border-gray-200"}`}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#FDB913] text-[#001E3C] text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#0A7EA4] hover:text-[#001E3C] font-medium"
            >
              Clear all
            </button>
          )}
          {isSheet && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
              title="Close filters"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isSheet ? "overflow-y-auto h-[calc(100%-73px)] p-4" : "p-6"} space-y-6`}>
        {/* Brands Section */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection("brands")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Brands
            </h4>
            {expandedSections.brands ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedSections.brands && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 text-[#FDB913] border-gray-300 rounded focus:ring-2 focus:ring-[#FDB913] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Price Range
            </h4>
            {expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedSections.price && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Min (TZS)</label>
                  <input
                    type="number"
                    placeholder="100,000"
                    value={filters.priceMin}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FDB913]"
                  />
                </div>
                <span className="text-gray-400 mt-5">-</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Max (TZS)</label>
                  <input
                    type="number"
                    placeholder="5,000,000"
                    value={filters.priceMax}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FDB913]"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Enter price in Tanzanian Shillings</p>
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Minimum Rating
            </h4>
            {expandedSections.rating ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedSections.rating && (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-[#FDB913] border-gray-300 focus:ring-2 focus:ring-[#FDB913] cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating
                            ? "fill-[#FDB913] text-[#FDB913]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Battery Capacity Section */}
        <div className="pb-6">
          <button
            onClick={() => toggleSection("battery")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Battery Capacity
            </h4>
            {expandedSections.battery ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedSections.battery && (
            <div className="space-y-3">
              {batteryOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.batteryCapacity.includes(option)}
                    onChange={() => handleBatteryToggle(option)}
                    className="w-4 h-4 text-[#FDB913] border-gray-300 rounded focus:ring-2 focus:ring-[#FDB913] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
