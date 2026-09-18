# zntx

**Live-Infrastruktur statt Lebenslauf-Prosa.** Mein technisches Portfolio — zeigt, was gerade
läuft, statt nur zu behaupten, was ich kann.

[![Uptime Check](https://github.com/1D3NTITY/ZNTX/actions/workflows/uptime.yml/badge.svg)](https://github.com/1D3NTITY/ZNTX/actions/workflows/uptime.yml)
[![Last Commit](https://img.shields.io/github/last-commit/1D3NTITY/ZNTX)](https://github.com/1D3NTITY/ZNTX/commits/main)

🔗 **Live:** [zntx.de](https://zntx.de)

## Was das hier zeigt

Kein Template, kein Showcase-Mockup — die Seite betreibt sich selbst und zeigt echte
Betriebsdaten, keine erfundenen:

- **Zwei unabhängige Live-Signale pro Projekt** — fachlicher Status (projekteigener
  `/status`-Endpoint, z. B. "läuft der Sync noch") und reine Erreichbarkeit (self-hosted
  Uptime Kuma), bewusst nie zu einem Wert verrechnet.
- **Git-committed Uptime-Historie** — ein GitHub-Actions-Workflow pingt alle 30 Minuten
  dieselben Endpoints wie die Live-Seite und committet eine rollierende 30-Tage-Historie,
  ohne eigenes Backend dafür.
- **Ehrlicher Fallback statt erfundener Zahl** — schlägt ein Fetch fehl, zeigt die Seite
  "keine Live-Daten" statt eine alte oder geratene Zahl weiterzureichen.
- **Zwei produktive Root-Server**, sichtbar getrennt nach Workload (Web-Apps/Datenbanken vs.
  Gameserver/Trading-Automatisierung).

## Stack

Next.js (App Router) · TypeScript · Tailwind · Drizzle ORM + Postgres · Docker Compose ·
Caddy · Vitest

## Betrieb

Deploy per Docker Compose, kein Service direkt exponiert (`ports:`) — Caddy ist der einzige
Ingress. Details/Konventionen in [`CLAUDE.md`](./CLAUDE.md).
