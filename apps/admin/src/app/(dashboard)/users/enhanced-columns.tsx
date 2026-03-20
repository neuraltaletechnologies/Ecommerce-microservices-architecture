"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { User } from "@clerk/nextjs/server";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { ROLE_CONFIGS, UserRole } from "@repo/types";
import { formatDistanceToNow } from "date-fns";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddUserSheet from "@/components/AddUserSheet";
import { useState } from "react";

// Helper function to get role from user metadata
const getUserRole = (user: User): UserRole => {
  const role = user.publicMetadata?.role as UserRole;
  return role || "user";
};

// Helper function to get role badge color
const getRoleBadgeColor = (role: UserRole) => {
  const config = ROLE_CONFIGS[role];
  return config?.color || "bg-gray-500";
};

// Actions Cell Component
function ActionCell({ user }: { user: User }) {
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.emailAddresses[0]?.emailAddress || "")}
        >
          Copy email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
          </SheetTrigger>
          <AddUserSheet
            user={user}
            onSuccess={() => setEditSheetOpen(false)}
          />
        </Sheet>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            // This will be handled by the parent component
            console.log("Delete user:", user.id);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const enhancedColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      const hasImage =
        user.imageUrl &&
        typeof user.imageUrl === "string" &&
        user.imageUrl.trim() !== "";
      const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || 
                      user.username?.[0]?.toUpperCase() || "?";
      
      return (
        <div className="w-10 h-10 relative bg-gradient-to-br from-[#001E3C]/20 to-[#0A7EA4]/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {hasImage ? (
            <Image
              src={user.imageUrl}
              alt={user.firstName || user.username || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-700">
              {initials}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const displayName = fullName || user.username || "Unknown User";
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{displayName}</span>
          {user.username && fullName && (
            <span className="text-xs text-gray-500">@{user.username}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emailAddresses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const email = user.emailAddresses[0]?.emailAddress || "No email";
      
      return (
        <div className="text-sm">
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const role = getUserRole(user);
      const config = ROLE_CONFIGS[role];
      
      return (
        <Badge
          className={cn(
            "text-white font-medium",
            getRoleBadgeColor(role)
          )}
        >
          {config?.label || role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const role = getUserRole(row.original);
      return value.includes(role);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      const isActive = !user.banned && !user.locked;
      
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              // This will be handled by the data table's mutation
              console.log("Toggle status for user:", user.id, checked);
            }}
            aria-label="Toggle user status"
          />
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              isActive ? "text-green-600 border-green-600" : "text-red-600 border-red-600"
            )}
          >
            {user.locked ? "Locked" : user.banned ? "Inactive" : "Active"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "lastSignInAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Login
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      if (!user.lastSignInAt) {
        return <span className="text-sm text-gray-400">Never</span>;
      }
      
      return (
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(user.lastSignInAt), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <ActionCell user={user} />;
    },
  },
];
