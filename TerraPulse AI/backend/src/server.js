import Fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { redisConnection } from "./lib/redis.js";
import { scanQueue } from "./lib/queue.js";
import { registerSecurityPlugins } from "./plugins/security.js";
import { registerRoutes } from "./routes/index.js";

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === "development" ? "debug" : "info",
    transport:
      env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: { colorize: true, translateTime: "SYS:standard" },
          }
        : undefined,
  },
});

fastify.decorate("io", null);

await registerSecurityPlugins(fastify);
await registerRoutes(fastify);

await fastify.ready();

const io = new SocketIOServer(fastify.server, {
  cors: {
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true,
  },
});

fastify.io = io;

io.on("connection", (socket) => {
  fastify.log.info({ socketId: socket.id }, "socket connected");

  socket.on("join:project", (projectId) => {
    socket.join(`project:${projectId}`);
  });

  socket.on("join:scan", (scanId) => {
    socket.join(`scan:${scanId}`);
  });

  socket.on("disconnect", () => {
    fastify.log.info({ socketId: socket.id }, "socket disconnected");
  });
});

try {
  await fastify.listen({ port: env.PORT, host: env.HOST });
  fastify.log.info(
    { port: env.PORT, host: env.HOST, mode: env.USE_MOCK_DATA ? "mock" : "connected" },
    "TerraPulse backend started"
  );
} catch (error) {
  fastify.log.error(error, "Failed to start server");
  process.exit(1);
}

const close = async () => {
  await io.close();
  await fastify.close();
  if (scanQueue) await scanQueue.close();
  if (redisConnection) await redisConnection.quit();
  if (prisma) await prisma.$disconnect();
};

process.on("SIGINT", async () => {
  await close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await close();
  process.exit(0);
});
