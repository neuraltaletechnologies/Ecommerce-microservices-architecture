import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import dotenv from "dotenv";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";

dotenv.config();

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin);

fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/my-ip", async (request, reply) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json() as { ip: string };
    return reply.send({ 
      ip: ipData.ip,
      message: "Add this IP to MongoDB Atlas Network Access whitelist",
      instructions: "https://cloud.mongodb.com/ → Network Access → Add IP Address"
    });
  } catch (error) {
    return reply.status(500).send({ error: "Could not fetch IP" });
  }
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
    
    // Log outgoing IP for MongoDB whitelist setup (useful for Render deployment)
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json() as { ip: string };
      console.log(`🌐 Outgoing IP Address: ${ipData.ip}`);
      console.log(`   ⚠️  Add this IP to MongoDB Atlas Network Access if connection fails`);
    } catch (ipErr) {
      console.log('Could not fetch outgoing IP (non-critical)');
    }
    
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
