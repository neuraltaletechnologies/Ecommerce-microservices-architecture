import { Metadata } from "next";
import { CategoryType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

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
    <div className="">
      <div className="mb-8 px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories Management</h1>
        <p className="text-gray-600">
          Manage and organize your product categories. Total categories: <span className="font-semibold">{data.length}</span>
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CategoryPage;
