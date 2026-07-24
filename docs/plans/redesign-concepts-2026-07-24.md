# zntx — 3 grundverschiedene Konzeptrichtungen

Kontext: die letzten Iterationen (Matrix-Rain, Ton, ROLE_FIT, Zurück-Links) waren alle
Politur derselben Terminal-/Dossier-Richtung. Luis' Einwand: abnehmender Ertrag, echte
Verbesserung braucht strukturell verschiedene Alternativen, nicht mehr Feinschliff an
einer Richtung. Diese drei unterscheiden sich in Struktur/Navigations-Modell/Metapher,
nicht nur in Farbe/Font. Keine davon ist gebaut — reine Skizze zur Auswahl.

Feste Rahmenbedingungen für alle drei:
- Farbsystem pro Projekt ist bereits festgelegt (nicht verhandelbar): ravepuls=rot,
  zntx=schwarz/rot (Basis-Identität der Seite selbst), qntx=blau, armaserver/zblt=gelb/gold.
  Wichtig: die zntx-eigene Rot-Identität (Chrome/Nav/Headlines) muss sich von "ravepuls ist
  rot" unterscheiden lassen — Projekt-Farbe nur an der Projekt-Einheit selbst (Status-Punkt/
  Knoten/Marker), nie am Seiten-Chrome.
- Positionierung: echte Infra-/Ops-Arbeit zeigen (2 Server, Docker/Caddy/Postgres-Betrieb),
  nicht "wirkt wie KI-Prosa mit Deko obendrauf".
- Kein Zurück zum "Rack"-Konzept (explizit verworfen).

---

## Konzept A — Live-Ops-Leitstand (Status-Dashboard)

**Struktur:** Kein scrollender Hero mit Boot-Sequenz. Stattdessen sofort beim Laden eine
persistente Status-Leiste mit allen 7 Systemen (6 Projekte + Operator-Profil als eigener
Eintrag) — wie ein echtes NOC-Dashboard: Farb-Punkt (Projekt-eigene Farbe) + Name + Status
(LIVE/PAPER-TRADING/ARCHIVIERT) + Laufzeit seit + eine Zeile Kontext. Klick auf ein System
öffnet die volle Case-Study als Drawer/Accordion — der Besucher wählt, was er vertieft, statt
sich durch 6 Sections zu scrollen, die ihn vielleicht nicht alle interessieren.

**Navigation:** klick-/drilldown-basiert, nicht scroll-narrativ.

**Warum ehrlich statt Deko:** bildet genau ab, wie Luis seine eigene Infrastruktur tatsächlich
überwacht — Übersicht zuerst, Details auf Anfrage.

**Risiko:** mehr Interaktions-/State-Aufwand (Accordion/Drawer) als eine lineare Scroll-Seite;
Mobile-Verhalten muss sauber durchdacht werden (Drawer vs. Stack).

```
┌─────────────────────────────────────────────┐
│ ● foodapp        LIVE      seit Mai 2026     │→ Klick öffnet Case-Study
│ ● ravepuls (rot) LIVE      seit Jul 2026     │  als Drawer/Panel
│ ● matrix-chat    LIVE      seit Jul 2026     │
│ ● wcp/arma (gold)LIVE      seit Jun 2026     │
│ ● qntx (blau)    PAPER     seit Jul 2026     │
│ ● n8n-automation ARCHIVIERT Nov25–Feb26      │
│ ● Operator-Profil —                          │
└─────────────────────────────────────────────┘
```

---

## Konzept B — Betriebsprotokoll / Timeline-Ledger

**Struktur:** Eine durchgängige, chronologische Timeline entlang der bereits vorhandenen
`since`-Daten in `content.ts` — ein Log/Ledger von "was seit wann läuft", nicht
themenweise gruppierte Case-Studies. Projekte erscheinen als datierte Log-Einträge neben
echten Meilensteinen (Server-Aufsetzen, Domain-Migration, der n8n-Crash+Neuaufbau als
echter Zeitpunkt in der Timeline statt als separater "Signature Moment"-Ausreißer).
Skills/Arbeitsweise als Annotations-Spur neben der Timeline statt eigene Section.

**Navigation:** vertikal scrollen entlang der Zeit, keine Sprungnavigation zwischen Themen.

**Warum ehrlich statt Deko:** ist wörtlich die Wahrheit — "hier ist die tatsächliche
Betriebshistorie", betont Kontinuität/Verlässlichkeit über Zeit statt eine Sammlung
unzusammenhängender Projekt-Kacheln.

**Risiko:** am wenigsten visuell "wow" von den dreien — trägt sich über Schreibe/Timing,
nicht über einen großen visuellen Kniff. Braucht durchgängig sinnvolle Datumsangaben
(teils grob, z. B. "Ende Mai / Anfang Juni 2026" — reicht, aber die Erzählung hängt davon ab).

```
2025 ────●──────────────────────────────────────────────→ 2026
   Nov25 │ n8n-Automation gestartet
         │
   Feb26 │ Crash → Server-Reset (rot markiert)
         │
   Mai26 │ ● foodapp live
   Jun26 │ ● wcp/arma live (gold)
   Jul26 │ ● ravepuls (rot) · matrix-chat · qntx (blau, paper) · zntx
```

---

## Konzept C — Topologie als Haupt-Interface

**Struktur:** Das bestehende `network-graph.tsx` (aktuell kleines Nav-Widget) wird zur
eigentlichen Startansicht — vollflächig im ersten Viewport: zwei Server-Knoten (Server 1 /
Server 2), jedes Projekt als verbundener Kind-Knoten in seiner eigenen Marken-Farbe. Der
Besucher navigiert durch Klicken/Erkunden des Graphen statt linear zu scrollen. Case-Studies
öffnen als Overlay/Panel bei Knoten-Auswahl, der Graph bleibt als "Home"-Ansicht sichtbar/
persistent.

**Navigation:** explorativ, graph-first statt dokument-first.

**Warum ehrlich statt Deko:** ist wörtlich eine Karte von Luis' echter Zwei-Server-Topologie
— keine aufgesetzte Metapher, sondern strukturell identisch mit der realen Infrastruktur.

**Risiko:** am nächsten am bereits verworfenen "Rack"-Konzept in dem Sinn, dass Diagramm vor
Text kommt — Unterschied: baut auf einer bestehenden, bereits gut angenommenen Komponente auf
(`network-graph.tsx`), keine neue industrielle Bildsprache. Braucht ein eigenes, einfacheres
Mobile-Layout (Graphen sind auf kleinen Screens schwierig — vermutlich Liste statt Graph
unterhalb von Tablet-Breite).

```
        ┌────────────┐        ┌────────────┐
        │  SERVER 1  │        │  SERVER 2  │
        └─────┬──────┘        └─────┬──────┘
    ┌──────────┼──────────┐         ├───────────┐
 foodapp   ravepuls(rot) matrix-chat  wcp/arma(gold)  qntx(blau)
```

---

## Nicht gebaut, nur skizziert
Alle drei sind bewusst nur beschrieben, kein Full-Build — Auswahl folgt zuerst.
