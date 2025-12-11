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
    <div className="container mx-auto py-6">
      <div className="mb-8 px-6 py-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
         <div className="flex items-center justify-between">
          <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your premium tech product catalog including smartphones, laptops, audio gear, and accessories.</p>
        </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Products</div>
            <div className="text-3xl font-bold text-purple-600">{data.length}</div>
          </div>
          </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;
