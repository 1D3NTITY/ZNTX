import { HERO_FRAGMENTS } from "@/lib/hero-fragments";

function buildRow(seed: number, count: number) {
  const items = Array.from(
    { length: count },
    (_, i) => HERO_FRAGMENTS[(seed + i) % HERO_FRAGMENTS.length]
  );
  return items.join("   ·   ");
}

const ROWS = [
  { size: "text-lg", opacity: 0.45, duration: 75, direction: "left" as const, seed: 0 },
  { size: "text-sm", opacity: 0.28, duration: 55, direction: "right" as const, seed: 4 },
  { size: "text-2xl", opacity: 0.55, duration: 95, direction: "left" as const, seed: 9 },
  { size: "text-xs", opacity: 0.22, duration: 45, direction: "right" as const, seed: 14 },
  { size: "text-base", opacity: 0.35, duration: 65, direction: "left" as const, seed: 19 },
  { size: "text-sm", opacity: 0.25, duration: 60, direction: "right" as const, seed: 6 },
];

// Rein dekorativ, aria-hidden — Text im Hero (hero.tsx) bleibt semantisch
// unabhängig davon. Dichte, glitchende Text-Wand statt Grid+Scanline (Luis'
// Referenz: midjourney.com-Intro), hier mit echten Begriffen aus den
// Case-Studies statt erfundenem Content.
export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center gap-7 py-10">
        {ROWS.map((row, i) => {
          const text = buildRow(row.seed, 9);
          return (
            <div
              key={i}
              className={`hero-textwall ${row.size}`}
              style={{
                opacity: row.opacity,
                animation: `marquee-${row.direction} ${row.duration}s linear infinite, glitch-flicker ${6 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `0s, ${(i * 1.3) % 5}s`,
              }}
            >
              {text}
              {"   ·   "}
              {text}
            </div>
          );
        })}
      </div>
      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
