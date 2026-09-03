// Datenfluss-Ebene zwischen den beiden Racks (2026-09-03).
//
// Ehrlichkeitsregel wie überall im Projekt: Ein wandernder Puls wird NUR für Verbindungen
// gezeigt, deren System tatsächlich erreichbar ist (echter Live-Status). Systeme ohne
// Live-Daten — abgeschaltete Gameserver, archivierte Projekte, nicht erreichbare Dienste —
// bekommen eine matte, stehende Linie. Die Animation behauptet damit nichts, was nicht stimmt,
// sondern zeigt den tatsächlichen Zustand.
//
// Reines SVG + CSS (stroke-dashoffset), keine zusätzliche Bibliothek. Die Ebene ist rein
// dekorativ: aria-hidden, pointer-events:none, sämtliche Information steht daneben im Klartext.
export function FlowLines({ activeCount }: { activeCount: number }) {
  // Mehr Pulse als erreichbare Systeme wären eine Behauptung; weniger als einer wäre eine
  // leere Grafik. Deckel bei 4, damit die Ebene ruhig bleibt.
  const pulses = Math.min(Math.max(activeCount, 0), 4);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ zIndex: 0 }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Ruhende Grundleitungen — immer sichtbar, auch ohne Live-Daten. */}
        <g stroke="var(--accent)" strokeOpacity="0.16" strokeWidth="0.25">
          <path d="M46 22 H54" />
          <path d="M46 46 H54" />
          <path d="M46 70 H54" />
          <path d="M50 22 V70" />
        </g>

        {/* Wandernde Pulse — Anzahl entspricht den tatsächlich erreichbaren Systemen. */}
        <g stroke="var(--accent-core)" strokeWidth="0.5" strokeLinecap="round">
          {Array.from({ length: pulses }).map((_, i) => (
            <path
              key={i}
              className="flow-pulse"
              d={
                i % 2 === 0
                  ? "M46 22 H54 V70 H46"
                  : "M54 70 H46 V22 H54"
              }
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
