"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { DailyOrderTrend } from "@repo/types";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
  revenue: {
    label: "Revenue (TZS)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface AppAreaChartProps {
  data: DailyOrderTrend[];
}

const AppAreaChart = ({ data }: AppAreaChartProps) => {
  const chartData = data || [];

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="">
        <h1 className="text-lg font-medium mb-6">Order Trends (Last 30 Days)</h1>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No trend data available
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Order Trends (Last 30 Days)</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={4}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-orders)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-orders)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="orders"
            type="natural"
            fill="url(#fillOrders)"
            fillOpacity={0.4}
            stroke="var(--color-orders)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppAreaChart;
