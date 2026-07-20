import type { ProjectNode } from "@/lib/content";

const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
};

const STATUS_COLOR: Record<ProjectNode["status"], string> = {
  live: "bg-status-online",
  "paper-trading": "bg-status-paper",
  internal: "bg-foreground-muted",
};

export function NodeCard({ project }: { project: ProjectNode }) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-md border border-border bg-surface p-5 transition-colors hover:border-accent-dim">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            {project.role}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            {project.name}
          </h3>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[project.status]}`}
            aria-hidden
          />
          {STATUS_LABEL[project.status]}
        </span>
      </header>

      <p className="text-sm leading-relaxed text-foreground-muted">
        {project.tagline}
      </p>

      <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-foreground-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm text-foreground-muted">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-accent" aria-hidden>
              &gt;
            </span>
            {h}
          </li>
        ))}
      </ul>
    </article>
  );
}
