// Ersetzt den Matrix-Rain-Canvas (2026-08-28, Luis' expliziter Wunsch — mit Hinweis
// gegengecheckt, dass weiche Gradient-Blobs das häufigste Klischee-Muster aus der
// KI-Template-Recherche sind, bewusst trotzdem gewählt). Reines CSS statt Canvas/JS — ein paar
// große, verschwollene radial-gradient-Kreise in den Seiten-eigenen Akzenttönen (Orange/Rot/
// Dim), die langsam driften. Kein Partikel-/Canvas-Rendering nötig, günstiger als der vorherige
// Matrix-Rain (kein requestAnimationFrame-Loop, reine CSS-Animation).
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="aurora-blob aurora-blob-1"
        style={{ top: "-15%", left: "-10%", background: "var(--accent-orange)" }}
      />
      <div
        className="aurora-blob aurora-blob-2"
        style={{ bottom: "-20%", right: "-10%", background: "var(--accent)" }}
      />
      <div
        className="aurora-blob aurora-blob-3"
        style={{ top: "35%", left: "55%", background: "var(--accent-dim)" }}
      />
    </div>
  );
}
