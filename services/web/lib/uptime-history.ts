import { GITHUB_REPO } from "@/lib/content";

// Git-committed Uptime-History (2026-09-08) — liest die von scripts/uptime-check.ts (GitHub
// Actions, alle 30 Min) committete Rohdaten-Datei server-seitig zur Request-Zeit. Bewusst NICHT
// lokal aus dem Dateisystem gelesen: data/uptime/summary.json liegt außerhalb des Docker-Build-
// Contexts (Repo-Root, nicht services/web/), damit die Zahlen ohne Redeploy weiterwachsen — ein
// lokaler fs.readFile würde nur den Stand vom letzten Build zeigen.
//
// Gleiche Ehrlichkeitsdisziplin wie lib/status.ts: schlägt der Fetch fehl oder gibt es noch keine
// Daten (frisch aufgesetzt, erster Actions-Lauf steht noch aus), liefert dieses Modul `null` für
// das betroffene Projekt — die UI zeigt dann einfach keine Zeile, nie eine erfundene Zahl.

type DayBucket = { date: string; checks: number; operational: number };
type KumaDayBucket = { date: string; checks: number; up: number };
type KumaReachability = "up" | "down" | "unknown";
type KumaEntry = { lastStatus: KumaReachability; lastCheckedAt: string; days: KumaDayBucket[] };
type RawSummary = {
  updatedAt: string | null;
  projects: Record<string, { days: DayBucket[]; kuma?: KumaEntry }>;
};

/** Tages-Segment für die Health-Bar (2026-09-17, ersetzt die reine Prozent-Zeile im Rack-Slot).
 *  "partial" = ein Tag mit gemischtem Ergebnis (manche Checks ok, manche nicht) — dritter Zustand
 *  statt binärem up/down, damit ein einzelner Ausfall im Tagesverlauf nicht als "ganzer Tag down"
 *  verzerrt wird, aber auch nicht unter den Tisch fällt. */
export type DaySegmentStatus = "up" | "partial" | "down";
export type DaySegment = { date: string; status: DaySegmentStatus };

function segmentStatus(success: number, checks: number): DaySegmentStatus {
  if (success === 0) return "down";
  if (success === checks) return "up";
  return "partial";
}

export type UptimeHistorySummary = { percent: number; days: number; segments: DaySegment[] };

/** Kuma-Reachability-Gegenstück zu UptimeHistorySummary (2026-09-16, lib/kuma.ts) — bewusst
 *  eigener Typ statt Wiederverwendung: andere Semantik (Erreichbarkeit statt fachliche
 *  Korrektheit), soll auch in der UI nie mit dem bestehenden Feld verwechselt werden. */
export type KumaSummary = {
  reachability: KumaReachability;
  lastCheckedAt: string | null;
  uptimePercent: number | null;
  days: number;
  segments: DaySegment[];
};

const RAW_URL = `${GITHUB_REPO.replace("github.com", "raw.githubusercontent.com")}/main/data/uptime/summary.json`;

async function fetchRaw(): Promise<RawSummary | null> {
  try {
    const res = await fetch(RAW_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (typeof data !== "object" || data === null) return null;
    const d = data as RawSummary;
    if (typeof d.projects !== "object" || d.projects === null) return null;
    return d;
  } catch {
    return null;
  }
}

function computeSummary(raw: RawSummary): Record<string, UptimeHistorySummary | null> {
  const out: Record<string, UptimeHistorySummary | null> = {};
  for (const [id, entry] of Object.entries(raw.projects)) {
    const days = entry?.days ?? [];
    const totals = days.reduce(
      (acc, d) => ({ checks: acc.checks + d.checks, operational: acc.operational + d.operational }),
      { checks: 0, operational: 0 },
    );
    out[id] = totals.checks > 0
      ? {
          percent: (totals.operational / totals.checks) * 100,
          days: days.length,
          segments: days.map((d) => ({ date: d.date, status: segmentStatus(d.operational, d.checks) })),
        }
      : null;
  }
  return out;
}

function computeKumaSummary(raw: RawSummary): Record<string, KumaSummary | null> {
  const out: Record<string, KumaSummary | null> = {};
  for (const [id, entry] of Object.entries(raw.projects)) {
    const kuma = entry?.kuma;
    if (!kuma) {
      out[id] = null;
      continue;
    }
    const totals = kuma.days.reduce(
      (acc, d) => ({ checks: acc.checks + d.checks, up: acc.up + d.up }),
      { checks: 0, up: 0 },
    );
    out[id] = {
      reachability: kuma.lastStatus,
      lastCheckedAt: kuma.lastCheckedAt,
      uptimePercent: totals.checks > 0 ? (totals.up / totals.checks) * 100 : null,
      days: kuma.days.length,
      segments: kuma.days.map((d) => ({ date: d.date, status: segmentStatus(d.up, d.checks) })),
    };
  }
  return out;
}

// Modul-Level-Memo, identisches Muster wie getProjectStatuses() in lib/status.ts — ein
// langlebiger Container, TTL etwas über dem 30-Min-Check-Intervall, damit nie öfter als nötig
// gegen raw.githubusercontent.com gefetcht wird. Geteilt zwischen getUptimeHistorySummary() und
// getKumaSummary() (2026-09-16) — beide lesen dieselbe committete Datei, ein Fetch statt zwei.
const TTL_MS = 15 * 60_000;
let memo: { at: number; value: RawSummary | null } | null = null;
let inFlight: Promise<RawSummary | null> | null = null;

async function getRawSummary(): Promise<RawSummary | null> {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.value;
  if (inFlight) return inFlight;

  inFlight = fetchRaw()
    .then((raw) => {
      memo = { at: Date.now(), value: raw };
      return raw;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export async function getUptimeHistorySummary(): Promise<Record<string, UptimeHistorySummary | null>> {
  const raw = await getRawSummary();
  return raw ? computeSummary(raw) : {};
}

export async function getKumaSummary(): Promise<Record<string, KumaSummary | null>> {
  const raw = await getRawSummary();
  return raw ? computeKumaSummary(raw) : {};
}
