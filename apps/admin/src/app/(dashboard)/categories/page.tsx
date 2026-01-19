import { Metadata } from "next";
import { CategoryType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Categories Management - Product Categories",
  description: "Manage product categories for your tech store. Add, edit, and organize categories.",
  keywords: "category management, product categories, tech categories, admin panel",
};

const getData = async (): Promise<CategoryType[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const CategoryPage = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-6 py-6 bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg">
        <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories Management</h1>
        <p className="text-gray-600">
          Manage and organize your product categories.
        </p> 
        </div>
           
        <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Categories</div>
            <div className="text-3xl font-bold text-[#FDB913]">{data.length}</div>
          </div>
      </div>
      </div>
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
