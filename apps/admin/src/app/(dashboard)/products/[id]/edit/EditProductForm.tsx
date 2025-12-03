"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ProductType, colors as availableColors, sizes as availableSizes, CategoryType } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type EditProductFormProps = {
  product: ProductType;
};

type FormData = {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  categorySlug: string;
  colors: string[];
  sizes: string[];
  images: Record<string, string>;
  techHighlights: Array<{label: string, icon: string}>;
  boxContents: string[];
  productFeatures: Array<{title: string, description: string}>;
  technicalSpecs: Record<string, Array<{label: string, value: string}>>;
  certifications: Array<{label: string, icon: string}>;
};

const fetchCategories = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  
  const [formData, setFormData] = useState<FormData>({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description || "",
    price: product.price,
    categorySlug: product.categorySlug,
    colors: product.colors,
    sizes: product.sizes,
    images: typeof product.images === 'object' ? product.images as Record<string, string> : {},
    techHighlights: (product.techHighlights as Array<{label: string, icon: string}>) || [],
    boxContents: (product.boxContents as string[]) || [],
    productFeatures: (product.productFeatures as Array<{title: string, description: string}>) || [],
    technicalSpecs: (product.technicalSpecs as Record<string, Array<{label: string, value: string}>>) || {},
    certifications: (product.certifications as Array<{label: string, icon: string}>) || [],
  });

  const handleColorToggle = (color: string) => {
    const isSelected = formData.colors.includes(color);
    if (isSelected) {
      const newImages = {...formData.images};
      delete newImages[color];
      setFormData({
        ...formData,
        colors: formData.colors.filter(c => c !== color),
        images: newImages
      });
    } else {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
    }
  };

  const handleSizeToggle = (size: string) => {
    const isSelected = formData.sizes.includes(size);
    if (isSelected) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = await getToken();
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      toast.success("Product updated successfully");
      router.push(`/products/${product.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };
      }

      toast.success("Product updated successfully");
      router.push(`/products/${product.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <Link href={`/products/${product.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential product details and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the product name (e.g., Gaming Laptop, Wireless Earbuds)
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
                      Brief specs and features
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
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormDescription>
                      Detailed product description
                    </FormDescription>
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
                      <FormLabel>Price (TZS)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category: CategoryType) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants & Options</CardTitle>
              <CardDescription>
                Available colors and sizes for this product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="colors"
                render={() => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {colors.map((color) => (
                        <FormField
                          key={color}
                          control={form.control}
                          name="colors"
                          render={({ field }) => (
                            <FormItem
                              key={color}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(color)}
                                  onCheckedChange={(checked) => {
                                    const newColors = checked
                                      ? [...(field.value || []), color]
                                      : field.value?.filter((val) => val !== color) || [];
                                    field.onChange(newColors);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{color}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizes"
                render={() => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {sizes.map((size) => (
                        <FormField
                          key={size}
                          control={form.control}
                          name="sizes"
                          render={({ field }) => (
                            <FormItem
                              key={size}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(size)}
                                  onCheckedChange={(checked) => {
                                    const newSizes = checked
                                      ? [...(field.value || []), size]
                                      : field.value?.filter((val) => val !== size) || [];
                                    field.onChange(newSizes);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{size}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Add image URLs for each color variant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs by Color</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {form.watch("colors")?.map((color) => (
                          <div key={color} className="flex gap-2 items-center">
                            <Label className="w-24">{color}</Label>
                            <Input
                              placeholder={`Enter ${color} image URL`}
                              value={field.value?.[color] || ""}
                              onChange={(e) => {
                                field.onChange({
                                  ...field.value,
                                  [color]: e.target.value,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide image URLs for selected colors
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extended Product Information</CardTitle>
              <CardDescription>
                Additional details for enhanced product presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="techHighlights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Highlights</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {(field.value || []).map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter highlight"
                              value={field.value?.[index] || ""}
                              onChange={(e) => {
                                const newHighlights = [...(field.value || [])];
                                newHighlights[index] = e.target.value;
                                field.onChange(newHighlights);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newHighlights = field.value?.filter((_, i) => i !== index) || [];
                                field.onChange(newHighlights);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...(field.value || []), ""])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Highlight
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Key technical features and highlights
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="boxContents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Contents</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {(field.value || []).map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Item in the box"
                              value={field.value?.[index] || ""}
                              onChange={(e) => {
                                const newContents = [...(field.value || [])];
                                newContents[index] = e.target.value;
                                field.onChange(newContents);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newContents = field.value?.filter((_, i) => i !== index) || [];
                                field.onChange(newContents);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...(field.value || []), ""])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      What&apos;s included in the box
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Features</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {(field.value || []).map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Feature description"
                              value={field.value?.[index] || ""}
                              onChange={(e) => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures[index] = e.target.value;
                                field.onChange(newFeatures);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newFeatures = field.value?.filter((_, i) => i !== index) || [];
                                field.onChange(newFeatures);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...(field.value || []), ""])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Detailed product features
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicalSpecs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter as JSON, e.g., {"Display": "15.6 FHD", "RAM": "16GB DDR4"}'
                        value={JSON.stringify(field.value || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            field.onChange(parsed);
                          } catch {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      Technical specifications in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
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
                              <Trash className="h-4 w-4" />
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
                          <Plus className="h-4 w-4 mr-2" />
                          Add Certification
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Certifications and compliance badges
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 sticky bottom-0 bg-background pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/products/${product.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
