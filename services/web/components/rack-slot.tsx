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
      // phosphor-live: minimales Helligkeits-Flackern, nur bei Slots mit echten Live-Daten —
      // dadurch bewegt sich sichtbar genau das, was auch wirklich lebt.
      className={`h-2 w-2 shrink-0 rounded-full ${formatted ? "phosphor-live" : ""}`}
      style={{
        backgroundColor: dotColor,
        // Zweistufiger Schein (Kern + Hof) statt eines einzelnen Radius — siehe .glow-amber
        // in globals.css, gleiche Begründung: ein Radius wirkt nach Weichzeichner.
        boxShadow: formatted ? `0 0 5px ${dotColor}, 0 0 14px ${dotColor}` : "none",
      }}
      title={
        formatted
          ? [formatted.label, formatted.detail].filter(Boolean).join(" — ")
          : undefined
      }
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
  // Die Detailzeile ("Deploy vor 10 Tagen · Sync vor 6 Std") wurde bisher zwar berechnet, aber
  // verworfen — sichtbar war nur der LED-Punkt. Genau daran scheiterte der Eindruck von
  // "echter, laufender Infrastruktur" (Wow-Effekt-Diagnose 2026-09-03, siehe
  // docs/plans/live-wow-2026-09-03.md): ohne bewegliche Zahlen ist die Seite von einem
  // statischen Portfolio nicht unterscheidbar. Fehlt der Wert, bleibt die Zeile weg — kein
  // Platzhalter, keine erfundene Angabe.
  const liveDetail = dimmed ? null : formatLiveStatus(live ?? null)?.detail ?? null;

  return (
    <Link
      href={`/projekte/${project.id}`}
      className={`group relative flex items-center gap-3 overflow-hidden rounded border p-3 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent-dim ${
        dimmed
          ? "border-border/60 opacity-60 hover:opacity-90"
          : "rack-slot-glitch border-border hover:border-[var(--card-accent,var(--foreground-muted))] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--card-accent,transparent)_16%,transparent)]"
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
        {liveDetail && (
          <span className="mt-0.5 block truncate font-mono text-[11px] text-accent/80">
            {liveDetail}
          </span>
        )}
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
