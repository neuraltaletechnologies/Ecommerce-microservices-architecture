import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { clerkMiddleware } from "@hono/clerk-auth";
import sessionRoute from "./routes/session.route.js";
import { cors } from "hono/cors";
import webhookRoute from "./routes/webhooks.route.js";

dotenv.config();

const app = new Hono();

const allowedOrigins = [
  "http://localhost:3002",
  "https://neuraltale-client.onrender.com",
  "https://neurashop.neuraltale.com",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use("*", clerkMiddleware());
app.use("*", cors({ origin: allowedOrigins }));

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "payment-service",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.route("/sessions", sessionRoute);
app.route("/webhooks", webhookRoute);

// app.post("/create-stripe-product", async (c) => {
//   const res = await stripe.products.create({
//     id: "123",
//     name: "Test Product",
//     default_price_data: {
//       currency: "usd",
//       unit_amount: 10 * 100,
//     },
//   });

//   return c.json(res);
// });

// app.get("/stripe-product-price", async (c) => {
//   const res = await stripe.prices.list({
//     product: "123",
//   });

//   return c.json(res);
// });

const PORT = Number(process.env.PORT) || 8002;

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: PORT,
        hostname: '0.0.0.0',
      },
      (info) => {
        console.log(`Payment service is running on port ${PORT}`);
      }
    );
  } catch (error) {
    console.error("Failed to start payment service:", error);
    process.exit(1);
  }
};
start();
