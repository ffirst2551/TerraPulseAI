import { z } from "zod";
import { env } from "../config/env.js";
import { emitScanUpdate } from "../lib/events.js";
import { enqueueScan, scanQueue } from "../lib/queue.js";
import { runMockScanLifecycle } from "../services/scan-simulator.js";
import { store } from "../services/store.js";

const createScanSchema = z.object({
  projectId: z.string().min(3),
  mode: z.enum(["satellite", "acoustic"]).default("satellite"),
  inputUrl: z.string().url().optional(),
});

export async function scanRoutes(fastify) {
  fastify.post(
    "/scans",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createScanSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Invalid scan payload");
      }

      const createdById = request.user?.sub ? String(request.user.sub) : null;
      const scan = await store.createScanJob({
        ...parsed.data,
        createdById,
      });

      emitScanUpdate(fastify, scan);
      const queued = await enqueueScan({ scanId: scan.id, ...parsed.data });

      if (queued && scanQueue) {
        await store.updateScanJob(scan.id, {
          status: "QUEUED",
          progress: 3,
        });
      } else if (env.USE_MOCK_DATA || !scanQueue) {
        void runMockScanLifecycle(fastify, scan);
      }

      return reply.code(202).send({
        accepted: true,
        queue: queued ? "bullmq" : "inline-simulator",
        scan,
      });
    }
  );

  fastify.get(
    "/scans/:id/status",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const scan = await store.getScanJob(request.params.id);
      if (!scan) {
        return reply.notFound("Scan not found");
      }
      return scan;
    }
  );
}
