import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Overview & Analytics",
  description: "Admin dashboard overview with sales analytics, order statistics, and performance metrics for Neuraltale Tanzania tech store.",
};

const Homepage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  
  let orderChartData = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/order-chart`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    orderChartData = JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Failed to fetch order chart data:', error);
    orderChartData = [];
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Neuraltale Admin Dashboard</h1>
        <p className="text-[#FDB913]/80">Manage your premium tech products and track sales performance</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart data={orderChartData} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Tech Orders" />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <TodoList />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Trending Tech Products" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
