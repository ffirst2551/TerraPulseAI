import IORedis from "ioredis";
import { env } from "../config/env.js";

export const redisConnection = env.USE_MOCK_DATA
  ? null
  : new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
