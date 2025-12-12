"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

// const categories = [
//   "T-shirts",
//   "Shoes",
//   "Accessories",
//   "Bags",
//   "Dresses",
//   "Jackets",
//   "Gloves",
// ] as const;

const fetchCategories = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to fetch categories:', res.status, errorText);
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const AddProduct = () => {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
      techHighlights: [],
      boxContents: [],
      productFeatures: [],
      technicalSpecs: {},
      certifications: [],
      stockQuantity: 0,
      stockStatus: "in_stock",
      lowStockThreshold: 10,
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error message if categories failed to load
  if (error) {
    console.error('Categories query error:', error);
  }

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to create product!");
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add New Tech Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the product name (e.g., Gaming Laptop, Wireless Earbuds, Smartphone).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Brief specs and features (e.g., "Intel Core i7, RTX 4060, 16GB RAM").
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price in TZS (Tanzanian Shillings).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inventory Management Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Inventory Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="stockQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Current inventory count
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stockStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Status</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="limited_stock">Limited Stock</SelectItem>
                                <SelectItem value="pre_order">Pre-Order</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Product availability status
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Alert</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Alert when stock falls below
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {data && (
                  <FormField
                    control={form.control}
                    name="categorySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.map((cat: CategoryType) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select category: Laptops, Smartphones, Audio, Gaming, Wearables, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes / Capacities / Variants</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Storage Capacities */}
                          <div>
                            <p className="text-sm font-medium mb-2 text-muted-foreground">Storage Capacity</p>
                            <div className="grid grid-cols-3 gap-3">
                              {sizes.filter(s => s.includes('GB') || s.includes('TB')).map((size) => (
                                <div className="flex items-center gap-2" key={size}>
                                  <Checkbox
                                    id={`size-${size}`}
                                    checked={field.value?.includes(size)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValues, size]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter((v) => v !== size)
                                        );
                                      }
                                    }}
                                  />
                                  <label htmlFor={`size-${size}`} className="text-xs font-medium cursor-pointer">
                                    {size}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Screen Sizes */}
                          <div>
                            <p className="text-sm font-medium mb-2 text-muted-foreground">Screen Size / Watch Size</p>
                            <div className="grid grid-cols-3 gap-3">
                              {sizes.filter(s => s.includes('inch') || s.includes('mm')).map((size) => (
                                <div className="flex items-center gap-2" key={size}>
                                  <Checkbox
                                    id={`size-${size}`}
                                    checked={field.value?.includes(size)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValues, size]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter((v) => v !== size)
                                        );
                                      }
                                    }}
                                  />
                                  <label htmlFor={`size-${size}`} className="text-xs font-medium cursor-pointer">
                                    {size}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Other Sizes */}
                          <div>
                            <p className="text-sm font-medium mb-2 text-muted-foreground">Other Variants</p>
                            <div className="grid grid-cols-3 gap-3">
                              {sizes.filter(s => !s.includes('GB') && !s.includes('TB') && !s.includes('inch') && !s.includes('mm')).map((size) => (
                                <div className="flex items-center gap-2" key={size}>
                                  <Checkbox
                                    id={`size-${size}`}
                                    checked={field.value?.includes(size)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValues, size]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter((v) => v !== size)
                                        );
                                      }
                                    }}
                                  />
                                  <label htmlFor={`size-${size}`} className="text-xs font-medium cursor-pointer">
                                    {size}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available storage capacities, screen sizes, or other product variants.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => {
                    // Color mapping for better visual representation
                    const getColorStyle = (color: string) => {
                      const colorMap: Record<string, string> = {
                        'Natural Titanium': '#8B8680',
                        'Blue Titanium': '#5B7C99',
                        'White Titanium': '#E8E4E0',
                        'Black Titanium': '#3A3A3C',
                        'Titanium Gray': '#71706E',
                        'Titanium Black': '#2D2D2F',
                        'Titanium Violet': '#8B6C9C',
                        'Titanium Yellow': '#F5D547',
                        'Space Black': '#1C1C1E',
                        'Silver': '#C0C0C0',
                        'Platinum Silver': '#E5E4E2',
                        'Graphite': '#41424C',
                        'Off Black': '#2C2C2E',
                        'Storm Grey': '#6C7278',
                        'White Smoke': '#F5F5F5',
                        'Moonstone Blue': '#73A9C2',
                        'Pale Gray': '#D3D3D3',
                        'Off-White': '#FAF9F6',
                        'Dark Grey': '#4A4A4A',
                        'Natural': '#E8DCC8',
                        'Platinum': '#E5E4E2',
                        'Sapphire': '#0F52BA',
                        'Dune': '#C5B59A',
                        'Black/Cyan': 'linear-gradient(90deg, #000000 50%, #00FFFF 50%)',
                        'White/Black': 'linear-gradient(90deg, #FFFFFF 50%, #000000 50%)',
                        'blue': '#3B82F6',
                        'green': '#22C55E',
                        'red': '#EF4444',
                        'yellow': '#EAB308',
                        'purple': '#A855F7',
                        'orange': '#F97316',
                        'pink': '#EC4899',
                        'brown': '#92400E',
                        'gray': '#6B7280',
                        'black': '#000000',
                        'white': '#FFFFFF',
                      };
                      return colorMap[color] || color.toLowerCase();
                    };

                    return (
                      <FormItem>
                        <FormLabel>Colors / Finishes</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Premium/Titanium Colors */}
                            <div>
                              <p className="text-sm font-medium mb-2 text-muted-foreground">Premium Finishes</p>
                              <div className="grid grid-cols-2 gap-3">
                                {colors.filter(c => c.includes('Titanium') || c === 'Platinum' || c === 'Sapphire').map((color) => {
                                  const colorStyle = getColorStyle(color);
                                  const isGradient = colorStyle.includes('gradient');
                                  return (
                                    <div className="flex items-center gap-2" key={color}>
                                      <Checkbox
                                        id={`color-${color}`}
                                        checked={field.value?.includes(color)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, color]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter((v) => v !== color)
                                            );
                                          }
                                        }}
                                      />
                                      <label htmlFor={`color-${color}`} className="text-xs flex items-center gap-2 cursor-pointer">
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                          style={isGradient ? { background: colorStyle } : { backgroundColor: colorStyle }}
                                        />
                                        <span className="font-medium">{color}</span>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Standard Colors */}
                            <div>
                              <p className="text-sm font-medium mb-2 text-muted-foreground">Standard Colors</p>
                              <div className="grid grid-cols-2 gap-3">
                                {colors.filter(c => !c.includes('Titanium') && c !== 'Platinum' && c !== 'Sapphire' && !c.includes('/')).map((color) => {
                                  const colorStyle = getColorStyle(color);
                                  return (
                                    <div className="flex items-center gap-2" key={color}>
                                      <Checkbox
                                        id={`color-${color}`}
                                        checked={field.value?.includes(color)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, color]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter((v) => v !== color)
                                            );
                                          }
                                        }}
                                      />
                                      <label htmlFor={`color-${color}`} className="text-xs flex items-center gap-2 cursor-pointer">
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                          style={{ backgroundColor: colorStyle }}
                                        />
                                        <span className="capitalize">{color}</span>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Two-tone Colors */}
                            {colors.some(c => c.includes('/')) && (
                              <div>
                                <p className="text-sm font-medium mb-2 text-muted-foreground">Two-Tone Finishes</p>
                                <div className="grid grid-cols-2 gap-3">
                                  {colors.filter(c => c.includes('/')).map((color) => {
                                    const colorStyle = getColorStyle(color);
                                    return (
                                      <div className="flex items-center gap-2" key={color}>
                                        <Checkbox
                                          id={`color-${color}`}
                                          checked={field.value?.includes(color)}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            if (checked) {
                                              field.onChange([...currentValues, color]);
                                            } else {
                                              field.onChange(
                                                currentValues.filter((v) => v !== color)
                                              );
                                            }
                                          }}
                                        />
                                        <label htmlFor={`color-${color}`} className="text-xs flex items-center gap-2 cursor-pointer">
                                          <div
                                            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                            style={{ background: colorStyle }}
                                          />
                                          <span className="font-medium">{color}</span>
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select available colors and finishes for this tech product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => {
                    const getColorStyle = (color: string) => {
                      const colorMap: Record<string, string> = {
                        'Natural Titanium': '#8B8680',
                        'Blue Titanium': '#5B7C99',
                        'White Titanium': '#E8E4E0',
                        'Black Titanium': '#3A3A3C',
                        'Titanium Gray': '#71706E',
                        'Space Black': '#1C1C1E',
                        'Silver': '#C0C0C0',
                        'Graphite': '#41424C',
                        'blue': '#3B82F6',
                        'green': '#22C55E',
                        'red': '#EF4444',
                        'black': '#000000',
                        'white': '#FFFFFF',
                      };
                      return colorMap[color] || color.toLowerCase();
                    };

                    return (
                      <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {form.watch("colors")?.length === 0 && (
                              <p className="text-sm text-muted-foreground italic p-4 bg-muted/50 rounded-md">
                                Select colors first to upload images for each variant.
                              </p>
                            )}
                            {form.watch("colors")?.map((color) => {
                              const colorStyle = getColorStyle(color);
                              return (
                                <div
                                  className="p-3 border rounded-lg hover:border-primary/50 transition-colors"
                                  key={color}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <div
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                                      style={{ backgroundColor: colorStyle }}
                                    />
                                    <span className="text-sm font-semibold min-w-[120px]">
                                      {color}
                                    </span>
                                    {field.value?.[color] && (
                                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Uploaded
                                      </span>
                                    )}
                                  </div>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          toast.info(`Uploading ${color} image...`);
                                          const formData = new FormData();
                                          formData.append("image", file);

                                          const token = await getToken();
                                          const res = await fetch(
                                            `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/upload/upload`,
                                            {
                                              method: "POST",
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                              body: formData,
                                            }
                                          );

                                          if (!res.ok) {
                                            throw new Error('Upload failed');
                                          }

                                          const data = await res.json();

                                          if (data.url) {
                                            const currentImages =
                                              form.getValues("images") || {};
                                            
                                            // Store as array to match database structure
                                            const existingImages = currentImages[color];
                                            const imageArray = Array.isArray(existingImages) 
                                              ? [...existingImages, data.url]
                                              : typeof existingImages === 'string'
                                              ? [existingImages, data.url]
                                              : [data.url];
                                            
                                            form.setValue("images", {
                                              ...currentImages,
                                              [color]: imageArray,
                                            });
                                            toast.success(`${color} image uploaded!`);
                                          }
                                        } catch (error) {
                                          console.log(error);
                                          toast.error(`Failed to upload ${color} image!`);
                                        }
                                      }
                                    }}
                                  />
                                  {field.value?.[color] && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {(Array.isArray(field.value[color]) 
                                        ? field.value[color] 
                                        : [field.value[color]]
                                      ).map((url: string, idx: number) => (
                                        <div key={idx} className="relative">
                                          <img 
                                            src={url} 
                                            alt={`${color} variant ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded border"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentImages = form.getValues("images") || {};
                                              const colorImages = Array.isArray(currentImages[color])
                                                ? currentImages[color] as string[]
                                                : [currentImages[color] as string];
                                              const newImages = colorImages.filter((_, i) => i !== idx);
                                              form.setValue("images", {
                                                ...currentImages,
                                                [color]: newImages.length > 0 ? newImages : undefined,
                                              } as any);
                                              toast.success(`Image removed`);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload high-quality product images for each color variant (recommended: 1000x1000px).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                {/* Extended Data Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Extended Product Data (Optional)</h3>
                  
                  {/* Tech Highlights */}
                  <FormField
                    control={form.control}
                    name="techHighlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tech Highlights</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {(field.value || []).map((highlight, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Label (e.g., Processor)"
                                  value={highlight.label}
                                  onChange={(e) => {
                                    const newHighlights = [...(field.value || [])];
                                    if (newHighlights[index]) {
                                      newHighlights[index].label = e.target.value;
                                      field.onChange(newHighlights);
                                    }
                                  }}
                                />
                                <Input
                                  placeholder="Icon (e.g., Cpu)"
                                  value={highlight.icon}
                                  onChange={(e) => {
                                    const newHighlights = [...(field.value || [])];
                                    if (newHighlights[index]) {
                                      newHighlights[index].icon = e.target.value;
                                      field.onChange(newHighlights);
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const newHighlights = (field.value || []).filter((_, i) => i !== index);
                                    field.onChange(newHighlights);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange([...(field.value || []), { label: "", icon: "" }]);
                              }}
                            >
                              Add Tech Highlight
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Add key tech specs badges (e.g., "Intel Core i7", "16GB RAM").
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Box Contents */}
                  <FormField
                    control={form.control}
                    name="boxContents"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>What's in the Box</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {(field.value || []).map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Item (e.g., Laptop, Charger, USB Cable)"
                                  value={item}
                                  onChange={(e) => {
                                    const newItems = [...(field.value || [])];
                                    newItems[index] = e.target.value;
                                    field.onChange(newItems);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const newItems = (field.value || []).filter((_, i) => i !== index);
                                    field.onChange(newItems);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange([...(field.value || []), ""]);
                              }}
                            >
                              Add Box Item
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          List all items included in the package.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Features */}
                  <FormField
                    control={form.control}
                    name="productFeatures"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Product Features</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {(field.value || []).map((feature, index) => (
                              <div key={index} className="space-y-2 p-3 border rounded">
                                <Input
                                  placeholder="Title (e.g., Ultra-Fast Performance)"
                                  value={feature.title}
                                  onChange={(e) => {
                                    const newFeatures = [...(field.value || [])];
                                    if (newFeatures[index]) {
                                      newFeatures[index].title = e.target.value;
                                      field.onChange(newFeatures);
                                    }
                                  }}
                                />
                                <Textarea
                                  placeholder="Description"
                                  value={feature.description}
                                  onChange={(e) => {
                                    const newFeatures = [...(field.value || [])];
                                    if (newFeatures[index]) {
                                      newFeatures[index].description = e.target.value;
                                      field.onChange(newFeatures);
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const newFeatures = (field.value || []).filter((_, i) => i !== index);
                                    field.onChange(newFeatures);
                                  }}
                                >
                                  Remove Feature
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange([...(field.value || []), { title: "", description: "" }]);
                              }}
                            >
                              Add Product Feature
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Describe key product features and benefits.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Technical Specifications */}
                  <FormField
                    control={form.control}
                    name="technicalSpecs"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Technical Specifications</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {Object.entries(field.value || {}).map(([category, specs]) => (
                              <div key={category} className="p-3 border rounded">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{category}</h4>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newSpecs = { ...(field.value || {}) };
                                      delete newSpecs[category];
                                      field.onChange(newSpecs);
                                    }}
                                  >
                                    Remove Category
                                  </Button>
                                </div>
                                {specs.map((spec, index) => (
                                  <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                      placeholder="Label"
                                      value={spec.label}
                                      onChange={(e) => {
                                        const newSpecs = { ...(field.value || {}) };
                                        if (newSpecs[category] && newSpecs[category][index]) {
                                          newSpecs[category][index].label = e.target.value;
                                          field.onChange(newSpecs);
                                        }
                                      }}
                                    />
                                    <Input
                                      placeholder="Value"
                                      value={spec.value}
                                      onChange={(e) => {
                                        const newSpecs = { ...(field.value || {}) };
                                        if (newSpecs[category] && newSpecs[category][index]) {
                                          newSpecs[category][index].value = e.target.value;
                                          field.onChange(newSpecs);
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newSpecs = { ...(field.value || {}) };
                                        if (newSpecs[category]) {
                                          newSpecs[category] = newSpecs[category].filter((_, i) => i !== index);
                                          field.onChange(newSpecs);
                                        }
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSpecs = { ...(field.value || {}) };
                                    if (newSpecs[category]) {
                                      newSpecs[category] = [...newSpecs[category], { label: "", value: "" }];
                                    } else {
                                      newSpecs[category] = [{ label: "", value: "" }];
                                    }
                                    field.onChange(newSpecs);
                                  }}
                                >
                                  Add Spec to {category}
                                </Button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input
                                id="newCategory"
                                placeholder="New category (e.g., Display, Performance)"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const input = document.getElementById("newCategory") as HTMLInputElement;
                                  const category = input.value.trim();
                                  if (category && !(field.value || {})[category]) {
                                    field.onChange({ ...(field.value || {}), [category]: [] });
                                    input.value = "";
                                  }
                                }}
                              >
                                Add Category
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Group technical specs by categories (Display, Performance, etc.).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Certifications */}
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {(field.value || []).map((cert, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Label (e.g., CE Certified)"
                                  value={cert.label}
                                  onChange={(e) => {
                                    const newCerts = [...(field.value || [])];
                                    if (newCerts[index]) {
                                      newCerts[index].label = e.target.value;
                                      field.onChange(newCerts);
                                    }
                                  }}
                                />
                                <Input
                                  placeholder="Icon (e.g., ShieldCheck)"
                                  value={cert.icon}
                                  onChange={(e) => {
                                    const newCerts = [...(field.value || [])];
                                    if (newCerts[index]) {
                                      newCerts[index].icon = e.target.value;
                                      field.onChange(newCerts);
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const newCerts = (field.value || []).filter((_, i) => i !== index);
                                    field.onChange(newCerts);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange([...(field.value || []), { label: "", icon: "" }]);
                              }}
                            >
                              Add Certification
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Add certifications and compliance badges.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
