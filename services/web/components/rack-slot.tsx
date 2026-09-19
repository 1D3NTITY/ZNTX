import Link from "next/link";
import type { ProjectNode } from "@/lib/content";
import type { LiveStatus } from "@/lib/status";
import type { UptimeHistorySummary, KumaSummary } from "@/lib/uptime-history";
import { formatProjectMeta, formatLiveStatus, formatRelativeTime } from "@/lib/labels";
import { HealthBarRow } from "@/components/health-bar";

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
      // live-pulse: minimales Helligkeits-Flackern, nur bei Slots mit echten Live-Daten —
      // dadurch bewegt sich sichtbar genau das, was auch wirklich lebt.
      className={`h-2 w-2 shrink-0 rounded-full ${formatted ? "live-pulse" : ""}`}
      style={{
        backgroundColor: dotColor,
        // Zweistufiger Schein (Kern + Hof) statt eines einzelnen Radius — siehe .glow-accent
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
  uptime,
  kuma,
  dimmed = false,
}: {
  project: ProjectNode;
  live?: LiveStatus | null;
  /** Git-committed Uptime-History (2026-09-08, lib/uptime-history.ts) — andere Datenquelle als
   *  `live` oben (Actions-committete Historie statt Live-Fetch), unabhängig davon ob vorhanden. */
  uptime?: UptimeHistorySummary | null;
  /** Kuma-Reachability (2026-09-16, lib/uptime-history.ts getKumaSummary) — MISST ETWAS ANDERES
   *  als `uptime` oben: reine Erreichbarkeit von außen (Uptime Kuma), nicht die fachliche
   *  Korrektheit des projekteigenen /status-Endpoints. Bewusst als eigene Zeile gerendert, nie
   *  in `live`/`uptime` eingerechnet — sonst geht genau der Fall verloren, der foodapp schon
   *  einmal passiert ist (Endpoint meldete "operational", während der Sync tot war; Kuma hätte
   *  das nie bemerkt). */
  kuma?: KumaSummary | null;
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
          : "rack-slot-glow-ring border-border hover:border-[var(--card-accent,var(--foreground-muted))] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--card-accent,transparent)_16%,transparent)]"
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
        {/* Git-committed Uptime-History (2026-09-08) — eigene Zeile, gleiche Lektion wie beim
            Attributions-Tag: nie mit einer anderen Zeile um Breite konkurrieren lassen. Nur
            gerendert wenn echte Daten vorliegen (mind. 1 Check je bisherigem Actions-Lauf) —
            direkt nach dem ersten Deploy, bevor der Workflow einmal gelaufen ist, bleibt die
            Zeile ehrlich weg statt "0 %" zu zeigen. */}
        {/* Health-Bars (2026-09-17, ersetzt die reine Prozent-Text-Zeile) — Tages-Segmente statt
            Zahl, gleiche Daten wie zuvor. Zwei bewusst getrennte Zeilen (fachlich vs. Kuma-
            Erreichbarkeit, siehe Kommentar bei der `kuma`-Prop oben) — nie zusammengelegt.
            Gemeinsame Komposition mit der Projekt-Detailseite über HealthBarRow (2026-09-19,
            siehe components/health-bar.tsx). */}
        {!dimmed && uptime && (
          <div className="mt-1">
            <HealthBarRow
              label="Status"
              segments={uptime.segments}
              percent={uptime.percent}
              days={uptime.days}
            />
          </div>
        )}
        {!dimmed && kuma && (
          <div className="mt-1">
            <HealthBarRow
              label="Erreichbar"
              segments={kuma.segments}
              percent={kuma.uptimePercent}
              days={kuma.days}
              tooltipSuffix={
                kuma.lastCheckedAt ? `zuletzt geprüft ${formatRelativeTime(kuma.lastCheckedAt)}` : undefined
              }
            />
          </div>
        )}
        {/* Attributions-Tag (2026-09-07, Recherche-Synthese) — löst den häufigsten
            Glaubwürdigkeits-Einwand ("unklare Eigenleistung") direkt auf der Startseite, ohne
            Klick. Bewusst knapp (2 Wörter, kein Fließtext) statt die ausführliche myWork-Box der
            Projekt-Unterseite zu verdoppeln — die volle Formulierung steht dort bereits. Eigene
            Zeile statt in die Meta-Zeile gequetscht (erste Fassung teilte sich sonst horizontal
            den Platz mit formatProjectMeta und schnitt bei jedem Slot echte Info ab, gemessen
            per Playwright: scrollWidth bis zu 413px bei nur 225px verfügbarem Platz). Nur
            gerendert wo das Feld wirklich gesetzt ist, keine pauschale Annahme. */}
        {!dimmed && project.myWork && (
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-accent/70">
            eigene Arbeit
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
