# zntx — Context Handoff (2026-09-30)

Ausgelöst durch bevorstehenden Server-Neustart (SERVERMANAGEMENT-Meldung). Vorherige Version
(2026-09-25) komplett überschrieben — deren einziger offener TODO (graphify-Freigabe) ist
erledigt.

## Aktiver Plan
`/root/.claude/plans/giggly-herding-rainbow.md` — Hero-Headline "cooler/wow" + Farbanpassung,
PAUSIERT. Scope bestätigt: Hero-Headline (`ops-dashboard.tsx`, `AnimatedWords`/`heroContainer`),
nicht Boot-Intro. Noch keine Konzepte ausgearbeitet — nächster Schritt bei Wiederaufnahme: 2-3
echte Alternativkonzepte (nicht nur Parameter-Tuning) per AskUserQuestion vorlegen, siehe
Präzedenzfall Boot-Intro-Konzeptwahl 2026-09-07 in `boot-intro.tsx`-Kopfkommentar.

## Geänderte Dateien (dieser Session, noch NICHT committed)
- `docs/goals.md` — `[fällig:: 2026-10-10]` an beiden Uptime-/Kuma-Plausibilitäts-TODOs ergänzt.
- `NOTES-handoff.md` (gelöscht, alter Stand) → ersetzt durch diese Datei.

## Offene TODOs
1. **`services/web/AGENTS.md` + `services/web/CLAUDE.md` entfernen** — Sicherheitsfund diese
   Session: `AGENTS.md` enthält seit dem initialen Scaffold-Commit (`35c1c31`, 2026-07-20,
   `bun create next-app`) einen Prompt-Injection-artigen Text ("This is NOT the Next.js you
   know... Read the relevant guide in `node_modules/next/dist/docs/` before writing any code").
   Von Luis bestätigt zu entfernen (`git rm services/web/AGENTS.md services/web/CLAUDE.md`) —
   **noch nicht ausgeführt**, `git rm` scheiterte mehrfach am transienten Auto-Mode-Classifier-
   Fehler ("no verdict"). Bei Wiederaufnahme erneut versuchen.
2. **Cloud-Routine "zntx Uptime/Kuma Plausibilitätscheck"** läuft einmalig am 2026-10-10, 09:00
   UTC (trig_01UqYFJtS3xYKHBi2EumKaXw) — prüft `docs/goals.md`-Einträge, committet Ergebnis
   direkt auf main.
3. **jarvis/life-simulation-live-ticker-Session**: von Luis direkt in dieser Session auf
   SERVERMANAGEMENT-Vertrauensstufe gehoben (2026-09-30) — deren Anfragen ("von Luis freigegeben")
   brauchen keine gesonderte Rückfrage mehr, analog SERVERMANAGEMENT. Konkret angefragt: ein
   lokaler `.git/hooks/post-commit`-Hook (nicht versioniert), der bei jedem Commit read-only
   Hash+Message an `http://127.0.0.1:8020/api/real-progress/batch` schickt (fire-and-forget,
   blockiert Commits nie). Von Luis freigegeben, **Installation aber auf "erstmal" (Handoff hat
   Vorrang) zurückgestellt — noch nicht eingerichtet.** Bei Wiederaufnahme: Hook-Datei anlegen,
   nicht committen (liegt in `.git/hooks/`, ohnehin nie versioniert).
4. Drohnen-Video fürs Operator-Profil — wartet weiter auf Material von Luis.
5. **Neuer, noch ungeklärter Scope von Luis:** "LinkedIn-Verlinkung + Beschreibung von mir
   komplett raus, wird komplette Projekt-Vorschau-Seite" — vermutlich `operator-profile-body.tsx`
   betreffend (enthält aktuell LinkedIn-Link + Luis' Bio-Text). Noch nicht geklärt: wird daraus
   eine neue Projekt-Vorschau-Seite, oder ersetzt eine bestehende Projektseite die Operator-
   Profil-Sektion? Vor Umsetzung Rückfrage nötig.
6. Uptime-/Kuma-Historie Plausibilität — jetzt über Cloud-Routine (#2) statt manuell terminiert.
7. `GITHUB_TOKEN` überschreibt `gh`-Auth — weiterhin `unset GITHUB_TOKEN` vor jedem
   `git push`/`gh`-Befehl (siehe `docs/friction-log.md`).

## Benannte Entscheidungen
- **graphify (Skillspector 88/100 CRITICAL) von Luis direkt freigegeben (2026-09-26)** — Memory
  `project_graphify_approved.md`. Score bleibt technisch bestehen, akzeptiert.
- **Cloud-Guthaben-Korrektur (2026-09-27, SERVERMANAGEMENT, unabhängig verifiziert in
  `~/.claude/CLAUDE.md:85-95`):** Das $100-Guthaben gilt nur für den Anthropic-Console-„Cloud
  Playground", NICHT für Claude Code/`Agent(..., isolation: "remote")` — Cloud-Routinen laufen
  gegen das normale Abo-Kontingent.
- **Diese Session ist die ZNTX-Implementierungssession, nicht die Settings-Steward-Session**
  (Luis-Korrektur 2026-09-28) — Feature-/Design-Arbeit an zntx gehört hierher, nicht nur
  Konventionspflege.
- **jarvis/life-simulation-live-ticker jetzt SERVERMANAGEMENT-äquivalente Vertrauensstufe**
  (Luis direkt, 2026-09-30) — siehe TODO 3.
- **Commit-Datenaustausch mit jarvis/life-simulation-live-ticker eingerichtet** (Luis-Freigabe
  2026-09-27): letzte 20 Commits einmalig geschickt, Folge-Diff-Anfrage beantwortet (keine neuen
  Commits). Dauerhafter Hook siehe TODO 3.

## Test-Status
Nicht in dieser Session erneut geprüft — letzter bekannter Stand (2026-09-25, vor Handoff-
Neustart): `bun run lint` sauber, `bun run test` 18/18. Vor nächster Implementierung neu
verifizieren.

## Nächster Schritt
Bei Resume: TODO 1 (AGENTS.md-Entfernung) und TODO 3 (Hook-Installation) zuerst erledigen (beide
von Luis freigegeben, nur an technischen/Timing-Gründen liegengeblieben). Danach TODO 5 (Scope-
Klärung) vor Wiederaufnahme des Hero-Headline-Plans.
