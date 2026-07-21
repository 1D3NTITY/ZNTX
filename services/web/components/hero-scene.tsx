import { HERO_FRAGMENTS } from "@/lib/hero-fragments";

// Echte vertikale Matrix-Rain statt horizontalem Ticker (der war weder als
// "Matrix" erkennbar noch bei ausreichend Kontrast sichtbar — Feedback:
// "kein matrix alike hintergrund in einem Stil"). Spalten aus echten Tokens
// (lib/hero-fragments.ts), Cyan-Akzent, deutlich sichtbar aber hinter dem
// Scrim-Panel im Hero-Text unterlegen.
function buildColumn(seed: number, length: number) {
  return Array.from(
    { length },
    (_, i) => HERO_FRAGMENTS[(seed + i * 7) % HERO_FRAGMENTS.length]
  );
}

const COLUMN_COUNT = 16;

const COLUMNS = Array.from({ length: COLUMN_COUNT }, (_, i) => ({
  left: `${(i / COLUMN_COUNT) * 100 + (i % 3) * 1.5}%`,
  duration: 14 + ((i * 7) % 11),
  delay: -((i * 3.7) % 14),
  seed: i * 5,
  opacity: 0.22 + ((i % 4) * 0.06),
}));

export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {COLUMNS.map((col, i) => {
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
      <div className="hero-matrix-mask absolute inset-0" />
    </div>
  );
}
