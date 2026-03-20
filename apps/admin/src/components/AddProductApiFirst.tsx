"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import z from "zod";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Search,
  Loader2,
  Package,
  Check,
  AlertCircle,
  AlertTriangle,
  Database,
  Pencil,
  ChevronRight,
  Tag,
  DollarSign,
  Boxes,
  Eye,
  EyeOff,
  Percent,
} from "lucide-react";
import { formatTZS } from "@/lib/utils/currency";

import type { CategoryType, ProductType } from "@repo/types";

// Local schema for API imports - only business fields needed
const ApiImportSchema = z.object({
  price: z.number({ message: "Price is required" }).min(1, "Price must be greater than 0"),
  discount: z.number().int().min(0).max(100),
  stockQuantity: z.number().int().min(0),
  categorySlug: z.string({ message: "Category is required" }).min(1, "Category is required"),
  isPublished: z.boolean(),
  sizes: z.array(z.string()).optional(),
});

type ImportFormData = z.infer<typeof ApiImportSchema>;

// External product result from API search
interface ExternalProductResult {
  source: "techspecs" | "fakestore" | "dummyjson" | "platzi";
  id: string;
  name: string;
  brand?: string;
  description: string;
  shortDescription?: string;
  category: string;
  images: string[];
  technicalSpecs?: Record<string, Array<{ label: string; value: string }>>;
  suggestedPrice?: number;
}

// Duplicate check result type
interface DuplicateCheckResult {
  exists: boolean;
  matchType: "exact" | "similar_name" | null;
  existingProduct: {
    id: number;
    name: string;
    price?: number;
  } | null;
}

const sourceLabels: Record<string, { label: string; color: string }> = {
  techspecs: { label: "TechSpecs", color: "bg-blue-500" },
  dummyjson: { label: "DummyJSON", color: "bg-green-500" },
  fakestore: { label: "FakeStore", color: "bg-orange-500" },
  platzi: { label: "Platzi", color: "bg-purple-500" },
};

// Map external categories to our slugs
const categoryMapping: Record<string, string> = {
  "smartphones": "smartphones",
  "laptops": "laptops",
  "tablets": "tablets",
  "fragrances": "accessories",
  "skincare": "accessories",
  "groceries": "accessories",
  "home-decoration": "accessories",
  "furniture": "accessories",
  "tops": "accessories",
  "womens-dresses": "accessories",
  "womens-shoes": "accessories",
  "mens-shirts": "accessories",
  "mens-shoes": "accessories",
  "mens-watches": "smartwatches",
  "womens-watches": "smartwatches",
  "womens-bags": "accessories",
  "womens-jewellery": "accessories",
  "sunglasses": "accessories",
  "automotive": "accessories",
  "motorcycle": "accessories",
  "lighting": "accessories",
  "clothes": "accessories",
  "electronics": "accessories",
  "shoes": "accessories",
  "others": "accessories",
  "miscellaneous": "accessories",
};

interface AddProductApiFirstProps {
  editData?: ProductType | null;
  onClose: () => void;
  onOpenManualForm?: () => void;
}

export default function AddProductApiFirst({ editData, onClose, onOpenManualForm }: AddProductApiFirstProps) {
  const isEditMode = !!editData;
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Workflow state
  const [mode, setMode] = useState<"search" | "import" | "manual">(isEditMode ? "manual" : "search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExternalProductResult[]>([]);
  const [fromCache, setFromCache] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExternalProductResult | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateCheckResult | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Form for import business fields
  const form = useForm<ImportFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ApiImportSchema) as any,
    defaultValues: {
      price: 0,
      discount: 0,
      stockQuantity: 0,
      categorySlug: "",
      isPublished: true,
      sizes: [],
    },
  });

  // Search external APIs
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/external-products/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from API");
      }

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }
      return data;
    },
    onSuccess: (data) => {
      setSearchResults(data.results || []);
      setFromCache(data.fromCache || false);
      setSelectedProduct(null);
      setDuplicateWarning(null);

      if (data.results?.length === 0) {
        toast.info("No products found. Try a different search term.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setSearchResults([]);
    },
  });

  // Check for duplicates
  const checkDuplicateMutation = useMutation({
    mutationFn: async (product: ExternalProductResult) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/external-products/check-duplicate?source=${product.source}&externalId=${product.id}&name=${encodeURIComponent(product.name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const text = await res.text();
      return JSON.parse(text);
    },
    onSuccess: (data) => {
      setDuplicateWarning(data);
    },
  });

  // Import product via API
  const importMutation = useMutation({
    mutationFn: async (formData: ImportFormData) => {
      if (!selectedProduct) throw new Error("No product selected");

      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/external-products/import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            externalProduct: selectedProduct,
            businessData: formData,
          }),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Product "${data.product.name}" imported successfully!`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resolveCategorySlug = useCallback((externalCategory?: string) => {
    if (!categories.length) return "";

    const normalized = (externalCategory || "").toLowerCase().trim();
    const mapped = categoryMapping[normalized] || "accessories";

    const mappedExists = categories.some((cat) => cat.slug === mapped);
    if (mappedExists) return mapped;

    const bySlug = categories.find((cat) => cat.slug.toLowerCase() === normalized);
    if (bySlug) return bySlug.slug;

    const byName = categories.find((cat) => cat.name.toLowerCase() === normalized);
    if (byName) return byName.slug;

    return categories[0]?.slug || "";
  }, [categories]);

  // Handle product selection
  const handleSelectProduct = (product: ExternalProductResult) => {
    setSelectedProduct(product);
    checkDuplicateMutation.mutate(product);

    // Auto-fill category with validated slug
    const resolvedCategorySlug = resolveCategorySlug(product.category);
    if (resolvedCategorySlug) {
      form.setValue("categorySlug", resolvedCategorySlug);
    }

    // Set suggested price if available (database stores whole TZS)
    if (product.suggestedPrice) {
      form.setValue("price", Math.round(product.suggestedPrice));
    }

    setMode("import");
  };

  useEffect(() => {
    if (selectedProduct && !form.getValues("categorySlug")) {
      const resolvedCategorySlug = resolveCategorySlug(selectedProduct.category);
      if (resolvedCategorySlug) {
        form.setValue("categorySlug", resolvedCategorySlug);
      }
    }
  }, [selectedProduct, form, resolveCategorySlug]);

  // Handle import submit
  const handleImportSubmit = (data: ImportFormData) => {
    if (duplicateWarning?.exists && duplicateWarning.matchType === "exact") {
      toast.error("This exact product has already been imported.");
      return;
    }
    importMutation.mutate(data);
  };

  return (
    <SheetContent className="w-full sm:max-w-xl flex flex-col h-full p-0 gap-0">
      <SheetHeader className="px-6 pt-6 pb-4 flex-shrink-0">
        <SheetTitle className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Pencil className="h-5 w-5" />
              Edit Product
            </>
          ) : (
            <>
              <Package className="h-5 w-5" />
              Add Product
            </>
          )}
        </SheetTitle>
        <SheetDescription>
          {isEditMode
            ? "Update product details"
            : "Search external APIs to import products, or create manually"}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="px-6 pb-6 space-y-4">
          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "search" | "import" | "manual")}>
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1" disabled={isEditMode}>
                <Database className="h-4 w-4 mr-2" />
                API Search
              </TabsTrigger>
              <TabsTrigger value="import" className="flex-1" disabled={!selectedProduct}>
                <Tag className="h-4 w-4 mr-2" />
                Set Price
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">
                <Pencil className="h-4 w-4 mr-2" />
                {isEditMode ? "Edit" : "Manual"}
              </TabsTrigger>
            </TabsList>

            {/* SEARCH TAB - API-first approach */}
            <TabsContent value="search" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search Product Database
                  </CardTitle>
                  <CardDescription>
                    Search TechSpecs, DummyJSON, Platzi, or FakeStore APIs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., iPhone 15 Pro, MacBook Pro 14"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim().length >= 2) {
                          searchMutation.mutate(searchQuery.trim());
                        }
                      }}
                    />
                    <Button
                      onClick={() => searchMutation.mutate(searchQuery.trim())}
                      disabled={searchQuery.trim().length < 2 || searchMutation.isPending}
                    >
                      {searchMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {fromCache && searchResults.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Results cached
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      Found {searchResults.length} products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={`${product.source}-${product.id}`}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          selectedProduct?.id === product.id && selectedProduct?.source === product.source
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="flex gap-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm truncate">{product.name}</p>
                              <Badge
                                className={`${sourceLabels[product.source]?.color} text-white text-xs shrink-0`}
                              >
                                {sourceLabels[product.source]?.label}
                              </Badge>
                            </div>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground">{product.brand}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {product.shortDescription || product.description?.substring(0, 100)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Empty state */}
              {searchResults.length === 0 && !searchMutation.isPending && (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center">
                    <Database className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Search for a product to import its details
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Or switch to Manual mode for custom products
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* IMPORT TAB - Business fields only */}
            <TabsContent value="import" className="space-y-4 mt-4">
              {selectedProduct && (
                <>
                  {/* Selected Product Preview */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        {selectedProduct.images?.[0] && (
                          <img
                            src={selectedProduct.images[0]}
                            alt={selectedProduct.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${sourceLabels[selectedProduct.source]?.color} text-white text-xs`}
                            >
                              {sourceLabels[selectedProduct.source]?.label}
                            </Badge>
                            {selectedProduct.brand && (
                              <span className="text-xs text-muted-foreground">
                                {selectedProduct.brand}
                              </span>
                            )}
                          </div>
                          <p className="font-medium mt-1">{selectedProduct.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {selectedProduct.description?.substring(0, 150)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Duplicate Warning */}
                  {duplicateWarning?.exists && (
                    <Card className={duplicateWarning.matchType === "exact" ? "border-destructive" : "border-yellow-500"}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {duplicateWarning.matchType === "exact" ? (
                            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {duplicateWarning.matchType === "exact"
                                ? "Product Already Imported"
                                : "Similar Product Found"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              &quot;{duplicateWarning.existingProduct?.name}&quot; exists in database
                              {duplicateWarning.existingProduct?.price && (
                                <> at {formatTZS(duplicateWarning.existingProduct.price)}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Business Fields Form */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleImportSubmit)} className="space-y-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Business Details
                          </CardTitle>
                          <CardDescription>
                            Set pricing, inventory, and visibility
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Price */}
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (TZS) *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g., 25000000"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {field.value > 0 && formatTZS(field.value)}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Discount */}
                          <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Percent className="h-3 w-3" />
                                  Discount %
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                {field.value > 0 && form.watch("price") > 0 && (
                                  <FormDescription>
                                    Final: {formatTZS(Math.round(form.watch("price") * (1 - field.value / 100)))}
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Stock Quantity */}
                          <FormField
                            control={form.control}
                            name="stockQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Boxes className="h-3 w-3" />
                                  Stock Quantity *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="e.g., 50"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Category */}
                          <FormField
                            control={form.control}
                            name="categorySlug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Visibility */}
                          <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="flex items-center gap-2">
                                    {field.value ? (
                                      <Eye className="h-4 w-4" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    )}
                                    Published
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    {field.value
                                      ? "Product visible to customers"
                                      : "Product hidden from store"}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      {/* Import Button */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          importMutation.isPending ||
                          (duplicateWarning?.exists && duplicateWarning.matchType === "exact")
                        }
                      >
                        {importMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Import Product
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}

              {!selectedProduct && (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center">
                    <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select a product from search results first
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setMode("search")}
                    >
                      Go to Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* MANUAL TAB - Full form for custom products */}
            <TabsContent value="manual" className="space-y-4 mt-4">
              <Card className="border-dashed border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Advanced Mode</p>
                      <p className="text-xs text-muted-foreground">
                        For products not found in external databases. 
                        Consider using API search first for better data quality.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Manual product entry requires filling all fields including
                    name, description, images, and specifications.
                  </p>
                  <Button variant="outline" onClick={() => {
                    if (onOpenManualForm) {
                      onOpenManualForm();
                      return;
                    }
                    toast.info("Manual full form is not available in this view.");
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Open Full Form
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Footer Navigation */}
      <div className="border-t px-6 py-4 flex-shrink-0 bg-background">
        {mode === "search" && selectedProduct && (
          <Button className="w-full" onClick={() => setMode("import")}>
            Continue to Set Price
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        {mode === "import" && (
          <Button variant="outline" className="w-full" onClick={() => setMode("search")}>
            Back to Search
          </Button>
        )}
      </div>
    </SheetContent>
  );
}
