import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin);

fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.send({
    message: "Order service is authenticated!",
    userId: request.userId,
  });
});

fastify.register(orderRoute);

const PORT = Number(process.env.PORT) || 8001;

const start = async () => {
  try {
    console.log("Starting order service...");
    await connectOrderDB();
    console.log("Database connection established");
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Order service is running on port ${PORT}`);
  } catch (err) {
    console.error("Failed to start order service:", err);
    process.exit(1);
  }
};
start();
