"use client";

import { useSyncExternalStore } from "react";

// Geteilter Hook (2026-09-03) — vorher existierte dieselbe matchMedia("(prefers-reduced-motion:
// reduce)")-Abfrage dreifach unabhängig (live-terminal.tsx, crt-overlay.tsx, Inline-Skript in
// layout.tsx), zwei davon sogar mit unterschiedlichem Verhalten: crt-overlay.tsx las den Wert
// nur einmalig beim Mount und reagierte nicht auf einen OS-seitigen Wechsel mitten in der
// Session (Accessibility-Audit-Nebenbefund). useSyncExternalStore liest den Wert synchron beim
// ersten Render UND abonniert Änderungen — dadurch bleibt der Zustand über die ganze Sitzung
// korrekt, ohne eigenen Effect+setState-Umweg (der wiederum die im Projekt bereits bekannte
// react-hooks/set-state-in-effect-Falle wäre).
//
// getServerSnapshot liefert bewusst `false`: SSR kennt die Client-Präferenz nicht, ein
// abweichender Wert würde sonst zum Hydration-Mismatch führen (in diesem Projekt bereits
// zweimal aufgetreten). Die echte Präferenz greift dann im ersten Update nach dem Mount.
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerSnapshot = () => false;

export function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
