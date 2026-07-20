// Einfacher In-Memory-Sliding-Window-Rate-Limiter. Reicht für eine einzelne
// Container-Instanz (kein Multi-Replica-Setup hier) — bei Neustart wird der
// Zustand zurückgesetzt, das ist für ein Kontaktformular akzeptabel.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
