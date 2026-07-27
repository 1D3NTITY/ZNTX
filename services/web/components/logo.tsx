"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Persistente Marke oben links auf jeder Seite — kleine Decode-Reveal-Animation
// beim Laden (Zeichen bauen sich sequenziell auf), danach ruhiger blinkender
// Cursor statt Dauer-Animation.
const FULL = "zntx";

export function Logo() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (chars >= FULL.length) return;
    const t = setTimeout(() => setChars((c) => c + 1), 90);
    return () => clearTimeout(t);
  }, [chars]);

  return (
    // Immer zur Startseite (/), nicht #top — Bug: auf /impressum und
    // /datenschutz gibt es kein #top-Anker-Ziel, #top führte dort ins Leere
    // statt zurück zur eigentlichen Seite (Feedback 2026-07-27).
    <Link
      href="/"
      className="fixed left-4 top-4 z-40 rounded border border-border bg-background/70 px-2.5 py-1 font-mono text-sm font-semibold tracking-widest text-accent backdrop-blur-sm transition-colors hover:border-accent-dim"
    >
      {FULL.slice(0, chars)}
      <span className="animate-pulse">_</span>
    </Link>
  );
}
