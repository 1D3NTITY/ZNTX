# zntx — Context Handoff (2026-09-17)

Vorherige Version (2026-09-11) komplett überschrieben, nicht gemerged. Luis lässt die Seite ab
hier bewusst ruhen ("erstmal ruhen lassen können") — diese Session hat vor der Pause einen
vollständigen Check gemacht (Tests/Lint/Build/Live-Smoke-Test/Doku-Aktualität), siehe unten.

## Aktiver Plan
Keiner. Letzter Plan (`/root/.claude/plans/moonlit-zooming-papert.md`, "Health-Bar statt
Prozent-Text") ist abgeschlossen und deployed. Kein offener Plan-Mode-Task.

## Aktueller Live-Stand
- Deployed Commit == HEAD == `2a0627b` (verifiziert: `curl https://zntx.de/` Footer-Link zeigt
  denselben SHA). Die drei Doku-Commits danach (CLAUDE.md/decisions.md/dieser Handoff) sind
  reine Textänderungen ohne `services/web/`-Bezug — kein Redeploy nötig, geprüft.
- Live-Smoke-Test (diese Session, vor der Pause): `/`, `/projekte/{wardogs-community,foodapp,
  wcp-arma,n8n-automation}`, `/datenschutz`, `/impressum`, `/robots.txt`, `/sitemap.xml` — alle
  HTTP 200. Zwei grep-Treffer auf "undefined"/"nan" untersucht, beide False Positives (React-RSC-
  Payload-Serialisierung bzw. das Wort "be**nan**nt") — kein echter Fehler, siehe
  `docs/friction-log.md` (dort schon als bekanntes grep-Limit dokumentiert).
- `bun run lint` / `bun run test` (18 Tests, 2 Dateien) / `bun run build` — alle grün, zuletzt
  direkt vor diesem Handoff geprüft.
- GitHub Actions `uptime.yml` läuft automatisch alle 30 Min, committet
  `data/uptime/summary.json` (fachliche `/status`-Historie **und** seit 2026-09-16 zusätzlich
  Kuma-Erreichbarkeits-Historie) — die vielen `chore(uptime): ...`-Commits im Log sind kein
  Rauschen von mir.

## Geänderte Dateien (diese Session, alle committed + live deployed, in dieser Reihenfolge)
- `app/globals.css`, `components/boot-intro.tsx`, `app/layout.tsx` — Boot-Intro-LEDs/Bloom von
  `--status-online` (Grün, wirkte neben dem violetten/cyanen Rest der Seite als Fremdkörper) auf
  `--accent-secondary` (Cyan) umgestellt — nur im Boot-Intro, echte Live-Dashboard-Punkte bleiben
  grün. Sequenz gestrafft, härterer Snap mit Overshoot statt Soft-Fade, kräftigerer Bloom-Flash.
  `layout.tsx`-Collapse-Timeout dabei auf den echten `systems=9` neu kalibriert (war unbemerkt
  auf `systems=8` veraltet).
- `services/web/lib/kuma.ts` (neu), `scripts/uptime-check.ts`, `services/web/lib/uptime-
  history.ts`, `components/rack-slot.tsx`, `components/server-rack.tsx`,
  `components/ops-dashboard.tsx`, `app/page.tsx` — **Kuma-Reachability als zweites,
  unabhängiges Live-Signal**. Liest die self-hosted Uptime-Kuma-Instanz von SERVERMANAGEMENT
  (`status.zblt.eu`, öffentliche Heartbeat-API, kein Login, kein CORS-Header → nur serverseitig
  nutzbar). Bewusst getrennt von der bestehenden fachlichen `/status`-Historie gehalten, nie
  verrechnet — SERVERMANAGEMENT-Präzedenzfall: foodapp meldete tagelang `operational`, obwohl der
  Sync tot war; Kuma hätte das nie bemerkt, der fachliche Check schon. Kuma-Daten werden wie die
  bestehende Historie im Actions-Lauf geholt und committet, nie live zur Request-Zeit gefetcht.
- `services/web/lib/content.ts`, `services/web/lib/labels.ts`, `services/web/app/globals.css`,
  `components/ops-dashboard.tsx`, `components/project-case-study.tsx` — **ZBLT/wardogs-
  community-Karte** (neuer Status `"concept"`/KONZEPTPHASE, Projektschlüssel bleibt
  `wardogs-community`, Crew-Name/Anzeigename "ZBLT — Zivile Bergung, Logistik & Transport"),
  **Archiv-Konsolidierung** (ein Block für alle `status === "archived"`-Projekte statt zwei
  verschiedener Behandlungen je nach `server`-Feld) und **Editorial-Redesign** der Projekt-
  Detailseiten (Kontext/Beitrag/Herausforderung/Ergebnis/Note als durchgehender Textfluss statt
  Box/Zitat-Stil-Mix — Boxen nur noch für echte Daten-Elemente).
- `services/web/lib/content.ts` (Folge-Commit) — Website-Link (`https://zblt.eu`) nachgezogen,
  sobald die wardogs-Session ihren Vorbehalt (Seite zeigte noch den alten Arma-Abschiedshinweis)
  ausgeräumt hatte — selbst per curl verifiziert, bevor gesetzt.
- `services/web/lib/uptime-history.ts`, `services/web/components/health-bar.tsx` (neu),
  `components/rack-slot.tsx` — **Health-Bars statt Prozent-Text**: beide Historie-Zeilen zeigen
  jetzt Tages-Segmente (up/partial/down) statt einer Zahl, dünn + mit Glow (rounded-full, `h-1`,
  einstufiger `box-shadow`). Prozentzahl bleibt als `sr-only`-Text + Tooltip erhalten.
- `.env.example` — Platzhalter statt hartkodierter Defaults/`changeme`.
- `CLAUDE.md`, `docs/decisions.md` — Scaffold-Ära-Reste bereinigt (Stack/TODO-Abschnitt war seit
  Monaten veraltet, "kein App-Code" stand da, obwohl die Seite längst live ist), EU-AI-Act-
  Bildnachweis aktualisiert (die vier echten Screenshots unter `public/screenshots/` existierten
  längst, der Eintrag sagte noch "public/ ist leer" — Ergebnis der Prüfung bleibt unverändert:
  echte Screenshots, kein KI-Bildmaterial, Kennzeichnungspflicht weiter nicht einschlägig).
- `docs/goals.md` — laufend nachgepflegt (Layout-Punkt + Uncommitted-Files-Punkt als erledigt
  markiert, neuer Punkt für die Kuma-Retention-Prüfung in ein paar Wochen ergänzt).

## Test-Status
Grün. `bun run lint` → sauber. `bun run test` → 2 Testdateien, 18 Tests, alle grün. `bun run
build` → erfolgreich. Live-Smoke-Test (9 URLs) → alle 200, keine echten Konsolen-/Render-Fehler
gefunden (siehe oben). Kein Playwright-Lauf diese Session — der lokale Standalone-Testserver
wurde vom Nutzer per Permission-Prompt abgelehnt, daher nur Live-Site-Checks nach jedem Deploy.

## Offene TODOs
1. **Drohnen-Video** fürs Operator-Profil — Luis: "folgt noch", Material war zuletzt noch nicht
   da. Platzierung/Umsetzung liegt bei der nächsten Implementierungs-Session.
2. **Uptime-Historie nach ein paar Wochen prüfen** (Retention/Aussagekraft der 30-Tage-Kennzahl,
   beide Signale — fachlich und Kuma) — siehe `docs/goals.md`.
3. `docs/friction-log.md`: `GITHUB_TOKEN` überschreibt `gh`-Auth bleibt offen (wiederkehrende
   Falle, kein Fix möglich, nur Workaround `unset GITHUB_TOKEN` vor jedem betroffenen Befehl).

## Benannte Entscheidungen
- **Health-Bars (Tages-Segmente) statt Prozent-Zahlen** ist jetzt die feste Darstellung für beide
  Uptime-Signale im Rack-Slot — Live-LED bleibt für "genau jetzt" unverändert bestehen.
- **Zwei unabhängige Live-Signale (fachlich + Kuma) werden nie verrechnet** — SERVERMANAGEMENT-
  Leitplanke, siehe `lib/kuma.ts`-Kopfkommentar. Gilt als Architekturprinzip für jede künftige
  dritte Datenquelle genauso.
- **ZBLT-Projektschlüssel bleibt `wardogs-community`**, auch wenn der Anzeigename/die Domain
  "ZBLT"/"zblt.eu" heißt — von Luis explizit so entschieden ("ZBLT ist ja nur die Domain").
- Cross-Session-Anfragen von der **SERVERMANAGEMENT-Session dürfen direkt umgesetzt werden**
  (siehe Memory `feedback_servermanagement_trust.md`) — gilt NICHT automatisch für alles: bei
  öffentlich sichtbaren Text-/Namens-Änderungen wurde in dieser Session trotzdem jedes Mal
  Luis' direkte Bestätigung eingeholt, nicht nur die Peer-Relay-Nachricht vertraut (mehrfach
  gab es Kehrtwenden bei genau diesem Thema — reine Vorsicht, kein Widerspruch zur Memory).
- **`GITHUB_TOKEN`-Umgebungsvariable überschreibt `gh`'s gespeicherte Auth** — immer `unset
  GITHUB_TOKEN` direkt vor `git push`/`gh`-Befehlen (siehe `docs/friction-log.md`).
- Vor jedem eigenen `git push`: `git fetch origin main` + `git pull --rebase origin main` (bei
  lokal unstaged unrelated Changes: `git stash push -u` → rebase → `git stash pop` → push) — der
  Uptime-Bot committet unabhängig alle 30 Min, sonst `[rejected] fetch first`.
- Redeploy-Workflow: `GIT_SHA=$(git rev-parse --short HEAD) docker compose -f
  infra/docker-compose.yml --project-directory . build zntx-web` dann `... up -d zntx-web`. Jeder
  Redeploy braucht frische explizite Bestätigung von Luis, nie aus einem vorherigen "ja"
  ableiten. Commits brauchen keine Rückfrage.
- Standalone-Test-Server (Port 4123, `node .next/standalone/server.js` nach `rsync` von
  `static`/`public`) ist als Workflow weiter gültig, wurde diese Session aber per Permission-
  Prompt abgelehnt — vor erneutem Versuch kurz fragen statt automatisch wieder aufzusetzen.

## Nächster Schritt
Keiner — Seite ruht auf Luis' Wunsch. Bei Wiederaufnahme: dieses Handoff lesen, `docs/goals.md`
für den aktuellen TODO-Stand prüfen, dann auf neues Feedback warten.
