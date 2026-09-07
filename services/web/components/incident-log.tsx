import Link from "next/link";
import { INCIDENTS, PROJECTS } from "@/lib/content";

// "Selbst gefunden, selbst behoben" (2026-09-07, Recherche-Synthese) — ersetzt die vorherige
// gedimmte "Archiv"-Ablage (die nur n8n-automation enthielt) an derselben Stelle im Dashboard.
// Grund: Fehler-/Incident-Transparenz ist laut Recherche das stärkste Vertrauenssignal bei
// technischen Portfolios, wurde hier aber bisher optisch abgewertet statt hervorgehoben. Jede
// Zeile verlinkt auf die bestehende Projekt-Seite, wo der volle Kontext (challenge/outcome in
// lib/content.ts) bereits steht — keine neuen Fakten, nur Sichtbarkeit erhöht.
export function IncidentLog() {
  return (
    <div className="mt-4">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground-muted">
        Selbst gefunden, selbst behoben
      </p>
      <div className="flex flex-col gap-2">
        {INCIDENTS.map((incident) => {
          const project = PROJECTS.find((p) => p.id === incident.projectId);
          if (!project) return null;
          return (
            <Link
              key={incident.projectId}
              href={`/projekte/${incident.projectId}`}
              className="group flex items-center gap-3 rounded border border-border p-3 transition-colors duration-300 hover:border-[var(--card-accent,var(--foreground-muted))]"
              style={{ ["--card-accent" as string]: project.accentColor }}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
                  {project.name}
                </span>
                <span className="mt-0.5 block text-sm text-foreground">{incident.summary}</span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-sm text-foreground-muted transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
