import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { consumer, producer } from "./utils/kafka.js";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003", "http://localhost:3004"],
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const start = async () => {
  try {
    // Try to connect to Kafka, but don't fail if it's not available
    try {
      await Promise.all([producer.connect(), consumer.connect()]);
      console.log("Kafka connected successfully");
    } catch (kafkaError) {
      console.log("Kafka connection failed (service will run without it):", kafkaError.message);
    }
    
    app.listen(8000, () => {
      console.log("Product service is running on 8000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start()
