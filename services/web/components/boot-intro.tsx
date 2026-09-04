// Boot-Intro (2026-09-03, docs/plans/intro-flows-2026-09-03.md)
//
// WICHTIG — warum das KEIN Client-Component mit useEffect ist:
// Die erste Fassung zeigte das Overlay erst nach der React-Hydration. Gemessen am
// Produktions-Build erschien es nach 684 ms (schnelle Maschine) bzw. 2,9 s (gedrosselte CPU) —
// der Besucher sah also erst die fertige Seite und bekam DANN einen Boot-Screen darübergelegt.
// Das ist schlechter als gar kein Intro. Ein Vorschalt-Effekt kann das Rennen gegen den ersten
// Bildaufbau nur gewinnen, wenn er nicht an JavaScript-Hydration hängt.
//
// Deshalb jetzt: statisches Server-Markup + CSS-Animationen, gesteuert über eine Klasse am
// <html>, die ein winziges Inline-Skript ganz am Anfang von <body> setzt (siehe layout.tsx).
// Dadurch steht die Entscheidung, bevor irgendetwas gemalt wird.
//
// Verhalten:
//  • Standardmäßig `display: none` — ohne JavaScript existiert das Overlay faktisch nicht,
//    die Seite ist sofort vollständig nutzbar (kein Gating von Inhalt, kein Risiko, dass
//    jemand vor einem hängenden Boot-Screen sitzt).
//  • Nur beim ersten Besuch pro Sitzung, nie bei prefers-reduced-motion (beides prüft das
//    Inline-Skript).
//  • Abbruch per Klick oder beliebiger Taste, endet sonst nach ~1,15 s von selbst.
//  • aria-hidden: für Screenreader nicht vorhanden, der eigentliche Inhalt liegt vollständig
//    im DOM darunter.

function BootLine({
  text,
  index,
  decode = false,
}: {
  text: string;
  index: number;
  /** Nur die erste, symbolträchtigste Zeile bekommt das Zeichen-Decode-Flackern (2026-09-04,
   *  Luis: "richtig krass, glitch, omfg-Faktor") — bewusst nicht auf allen Zeilen, damit die
   *  Gesamtverzögerung sicher innerhalb des bestehenden ~1150ms-Auto-Dismiss-Budgets bleibt und
   *  der Effekt als gezielte Signatur wirkt statt als Dauerflimmern. Bleibt server-gerendertes
   *  reines CSS — Text ist zum Render-Zeitpunkt bekannt, kein Client-JS, kein neues
   *  Hydration-Risiko in dieser bewusst client-JS-freien Datei (siehe Datei-Kopfkommentar). */
  decode?: boolean;
}) {
  return (
    <div
      className="boot-line glow-amber whitespace-pre"
      // Gestaffeltes Erscheinen rein über CSS — kein JavaScript-Timer pro Zeile nötig.
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {decode
        ? text.split("").map((char, i) => (
            <span
              key={i}
              className="boot-char"
              style={{ animationDelay: `${index * 110 + i * 6}ms` }}
            >
              {char}
            </span>
          ))
        : text}
    </div>
  );
}

export function BootIntro({
  systems,
  operational,
  fetchedAtLabel,
}: {
  systems: number;
  operational: number;
  fetchedAtLabel: string | null;
}) {
  // Nur Wahres — gleiche Ehrlichkeitsregel wie im Live-Terminal, keine erfundenen Zeilen.
  const lines = [
    "zntx control — power on self test",
    "amber phosphor display .......... ok",
    "2 hosts detected ................ ok",
    `${systems} systems registered ........... ok`,
    `${operational} operational`,
    ...(fetchedAtLabel ? [`status fetch ${fetchedAtLabel}`] : []),
  ];

  return (
    <div id="boot-intro" aria-hidden="true">
      <div className="w-full max-w-md px-8 font-mono text-[12px] leading-relaxed text-accent sm:text-[13px]">
        {lines.map((line, i) => (
          <BootLine key={i} text={line} index={i} decode={i === 0} />
        ))}
        <div className="mt-4 h-px w-full bg-accent/30" />
        <p className="mt-3 text-[11px] text-foreground-muted">
          beliebige Taste — überspringen
        </p>
      </div>
    </div>
  );
}
