"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "./ui/button";
import { CategoryFormSchema } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const MultipleCategorySchema = z.object({
  categories: z.array(CategoryFormSchema).min(1, "At least one category is required"),
});

const AddCategory = ({ onClose }: { onClose?: () => void }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof MultipleCategorySchema>>({
    resolver: zodResolver(MultipleCategorySchema),
    defaultValues: {
      categories: [{ name: "", slug: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof MultipleCategorySchema>) => {
      const token = await getToken();
      
      const promises = data.categories.map((category) =>
        fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`, {
          method: "POST",
          body: JSON.stringify(category),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          if (!res.ok) throw new Error(`Failed to create: ${category.name}`);
          return res.json();
        })
      );
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Categories created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset({ categories: [{ name: "", slug: "" }] });
      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Helper to auto-generate slug
  const generateSlug = (name: string, index: number) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    form.setValue(`categories.${index}.slug`, slug);
  };

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 gap-0">
      <SheetHeader className="px-6 pt-6 pb-4 flex-shrink-0">
        <SheetTitle>Add Categories</SheetTitle>
        <SheetDescription>
          Add one or more categories to your store.
        </SheetDescription>
      </SheetHeader>
      
      <ScrollArea className="flex-1 overflow-y-auto px-6">
        <Form {...form}>
          <form
            id="categories-form"
            className="space-y-6 pb-6"
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          >
            {fields.map((field, index) => (
              <div key={field.id} className="relative border rounded-md p-4 bg-muted/20 space-y-4">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <h4 className="text-sm font-medium">Category {index + 1}</h4>
                
                <FormField
                  control={form.control}
                  name={`categories.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Smartwatches"
                          onChange={(e) => {
                            field.onChange(e);
                            generateSlug(e.target.value, index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categories.${index}.slug`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. smartwatches" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => append({ name: "", slug: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Category
            </Button>
          </form>
        </Form>
      </ScrollArea>
      
      <div className="border-t px-6 py-4 flex-shrink-0 bg-background">
        <Button
          type="submit"
          form="categories-form"
          className="w-full"
          disabled={mutation.isPending || fields.length === 0}
        >
          {mutation.isPending ? "Submitting..." : `Save ${fields.length} Categories`}
        </Button>
      </div>
    </SheetContent>
  );
};

export default AddCategory;
