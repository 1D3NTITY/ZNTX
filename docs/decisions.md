# Entscheidungen & Compliance-Checks

## EU AI Act Art. 50 — Kennzeichnungspflicht (Inventar-Check 2026-07-25)

Hintergrund: Art. 50 tritt am 2.8.2026 in Kraft — Kennzeichnungspflicht für KI-generierte/
manipulierte Bild-/Audio-/Video-Inhalte (maschinenlesbares Wasserzeichen/Metadaten) und für
KI-Text, der die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse informiert.
Keine Rechtsberatung — bei Unsicherheit fachlich gegenchecken, hier nur der technische
Ist-Zustand.

**Bilder/Grafiken/Videos:** Keine vorhanden. `services/web/public/` existiert nicht, keine
`next/image`-/`<img>`-Verwendung, kein Favicon/OG-Image im Layout konfiguriert — die gesamte
Seite ist reines Text/CSS/SVG (Matrix-Rain = DOM-Text-Knoten + CSS-Animation, Status-Punkte =
inline-gestylte `<span>`, kein Rasterbild irgendwo). Kennzeichnungspflicht für Bild/Video
damit aktuell nicht einschlägig, mangels Bildmaterial.

**Text:** Case-Study-/Bio-Texte sind Eigenbeschreibung von Luis' eigenem Werdegang und
Projekten (Portfolio/Selbstdarstellung), keine Berichterstattung über Angelegenheiten von
öffentlichem Interesse im Sinne der Norm — analog einem Lebenslauf. Vermutlich nicht von der
Text-Kennzeichnungspflicht erfasst, aber wie oben: keine Rechtsberatung, im Zweifel
gegenchecken statt annehmen.

**Standing Rule für zukünftige Content-/Design-Arbeit an zntx:** nur Original-/eigene Bilder
verwenden, falls überhaupt je Bildmaterial dazukommt — dann stellt sich die Kennzeichnungsfrage
gar nicht erst. Bei KI-generierten Bildern (falls das je gewünscht wird) technische Kennzeichnung
von Anfang an mitdenken, nicht nachträglich draufsetzen.

**Ergebnis:** Kein Handlungsbedarf zum jetzigen Zeitpunkt. Bei zukünftigen Änderungen (Bilder,
neue Textformate) diesen Eintrag erneut prüfen.
