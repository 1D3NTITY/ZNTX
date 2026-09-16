// Git-committed Uptime-History (Upptime-Muster, 2026-09-08) — läuft per GitHub Actions
// (.github/workflows/uptime.yml) alle 30 Minuten, außerhalb des Next.js-Runtimes. Fragt dieselben
// echten /status-Endpoints ab wie die laufende Seite (services/web/lib/status.ts, keine zweite,
// parallele Endpoint-Liste), schreibt einen rollierenden 30-Tage-Verlauf pro Projekt.
//
// "operational" zählt als voller Uptime-Check, "degraded"/"down"/null (nicht erreichbar) NICHT —
// gleiche Konvention wie klassische Uptime-Monitore. Keine erfundenen Werte: fehlt ein Endpoint
// komplett (z.B. Netzwerkfehler), zählt der Check trotzdem (checks += 1), nur eben nicht als
// operational — das Ergebnis ist ein ehrlich niedrigerer Prozentsatz, keine Lücke, die verschweigt
// dass überhaupt geprüft wurde.
import { getMonitoredProjectIds, checkLiveValue } from "../services/web/lib/status";
import {
  KUMA_PROJECT_MONITOR_IDS,
  fetchKumaHeartbeats,
  computeProjectReachability,
  type KumaReachability,
} from "../services/web/lib/kuma";
import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../data/uptime/summary.json", import.meta.url);
const RETENTION_DAYS = 30;

type DayBucket = { date: string; checks: number; operational: number };
type KumaDayBucket = { date: string; checks: number; up: number };
type KumaEntry = { lastStatus: KumaReachability; lastCheckedAt: string; days: KumaDayBucket[] };
type Summary = {
  updatedAt: string | null;
  projects: Record<string, { days: DayBucket[]; kuma?: KumaEntry }>;
};

/** Retention-Kürzung — für beide Day-Bucket-Arten (fachlich + Kuma) identisch. */
function trimRetention<T>(days: T[]): T[] {
  return days.length > RETENTION_DAYS ? days.slice(days.length - RETENTION_DAYS) : days;
}

async function loadSummary(): Promise<Summary> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Summary;
    if (parsed && typeof parsed === "object" && parsed.projects) return parsed;
  } catch {
    // Datei fehlt oder ist kaputt — mit leerem Zustand neu anfangen statt abzubrechen.
  }
  return { updatedAt: null, projects: {} };
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function main() {
  const ids = getMonitoredProjectIds();
  const today = todayUtc();
  const summary = await loadSummary();

  const results = await Promise.allSettled(ids.map((id) => checkLiveValue(id)));

  ids.forEach((id, i) => {
    const r = results[i];
    const status = r.status === "fulfilled" ? r.value : null;
    const isOperational = status === "operational";

    if (!summary.projects[id]) summary.projects[id] = { days: [] };
    const days = summary.projects[id].days;
    const last = days[days.length - 1];

    if (last && last.date === today) {
      last.checks += 1;
      if (isOperational) last.operational += 1;
    } else {
      days.push({ date: today, checks: 1, operational: isOperational ? 1 : 0 });
    }

    summary.projects[id].days = trimRetention(days);
  });

  // Kuma-Reachability (2026-09-16, siehe lib/kuma.ts) — ein Fetch für alle Monitore, dann pro
  // gemapptem Projekt aggregiert. Schlägt der Fetch fehl, wird der Kuma-Teil für diesen Lauf
  // komplett übersprungen (kein Day-Bucket-Eintrag): ein Netzwerkfehler des Actions-Runners
  // gegen status.zblt.eu ist nicht dasselbe wie "die überwachten Dienste sind down" — das darf
  // die Reachability-Historie nicht verfälschen.
  const heartbeats = await fetchKumaHeartbeats();
  if (heartbeats) {
    const nowIso = new Date().toISOString();
    for (const [id, monitorIds] of Object.entries(KUMA_PROJECT_MONITOR_IDS)) {
      const reachability = computeProjectReachability(heartbeats, monitorIds);
      const isUp = reachability === "up";

      if (!summary.projects[id]) summary.projects[id] = { days: [] };
      const project = summary.projects[id];
      const kumaDays = project.kuma?.days ?? [];
      const last = kumaDays[kumaDays.length - 1];

      if (last && last.date === today) {
        last.checks += 1;
        if (isUp) last.up += 1;
      } else {
        kumaDays.push({ date: today, checks: 1, up: isUp ? 1 : 0 });
      }

      project.kuma = {
        lastStatus: reachability,
        lastCheckedAt: nowIso,
        days: trimRetention(kumaDays),
      };
    }
  } else {
    console.warn("Kuma-Heartbeat-Fetch fehlgeschlagen, Reachability-Teil für diesen Lauf übersprungen.");
  }

  summary.updatedAt = new Date().toISOString();

  await writeFile(DATA_PATH, JSON.stringify(summary, null, 2) + "\n", "utf-8");
  console.log(`Uptime-Check aktualisiert für ${ids.length} Projekte, Stand ${summary.updatedAt}`);
}

main().catch((err) => {
  console.error("uptime-check.ts fehlgeschlagen:", err);
  process.exit(1);
});
