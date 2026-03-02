import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const scanQueue = redisConnection
  ? new Queue("scan-jobs", {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    })
  : null;

export async function enqueueScan(payload) {
  if (!scanQueue) return null;
  return scanQueue.add("run-scan", payload);
}
