import { Worker } from "bullmq";
import { env } from "../config/env.js";
import { redisConnection } from "../lib/redis.js";
import { store } from "../services/store.js";

if (!redisConnection) {
  console.error(
    "[scan-worker] Redis is not configured. Set USE_MOCK_DATA=false and REDIS_URL before starting worker."
  );
  process.exit(1);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
  "scan-jobs",
  async (job) => {
    const { scanId, mode } = job.data;

    await store.updateScanJob(scanId, { status: "PROCESSING", progress: 12 });
    await wait(1000);
    await store.updateScanJob(scanId, { status: "PROCESSING", progress: 48 });
    await wait(1000);
    await store.updateScanJob(scanId, { status: "PROCESSING", progress: 79 });
    await wait(1200);

    const result =
      mode === "acoustic"
        ? {
            stage: "Acoustic Recovery Cluster",
            confidence: 93,
            metrics: { carbon_tco2: 910, biomass_index: 0.82 },
          }
        : {
            stage: "Mature Canopy Expansion",
            confidence: 96,
            metrics: { carbon_tco2: 1280, biomass_index: 0.9 },
          };

    await store.updateScanJob(scanId, {
      status: "COMPLETED",
      progress: 100,
      result,
    });

    return { ok: true, scanId };
  },
  { connection: redisConnection, concurrency: 3 }
);

worker.on("completed", (job) => {
  console.log(`[scan-worker] Completed job ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`[scan-worker] Job ${job?.id} failed:`, error.message);
});

console.log(`[scan-worker] Running in ${env.NODE_ENV} mode`);

const close = async () => {
  await worker.close();
  await redisConnection.quit();
};

process.on("SIGINT", async () => {
  await close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await close();
  process.exit(0);
});
