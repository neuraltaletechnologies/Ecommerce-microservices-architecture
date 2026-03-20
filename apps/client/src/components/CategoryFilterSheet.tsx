"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import { FilterState } from "@/types/filters";

interface CategoryFilterSheetProps {
  onFilterChange?: (filters: FilterState) => void;
}

const CategoryFilterSheet = ({ onFilterChange }: CategoryFilterSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <CategoryFilter
          isSheet={true}
          onClose={() => setIsOpen(false)}
          onFilterChange={(filters) => {
            onFilterChange?.(filters);
          }}
        />
      </div>
    </>
  );
};

export default CategoryFilterSheet;
