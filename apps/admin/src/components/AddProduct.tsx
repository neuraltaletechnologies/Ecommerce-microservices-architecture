"use client";

import { useState } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CategoryType, colors, ProductFormSchema, ProductType, sizes } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import {
  Upload,
  Package,
  Palette,
  Image as ImageIcon,
  FileJson,
  Sparkles,
  X,
  Plus,
  Check,
  Loader2,
  Search
} from "lucide-react";
import ExternalProductSearch, { ExternalProductResult } from "./ExternalProductSearch";

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Color hex mapping for visual display
const colorHexMap: Record<string, string> = {
  'Natural Titanium': '#8B8680',
  'Blue Titanium': '#5B7C99',
  'White Titanium': '#E8E4E0',
  'Black Titanium': '#3A3A3C',
  'Titanium Gray': '#71706E',
  'Space Black': '#1C1C1E',
  'Silver': '#C0C0C0',
  'Graphite': '#41424C',
  'Platinum': '#E5E4E2',
  'Sapphire': '#0F52BA',
  'blue': '#3B82F6',
  'green': '#22C55E',
  'red': '#EF4444',
  'yellow': '#EAB308',
  'purple': '#A855F7',
  'orange': '#F97316',
  'pink': '#EC4899',
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#6B7280',
  'brown': '#92400E',
};

interface AddProductProps {
  product?: ProductType;
  onSuccess?: () => void;
}

const allowedColors = new Set<string>(colors as unknown as string[]);
const allowedSizes = new Set<string>(sizes as unknown as string[]);

const pickFirstImageUrl = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === "string" && item.trim()) as string | undefined;
    return first?.trim();
  }

  return undefined;
};

const getFormDefaults = (product?: ProductType): z.infer<typeof ProductFormSchema> => {
  const rawImages = (product?.images && typeof product.images === "object"
    ? (product.images as Record<string, unknown>)
    : {}) as Record<string, unknown>;

  const normalizedImages: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(rawImages)) {
    const imageUrl = pickFirstImageUrl(value);
    if (imageUrl) normalizedImages[key] = imageUrl;
  }

  const imageKeys = Object.keys(normalizedImages);

  let normalizedColors = (product?.colors || []).filter((color) => allowedColors.has(color));
  if (product && normalizedColors.length === 0) {
    normalizedColors = imageKeys.filter((color) => allowedColors.has(color));
  }
  if (product && normalizedColors.length === 0) {
    normalizedColors = ["black"];
  }

  let normalizedSizes = (product?.sizes || []).filter((size) => allowedSizes.has(size));
  if (product && normalizedSizes.length === 0) {
    normalizedSizes = ["Standard"];
  }

  const fallbackImage = Object.values(normalizedImages)
    .map((value) => pickFirstImageUrl(value))
    .find(Boolean) || "https://placehold.co/600x600?text=Product";

  normalizedColors.forEach((color) => {
    if (!normalizedImages[color]) {
      normalizedImages[color] = fallbackImage;
    }
  });

  return {
    name: product?.name || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    price: product?.price || 0,
    categorySlug: product?.categorySlug || "",
    sizes: normalizedSizes as z.infer<typeof ProductFormSchema>["sizes"],
    colors: normalizedColors as z.infer<typeof ProductFormSchema>["colors"],
    images: normalizedImages as z.infer<typeof ProductFormSchema>["images"],
    techHighlights: product?.techHighlights || [],
    boxContents: product?.boxContents || [],
    productFeatures: product?.productFeatures || [],
    technicalSpecs: product?.technicalSpecs || {},
    certifications: product?.certifications || [],
    stockQuantity: product?.stockQuantity || 0,
    stockStatus: (product?.stockStatus || "in_stock") as z.infer<typeof ProductFormSchema>["stockStatus"],
    lowStockThreshold: product?.lowStockThreshold || 10,
    soldCount: product?.soldCount || 0,
    discount: product?.discount || 0,
    isPublished: product?.isPublished ?? true,
    brand: product?.brand || undefined,
    externalSource: product?.externalSource || undefined,
    externalId: product?.externalId || undefined,
  };
};

const AddProduct = ({ product, onSuccess }: AddProductProps) => {
  const isEditMode = !!product;
  const [activeTab, setActiveTab] = useState("basic");
  const [jsonInput, setJsonInput] = useState("");
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema) as any,
    defaultValues: getFormDefaults(product),
  });

  // Reset form when product changes (for edit mode)
  useEffect(() => {
    if (product) {
      form.reset(getFormDefaults(product));
    }
  }, [product, form]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product?.id}`
        : `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let message = isEditMode ? "Failed to update product!" : "Failed to create product!";
        try {
          const body = await res.json();
          message = body?.error || body?.message || message;
        } catch {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch {
            // Keep fallback message.
          }
        }
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (isEditMode && product?.id) {
        queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      }
      if (!isEditMode) {
        form.reset();
        setActiveTab("basic");
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getTabForField = (fieldPath: string): string => {
    const [root] = fieldPath.split(".");
    if (!root) return "basic";

    if (["sizes", "colors"].includes(root)) return "variants";
    if (root === "images") return "images";
    if (["techHighlights", "boxContents", "productFeatures", "technicalSpecs", "certifications"].includes(root)) {
      return "extras";
    }
    return "basic";
  };

  const handleFormSubmit = (data: z.infer<typeof ProductFormSchema>) => {
    mutation.mutate(data);
  };

  const handleFormInvalid = (errors: FieldErrors<z.infer<typeof ProductFormSchema>>) => {
    const firstErrorPath = Object.keys(errors)[0];
    if (!firstErrorPath) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    const tab = getTabForField(firstErrorPath);
    setActiveTab(tab);

    const fieldError = errors[firstErrorPath as keyof typeof errors];
    const message =
      (fieldError && typeof fieldError === "object" && "message" in fieldError && fieldError.message)
        ? String(fieldError.message)
        : "Please fix the highlighted field and try again.";

    toast.error(message);
  };

  // Import from JSON - quick way to populate form
  const handleJsonImport = () => {
    try {
      const data = JSON.parse(jsonInput);

      // Map the JSON data to form fields
      if (data.name) form.setValue("name", data.name);
      if (data.shortDescription) form.setValue("shortDescription", data.shortDescription);
      if (data.description) form.setValue("description", data.description);
      if (data.price) form.setValue("price", Number(data.price));
      if (data.categorySlug) form.setValue("categorySlug", data.categorySlug);
      if (data.sizes) form.setValue("sizes", data.sizes);
      if (data.colors) form.setValue("colors", data.colors);
      if (data.images) form.setValue("images", data.images);
      if (data.stockQuantity) form.setValue("stockQuantity", Number(data.stockQuantity));
      if (data.stockStatus) form.setValue("stockStatus", data.stockStatus);
      if (data.lowStockThreshold) form.setValue("lowStockThreshold", Number(data.lowStockThreshold));
      if (data.techHighlights) form.setValue("techHighlights", data.techHighlights);
      if (data.boxContents) form.setValue("boxContents", data.boxContents);
      if (data.productFeatures) form.setValue("productFeatures", data.productFeatures);
      if (data.technicalSpecs) form.setValue("technicalSpecs", data.technicalSpecs);
      if (data.certifications) form.setValue("certifications", data.certifications);

      toast.success("Data imported! Review and submit.");
      setJsonInput("");
      setActiveTab("basic");
    } catch (e) {
      toast.error("Invalid JSON format");
    }
  };

  // Import from external product API
  const handleExternalProductImport = (externalProduct: ExternalProductResult) => {
    // Map external product to form fields
    form.setValue("name", externalProduct.name);
    form.setValue("shortDescription", externalProduct.shortDescription || externalProduct.name);
    form.setValue("description", externalProduct.description);

    // Set suggested price if available, otherwise admin must set manually
    if (externalProduct.suggestedPrice) {
      form.setValue("price", externalProduct.suggestedPrice);
    }

    // Set technical specs from API
    if (Object.keys(externalProduct.technicalSpecs).length > 0) {
      form.setValue("technicalSpecs", externalProduct.technicalSpecs);
    }

    // Set images - map to a default color if images exist
    if (externalProduct.images.length > 0) {
      // Use first color if already selected, otherwise use "default"
      const currentColors = form.getValues("colors") || [];
      const imageColor = currentColors[0] || "default";
      form.setValue("images", { [imageColor]: externalProduct.images });

      // Auto-add the color if using default
      if (imageColor !== "default" && !currentColors.includes(imageColor as any)) {
        form.setValue("colors", [imageColor] as any);
      }
    }

    // Comprehensive category mapping from external APIs to our categories
    const categoryMapping: Record<string, string> = {
      // Smartphones & Phones
      "smartphones": "smartphones",
      "phones": "smartphones",
      "mobile": "smartphones",
      "mobile-accessories": "accessories",
      "iphone": "smartphones",
      "android": "smartphones",

      // Laptops & Computers
      "laptops": "laptops",
      "laptop": "laptops",
      "computers": "laptops",
      "computer": "laptops",
      "notebook": "laptops",
      "macbook": "laptops",

      // Tablets
      "tablets": "tablets",
      "tablet": "tablets",
      "ipad": "tablets",

      // Audio
      "audio": "audio",
      "headphones": "audio",
      "earphones": "audio",
      "earbuds": "audio",
      "speakers": "audio",
      "sound": "audio",

      // Wearables & Watches
      "wearables": "wearables",
      "smartwatches": "wearables",
      "smartwatch": "wearables",
      "watches": "wearables",
      "mens-watches": "wearables",
      "womens-watches": "wearables",
      "fitness": "wearables",
      "tracker": "wearables",

      // Gaming
      "gaming": "gaming",
      "games": "gaming",
      "console": "gaming",
      "playstation": "gaming",
      "xbox": "gaming",
      "nintendo": "gaming",
      "video-games": "gaming",

      // Accessories
      "accessories": "accessories",
      "charger": "accessories",
      "cable": "accessories",
      "case": "accessories",
      "cover": "accessories",
      "adapter": "accessories",
      "power-bank": "accessories",

      // DummyJSON specific categories
      "beauty": "accessories",
      "fragrances": "accessories",
      "furniture": "accessories",
      "groceries": "accessories",
      "home-decoration": "accessories",
      "kitchen-accessories": "accessories",
      "mens-shirts": "accessories",
      "mens-shoes": "accessories",
      "womens-bags": "accessories",
      "womens-dresses": "accessories",
      "womens-jewellery": "accessories",
      "womens-shoes": "accessories",
      "sunglasses": "accessories",
      "tops": "accessories",
      "vehicle": "accessories",
      "motorcycle": "accessories",
      "lighting": "accessories",
      "skin-care": "accessories",
      "sports-accessories": "accessories",

      // FakeStore specific categories
      "men's clothing": "accessories",
      "women's clothing": "accessories",
      "jewelery": "accessories",

      // Platzi specific categories
      "clothes": "accessories",
      "shoes": "accessories",
      "miscellaneous": "accessories",

      // General electronics fallbacks
      "electronics": "smartphones",
      "tech": "smartphones",
      "gadgets": "smartphones",
    };

    const normalizedCategory = externalProduct.category.toLowerCase();
    const matchedCategory = Object.entries(categoryMapping).find(([key]) =>
      normalizedCategory.includes(key)
    );
    if (matchedCategory) {
      form.setValue("categorySlug", matchedCategory[1]);
    }

    // Move to basic tab to let admin review and set price/stock
    setActiveTab("basic");
  };

  const selectedColors = form.watch("colors") || [];
  const selectedSizes = form.watch("sizes") || [];
  const currentImages = form.watch("images") || {};

  // Upload handler
  const handleImageUpload = async (color: string, file: File) => {
    setUploadingColor(color);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      const currentImages = form.getValues("images") || {};
      const colorImages = currentImages[color]
        ? (Array.isArray(currentImages[color])
          ? currentImages[color] as string[]
          : [currentImages[color] as string])
        : [];

      form.setValue("images", {
        ...currentImages,
        [color]: [...colorImages, data.url],
      } as any);

      toast.success(`Image uploaded for ${color}`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingColor(null);
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-xl p-0 max-h-[100dvh] overflow-hidden flex flex-col">
      <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
        <SheetTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          {isEditMode ? "Edit Product" : "Add New Product"}
        </SheetTitle>
        <SheetDescription>
          {isEditMode ? "Update product details" : "Fill in the details or import from JSON"}
        </SheetDescription>
      </SheetHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="search" className="text-xs gap-1">
              <Search className="h-3 w-3" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="basic" className="text-xs gap-1">
              <Package className="h-3 w-3" />
              <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="variants" className="text-xs gap-1">
              <Palette className="h-3 w-3" />
              <span className="hidden sm:inline">Variants</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs gap-1">
              <ImageIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Extras</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="text-xs gap-1">
              <FileJson className="h-3 w-3" />
              <span className="hidden sm:inline">JSON</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-6 min-h-0">
          <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(handleFormSubmit, handleFormInvalid)} className="pb-6">

              {/* EXTERNAL API SEARCH TAB */}
              <TabsContent value="search" className="space-y-4 mt-4">
                <ExternalProductSearch onSelectProduct={handleExternalProductImport} />
              </TabsContent>

              {/* BASIC INFO TAB */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="iPhone 15 Pro Max" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagline *</FormLabel>
                          <FormControl>
                            <Input placeholder="A17 Pro chip, Titanium design" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Full product description..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (TZS) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2500000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categorySlug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((cat: CategoryType) => (
                                  <SelectItem key={cat.id} value={cat.slug}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stockStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="limited_stock">Limited</SelectItem>
                                <SelectItem value="pre_order">Pre-Order</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Low Alert</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* VARIANTS TAB */}
              <TabsContent value="variants" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Colors *</CardTitle>
                    <CardDescription>Select available colors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="colors"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                              {colors.map((color) => {
                                const isSelected = field.value?.includes(color);
                                const hex = colorHexMap[color] || "#888";
                                return (
                                  <div
                                    key={color}
                                    onClick={() => {
                                      const current = field.value || [];
                                      if (isSelected) {
                                        field.onChange(current.filter((c) => c !== color));
                                        // Also remove images for this color
                                        const imgs = form.getValues("images") || {};
                                        delete imgs[color];
                                        form.setValue("images", imgs);
                                      } else {
                                        field.onChange([...current, color]);
                                      }
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all text-sm ${isSelected
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                      }`}
                                  >
                                    <div
                                      className="w-4 h-4 rounded-full border shrink-0"
                                      style={{ backgroundColor: hex }}
                                    />
                                    <span className="truncate flex-1">{color}</span>
                                    {isSelected && <Check className="h-3 w-3 text-primary shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedColors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                        {selectedColors.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Sizes / Variants *</CardTitle>
                    <CardDescription>Storage, dimensions, etc.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="sizes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-4 gap-2 max-h-[150px] overflow-y-auto pr-2">
                              {sizes.map((size) => {
                                const isSelected = field.value?.includes(size);
                                return (
                                  <div
                                    key={size}
                                    onClick={() => {
                                      const current = field.value || [];
                                      if (isSelected) {
                                        field.onChange(current.filter((s) => s !== size));
                                      } else {
                                        field.onChange([...current, size]);
                                      }
                                    }}
                                    className={`p-2 text-center rounded-md border cursor-pointer transition-all text-xs ${isSelected
                                        ? "border-primary bg-primary/10 font-medium"
                                        : "border-border hover:border-primary/50"
                                      }`}
                                  >
                                    {size}
                                  </div>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedSizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                        {selectedSizes.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* IMAGES TAB */}
              <TabsContent value="images" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Product Images *</CardTitle>
                    <CardDescription>
                      Upload at least one image per color
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedColors.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select colors first</p>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => setActiveTab("variants")}
                        >
                          Go to Variants tab
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedColors.map((color) => {
                          const hex = colorHexMap[color] || "#888";
                          const images = currentImages[color];
                          const imageArray = images
                            ? (Array.isArray(images) ? images : [images])
                            : [];

                          return (
                            <div key={color} className="p-3 border rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: hex }}
                                />
                                <span className="text-sm font-medium flex-1">{color}</span>
                                {imageArray.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {imageArray.length} image{imageArray.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="text-xs flex-1"
                                  disabled={uploadingColor === color}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(color, file);
                                    e.target.value = '';
                                  }}
                                />
                                {uploadingColor === color && (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                              </div>

                              {imageArray.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {imageArray.map((url: string, idx: number) => (
                                    <div key={idx} className="relative group">
                                      <img
                                        src={url}
                                        alt={`${color} ${idx + 1}`}
                                        className="w-14 h-14 object-cover rounded border"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = form.getValues("images") || {};
                                          const filtered = imageArray.filter((_, i) => i !== idx);
                                          form.setValue("images", {
                                            ...current,
                                            [color]: filtered.length > 0 ? filtered : undefined,
                                          } as any);
                                        }}
                                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </TabsContent>

              {/* EXTRAS TAB */}
              <TabsContent value="extras" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tech Highlights</CardTitle>
                    <CardDescription>Key features to showcase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="techHighlights"
                      render={({ field }) => (
                        <div className="space-y-2">
                          {(field.value || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                placeholder="Label"
                                value={item.label}
                                onChange={(e) => {
                                  const arr = [...(field.value || [])];
                                  arr[idx] = { label: e.target.value, icon: arr[idx]?.icon || "" };
                                  field.onChange(arr);
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Icon"
                                value={item.icon}
                                onChange={(e) => {
                                  const arr = [...(field.value || [])];
                                  arr[idx] = { label: arr[idx]?.label || "", icon: e.target.value };
                                  field.onChange(arr);
                                }}
                                className="w-20"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => field.onChange((field.value || []).filter((_, i) => i !== idx))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange([...(field.value || []), { label: "", icon: "" }])}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Box Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="boxContents"
                      render={({ field }) => (
                        <div className="space-y-2">
                          {(field.value || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                placeholder="Item name"
                                value={item}
                                onChange={(e) => {
                                  const arr = [...(field.value || [])];
                                  arr[idx] = e.target.value;
                                  field.onChange(arr);
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => field.onChange((field.value || []).filter((_, i) => i !== idx))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange([...(field.value || []), ""])}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Product Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="productFeatures"
                      render={({ field }) => (
                        <div className="space-y-2">
                          {(field.value || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => {
                                  const arr = [...(field.value || [])];
                                  arr[idx] = { title: e.target.value, description: arr[idx]?.description || "" };
                                  field.onChange(arr);
                                }}
                                className="w-1/3"
                              />
                              <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => {
                                  const arr = [...(field.value || [])];
                                  arr[idx] = { title: arr[idx]?.title || "", description: e.target.value };
                                  field.onChange(arr);
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => field.onChange((field.value || []).filter((_, i) => i !== idx))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange([...(field.value || []), { title: "", description: "" }])}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("images")}>
                    ← Back
                  </Button>
                </div>
              </TabsContent>

              {/* IMPORT TAB */}
              <TabsContent value="import" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      Quick Import
                    </CardTitle>
                    <CardDescription>
                      Paste JSON to auto-fill the form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder={`{
  "name": "Product Name",
  "shortDescription": "Brief tagline",
  "description": "Full description",
  "price": 1000000,
  "categorySlug": "smartphones",
  "colors": ["black", "white"],
  "sizes": ["128GB", "256GB"],
  "stockQuantity": 50
}`}
                      className="min-h-[180px] font-mono text-xs"
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleJsonImport}
                      disabled={!jsonInput.trim()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import & Review
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {`{
  "name": "iPhone 15 Pro",
  "shortDescription": "A17 Pro chip",
  "description": "Full description here",
  "price": 2500000,
  "categorySlug": "smartphones",
  "colors": ["Natural Titanium", "Blue Titanium"],
  "sizes": ["128GB", "256GB", "512GB"],
  "stockQuantity": 100,
  "stockStatus": "in_stock",
  "techHighlights": [
    { "label": "A17 Pro", "icon": "Cpu" }
  ],
  "boxContents": ["iPhone", "USB-C Cable"]
}`}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

            </form>
          </Form>
        </ScrollArea>

        {/* Fixed footer with navigation and submit button - outside ScrollArea */}
        <div className="border-t px-6 py-4 flex-shrink-0 bg-background space-y-3">
          {/* Tab navigation rows */}
          {activeTab === "search" && (
            <Button type="button" className="w-full" onClick={() => setActiveTab("basic")}>
              Skip to Manual Entry →
            </Button>
          )}
          {activeTab === "basic" && (
            <Button type="button" className="w-full" onClick={() => setActiveTab("variants")}>
              Next: Select Variants →
            </Button>
          )}
          {activeTab === "variants" && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("basic")}>
                ← Back
              </Button>
              <Button type="button" className="flex-1" onClick={() => setActiveTab("images")}>
                Next: Images →
              </Button>
            </div>
          )}
          {activeTab === "images" && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("variants")}>
                ← Back
              </Button>
              <Button type="button" className="flex-1" onClick={() => setActiveTab("extras")}>
                Next: Extras →
              </Button>
            </div>
          )}
          {activeTab === "extras" && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("images")}>
                ← Back
              </Button>
              <Button type="submit" form="product-form" className="flex-1" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Product" : "Create Product"
                )}
              </Button>
            </div>
          )}
          {activeTab === "import" && (
            <Button type="button" variant="outline" className="w-full" onClick={() => setActiveTab("basic")}>
              Done Reviewing
            </Button>
          )}
        </div>
      </Tabs>
    </SheetContent>
  );
};

export default AddProduct;
