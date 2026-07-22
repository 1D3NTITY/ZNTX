export type ProjectStatus = "live" | "paper-trading" | "internal" | "archived";

export type ProjectNode = {
  id: string;
  name: string;
  role: string;
  status: ProjectStatus;
  /** Optional: manche archivierten Projekte lassen sich keinem aktuellen Server mehr zuordnen. */
  server?: "server-1" | "server-2";
  url?: string;
  /** Grobes Laufzeit-Datum (Monat/Jahr), falls bekannt — keine Erfindung, leer lassen wenn unklar. */
  since?: string;
  stack: string[];
  /** Kontext / Problem — warum gibt es das Projekt überhaupt. */
  context: string;
  /** Mein Beitrag — was konkret gebaut/betrieben wurde. */
  contribution: string;
  /** Technische Herausforderung — der schwierigste Teil, nicht die Featureliste. */
  challenge: string;
  /** Ergebnis — was es heute beweist/leistet. */
  outcome: string;
  /** Optional: was daran besonders war, eine knappe Zeile. */
  note?: string;
};

// Reihenfolge = Reihenfolge im Fließtext. zntx zuletzt (Meta-Projekt: "du liest es gerade").
export const PROJECTS: ProjectNode[] = [
  {
    id: "foodapp",
    name: "Food & Fitness App",
    role: "Multi-Platform-Produkt",
    status: "live",
    server: "server-1",
    since: "Mai 2026",
    stack: ["FastAPI", "Next.js", "Expo / React Native", "Postgres", "Alembic", "n8n"],
    context:
      "Ein Multi-Platform-Produkt für Ernährungs- und Trainingsdaten — echte Gesundheitsdaten, nicht Fitness-Tracking zum Spaß. Sobald DSGVO Art. 9 greift, ist nachträglich eingebauter Datenschutz keine Option.",
    contribution:
      "FastAPI-Backend als gemeinsames Fundament für die Next.js-Web-App und die Expo/React-Native-Mobile-App, mit Zugriffskontrolle, Export- und Löschfunktion direkt im Datenmodell verankert. Releases über Alembic-Migrationen, feste Sprint-/Versionierungsdisziplin, n8n für Automatisierung im Hintergrund.",
    challenge:
      "Ein Backend für zwei grundverschiedene Clients konsistent halten, ohne Logik zu duplizieren — und OTA-Updates für die Mobile-App liefern, ohne auf App-Store-Review-Zyklen zu warten.",
    outcome:
      "Ein Produkt, das Gesundheitsdaten so behandelt, wie es das Gesetz verlangt — nicht weil ein Audit das später gefordert hätte, sondern weil es von Anfang an so gebaut wurde.",
  },
  {
    id: "ravepuls",
    name: "Ravepuls",
    role: "Event-Discovery-Plattform",
    status: "live",
    server: "server-1",
    since: "Juli 2026",
    url: "https://ravepuls.de",
    stack: ["FastAPI", "Next.js", "Telethon", "Browserless/Chromium", "Cloudflare Turnstile"],
    context:
      "Event-Discovery für die Rave-Szene einer Stadt — die Information existiert, ist aber über Dutzende Social-Media-Kanäle und Venue-Websites verstreut.",
    contribution:
      "Ein Telegram-Userbot liest konfigurierte Kanäle passiv mit, Browser-Automation (Browserless/Chromium) scraped Venue-Websites, die client-seitig rendern — beide Wege laufen in dieselbe Dedup-/Extraktions-Pipeline. Öffentliche Formulare mit Cloudflare Turnstile und eigener CSP gegen Missbrauch gehärtet.",
    challenge:
      "Eine vollständige Domain-Migration (.eu → .de) mitten im Betrieb, ohne kaputte Links, Duplicate Content oder verlorene Nutzer.",
    outcome:
      "ravepuls.de läuft live, aggregiert automatisiert und bleibt trotzdem gegen Missbrauch gehärtet.",
  },
  {
    id: "matrix-chat",
    name: "matrix-chat",
    role: "Privater Matrix-Homeserver",
    status: "live",
    server: "server-1",
    since: "Juli 2026",
    url: "https://matrix.zntx.de",
    stack: ["Tuwunel (Rust)", "RocksDB (embedded)", "Caddy"],
    context:
      "Ein privater Kommunikationskanal für einen geschlossenen Nutzerkreis — kein Interesse an einem weiteren SaaS-Chat-Abo, dafür volle Kontrolle über die eigene Infrastruktur.",
    contribution:
      "Selbst gehosteter Matrix-Homeserver (Tuwunel, geschrieben in Rust) mit eingebettetem RocksDB, kein zusätzlicher Datenbank-Container. Registrierung ausschließlich per Invite-Token, Federation bewusst deaktiviert.",
    challenge:
      "Eine Nicht-Standard-Infra (Rust-Binary statt gewohntem Web-Stack) sauber in dieselbe Caddy-Architektur integrieren wie alle anderen Projekte.",
    outcome:
      "Läuft seit dem Deploy ohne offene Registrierung oder Federation-Angriffsfläche — Infra-Betrieb, der über Web-Apps mit Postgres hinausgeht.",
  },
  {
    id: "wcp-arma",
    name: "WCP / Arma-Community-Server",
    role: "Discord-Bot + Gameserver-Ops",
    status: "live",
    server: "server-2",
    since: "Ende Mai / Anfang Juni 2026",
    url: "https://zblt.eu",
    stack: ["discord.py", "OAuth2", "RCON", "Pterodactyl/Wings", "Docker"],
    context:
      "Ein Arma-Reforger-Gameserver brauchte mehr als einen Standard-Discord-Bot — echte Integration mit dem laufenden Server, nicht nur Rollenverwaltung.",
    contribution:
      "Ein ~5000 Zeilen großer Discord-Bot (discord.py) mit ~36 Hybrid-Commands, OAuth2-Web-Dashboard und direkter RCON-Anbindung an den Arma-Reforger-Server (Pterodactyl/Wings, Docker). Ticket-System mit persistenten Discord-Views für den Support.",
    challenge:
      "Live-Spieler-Tracking über dieselbe RCON-Verbindung wie die Server-Steuerung — stabil genug für Dauerbetrieb, nicht nur gelegentliche Admin-Befehle.",
    outcome:
      "Läuft seit Monaten produktiv — kein Demo, kein totes Side-Project.",
  },
  {
    id: "qntx",
    name: "qntx",
    role: "KI-gestützter Krypto-Trading-Bot",
    status: "paper-trading",
    server: "server-2",
    since: "Juli 2026",
    url: "https://qntx.zblt.eu",
    stack: ["CCXT", "Optuna", "Monte-Carlo-Backtesting", "8-Modell-KI-Ensemble"],
    context:
      "Ein Krypto-Trading-Bot, der Entscheidungen nicht auf Bauchgefühl trifft — bei echtem Kapitalrisiko reicht 'sieht gut aus' nicht.",
    contribution:
      "Kraken-Anbindung über CCXT, 13 orthogonale Handelssignale, 8-Modell-KI-Sentiment-Ensemble mit Mehrheitsentscheid und Ausfallschutz — kein Single-Point-of-Failure bei einem ausgefallenen Modell. Gewichtstuning Walk-Forward-validiert per Optuna.",
    challenge:
      "Strategien vor echtem Kapitaleinsatz per Monte-Carlo-Backtesting prüfen und eine vollständige Risikokette bauen (Stop-Loss, Kill-Switch, Drawdown-Stop), die auch bei komplettem Modellausfall greift.",
    outcome:
      "Aktuell in strukturierter Paper-Trading-Phase mit dokumentierten, harten Go-Live-Kriterien — bewusst noch nicht live, bis diese Kriterien erfüllt sind.",
    note: "Bewusst kein 'einfach live schalten' — Go-Live-Kriterien sind schriftlich fixiert, nicht verhandelbar.",
  },
  {
    id: "n8n-automation",
    name: "YouTube-Automatisierung (n8n)",
    role: "Content-Automatisierung / Workflow-Infrastruktur",
    status: "archived",
    since: "November 2025 – Februar 2026",
    stack: ["n8n", "Workflow-Automatisierung", "Error-Handling-Pipelines"],
    context:
      "Bevor es die heutige, saubere Multi-Projekt-Infrastruktur gab: ein Experiment mit vollständig automatisierten YouTube-Inhalten — kein manueller Upload, keine manuelle Bearbeitung.",
    contribution:
      "Ein automatisierter YouTube-Kanal mit vollständigem n8n-Workflow von Erstellung bis Veröffentlichung, dazu eine eigene n8n-Infrastruktur mit eigenem Error-Handling für ausfallsichere Automatisierungs-Pipelines.",
    challenge:
      "Eine wachsende Automatisierungs-Infrastruktur sicher und wartbar zu halten, während parallel weiter experimentiert und erweitert wurde — am Ende eskalierte das so weit, dass der komplette Root-Server zurückgesetzt werden musste.",
    outcome:
      "Der Server wurde komplett neu aufgesetzt — bewusst sauberer und strukturierter als vorher. Die Disziplin, die sich durch die anderen Projekte auf dieser Seite zieht (Secrets-Hygiene, isolierte DBs, eigene Guardrail-Hooks), hat hier ihren Ursprung: einmal etwas komplett verloren zu haben, sitzt tiefer als jede Best-Practice-Checkliste.",
  },
  {
    id: "zntx",
    name: "zntx",
    role: "Dieses Portfolio",
    status: "live",
    server: "server-1",
    since: "Juli 2026",
    url: "https://zntx.de",
    stack: ["Next.js", "Docker Compose", "Caddy", "Postgres", "Drizzle ORM"],
    context:
      "Diese Seite selbst — der Anspruch war, ein Portfolio nicht nur zu behaupten, sondern als eigenes Infra-Projekt zu betreiben.",
    contribution:
      "Next.js auf einer eigenen, isolierten Postgres-Rolle (kein Shared-Superuser), hinter Caddy als einzigem Ingress, deployed über Docker Compose. Gebaut mit KI-Unterstützung — aber mit eigenen deterministischen PreToolUse-Guardrail-Hooks, die Secret-Leaks, Scope-Verletzungen und riskante Compose-Konfiguration automatisiert blocken.",
    challenge:
      "KI-gestützte Entwicklung nutzen, ohne ihr blind zu vertrauen — die Guardrails mussten selbst gebaut werden, es gab kein fertiges Tool dafür.",
    outcome:
      "zntx.de läuft, mit echter Produktions-Pipeline dahinter. Der Unterschied zwischen 'KI schreibt Code' und 'KI schreibt Code mit echten Leitplanken' ist genau das, was hier den Unterschied macht.",
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
      "Secrets-Hygiene — Umgebungsdatei-Disziplin, nie committen",
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

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/luis-b-668750319/",
  contactEmail: "kontakt@zntx.de",
};

export const HERO = {
  kicker: "OPERATOR RACK — 2 STANDORTE",
  headline: "Zwei Server, sechs Systeme, ein Betreiber.",
  subline:
    "Vollzeit im Lager. Nebenbei: Produktiv-Infrastruktur, die läuft — nicht nur baut.",
};

export const BIO = {
  heading: "Hintergrund",
  dayJob: "Vollzeit und Minijob im Lager.",
  throughline:
    "Seit der Schulzeit Ansprechpartner für alles, was mit Technik zu tun hat — das hat sich in den Lagerjob mitgezogen: hilft dort gelegentlich freiwillig der Haustechnik aus.",
  passion:
    "Nebenbei: mehrere Root-Server, echte Produktiv-Infrastruktur, FPV-Drohnen-Foto- und Videografie.",
  trajectory:
    "Ziel ist perspektivisch die Selbstständigkeit im Tech-Bereich. Aktuell liegt der Fokus auf Weiterbildung im jetzigen Job, keine aktive Jobsuche — aber offen für den richtigen Kontakt.",
  note:
    "Kein Blender-Lebenslauf — die Systeme in diesem Dossier laufen wirklich, mit echtem Betrieb dahinter.",
};
