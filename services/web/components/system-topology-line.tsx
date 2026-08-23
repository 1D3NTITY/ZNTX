"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

// Kein `useState` + `useEffect(() => setMounted(true), [])` — löst den ESLint-Regel
// react-hooks/set-state-in-effect aus (setState direkt/unconditional im Effect-Body gilt als
// Anti-Pattern, siehe react.dev/learn/you-might-not-need-an-effect). useSyncExternalStore ist
// die von React empfohlene Variante für "ist das der Client" ohne Extra-Render-Zyklus.
function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}
function useMounted() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

// Zentrale "Spine" durch die Systemliste (Redesign "Live Infrastructure Atlas", 2026-08-23) —
// ersetzt die reine Zeilenliste durch eine sichtbare Verbindung zwischen den Systemen. Bewusst
// KEIN bespokes Canvas/Partikel-Rendering mit exakt pixel-genauer Ausrichtung auf jeden Zeilen-
// Punkt (fragile Positionierung bei dynamischen Akkordeon-Höhen, siehe Plan-Entscheidung) —
// stattdessen das etablierte Motion-Muster "Lese-Fortschrittsbalken": eine statische, gedimmte
// Schiene über die volle Höhe plus ein Overlay, das beim Scrollen von oben nach unten einfärbt.
//
// Bug gefunden (Playwright-Verifikation, Redesign 2026-08-23): useScroll/useSpring/
// useReducedMotion sind clientseitig — SSR kann keinen sinnvollen Scroll-/Reduced-Motion-Wert
// kennen. Naives `reducedMotion ? A : B` direkt in der ersten Render-Passage führt zu einem
// echten React-Hydration-Mismatch (Server rendert einen anderen style-Wert als der erste
// Client-Render). Fix: das scroll-gekoppelte Overlay erst nach dem Mount rendern (gleiches
// Pattern wie global-matrix-background.tsx vorher für reduced-motion nutzte) — SSR zeigt nur
// die statische Schiene, deterministisch, kein Mismatch möglich.
export function SystemTopologyLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-px bg-border"
      />
      {mounted && (
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 w-px bg-accent"
          style={
            reducedMotion
              ? { height: "100%", boxShadow: "0 0 6px var(--accent)" }
              : {
                  height: "100%",
                  scaleY: smoothProgress,
                  transformOrigin: "top",
                  boxShadow: "0 0 6px var(--accent)",
                }
          }
        />
      )}
      <div className="relative pl-6">{children}</div>
    </div>
  );
}
