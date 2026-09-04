"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// War vorher `useState(prefersReducedMotion)` mit einem einmaligen matchMedia-Read direkt beim
// ersten Render — derselbe Hydration-Mismatch-Bug, der in diesem Projekt schon dreimal gefunden
// und über useReducedMotionPreference() (lib/use-reduced-motion.ts) gefixt wurde, hier aber noch
// unentdeckt, weil er nur bei Besuchern mit aktiviertem Reduced-Motion auftritt: SSR rendert
// deterministisch mit false, ein Client-Erststand mit true hätte hier sogar den kompletten
// <ReactLenis>-Wrapper aus dem Baum entfernt statt nur ein Attribut zu ändern (finaler
// Release-Check, 2026-09-04, gefunden beim Durchgehen jeder Datei, nicht durch einen Repro).
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotionPreference();

  // Smooth Scroll ist reines Komfort-Extra — bei reduced-motion einfach nativen
  // Scroll durchreichen statt Lenis überhaupt zu initialisieren.
  if (reducedMotion) {
    return <>{children}</>;
  }

  return <ReactLenis root>{children}</ReactLenis>;
}
