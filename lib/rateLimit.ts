/**
 * Simple in-memory rate limiter — no external dependencies.
 * Resets on server restart. Good enough for development and low-traffic production.
 */

interface IpRecord {
  count: number
  windowStart: number
}

const ipMap = new Map<string, IpRecord>()

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '5', 10)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const now = Date.now()
  const record = ipMap.get(ip)

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    ipMap.set(ip, { count: 1, windowStart: now })
    return { success: true, remaining: RATE_LIMIT_MAX - 1, reset: now + RATE_LIMIT_WINDOW_MS }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { success: false, remaining: 0, reset: record.windowStart + RATE_LIMIT_WINDOW_MS }
  }

  record.count++
  return {
    success: true,
    remaining: RATE_LIMIT_MAX - record.count,
    reset: record.windowStart + RATE_LIMIT_WINDOW_MS,
  }
}
