import { INCIDENTS } from "@/lib/content";

// "Selbst gefunden, selbst behoben" (2026-09-07, Recherche-Synthese; 2026-09-10 von der
// Startseite auf die jeweilige Projekt-Seite verschoben — Luis: zwischen den anderen
// Homepage-Blöcken wirkte die Liste unsauber). Zeigt jetzt nur noch den einen Eintrag, der zum
// gerade angezeigten Projekt gehört (falls vorhanden), direkt auf app/projekte/[slug]/page.tsx —
// kein Link mehr nötig, wir sind ja bereits auf der Projekt-Seite. Fehler-/Incident-Transparenz
// bleibt laut Recherche das stärkste Vertrauenssignal, nur die Präsentation ist jetzt sauberer:
// dort, wo der volle Kontext (challenge/outcome) ohnehin schon steht, statt als Quer-Liste
// zwischen fachfremden Homepage-Abschnitten.
export function IncidentCallout({ projectId }: { projectId: string }) {
  const incident = INCIDENTS.find((i) => i.projectId === projectId);
  if (!incident) return null;

  return (
    <div className="mt-8 rounded-md border border-accent-dim bg-surface p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Selbst gefunden, selbst behoben
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{incident.summary}</p>
    </div>
  );
}
