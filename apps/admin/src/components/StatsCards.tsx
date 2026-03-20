"use client";

import { Card, CardContent } from "./ui/card";
import { DashboardStats } from "@repo/types";
import { 
  ShoppingCart, 
  TrendingUp, 
  Package,
  CalendarCheck,
  Banknote,
  Wallet
} from "lucide-react";
import { formatTZSCompact } from "@/lib/utils/currency";

interface StripeBalance {
  available: number;
  pending: number;
  total: number;
}

interface StatsCardsProps {
  stats: DashboardStats | null;
  stripeBalance?: StripeBalance | null;
}

const StatsCards = ({ stats, stripeBalance }: StatsCardsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use Stripe balance for revenue if available, otherwise fall back to order-based revenue
  const totalRevenue = stripeBalance?.total ?? stats.totalRevenue;
  const availableBalance = stripeBalance?.available ?? 0;

  const statItems = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Stripe Revenue",
      value: formatTZSCompact(totalRevenue),
      subtitle: stripeBalance ? `Available: ${formatTZSCompact(availableBalance)}` : undefined,
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Avg Order Value",
      value: formatTZSCompact(stats.averageOrderValue),
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Orders Today",
      value: stats.ordersToday.toLocaleString(),
      icon: CalendarCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Revenue Today",
      value: formatTZSCompact(stats.revenueToday),
      icon: Banknote,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{item.title}</span>
              <div className={`p-1.5 rounded-md ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <p className="text-xl font-bold">{item.value}</p>
            {"subtitle" in item && item.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
