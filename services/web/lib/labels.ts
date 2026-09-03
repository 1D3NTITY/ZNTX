import type { ProjectNode } from "@/lib/content";
import type { LiveStatus, LiveStatusValue } from "@/lib/status";

// Ausgelagert aus project-case-study.tsx (Konzept A, 2026-07-24) — wird jetzt
// sowohl vom Dashboard-Zeilen-Header (dashboard-row.tsx) als auch vom
// aufgeklappten Case-Study-Body gebraucht.
export const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
  archived: "ARCHIVIERT",
};

export const SERVER_LABEL: Record<"server-1" | "server-2", string> = {
  "server-1": "Server 1",
  "server-2": "Server 2",
};

// Eine Zeile: "LIVE · Server 1 · seit Mai 2026" — identische Formatierung wie
// vorher inline in project-case-study.tsx, jetzt zentral für den Dashboard-
// Zeilen-Header (dashboard-row.tsx via ops-dashboard.tsx).
export function formatProjectMeta(project: ProjectNode): string {
  const parts = [STATUS_LABEL[project.status]];
  if (project.server) parts.push(SERVER_LABEL[project.server]);
  if (project.since) {
    parts.push(`${project.status === "archived" ? "" : "seit "}${project.since}`);
  }
  return parts.join(" · ");
}

// Live-Status-Anzeige für den "Live Infrastructure Atlas" (Redesign 2026-08-23) — ergänzt die
// statischen STATUS_LABEL-Werte oben um echte /status-Endpoint-Daten (lib/status.ts). Bewusst
// getrennt von formatProjectMeta: Live-Status ist optional/kann fehlen (null), statischer Status
// ist immer vorhanden.
export const LIVE_STATUS_VALUE_LABEL: Record<LiveStatusValue, string> = {
  operational: "OPERATIONAL",
  degraded: "DEGRADED",
  down: "DOWN",
};

// Grobe, bewusst unpräzise Relativzeit (keine Sekundenanzeige — siehe qntx-autotrader-
// Einschränkung: selbst bei den anderen Projekten wirkt "vor 43s" unnötig taktungsnah für ein
// öffentliches Portfolio). Fällt auf das Datum zurück, wenn älter als 30 Tage.
export function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `vor ${diffDays} Tag${diffDays === 1 ? "" : "en"}`;
  return date.toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Liefert Badge-Label + optionale Detail-Zeile für einen Proof-Block, abhängig vom tatsächlichen
 * Schema (basic/uptime/badge — siehe lib/status.ts). Kein Erzwingen eines einheitlichen
 * Feldsatzes: qntx-autotrader zeigt bewusst nur ein Badge, ohne Detail-Zeile.
 */
export function formatLiveStatus(
  live: LiveStatus | null
): { label: string; detail: string | null } | null {
  if (!live) return null;
  const label = LIVE_STATUS_VALUE_LABEL[live.status];

  if (live.schema === "badge") {
    return { label, detail: null };
  }
  if (live.schema === "uptime") {
    const since = live.uptimeSince
      ? new Date(live.uptimeSince).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" })
      : null;
    return { label, detail: since ? `Uptime seit ${since}` : null };
  }

  const deploy = formatRelativeTime(live.lastDeploy);
  const sync = formatRelativeTime(live.lastSync);
  const parts: string[] = [];
  if (deploy) parts.push(`Deploy ${deploy}`);
  if (sync) parts.push(`Sync ${sync}`);
  return { label, detail: parts.length > 0 ? parts.join(" · ") : null };
}

/**
 * Uhrzeit des Status-Snapshots (lib/status.ts, StatusSnapshot.fetchedAt) für die "Stand"-Zeile.
 * Zeitzone ist bewusst fest verdrahtet statt Umgebungs-abhängig: die Formatierung passiert
 * serverseitig und muss beim Hydrieren exakt denselben String ergeben — ein aus der Client-
 * Zeitzone abgeleiteter Wert würde für Besucher außerhalb Europe/Berlin abweichen und genau
 * die Hydration-Mismatch-Klasse auslösen, die in diesem Projekt schon zweimal zugeschlagen hat.
 */
export function formatSnapshotTime(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Berlin",
  });
}
