import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

let prisma = null;

if (!env.USE_MOCK_DATA) {
  prisma = new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export { prisma };
