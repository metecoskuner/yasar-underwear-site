const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 6;
const ipMap = new Map<string, { count: number; firstTs: number }>();

export function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry) {
    ipMap.set(ip, { count: 1, firstTs: now });
    return false;
  }
  if (now - entry.firstTs > RATE_LIMIT_WINDOW_MS) {
    ipMap.set(ip, { count: 1, firstTs: now });
    return false;
  }
  entry.count += 1;
  ipMap.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

export function resetRateLimit() {
  ipMap.clear();
}
