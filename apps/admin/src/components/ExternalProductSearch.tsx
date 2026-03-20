"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Search,
  Loader2,
  ExternalLink,
  Package,
  Check,
  AlertCircle,
  Clock,
  Database,
} from "lucide-react";

export interface ExternalProductResult {
  source: "techspecs" | "fakestore" | "dummyjson" | "platzi";
  id: string;
  name: string;
  brand: string;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  technicalSpecs: Record<string, Array<{ label: string; value: string }>>;
  suggestedPrice?: number;
}

interface ExternalProductSearchProps {
  onSelectProduct: (product: ExternalProductResult) => void;
}

const sourceLabels: Record<string, { label: string; color: string }> = {
  techspecs: { label: "TechSpecs", color: "bg-blue-500" },
  dummyjson: { label: "DummyJSON", color: "bg-green-500" },
  fakestore: { label: "FakeStore", color: "bg-orange-500" },
  platzi: { label: "Platzi", color: "bg-purple-500" },
};

export default function ExternalProductSearch({ onSelectProduct }: ExternalProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExternalProductResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ExternalProductResult | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const { getToken } = useAuth();

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const token = await getToken();
      const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/external-products/search?q=${encodeURIComponent(searchQuery)}`;
      
      console.log("Search URL:", url);
      console.log("Auth token available:", !!token);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status, res.statusText);

      // Read the response text first (can only read body once)
      const responseText = await res.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("API response is not valid JSON:", responseText);
        throw new Error(`API returned invalid JSON: ${responseText.substring(0, 150)}`);
      }

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a minute.");
        }
        if (res.status === 404) {
          throw new Error("Search endpoint not found. Check if product-service is running.");
        }
        throw new Error(data.error || data.message || `Search failed with status ${res.status}`);
      }

      return data;
    },
    onSuccess: (data) => {
      setResults(data.results || []);
      setFromCache(data.fromCache || false);
      setSelectedProduct(null);
      
      if (data.results?.length === 0) {
        toast.info("No products found. Try a different search term.");
      } else if (data.fromCache) {
        toast.info(`Found ${data.results.length} products (cached)`);
      } else {
        toast.success(`Found ${data.results.length} products`);
      }
    },
    onError: (error: Error) => {
      console.error("Search error details:", error);
      const errorMsg = error.message || "Search failed";
      toast.error(errorMsg);
      setResults([]);
    },
  });

  const handleSelectProduct = (product: ExternalProductResult) => {
    setSelectedProduct(product);
  };

  const handleImportProduct = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct);
      toast.success("Product data imported! Set price and stock, then save.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Search External Product APIs
          </CardTitle>
          <CardDescription>
            Search TechSpecs, DummyJSON, or FakeStore for product details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products (e.g., MacBook Pro 14, iPhone 15)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim().length >= 2) {
                    e.preventDefault();
                    searchMutation.mutate(query.trim());
                  }
                }}
                className="pl-9"
                disabled={searchMutation.isPending}
              />
            </div>
            <Button 
              type="button" 
              onClick={() => {
                if (query.trim().length >= 2) {
                  searchMutation.mutate(query.trim());
                } else {
                  toast.warning("Please enter at least 2 characters");
                }
              }}
              disabled={searchMutation.isPending || query.length < 2}
            >
              {searchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
          
          {fromCache && results.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Results from cache (10 min TTL)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Search Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-2">
                {results.map((product) => (
                  <div
                    key={`${product.source}-${product.id}`}
                    onClick={() => handleSelectProduct(product)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedProduct?.id === product.id && selectedProduct?.source === product.source
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      {product.images[0] && (
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-product.png";
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs text-white ${sourceLabels[product.source]?.color || 'bg-gray-500'}`}
                          >
                            {sourceLabels[product.source]?.label || product.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.brand} • {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        {product.suggestedPrice && (
                          <p className="text-xs font-medium text-green-600 mt-1">
                            Suggested: TZS {product.suggestedPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      {/* Selected Check */}
                      {selectedProduct?.id === product.id && selectedProduct?.source === product.source && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Selected Product Preview */}
      {selectedProduct && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Selected Product Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {/* Images */}
              {selectedProduct.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {selectedProduct.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${selectedProduct.name} ${i + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold">{selectedProduct.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
              <p className="text-sm mt-2">{selectedProduct.description}</p>
            </div>

            {/* Technical Specs Preview */}
            {Object.keys(selectedProduct.technicalSpecs).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Technical Specifications</h4>
                <div className="space-y-3">
                  {Object.entries(selectedProduct.technicalSpecs).slice(0, 2).map(([category, specs]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{category}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {specs.slice(0, 4).map((spec, i) => (
                          <div key={i} className="text-xs">
                            <span className="text-muted-foreground">{spec.label}:</span>{" "}
                            <span>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">
                You&apos;ll need to set the price and stock quantity manually after import
              </p>
            </div>

            <Button onClick={handleImportProduct} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Import This Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
