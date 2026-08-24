import Link from "next/link";
import type { ReactNode } from "react";

// Karte im Projekt-Grid — verlinkt auf die eigene Projekt-Seite (2026-08-24), kein Inline-
// Aufklappen mehr. Grund: eine Karte, die sich über die volle Grid-Breite öffnet, verschiebt
// die Nachbarn (Reflow) — Luis hat das live als "verwirrend und unprofessionell" erlebt, per
// Recherche bestätigtes UX-Anti-Pattern (uxpatterns.dev-Accordion-Guideline). Grid bleibt jetzt
// beim Klick stabil, kein Zustand hier zu verwalten.
export function ProjectCard({
  href,
  dotColor,
  title,
  meta,
  liveBadge,
  teaser,
}: {
  href: string;
  dotColor?: string;
  title: string;
  meta?: string;
  liveBadge?: ReactNode;
  teaser?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border p-5 outline-none transition-colors hover:border-[var(--card-accent,var(--foreground-muted))] focus-visible:ring-2 focus-visible:ring-accent-dim"
      style={{ ["--card-accent" as string]: dotColor }}
    >
      <span className="flex w-full items-center gap-3">
        <span
          aria-hidden="true"
          className="h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: dotColor ?? "var(--foreground-muted)",
            boxShadow: dotColor ? `0 0 8px ${dotColor}` : "none",
          }}
        />
        <span className="min-w-0 flex-1 truncate font-sans text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-sm text-foreground-muted transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      {(meta || liveBadge) && (
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[1.375rem]">
          {meta && (
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {meta}
            </span>
          )}
          {liveBadge}
        </span>
      )}
      {teaser && (
        <span className="mt-1 block min-w-0 truncate pl-[1.375rem] text-sm text-foreground-muted">
          {teaser}
        </span>
      )}
    </Link>
  );
}
