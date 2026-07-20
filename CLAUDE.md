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

## TODO für die Implementierungs-Session (noch nicht gemacht)
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
