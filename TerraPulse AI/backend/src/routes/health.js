import { prisma } from "../lib/prisma.js";
import { redisConnection } from "../lib/redis.js";

export async function healthRoutes(fastify) {
  fastify.get("/health", async () => {
    let db = "disabled";
    let redis = "disabled";

    if (prisma) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        db = "up";
      } catch (_error) {
        db = "down";
      }
    }

    if (redisConnection) {
      try {
        const pong = await redisConnection.ping();
        redis = pong === "PONG" ? "up" : "unknown";
      } catch (_error) {
        redis = "down";
      }
    }

    return {
      service: "terrapulse-backend",
      status: "ok",
      mode: prisma ? "connected" : "mock",
      dependencies: { db, redis },
      timestamp: new Date().toISOString(),
    };
  });
}
