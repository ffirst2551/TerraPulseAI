import { createHash } from "node:crypto";
import { z } from "zod";
import { store } from "../services/store.js";

const hashSchema = z.object({
  source: z.string().min(2),
  payload: z.unknown(),
});

export async function verificationRoutes(fastify) {
  fastify.post(
    "/verification/hash",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = hashSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Invalid verification payload");
      }

      const serialized = JSON.stringify(parsed.data.payload);
      const hash = createHash("sha256").update(serialized).digest("hex");

      const created = await store.createVerificationRecord({
        source: parsed.data.source,
        payload: parsed.data.payload,
        hash,
        algorithm: "sha256",
        createdById: request.user?.sub ? String(request.user.sub) : null,
      });

      return {
        id: created.id,
        source: created.source,
        hash: created.hash,
        algorithm: created.algorithm,
        createdAt: created.createdAt,
        verification: "mock-polygon-anchor",
      };
    }
  );

  fastify.get(
    "/verification/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const record = await store.getVerificationRecord(request.params.id);
      if (!record) {
        return reply.notFound("Verification record not found");
      }
      return record;
    }
  );
}
