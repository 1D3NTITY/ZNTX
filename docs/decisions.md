# Entscheidungen & Compliance-Checks

## EU AI Act Art. 50 — Kennzeichnungspflicht (Inventar-Check 2026-07-25)

Hintergrund: Art. 50 tritt am 2.8.2026 in Kraft — Kennzeichnungspflicht für KI-generierte/
manipulierte Bild-/Audio-/Video-Inhalte (maschinenlesbares Wasserzeichen/Metadaten) und für
KI-Text, der die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse informiert.
Keine Rechtsberatung — bei Unsicherheit fachlich gegenchecken, hier nur der technische
Ist-Zustand.

**Bilder/Grafiken/Videos:** Keine eigenen vorhanden. `services/web/public/` ist leer, keine
`next/image`-/`<img>`-Verwendung, kein OG-Image im Layout konfiguriert — die gesamte Seite ist
reines Text/CSS/SVG (Matrix-Rain = DOM-Text-Knoten + CSS-Animation, Status-Punkte =
inline-gestylte `<span>`, kein Rasterbild irgendwo). Einzige Ausnahme: `app/favicon.ico` —
unverändertes `create-next-app`-Standard-Icon aus dem initialen Scaffold-Commit (`35c1c31`,
verifiziert 2026-08-01: einziger Commit in der Datei-Historie), kein KI-generiertes Bild.
Kennzeichnungspflicht für Bild/Video damit weiterhin nicht einschlägig, mangels
KI-generiertem Bildmaterial.

**Text:** Case-Study-/Bio-Texte sind Eigenbeschreibung von Luis' eigenem Werdegang und
Projekten (Portfolio/Selbstdarstellung), keine Berichterstattung über Angelegenheiten von
öffentlichem Interesse im Sinne der Norm — analog einem Lebenslauf. Vermutlich nicht von der
Text-Kennzeichnungspflicht erfasst — aber Devise (Luis, 2026-07-25): bei Compliance-Grauzonen
lieber zu vorsichtig als zu freizügig entscheiden, nicht nur die wahrscheinlichste Auslegung
annehmen (siehe `[[feedback-dsgvo-erring-cautious]]`). Passt ohnehin zur bestehenden
Positionierung der Seite (`CLAUDE.md`: "das meiste an Text/Content entsteht im Zusammenspiel
mit KI" — soll gezeigt, nicht versteckt werden). Vorschlag als Sicherheitsmarge, unabhängig
von der Rechtsfrage: ein kurzer, ehrlicher Hinweis auf KI-Unterstützung bei der Texterstellung
(z. B. im Footer oder auf `/datenschutz`) — kostet nichts, macht die Frage komplett
gegenstandslos statt sich auf eine Auslegung zu verlassen. **Umgesetzt** (2026-07-25): Sektion
"Inhalte & KI-Unterstützung" auf `/datenschutz` (`app/datenschutz/page.tsx`).

**Standing Rule für zukünftige Content-/Design-Arbeit an zntx:** nur Original-/eigene Bilder
verwenden, falls überhaupt je Bildmaterial dazukommt — dann stellt sich die Kennzeichnungsfrage
gar nicht erst. Bei KI-generierten Bildern (falls das je gewünscht wird) technische Kennzeichnung
von Anfang an mitdenken, nicht nachträglich draufsetzen.

**Ergebnis:** Kein akuter Handlungsbedarf, Sicherheitsmarge (KI-Hinweis auf `/datenschutz`)
umgesetzt. Bei zukünftigen Änderungen (Bilder, neue Textformate) diesen Eintrag erneut prüfen.
