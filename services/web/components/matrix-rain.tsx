import { HERO_FRAGMENTS } from "@/lib/hero-fragments";

// Versteckte Signatur, die in genau einer Spalte statt Zufalls-Tokens fällt —
// "eigenes Logo cryptisch in der Matrix" (Feedback 2026-07-22). Bleibt Teil
// des normalen Falls (kein eigenes Transform nötig), sticht nur per
// Glitch-Klasse periodisch hervor.
const SIGNATURE = ["Z", "N", "T", "X"] as const;

function buildColumn(seed: number, length: number, signatureAt?: number) {
  return Array.from({ length }, (_, i) => {
    if (
      signatureAt !== undefined &&
      i >= signatureAt &&
      i < signatureAt + SIGNATURE.length
    ) {
      return { text: SIGNATURE[i - signatureAt], glitch: true };
    }
    return {
      text: HERO_FRAGMENTS[(seed + i * 7) % HERO_FRAGMENTS.length],
      glitch: false,
    };
  });
}

// Wiederverwendbare Matrix-Rain — im Hero prominent (siehe hero-scene.tsx),
// als globaler Hintergrund jetzt ebenfalls vollflächig sichtbar (siehe
// global-matrix-background.tsx). Ein Effekt, ein Stil, unterschiedliche
// Intensitäten statt zwei unterschiedlicher Hintergrund-Systeme nebeneinander.
export function MatrixRain({
  columnCount = 16,
  baseOpacity = 0.3,
  slow = false,
  signature = false,
  rows = 8,
}: {
  columnCount?: number;
  baseOpacity?: number;
  slow?: boolean;
  signature?: boolean;
  // Zeilen pro Spalte. translateY(±110%) im matrix-fall-Keyframe bezieht sich
  // auf die eigene Höhe der Spalte, nicht auf den Viewport — bei nur 8 Zeilen
  // (Hero-Default) bleibt der Rain daher auf ein kleines Band nahe top:0
  // begrenzt. Für einen wirklich vollflächigen Hintergrund (global-matrix-
  // background.tsx) braucht die Spalte selbst genug Zeilen, um den Viewport
  // zu füllen (Bug gefunden 2026-07-22, Feedback "über ganzen Bildschirm").
  rows?: number;
}) {
  const signatureColumn = Math.floor(columnCount / 2);
  const columns = Array.from({ length: columnCount }, (_, i) => ({
    left: `${(i / columnCount) * 100 + (i % 3) * 1.5}%`,
    duration: (slow ? 34 : 14) + ((i * 7) % 11),
    delay: -((i * 3.7) % 14),
    seed: i * 5,
    opacity: baseOpacity + (i % 4) * (baseOpacity * 0.2),
  }));
  const signatureAt = Math.max(2, Math.floor(rows / 2) - 2);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {columns.map((col, i) => {
        const isSignature = signature && i === signatureColumn;
        const tokens = buildColumn(col.seed, rows, isSignature ? signatureAt : undefined);
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
              <div
                key={j}
                className={t.glitch ? "matrix-signature-glyph" : undefined}
                style={t.glitch ? { animationDelay: `${j * 0.3}s` } : undefined}
              >
                {t.text}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
