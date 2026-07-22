// Großformatige, halbtransparente Sektionsnummer als Hintergrund-Typografie —
// bricht die sonst identische Kicker+H2-Struktur jeder Section optisch auf,
// ohne neue Assets zu brauchen (reines Typografie-Element aus echten Daten,
// keine Dekoration ohne Bedeutung).
export function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-4 right-0 select-none font-serif text-7xl font-bold leading-none text-foreground/[0.05] sm:-top-8 sm:text-9xl"
    >
      {n}
    </span>
  );
}
