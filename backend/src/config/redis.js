const Redis = require("ioredis");

let redis;

try {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });

  redis.on("error", (err) => {
    console.warn("Redis connection error (non-fatal):", err.message);
  });

  redis.on("connect", () => {
    console.log("✓ Redis connected");
  });
} catch (err) {
  console.warn("Redis unavailable, caching disabled:", err.message);
  // Fallback no-op redis
  redis = {
    get: async () => null,
    set: async () => "OK",
    del: async () => 1,
    setex: async () => "OK",
  };
}

module.exports = redis;
