"use client";

import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";

// Eine Karte im Projekt-Grid (Redesign 2026-08-23 v2 — Umbau von Linien-Liste zu Karten-Grid,
// siehe ops-dashboard.tsx). Button-Header (Punkt/Titel/Status/Live-Badge/Kontext-Teaser) +
// aufklappbarer Inhalt.
//
// Vorherige Version nutzte eine Topologie-Linie + Rand-Linien beim Öffnen — Feedback nach Live-
// Check: zu viele parallele Linien, Grid-Hintergrund + Linien-Optik las sich wie generische
// "AI-Slop"-Website-Bausteine (siehe Plan, Quellen: 925studios AI-Slop-Guide, Aceternity-UI-
// Grid-Komponenten als Negativbeispiel). Jetzt: eine Karte, ein Rahmen — im offenen Zustand
// wechselt der Rahmen zur jeweiligen Projekt-Akzentfarbe (dotColor) statt zum globalen
// --accent-Rot, das bleibt exklusiv für Bedienelemente.
export function DashboardRow({
  dotColor,
  title,
  meta,
  liveBadge,
  teaser,
  isOpen,
  onToggle,
  fullWidthWhenOpen = false,
  children,
}: {
  /** CSS-Farbwert für den Status-Punkt und den Karten-Rahmen im offenen Zustand; undefined → neutral. */
  dotColor?: string;
  title: string;
  meta?: string;
  /** Kompaktes Live-Status-Element, direkt auf der geschlossenen Karte sichtbar. */
  liveBadge?: ReactNode;
  teaser?: string;
  isOpen: boolean;
  onToggle: () => void;
  /** true innerhalb eines Grids: Karte spannt beim Öffnen über die volle Breite (sm:col-span-2). */
  fullWidthWhenOpen?: boolean;
  children: ReactNode;
}) {
  const panelId = useId();
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  // Bug gefunden (Feedback 2026-07-25, "Scrollen geht gefühlt garnicht mehr"):
  // Lenis (smooth-scroll.tsx) merkt sich die Dokumenthöhe und aktualisiert sie
  // nicht automatisch, wenn eine Zeile per Motion-Höhenanimation auf-/zuklappt
  // — die Seite wächst, aber Lenis' interne Scroll-Grenzen bleiben auf dem alten,
  // kürzeren Wert stehen. onUpdate hält Lenis während der Animation laufend
  // synchron, der Effect fängt den reduced-motion-Fall ab (da ohne Übergang kein
  // Animate-Frame feuert). Unverändert aus der Vorversion übernommen.
  useEffect(() => {
    const t = setTimeout(() => lenis?.resize(), reducedMotion ? 0 : 300);
    return () => clearTimeout(t);
  }, [isOpen, lenis, reducedMotion]);

  return (
    <div
      className={`rounded-lg border transition-colors ${fullWidthWhenOpen && isOpen ? "sm:col-span-2" : ""}`}
      style={{ borderColor: isOpen ? (dotColor ?? "var(--foreground-muted)") : "var(--border)" }}
    >
      {/* h2 umschließt den Button (WAI-ARIA-Accordion-Standardmuster) statt umgekehrt —
          Bug gefunden 2026-07-27: reine <span>-Titel hatten die Seite auf ein einziges <h1>
          reduziert, keine Überschriften-Struktur mehr. className="contents" nimmt dem h2
          seine eigene Box, ändert nichts am Layout. Unverändert aus der Vorversion. */}
      <h2 className="contents">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          // Ohne aria-label liest ein Screenreader Titel- und Teaser-<span> ohne Trennzeichen
          // als einen Lauftext vor ("Operator-ProfilWerdegang..." — Accessibility-Audit
          // 2026-09-03). Überschreibt den berechneten Namen mit einer sauber getrennten Version.
          aria-label={teaser ? `${title} — ${teaser}` : title}
          className="flex w-full flex-col gap-1 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-dim"
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
              className={`shrink-0 font-mono text-sm text-foreground-muted transition-transform duration-200 ${
                isOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </span>
          {(meta || liveBadge) && (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-[1.375rem]">
              {meta && (
                <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
                  {meta}
                </span>
              )}
              {liveBadge}
            </span>
          )}
          {teaser && (
            <span className="block min-w-0 truncate pl-[1.375rem] text-sm text-foreground-muted">
              {teaser}
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
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
