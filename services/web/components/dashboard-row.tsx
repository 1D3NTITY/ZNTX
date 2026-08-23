"use client";

import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";

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
  const lenis = useLenis();

  // Bug gefunden (Feedback 2026-07-25, "Scrollen geht gefühlt garnicht mehr"):
  // Lenis (smooth-scroll.tsx) merkt sich die Dokumenthöhe und aktualisiert sie
  // nicht automatisch, wenn eine Zeile per Motion-Höhenanimation auf-/zuklappt
  // — die Seite wächst (z. B. 1192px → 2470px beim Öffnen), aber Lenis' interne
  // Scroll-Grenzen bleiben auf dem alten, kürzeren Wert stehen. Ergebnis: der
  // Nutzer hängt fest, sobald irgendeine Zeile offen ist — also praktisch immer,
  // das ist ja die Kerninteraktion dieser Seite. onUpdate hält Lenis während der
  // Animation laufend synchron, der Effect fängt den reduced-motion-Fall ab (da
  // ohne Übergang kein Animate-Frame feuert).
  useEffect(() => {
    const t = setTimeout(() => lenis?.resize(), reducedMotion ? 0 : 300);
    return () => clearTimeout(t);
  }, [isOpen, lenis, reducedMotion]);

  return (
    <div className="border-t border-border first:border-t-0">
      {/* Zwei feste Zeilen statt einer einzigen wrap-Flex-Reihe (Bug gefunden
          2026-07-25, Feedback "unsauber ... Zeilenumbruch"): Titel + Toggle
          waren in derselben Flex-Zeile wie Meta/Teaser, bei langen Titeln
          (z. B. "WCP / Arma-Community-Server") brach das mittendrin um und
          der Toggle sprang auf eine eigene Zeile. Jetzt: Titel-Zeile bricht
          nie, Meta/Teaser stehen fest darunter, Meta selbst nowrap. */}
      {/* h2 umschließt den Button (WAI-ARIA-Accordion-Standardmuster) statt
          umgekehrt — Bug gefunden 2026-07-27: die 8 Zeilen-Titel waren reine
          <span>, dadurch gab es auf der ganzen Seite nur noch ein einziges
          <h1> und keine Überschriften-Struktur mehr (SEO-/Screenreader-
          Regression durch den Dashboard-Umbau). className="contents" nimmt
          dem h2 seine eigene Box, ändert also nichts am Layout. */}
      <h2 className="contents">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`flex w-full flex-col gap-1 py-5 pl-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-dim ${
            isOpen ? "border-l-2 border-accent" : "border-l-2 border-transparent"
          }`}
        >
          <span className="flex w-full items-center gap-3">
            {/* Knoten-Marker statt reinem Punkt (Redesign 2026-08-23) — Ring +
                Glow, docked-an-die-Topologie-Linie-Optik statt Akkordeon-Bullet. */}
            <span
              aria-hidden="true"
              className="relative h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
              style={{
                backgroundColor: dotColor ?? "var(--foreground-muted)",
                boxShadow: dotColor ? `0 0 10px ${dotColor}` : "none",
                ["--tw-ring-color" as string]: dotColor
                  ? `color-mix(in srgb, ${dotColor} 40%, transparent)`
                  : "var(--border)",
              }}
            />
            <span className="min-w-0 flex-1 truncate font-sans text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </span>
            <span
              aria-hidden="true"
              className={`shrink-0 font-mono text-sm text-foreground-muted transition-transform duration-200 ${
                isOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </span>
          {(meta || teaser) && (
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 pl-[1.375rem]">
              {meta && (
                <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted sm:whitespace-nowrap">
                  {meta}
                </span>
              )}
              {teaser && (
                <span className="hidden min-w-0 flex-1 truncate text-sm text-foreground-muted sm:block">
                  {teaser}
                </span>
              )}
            </span>
          )}
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
            onUpdate={() => lenis?.resize()}
            className="overflow-hidden"
          >
            {/* Scanline-Rahmen statt reinem Akkordeon-Look (Redesign 2026-08-23) —
                Optik einer aufgeklappten technischen Konsole, Mechanik unverändert. */}
            <div className="technical-grid ml-4 border-l-2 border-accent-dim pb-8 pl-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
