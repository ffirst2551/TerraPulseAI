export function emitScanUpdate(fastify, scan) {
  if (!fastify.io) return;
  fastify.io.to(`scan:${scan.id}`).emit("scan:update", scan);
  if (scan.projectId) {
    fastify.io.to(`project:${scan.projectId}`).emit("project:scan-update", scan);
  }
}
