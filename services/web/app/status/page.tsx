import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/lib/content";
import { formatLiveStatus, formatRelativeTime } from "@/lib/labels";
import { getProjectStatuses } from "@/lib/status";
import { getUptimeHistorySummary, getKumaSummary } from "@/lib/uptime-history";
import { HealthBarRow } from "@/components/health-bar";

// Ausführliche Live-/Uptime-Übersicht (2026-09-19, Luis-Anfrage) — zeigt dieselben Daten, die
// schon auf der Startseite (Rack-Slots) und den Projekt-Detailseiten kompakt sichtbar sind, nur
// vollständiger: alle gemonitorten Projekte an einem Ort, Prozentzahlen sichtbar statt nur im
// Tooltip. Bewusst KEINE neue Datenquelle und kein neuer Live-Fetch — dieselben drei Funktionen
// wie überall sonst (lib/status.ts, lib/uptime-history.ts), damit die von SERVERMANAGEMENT
// empfohlene Architektur (keine neue Laufzeit-Abhängigkeit auf Server 1/Kuma) unangetastet bleibt.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Live-Status — zntx",
  description: "Ausführliche Live- und Uptime-Übersicht aller überwachten Projekte.",
  alternates: { canonical: "/status" },
};

export default async function StatusPage() {
  const [{ statuses, fetchedAt }, uptimeHistory, kumaSummary] = await Promise.all([
    getProjectStatuses(),
    getUptimeHistorySummary(),
    getKumaSummary(),
  ]);

  // Keine hardcodierte Projektliste — jedes Projekt mit mindestens einer der beiden Historien
  // taucht auf, alles andere (motortown, wcp-arma, n8n-automation, currymeister13: kein
  // Monitoring) bleibt ehrlich weg statt einer erfundenen Zeile.
  const monitored = PROJECTS.filter(
    (p) => uptimeHistory[p.id] || kumaSummary[p.id]
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-0 lg:py-24">
      <Link
        href="/"
        className="inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        ← Zurück zur Übersicht
      </Link>

      <header className="mt-8 mb-10">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Live-Status
        </h1>
        <p className="mt-3 max-w-xl text-sm text-foreground-muted">
          Fachlicher Status (projekteigener <code>/status</code>-Endpoint) und Kuma-
          Erreichbarkeit für jedes überwachte Projekt — dieselben Daten wie auf der Startseite,
          hier nur vollständig statt kompakt.
        </p>
        {fetchedAt && (
          <p className="mt-2 font-mono text-[11px] text-accent/80">
            Live-Daten abgerufen um{" "}
            {new Date(fetchedAt).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Europe/Berlin",
            })}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-6">
        {monitored.map((project) => {
          const live = statuses[project.id] ?? null;
          const uptime = uptimeHistory[project.id] ?? null;
          const kuma = kumaSummary[project.id] ?? null;
          const formatted = formatLiveStatus(live);

          return (
            <div key={project.id} className="rounded-md border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={`/projekte/${project.id}`}
                  className="font-sans text-sm font-semibold text-foreground hover:text-accent"
                >
                  {project.name}
                </Link>
                {formatted ? (
                  <span className="badge font-mono text-[11px] text-foreground-muted">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          live?.status === "operational"
                            ? "var(--status-online)"
                            : live?.status === "degraded"
                              ? "var(--status-paper)"
                              : "#f87171",
                      }}
                    />
                    <span className="uppercase tracking-widest">{formatted.label}</span>
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-foreground-muted">
                    Live-Status nicht abrufbar
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                {uptime && (
                  <HealthBarRow
                    label="Status"
                    segments={uptime.segments}
                    percent={uptime.percent}
                    days={uptime.days}
                    showPercent
                  />
                )}
                {kuma && (
                  <HealthBarRow
                    label="Erreichbar"
                    segments={kuma.segments}
                    percent={kuma.uptimePercent}
                    days={kuma.days}
                    tooltipSuffix={
                      kuma.lastCheckedAt
                        ? `zuletzt geprüft ${formatRelativeTime(kuma.lastCheckedAt)}`
                        : undefined
                    }
                    showPercent
                  />
                )}
                {kuma?.lastCheckedAt && (
                  <p className="mt-0.5 font-mono text-[10px] text-foreground-muted/70">
                    Kuma zuletzt geprüft {formatRelativeTime(kuma.lastCheckedAt)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
