import { OrderSchemaType } from "@repo/order-db";

export type OrderType = OrderSchemaType & {
  _id: string;
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};

export type OrderStatusDistribution = {
  status: string;
  count: number;
  fill: string;
};

export type DailyOrderTrend = {
  date: string;
  orders: number;
  revenue: number;
};

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  successRate: number;
  averageOrderValue: number;
  ordersToday: number;
  revenueToday: number;
};
