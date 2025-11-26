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
          <SheetTitle className="mb-4">Add Tech Product</SheetTitle>
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
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id="size"
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
                              <label htmlFor="size" className="text-xs">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available storage/RAM options (e.g., 256GB, 512GB, 1TB) or screen sizes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {colors.map((color) => (
                              <div
                                className="flex items-center gap-2"
                                key={color}
                              >
                                <Checkbox
                                  id="color"
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
                                <label
                                  htmlFor="color"
                                  className="text-xs flex items-center gap-2"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available colors/finishes for this tech product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <div className="">
                          {form.watch("colors")?.map((color) => (
                            <div
                              className="mb-4 flex items-center gap-4"
                              key={color}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-sm font-medium min-w-[80px]">
                                  {color}:
                                </span>
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      formData.append(
                                        "upload_preset",
                                        "ecommerce"
                                      );

                                      const res = await fetch(
                                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                        {
                                          method: "POST",
                                          body: formData,
                                        }
                                      );
                                      const data = await res.json();

                                      if (data.secure_url) {
                                        const currentImages =
                                          form.getValues("images") || {};
                                        form.setValue("images", {
                                          ...currentImages,
                                          [color]: data.secure_url,
                                        });
                                      }
                                    } catch (error) {
                                      console.log(error);
                                      toast.error("Upload failed!");
                                    }
                                  }
                                }}
                              />
                              {field.value?.[color] ? (
                                <span className="text-green-600 text-sm">
                                  Image selected
                                </span>
                              ) : (
                                <span className="text-red-600 text-sm">
                                  Image required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
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
                                    newHighlights[index].label = e.target.value;
                                    field.onChange(newHighlights);
                                  }}
                                />
                                <Input
                                  placeholder="Icon (e.g., Cpu)"
                                  value={highlight.icon}
                                  onChange={(e) => {
                                    const newHighlights = [...(field.value || [])];
                                    newHighlights[index].icon = e.target.value;
                                    field.onChange(newHighlights);
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
                                    newFeatures[index].title = e.target.value;
                                    field.onChange(newFeatures);
                                  }}
                                />
                                <Textarea
                                  placeholder="Description"
                                  value={feature.description}
                                  onChange={(e) => {
                                    const newFeatures = [...(field.value || [])];
                                    newFeatures[index].description = e.target.value;
                                    field.onChange(newFeatures);
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
                                        newSpecs[category][index].label = e.target.value;
                                        field.onChange(newSpecs);
                                      }}
                                    />
                                    <Input
                                      placeholder="Value"
                                      value={spec.value}
                                      onChange={(e) => {
                                        const newSpecs = { ...(field.value || {}) };
                                        newSpecs[category][index].value = e.target.value;
                                        field.onChange(newSpecs);
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newSpecs = { ...(field.value || {}) };
                                        newSpecs[category] = newSpecs[category].filter((_, i) => i !== index);
                                        field.onChange(newSpecs);
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
                                    newSpecs[category] = [...newSpecs[category], { label: "", value: "" }];
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
                                    newCerts[index].label = e.target.value;
                                    field.onChange(newCerts);
                                  }}
                                />
                                <Input
                                  placeholder="Icon (e.g., ShieldCheck)"
                                  value={cert.icon}
                                  onChange={(e) => {
                                    const newCerts = [...(field.value || [])];
                                    newCerts[index].icon = e.target.value;
                                    field.onChange(newCerts);
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
