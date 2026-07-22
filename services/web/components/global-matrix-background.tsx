"use client";

import { useEffect, useState } from "react";
import { MatrixRain } from "@/components/matrix-rain";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fixed, sehr dezent, hinter dem gesamten Rack (z-index -1). Deutlich
// zurückhaltender als die Power-On-Sequenz-Variante — Case-Studies/
// Betriebsparameter/Patch-Panel haben keine eigene abschirmende Karte,
// deshalb niedrige Opazität + wenige Spalten.
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
