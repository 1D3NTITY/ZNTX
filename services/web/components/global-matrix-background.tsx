"use client";

import { useEffect, useState } from "react";
import { MatrixRain } from "@/components/matrix-rain";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fixed, sehr dezent, hinter dem gesamten Seiteninhalt (z-index -1, wie zuvor
// das Dot-Grid) — ein durchgängiger Stil statt "Hero hat Matrix-Rain, Rest
// der Seite hat ein anderes Dot-Grid". Muss lesbar bleiben: Case-Studies/
// Kontaktformular haben keine eigene Karte, die den Hintergrund abschirmt,
// deshalb sehr niedrige Opazität + reduzierte Spaltenzahl gegenüber dem Hero.
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
      <MatrixRain columnCount={10} baseOpacity={0.05} slow />
    </div>
  );
}
