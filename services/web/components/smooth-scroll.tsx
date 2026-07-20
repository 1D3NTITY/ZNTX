"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  // Smooth Scroll ist reines Komfort-Extra — bei reduced-motion einfach nativen
  // Scroll durchreichen statt Lenis überhaupt zu initialisieren.
  if (reducedMotion) {
    return <>{children}</>;
  }

  return <ReactLenis root>{children}</ReactLenis>;
}
