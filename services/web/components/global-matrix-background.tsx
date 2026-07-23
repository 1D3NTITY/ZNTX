"use client";

import { useEffect, useState } from "react";
import { MatrixRain } from "@/components/matrix-rain";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fixed, hinter dem gesamten Seiteninhalt (z-index -1) — ein durchgängiger
// Stil statt "Hero hat Matrix-Rain, Rest der Seite hat ein anderes Dot-Grid".
// Bewusst voller/präsenter als vorher (Feedback 2026-07-22: darf über den
// ganzen Bildschirm gehen) — mehr Spalten, etwas höhere Opazität. Bleibt
// unter der Hero-Intensität (0.3), damit Fließtext ohne eigene Karte
// (Case-Studies/Kontaktformular) lesbar bleibt. signature=true blendet
// "ZNTX" cryptisch in den Rain ein.
//
// Bug gefunden (Feedback 2026-07-22, "doppelt übereinander"): dieser Layer
// ist `fixed`, deckt also immer den ganzen Viewport ab — inklusive der
// Fläche, in der HeroScene (hero-scene.tsx) früher eine zweite, unabhängige
// Matrix-Rain in anderem Tempo gerendert hat. Ein per-vh-CSS-Mask-Ansatz
// (erste Version dieses Fixes) hat NICHT funktioniert: die Maske bezieht
// sich auf den Viewport, nicht auf die Scroll-Position, und hätte den Rain
// dadurch fast überall auf einen schmalen Streifen reduziert. Korrekter Fix:
// HeroScene rendert keine eigene Rain mehr (siehe hero-scene.tsx) — genau
// ein Layer, sitewide, konsistent.
//
// Zweiter Bug gefunden (Feedback 2026-07-23, "jetzt doppelt fast dreifach
// ineinander"): 26 Spalten bei 1440px Breite ≈ 55px Spaltenabstand — viele
// HERO_FRAGMENTS-Tokens (z. B. "PAPER_TRADING", "SCOPE_GUARD") sind bei
// 11px Mono aber 70-90px breit. Benachbarte Spalten haben sich dadurch
// horizontal überlappt, sah wie mehrere Layer übereinander aus (war aber
// immer nur der eine Layer aus dem ersten Fix). columnCount zurück auf 16
// (wie im alten Hero, dort nie als überlappend gemeldet) — Vertikal-Fülle
// kommt weiterhin über rows=60, nicht über mehr Spalten.
export function GlobalMatrixBackground() {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <MatrixRain columnCount={16} baseOpacity={0.14} slow signature rows={60} />
    </div>
  );
}
