import { store } from "../services/store.js";

export async function dashboardRoutes(fastify) {
  fastify.get(
    "/dashboard/:projectId",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { projectId } = request.params;
      const dashboard = await store.getDashboard(projectId);
      if (!dashboard) {
        return reply.notFound("Dashboard source project not found");
      }
      return dashboard;
    }
  );
}
