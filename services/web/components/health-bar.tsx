import type { DaySegment } from "@/lib/uptime-history";

// Health-Bar (2026-09-17) — ersetzt die reine Prozent-Text-Zeile im Rack-Slot durch Tages-
// Segmente, wie bei Uptime Kuma selbst. Ein Segment pro committetem Tag, `flex-1` statt fester
// Breite: füllt den verfügbaren Platz gleichmäßig, egal wie viele Tage Historie schon vorliegen —
// wächst organisch mit, statt für neue Projekte eine erfundene Padding-Historie vorzutäuschen.
// Rein dekorativ (redundant zur `sr-only`-Prozentzahl am Aufrufort) — deshalb aria-hidden, die
// eigentliche Information bleibt für Screenreader in Textform erhalten.
const COLOR: Record<DaySegment["status"], string> = {
  up: "var(--status-online)",
  partial: "var(--status-paper)",
  down: "#f87171",
};

const LABEL: Record<DaySegment["status"], string> = {
  up: "ok",
  partial: "teilweise gestört",
  down: "down",
};

export function HealthBar({ segments }: { segments: DaySegment[] }) {
  if (segments.length === 0) return null;

  return (
    <span aria-hidden="true" className="flex min-w-0 flex-1 items-center gap-[2px]">
      {segments.map((s) => (
        <span
          key={s.date}
          title={`${s.date}: ${LABEL[s.status]}`}
          className="h-2.5 flex-1 rounded-[1px]"
          style={{ backgroundColor: COLOR[s.status] }}
        />
      ))}
    </span>
  );
}
