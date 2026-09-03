import { OpsDashboard } from "@/components/ops-dashboard";
import { BootIntro } from "@/components/boot-intro";
import { PROJECTS } from "@/lib/content";
import { getProjectStatuses } from "@/lib/status";
import { formatSnapshotTime } from "@/lib/labels";

// Gleiche Zählweise wie in ops-dashboard.tsx: zntx selbst ist ein Meta-Eintrag und zählt nicht
// als betriebenes System mit (sonst widerspräche die Boot-Ausgabe der Headline "acht Systeme").
const REAL_SYSTEMS = PROJECTS.filter((p) => p.id !== "zntx");
const SYSTEMS_IN_OPERATION = REAL_SYSTEMS.filter((p) => p.status !== "archived").length;

// Diese Seite rendert pro Aufruf (dynamisch), weil die Status-Fetches bewusst ungecacht laufen
// — sonst würde eine ausgefallene Maschine weiter als "läuft" angezeigt (ausführliche
// Begründung in lib/status.ts). Die Last nach außen bleibt trotzdem gedeckelt: das Modul-Memo
// dort fragt die fünf Dienste höchstens einmal pro Minute an.
// Server Component: Live-Status wird hier server-seitig geholt (nicht per Client-Polling) —
// landet dadurch im initialen HTML, kein CORS, kein zusätzlicher Client-Bundle-Overhead. Siehe
// lib/status.ts für das Caching (Modul-Memo, 60s TTL) und Fallback-Verhalten bei Fehlschlägen.
export default async function Home() {
  const { statuses, fetchedAt } = await getProjectStatuses();
  const fetchedAtLabel = formatSnapshotTime(fetchedAt);
  return (
    <main className="flex flex-1 flex-col">
      {/* Statisches Server-Markup; sichtbar nur über die Klasse, die das Inline-Skript in
          layout.tsx vor dem ersten Bildaufbau setzt. */}
      <BootIntro
        systems={REAL_SYSTEMS.length}
        operational={SYSTEMS_IN_OPERATION}
        fetchedAtLabel={fetchedAtLabel}
      />
      <OpsDashboard statuses={statuses} fetchedAtLabel={fetchedAtLabel} />
    </main>
  );
}
