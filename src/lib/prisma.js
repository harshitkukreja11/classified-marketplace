import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma;

if (!globalThis.prisma) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("DATABASE_URL not found during build");
  } else {
    const pool = new Pool({
      connectionString,
    });

    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({
      adapter,
    });

    globalThis.prisma = prisma;
  }
}

export const prisma = globalThis.prisma;