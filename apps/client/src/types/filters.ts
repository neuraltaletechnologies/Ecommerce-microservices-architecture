// Shared filter types to avoid duplication across components

export interface FilterState {
  brands: string[];
  rating: number;
  priceMin: string;
  priceMax: string;
  batteryCapacity: string[];
}

export interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
}
