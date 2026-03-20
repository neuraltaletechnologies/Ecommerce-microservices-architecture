import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import StatsCards from "@/components/StatsCards";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { DashboardStats, OrderStatusDistribution, DailyOrderTrend, OrderChartType } from "@repo/types";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Dashboard - Overview & Analytics",
  description: "Admin dashboard overview with sales analytics, order statistics, and performance metrics for Neuraltale Tanzania tech store.",
};

// Fetch Stripe balance
async function getStripeBalance() {
  try {
    // Initialize Stripe inside function to avoid build-time errors
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });
    const balance = await stripe.balance.retrieve();
    // Sum available and pending amounts (convert from cents to dollars/TZS)
    const availableTotal = balance.available.reduce((sum, b) => sum + b.amount, 0) / 100;
    const pendingTotal = balance.pending.reduce((sum, b) => sum + b.amount, 0) / 100;
    return {
      available: availableTotal,
      pending: pendingTotal,
      total: availableTotal + pendingTotal,
    };
  } catch (error) {
    console.error("Failed to fetch Stripe balance:", error);
    return null;
  }
}

const Homepage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  
  // Fetch all dashboard data in parallel (including Stripe balance)
  const [orderChartData, statusDistribution, dailyTrends, dashboardStats, stripeBalance] = await Promise.all([
    // Monthly order chart data
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/order-chart`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(res => res.ok ? res.json() : [])
      .catch(() => []) as Promise<OrderChartType[]>,
    
    // Order status distribution for pie chart
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/order-status-distribution`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(res => res.ok ? res.json() : [])
      .catch(() => []) as Promise<OrderStatusDistribution[]>,
    
    // Daily order trends for area chart
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/daily-order-trends`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(res => res.ok ? res.json() : [])
      .catch(() => []) as Promise<DailyOrderTrend[]>,
    
    // Dashboard stats
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(res => res.ok ? res.json() : null)
      .catch(() => null) as Promise<DashboardStats | null>,
    
    // Stripe balance
    getStripeBalance(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Neuraltale Admin Dashboard</h1>
        <p className="text-[#FDB913]/80">Manage your premium tech products and track sales performance</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={dashboardStats} stripeBalance={stripeBalance} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart data={orderChartData} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Tech Orders" />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart data={statusDistribution} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart data={dailyTrends} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Popular Products" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
