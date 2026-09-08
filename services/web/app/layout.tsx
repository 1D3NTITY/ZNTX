import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Chakra_Petch } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Nav } from "@/components/nav";
import { CircuitBackground } from "@/components/circuit-background";
import { AmbientGlow } from "@/components/ambient-glow";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dritter Typo-Layer für redaktionelle Zitate (BIO.throughline, Projekt-Outcome-Blockquotes) —
// unverändert seit dem Signalraum-Wechsel, kein Teil der abgelösten CRT-Kostümierung.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Signalraum-Display-Schrift (2026-09-08) — kondensiert, fett, für Headlines (Hero, Projekt-
// Seitentitel). Ersetzt font-sans an genau diesen Stellen, siehe ops-dashboard.tsx und
// app/projekte/[slug]/page.tsx.
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const TITLE = "zntx — Luis";
const DESCRIPTION =
  "Full-Stack-Entwicklung & Server-Infrastruktur: echte Produktiv-Infrastruktur über mehrere Server, Docker/Caddy/Postgres-Betrieb, laufende Projekte statt Prototypen.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://zntx.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zntx.de",
    siteName: "zntx",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// JSON-LD (Person + WebSite, schema.org) — hilft Suchmaschinen/AI-Crawlern, Luis als Person und
// zntx.de als Site einzuordnen. Natives <script>, kein next/script (Doku: next/script ist für
// ausführbaren Code optimiert, nicht für reine Strukturdaten). Sanitized nach offiziell empfohlenem
// XSS-Pattern (< → <), da dangerouslySetInnerHTML verwendet wird.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Luis",
      url: "https://zntx.de",
      sameAs: ["https://www.linkedin.com/in/luis-b-668750319/"],
    },
    {
      "@type": "WebSite",
      name: "zntx",
      url: "https://zntx.de",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${chakraPetch.variable} h-full antialiased dark`}
      // Das Boot-Intro-Inline-Skript (unten im Body) setzt/entfernt "booting"/"boot-out" auf
      // dieser className, bevor React hydratisiert — das ist Absicht (siehe Kommentar dort), aber
      // React vergleicht bei jedem Laden den serverseitigen className-String mit dem inzwischen
      // vom Skript veränderten und wirft einen Hydration-Mismatch-Fehler in der Konsole (gefunden
      // beim finalen Release-Check, 2026-09-04) — bei jedem einzigen Seitenaufruf, für jeden
      // Besucher. React akzeptiert die Client-Version ohnehin ("wird nicht nachträglich
      // gepatcht"), suppressHydrationWarning unterdrückt nur die irreführende Fehlermeldung für
      // diesen einen, bewusst abweichenden Fall.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Boot-Intro-Steuerung. Muss als ALLERERSTES im Body stehen und synchron laufen:
            Die Klasse am <html> entscheidet, ob das Overlay (components/boot-intro.tsx)
            überhaupt gemalt wird — und diese Entscheidung muss vor dem ersten Bildaufbau
            fallen. Ein useEffect käme zu spät (gemessen 0,7-2,9 s nach Hydration), das Overlay
            würde die schon sichtbare Seite nachträglich zudecken.
            Reines Klassen-Umschalten, kein Inhalt wird hier erzeugt.
            Der 2050-Timeout unten ist an die Rack-Power-Up-Sequenz in boot-intro.tsx gekoppelt
            (LED_START_MS + (systems-1)*LED_STAGGER_MS + LED_DURATION_MS + BLOOM_GAP_MS +
            CAPTION_GAP_MS + CAPTION_FADE_MS + HOLD_BEFORE_COLLAPSE_MS, aktuell für systems=8
            berechnet: 260+700+180+60+150+200+500=2050). Dieses Skript kennt den echten
            Systems-Count nicht (statischer String, kein Props-Zugriff) — der Wert hat daher
            etwas Puffer für ein, zwei zusätzliche Systeme in der Zukunft. Wächst REAL_SYSTEMS
            in lib/content.ts spürbar, hier neu nachrechnen (siehe Formel oben), sonst reißt der
            Kollaps in eine noch laufende LED-Sequenz. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var d=document.documentElement;
var skip=false;
try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)skip=true;}catch(e){}
try{if(window.sessionStorage.getItem('zntx-boot-seen'))skip=true;}catch(e){}
if(skip)return;
d.classList.add('booting');
try{window.sessionStorage.setItem('zntx-boot-seen','1');}catch(e){}
var done=false;
function end(){if(done)return;done=true;
d.classList.add('boot-out');
window.setTimeout(function(){d.classList.remove('booting','boot-out');},420);
window.removeEventListener('keydown',end);window.removeEventListener('pointerdown',end);}
window.setTimeout(end,2050);
window.addEventListener('keydown',end);window.addEventListener('pointerdown',end);
}catch(e){try{document.documentElement.classList.remove('booting');}catch(_){}}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        <CircuitBackground />
        <Logo />
        <Nav />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        {/* Ambient-Glow ganz zuletzt: liegt als reines Dekor über allem (z-30,
            pointer-events:none), darf aber nie zwischen Nutzer und Bedienelemente geraten —
            deshalb kein z-Index oberhalb der fixierten Nav/Logo-Chrome. */}
        <AmbientGlow />
      </body>
    </html>
  );
}
