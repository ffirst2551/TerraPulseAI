import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import { env } from "../config/env.js";

export async function registerSecurityPlugins(fastify) {
  await fastify.register(sensible);
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true,
  });
  await fastify.register(rateLimit, {
    global: true,
    max: 120,
    timeWindow: "1 minute",
  });
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  fastify.decorate("authenticate", async function authenticate(request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send({
        error: "Unauthorized",
        message: error.message,
      });
    }
  });
}
