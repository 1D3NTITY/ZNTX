import type { ProjectNode } from "@/lib/content";
import type { LiveStatus } from "@/lib/status";
import { RackSlot } from "@/components/rack-slot";

// Rack-Rahmen (Konzept F, 2026-08-27) — eine 1:1-Karte der echten Zwei-Server-Infrastruktur
// statt einer generischen Card-Grid. Zwei Instanzen (Server 1 / Server 2) in ops-dashboard.tsx,
// jedes Projekt ein RackSlot darin, sortiert nach dem tatsächlichen server-Feld in content.ts —
// keine erfundene Zuordnung.
export function ServerRack({
  label,
  description,
  projects,
  statuses,
}: {
  label: string;
  /** Kurze, ehrliche Beschreibung der Workload-Art (Idee aus einem Lovable-Vergleichsentwurf,
   *  2026-08-29) — z.B. "Web-Apps, Datenbanken, Matrix-Homeserver". */
  description?: string;
  projects: ProjectNode[];
  statuses: Record<string, LiveStatus | null>;
}) {
  return (
    <div className="relative rounded-md border-2 border-border bg-surface p-4">
      {/* Befestigungspunkte oben — rein dekorativ, Rack-Optik. */}
      <span aria-hidden="true" className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-border" />
      <span aria-hidden="true" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-border" />
      <h2 className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-foreground-muted">
        {label}
      </h2>
      {description && (
        <p className="mb-3 text-center text-xs text-foreground-muted">{description}</p>
      )}
      {!description && <div className="mb-3" />}
      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <RackSlot key={project.id} project={project} live={statuses[project.id] ?? null} />
        ))}
      </div>
    </div>
  );
}
