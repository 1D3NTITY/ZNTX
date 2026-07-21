import { HERO_FRAGMENTS } from "@/lib/hero-fragments";

function buildRow(seed: number, count: number) {
  const items = Array.from(
    { length: count },
    (_, i) => HERO_FRAGMENTS[(seed + i) % HERO_FRAGMENTS.length]
  );
  return items.join("   ·   ");
}

// Deutlich zurückhaltender als die erste Version (Referenz: qntx.zblt.eu,
// zblt.eu — beide halten ihren Hintergrund fast unlesbar leise, reine
// Textur statt Vordergrund-Konkurrenz). Nur 3 Zeilen, sehr niedrige Opazität,
// sehr langsam.
const ROWS = [
  { size: "text-sm", opacity: 0.05, duration: 140, direction: "left" as const, seed: 0 },
  { size: "text-xs", opacity: 0.04, duration: 110, direction: "right" as const, seed: 9 },
  { size: "text-base", opacity: 0.06, duration: 160, direction: "left" as const, seed: 18 },
];

// Rein dekorativ, aria-hidden — Text im Hero (hero.tsx) bleibt semantisch
// unabhängig davon.
export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center gap-16 py-10">
        {ROWS.map((row, i) => {
          const text = buildRow(row.seed, 9);
          return (
            <div
              key={i}
              className={`hero-textwall ${row.size}`}
              style={{
                opacity: row.opacity,
                animation: `marquee-${row.direction} ${row.duration}s linear infinite`,
              }}
            >
              {text}
              {"   ·   "}
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
