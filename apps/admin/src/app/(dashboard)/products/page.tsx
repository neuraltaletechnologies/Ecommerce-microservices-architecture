import { ProductsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Metadata } from "next";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Products Management - All Tech Products",
  description: "Manage your tech product catalog: smartphones, laptops, gaming gear, audio equipment, wearables, and accessories. Add, edit, and delete products.",
  keywords: "product management, inventory management, tech products, laptops, smartphones, gaming laptops, wireless earbuds, admin panel",
};

const getData = async (): Promise<ProductsType> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    
    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.error('Products API returned non-array data:', typeof data, data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const ProductPage = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-6 py-6 bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg">
         <div className="flex items-center justify-between">
          <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your premium tech product catalog including smartphones, laptops, audio gear, and accessories.</p>
        </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Products</div>
            <div className="text-3xl font-bold text-[#FDB913]">{data.length}</div>
          </div>
          </div>
      </div>
      <Suspense fallback={<TableSkeleton rows={10} columns={8} />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
};

export default ProductPage;
