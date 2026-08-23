import { OpsDashboard } from "@/components/ops-dashboard";
import { getProjectStatuses } from "@/lib/status";

// Server Component: Live-Status wird hier server-seitig geholt (nicht per Client-Polling) —
// landet dadurch im initialen HTML, kein CORS, kein zusätzlicher Client-Bundle-Overhead. Siehe
// lib/status.ts für Caching (revalidate: 60) und Fallback-Verhalten bei fehlgeschlagenen Fetches.
export default async function Home() {
  const statuses = await getProjectStatuses();
  return (
    <main className="flex flex-1 flex-col">
      <OpsDashboard statuses={statuses} />
    </main>
  );
}
