"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// Signalraum-Hintergrund (2026-09-08, ersetzt den Elektronenstrahl-Sweep + das Leiterbahnen-
// Muster der Amber-CRT-Ära). Zwei Schichten in einem Canvas: (1) zwei-drei weiche, langsam
// driftende Licht-Blobs in Violett/Cyan — "Licht als Material" statt Deko-Rauschen (Stripe-
// Prinzip aus der Recherche zu preisgekrönten Dark-Sites), (2) ein sparsamer Zeichenregen-Akzent
// (2026-09-10, ersetzt das vorherige Punktraster+Verbindungslinien — Luis' expliziter Wunsch
// nach "Matrix"-Anklang, konkret an der qntx-Login-Seite https://qntx.zblt.eu/ orientiert, aber
// bewusst NICHT 1:1 kopiert: deutlich sparsamer als das dichte Referenzbild, in beiden
// Signalraum-Tönen statt nur Cyan, damit es nach zntx aussieht statt nach einer Kopie).
//
// Bewusst Canvas statt CSS-Ebenen: devicePixelRatio-scharfe Kanten, und die Draw-Calls hier
// (ein clearRect, drei Gradient-Kreise, eine Handvoll fillText-Aufrufe pro Spalte) sind
// günstiger als mehrere animierte SVG-Ebenen. Gleiche Performance-Disziplin wie vorher: Pause
// bei nicht sichtbarem Tab, DPR-skaliert, reduced-motion liefert einen einzelnen statischen
// Frame. Positionen sind reine Funktionen von `elapsed` (kein mutierter Zustand pro Frame,
// gleiches Muster wie die Blobs) — Rasterlogik und Zeichen-Wechsel laufen deterministisch aus
// der verstrichenen Zeit statt aus gespeichertem State.
const BLOBS = [
  { x: 0.22, y: 0.3, r: 0.5, secondary: false, speed: 0.00011, phase: 0 },
  { x: 0.78, y: 0.22, r: 0.42, secondary: true, speed: 0.00008, phase: 2.1 },
  { x: 0.5, y: 0.78, r: 0.46, secondary: false, speed: 0.0001, phase: 4.4 },
];

// Sparsam gehalten (11 Spalten) — das Referenzbild füllt die komplette Fläche dicht, das wäre
// hier wieder das Klischee, das der Signalraum-Wechsel bewusst verlassen hat.
const RAIN_COLUMNS = [
  { x: 0.05, speed: 0.085, phase: 0, secondary: false },
  { x: 0.13, speed: 0.062, phase: 900, secondary: true },
  { x: 0.22, speed: 0.098, phase: 1800, secondary: false },
  { x: 0.31, speed: 0.071, phase: 2700, secondary: false },
  { x: 0.42, speed: 0.089, phase: 3600, secondary: true },
  { x: 0.58, speed: 0.076, phase: 4500, secondary: false },
  { x: 0.67, speed: 0.093, phase: 5400, secondary: false },
  { x: 0.76, speed: 0.065, phase: 6300, secondary: true },
  { x: 0.85, speed: 0.081, phase: 7200, secondary: false },
  { x: 0.92, speed: 0.07, phase: 8100, secondary: false },
  { x: 0.97, speed: 0.09, phase: 9000, secondary: true },
];
const RAIN_CHARS = "01{}<>/\\+-=*#$%&";
const RAIN_TRAIL = 6;
const RAIN_ROW_HEIGHT = 18;
const RAIN_CHAR_SIZE = 14;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function CircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const style = getComputedStyle(document.documentElement);
    const accent = hexToRgb(style.getPropertyValue("--accent").trim() || "#9b5cff");
    const secondary = hexToRgb(style.getPropertyValue("--accent-secondary").trim() || "#4fd3ff");

    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawBlobs(elapsed: number) {
      for (const b of BLOBS) {
        const dx = Math.sin(elapsed * b.speed + b.phase) * 0.1;
        const dy = Math.cos(elapsed * b.speed * 1.2 + b.phase) * 0.08;
        const cx = (b.x + dx) * width;
        const cy = (b.y + dy) * height;
        const r = b.r * Math.max(width, height);
        const [cr, cg, cb] = b.secondary ? secondary : accent;
        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.13)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, width, height);
      }
    }

    function drawRain(elapsed: number) {
      ctx!.font = `${RAIN_CHAR_SIZE}px ui-monospace, monospace`;
      ctx!.textBaseline = "top";
      const span = height + RAIN_TRAIL * RAIN_ROW_HEIGHT;
      for (const col of RAIN_COLUMNS) {
        const headY = ((elapsed * col.speed + col.phase) % span) - RAIN_TRAIL * RAIN_ROW_HEIGHT;
        const [cr, cg, cb] = col.secondary ? secondary : accent;
        const x = col.x * width;
        for (let i = 0; i < RAIN_TRAIL; i++) {
          const y = headY - i * RAIN_ROW_HEIGHT;
          if (y < -RAIN_ROW_HEIGHT || y > height) continue;
          const alpha = (1 - i / RAIN_TRAIL) * 0.45;
          const charIndex = Math.floor(elapsed / 220 + i * 3 + col.phase) % RAIN_CHARS.length;
          ctx!.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
          ctx!.fillText(RAIN_CHARS[charIndex], x, y);
        }
      }
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      drawBlobs(0);
      drawRain(0);
    }

    function drawFrame(elapsed: number) {
      ctx!.clearRect(0, 0, width, height);
      drawBlobs(elapsed);
      drawRain(elapsed);
    }

    resize();

    let resizeFrame = 0;
    function onResize() {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
        if (reducedMotion) drawStatic();
      });
    }
    window.addEventListener("resize", onResize);

    if (reducedMotion) {
      drawStatic();
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let running = true;
    const start = performance.now();
    function loop(now: number) {
      if (!running) return;
      drawFrame(now - start);
      raf = requestAnimationFrame(loop);
    }
    // Pause bei nicht sichtbarem Tab — kein IntersectionObserver nötig, das Canvas ist
    // `fixed inset-0` und damit per Definition immer im Viewport.
    function onVisibility() {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
