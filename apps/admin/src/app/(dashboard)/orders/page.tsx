import { auth } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";
import { Metadata } from "next";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Orders Management - Payments & Transactions",
  description: "Manage user orders and payments for Neurashop Tanzania. Track order status, payment details, and transaction history.",
  keywords: "order management, payment tracking, transactions, order status, payment history, e-commerce orders",
};

const getData = async (): Promise<OrderType[]> => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const OrdersPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders & Payments Management</h1>
        <p className="text-gray-600">Track and manage user orders, payments, and transaction history for Neurashop Tanzania.</p>
      </div>
      <Suspense fallback={<TableSkeleton rows={8} columns={7} />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
