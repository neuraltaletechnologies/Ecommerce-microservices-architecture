import mongoose from "mongoose";
import { Order } from "@repo/order-db";

// Test MongoDB connection and order service functionality

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce-orders";

async function testMongoDBConnection() {
  console.log("🔍 Testing MongoDB connection...");
  console.log(`📍 Connecting to: ${MONGO_URL.replace(/:[^:]*@/, ':****@')}`);
  
  try {
    await mongoose.connect(MONGO_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log("✅ MongoDB connected successfully!");
    return true;
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes("IP")) {
      console.log("\n💡 Solution: Whitelist your IP in MongoDB Atlas");
      console.log("   Your IP: See MONGODB_SETUP.md for instructions");
    }
    return false;
  }
}

async function testOrderModel() {
  console.log("\n🔍 Testing Order model...");
  
  try {
    // Test: Count orders
    const count = await Order.countDocuments();
    console.log(`✅ Order collection accessible: ${count} orders found`);
    
    // Test: Fetch sample order
    const sampleOrder = await Order.findOne().limit(1);
    if (sampleOrder) {
      console.log(`✅ Sample order retrieved: ${sampleOrder._id}`);
      console.log(`   - User: ${sampleOrder.userId}`);
      console.log(`   - Amount: $${sampleOrder.amount / 100}`);
      console.log(`   - Status: ${sampleOrder.status}`);
    } else {
      console.log("ℹ️  No orders in database yet");
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Order model test failed:");
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function testOrderServiceEndpoints() {
  console.log("\n🔍 Testing Order Service endpoints...");
  
  try {
    // Test health endpoint
    const healthRes = await fetch("http://localhost:8001/health");
    if (healthRes.ok) {
      const health = await healthRes.json();
      console.log("✅ Health endpoint working");
      console.log(`   - Status: ${health.status}`);
      console.log(`   - Uptime: ${Math.floor(health.uptime)}s`);
    } else {
      console.log("❌ Health endpoint failed");
    }
  } catch (error: any) {
    console.error("❌ Order service not reachable:");
    console.error(`   Error: ${error.message}`);
    console.log("\n💡 Solution: Start the order service");
    console.log("   cd apps/order-service && pnpm start");
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("🧪 MongoDB & Order Service Test Suite");
  console.log("=".repeat(60));
  
  const dbConnected = await testMongoDBConnection();
  
  if (dbConnected) {
    await testOrderModel();
    await mongoose.connection.close();
    console.log("\n📊 MongoDB connection closed");
  }
  
  await testOrderServiceEndpoints();
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ Test suite completed");
  console.log("=".repeat(60));
  
  process.exit(dbConnected ? 0 : 1);
}

runTests();
