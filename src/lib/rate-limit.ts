import "server-only";
import { connectDB } from "@/lib/db/connect";
import { RateLimit } from "@/lib/db/models/rate-limit";

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/**
 * Checks and increments rate limiting count for a given key.
 * Uses MongoDB TTL index on expiresAt for automatic expiration.
 *
 * @param key Unique key (e.g. login:ip, feedback:ip)
 * @param limit Maximum allowed attempts in the window
 * @param windowSeconds Window length in seconds (default 15 minutes)
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number = 15 * 60
): Promise<RateLimitResult> {
  await connectDB();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  // Find existing record
  const record = await RateLimit.findOne({ key });

  if (!record) {
    await RateLimit.create({
      key,
      count: 1,
      expiresAt,
    });
    return { success: true, remaining: limit - 1 };
  }

  // If already reached limit
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  // Increment attempt count
  record.count += 1;
  await record.save();

  return {
    success: true,
    remaining: Math.max(0, limit - record.count),
  };
}

/**
 * Resets the rate limit counter for a key upon successful action (e.g. successful login)
 */
export async function resetRateLimit(key: string): Promise<void> {
  await connectDB();
  await RateLimit.deleteOne({ key });
}
