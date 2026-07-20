# zntx — Portfolio-Website: Aufbau (Stack, Compose, Caddy, Konzept)

## Context

`/srv/zntx` ist bisher nur Grundgerüst (`CLAUDE.md`, `.claude/`) ohne App-Code — angelegt am
2026-07-20 in der Settings-Steward-Rolle. Diese Session ist die erste Implementierungs-Session
(tmux `zntx-6`, Gruppe `zntx`). Ziel: Luis' technisches Profil zeigen — mit Betonung auf *echte*
Infra-/Betriebsarbeit (Docker/Caddy/Postgres über mehrere produktive Server), nicht nur "schreibt
mit KI". Domain `zntx.de` (Apex) wird mit `/srv/matrix-chat` geteilt — die beiden
`.well-known/matrix/*`-Handler und der `matrix.zntx.de`-Block sind fremdes Territorium und bleiben
unangetastet.

Kreative Richtung (mit Luis abgestimmt): Kein generisches SaaS-Portfolio. Verbindendes Konzept aus
zwei Geschmacks-Inputs (Watch Dogs/Matrix/Anonymous/Hitman/007/Assassin's Creed **und**
RimWorld/Cities:Skylines/MGSV/Far Cry/Just Cause) ist **"Control Room" / hackbare Netzwerkkarte**:
Projekte/Server als Knoten auf einem Grid, Scan-/Hack-HUD-Interaktion statt klassischer
Scroll-Cards, dunkles Terminal-Theme mit Simulation-Dashboard-Elementen (Stats, Ressourcen-Flow-
Optik). Explizit bestätigt: diese Richtung, nicht klassisches Scroll-Layout mit Hacker-Deko.

**Wichtiger Fund während der Recherche:** Die globale Hard-Rule in `~/.claude/CLAUDE.md`
("niemals `ports:` in Compose") ist veraltet — gelebte Praxis bei foodapp/ravepuls/matrix-chat ist
`ports: "127.0.0.1:PORT:PORT"` (Loopback-gebunden), weil Caddy als Host-systemd-Service läuft
(nicht containerisiert). Mit Luis abgestimmt: zntx übernimmt die Live-Praxis. **Follow-up nach
diesem Task** (separat, da globale Datei): `~/.claude/CLAUDE.md` entsprechend korrigieren, damit
die Regel nicht weiter widersprüchlich bleibt.

## Konventionen von Nachbarprojekten (recherchiert, foodapp/ravepuls/matrix-chat)

- **Ordnerstruktur**: `.claude/`, `.env`, `.env.example`, `.gitignore`, `CLAUDE.md`, `README.md`,
  `docs/plans/<feature>.md`, `infra/docker-compose.yml` + `infra/Caddyfile` (Repo-Kopie des
  Live-Blocks, "Live-Datei `/etc/caddy/Caddyfile` ist maßgeblich"), `services/web/`.
- **Compose**: explizites `name: zntx` (Pflicht — sonst Namenskollision, ist bei ravepuls real
  passiert), Service-Präfix `zntx-web`, `ports: "127.0.0.1:<PORT>:3000"`.
- **Postgres**: **eine gemeinsame Postgres-16-Instanz** (`infra-postgres-1`, gehostet im
  foodapp-Compose), nicht ein Container pro Projekt. Andere Projekte hängen sich per
  `networks: default: name: infra_default, external: true` an und bekommen eine **eigene DB +
  eigene Rolle** (z.B. `ravepuls_db` + Rolle `ravepuls_app`, nur auf diese DB berechtigt) — das
  erfüllt "eine DB pro Service, nie geteilt", ohne einen zusätzlichen Postgres-Container zu
  brauchen. Für zntx: `zntx_db` + Rolle `zntx_app`, `ZNTX_DB_PASSWORD` in `.env.example`
  (Inline-Kommentar, `openssl rand -hex 32` zum Generieren, analog ravepuls-Muster). DB/Rolle
  werden manuell per `psql` auf `infra-postgres-1` angelegt (wie bei ravepuls), kein eigenes
  Init-Script nötig.
- **Node-PM**: `bun` (globaler Default + ravepuls-Präzedenz, `bun.lock`).
- **Ports-Konvention**: `app.zentrix-solutions.eu` → 3000, `ravepuls.de` → 3010 → zntx: **3020**.

## Stack (final, mit Luis abgestimmt)

- Next.js 15 (App Router) + TypeScript + Tailwind
- **Motion** (Framer Motion Nachfolger) für Scroll-/Reveal-/HUD-Animationen, **Lenis** für Smooth
  Scroll
- Optional **React Three Fiber** für WebGL-Hintergrundeffekt (Glitch-/Partikel-Optik auf der
  Netzwerkkarte) — nur wenn Performance-Budget es zulässt, mit sauberem Fallback
- **shadcn/ui** nur für das Kontaktformular (Terminal-Prompt-Optik custom gestylt), nicht für die
  Netzwerkkarten-Sections (sonst generischer Look)
- **Drizzle ORM** + `postgres.js`/`node-postgres` gegen `zntx_db` auf `infra-postgres-1`
- Next.js Route Handler (`app/api/contact/route.ts`) für Kontaktformular-Einreichung
- Spam-Schutz: Cloudflare Turnstile (Präzedenz: ravepuls nutzt es bereits für Formulare, gleiches
  Muster übernehmen statt neu erfinden)

## Konzept & Content-Gliederung

Netzwerkkarte statt Scroll-Sections. Grober Aufbau:

1. **Hero / Boot-Sequence**: kurze Terminal-Boot-Animation (`whoami` / `scanning...`), dann
   Übergang zur Netzwerkkarte. `prefers-reduced-motion` → Boot-Sequence überspringen, sofort
   statische Karte.
2. **Netzwerkkarte (Kern)**: Knoten = Projekte/Server (foodapp, ravepuls, matrix-chat, zntx
   selbst — echte, laufende Infrastruktur, nicht nur Screenshots). Hover/Klick = Scan-Animation,
   HUD-Panel blendet ein: Stack, Rolle, was Luis konkret gebaut/betrieben hat. Das ist die
   nachprüfbare Infra-Positionierung aus `CLAUDE.md` — bewusst konkret, nicht Prosa.
3. **Skills-Panel**: als "Systemstatus"/Stats-Dashboard (Cities:Skylines-artig) statt
   Bullet-Liste — z.B. Kategorien (Infra, Backend, Frontend, KI-Tooling) mit visuellen
   Balken/Indikatoren.
4. **About/Bio-Knoten** ("Operator-Profil"): ehrliche Positionierung statt generischem
   Entwickler-Bio — Vollzeit Warenausgabe Möbelhaus + Minijob Staplerfahrer als Brotjob, daneben
   selbst betriebene Produktiv-Infrastruktur (mehrere Server, Docker/Caddy/Postgres) und
   FPV-Drohnen-Videografie als Leidenschaft. Genau die Art "nachprüfbare Arbeit statt
   Prosa-Selbstbeschreibung", die in `CLAUDE.md` gefordert ist — kein Blender-Lebenslauf.
5. **FPV-Showcase**: eigenes Foto-/Videomaterial (Drohnenaufnahmen) als Bildmaterial statt
   Stock-Assets — passt zum kinematischen 007/Assassin's-Creed-Look und ist authentisch
   selbst produziert. Format (Video-Loop im Hintergrund vs. Galerie-Sektion) hängt vom
   tatsächlich vorhandenen Material ab — mit Luis klären, sobald Rohmaterial bereitsteht.
6. **Kontakt**: Terminal-Prompt-Formular (`> name`, `> message`, `> send`), Turnstile im
   Hintergrund, Submit → Route Handler → Drizzle-Insert in `zntx_db`.

## Umsetzungsschritte

1. **Repo-Grundstruktur** anlegen: `services/web/` (Next.js via `bun create next-app`,
   TypeScript, Tailwind, App Router), `infra/docker-compose.yml`, `infra/Caddyfile` (Kopie des
   `zntx.de`-Blocks), `.env.example`, `.gitignore`, `docs/plans/` (dieser Plan wandert hierhin).
2. **`infra/docker-compose.yml`**: `name: zntx`, Service `zntx-web`, Build aus
   `../services/web`, `ports: ["127.0.0.1:3020:3000"]`, `networks: default: name: infra_default,
   external: true` (für Postgres-Zugriff), `env_file: ../.env`.
3. **Next.js-Grundgerüst**: App Router, Tailwind-Setup, Layout mit Dark-Theme als Default,
   Platzhalter-Netzwerkkarte (Struktur zuerst, Feinschliff-Animationen danach — sonst wird der
   erste Schritt zu groß).
4. **Motion + Lenis** einbinden, Scan-/Hover-HUD-Interaktion auf den Knoten bauen.
5. **Drizzle-Schema** (`contact_messages` Tabelle: id, name, message, created_at, ggf.
   turnstile-verified-flag) + Migration (neue Datei, nie bestehende editieren).
6. **Kontaktformular + Route Handler**: Turnstile-Verifikation server-seitig, Insert via Drizzle.
   **TDD**: erst Vitest-Tests für Validierung (leere Felder, zu lange Nachricht, fehlgeschlagene
   Turnstile-Verifikation) und die Insert-Funktion, committen, dann implementieren.
7. **Caddy**: im **bestehenden** `/etc/caddy/Caddyfile`, Block `zntx.de { ... }`, **nur** den
   letzten `handle { respond 404 }` ersetzen durch `reverse_proxy localhost:3020`. Neuer
   Security-Snippet `(csp_zntx)` analog `(csp_ravepuls_web)` — eigene CSP mit
   `challenges.cloudflare.com` in `script-src`/`connect-src`/`frame-src` für Turnstile, sonst
   `'self'`. Die beiden `.well-known/matrix/*`-Handler und `matrix.zntx.de` **nicht anfassen**.
   Nach Änderung: `caddy validate` vor jedem Reload (Reload selbst erst nach expliziter
   Bestätigung — Live-Datei, nicht die Repo-Kopie, ist maßgeblich für den echten Traffic).
8. **`.env.example`**: `ZNTX_DB_PASSWORD` (Inline-Kommentar, Generierungs-Hinweis),
   `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
9. Häufig committen (Conventional Commits) — nach Grundgerüst, nach Compose/Caddy-Vorbereitung,
   nach jedem grünen Test, nach Kontaktformular-Feature.

**Bewusst außerhalb dieses Plans** (Folge-Arbeit, nicht jetzt): tatsächlicher `docker compose up`
+ Caddy-Reload auf dem Live-System (separate Bestätigung nötig, da produktiv), Feinschliff der
WebGL-/Glitch-Effekte, `/deploy-service`-Skill-Äquivalent für zntx (existiert bisher nur bei
foodapp — ravepuls/matrix-chat nutzen direkte `docker compose`-Befehle; für zntx analog
entscheiden, sobald ein erster Deploy ansteht), Korrektur der veralteten `ports:`-Regel in
`~/.claude/CLAUDE.md`.

## Verifikation

- `bun run dev` in `services/web`, lokal im Browser durchklicken (Netzwerkkarte, Hover-HUD,
  Kontaktformular-Flow inkl. Fehlerfälle).
- Vitest-Suite grün für Validierung/Insert-Logik.
- `docker compose -f infra/docker-compose.yml config` zum Syntax-Check vor echtem Up.
- Lighthouse-Check (Performance/Accessibility) auf dem laufenden Dev-Build — harte Guardrail
  gegen "krass aber langsam".
- `caddy validate --config infra/Caddyfile` (bzw. gegen die Live-Datei) vor jedem Reload.
