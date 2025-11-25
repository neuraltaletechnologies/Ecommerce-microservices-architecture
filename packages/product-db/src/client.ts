import { PrismaClient } from "../generated/prisma";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  console.log('🔌 Connecting to Neon database via WebSocket...');
  console.log('📍 Database host:', connectionString.split('@')[1]?.split('/')[0] || 'unknown');
  
  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon({ connectionString });
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}