# zntx — 3 grundverschiedene Konzeptrichtungen (Runde 2)

Kontext: Die Alumica-Template-Adaption (mehrere Iterationsrunden, siehe Git-Log 2026-08-27) hat
gezeigt, dass das Kopieren/Adaptieren eines fremden Copy-Paste-Templates strukturell nie zu
echter Unterscheidbarkeit führt — jedes Template in so einer Galerie wirkt für sich "WOW", genau
deshalb ist keins davon einzigartig. Luis will einen fundamentalen Redesign, aber diesmal aus dem
eigenen Inhalt abgeleitet statt aus einer fremden Vorlage kopiert. Gleiches Vorgehen wie beim
ersten Konzept-Sketch (`redesign-concepts-2026-07-24.md`): drei strukturell verschiedene
Richtungen, nur skizziert, nichts gebaut — Auswahl folgt zuerst.

Was sich seit Juli geändert hat und die Konzepte diesmal stärker macht: es gibt jetzt echte
Live-Betriebsdaten (5 der 8 Projekte liefern `/status` — Deploy-Zeit, Sync-Zeit, Betriebsstatus)
und echte Screenshots (foodapp, ravepuls, buchhaltung, qntx). Beide Konzepte unten nutzen das
aktiv, nicht nur als Badge-Beiwerk.

Feste Rahmenbedingungen für alle drei:
- Projekt-Farbsystem bleibt (ravepuls/qntx/arma feste Farben, jedes Projekt eine eigene Farbe).
- Keine erfundenen Inhalte — keine Stock-Bilder, kein Fake-Social-Proof, keine Nav-Punkte ohne
  echtes Ziel.
- Positionierung: echte Infra-/Ops-Arbeit, nicht "wirkt wie KI-Prosa mit Deko obendrauf".

---

## Konzept D — "Terminal Session" (radikale Reduktion, Anti-Marketing)

**Struktur:** Kein Grid, keine Cards, kein Hero-Bild. Die gesamte Startseite ist eine simulierte
Terminal-Session — echte Befehlsstruktur (`whoami`, `systemctl list-units --type=service`,
`docker ps`), deren Ausgabe-Zeilen die 8 echten Projekte sind, inklusive echtem Live-Status
inline als "ACTIVE (running)" / "degraded" wie ein reales `systemctl status`. Klick auf eine
Zeile expandiert die Case-Study inline darunter (ein-spaltig, kein Reflow-Problem wie beim
Grid). Fast komplett monochrom (Schwarz/Weiß), Akzentfarbe nur für Prompts/aktive Zeile — keine
Gradients, kein Glass, kein Glow.

**Warum das der Wow-Effekt ist:** kein anderes Portfolio geht so weit in Richtung "das ist
buchstäblich, wie ich meine Server checke" — Un-Design als bewusste Aussage, nicht aus Mangel an
Gestaltung. Radikal anders als jedes Marketing-Template.

**Risiko:** kippt leicht ins Gimmick, wenn die Terminal-Illusion nicht durchgängig sauber
bleibt (echte Befehle, echte Syntax, keine Fake-ASCII-Spielerei). Barrierefreiheit braucht
besondere Sorgfalt (Screenreader dürfen nicht durch Pseudo-Terminal-Zeichen gestört werden).

```
luis@zntx:~$ systemctl list-units --type=service
● foodapp.service         active (running)   since Mai 2026
● ravepuls.service        active (running)   since Jul 2026   [Deploy vor 5 Std.]
● matrix-chat.service     active (running)   since Jul 2026
● buchhaltung.service     active (running)   since Aug 2026   [internal]
● qntx.service            active (paper)     since Jul 2026
○ wcp-arma.service        inactive (dead)    archiviert
luis@zntx:~$ cat ravepuls.service
```

---

## Konzept E — "Betriebsprotokoll" (Timeline, jetzt mit echten Live-Daten)

**Struktur:** Wiederaufnahme von Konzept B aus der ersten Runde (damals nicht gebaut) — aber
diesmal mit echten Zeitstempeln aus den `/status`-Endpoints angereichert statt nur groben
`since`-Monatsangaben. Eine durchgängige, chronologische Spur von "erster Server aufgesetzt" bis
heute — Projekte erscheinen als datierte Einträge, echte Meilensteine (Domain-Migration,
Sicherheitsaudits, der n8n-Crash) stehen gleichberechtigt neben Projekt-Starts. Live-Status
erscheint am aktuellen Ende der Timeline als "heute"-Marker.

**Navigation:** vertikal, entlang der Zeit — keine Sprungnavigation zwischen Themen, keine
Cards.

**Warum das der Wow-Effekt ist:** ist wörtlich eine verifizierbare Historie, keine Behauptung —
"das lief nicht nur, das lief nachweisbar seit X, mit Y Vorfällen, Z Härtungsrunden". Betont
Kontinuität/Verlässlichkeit über Zeit, das genaue Gegenteil von "hübsches Template".

**Risiko:** am wenigsten visuell spektakulär — trägt sich über Schreibe/Dichte der echten
Ereignisse, nicht über einen visuellen Kniff. Manche Projekte haben nur grobe Datumsangaben
("Ende Mai / Anfang Juni") — reicht für die Timeline, aber ungleichmäßige Präzision auffällig.

```
2025 ──●───────────────────────────────────────────────────→ heute
  Nov  │ n8n-Automation gestartet
  Feb  │ Crash → Server-Reset, Guardrail-Disziplin entsteht
       │
  Mai26│ ● foodapp live
  Jun26│ ● wcp-arma live
  Jul26│ ● ravepuls · matrix-chat · qntx (paper) · zntx live
  Aug26│ ● buchhaltung live · Sicherheitsaudits (ravepuls, qntx, buchhaltung)
       │ ● wcp-arma archiviert
  heute│ 5/8 Systeme mit Live-Status — zuletzt: ravepuls, Deploy vor 3 Std.
```

---

## Konzept F — "Zwei Racks" (echte Topologie, diesmal als volles Interface)

**Struktur:** Wiederaufnahme/Weiterentwicklung von Konzept C — zwei einfache, selbst gebaute
SVG-Rack-Illustrationen (geometrisch, kein Stock-/KI-Bild) für Server 1 und Server 2,
nebeneinander. Jedes Projekt ist eine Einschub-Einheit im jeweiligen Rack, mit einer echten
Status-LED (Farbe = Live-Status, nicht dekorativ). Klick auf eine Einheit öffnet die Case-Study
als Panel, das Rack bleibt als "Zuhause"-Ansicht sichtbar.

**Warum das der Wow-Effekt ist:** ist eine Eins-zu-eins-Karte der echten Zwei-Server-Realität,
keine Metapher — wer klickt, erkundet buchstäblich, was auf welcher Maschine läuft.

**Risiko:** am nächsten dran, wieder zu "hübsches Diagramm statt Text" zu kippen, wenn die
Illustration nicht zurückhaltend bleibt. Braucht eigenes, einfacheres Mobile-Layout (Racks
vermutlich gestapelt statt nebeneinander unterhalb von Tablet-Breite). Mehr Illustrations-
Aufwand als D oder E.

```
┌── SERVER 1 ──────────┐    ┌── SERVER 2 ──────────┐
│ ● foodapp         ●  │    │ ● wcp-arma (archiv) ○ │
│ ● ravepuls        ●  │    │ ● qntx (paper)      ● │
│ ● matrix-chat     ●  │    │ ● motortown         ● │
│ ● buchhaltung     ●  │    └───────────────────────┘
│ ● zntx            ●  │
└───────────────────────┘
```

---

## Nicht gebaut, nur skizziert
Alle drei bewusst nur beschrieben, kein Full-Build — Auswahl folgt zuerst.
