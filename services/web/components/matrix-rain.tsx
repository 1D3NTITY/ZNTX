import { HERO_FRAGMENTS } from "@/lib/hero-fragments";

function buildColumn(seed: number, length: number) {
  return Array.from(
    { length },
    (_, i) => HERO_FRAGMENTS[(seed + i * 7) % HERO_FRAGMENTS.length]
  );
}

// Wiederverwendbare Matrix-Rain — im Hero prominent (siehe hero-scene.tsx),
// als globaler Hintergrund sehr dezent (siehe global-matrix-background.tsx).
// Ein Effekt, ein Stil, zwei Intensitäten statt zwei unterschiedlicher
// Hintergrund-Systeme nebeneinander.
export function MatrixRain({
  columnCount = 16,
  baseOpacity = 0.3,
  slow = false,
}: {
  columnCount?: number;
  baseOpacity?: number;
  slow?: boolean;
}) {
  const columns = Array.from({ length: columnCount }, (_, i) => ({
    left: `${(i / columnCount) * 100 + (i % 3) * 1.5}%`,
    duration: (slow ? 34 : 14) + ((i * 7) % 11),
    delay: -((i * 3.7) % 14),
    seed: i * 5,
    opacity: baseOpacity + (i % 4) * (baseOpacity * 0.2),
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {columns.map((col, i) => {
        const tokens = buildColumn(col.seed, 8);
        return (
          <div
            key={i}
            className="hero-matrix-col absolute top-0 font-mono text-[11px] leading-[1.8] whitespace-nowrap"
            style={{
              left: col.left,
              opacity: col.opacity,
              animation: `matrix-fall ${col.duration}s linear infinite`,
              animationDelay: `${col.delay}s`,
            }}
          >
            {tokens.map((t, j) => (
              <div key={j}>{t}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
