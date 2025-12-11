"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProductType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// export type Product = {
//   id: string | number;
//   price: number;
//   name: string;
//   shortDescription: string;
//   description: string;
//   sizes: string[];
//   colors: string[];
//   images: Record<string, string>;
// };

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;
      const imageUrl = (product.images as Record<string, string>)?.[
        product.colors[0] || ""
      ];
      
      return (
        <div className="w-9 h-9 relative bg-gray-100 rounded-full flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No img</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const product = row.original;
      const hasExtendedData = product.techHighlights || product.boxContents || 
                              product.productFeatures || product.technicalSpecs || 
                              product.certifications;
      return (
        <div className="flex items-center gap-2">
          <span>{product.name}</span>
          {hasExtendedData && (
            <Badge variant="secondary" className="text-xs">
              Extended
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      
      // Debug: Log the product ID to verify it's correct
      console.log('Product ID for view link:', product.id, 'Product name:', product.name);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                console.log('Copying product ID:', product.id);
                navigator.clipboard.writeText(product.id.toString());
              }}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}`}>View product</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
