"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// Signalraum-Hintergrund (2026-09-08, ersetzt den Elektronenstrahl-Sweep + das Leiterbahnen-
// Muster der Amber-CRT-Ära). Zwei Schichten in einem Canvas: (1) zwei-drei weiche, langsam
// driftende Licht-Blobs in Violett/Cyan — "Licht als Material" statt Deko-Rauschen (Stripe-
// Prinzip aus der Recherche zu preisgekrönten Dark-Sites), (2) ein sehr sparsames, statisches
// Punktraster mit gelegentlichen, kurz aufleuchtenden Verbindungslinien zwischen ein paar festen
// Knotenpaaren — ehrliche Weiterführung der "Netzwerk/Infrastruktur"-Erzählung ohne wörtliche
// Leiterbahnen-/PCB-Bildsprache.
//
// Bewusst Canvas statt CSS-Ebenen: devicePixelRatio-scharfe Kanten, und die Draw-Calls hier
// (ein clearRect, drei Gradient-Kreise, ein paar hundert kleine fillRect-Punkte, eine Handvoll
// Linien) sind günstiger als mehrere animierte SVG-Ebenen. Gleiche Performance-Disziplin wie
// der vorherige Sweep: Pause bei nicht sichtbarem Tab, DPR-skaliert, reduced-motion liefert
// einen einzelnen statischen Frame.
const BLOBS = [
  { x: 0.22, y: 0.3, r: 0.5, secondary: false, speed: 0.00011, phase: 0 },
  { x: 0.78, y: 0.22, r: 0.42, secondary: true, speed: 0.00008, phase: 2.1 },
  { x: 0.5, y: 0.78, r: 0.46, secondary: false, speed: 0.0001, phase: 4.4 },
];
const GRID_SPACING = 96;
const DOT_ALPHA = 0.14;
// Ein paar feste Knotenpaare (relative Koordinaten) für die Verbindungs-Pulse — bewusst eine
// kleine, kuratierte Liste statt jedes Rasterpaar zu verbinden (sonst wirkt es wie ein
// generisches Partikelnetz statt ein paar gezielten Signalen).
const LINKS = [
  { ax: 0.16, ay: 0.2, bx: 0.28, by: 0.32, offset: 0 },
  { ax: 0.7, ay: 0.18, bx: 0.82, by: 0.28, offset: 1800 },
  { ax: 0.4, ay: 0.55, bx: 0.52, by: 0.66, offset: 3600 },
  { ax: 0.62, ay: 0.72, bx: 0.72, by: 0.82, offset: 5400 },
];
const LINK_INTERVAL_MS = 6500;
const LINK_DURATION_MS = 900;

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
    let dots: { x: number; y: number }[] = [];

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let x = GRID_SPACING / 2; x < width; x += GRID_SPACING) {
        for (let y = GRID_SPACING / 2; y < height; y += GRID_SPACING) {
          dots.push({ x, y });
        }
      }
    }

    function drawDots() {
      ctx!.fillStyle = `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${DOT_ALPHA})`;
      for (const d of dots) {
        ctx!.fillRect(d.x - 0.75, d.y - 0.75, 1.5, 1.5);
      }
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

    function drawLinks(elapsed: number) {
      for (const link of LINKS) {
        const cycle = (elapsed + link.offset) % LINK_INTERVAL_MS;
        if (cycle >= LINK_DURATION_MS) continue;
        const t = cycle / LINK_DURATION_MS;
        const alpha = (t < 0.5 ? t * 2 : (1 - t) * 2) * 0.5;
        ctx!.strokeStyle = `rgba(${secondary[0]}, ${secondary[1]}, ${secondary[2]}, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(link.ax * width, link.ay * height);
        ctx!.lineTo(link.bx * width, link.by * height);
        ctx!.stroke();
      }
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      drawBlobs(0);
      drawDots();
    }

    function drawFrame(elapsed: number) {
      ctx!.clearRect(0, 0, width, height);
      drawBlobs(elapsed);
      drawDots();
      drawLinks(elapsed);
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
