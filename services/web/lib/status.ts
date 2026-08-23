// Live-Betriebsdaten pro Projekt für den "Live Infrastructure Atlas" (Redesign 2026-08-23).
// Jedes der 5 Projekte hat einen öffentlichen, unauthentifizierten /status-Endpoint bekommen
// (Konvention koordiniert über die Server-Steward-Session, siehe docs/decisions.md). Schema ist
// bewusst NICHT einheitlich — matrix-chat und qntx-autotrader liefern absichtlich reduzierte
// Daten aus Privatsphäre-/Kapitalrisiko-Gründen. Nie erfundene Daten: schlägt ein Fetch fehl,
// liefert dieses Modul `null` für das Projekt, die UI fällt dann auf die statischen Werte aus
// content.ts zurück.

export type LiveStatusValue = "operational" | "degraded" | "down";

/** Basis-Schema: ravepuls, buchhaltung, foodapp. */
export type BasicLiveStatus = {
  schema: "basic";
  project: string;
  status: LiveStatusValue;
  lastDeploy: string | null;
  lastSync: string | null;
};

/** Reduziertes Schema: matrix-chat (keine Nutzer-/Nachrichtenzahlen, keine Sekunden-Zeitstempel). */
export type UptimeLiveStatus = {
  schema: "uptime";
  project: string;
  status: LiveStatusValue;
  uptimeSince: string | null;
};

/** Minimal-Schema: qntx-autotrader (nur Badge, keine Zahlen/Zeiten — Kapitalrisiko-Sensibilität). */
export type BadgeLiveStatus = {
  schema: "badge";
  status: LiveStatusValue;
};

export type LiveStatus = BasicLiveStatus | UptimeLiveStatus | BadgeLiveStatus;

// Achtung: foodapp läuft unter der api.-Subdomain, nicht unter der app.-Domain aus
// PROJECTS[].url in content.ts (das ist die SPA-URL, ein anderer Host).
const STATUS_ENDPOINTS: Record<string, { url: string; schema: LiveStatus["schema"] }> = {
  ravepuls: { url: "https://ravepuls.de/status", schema: "basic" },
  buchhaltung: { url: "https://buchhaltung.zntx.de/status", schema: "basic" },
  foodapp: { url: "https://api.zentrix-solutions.eu/status", schema: "basic" },
  "matrix-chat": { url: "https://matrix.zntx.de/status", schema: "uptime" },
  qntx: { url: "https://qntx.zblt.eu/status", schema: "badge" },
};

function isLiveStatusValue(v: unknown): v is LiveStatusValue {
  return v === "operational" || v === "degraded" || v === "down";
}

function parseResponse(schema: LiveStatus["schema"], data: unknown): LiveStatus | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (!isLiveStatusValue(d.status)) return null;

  if (schema === "badge") {
    return { schema: "badge", status: d.status };
  }
  if (schema === "uptime") {
    return {
      schema: "uptime",
      project: typeof d.project === "string" ? d.project : "",
      status: d.status,
      uptimeSince: typeof d.uptime_since === "string" ? d.uptime_since : null,
    };
  }
  return {
    schema: "basic",
    project: typeof d.project === "string" ? d.project : "",
    status: d.status,
    lastDeploy: typeof d.last_deploy === "string" ? d.last_deploy : null,
    lastSync: typeof d.last_sync === "string" ? d.last_sync : null,
  };
}

async function fetchOne(id: string, url: string, schema: LiveStatus["schema"]): Promise<LiveStatus | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return parseResponse(schema, data);
  } catch {
    return null;
  }
}

/**
 * Server-seitig aufrufen (Server Component), nicht clientseitig pollen — ein Fetch-Punkt,
 * Ergebnis landet im initialen HTML, kein CORS, kein Client-Bundle-Overhead. Next dedupliziert/
 * cached über `revalidate: 60`, damit nicht jeder Seitenaufruf alle 5 externen Services anfragt.
 */
export async function getProjectStatuses(): Promise<Record<string, LiveStatus | null>> {
  const entries = Object.entries(STATUS_ENDPOINTS);
  const results = await Promise.allSettled(
    entries.map(([id, { url, schema }]) => fetchOne(id, url, schema))
  );
  const out: Record<string, LiveStatus | null> = {};
  entries.forEach(([id], i) => {
    const r = results[i];
    out[id] = r.status === "fulfilled" ? r.value : null;
  });
  return out;
}
