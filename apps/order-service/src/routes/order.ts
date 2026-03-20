import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";
import { startOfMonth, subMonths, subDays, format, startOfDay, endOfDay } from "date-fns";
import { OrderChartType, OrderStatusDistribution, DailyOrderTrend, DashboardStats } from "@repo/types";
import { createOrder } from "../utils/order";

export const orderRoute = async (fastify: FastifyInstance) => {
  // Internal order creation endpoint (used by payment-service webhook).
  fastify.post("/orders", async (request, reply) => {
    try {
      const order = await createOrder(request.body as any);
      return reply.status(201).send(order);
    } catch (error) {
      return reply.status(400).send({
        error: "Failed to create order",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId });
      return reply.send(orders);
    }
  );
  fastify.get(
    "/orders",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { limit } = request.query as { limit?: string | number };
      const parsedLimit = Number(limit);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 200)
        : 50;

      const orders = await Order.find().limit(safeLimit).sort({ createdAt: -1 });
      return reply.send(orders);
    }
  );

  // Dashboard stats endpoint
  fastify.get(
    "/dashboard-stats",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const now = new Date();
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);

      const [totalStats, todayStats] = await Promise.all([
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$amount" },
              successfulOrders: {
                $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
              },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: todayStart, $lte: todayEnd },
            },
          },
          {
            $group: {
              _id: null,
              ordersToday: { $sum: 1 },
              revenueToday: { $sum: "$amount" },
            },
          },
        ]),
      ]);

      const total = totalStats[0] || { totalOrders: 0, totalRevenue: 0, successfulOrders: 0 };
      const today = todayStats[0] || { ordersToday: 0, revenueToday: 0 };

      const stats: DashboardStats = {
        totalOrders: total.totalOrders,
        totalRevenue: total.totalRevenue / 100, // Convert from cents
        successRate: total.totalOrders > 0 
          ? Math.round((total.successfulOrders / total.totalOrders) * 100) 
          : 0,
        averageOrderValue: total.totalOrders > 0 
          ? Math.round(total.totalRevenue / total.totalOrders / 100) 
          : 0,
        ordersToday: today.ordersToday,
        revenueToday: today.revenueToday / 100,
      };

      return reply.send(stats);
    }
  );

  // Order status distribution for pie chart
  fastify.get(
    "/order-status-distribution",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const statusColors: Record<string, string> = {
        success: "var(--chart-4)",
        failed: "var(--chart-1)",
        pending: "var(--chart-3)",
        cancelled: "var(--chart-2)",
      };

      const raw = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const results: OrderStatusDistribution[] = raw.map((item) => ({
        status: item._id,
        count: item.count,
        fill: statusColors[item._id] || "var(--chart-5)",
      }));

      return reply.send(results);
    }
  );

  // Daily order trends for area chart (last 30 days)
  fastify.get(
    "/daily-order-trends",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 29);

      const raw = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay(thirtyDaysAgo), $lte: now },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
      ]);

      // Fill in all 30 days, even if no orders
      const results: DailyOrderTrend[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = subDays(now, i);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        const match = raw.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month &&
            item._id.day === day
        );

        results.push({
          date: format(d, "MMM dd"),
          orders: match ? match.orders : 0,
          revenue: match ? Math.round(match.revenue / 100) : 0, // Convert from cents
        });
      }

      return reply.send(results);
    }
  );

  fastify.get(
    "/order-chart",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      // { month: "April", total: 173, successful: 100 }

      const raw = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
            successful: {
              $sum: {
                $cond: [{ $eq: ["$status", "success"] }, 1, 0],
                // {
                //   "year":2025,
                //   "month":9,
                //   "total":100,
                //   "successful":72
                // }
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            total: 1,
            successful: 1,
          },
        },
        {
          $sort: { year: 1, month: 1 },
        },
      ]);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const results: OrderChartType[] = [];

      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        const match = raw.find(
          (item) => item.year === year && item.month === month
        );

        results.push({
          month: monthNames[month - 1] as string,
          total: match ? match.total : 0,
          successful: match ? match.successful : 0,
        });
      }

      return reply.send(results);
    }
  );
};
