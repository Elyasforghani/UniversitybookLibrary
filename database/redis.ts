import { Redis } from "@upstash/redis";
import config from "@/lib/config";

const redis = new Redis({
  url: config.env.upstash.redisUrl || "https://mock-redis.upstash.io",
  token: config.env.upstash.redisToken || "mock_token",
});

export default redis;
