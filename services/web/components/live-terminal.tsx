"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, BIO } from "@/lib/content";
import type { LiveStatus } from "@/lib/status";
import { formatLiveStatus, formatProjectMeta, SERVER_LABEL } from "@/lib/labels";
import { useReducedMotionPreference } from "@/lib/use-reduced-motion";

// Live-Terminal (2026-09-03, docs/plans/live-wow-2026-09-03.md) — beantwortet getippte Befehle
// mit den ECHTEN Daten aus dem Status-Snapshot, nicht mit Attrappen-Strings. Das ist der
// eigentliche Unterschied zu den vielen "Fake-Terminal"-Portfolios: hier steckt eine echte
// Abfrage gegen eigene, laufende Server dahinter.
//
// Datenweg bewusst ohne eigenen API-Endpoint und ohne Client-Polling: Der Server hat den
// Snapshot beim Rendern ohnehin schon geholt (lib/status.ts) und reicht ihn als Prop herein.
// Das spart eine zusätzliche öffentliche Route, eine Rate-Limit-Frage und CORS — und die Daten
// sind durch `revalidate: 60` trotzdem höchstens eine Minute alt.
//
// Ehrlichkeitsregel wie überall im Projekt: Systeme ohne echten Endpoint bekommen KEINEN
// erfundenen Status, sondern eine klare Aussage, warum es keinen gibt.

type Line = { kind: "in" | "out" | "dim" | "accent"; text: string };

const HELP: Line[] = [
  { kind: "out", text: "Verfügbare Befehle:" },
  { kind: "dim", text: "  status [projekt]   Live-Zustand aus den /status-Endpoints" },
  { kind: "dim", text: "  systems            alle Systeme mit Server-Zuordnung" },
  { kind: "dim", text: "  uptime             bekannte Laufzeiten" },
  { kind: "dim", text: "  whoami             Kurzprofil des Betreibers" },
  { kind: "dim", text: "  clear              Ausgabe leeren" },
  { kind: "dim", text: "  help               diese Liste" },
];

/** Systeme, für die es bewusst keinen HTTP-Endpoint gibt — mit echtem Grund, nicht kaschiert. */
const NO_ENDPOINT_REASON: Record<string, string> = {
  motortown: "Gameserver (systemd/Wine), kein HTTP-Dienst",
  "wcp-arma": "archiviert, Server bewusst abgeschaltet",
  "n8n-automation": "archiviert, kein Server mehr zugeordnet",
  zntx: "diese Seite selbst — fragt sich nicht selbst ab",
  foodapp: "Endpoint aktuell nicht erreichbar (DNS)",
};

function pad(s: string, n: number) {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function statusLines(
  statuses: Record<string, LiveStatus | null>,
  filter?: string
): Line[] {
  const targets = filter
    ? PROJECTS.filter((p) => p.id === filter || p.name.toLowerCase() === filter)
    : PROJECTS;

  if (targets.length === 0) {
    return [
      { kind: "out", text: `Unbekanntes System: ${filter}` },
      { kind: "dim", text: "  'systems' zeigt alle verfügbaren Kennungen." },
    ];
  }

  const lines: Line[] = [];
  for (const p of targets) {
    const live = statuses[p.id] ?? null;
    const formatted = formatLiveStatus(live);
    if (formatted) {
      lines.push({ kind: "accent", text: `  ● ${pad(p.id, 16)}${formatted.label.toLowerCase()}` });
      if (formatted.detail) lines.push({ kind: "dim", text: `      ${formatted.detail}` });
    } else {
      const reason = NO_ENDPOINT_REASON[p.id] ?? "kein öffentlicher Status-Endpoint";
      lines.push({ kind: "out", text: `  ○ ${pad(p.id, 16)}keine Live-Daten` });
      lines.push({ kind: "dim", text: `      ${reason}` });
    }
  }
  return lines;
}

function runCommand(
  raw: string,
  statuses: Record<string, LiveStatus | null>,
  fetchedAtLabel: string | null
): Line[] | "clear" {
  const input = raw.trim().toLowerCase();
  if (!input) return [];

  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return HELP;

    case "clear":
      return "clear";

    case "status": {
      const lines = statusLines(statuses, arg || undefined);
      if (fetchedAtLabel && !arg) {
        lines.push({ kind: "dim", text: "" });
        lines.push({ kind: "dim", text: `  Stand ${fetchedAtLabel} · echte Abfrage, keine Attrappe` });
      }
      return lines;
    }

    case "systems": {
      const lines: Line[] = [];
      for (const p of PROJECTS) {
        const where = p.server ? SERVER_LABEL[p.server] : "Archiv";
        lines.push({ kind: "out", text: `  ${pad(p.id, 16)}${pad(where, 10)}${formatProjectMeta(p)}` });
      }
      return lines;
    }

    case "uptime": {
      const lines: Line[] = [];
      for (const p of PROJECTS) {
        const live = statuses[p.id] ?? null;
        const detail = formatLiveStatus(live)?.detail;
        if (detail) lines.push({ kind: "out", text: `  ${pad(p.id, 16)}${detail}` });
      }
      if (lines.length === 0) {
        return [{ kind: "out", text: "Aktuell keine Laufzeit-Daten abrufbar." }];
      }
      lines.unshift({ kind: "dim", text: "Nur Systeme mit echtem Zeit-Feld im Endpoint:" });
      return lines;
    }

    case "whoami":
      return [
        { kind: "accent", text: "  Luis — Betreiber" },
        { kind: "out", text: `  ${BIO.dayJob}` },
        { kind: "out", text: `  ${BIO.passion}` },
        { kind: "dim", text: "  Details unter 'Operator-Profil' weiter unten auf der Seite." },
      ];

    default:
      return [
        { kind: "out", text: `Unbekannter Befehl: ${cmd}` },
        { kind: "dim", text: "  'help' zeigt, was geht." },
      ];
  }
}

const LINE_CLASS: Record<Line["kind"], string> = {
  in: "text-foreground",
  out: "text-foreground",
  dim: "text-foreground-muted",
  accent: "text-accent glow-accent",
};

export function LiveTerminal({
  statuses,
  fetchedAtLabel,
  operationalCount,
  totalCount,
}: {
  statuses: Record<string, LiveStatus | null>;
  fetchedAtLabel: string | null;
  operationalCount: number;
  totalCount: number;
}) {
  // Der Erstzustand ist bewusst statisch und serverseitig identisch — kein Zweig auf
  // useReducedMotion o. ä. im initialen Render. Genau diese Bug-Klasse (Client-Hook löst beim
  // ersten Paint synchron auf, SSR sieht null) hat in diesem Projekt schon zweimal zu
  // Hydration-Mismatches geführt; die Boot-Animation startet deshalb erst im Effect.
  // Geteilter Hook (lib/use-reduced-motion.ts) statt eigener subscribeReducedMotion-Kopie —
  // dieselbe Logik existierte vorher dreifach unabhängig im Projekt (Security-Review 2026-09-03).
  const reduced = useReducedMotionPreference();

  const boot: Line[] = useMemo(
    () => [
      { kind: "dim", text: "zntx control — Verbindung zu 2 Root-Servern" },
      { kind: "out", text: `${totalCount} Systeme registriert · ${operationalCount} im Betrieb` },
      ...(fetchedAtLabel
        ? [{ kind: "dim" as const, text: `Status-Abruf ${fetchedAtLabel}` }]
        : []),
      { kind: "dim", text: "" },
      { kind: "accent", text: "Tippe ‘help’ für Befehle." },
    ],
    [fetchedAtLabel, operationalCount, totalCount]
  );

  // Wie viele Boot-Zeilen bereits ausgegeben sind. Alles Weitere wird daraus abgeleitet statt
  // in einen zweiten State gespiegelt — dadurch kann Boot-Fortschritt und sichtbare Ausgabe
  // nicht auseinanderlaufen.
  const [bootStep, setBootStep] = useState(0);
  const [history, setHistory] = useState<Line[]>([]);
  /** 'clear' blendet auch die Boot-Ausgabe aus — leeren heißt leeren, nicht halb leeren. */
  const [cleared, setCleared] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bootDone = cleared || reduced || bootStep >= boot.length;
  const lines = useMemo(() => {
    if (cleared) return history;
    return [...(reduced ? boot : boot.slice(0, bootStep)), ...history];
  }, [cleared, reduced, boot, bootStep, history]);

  useEffect(() => {
    if (reduced) return;
    // Zeilenweiser Aufbau statt Zeichen-für-Zeichen-Tippen: liest sich als "System fährt hoch"
    // und ist trotzdem in ~1 s fertig — ein echter Tipp-Effekt würde den Besucher warten
    // lassen, und Warten ist das Gegenteil von beeindruckend.
    const timer = setInterval(() => {
      setBootStep((step) => {
        if (step >= boot.length) {
          clearInterval(timer);
          return step;
        }
        return step + 1;
      });
    }, 180);
    return () => clearInterval(timer);
  }, [reduced, boot.length]);

  useEffect(() => {
    // Nach neuer Ausgabe ans Ende scrollen — nur innerhalb des Terminals, nie die Seite.
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const entered = value;
    setValue("");
    const result = runCommand(entered, statuses, fetchedAtLabel);
    if (result === "clear") {
      setCleared(true);
      setHistory([]);
      return;
    }
    setHistory((prev) => [
      ...prev,
      { kind: "in", text: `zntx_ ~ ${entered}` },
      ...result,
      { kind: "dim", text: "" },
    ]);
  }

  return (
    <section aria-labelledby="terminal-heading" className="mt-6 sm:mt-10">
      <h2 id="terminal-heading" className="sr-only">
        Interaktives Live-Terminal
      </h2>
      <div
        className="overflow-hidden rounded-md border border-border bg-surface shadow-[0_0_60px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Fensterleiste — gleiche Sprache wie das kontakt.sh-Fenster im Kontaktbereich. */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-status-paper/60" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-status-online/60" />
          <span className="ml-2 font-mono text-[11px] text-foreground-muted">
            zntx-control — live
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-56 overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed sm:h-72 sm:text-[13px]"
        >
          {/* aria-live: getippte Antworten werden vorgelesen, ohne dass der Fokus springt. */}
          <div aria-live="polite" aria-atomic="false">
            {lines.map((line, i) => (
              <div key={i} className={`whitespace-pre-wrap break-words ${LINE_CLASS[line.kind]}`}>
                {line.text || " "}
              </div>
            ))}
          </div>

          {bootDone && (
            <form onSubmit={submit} className="mt-1 flex items-center gap-2">
              <label htmlFor="terminal-input" className="sr-only">
                {"Terminal-Befehl eingeben — 'help' zeigt alle Befehle"}
              </label>
              <span aria-hidden="true" className="shrink-0 text-accent glow-accent">
                zntx_ ~
              </span>
              <input
                id="terminal-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded bg-transparent text-foreground caret-accent outline-none placeholder:text-foreground-muted/60 focus-visible:ring-2 focus-visible:ring-accent-dim"
                placeholder="help"
              />
            </form>
          )}
        </div>
      </div>
      <p className="mt-2 font-mono text-[11px] text-foreground-muted">
        Echte Abfrage der eigenen Server — keine vorgeschriebenen Antworten. Alle Angaben stehen
        auch ohne Terminal in den Racks darunter.
      </p>
    </section>
  );
}
