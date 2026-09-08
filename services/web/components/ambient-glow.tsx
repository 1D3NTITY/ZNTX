"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// Ambient-Glow (2026-09-08, ersetzt das frühere Amber-Phosphor-CRT-Overlay — Scanlines/
// Filmkorn/Vignette waren Teil der explizit abgelehnten CRT-Kostümierung und sind entfernt).
// Was bleibt: ein mausreaktives, weiches Licht über der gesamten Seite. Rein dekorativ:
// aria-hidden, pointer-events:none, keine Information, kein Fokusziel.
//
// Warum das Licht per CSS-Custom-Property statt über React-State läuft: Ein State-Update
// pro Mausbewegung würde bei jedem Pixel einen Re-Render der halben Seite auslösen. Stattdessen
// schreibt der Handler direkt zwei CSS-Variablen auf das Element — der Browser rechnet den
// Verlauf im Compositor, React wird gar nicht erst beteiligt. Zusätzlich per
// requestAnimationFrame gedrosselt, damit bei schnellen Bewegungen höchstens ein Schreibvorgang
// pro Frame passiert.
export function AmbientGlow() {
  const spotRef = useRef<HTMLDivElement>(null);
  // useSyncExternalStore statt einmaligem matchMedia-Read beim Mount (Accessibility-Audit
  // 2026-09-03: ein OS-seitiger Wechsel von Reduced-Motion mitten in der Session wurde vorher
  // ignoriert, bis zum nächsten Laden). Jetzt reagiert der Effect unten korrekt darauf.
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    // Bewegungsempfindliche Nutzer bekommen den ruhenden Lichtkegel aus der CSS-Media-Query,
    // kein cursor-getriebenes Wandern.
    if (reducedMotion) return;

    // Zeigergeräte-Prüfung: Auf Touch-Geräten gibt es keinen schwebenden Cursor, das Spotlight
    // bliebe dort einfach in der Mitte stehen — dann sparen wir uns die Listener komplett.
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = spotRef.current;
        if (!el) return;
        el.style.setProperty("--spot-x", `${(e.clientX / window.innerWidth) * 100}%`);
        el.style.setProperty("--spot-y", `${(e.clientY / window.innerHeight) * 100}%`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <div ref={spotRef} className="ambient-glow absolute inset-0" />
    </div>
  );
}
