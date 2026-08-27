import Link from "next/link";
import type { ProjectNode } from "@/lib/content";
import type { LiveStatus } from "@/lib/status";
import { formatProjectMeta, formatLiveStatus } from "@/lib/labels";

// Ein Einschub im Server-Rack (Konzept F, 2026-08-27) — ersetzt die vorherige quadratische
// Karte (project-card.tsx, gelöscht) durch eine horizontale Slot-Leiste, näher an der
// tatsächlichen Metapher "ein Projekt = eine Einheit im Rack". Verlinkt weiterhin direkt auf
// die bestehende Projekt-Seite (app/projekte/[slug]/page.tsx) — kein neues Panel-/Drawer-
// System, dadurch bleibt das Rack beim Klick stabil (kein Reflow-Problem wie beim früheren
// Inline-Aufklappen im Grid).
function LiveLed({ live }: { live: LiveStatus | null }) {
  const formatted = formatLiveStatus(live);
  const dotColor = !formatted
    ? "var(--border)"
    : live?.status === "operational"
      ? "var(--status-online)"
      : live?.status === "degraded"
        ? "var(--status-paper)"
        : "#f87171";

  return (
    <span
      aria-hidden="true"
      className="h-2 w-2 shrink-0 rounded-full"
      style={{
        backgroundColor: dotColor,
        boxShadow: formatted ? `0 0 6px ${dotColor}` : "none",
      }}
      title={formatted ? formatted.label : undefined}
    />
  );
}

export function RackSlot({
  project,
  live,
  dimmed = false,
}: {
  project: ProjectNode;
  live?: LiveStatus | null;
  /** Für die Archiv-Ablage (Projekte ohne server-Feld) — gedimmter Look, keine LED. */
  dimmed?: boolean;
}) {
  return (
    <Link
      href={`/projekte/${project.id}`}
      className={`group flex items-center gap-3 rounded border p-3 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent-dim ${
        dimmed
          ? "border-border/60 opacity-60 hover:opacity-90"
          : "border-border hover:border-[var(--card-accent,var(--foreground-muted))] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--card-accent,transparent)_16%,transparent)]"
      }`}
      style={{ ["--card-accent" as string]: project.accentColor }}
    >
      {/* Lüftungsschlitz-Textur — rein dekorativ, echte Klick-/Statusinfo steht im Text daneben. */}
      <span aria-hidden="true" className="rack-vents h-8 w-3 shrink-0 rounded-sm" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 truncate font-sans text-sm font-semibold tracking-tight text-foreground">
            {project.name}
          </span>
          {!dimmed && <LiveLed live={live ?? null} />}
        </span>
        <span className="block truncate font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
          {formatProjectMeta(project)}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-sm text-foreground-muted transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
