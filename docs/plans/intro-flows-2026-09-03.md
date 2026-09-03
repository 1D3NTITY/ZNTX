# zntx — Boot-Intro, Datenflüsse, prozedurale Grafik

**Stand:** 2026-09-03 · **Anlass:** "der Website fehlt noch mehr Animation, Intro-Animation,
hochauflösende Grafiken, Flows — Terminal-Style ist cool, aber da fehlt noch was."

## Grundsatzentscheidung: prozedural statt Stock

"Kostenlose Grafiken" bewusst NICHT als Stock-Material (Unsplash/Figma-Packs/3D-Blobs):
genau die tauchen in jeder zweiten Vorlage auf und erzeugen exakt den Beliebigkeits-Eindruck,
den Luis bereits zweimal selbst als Problem benannt hat — zusätzlich Lizenz-/Nachweispflichten.

Stattdessen im Code erzeugte Grafik (SVG/Canvas):
- auflösungsunabhängig, also auf jedem Display scharf (das eigentliche "hochauflösend")
- keine Lizenzfrage, keine externen Requests (CSP-konform)
- einzigartig für diese Seite
- inhaltlich passend: gezeichnete echte Topologie statt gekaufter Symbolbilder

## A — Boot-Intro (der eigentliche "Intro"-Wunsch)

Ganzseitiges Overlay beim ersten Besuch: Röhrenmonitor fährt hoch, POST-artige Zeilen in
Bernstein, danach kurzer CRT-Einschalt-Effekt (horizontaler Aufzieh-Strich), Seite erscheint.

Harte Randbedingungen:
- **Nur beim ersten Besuch pro Sitzung** (`sessionStorage`) — beim zweiten Aufruf nervt es.
- **Kurz:** Zielwert ≤ 1,4 s. Warten ist das Gegenteil von beeindruckend.
- **Jederzeit abbrechbar** (Klick/beliebige Taste/Escape) mit sichtbarem Hinweis.
- **Inhalt liegt immer vollständig im DOM darunter** — das Overlay ist rein visuell. Kein
  Gating von Inhalt: Suchmaschinen, Screenreader und Nutzer ohne JS sehen die Seite sofort.
- **prefers-reduced-motion → komplett übersprungen**, kein Overlay.
- Kein Layout-Shift: Overlay ist `position: fixed`, verschiebt nichts.

Inhalt der Zeilen: nur Wahres (2 Hosts, Anzahl Systeme, Abrufzeit) — dieselbe Ehrlichkeits-
regel wie im Terminal, keine erfundenen "Hacking"-Zeilen.

## B — Datenflüsse zwischen den Racks (der "Flow"-Wunsch)

SVG-Ebene hinter/zwischen den beiden Racks: Verbindungslinien mit wandernden Lichtpunkten
("Paketen"), plus Anbindung Racks → Terminal.

Ehrlichkeitsregel: Ein Fluss wird nur für Systeme animiert, die **tatsächlich erreichbar**
sind (Live-Status vorhanden). Tote/archivierte Systeme bekommen eine matte, statische Linie —
die Animation behauptet damit nichts Falsches, sondern zeigt echten Zustand.

Technik: reines SVG + CSS (`stroke-dasharray`/`offset`-Animation bzw. bewegte Punkte entlang
`<path>`), keine neue Bibliothek. Bei reduzierter Bewegung: Linien bleiben, Punkte stehen still.

## C — Prozedurale Hintergrundgrafik

Ersetzt die aktuell recht generischen Aurora-Blobs (die stammen noch aus der Vorlagen-Phase)
durch eine eigene, zur Erzählung passende Ebene:

- **Leiterbahnen-Raster**: rechtwinklige Bahnen mit Lötpunkten, sehr dezent, langsam
  wanderndes Leuchten entlang einzelner Bahnen (Canvas oder SVG, deterministisch erzeugt).
- Tiefe durch zwei Ebenen mit unterschiedlicher Geschwindigkeit/Deckkraft (Parallaxe-Andeutung).
- Deckkraft so niedrig, dass Fließtext-Lesbarkeit unangetastet bleibt (Kontrast wird nachgemessen,
  nicht geschätzt).

## Risiken, die aktiv geprüft werden

- **Leistung:** Es liegen bereits Aurora-Blobs + CRT-Overlay (Scanlines/Korn/Vignette/Spotlight)
  auf der Seite. Kommen Canvas-Animationen dazu, droht Ruckeln auf schwacher Hardware.
  → Messung der Bildrate, ggf. Aurora-Blobs entfernen statt stapeln.
- **Lesbarkeit:** Jede neue Leuchtebene kann Text schwächen. → Kontrast an konkreten Stellen
  messen (wie beim bereits gefundenen Button-Bug), nicht nach Gefühl beurteilen.
- **Erstkontakt-Dauer:** Intro darf den Weg zum Inhalt nicht verlängern.

## Verifikation

1. `bun run lint` + `bun run build`.
2. Playwright: Intro läuft und endet; zweiter Aufruf ohne Intro; Abbruch per Taste/Klick;
   reduced-motion ohne Overlay; Inhalt ohne JS vorhanden.
3. Flüsse: animiert nur bei erreichbaren Systemen, statisch bei toten/archivierten.
4. Bildraten-Messung mit allen Ebenen aktiv (Desktop + gedrosselte CPU).
5. Kontrastmessung Fließtext/Buttons über der neuen Hintergrundebene.
6. Mobile ohne horizontales Overflow, keine Konsolenfehler, keine Hydration-Warnung.
7. Commit; Redeploy nur nach frischer Bestätigung.
