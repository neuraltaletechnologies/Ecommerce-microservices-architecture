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
  VisibilityState,
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
import {
  Trash2,
  Download,
  UserPlus,
  Search,
  Filter,
  X,
  Ban,
  CheckCircle,
  UserCog,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { User } from "@clerk/nextjs/server";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_CONFIGS, UserRole } from "@repo/types";
import Link from "next/link";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddUserSheet from "@/components/AddUserSheet";

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const user = row.original as User;
      const searchValue = filterValue.toLowerCase();
      
      // Search in name, email, username
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
      const username = user.username?.toLowerCase() || "";
      
      return (
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        username.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const { getToken } = useAuth();
  const router = useRouter();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const selectedRows = table.getSelectedRowModel().rows;

      await Promise.all(
        selectedRows.map(async (row) => {
          const userId = (row.original as User).id;
          await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${userId}`,
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
      toast.success("User(s) deleted successfully");
      setRowSelection({});
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete users");
    },
  });

  // Ban/Unban mutation
  const toggleBanMutation = useMutation({
    mutationFn: async (shouldBan: boolean) => {
      const token = await getToken();
      const selectedRows = table.getSelectedRowModel().rows;

      await Promise.all(
        selectedRows.map(async (row) => {
          const user = row.original as User;
          await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${user.id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicMetadata: {
                  ...user.publicMetadata,
                  banned: shouldBan,
                },
              }),
            }
          );
        })
      );
    },
    onSuccess: (_, shouldBan) => {
      toast.success(
        shouldBan
          ? "User(s) deactivated successfully"
          : "User(s) activated successfully"
      );
      setRowSelection({});
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      const token = await getToken();
      const selectedRows = table.getSelectedRowModel().rows;

      await Promise.all(
        selectedRows.map(async (row) => {
          const user = row.original as User;
          await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${user.id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicMetadata: {
                  ...user.publicMetadata,
                  role,
                },
              }),
            }
          );
        })
      );
    },
    onSuccess: () => {
      toast.success("Role assigned successfully");
      setRowSelection({});
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign role");
    },
  });

  // Export to CSV
  const exportToCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows.length > 0
      ? table.getSelectedRowModel().rows
      : table.getFilteredRowModel().rows;

    const csvData = selectedRows.map((row) => {
      const user = row.original as User;
      const role = (user.publicMetadata?.role as UserRole) || "user";
      return {
        ID: user.id,
        "Full Name": `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        Email: user.emailAddresses[0]?.emailAddress || "",
        Username: user.username || "",
        Role: role,
        Status: user.banned ? "Inactive" : "Active",
        "Last Login": user.lastSignInAt || "Never",
        Created: user.createdAt,
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${csvData.length} users to CSV`);
  };

  const selectedCount = Object.keys(rowSelection).length;
  const roleFilter = (columnFilters.find((f) => f.id === "role")?.value as UserRole[]) || [];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, username..."
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

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Role
                {roleFilter.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {roleFilter.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(ROLE_CONFIGS).map((config) => (
                <DropdownMenuCheckboxItem
                  key={config.name}
                  checked={roleFilter.includes(config.name)}
                  onCheckedChange={(checked) => {
                    const newFilter = checked
                      ? [...roleFilter, config.name]
                      : roleFilter.filter((r) => r !== config.name);
                    table.getColumn("role")?.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                    {config.label}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </SheetTrigger>
          <AddUserSheet />
        </Sheet>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-[#001E3C]/10 border border-[#0A7EA4]/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#001E3C]">
              {selectedCount} user{selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBanMutation.mutate(false)}
              disabled={toggleBanMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBanMutation.mutate(true)}
              disabled={toggleBanMutation.isPending}
            >
              <Ban className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserCog className="mr-2 h-4 w-4" />
                  Assign Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(ROLE_CONFIGS).map((config) => (
                  <DropdownMenuCheckboxItem
                    key={config.name}
                    onClick={() => assignRoleMutation.mutate(config.name)}
                    disabled={assignRoleMutation.isPending}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      {config.label}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
