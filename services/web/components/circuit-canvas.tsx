"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// Elektronenstrahl-Sweep (2026-09-04, Luis: "richtig krass, hochauflösende Grafiken, omfg-
// Faktor") — ein von oben nach unten wandernder, verblassender Amber-Leuchtbalken (CRT-
// Elektronenstrahl-Metapher, bleibt an der bestehenden Phosphor-Röhren-Erzählung statt ein
// beliebiges Partikel-Gimmick zu sein), plus gelegentliche kurze Glow-Blips an ein paar festen
// Knotenpunkten (echoing die Lötpunkte im bestehenden Leiterbahnmuster in globals.css).
//
// Bewusst Canvas statt einer weiteren CSS-Ebene: devicePixelRatio-genaue, wirklich scharfe
// Kanten ("hochauflösend") statt noch einer CSS-Verlaufsebene, und die Draw-Calls hier (ein
// clearRect, ein Gradient-Rechteck, ein paar kleine Radial-Gradients) sind günstiger als eine
// dritte animierte SVG-Ebene. circuit-background.tsx begründet die bisherige Begrenzung auf
// zwei bewegte Ebenen mit Performance auf schwacher Hardware — dieser Layer kommt trotzdem
// dazu (Luis' explizite "voll reingehen"-Entscheidung), bleibt aber an dieselbe Sorgfalt
// gebunden: sehr günstige Draw-Operationen, Pause bei nicht sichtbarem Tab.
//
// SSR rendert das <canvas> unbedingt in fester CSS-Größe (inset-0 h-full w-full) — kein
// Layout-Shift unabhängig von Hydration-Timing. Erst nach dem Mount wird die Backing-Store-
// Größe an devicePixelRatio angepasst und gezeichnet.
const NODES = [
  { x: 0.12, y: 0.22, offset: 0 },
  { x: 0.82, y: 0.16, offset: 1400 },
  { x: 0.34, y: 0.58, offset: 2800 },
  { x: 0.68, y: 0.74, offset: 4200 },
  { x: 0.5, y: 0.9, offset: 5600 },
];
const SWEEP_DURATION_MS = 9000;
const TRAIL_HEIGHT = 160;
const BLIP_INTERVAL_MS = 7000;
const BLIP_DURATION_MS = 350;
const BLIP_RADIUS = 26;

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

    // Farbe einmalig aus dem echten Design-Token lesen statt eine zweite Amber-Zahl hart zu
    // codieren — Canvas-Gradient-Stops können CSS-Custom-Properties (var(--accent-core)) nicht
    // auflösen, deshalb hier per getComputedStyle als RGB-Tripel übernommen.
    const [ar, ag, ab] = hexToRgb(
      getComputedStyle(document.documentElement).getPropertyValue("--accent-core") || "#ffe9c7",
    );

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

    function drawSweep(y: number) {
      const grad = ctx!.createLinearGradient(0, y - TRAIL_HEIGHT, 0, y);
      grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0)`);
      grad.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, 0.16)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, y - TRAIL_HEIGHT, width, TRAIL_HEIGHT);
    }

    function drawBlip(x: number, y: number, alpha: number) {
      const grad = ctx!.createRadialGradient(x, y, 0, x, y, BLIP_RADIUS);
      grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${0.5 * alpha})`);
      grad.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(x - BLIP_RADIUS, y - BLIP_RADIUS, BLIP_RADIUS * 2, BLIP_RADIUS * 2);
    }

    // Ruhender Einzelframe für prefers-reduced-motion und als erster Frame vor dem RAF-Start —
    // Sweep-Balken auf halber Bahn eingefroren, keine Blips (die wären per Definition Bewegung).
    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      drawSweep((height + TRAIL_HEIGHT) * 0.5);
    }

    function drawFrame(elapsed: number) {
      ctx!.clearRect(0, 0, width, height);
      const sweepY = ((elapsed % SWEEP_DURATION_MS) / SWEEP_DURATION_MS) * (height + TRAIL_HEIGHT);
      drawSweep(sweepY);
      for (const node of NODES) {
        const cycle = (elapsed + node.offset) % BLIP_INTERVAL_MS;
        if (cycle < BLIP_DURATION_MS) {
          const t = cycle / BLIP_DURATION_MS;
          const alpha = t < 0.5 ? t * 2 : (1 - t) * 2;
          drawBlip(node.x * width, node.y * height, alpha);
        }
      }
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
