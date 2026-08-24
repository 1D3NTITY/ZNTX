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
  /**
   * Optional: CSS-Farbwert für den Status-Punkt im Live-Ops-Leitstand — festes
   * Farbsystem pro Projekt (nicht verhandelbar). Nur gesetzt, wo eine Farbe
   * tatsächlich zugewiesen ist (ravepuls/qntx/wcp-arma); sonst rendert die
   * Dashboard-Zeile einen neutralen Punkt (--foreground-muted), statt eine
   * Farbe zu erfinden.
   */
  accentColor?: string;
  /**
   * Optional: Pfad unter public/screenshots/ — echter Screenshot der Live-Anwendung, kein
   * Mockup/Stockfoto. Nur gesetzt, wo tatsächlich ein aussagekräftiger Screenshot existiert
   * (z.B. login-gated Produkte ohne öffentliche Seite bleiben ohne, statt einen leeren
   * Login-Screen zu zeigen). Bei sensiblen/internen Tools (buchhaltung) nur mit klar sichtbarem
   * Demo-Daten-Hinweis im Bild selbst verwenden.
   */
  screenshot?: string;
};

// Reihenfolge = Reihenfolge im Fließtext. zntx zuletzt (Meta-Projekt: "du liest es gerade").
export const PROJECTS: ProjectNode[] = [
  {
    id: "foodapp",
    name: "Food & Fitness App",
    role: "Multi-Platform-Produkt",
    status: "live",
    accentColor: "var(--project-foodapp)",
    server: "server-1",
    since: "Mai 2026",
    url: "https://app.zentrix-solutions.eu",
    stack: ["FastAPI", "Next.js", "Expo / React Native", "Postgres", "Redis", "Alembic", "n8n"],
    context:
      "Ein Multi-Platform-Produkt für Ernährungs- und Trainingsdaten — echte Gesundheitsdaten, nicht Fitness-Tracking zum Spaß. Sobald DSGVO Art. 9 greift, ist nachträglich eingebauter Datenschutz keine Option.",
    contribution:
      "FastAPI-Backend als gemeinsames Fundament für die Next.js-Web-App und die Expo/React-Native-Mobile-App, mit Zugriffskontrolle, Export- und Löschfunktion direkt im Datenmodell verankert. Releases über Alembic-Migrationen, feste Sprint-/Versionierungsdisziplin, n8n für Automatisierung im Hintergrund. Seitdem erweitert um Passwort-Selfservice mit 2FA (inklusive TOTP-Replay-Schutz und 2FA-Pflicht auch beim Google-Login), lokale JWKS-Verifikation von Google-ID-Tokens statt blindem Vertrauen, echten OAuth-State-CSRF-Schutz und Admin-Funktionen für Nutzerverwaltung (Sperren/Löschen). CI-Pipeline mit Lint-/Type-/Test-/Build-Gates neu aufgesetzt, kompletter Altlasten-Lint-Bestand bereinigt. Die Google-Fit-Anbindung wurde entfernt, nachdem Google die zugrunde liegende API angekündigt abschaltet — ein erzwungener, kein freiwilliger Architektur-Schwenk.",
    challenge:
      "Ein Backend für zwei grundverschiedene Clients konsistent halten, ohne Logik zu duplizieren — und OTA-Updates für die Mobile-App liefern, ohne auf App-Store-Review-Zyklen zu warten.",
    outcome:
      "Ein Produkt, das Gesundheitsdaten von Anfang an mit DSGVO-Anforderungen im Datenmodell verankert — nicht nachträglich aufgesetzt, sondern von Beginn an so gebaut. DSGVO-Rechte (Auskunft, Löschung, Datenübertragbarkeit) sind inzwischen echter Selfservice, nicht nur Zusage auf Anfrage.",
  },
  {
    id: "ravepuls",
    name: "Ravepuls",
    role: "Event-Discovery-Plattform",
    status: "live",
    accentColor: "var(--project-ravepuls)",
    server: "server-1",
    since: "Juli 2026",
    url: "https://ravepuls.de",
    screenshot: "/screenshots/ravepuls.png",
    stack: ["FastAPI", "Next.js", "Telethon", "Browserless/Chromium", "Cloudflare Turnstile", "Instagram-Automation"],
    context:
      "Event-Discovery für die Rave-Szene einer Stadt — die Information existiert, ist aber über Dutzende Social-Media-Kanäle und Venue-Websites verstreut. Bewusst kein kommerzielles Projekt, sondern Community-Nutzen im Vordergrund.",
    contribution:
      "Ein Telegram-Userbot liest konfigurierte Kanäle passiv mit, Browser-Automation (Browserless/Chromium) scraped Venue-Websites, die client-seitig rendern — beide Wege laufen in dieselbe Dedup-/Extraktions-Pipeline. Öffentliche Formulare mit Cloudflare Turnstile und eigener CSP gegen Missbrauch gehärtet. EU-AI-Act-Anforderungen berücksichtigt, inklusive Kennzeichnung KI-gestützt erzeugter Inhalte. Extraktions-Ergebnisse laufen inzwischen durch ein Punktesystem mit Auto-Publish ab einer Vertrauensschwelle, zusätzlich abgesichert durch einen Neutralitäts-Guard (erkennt und blockt politische Partei-/Organisationsnamen sowie FLINTA-Events, verhindert dass spekulative KI-Aussagen als Fakt veröffentlicht werden) und einen Genre-Scope-Guard. Events werden automatisiert mit echten Flyer-Bildern, Hashtags und Kurzlinks auf Instagram gepostet. Ein volles Sicherheitsaudit in fünf Phasen brachte u. a. eine Nonce-basierte CSP (kein unsafe-inline/unsafe-eval mehr), Härtung des Flyer-Uploads gegen Content-Type-Spoofing und einen Patch gegen mehrere bekannte Next.js-Sicherheitslücken.",
    challenge:
      "Eine vollständige Domain-Migration (.eu → .de) mitten im Betrieb, ohne kaputte Links, Duplicate Content oder verlorene Nutzer.",
    outcome:
      "ravepuls.de läuft live, aggregiert automatisiert, bleibt gegen Missbrauch und Fehlklassifikation gehärtet (Neutralitäts-/Genre-Guards) — und hält die EU-AI-Act-Vorgaben nicht nur ein, sondern sichtbar: KI-Kennzeichnung im UI, echtes Stock-Foto statt KI-generiertem Hero-Banner. DSGVO-Rechte (Auskunft/Löschung, Art. 17/20) sind echter Selfservice im Account-Bereich, nicht nur Zusage auf Anfrage.",
  },
  {
    id: "matrix-chat",
    name: "matrix-chat",
    role: "Privater Matrix-Homeserver",
    status: "live",
    accentColor: "var(--project-matrix-chat)",
    server: "server-1",
    since: "Juli 2026",
    url: "https://matrix.zntx.de",
    stack: ["Tuwunel (Rust)", "RocksDB (embedded)", "Caddy", "WhatsApp-Bridge", "Telegram-Bridge"],
    context:
      "Ein privater Kommunikationskanal für einen geschlossenen Nutzerkreis — kein Interesse an einem weiteren SaaS-Chat-Abo, dafür volle Kontrolle über die eigene Infrastruktur.",
    contribution:
      "Selbst gehosteter Matrix-Homeserver (Tuwunel, geschrieben in Rust) mit eingebettetem RocksDB, kein zusätzlicher Datenbank-Container. Registrierung ausschließlich per Invite-Token, Federation bewusst deaktiviert. Zusätzlich WhatsApp- und Telegram-Bridges angebunden, damit bestehende Kontakte auf beiden Plattformen erreichbar bleiben, ohne den privaten Homeserver zu verlassen.",
    challenge:
      "Eine Nicht-Standard-Infra (Rust-Binary statt gewohntem Web-Stack) sauber in dieselbe Caddy-Architektur integrieren wie alle anderen Projekte — plus zwei Cross-Plattform-Bridges stabil am selben Server betreiben.",
    outcome:
      "Läuft seit dem Deploy ohne offene Registrierung oder Federation-Angriffsfläche — Infra-Betrieb, der über Web-Apps mit Postgres hinausgeht.",
  },
  {
    id: "wcp-arma",
    name: "WCP / Arma-Community-Server",
    role: "Discord-Bot + Gameserver-Ops",
    status: "live",
    accentColor: "var(--project-arma)",
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
    id: "motortown",
    name: "Motor Town: Behind the Wheel",
    role: "Privater Gameserver",
    status: "live",
    accentColor: "var(--project-motortown)",
    server: "server-2",
    since: "August 2026",
    stack: ["systemd", "Wine/Proton", "SteamCMD", "ufw"],
    context:
      "Ein privater Dedicated-Server für 'Motor Town: Behind the Wheel' (Steam) für einen kleinen, festen Freundeskreis (max. 10–20 Spieler) — bewusst kein öffentliches, wachsendes Projekt wie die anderen Systeme.",
    contribution:
      "Der Windows-only Server-Prozess läuft über Wine/Proton unter Linux, verwaltet als systemd-Service statt als Docker-Container — anders als der Rest der Infrastruktur, bewusst so gewählt, weil Wine in einem Container zusätzliche Komplexität ohne echten Nutzen bringen würde. Läuft unter einem eigenen, unprivilegierten Linux-User, technisch sauber isoliert vom WCP/Arma-Server auf demselben physischen Server — eigener Service, eigene freigegebene Ports (ufw, gezielt nur die benötigten UDP/TCP-Ports für Motor Town). Tägliche Backups laufen zuverlässig.",
    challenge:
      "Einen Windows-Server-Prozess stabil unter Linux betreiben (Wine/Proton statt nativer Linux-Build) und dabei bewusst von der sonst durchgängigen Docker-Architektur der anderen Projekte abweichen, wo es technisch die bessere Wahl ist.",
    outcome:
      "Läuft stabil und produktiv für den eigenen Freundeskreis, sauber isoliert vom Nachbarserver, mit funktionierenden täglichen Backups — zeigt, dass die Linux-/Ops-Skills nicht an 'alles läuft in Docker' hängen, sondern die passende Betriebsform je Workload wählen.",
  },
  {
    id: "buchhaltung",
    name: "Buchhaltungs-/Steuerassistent",
    role: "Interner KI-Assistent",
    status: "internal",
    accentColor: "var(--project-buchhaltung)",
    server: "server-1",
    since: "August 2026",
    screenshot: "/screenshots/buchhaltung.png",
    stack: ["FastAPI", "Next.js", "Postgres", "Mistral (OCR/LLM)", "FastBill API", "Docker Compose"],
    context:
      "Ein interner KI-Buchhaltungs-/Steuerassistent für das eigene Kleinunternehmen — kombiniert Geschäftsbuchhaltung (FastBill-Orchestrierung) und private Finanzen/Steueroptimierung in einer Oberfläche, statt beides getrennt in Excel-Tabellen zu pflegen.",
    contribution:
      "Beleg-Ingestion per Upload oder E-Mail, Mistral-OCR/LLM-Strukturierung, automatischer Push nach FastBill. Eigenes Privat-Modul mit von Grund auf implementierter Steuerrücklage-Berechnung (§ 32a EStG), Kleinunternehmergrenze-Tracker und ELSTER-Feldreferenz. Intelligence-Layer für Cashflow-Analyse, Anomalie-Erkennung und fehlende-Nachweise-Erkennung, dazu Budget-Tracking mit Bank-CSV-Import und ein kontext-geerdeter Chat-Assistent. Ledger/GoBD/E-Rechnung/DATEV-Export laufen bewusst über die FastBill-„Solo“-API (Buy statt Build, nach Abwägung mehrerer KI-Zweitmeinungen) statt selbst gebaut. Dazu ein komplett eigenständiges Hobby/Equipment-Modul: Equipment-Verwaltung, Resell-Tracker mit Finanzkopplung, Gig-/Setlist-Builder, P&L-Dashboard, Automatisierung, Webhooks, lokales Backup/Export.",
    challenge:
      "Ein eigenes 40-Punkte-Sicherheitsaudit deckte auf, dass interne Beleg-/Hobby-Endpunkte versehentlich von außen über Caddy erreichbar waren — selbst gefunden und behoben, zusammen mit Prompt-Injection-Härtung für den Chat-Assistenten und Content-Type-Allowlisting für Uploads.",
    outcome:
      "Live verifiziertes System mit DSGVO-konformer Löschung/Export und bestandenem Backup-/Restore-Test — kein Prototyp, sondern der tatsächlich genutzte Buchhaltungs-Workflow.",
  },
  {
    id: "qntx",
    name: "qntx",
    role: "KI-gestützter Krypto-Trading-Bot",
    status: "paper-trading",
    accentColor: "var(--project-qntx)",
    server: "server-2",
    since: "Juli 2026",
    url: "https://qntx.zblt.eu",
    stack: ["CCXT", "Optuna", "Walk-Forward-Backtesting", "8-Modell-KI-Ensemble"],
    context:
      "Ein Krypto-Trading-Bot, der Entscheidungen nicht auf Bauchgefühl trifft — bei echtem Kapitalrisiko reicht 'sieht gut aus' nicht.",
    contribution:
      "Kraken-Anbindung über CCXT, 13 orthogonale Handelssignale (technische Analyse, Marktkontext, u. a. Binance-Liquidationskaskaden), 8-Modell-KI-Sentiment-Ensemble mit Mehrheitsentscheid und Ausfallschutz — kein Single-Point-of-Failure bei einem ausgefallenen Modell. Gewichtstuning Walk-Forward-validiert per Optuna. Eigene Funding-Rate- und DeFi-Datensammlung sowie Gate-Effectiveness-Tracking zur weiteren Signal-Validierung, inzwischen als vom Handelssystem entkoppelte Hintergrunddienste. Dashboard komplett auf eine neue, modulare Oberfläche mit einheitlichem Design-System und Accessibility-Pass umgestellt, erweitert um Config-Version-Tracking, Entry-Snapshots je Trade, MAE/MFE-Tracking und einen Data-Quality-Audit, dazu ein Shadow-Threshold-Tool für die Analyse von Near-Miss-Trades knapp unterhalb einer Auslöseschwelle. Research läuft strukturiert in einem eigenen Research-Ledger statt in Rohtext.",
    challenge:
      "Strategien vor echtem Kapitaleinsatz per Walk-Forward-Backtesting prüfen und eine mehrstufige Risikokette bauen (Stop-Loss, Trailing-Stop, Kill-Switch, Circuit-Breaker), die auch bei komplettem Modellausfall greift. Ein eigenes ~150-Punkte-Sicherheitsaudit deckte dabei u. a. eine fehlerhafte Fee-Berechnung auf (Maker- statt Taker-Satz) und führte zu unabhängigeren Kill-Switch-/Rollback-Mechanismen.",
    outcome:
      "Aktuell in strukturierter Paper-Trading-Phase mit dokumentierten, harten Go-Live-Kriterien — inzwischen zusätzlich abgesichert durch Config-Versionierung, Trade-Level-Diagnostik, Near-Miss-Analyse und ein eigenes Sicherheitsaudit, bewusst noch nicht live, bis die Kriterien erfüllt sind. Ein externer, nicht-autoritativer Review-Assistent gibt inzwischen eine zusätzliche Zweitmeinung im Code-Review, ohne eigene Entscheidungsbefugnis.",
    note: "Bewusst kein 'einfach live schalten' — Go-Live-Kriterien sind schriftlich fixiert, nicht verhandelbar.",
  },
  {
    id: "n8n-automation",
    name: "YouTube-Automatisierung (n8n)",
    role: "Content-Automatisierung / Workflow-Infrastruktur",
    status: "archived",
    accentColor: "var(--project-n8n)",
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
    accentColor: "var(--project-zntx)",
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

// Konkrete Einsatzbereiche, aus den Projekten oben abgeleitet — keine
// Erfindung, sondern Zusammenfassung dessen, was die Case-Studies bereits
// belegen. Beantwortet "wofür ist das geeignet", nicht nur "was kann er".
export const ROLE_FIT = [
  {
    role: "Backend-/API-Entwicklung",
    evidence: "FastAPI- und Next.js-Route-Handler-Backends produktiv im Einsatz (foodapp, ravepuls, zntx)",
  },
  {
    role: "Full-Stack-Entwicklung",
    evidence: "Next.js/React + eigenes Backend + Postgres als durchgängiger Stack über mehrere Projekte",
  },
  {
    role: "Linux-/Server-Administration, DevOps",
    evidence: "Eigenständiger Betrieb von 2 Root-Servern, Docker-Compose-Architektur, Caddy-Ingress, SSH-Härtung, Wine/systemd für Nicht-Docker-Workloads",
  },
  {
    role: "Automatisierung & Workflow-Engineering",
    evidence: "n8n-Workflow-Infrastruktur, Discord-Bot-/RCON-Automatisierung (WCP/Arma)",
  },
  {
    role: "Security-/Compliance-bewusste Entwicklung",
    evidence: "DSGVO Art. 9 bei Gesundheitsdaten, EU-AI-Act-Anforderungen berücksichtigt (ravepuls), Kill-Switches bei echtem Kapitalrisiko, eigene Guardrail-Hooks",
  },
];

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/luis-b-668750319/",
  contactEmail: "kontakt@zntx.de",
};

// name/roleTagline ergänzt (Feedback 2026-07-26, Headhunter-Perspektive):
// Name stand vorher nur in Meta-Tags/der LinkedIn-URL, nirgends sichtbar auf
// der Seite selbst. roleTagline macht "wofür geeignet" (siehe ROLE_FIT weiter
// oben) ohne Klick in die Operator-Profil-Zeile scannbar — die zwei am besten
// belegten Rollen aus ROLE_FIT, nicht alle fünf (sonst keine Tagline mehr).
export const HERO = {
  name: "Luis B.",
  roleTagline: "Backend-/Full-Stack-Entwicklung · Server-/Infrastruktur-Administration",
  kicker: "§00 — SYSTEMS ON RECORD",
  headline: "Zwei Server, acht Systeme, ein Betreiber.",
  subline:
    "Entwickle und betreibe produktive Web- und Server-Systeme — acht Systeme auf zwei eigenen Servern, im laufenden Betrieb, nicht nur konzipiert. Beruflich aktuell im Lagerbereich, nebenbei volle Infrastruktur-Verantwortung.",
};

export const BIO = {
  heading: "Hintergrund",
  dayJob: "Haupt- und Nebentätigkeit im Lagerbereich.",
  throughline:
    "Seit der Schulzeit erster Ansprechpartner für technische Themen im persönlichen Umfeld — diese Rolle hat sich in die berufliche Tätigkeit fortgesetzt: unterstützt dort auf eigene Initiative gelegentlich die Haustechnik.",
  passion:
    "Daneben: Betrieb mehrerer eigener Root-Server mit produktiver Infrastruktur sowie FPV-Drohnen-Foto- und Videografie.",
  trajectory:
    "Ziel ist perspektivisch die Selbstständigkeit im Tech-Bereich. Aktuell liegt der Fokus auf Weiterbildung im jetzigen Beruf, keine aktive Jobsuche — aber offen für den richtigen Kontakt.",
  note:
    "Keine Behauptungen ohne Beleg — die Systeme in diesem Dossier sind produktiv im Einsatz, nicht nur beschrieben.",
};
