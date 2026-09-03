// Leiterbahnen-Hintergrund (2026-09-03) — ersetzt die vorherigen Aurora-Gradient-Blobs.
//
// Grund für den Austausch statt Ergänzung: Die Blobs waren erklärtermaßen das häufigste
// Klischee-Muster aus der KI-Vorlagen-Recherche und trugen inhaltlich nichts. Leiterbahnen
// erzählen dagegen dasselbe wie der Rest der Seite (Maschinen, Verbindungen). Und es bleibt
// bei zwei bewegten Ebenen statt vier — die Seite trägt bereits Scanlines, Korn, Vignette und
// ein mausreaktives Spotlight; noch mehr Animation übereinander würde auf schwacher Hardware
// ruckeln.
//
// Alles im Code erzeugt (inline-SVG-Muster als data:-URI, siehe .circuit-layer in globals.css):
// auflösungsunabhängig scharf, keine externen Requests, keine Lizenzfrage, einzigartig für
// diese Seite.
export function CircuitBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      {/* Zwei ruhende Lichtquellen für Tiefe — bewusst ohne eigene Animation, damit die
          bewegten Ebenen darüber nicht mit ihnen konkurrieren. */}
      <div
        className="absolute rounded-full"
        style={{
          top: "-20%",
          left: "-10%",
          width: "70vw",
          height: "70vw",
          background: "var(--accent)",
          filter: "blur(120px)",
          opacity: 0.07,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-25%",
          right: "-15%",
          width: "60vw",
          height: "60vw",
          background: "var(--accent-dim)",
          filter: "blur(140px)",
          opacity: 0.1,
        }}
      />
      {/* Zwei Leiterbahn-Ebenen unterschiedlicher Größe/Geschwindigkeit → Parallaxe-Andeutung.
          Beide laufen über die globale prefers-reduced-motion-Regel automatisch still. */}
      <div className="circuit-layer circuit-far" />
      <div className="circuit-layer circuit-near" />
    </div>
  );
}
