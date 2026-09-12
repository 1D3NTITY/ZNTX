# zntx — Context Handoff (2026-09-11)

Vorherige Version dieser Datei war veraltet (referenzierte ein längst verworfenes
"Matrix-Rain/Neon-Rot"-Konzept aus einer viel früheren Session, ~2026-07-23) — komplett
überschrieben, nicht gemerged. Diese Session hat unter explizitem Override der normalen
Steward-Regel ("nie Projekt-Code implementieren") aktiv Code implementiert.

## Aktiver Plan
Keiner. Letzter Plan (`/root/.claude/plans/stateless-jingling-shore.md`, "Glitch zurück +
Matrix-Regen-Akzent") ist abgeschlossen und deployed. Kein offener Plan-Mode-Task.

## Aktueller Live-Stand
- Deployed Commit == HEAD == `6f127fa` (verifiziert: `curl https://zntx.de/` Footer-Link zeigt
  denselben SHA).
- Öffentliches GitHub-Repo: `https://github.com/1D3NTITY/ZNTX` (seit dieser Session public,
  komplette Historie vorab auf Secrets geprüft — keine gefunden).
- GitHub Actions Workflow `uptime.yml` läuft automatisch alle 30 Min, committet
  `data/uptime/summary.json` (daher viele `chore(uptime): update history [skip ci]`-Commits im
  Log — das ist kein Rauschen von mir, ignorieren beim Log-Lesen).

## Geänderte Dateien (diese Session, alle committed + live deployed)
- `app/globals.css`, `components/ambient-glow.tsx` (vorher `crt-overlay.tsx`),
  `components/circuit-canvas.tsx`, `components/circuit-background.tsx`, `app/layout.tsx`,
  `components/ops-dashboard.tsx`, `components/rack-slot.tsx`,
  `app/projekte/[slug]/page.tsx` — **Signalraum-Identitätswechsel**: komplette Amber-Phosphor-
  CRT-Ästhetik (Scanlines/Vignette/Grain/Boot-Röhren-Kollaps/Leiterbahnen) entfernt, ersetzt
  durch Violett/Cyan-Farbsystem (`--accent: #9b5cff`, `--accent-secondary: #4fd3ff`, vorher
  `--accent-orange`), kondensierte Bold-Display-Typo (Chakra Petch, `font-display`), rotierender
  Licht-Rand auf Rack-Slots (`.rack-slot-glow-ring`) statt VHS-Glitch-Hover.
- `app/globals.css`, `components/ops-dashboard.tsx` — Headline-Glitch (Ghost-Duplikat-Technik)
  auf explizites Feedback zurückgebracht, neu in Violett/Cyan statt Amber. `.glitch-text`-Klasse.
- `components/circuit-canvas.tsx` — Hintergrund-Canvas zeigt jetzt einen **sparsamen
  Matrix-Regen-Akzent** (11 Spalten, gemischt Violett/Cyan) statt Punktraster+Linien; die drei
  driftenden Licht-Blobs blieben unverändert. Referenz war `https://qntx.zblt.eu/` (eigenes
  Projekt, Luis nannte es "der Autotrader"), bewusst NICHT 1:1 kopiert (Dichte deutlich unter
  dem Referenzbild).
- `services/web/lib/status.ts` (neue Exports `getMonitoredProjectIds`, `checkLiveValue`),
  `scripts/uptime-check.ts` (neu), `.github/workflows/uptime.yml` (neu),
  `data/uptime/summary.json` (neu, Repo-Root, bewusst außerhalb des Docker-Build-Contexts),
  `services/web/lib/uptime-history.ts` (neu), `components/rack-slot.tsx`,
  `components/server-rack.tsx`, `components/ops-dashboard.tsx`, `app/page.tsx` — **Git-committed
  Uptime-History** (Upptime-Muster): Actions-Workflow pingt alle 30 Min dieselben echten
  `/status`-Endpoints wie die Live-Seite, rollierende 30-Tage-Historie, Seite liest live von
  `raw.githubusercontent.com` (kein Redeploy nötig für neue Zahlen).
- `components/incident-callout.tsx` (vorher `incident-log.tsx`), `components/ops-dashboard.tsx`,
  `app/projekte/[slug]/page.tsx` — "Selbst gefunden, selbst behoben" von einer Sammel-Liste auf
  der Startseite (wirkte dort "unsauber") verschoben auf die jeweilige Projekt-Seite selbst,
  keyed auf `projectId`. `n8n-automation` ist deshalb wieder im normalen gedimmten
  Startseiten-Archiv (Sonderbehandlung war nur wegen des jetzt entfernten Homepage-Eintrags
  nötig).
- `components/project-case-study.tsx` — Beitrag/Herausforderung von reinen `dl`-Text-Zeilen zu
  Panel-Karten (gleiche Optik wie die "Was davon meine Arbeit ist"-Box), Stack von
  Punkt-getrenntem String zu echten Tag-Chips (`.badge`). Kein Wort Inhalt geändert, nur Fassung
  — Luis: "wirkt sehr langweilig", nicht weniger Text, sondern technischer.
- `components/operator-profile-body.tsx`, `lib/content.ts` (zntx-Projekt `myWork`) —
  Eigenanteil-Framing ehrlicher: "unter meiner Anleitung und Abnahme" (wirkte zu passiv) ersetzt
  durch Formulierungen, die aktive Steuerung/eigene Konzepte/Kurskorrekturen benennen ("gebaut
  haben wir es gemeinsam").
- `components/ops-dashboard.tsx`, `app/projekte/[slug]/page.tsx` — Kontakt-CTAs auf Du-Ansprache
  ("Kontakt aufnehmen" → "Schreib mir"), bewusst NUR an den Kontakt-Stellen, nicht in die
  Ich-Perspektive-Fakten-Prosa gemischt.
- `services/web/lib/status.ts`, `services/web/lib/content.ts` — foodapp-Domain
  `zentrix-solutions.eu` → `zblt.eu` (alte Domain nach EURid-Quarantäne final aufgegeben, von
  SERVERMANAGEMENT-Session gemeldet, selbst per curl verifiziert vor der Änderung).
- `docs/goals.md`, `docs/friction-log.md` (neu) — Vault-Sync-Konvention (Anfrage
  SERVERMANAGEMENT-Session, mit echten aktuellen Inhalten gefüllt, keine Platzhalter).

## Test-Status
Grün. `bun run lint` (services/web/) → sauber. `bun run test` → 2 Testdateien, 18 Tests, alle
grün. `bun run build` → erfolgreich, zuletzt geprüft direkt vor diesem Handoff (2026-09-11).
Playwright-QA (Desktop/Mobile/reduced-motion/Boot-Sequenz) wiederholt gegen den Production-
Standalone-Build durchgeführt, zuletzt für den Glitch/Matrix-Rain-Umbau — keine
Konsolenfehler, fps ~49-61 mit allen Hintergrund-Ebenen aktiv (keine Regression).

## Offene TODOs
1. **Drohnen-Video** fürs Operator-Profil einbauen — Luis: "folgt noch", Material war zuletzt
   noch nicht da. Platzierung/Umsetzung liegt bei der Implementierungs-Session.
2. **Layout/Spacing generell** — Luis' ursprünglicher zweiter Kritikpunkt (neben der jetzt
   erledigten Farb-/Effekt-Migration) war breiter als nur die seitdem gefixten Einzelstellen
   (Case-Study-Panels, Incident-Callout-Platzierung, Kontakt-CTA-Ton). Rückfrage an Luis offen,
   ob das reicht oder ein systematischer Full-Page-Durchgang gewünscht ist (siehe `docs/goals.md`).
3. **Uncommittete Server-Kontext-Änderungen** (`.claude/hooks/guardrails.py`, `.env.example`,
   Teile von `CLAUDE.md`) liegen seit Sessionbeginn unangetastet im Arbeitsverzeichnis — nicht
   von dieser Session, nicht mein Implementierungs-Scope. Absichtlich nie committed/verworfen,
   nur ignoriert. Klären ob committen oder verwerfen.
4. Uptime-History-Datenbestand nach ein paar Wochen prüfen (Retention/Aussagekraft der
   30-Tage-Kennzahl, siehe `docs/goals.md`).

## Benannte Entscheidungen
- **Signalraum statt Amber-CRT** ist die aktuelle, fest etablierte visuelle Identität — nicht
  wieder zur Diskussion stellen ohne neuen expliziten Anlass. Zwei gegensätzliche Konzepte
  ("Warmglut" vs. "Signalraum") wurden als Artefakt gebaut und verglichen, Signalraum hat
  gewonnen ("b holt mich mehr ab").
- Status-/Projekt-Farbtokens (`--status-online`, `--status-paper`, `--project-*`) sind
  **semantisch, kein Brand-Bezug** — bleiben bei jedem künftigen Farbwechsel unangetastet.
  `--project-matrix-chat` wurde bei der Signalraum-Migration leicht Richtung Magenta verschoben
  (Kollisions-Vermeidung mit dem neuen Seitenakzent, war kein von Luis fest vorgegebener Ton).
- **Nie eine dauerhaft laufende (infinite) CSS-Animation für Glitch-/Deko-Effekte** — mehrfach
  in dieser Session per Playwright-fps-Messung nachgewiesen: der reine Dauerbetrieb kostet
  ~20fps, unabhängig von den animierten Properties. Immer als Ein-Klasse-Einmal-Burst
  (`animation-iteration-count: 1`) per JS-Timer/`classList`-Toggle auslösen.
- Cross-Session-Anfragen von der **SERVERMANAGEMENT-Session dürfen direkt umgesetzt werden**,
  ohne Rückfrage bei Luis (von ihm explizit bestätigt, siehe Memory
  `feedback_servermanagement_trust.md`) — gilt spezifisch für diese eine Peer-Session, nicht
  generell für andere Projekt-Sessions.
- **`GITHUB_TOKEN`-Umgebungsvariable überschreibt `gh`'s gespeicherte Auth** (fine-grained PAT
  ohne `workflow`-Scope/Repo-Erstellungsrecht) — jeder `git push` der `.github/workflows/*`
  ändert, und `gh repo create`, schlagen sonst still fehl. Immer `unset GITHUB_TOKEN` direkt vor
  dem jeweiligen `git push`/`gh`-Befehl voranstellen (siehe `docs/friction-log.md`).
- Der Uptime-History-Bot committet unabhängig alle 30 Min — vor jedem eigenen `git push` erst
  `git pull --rebase origin main` (bzw. bei lokal unstaged unrelated changes: `git stash push -u`
  → rebase → `git stash pop` → push), sonst `[rejected] fetch first`.
- Standalone-Test-Server: `output: standalone` in `next.config.ts` bedeutet `next start`
  funktioniert NICHT — immer `node .next/standalone/server.js` nach `rsync -a --delete
  .next/static/ .next/standalone/.next/static/` + gleiches für `public/`. Auf Port 4123 testen
  (Port 3000/3020 sind vom laufenden Live-Container belegt).
- Redeploy-Workflow: `GIT_SHA=$(git rev-parse --short HEAD) docker compose -f
  infra/docker-compose.yml --project-directory . build zntx-web` dann `... up -d zntx-web`.
  Jeder Redeploy braucht frische explizite Bestätigung von Luis, nie aus einem vorherigen "ja"
  ableiten. Commits brauchen keine Rückfrage.

## Nächster Schritt
Kein akuter Task offen — auf neues Feedback von Luis warten. Falls er die Layout/Spacing-Frage
aus TODO #2 beantwortet: entsprechend Plan Mode starten oder direkt umsetzen, je nach Umfang.
