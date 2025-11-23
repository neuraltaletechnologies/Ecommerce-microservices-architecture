import { auth, type User } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management - Customer Database",
  description: "Manage registered users and customers. View user details, activity, orders, and account information for Neuraltale Tanzania.",
  keywords: "user management, customer database, user accounts, customer management, admin users",
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
    <div className="">
      <div className="mb-8 px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Users & Customers Management</h1>
        <p className="text-gray-600">Manage registered users and customer accounts. View user details, activity, and order history.</p>
      </div>
      <DataTable columns={columns} data={res.data} />
    </div>
  );
};

export default UsersPage;
