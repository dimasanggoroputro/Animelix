import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Validasi env vars saat startup — fail fast daripada error runtime
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    "Missing Upstash env vars: UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN harus di-set"
  );
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Sliding window: 30 request per menit per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "anime-app", // namespace biar ga bentrok kalau punya project lain di Redis yang sama
});