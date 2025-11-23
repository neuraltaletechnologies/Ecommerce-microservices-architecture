import { ProductsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Management - All Tech Products",
  description: "Manage your tech product catalog: smartphones, laptops, gaming gear, audio equipment, wearables, and accessories. Add, edit, and delete products.",
  keywords: "product management, inventory management, tech products, laptops, smartphones, gaming laptops, wireless earbuds, admin panel",
};

const getData = async (): Promise<ProductsType> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const ProductPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tech Products Management</h1>
        <p className="text-gray-600">Manage your premium tech product catalog including smartphones, laptops, audio gear, and accessories.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;
