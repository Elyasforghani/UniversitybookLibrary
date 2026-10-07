import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

import config from "@/lib/config";

const isRedisConfigured =
  Boolean(config.env.upstash.redisUrl) &&
  Boolean(config.env.upstash.redisToken) &&
  !config.env.upstash.redisUrl.includes("mock-redis");

const realRatelimit = isRedisConfigured
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, "1m"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    })
  : null;

const ratelimit = {
  limit: async (identifier: string) => {
    if (!realRatelimit) {
      return { success: true, limit: 5, remaining: 5, reset: 0 };
    }
    return realRatelimit.limit(identifier);
  },
};

export default ratelimit;
