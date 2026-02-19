"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useState } from "react";
import { Trash2, Search, X, Filter, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddProductApiFirst from "@/components/AddProductApiFirst";
import AddProduct from "@/components/AddProduct";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addProductMode, setAddProductMode] = useState<"api" | "manual">("api");

  const { getToken } = useAuth();
  const router = useRouter();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const selectedRows = table.getSelectedRowModel().rows;

      await Promise.all(
        selectedRows.map(async (row) => {
          const productId = (row.original as ProductType).id;
          await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${productId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );
    },
    onSuccess: () => {
      toast.success("Product(s) deleted successfully");
      setRowSelection({});
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete products");
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const product = row.original as ProductType;
      const searchValue = filterValue.toLowerCase();
      
      return (
        product.name?.toLowerCase().includes(searchValue) ||
        product.shortDescription?.toLowerCase().includes(searchValue) ||
        product.categorySlug?.toLowerCase().includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
  });

  const selectedCount = Object.keys(rowSelection).length;
  const categoryFilter = (columnFilters.find((f) => f.id === "categorySlug")?.value as string[]) || [];
  const heroFilter = (columnFilters.find((f) => f.id === "isHeroProduct")?.value as boolean[]) || [];
  
  // Get unique categories from data
  const categories = Array.from(new Set(data.map((item) => (item as ProductType).categorySlug))).filter(Boolean) as string[];

  return (  
   <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name, category..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setGlobalFilter("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Category
                {categoryFilter.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {categoryFilter.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={categoryFilter.includes(category)}
                  onCheckedChange={(checked) => {
                    const newFilter = checked
                      ? [...categoryFilter, category]
                      : categoryFilter.filter((c) => c !== category);
                    table.getColumn("categorySlug")?.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hero Product Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                Type
                {heroFilter.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {heroFilter.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={heroFilter.includes(true)}
                onCheckedChange={(checked) => {
                  const newFilter = checked
                    ? [...heroFilter, true]
                    : heroFilter.filter((h) => h !== true);
                  table.getColumn("isHeroProduct")?.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
                }}
              >
                Hero Products
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={heroFilter.includes(false)}
                onCheckedChange={(checked) => {
                  const newFilter = checked
                    ? [...heroFilter, false]
                    : heroFilter.filter((h) => h !== false);
                  table.getColumn("isHeroProduct")?.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
                }}
              >
                Regular Products
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Sheet open={addProductOpen} onOpenChange={setAddProductOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setAddProductMode("api")}>Add Product</Button>
          </SheetTrigger>
          {addProductMode === "api" ? (
            <AddProductApiFirst 
              onOpenManualForm={() => setAddProductMode("manual")}
              onClose={() => {
                setAddProductOpen(false);
                setAddProductMode("api");
                router.refresh();
              }} 
            />
          ) : (
            <AddProduct
              onSuccess={() => {
                setAddProductOpen(false);
                setAddProductMode("api");
                router.refresh();
              }}
            />
          )}
        </Sheet>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-[#001E3C]/10 border border-[#0A7EA4]/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#001E3C]">
              {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selectedCount} product${selectedCount > 1 ? "s" : ""}?`)) {
                  deleteMutation.mutate();
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}

    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  </div>
  );
  
}
