"use client";

import { useEffect, useRef } from "react";

// Echte Begriffe aus den Case-Studies dieser Seite — keine erfundenen Buzzwords (gleiches
// Prinzip wie die gelöschte lib/hero-fragments.ts). Neu zusammengestellt aus den aktuellen
// PROJECTS-Stacks (content.ts), inkl. buchhaltung/motortown, die seit der ersten Matrix-Rain-
// Version dazugekommen sind.
const TOKENS = [
  "FASTAPI", "NEXT.JS", "POSTGRES", "REDIS", "ALEMBIC", "N8N", "TELETHON",
  "TURNSTILE", "TUWUNEL", "ROCKSDB", "CADDY", "DISCORD.PY", "OAUTH2", "RCON",
  "PTERODACTYL", "DOCKER", "SYSTEMD", "WINE", "STEAMCMD", "UFW", "CCXT",
  "OPTUNA", "MISTRAL", "FASTBILL", "DSGVO", "ELSTER", "DRIZZLE", "GUARDRAIL",
  "KILL_SWITCH", "SSH", "MATRIX", "EU_AI_ACT",
];

type Column = {
  x: number;
  tokens: string[];
  y: number;
  speed: number;
  opacity: number;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// CSS color-mix() als Canvas-fillStyle wird von Chromium offenbar nicht zuverlässig mit der
// Transparenz-Prozentangabe ausgewertet (Bug gefunden bei der Verifikation: Text erschien bei
// vermeintlich 14% Opacity voll deckend) — direktes rgba() ist universell unterstützt und
// eindeutig. #rrggbb → {r,g,b}.
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

// Canvas-basierte Matrix-Rain (Redesign-Korrektur 2026-08-23 v3) — ersetzt die frühere DOM-Text-
// Knoten-Version (matrix-rain.tsx/global-matrix-background.tsx, gelöscht): die alte Version
// rendert jeden Token als echten <div>-Text-Knoten, Hunderte davon — das inflierte die Content-
// zu-Code-Ratio und tauchte 1:1 auch auf /robots.txt bzw. der 404-Seite auf (Review-Fund, siehe
// docs/decisions.md). Canvas-Inhalt ist kein DOM-Text — löst das strukturell, nicht nur
// kaschiert. Luis wollte den Effekt ausdrücklich zurück ("so dark spricht mich nicht an"),
// gleiche Intensität wie die alte Version (baseOpacity ~0.14, 16 Spalten, "slow").
export function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const accentHex =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ff1e3c";
    const { r, g, b } = hexToRgb(accentHex);
    const dpr = window.devicePixelRatio || 1;
    const fontSize = 12;
    const lineHeight = fontSize * 1.8;
    const columnCount = 16;
    let columns: Column[] = [];
    let width = 0;
    let height = 0;

    function buildColumns() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rows = Math.ceil(height / lineHeight) + 4;
      columns = Array.from({ length: columnCount }, (_, i) => {
        const seed = i * 5;
        return {
          x: (i / columnCount) * width + (i % 3) * 12,
          tokens: Array.from({ length: rows }, (_, r) => TOKENS[(seed + r * 7) % TOKENS.length]),
          y: Math.random() * height,
          // Etwas langsamer als ein "normales" Rain-Tempo — bewusst ruhig als Ambient-Layer,
          // gleiche Größenordnung wie die alte "slow"-Variante.
          speed: 0.15 + ((i * 7) % 11) * 0.02,
          opacity: 0.14 + (i % 4) * 0.14 * 0.2,
        };
      });
    }

    buildColumns();
    window.addEventListener("resize", buildColumns);

    let frame = 0;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx!.textBaseline = "top";
      const wrapHeight = height + lineHeight;
      for (const col of columns) {
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${col.opacity})`;
        col.tokens.forEach((token, r) => {
          const y = ((col.y + r * lineHeight) % wrapHeight) - lineHeight;
          ctx!.fillText(token, col.x, y);
        });
        col.y += col.speed;
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildColumns);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
