import { OpsDashboard } from "@/components/ops-dashboard";
import { getProjectStatuses } from "@/lib/status";
import { formatSnapshotTime } from "@/lib/labels";

// Diese Seite rendert pro Aufruf (dynamisch), weil die Status-Fetches bewusst ungecacht laufen
// — sonst würde eine ausgefallene Maschine weiter als "läuft" angezeigt (ausführliche
// Begründung in lib/status.ts). Die Last nach außen bleibt trotzdem gedeckelt: das Modul-Memo
// dort fragt die fünf Dienste höchstens einmal pro Minute an.
// Server Component: Live-Status wird hier server-seitig geholt (nicht per Client-Polling) —
// landet dadurch im initialen HTML, kein CORS, kein zusätzlicher Client-Bundle-Overhead. Siehe
// lib/status.ts für Caching (revalidate: 60) und Fallback-Verhalten bei fehlgeschlagenen Fetches.
export default async function Home() {
  const { statuses, fetchedAt } = await getProjectStatuses();
  return (
    <main className="flex flex-1 flex-col">
      <OpsDashboard statuses={statuses} fetchedAtLabel={formatSnapshotTime(fetchedAt)} />
    </main>
  );
}
