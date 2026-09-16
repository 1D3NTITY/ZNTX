// Kuma-Reachability (2026-09-16) — liest die self-hosted Uptime-Kuma-Instanz von
// SERVERMANAGEMENT (status.zblt.eu, öffentliche Status-Page "zblt", kein Login). Miss unabhängig
// von lib/status.ts: dort geht es um die FACHLICHE Korrektheit der projekteigenen /status-
// Endpoints (z.B. "läuft der Sync noch"), hier nur um reine Erreichbarkeit von außen. Beide
// Signale sind schon einmal auseinandergelaufen (foodapp meldete "operational", während Kuma
// erreichbar aber der Sync seit Wochen tot war) — deshalb bewusst getrennt gehalten, nie zu
// einem Wert verrechnet (siehe scripts/uptime-check.ts und components/rack-slot.tsx).
//
// WICHTIG: Dieses Modul wird NUR von scripts/uptime-check.ts (GitHub Actions, alle 30 Min)
// importiert, nie von einer Next.js-Route zur Request-Zeit — status.zblt.eu setzt keinen
// Access-Control-Allow-Origin-Header (selbst getestet), ein clientseitiger Fetch würde von jedem
// Browser blockiert. Server-zu-Server ist das unkritisch, aber eine neue Live-Laufzeit-
// Abhängigkeit auf Server 1 wollten wir bewusst nicht (SERVERMANAGEMENT-Empfehlung) — die Seite
// liest wie die bestehende Uptime-Historie nur die von Actions committeten Werte
// (lib/uptime-history.ts), nie live.

const HEARTBEAT_URL = "https://status.zblt.eu/api/status-page/heartbeat/zblt";

export type KumaReachability = "up" | "down" | "unknown";

// Projekt-ID (identisch zu lib/status.ts / lib/content.ts PROJECTS[].id) → Kuma-Monitor-IDs.
// Mehrere IDs bei Projekten mit Web/API/Media-Split — Aggregation ist worst-of, siehe
// computeProjectReachability(). "wardogs-community" ist vorerst ungenutzt (kein Eintrag in
// PROJECTS), technisch aber schon vorbereitet (Luis, 2026-09-16) — die eigentliche Projekt-Karte
// kommt erst mit Inhalt von der wardogs-Session.
export const KUMA_PROJECT_MONITOR_IDS: Record<string, number[]> = {
  foodapp: [1, 2, 3],
  zntx: [4],
  ravepuls: [5, 6, 16],
  "matrix-chat": [7],
  buchhaltung: [8],
  qntx: [20],
  "wardogs-community": [11, 12],
};

type RawHeartbeat = { status: number; time: string };
type RawHeartbeatResponse = { heartbeatList: Record<string, RawHeartbeat[]> };

/**
 * Ein Fetch für alle Monitore gleichzeitig (die API liefert ohnehin alles in einer Antwort) —
 * scripts/uptime-check.ts ruft das einmal pro Lauf auf, nicht pro Projekt. Liefert `null` bei
 * jedem Fehler (Timeout, Netzwerk, unerwartete Form) — gleiche Ehrlichkeits-Disziplin wie
 * lib/status.ts fetchOne: nie eine alte/erfundene Antwort weiterreichen, ein echter Fehlschlag
 * bleibt ein echter Fehlschlag.
 */
export async function fetchKumaHeartbeats(): Promise<Record<string, RawHeartbeat[]> | null> {
  try {
    const res = await fetch(HEARTBEAT_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (typeof data !== "object" || data === null) return null;
    const d = data as Partial<RawHeartbeatResponse>;
    if (typeof d.heartbeatList !== "object" || d.heartbeatList === null) return null;
    return d.heartbeatList;
  } catch {
    return null;
  }
}

function monitorReachability(
  heartbeats: Record<string, RawHeartbeat[]>,
  monitorId: number
): KumaReachability {
  const list = heartbeats[String(monitorId)];
  if (!list || list.length === 0) return "unknown";
  const latest = list[list.length - 1];
  if (latest.status === 0) return "down";
  if (latest.status === 1) return "up";
  return "unknown"; // 2 = pending, 3 = maintenance — ehrlich unklar, nicht als "up" behaupten
}

/**
 * Aggregation über alle Monitore eines Projekts: worst-of. Ein down zieht das ganze Projekt auf
 * down (ein einzelner nicht erreichbarer Baustein ist real), sonst unknown wenn irgendein
 * Monitor unklar ist, sonst erst up wenn wirklich alle Monitore up sind.
 */
export function computeProjectReachability(
  heartbeats: Record<string, RawHeartbeat[]>,
  monitorIds: number[]
): KumaReachability {
  const results = monitorIds.map((id) => monitorReachability(heartbeats, id));
  if (results.some((r) => r === "down")) return "down";
  if (results.some((r) => r === "unknown")) return "unknown";
  return "up";
}
