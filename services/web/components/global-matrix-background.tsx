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
      <MatrixRain columnCount={26} baseOpacity={0.1} slow signature rows={60} />
    </div>
  );
}
