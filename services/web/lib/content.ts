export type ProjectStatus = "live" | "paper-trading" | "internal";

export type ProjectNode = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  stack: string[];
  highlights: string[];
  status: ProjectStatus;
  server: "server-1" | "server-2";
};

// Reihenfolge = Reihenfolge auf der Netzwerkkarte. zntx zuletzt (Meta-Knoten: "du bist hier").
export const PROJECTS: ProjectNode[] = [
  {
    id: "foodapp",
    name: "Food & Fitness App",
    role: "Multi-Platform-Produkt",
    tagline:
      "FastAPI-Backend, Next.js-Web, Expo/React-Native-Mobile mit OTA-Updates. Gesundheitsdaten → DSGVO Art. 9 aktiv umgesetzt.",
    stack: ["FastAPI", "Next.js", "Expo / React Native", "Postgres", "Alembic", "n8n"],
    highlights: [
      "Zugriffskontrolle, Export & Löschung für Gesundheitsdaten (Art. 9 DSGVO)",
      "OTA-Updates für die Mobile-App ohne Store-Review-Wartezeit",
      "Strukturierte Sprint-/Release-Disziplin mit Versionierung & Changelog",
    ],
    status: "live",
    server: "server-1",
  },
  {
    id: "ravepuls",
    name: "Ravepuls",
    role: "Event-Discovery-Plattform",
    tagline:
      "ravepuls.de — automatisiertes Aggregieren von Rave-Infos aus Social Media, plus manuelle Pflege.",
    stack: ["FastAPI", "Next.js", "Telethon", "Browserless/Chromium", "Cloudflare Turnstile"],
    highlights: [
      "Telegram-Userbot + Browser-Automation fürs Scraping",
      "Eigene CSP/Security-Header, Cloudflare-Turnstile-Bot-Schutz",
      "Domain-Migration .eu → .de sauber mit Redirects gelöst",
    ],
    status: "live",
    server: "server-1",
  },
  {
    id: "matrix-chat",
    name: "matrix-chat",
    role: "Privater Matrix-Homeserver",
    tagline:
      "Selbst gehostet (Tuwunel/Rust), Federation bewusst deaktiviert, Invite-Only per Token.",
    stack: ["Tuwunel (Rust)", "RocksDB (embedded)", "Caddy"],
    highlights: [
      "Betrieb von Nicht-Standard-Infra, nicht nur Web-Apps",
      "Invite-Only per Token statt offener Registrierung",
      "Bewusst ohne Federation — reduzierte Angriffsfläche",
    ],
    status: "live",
    server: "server-1",
  },
  {
    id: "wcp-arma",
    name: "WCP / Arma-Community-Server",
    role: "Discord-Bot + Gameserver-Ops",
    tagline:
      "Discord-Bot (Python/discord.py, ~5000 Zeilen) mit OAuth2-Dashboard und RCON zu einem laufenden Arma-Reforger-Server.",
    stack: ["discord.py", "OAuth2", "RCON", "Pterodactyl/Wings", "Docker"],
    highlights: [
      "~36 Hybrid-Commands, Ticket-System mit persistenten Discord-Views",
      "Live-Spieler-Tracking über RCON-Integration",
      "Läuft seit Monaten produktiv für eine echte Community",
    ],
    status: "live",
    server: "server-2",
  },
  {
    id: "qntx",
    name: "qntx",
    role: "KI-gestützter Krypto-Trading-Bot",
    tagline:
      "Kraken/CCXT, aktuell in strukturierter Paper-Trading-Phase vor Live-Go-Live — mit dokumentierten Go-Live-Kriterien statt 'einfach live schalten'.",
    stack: ["CCXT", "Optuna", "Monte-Carlo-Backtesting", "8-Modell-KI-Ensemble"],
    highlights: [
      "13 orthogonale Handelssignale, Sentiment-Ensemble mit Mehrheitsentscheid & Ausfallschutz",
      "Walk-Forward-validiertes Gewichtstuning (Optuna)",
      "Vollständige Risikokette: Stop-Loss, Kill-Switch, Drawdown-Stop",
    ],
    status: "paper-trading",
    server: "server-2",
  },
  {
    id: "zntx",
    name: "zntx",
    role: "Dieses Portfolio — du bist hier",
    tagline:
      "Next.js + Docker Compose + Caddy + eigene Postgres-DB, mit deterministischen Guardrail-Hooks statt Blindvertrauen in KI-Edits.",
    stack: ["Next.js", "Docker Compose", "Caddy", "Postgres", "Drizzle ORM"],
    highlights: [
      "Eigene PreToolUse-Guardrail-Hooks gegen Secret-Leaks & Scope-Verletzungen",
      "Kein Public-Port-Exposure — Caddy bleibt einziger Ingress",
      "Diese Seite selbst ist der Skill-Nachweis, nicht nur ihr Inhalt",
    ],
    status: "live",
    server: "server-1",
  },
];

export type SkillCategory = {
  category: string;
  items: string[];
};

// "Quer über alle Projekte" — das eigentliche Skill-Profil, nicht pro Projekt einzeln erzählt.
export const CROSS_CUTTING_SKILLS: SkillCategory[] = [
  {
    category: "Infrastruktur",
    items: [
      "Multi-Server-Linux-Betrieb (2 eigene Root-Server)",
      "Docker-Compose-Architektur pro Projekt",
      "Caddy-Ingress mit Cloudflare-DNS-ACME",
      "SSH-Härtung (Key-only, ein Key pro Gerät)",
    ],
  },
  {
    category: "Daten",
    items: [
      "Postgres-Isolation: eine DB pro Service, nie geteilt",
      "Secrets-Hygiene — .env-Disziplin, nie committen",
    ],
  },
  {
    category: "KI-gestützte Entwicklung",
    items: [
      "Eigene deterministische Guardrail-Hooks (Python, PreToolUse)",
      "Schutz gegen Secret-Leaks, Force-Pushes, Scope-Verletzungen",
      "Bewusste Trennung: KI implementiert, Mensch reviewt & entscheidet",
    ],
  },
  {
    category: "Sicherheitsbewusstsein",
    items: [
      "DSGVO-Umsetzung bei echten Gesundheitsdaten",
      "Kill-Switches & Risikoketten bei echtem Kapitalrisiko",
      "Kein Service je direkt exponiert — nur über Caddy",
    ],
  },
];

export const BIO = {
  heading: "Operator-Profil",
  dayJob: "Vollzeit Warenausgabe in einem Möbelhaus, Minijob als Staplerfahrer.",
  passion:
    "Nebenbei: mehrere Root-Server, echte Produktiv-Infrastruktur, FPV-Drohnen-Foto- und Videografie.",
  note:
    "Kein Blender-Lebenslauf — die Projekte auf dieser Karte laufen wirklich, mit echtem Betrieb dahinter.",
};

export const FPV_SHOWCASE = {
  heading: "FPV-Aufnahmen",
  note:
    "Eigenes Foto-/Videomaterial folgt hier, sobald Rohmaterial gesichtet und geschnitten ist.",
};
