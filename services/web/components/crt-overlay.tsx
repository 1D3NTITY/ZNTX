"use client";

import { useEffect, useRef } from "react";

// Amber-Phosphor-CRT-Overlay (2026-09-03) — legt Scanlines, Filmkorn, Vignette und ein
// mausreaktives Spotlight über die gesamte Seite. Alle Schichten sind rein dekorativ:
// aria-hidden, pointer-events:none, keine Information, kein Fokusziel.
//
// Warum das Spotlight per CSS-Custom-Property statt über React-State läuft: Ein State-Update
// pro Mausbewegung würde bei jedem Pixel einen Re-Render der halben Seite auslösen. Stattdessen
// schreibt der Handler direkt zwei CSS-Variablen auf das Element — der Browser rechnet den
// Verlauf im Compositor, React wird gar nicht erst beteiligt. Zusätzlich per
// requestAnimationFrame gedrosselt, damit bei schnellen Bewegungen höchstens ein Schreibvorgang
// pro Frame passiert.
export function CrtOverlay() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Zeigergeräte-Prüfung: Auf Touch-Geräten gibt es keinen schwebenden Cursor, das Spotlight
    // bliebe dort einfach in der Mitte stehen — dann sparen wir uns die Listener komplett.
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    // Bewegungsempfindliche Nutzer bekommen den ruhenden Lichtkegel aus der CSS-Media-Query,
    // kein cursor-getriebenes Wandern.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

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
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      {/* Reihenfolge = Schichtung: erst Licht, dann Röhrenstruktur, dann Korn, dann Randabfall. */}
      <div ref={spotRef} className="crt-spotlight absolute inset-0" />
      <div className="crt-scanlines absolute inset-0" />
      <div className="crt-grain absolute inset-0" />
      <div className="crt-vignette absolute inset-0" />
    </div>
  );
}
