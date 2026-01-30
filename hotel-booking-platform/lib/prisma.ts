import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

let connected = false;

export const connectPrisma = async () => {
  if (connected) return;

  try {
    await prisma.$connect();
    console.log("Prisma connected to PostgreSQL");
    connected = true;
  } catch (error) {
    console.error("Failed to connect Prisma:", error);
    throw error;
  }
};

export const disconnectPrisma = async () => {
  if (!connected) return;

  await prisma.$disconnect();
  console.info("Prisma disconnected");
  connected = false;
};

export { prisma };
