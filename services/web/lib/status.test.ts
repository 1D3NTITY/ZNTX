import { describe, it, expect, vi, afterEach } from "vitest";

// Regressionstest für den Ehrlichkeits-Bug (gefunden 2026-09-03, siehe status.ts:fetchOne):
// Next's fetch-Cache lieferte bei fehlgeschlagener Neuvalidierung die letzte erfolgreiche
// Antwort weiter aus, ein toter Dienst erschien dadurch weiter als "operational". Der Fix
// (cache:"no-store" + eigenes Modul-Memo mit TTL) hätte diese drei Eigenschaften — ohne Test
// hätte eine künftige Änderung die Bug-Klasse unbemerkt wieder einführen können (TDD-Pflicht
// laut globaler CLAUDE.md).
//
// vi.resetModules() + dynamischer re-import pro Test: memo/inFlight in status.ts sind
// Modul-Level-State, jeder Test braucht eine frische Instanz. vi.setSystemTime() statt
// vi.useFakeTimers(): verändert nur Date.now()/new Date(), lässt AbortSignal.timeout() in
// fetchOne unangetastet.

async function freshStatusModule() {
  vi.resetModules();
  return await import("./status");
}

function okResponse(body: unknown) {
  return { ok: true, json: async () => body };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("getProjectStatuses", () => {
  it("liefert nach TTL-Ablauf null für einen ausgefallenen Dienst, statt die alte Antwort zu recyceln", async () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const fetchMock = vi.fn().mockResolvedValue(okResponse({ status: "operational" }));
    vi.stubGlobal("fetch", fetchMock);
    const { getProjectStatuses } = await freshStatusModule();

    const first = await getProjectStatuses();
    expect(Object.values(first.statuses).some((s) => s?.status === "operational")).toBe(true);

    // TTL (60s) ablaufen lassen, Dienst ist jetzt komplett unerreichbar.
    vi.setSystemTime(new Date("2026-01-01T00:02:00Z"));
    fetchMock.mockRejectedValue(new Error("network down"));

    const second = await getProjectStatuses();
    expect(Object.values(second.statuses).every((s) => s === null)).toBe(true);
  });

  it("fragt innerhalb der 60s-TTL nicht erneut ab", async () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const fetchMock = vi.fn().mockResolvedValue(okResponse({ status: "operational" }));
    vi.stubGlobal("fetch", fetchMock);
    const { getProjectStatuses } = await freshStatusModule();

    await getProjectStatuses();
    const callsAfterFirst = fetchMock.mock.calls.length;
    expect(callsAfterFirst).toBeGreaterThan(0);

    vi.setSystemTime(new Date("2026-01-01T00:00:30Z")); // innerhalb der 60s-TTL
    await getProjectStatuses();
    expect(fetchMock.mock.calls.length).toBe(callsAfterFirst);
  });

  it("teilt sich bei parallelen Aufrufen ein In-Flight-Promise (kein Thundering Herd)", async () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    let resolvePending!: () => void;
    const pending = new Promise<void>((res) => {
      resolvePending = res;
    });
    const fetchMock = vi.fn().mockReturnValue(pending.then(() => okResponse({ status: "operational" })));
    vi.stubGlobal("fetch", fetchMock);
    const { getProjectStatuses } = await freshStatusModule();

    const p1 = getProjectStatuses();
    const p2 = getProjectStatuses();
    resolvePending();
    const [r1, r2] = await Promise.all([p1, p2]);

    expect(r1).toBe(r2); // dasselbe Objekt: beide haben dasselbe In-Flight-Promise erhalten
    expect(fetchMock.mock.calls.length).toBe(5); // ein Durchlauf über alle 5 Endpoints, nicht 10
  });
});
