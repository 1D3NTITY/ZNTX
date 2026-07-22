"use client";

import { useEffect, useState } from "react";

// Serverraum-Ambiente als gedämpfter Video-Loop — lizenzfrei (Mixkit/Pixabay,
// siehe docs/plans/portfolio-aufbau.md), noch kein Asset ausgewählt. Rendert
// bewusst nichts, solange /ambient-loop.mp4 nicht existiert — kein
// Broken-Media-Platzhalter. Datei einfach unter public/ablegen, sobald
// ausgewählt, kein Code-Änderung nötig.
const SRC = "/ambient-loop.mp4";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AmbientLoop() {
  const [available, setAvailable] = useState(false);
  const [reducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    fetch(SRC, { method: "HEAD" })
      .then((res) => setAvailable(res.ok))
      .catch(() => setAvailable(false));
  }, [reducedMotion]);

  if (!available || reducedMotion) return null;

  return (
    <video
      className="fixed inset-0 -z-10 h-full w-full object-cover opacity-[0.08] grayscale"
      src={SRC}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}
