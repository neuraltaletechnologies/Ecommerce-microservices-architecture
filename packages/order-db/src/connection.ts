import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in env file!");
  }

  try {
    // Optimized connection options for MongoDB Atlas Serverless
    await mongoose.connect(process.env.MONGO_URL, {
      // Connection pool settings optimized for serverless
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      // Serverless-friendly options
      retryWrites: true,
      w: 'majority'
    });
    
    isConnected = true;
    console.log("Connected to MongoDB Atlas Serverless");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};
