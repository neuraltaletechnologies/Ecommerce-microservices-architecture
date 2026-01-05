"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Search as SearchIcon,
  Package,
  Boxes,
  X,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { ProductType, CategoryType } from "@repo/types";
import { formatTZS } from "@/lib/utils/currency";
import { Button } from "./ui/button";

interface SearchResult {
  type: "product" | "category";
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  link: string;
  meta?: Record<string, string>;
}

const NavbarSearch = () => {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch data for searching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("admin-recent-searches", JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("admin-recent-searches");
  };

  // Get product image
  const getProductImage = (product: ProductType): string => {
    const firstColor = product.colors?.[0];
    if (firstColor && product.images) {
      const images = product.images as Record<string, string | string[]>;
      const imageValue = images[firstColor];
      if (imageValue) {
        return Array.isArray(imageValue) ? imageValue[0] || "/products/placeholder.jpg" : imageValue;
      }
    }
    return "/products/placeholder.jpg";
  };

  // Search results
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search products
    products.forEach((product) => {
      if (
        product.name.toLowerCase().includes(lowerQuery) ||
        product.shortDescription.toLowerCase().includes(lowerQuery) ||
        product.categorySlug.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "product",
          id: String(product.id),
          title: product.name,
          subtitle: product.shortDescription,
          image: getProductImage(product),
          link: `/products/${product.id}`,
          meta: {
            price: formatTZS(product.price),
            category: product.categorySlug,
          },
        });
      }
    });

    // Search categories
    categories.forEach((category) => {
      if (
        category.name.toLowerCase().includes(lowerQuery) ||
        category.slug.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "category",
          id: String(category.id),
          title: category.name,
          subtitle: `Slug: ${category.slug}`,
          link: `/categories`,
          meta: {
            slug: category.slug,
          },
        });
      }
    });

    return results.slice(0, 10); // Limit results for dropdown
  }, [query, products, categories]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "category":
        return <Boxes className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const handleResultClick = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    setIsOpen(false);
    setQuery("");
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9 h-9 w-full"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setQuery("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : query.trim() ? (
            // Search Results
            <ScrollArea className="max-h-[400px]">
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <SearchIcon className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs">Try adjusting your search</p>
                </div>
              ) : (
                <div className="divide-y">
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.link}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      {result.image ? (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {result.type}
                          </Badge>
                          <h4 className="text-sm font-medium truncate">{result.title}</h4>
                        </div>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        )}
                        {result.meta && (
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            {Object.entries(result.meta).slice(0, 2).map(([key, value]) => (
                              <span key={key}>
                                {key}: <span className="font-medium">{value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
          ) : recentSearches.length > 0 ? (
            // Recent Searches
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={clearRecentSearches}
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="secondary"
                    className="cursor-pointer hover:bg-muted text-xs"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <SearchIcon className="h-6 w-6 mb-2 opacity-30" />
              <p className="text-xs">Start typing to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
