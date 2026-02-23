import { store } from "../services/store.js";

export async function projectRoutes(fastify) {
  fastify.get(
    "/projects/:id/sectors",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const data = await store.getProjectSectors(id);

      if (!data.project) {
        return reply.notFound("Project not found");
      }

      return {
        project: data.project,
        sectors: data.sectors,
      };
    }
  );
}
