"use client";

import { useEffect, useState } from "react";
import { PROJECTS } from "@/lib/content";

const ACTIVE_COUNT = PROJECTS.filter((p) => p.status !== "archived").length;

const LINES = [
  { t: "00:00.14", text: "establishing connection..." },
  { t: "00:00.61", text: "loading systems dossier..." },
  { t: "00:01.02", text: `${ACTIVE_COUNT} aktive Knoten, ${PROJECTS.length - ACTIVE_COUNT} archiviert` },
];

const CHAR_MS = 18;
const LINE_PAUSE_MS = 260;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Boot-Sequenz vor dem eigentlichen Hero-Inhalt — Referenz: qntx.zblt.eu
// (Terminal-Zeilen mit Timestamps, aktuelle Zeile tippt sich Zeichen für
// Zeichen). War im ursprünglichen Plan vorgesehen, bisher nie gebaut.
export function BootSequence({ onDone }: { onDone: () => void }) {
  const [skip] = useState(prefersReducedMotion);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    if (lineIndex >= LINES.length) {
      const t = setTimeout(onDone, LINE_PAUSE_MS);
      return () => clearTimeout(t);
    }
    const current = LINES[lineIndex].text;
    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, charIndex, skip]);

  if (skip) return null;

  return (
    <div className="flex flex-col gap-1 font-mono text-xs text-foreground-muted">
      {LINES.slice(0, lineIndex).map((line) => (
        <div key={line.t}>
          <span className="text-accent">{line.t}</span> {"> "}
          {line.text}
        </div>
      ))}
      {lineIndex < LINES.length && (
        <div>
          <span className="text-accent">{LINES[lineIndex].t}</span> {"> "}
          {LINES[lineIndex].text.slice(0, charIndex)}
          <span className="animate-pulse">_</span>
        </div>
      )}
    </div>
  );
}
