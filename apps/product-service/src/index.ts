// Load environment variables FIRST before any imports that use them
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import heroRouter from "./routes/hero.route";
import uploadRouter from "./routes/upload.route";
import externalProductRouter from "./routes/externalProduct.route";

const app = express();

const allowedOrigins = [
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "https://neuraltale-client.onrender.com",
  "https://neuraltale-admin.onrender.com",
  "https://backoffice.neuraltale.com",
  "https://neurashop.neuraltale.com",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/test", shouldBeUser, (req, res) => {
  res.json({ message: "Product service authenticated", userId: req.userId });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/hero", heroRouter);
app.use("/upload", uploadRouter);
app.use("/external-products", externalProductRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const PORT = Number(process.env.PORT) || 8000;

const start = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Product service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start product service:", error);
    process.exit(1);
  }
};

start();
