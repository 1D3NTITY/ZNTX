# zntx — Context Handoff (2026-09-23)

Ausgelöst durch SERVERMANAGEMENT-Token-Analyse (Session lief bei ~562k Kontext, neue globale
Konvention: bei >150k abschließen + Handoff + `/clear`). Vorherige Version (2026-09-17,
"Seite ruht") komplett überschrieben — die Ruhephase wurde durch mehrere neue Anfragen von Luis
unterbrochen (Kuma-Health-Bars, ChatGPT-Zweitmeinung, ZBLT-Rename, neue /status-Seite).

## Aktiver Plan
Keiner. Letzter Plan (`/root/.claude/plans/moonlit-zooming-papert.md`, "/status —
ausführliche Live-/Uptime-Übersichtsseite") ist abgeschlossen und deployed.

## Aktueller Live-Stand
- Deployed Commit == HEAD == `a448cd4` (verifiziert per curl-Footer-Link).
- `git status` clean, nichts uncommitted.
- Neue Route `/status` (menschliche Übersichtsseite, alle gemonitorten Projekte) + neuer
  `/api/status`-Endpoint für zntx selbst (JSON, "basic"-Schema, DB-Health-Check).
- Actions-Bot committet weiter automatisch alle 30 Min (`chore(uptime): ...`-Rauschen im Log,
  ignorieren).

## Geänderte Dateien (seit dem letzten Handoff, alle committed + deployed)
- `lib/content.ts`, `lib/labels.ts`, `app/globals.css`, `ops-dashboard.tsx`,
  `project-case-study.tsx` — ZBLT/wardogs-community-Karte (Status "concept"), Archiv-
  Konsolidierung, Editorial-Redesign der Detailseiten.
- `lib/kuma.ts` (neu), `scripts/uptime-check.ts`, `lib/uptime-history.ts`, `rack-slot.tsx`,
  `server-rack.tsx`, `ops-dashboard.tsx`, `app/page.tsx` — Kuma-Reachability als zweites,
  unabhängiges Live-Signal (git-committed, kein Live-Fetch zur Request-Zeit).
- `components/health-bar.tsx` (neu, `HealthBar`/`HealthBarRow`) — Tages-Segmente statt
  Prozent-Text, an drei Stellen wiederverwendet: Rack-Slot, Projekt-Detailseite, `/status`.
- `app/status/page.tsx` (neu), `app/api/status/route.ts` (neu), `footer.tsx`, `sitemap.ts` —
  neue ausführliche Status-Seite + eigener Endpoint für zntx.
- `lib/content.ts` — ChatGPT-Zweitmeinung geprüft und teilweise umgesetzt: `HERO.headlineEmphasis`/
  `subline` von hardcodierten Prosa-Zahlen zu Funktionen (Root-Fix für einen Bug, der zweimal
  zuschlug), "Sicherheitsaudits"-Tooltip ergänzt, ZBLT-Name auf schlicht "ZBLT" reduziert (keine
  Langform — weder die alte noch der neue Vorschlag "Zitronenblüte", Cannabis-Sorten-Referenz,
  passt nicht zu einem recruiter-gerichteten Portfolio).
- `README.md`, `docs/decisions.md`, `CLAUDE.md`, `.env.example` — Scaffold-Ära-Reste bereinigt,
  GitHub-About-Metadaten gesetzt, README-Ton entschärft.

## Test-Status
Grün. `bun run lint` sauber, `bun run test` 18/18, `bun run build` erfolgreich — zuletzt direkt
vor diesem Handoff geprüft. `status.test.ts` einmal repariert (hardcodierte Endpoint-Zahl 5→
dynamisch), sonst nichts Offenes.

## Offene TODOs
1. **ZBLT-`/status`-Endpoint fehlt noch** — bei der zblt-Session (`ListAgents` → "zblt", Remote
   Control) angefragt (2026-09-20), noch keine Antwort. Sobald URL kommt: in
   `services/web/lib/status.ts` `STATUS_ENDPOINTS` eintragen.
2. Drohnen-Video fürs Operator-Profil — wartet weiter auf Material von Luis.
3. Uptime-/Kuma-Historie nach ein paar Wochen auf Plausibilität prüfen (`docs/goals.md`).
4. `GITHUB_TOKEN` überschreibt `gh`-Auth — weiterhin `unset GITHUB_TOKEN` vor jedem
   `git push`/`gh`-Befehl (siehe `docs/friction-log.md`).

## Benannte Entscheidungen
- **Zwei unabhängige Live-Signale (fachlich + Kuma) werden nie verrechnet** — Architekturprinzip,
  gilt für jede künftige dritte Quelle genauso (siehe `lib/kuma.ts`-Kopfkommentar).
- **Hardcodierte Prosa-Zahlen in Hero-Texten sind verboten** — zwei Bugs dieser Art in einer
  Session reichen. `HERO.headlineEmphasis`/`subline` sind jetzt Funktionen mit echten Werten.
- **ZBLT-Projektschlüssel bleibt `wardogs-community`**, Anzeigename ist schlicht "ZBLT" ohne
  Langform-Auflösung — von Luis an mein Urteil delegiert ("wie es sich am besten liest"), gegen
  Cannabis-Referenz entschieden wegen Recruiter-Zielgruppe.
- **ChatGPT-Zweitmeinungen werden gegen den echten Code geprüft, nicht blind übernommen** — bei
  Bedarf Plan-Mode mit A/B/C/D-Klassifikation (bestätigt/teilweise/bereits gelöst/verworfen),
  siehe letzter Plan-Verlauf für das Muster.
- Redeploy-Workflow unverändert: `GIT_SHA=$(git rev-parse --short HEAD) docker compose -f
  infra/docker-compose.yml --project-directory . build zntx-web` dann `... up -d zntx-web`,
  jedes Mal frische Bestätigung von Luis nötig, Commits nicht.
- Vor jedem `git push`: `git fetch` + `git pull --rebase origin main` (Uptime-Bot committet
  unabhängig alle 30 Min), `unset GITHUB_TOKEN` davor.

## Nächster Schritt
Kein akuter Task. Bei Resume: falls die zblt-Session inzwischen geantwortet hat, deren
`/status`-Endpoint eintragen (TODO 1). Sonst auf neues Feedback von Luis warten.
