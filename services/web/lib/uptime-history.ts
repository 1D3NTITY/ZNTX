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
type RawSummary = {
  updatedAt: string | null;
  projects: Record<string, { days: DayBucket[] }>;
};

export type UptimeHistorySummary = { percent: number; days: number };

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
      ? { percent: (totals.operational / totals.checks) * 100, days: days.length }
      : null;
  }
  return out;
}

// Modul-Level-Memo, identisches Muster wie getProjectStatuses() in lib/status.ts — ein
// langlebiger Container, TTL etwas über dem 30-Min-Check-Intervall, damit nie öfter als nötig
// gegen raw.githubusercontent.com gefetcht wird.
const TTL_MS = 15 * 60_000;
let memo: { at: number; value: Record<string, UptimeHistorySummary | null> } | null = null;
let inFlight: Promise<Record<string, UptimeHistorySummary | null>> | null = null;

export async function getUptimeHistorySummary(): Promise<Record<string, UptimeHistorySummary | null>> {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.value;
  if (inFlight) return inFlight;

  inFlight = fetchRaw()
    .then((raw) => {
      const value = raw ? computeSummary(raw) : {};
      memo = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
