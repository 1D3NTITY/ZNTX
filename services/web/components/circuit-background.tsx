import { CircuitCanvas } from "@/components/circuit-canvas";

// Leiterbahnen-Hintergrund (2026-09-03) — ersetzt die vorherigen Aurora-Gradient-Blobs.
//
// Grund für den Austausch statt Ergänzung: Die Blobs waren erklärtermaßen das häufigste
// Klischee-Muster aus der KI-Vorlagen-Recherche und trugen inhaltlich nichts. Leiterbahnen
// erzählen dagegen dasselbe wie der Rest der Seite (Maschinen, Verbindungen).
//
// Update 2026-09-04: ursprünglich bewusst bei zwei bewegten Ebenen belassen (Performance auf
// schwacher Hardware, die Seite trägt bereits Scanlines/Korn/Vignette/Spotlight). Mit
// CircuitCanvas (siehe unten) kommt jetzt eine dritte dazu — Luis' explizite Entscheidung, für
// den "omfg"-Faktor die Optik-Zurückhaltung aufzugeben. Die Sorgfalt bleibt aber: die neue Ebene
// ist bewusst günstig gehalten (siehe circuit-canvas.tsx), kein Ersatz der Perf-Disziplin.
//
// Alles im Code erzeugt (inline-SVG-Muster als data:-URI, siehe .circuit-layer in globals.css):
// auflösungsunabhängig scharf, keine externen Requests, keine Lizenzfrage, einzigartig für
// diese Seite.
//
// CircuitCanvas (2026-09-04, Luis: "hochauflösende Grafiken, glitch, omfg-Faktor") kommt als
// dritte, aber deutlich günstigere Ebene dazu (Canvas statt einer weiteren SVG-Ebene) — malt
// oberhalb der beiden flachen SVG-Ebenen, aber weiterhin innerhalb desselben -z-10-Containers,
// nie über echtem Text. Siehe circuit-canvas.tsx für die Begründung/Performance-Absicherung.
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
      <CircuitCanvas />
    </div>
  );
}
