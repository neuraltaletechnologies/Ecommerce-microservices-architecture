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
import { cn } from "@/lib/utils";
import type { User } from "@clerk/nextjs/server";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// export type User = {
//   id: string;
//   avatar: string;
//   fullName: string;
//   email: string;
//   status: "active" | "inactive";
// };

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      const hasImage = user.imageUrl && typeof user.imageUrl === 'string' && user.imageUrl.trim() !== "";
      return (
        <div className="w-9 h-9 relative bg-gray-100 rounded-full flex items-center justify-center">
          {hasImage ? (
            <Image
              src={user.imageUrl}
              alt={user.firstName || user.username || "-"}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400 font-semibold">
              {(user.firstName?.[0] || user.username?.[0] || "?").toUpperCase()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return <div className="">{user.firstName || user.username || "-"}</div>;
    },
  },
  {
    accessorKey: "email",
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
      return <div className="">{user.emailAddresses[0]?.emailAddress}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original
      const status = user.banned ? "banned" : "active"

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "active" && "bg-green-500/40",
            status === "banned" && "bg-red-500/40"
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/users/${user.id}`}>View user</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
