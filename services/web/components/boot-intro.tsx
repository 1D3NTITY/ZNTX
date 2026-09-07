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
//  • Abbruch per Klick oder beliebiger Taste, endet sonst von selbst — Timeout in layout.tsx
//    ist an TOTAL_MS unten gekoppelt (siehe Kommentar dort).
//  • aria-hidden: für Screenreader nicht vorhanden, der eigentliche Inhalt liegt vollständig
//    im DOM darunter.
//
// Update 2026-09-07, zweiter Anlauf (Luis, nachdem die erste "krasser"-Fassung nur die
// bestehende CRT-Text-Idee verstärkt hatte statt eine andere Perspektive zu zeigen: "wirkt
// nicht so als hättest du dir das aus vielen Perspektiven angeschaut, es wird immer nur mehr
// gepolished"): komplett andere Grundidee statt mehr Deko auf der alten. Per AskUserQuestion
// vier echte Alternativkonzepte vorgelegt (CRT-Boot verstärkt / Rack-Power-Up / Verbindungs-
// aufbau / Wortmarken-Cut) — Luis wählte "Rack-Power-Up". Statt eines Text-Log-Screens jetzt:
// eine Reihe LED-Slots (genau `systems` Stück, echte Zahl aus page.tsx/lib/content.ts), die
// nacheinander hochfahren — `operational` davon erreichen volle Helligkeit in der bestehenden
// --status-online-Farbe (identisch zur echten LiveLed in rack-slot.tsx), der Rest bleibt als
// gedimmter Rahmen stehen (identisch zur "keine Live-Daten"-Legende in ops-dashboard.tsx) statt
// zu lügen und alle als "live" zu zeigen. Nimmt damit die Rack-Metapher vorweg, die weiter unten
// auf der Seite ohnehin kommt — bespoke für diese Seite statt generischer Retro-Terminal-Trope,
// und deutlich weniger Text als der erste Anlauf (passend zum zweiten Feedback-Punkt vom
// selben Tag: "die Status-Legende ist viel zu viel Text").

// Timing-Konstanten (auch von layout.tsx referenziert — siehe Kommentar dort). Alle Werte hier
// zentral, damit sie nicht in zwei Dateien auseinanderlaufen.
const LED_START_MS = 260; // nach dem Power-On-Snap (160ms) + kurzer Pause
const LED_STAGGER_MS = 100;
const LED_DURATION_MS = 180;
const BLOOM_GAP_MS = 60;
const BLOOM_DURATION_MS = 200;
const CAPTION_GAP_MS = 150;
const CAPTION_FADE_MS = 200;
// Nach der Caption hält layout.tsx noch 500ms, bevor der Kollaps ausgelöst wird (dortiger
// setTimeout-Wert, mit der Formel in seinem Kommentar) — hier nicht als Konstante, weil dieser
// Timeout in einem separaten, statischen <script>-String liegt und nichts von hier importieren
// kann.

export function BootIntro({
  systems,
  operational,
}: {
  systems: number;
  operational: number;
}) {
  const lastLedStart = LED_START_MS + (systems - 1) * LED_STAGGER_MS;
  const lastLedEnd = lastLedStart + LED_DURATION_MS;
  const bloomDelay = lastLedEnd + BLOOM_GAP_MS;
  const captionDelay = bloomDelay + CAPTION_GAP_MS;
  // Exportiert für layout.tsx nur als Kommentarwert (kein Modul-Import zwischen Server-Skript
  // und Inline-<script>-String möglich) — siehe dortiger Kommentar, der diese Formel referenziert.
  // totalMs = captionDelay + CAPTION_FADE_MS + HOLD_BEFORE_COLLAPSE_MS

  return (
    <div id="boot-intro" aria-hidden="true">
      <div className="flex flex-col items-center gap-5 px-8">
        <div className="boot-led-row relative flex items-end gap-2">
          <div
            className="boot-led-bloom"
            style={{ animationDelay: `${bloomDelay}ms`, animationDuration: `${BLOOM_DURATION_MS}ms` }}
          />
          {Array.from({ length: systems }).map((_, i) => (
            <div
              key={i}
              className={`boot-led ${i < operational ? "is-online" : "is-registered"}`}
              style={{
                animationDelay: `${LED_START_MS + i * LED_STAGGER_MS}ms`,
                animationDuration: `${LED_DURATION_MS}ms`,
              }}
            />
          ))}
        </div>
        <p
          className="boot-line font-mono text-[12px] tracking-wide text-foreground-muted sm:text-[13px]"
          style={{ animationDelay: `${captionDelay}ms`, animationDuration: `${CAPTION_FADE_MS}ms` }}
        >
          <span className="text-accent">{operational}</span> von {systems} Systemen live
        </p>
        <p
          className="boot-line text-[11px] text-foreground-muted/70"
          style={{ animationDelay: `${captionDelay + 80}ms`, animationDuration: `${CAPTION_FADE_MS}ms` }}
        >
          beliebige Taste — überspringen
        </p>
      </div>
    </div>
  );
}
