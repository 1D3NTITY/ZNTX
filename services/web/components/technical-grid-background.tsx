// Ersetzt global-matrix-background.tsx (Redesign "Live Infrastructure Atlas", 2026-08-23).
// Vorheriger Matrix-Rain-Hintergrund rendert Hunderte echte DOM-Text-Knoten (Review-Fund:
// beeinflusst Content-zu-Code-Ratio für SEO, taucht 1:1 auch auf der 404-Seite auf, sichtbar via
// /robots.txt). Dieser Hintergrund ist reines CSS (.technical-grid, siehe globals.css) — keine
// Textknoten, kein aria-hidden nötig, weil es schlicht nichts zu verstecken gibt.
export function TechnicalGridBackground() {
  return <div aria-hidden="true" className="technical-grid pointer-events-none fixed inset-0 -z-10" />;
}
