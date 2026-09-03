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

/**
 * Ein Abruf-Ergebnis hat fachlich immer einen Zeitpunkt — ohne den lässt sich in der UI nicht
 * ehrlich behaupten, die Daten seien gerade erst geholt worden. Wichtig: wegen `revalidate: 60`
 * (siehe fetchOne) ist `fetchedAt` der Zeitpunkt des letzten *echten* Abrufs, nicht der des
 * Seitenaufrufs — die UI beschriftet das deshalb als "Stand", nicht als "jetzt".
 */
export type StatusSnapshot = {
  statuses: Record<string, LiveStatus | null>;
  fetchedAt: string;
};

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
    // `cache: "no-store"` statt `next: { revalidate: 60 }` — bewusst, wegen eines echten
    // Ehrlichkeits-Bugs (gefunden 2026-09-03):
    //
    // Mit fetch-seitigem `revalidate` legt Next die Antwort in den Data Cache. Läuft die
    // Neuvalidierung später in einen Fehler (hier: api.zentrix-solutions.eu löst seit dem
    // 24.08. per DNS nicht mehr auf), liefert Next die ALTE, erfolgreiche Antwort weiter
    // (stale-while-revalidate). Aus Sicht dieses Moduls ist der Fetch damit erfolgreich —
    // der try/catch-Fallback auf `null` greift nie. Folge: Die Seite meldete foodapp
    // wochenlang als "operational", obwohl der Dienst gar nicht erreichbar war. Genau das
    // verbietet die Grundregel dieses Projekts (nie Daten behaupten, die nicht real sind).
    //
    // Mit no-store geht jeder Aufruf wirklich ans Netz; fällt ein Dienst aus, wird daraus
    // ehrlich `null` → "keine Live-Daten". Die Drosselung übernimmt das Modul-Memo in
    // getProjectStatuses() weiter unten (höchstens ein Abfragedurchlauf pro Minute), nicht
    // mehr das Framework.
    const res = await fetch(url, {
      cache: "no-store",
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
/**
 * Selbst verwalteter Kurzzeit-Cache statt Framework-Caching.
 *
 * Warum nicht Next's Data Cache: dessen Fehlerverhalten war genau der Bug (siehe fetchOne) —
 * bei fehlgeschlagener Neuvalidierung wird die letzte erfolgreiche Antwort weitergereicht, und
 * eine tote Maschine erscheint weiter als "läuft". Hier wird stattdessen das *Ergebnis*
 * gespeichert, inklusive Fehlschlägen: fällt ein Dienst aus, ist der gemerkte Wert `null` und
 * die Seite sagt ehrlich "keine Live-Daten".
 *
 * Ein Modul-Level-Memo ist hier zulässig, weil dieser Dienst als genau ein langlebiger
 * Container läuft (Docker Compose, eine Instanz) — bei horizontaler Skalierung hätte jede
 * Instanz ihren eigenen Zähler, was hier folgenlos wäre (nur mehr Abfragen, nie falsche Daten).
 *
 * Effekt: Egal wie viel Verkehr die Seite hat, die fünf Dienste werden höchstens einmal pro
 * Minute angefragt.
 */
const SNAPSHOT_TTL_MS = 60_000;
let memo: { at: number; value: StatusSnapshot } | null = null;
/** Verhindert, dass parallele Anfragen beim Ablauf gleichzeitig losfetchen (Thundering Herd). */
let inFlight: Promise<StatusSnapshot> | null = null;

export async function getProjectStatuses(): Promise<StatusSnapshot> {
  if (memo && Date.now() - memo.at < SNAPSHOT_TTL_MS) return memo.value;
  if (inFlight) return inFlight;

  inFlight = fetchAllStatuses()
    .then((value) => {
      memo = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

async function fetchAllStatuses(): Promise<StatusSnapshot> {
  const entries = Object.entries(STATUS_ENDPOINTS);
  const results = await Promise.allSettled(
    entries.map(([id, { url, schema }]) => fetchOne(id, url, schema))
  );
  const statuses: Record<string, LiveStatus | null> = {};
  entries.forEach(([id], i) => {
    const r = results[i];
    statuses[id] = r.status === "fulfilled" ? r.value : null;
  });
  return { statuses, fetchedAt: new Date().toISOString() };
}
