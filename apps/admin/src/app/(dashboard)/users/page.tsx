import { auth, type User } from "@clerk/nextjs/server";
import { enhancedColumns } from "./enhanced-columns";
import { EnhancedDataTable } from "./enhanced-data-table";
import { Metadata } from "next";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

export const metadata: Metadata = {
  title: "Users Management - User Database",
  description: "Manage registered users and users. View user details, activity, orders, and account information for Neurashop Tanzania.",
  keywords: "user management, user database, user accounts, user management, admin users",
};

const getData = async (): Promise<{ data: User[]; totalCount: number }> => {
  const { getToken } = await auth();
  const token = await getToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Disable caching for fresh data
      }
    );
    
    if (!res.ok) {
      console.error(`Failed to fetch users: ${res.status} ${res.statusText}`);
      return { data: [], totalCount: 0 };
    }
    
    const data = await res.json();
    
    // Ensure data has the expected structure
    return {
      data: Array.isArray(data.data) ? data.data : [],
      totalCount: typeof data.totalCount === 'number' ? data.totalCount : 0
    };
  } catch (err) {
    console.error("Error fetching users:", err);
    return { data: [], totalCount: 0 };
  }
};

const UsersPage = async () => {
  const res = await getData();
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-6 py-6 bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Users & Role Management
            </h1>
            <p className="text-gray-600">
              Manage users, assign roles, and control access permissions across your platform.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-[#FDB913]">{res.totalCount}</div>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<TableSkeleton rows={10} columns={6} />}>
        <EnhancedDataTable columns={enhancedColumns} data={res.data} />
      </Suspense>
    </div>
  );
};

export default UsersPage;
