"use client";

import { PROJECTS } from "@/lib/content";

const STATUS_COLOR: Record<string, string> = {
  live: "var(--accent)",
  "paper-trading": "var(--led-warn)",
  archived: "var(--foreground-muted)",
};

const UNITS = [
  ...PROJECTS.map((p, i) => ({
    ru: String(i + 1).padStart(2, "0"),
    id: `ru-${p.id}`,
    color: STATUS_COLOR[p.status],
  })),
  { ru: "08", id: "ru-operator", color: "var(--accent)" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Rack-Übersicht — ersetzt Sprungmarken-Navigation durch eine Belegungsleiste,
// die zeigt, welche Einheiten es gibt und in welchem Zustand sie sind.
export function RackOverview() {
  return (
    <nav
      aria-label="Rack-Übersicht"
      className="hidden lg:sticky lg:top-16 lg:flex lg:h-fit lg:w-16 lg:shrink-0 lg:flex-col lg:gap-2 lg:self-start"
    >
      {UNITS.map((u) => (
        <button
          key={u.id}
          type="button"
          onClick={() => scrollTo(u.id)}
          className="group flex items-center gap-2 rounded-sm border border-border bg-surface px-2 py-1.5 transition-colors hover:border-accent-dim"
          aria-label={`Zu Einheit RU-${u.ru} springen`}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: u.color }}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] text-foreground-muted group-hover:text-accent">
            {u.ru}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function RackOverviewMobile() {
  return (
    <nav
      aria-label="Rack-Übersicht"
      className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-6 py-2.5 backdrop-blur-sm lg:hidden"
    >
      {UNITS.map((u) => (
        <button
          key={u.id}
          type="button"
          onClick={() => scrollTo(u.id)}
          className="flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-2 py-1"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: u.color }}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] text-foreground-muted">RU-{u.ru}</span>
        </button>
      ))}
    </nav>
  );
}
