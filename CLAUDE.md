# zntx — Persönliches Portfolio (Luis)

Zeigt Infos über Luis' technisches Profil: was er macht, Links, kleiner Leistungsnachweis/
Skills-Überblick. Solo-Projekt, öffentlich. Domain: `zntx.de` (Apex).

**Stand 2026-09-17:** Live und produktiv deployed, kein Scaffold mehr. "Live Infrastructure
Atlas"-Konzept: zwei Server-Racks (echte `server`-Zuordnung aus `lib/content.ts`), pro Projekt
ein Live-Status (`lib/status.ts`, projekteigene `/status`-Endpoints), eine git-committete
30-Tage-Historie (`scripts/uptime-check.ts`, GitHub Actions alle 30 Min) und seit 2026-09-16
zusätzlich eine unabhängige Kuma-Erreichbarkeits-Historie (`lib/kuma.ts`) — beide als
Health-Bars im Rack-Slot, bewusst nie zu einem Wert verrechnet. Aktueller Umfang/offene Punkte:
siehe `docs/goals.md`.

**Positionierung (Luis, 2026-07-20):** Ja, das meiste an Text/Content entsteht im Zusammenspiel
mit KI — aber Server-Hosting, Domain-/DNS-Verwaltung, Infra-Betrieb (Docker/Caddy/Postgres,
mehrere produktive Server) sind echte, eigene Skills. Positionierung soll das zeigen, nicht nur
"schreibt mit KI" — z.B. über konkrete, nachprüfbare Infra-/Betriebsarbeit statt nur Prosa-
Selbstbeschreibung. Bei der Content-Planung berücksichtigen.

## Trennung von anderen Projekten — WICHTIG: geteilte Domain
`zntx.de` gehört sich NICHT allein diesem Projekt. `matrix.zntx.de` (Subdomain) +
`/.well-known/matrix/*` (auf dem Apex `zntx.de`) gehören `/srv/matrix-chat` (privater
Matrix-Homeserver). Im globalen Caddyfile (`/etc/caddy/Caddyfile`) hat der `zntx.de {}`-Block
schon zwei `handle /.well-known/matrix/...`-Blöcke — die bleiben unverändert. Dieses Projekt
übernimmt nur den `handle { respond 404 }`-Fallback am Ende desselben Blocks.

**Niemals** die beiden `.well-known/matrix/*`-Handler in `zntx.de {}` anfassen oder den
`matrix.zntx.de`-Block — das ist fremdes Projekt-Territorium (siehe `/srv/matrix-chat/CLAUDE.md`).

## Stack
Next.js (App Router) + Tailwind, `motion/react` für Animationen, Drizzle ORM + Postgres
(Kontaktformular), Vitest für Tests. Docker Compose (`infra/docker-compose.yml`, Service
`zntx-web`), Caddy als einziger Ingress (kein `ports:` in Compose). Deploy: `GIT_SHA=$(git
rev-parse --short HEAD) docker compose -f infra/docker-compose.yml --project-directory . build
zntx-web` dann `... up -d zntx-web` — Redeploy braucht immer frische, explizite Freigabe von
Luis, nie aus einem vorherigen "ja" ableiten (Commits nicht).

## Globale Regeln
Siehe `~/.claude/CLAUDE.md` (Server-Kontext, harte Regeln, Arbeitsweise) — gilt vollständig auch
hier: Plan-Mode vor Tasks >2 Dateien, TDD wo testbar, kein `ports:` in Compose (nur Caddy-Routen),
nie Migrationsdateien editieren, häufig committen.

## Bekannte Probleme (Steward-Hinweis, von dieser Session zu klären)
- **2026-07-30, erledigt am 2026-09-16:** Hinweis war, dass `ZNTX_DB_PASSWORD` beim
  Container-Start nicht gesetzt sei. Vom Steward gegengeprüft: die Rolle `zntx_app` in
  `infra-postgres-1` hat ein Passwort gesetzt (`pg_authid.rolpassword` nicht NULL), und
  Verbindungen über das Container-Netz laufen laut `pg_hba.conf` über `scram-sha-256`.
  Kein offenes Risiko mehr — der Hinweis bleibt nur als Beleg stehen, dass er geprüft wurde.

## rtk (Token-Optimizer)
Greift automatisch über den globalen PreToolUse-Hook (`/root/.claude/settings.json`) — kein
eigenes Setup hier nötig, siehe foodapp/ravepuls.

## Ziele & Friction-Log (Vault-Sync)
- Ziele in `docs/goals.md` pflegen: `- [ ] Text [status:: blockiert] [fällig:: YYYY-MM-DD]`
  (beides optional, ohne `status::` = offen). Bei Statusänderung sofort aktualisieren.
- Workflow-Reibung (Hook-Fehlalarm, fehlendes Tool, irreführende Regel) kurz in
  `docs/friction-log.md`: `- [ ] YYYY-MM-DD: Beschreibung [status:: offen|behoben]`.
  Kein Ticket-System — der Steward reviewt wöchentlich.
- Beide Dateien werden automatisch ins Obsidian-Server-Überblick-Vault gespiegelt.
