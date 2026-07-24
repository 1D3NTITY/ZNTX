"use client";

import { useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Eine Zeile im Live-Ops-Leitstand (Konzept A, 2026-07-24) — Button-Header
// (Punkt/Titel/Status/Kontext-Teaser) + aufklappbarer Inhalt. Ersetzt die
// bisherige Scroll-Navigation (dossier-nav.tsx/network-graph.tsx) komplett:
// die Zeilen SIND jetzt die Navigation.
export function DashboardRow({
  dotColor,
  title,
  meta,
  teaser,
  isOpen,
  onToggle,
  children,
}: {
  /** CSS-Farbwert für den Status-Punkt; undefined → neutraler Punkt. */
  dotColor?: string;
  title: string;
  meta?: string;
  teaser?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = useId();
  const reducedMotion = useReducedMotion();

  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-dim"
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: dotColor ?? "var(--foreground-muted)",
            boxShadow: dotColor ? `0 0 8px ${dotColor}` : "none",
          }}
        />
        <span className="font-serif text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </span>
        {meta && (
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
            {meta}
          </span>
        )}
        {teaser && (
          <span className="hidden flex-1 truncate text-sm text-foreground-muted sm:block">
            {teaser}
          </span>
        )}
        <span
          aria-hidden="true"
          className={`ml-auto font-mono text-sm text-foreground-muted transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
