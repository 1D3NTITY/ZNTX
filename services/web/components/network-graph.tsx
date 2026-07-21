"use client";

import { useMemo } from "react";
import type { ProjectNode, ProjectStatus } from "@/lib/content";

const STATUS_COLOR: Record<ProjectStatus, string> = {
  live: "var(--status-online)",
  "paper-trading": "var(--status-paper)",
  internal: "var(--foreground-muted)",
  archived: "var(--foreground-muted)",
};

type Point = { x: number; y: number };

function nodePositions(count: number, radius = 38): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (-90 + i * (360 / count)) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

export function NetworkGraph({
  projects,
  onSelect,
  compact = false,
}: {
  projects: ProjectNode[];
  onSelect: (project: ProjectNode) => void;
  /** Kleinere Darstellung für die Index-Leiste statt große Hero-Fläche. */
  compact?: boolean;
}) {
  const positions = useMemo(() => nodePositions(projects.length), [projects.length]);

  return (
    <div
      className={`relative mx-auto aspect-square w-full select-none ${compact ? "max-w-[220px]" : "max-w-2xl"}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {positions.map((p, i) => (
          <line
            key={projects[i].id}
            x1={50}
            y1={50}
            x2={p.x}
            y2={p.y}
            stroke="var(--accent-dim)"
            strokeWidth={0.3}
            style={{
              // Nur 3 Durchläufe beim Laden ("Boot-Flicker"), dann Ruhe — eine
              // permanent sichtbare Sidebar-Animation ermüdet (UI-Craft-Audit:
              // Motion-Overload ist das häufigste "wirkt billig"-Signal).
              animation: "pulse-line 3.5s ease-in-out 3",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <circle cx={50} cy={50} r={2.2} fill="var(--accent)" />
      </svg>

      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
        aria-hidden="true"
      >
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        {!compact && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
            operator
          </span>
        )}
      </div>

      {projects.map((project, i) => {
        const p = positions[i];
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-md p-1.5 outline-none"
            aria-label={`Zu ${project.name} springen`}
            title={project.name}
          >
            <span
              className="h-2 w-2 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform group-hover:scale-125 group-focus-visible:scale-125"
              style={{
                backgroundColor: STATUS_COLOR[project.status],
                boxShadow: `0 0 8px ${STATUS_COLOR[project.status]}`,
                // ring-Farbe per inline style, da Tailwind-Ring keine CSS-Var-Farbe pro Status kennt
                ["--tw-ring-color" as string]: "var(--border)",
              }}
              aria-hidden="true"
            />
            {!compact && (
              <span className="whitespace-nowrap rounded border border-border bg-surface px-2 py-1 font-mono text-[10px] text-foreground transition-colors group-hover:border-accent-dim group-focus-visible:border-accent">
                {project.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
