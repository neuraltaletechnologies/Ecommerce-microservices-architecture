"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { OrderStatusDistribution } from "@repo/types";

const chartConfig = {
  count: {
    label: "Orders",
  },
  success: {
    label: "Successful",
    color: "var(--chart-4)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-1)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AppPieChartProps {
  data: OrderStatusDistribution[];
}

const AppPieChart = ({ data }: AppPieChartProps) => {
  const chartData = data || [];
  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="">
        <h1 className="text-lg font-medium mb-6">Order Status Distribution</h1>
        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
          No order data available
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Order Status Distribution</h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalOrders.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm text-muted-foreground capitalize">
              {item.status}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppPieChart;
