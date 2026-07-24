import type { ProjectNode } from "@/lib/content";

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
