import { authRoutes } from "./auth.js";
import { dashboardRoutes } from "./dashboard.js";
import { healthRoutes } from "./health.js";
import { projectRoutes } from "./projects.js";
import { scanRoutes } from "./scans.js";
import { verificationRoutes } from "./verification.js";

export async function registerRoutes(fastify) {
  fastify.get("/", async () => ({
    name: "TerraPulse Backend API",
    docs: {
      health: "GET /health",
      login: "POST /auth/login",
      sectors: "GET /projects/:id/sectors",
      dashboard: "GET /dashboard/:projectId",
      createScan: "POST /scans",
      scanStatus: "GET /scans/:id/status",
      verifyHash: "POST /verification/hash",
    },
  }));

  await fastify.register(healthRoutes);
  await fastify.register(authRoutes);
  await fastify.register(projectRoutes);
  await fastify.register(dashboardRoutes);
  await fastify.register(scanRoutes);
  await fastify.register(verificationRoutes);
}
