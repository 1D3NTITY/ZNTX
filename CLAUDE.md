# zntx — Persönliches Portfolio (Luis)

Zeigt Infos über Luis' technisches Profil: was er macht, Links, kleiner Leistungsnachweis/
Skills-Überblick. Solo-Projekt, öffentlich. Domain: `zntx.de` (Apex).

Details/Inhalt: noch offen, folgt in der Tiefplanung (`docs/plans/`).

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
Noch offen. Default-Fallback laut globaler `~/.claude/CLAUDE.md`, falls nicht explizit anders
entschieden: Next.js + Tailwind + shadcn/ui, Docker Compose, Caddy als einziger Ingress (kein
`ports:` in Compose). Entscheidung liegt bei der Implementierungs-Session, nicht vorentschieden.

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

## TODO für die Implementierungs-Session (Stand 2026-07-30: einiges davon bereits umgesetzt —
## Punkte 2-4 laut laufendem Container/Caddy-Route offenbar erledigt, hier aber nicht mehr
## nachgepflegt; bei Gelegenheit aktualisieren/abhaken)
Dieses Projekt wurde am 2026-07-20 nur als Grundgerüst angelegt (Settings-Steward-Rolle:
Ordnerstruktur, `CLAUDE.md`, `.claude/`-Settings) — kein App-Code, kein Compose-Stack, keine
laufende Session. Für den eigentlichen Aufbau:
1. Stack-Entscheidung treffen (siehe oben), `docs/plans/` anlegen
2. Docker-Compose-Service bauen (KEIN `ports:` — nur Caddy-Route)
3. Caddyfile: im bestehenden `zntx.de { ... }`-Block den `handle { respond 404 }`-Fallback durch
   `reverse_proxy localhost:<PORT>` ersetzen; die beiden `.well-known/matrix/*`-Handler
   unverändert lassen
4. Neue tmux-Session anlegen (z.B. `zntx-N`, Gruppe `zntx`), analog zu `foodapp-0`/`ravepuls-1`,
   `claude` dort starten
5. `.env.example` anlegen, sobald der Stack feststeht

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
