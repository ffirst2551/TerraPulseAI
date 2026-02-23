import "dotenv/config";

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "0.0.0.0",
  PORT: Number(process.env.PORT || 8787),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  JWT_SECRET: process.env.JWT_SECRET || "dev_access_secret_change_me",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/terrapulse?schema=public",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  USE_MOCK_DATA: toBool(process.env.USE_MOCK_DATA, true),
};
