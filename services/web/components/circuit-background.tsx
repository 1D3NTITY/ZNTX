import { CircuitCanvas } from "@/components/circuit-canvas";

// Signalraum-Hintergrund (2026-09-08, ersetzt das Leiterbahnen-Muster der Amber-CRT-Ära —
// explizit abgelehnt zusammen mit dem Rest der CRT-Kostümierung). CircuitCanvas übernimmt jetzt
// allein die bewegte Ebene (driftende Licht-Blobs + sparsames Punktraster mit
// Verbindungs-Pulsen, siehe dort) — die beiden statischen, unbewegten Lichtquellen unten bleiben
// bestehen: sie malen sofort beim ersten Server-Render (kein JS/Hydration nötig), bevor das
// Canvas überhaupt gemountet ist, und färben sich über --accent/--accent-dim automatisch mit dem
// Signalraum-Farbsystem ein.
export function CircuitBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
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
      <CircuitCanvas />
    </div>
  );
}
