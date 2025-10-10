import { auth, type User } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

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
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={res.data} />
    </div>
  );
};

export default UsersPage;
