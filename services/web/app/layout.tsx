import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Nav } from "@/components/nav";
import { CircuitBackground } from "@/components/circuit-background";
import { CrtOverlay } from "@/components/crt-overlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dritter Typo-Layer für den Dossier-Look: Serif-Headlines geben den
// Sektionstiteln Report-Charakter, statt alles im selben Sans/Mono zu halten.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
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
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Boot-Intro-Steuerung. Muss als ALLERERSTES im Body stehen und synchron laufen:
            Die Klasse am <html> entscheidet, ob das Overlay (components/boot-intro.tsx)
            überhaupt gemalt wird — und diese Entscheidung muss vor dem ersten Bildaufbau
            fallen. Ein useEffect käme zu spät (gemessen 0,7-2,9 s nach Hydration), das Overlay
            würde die schon sichtbare Seite nachträglich zudecken.
            Reines Klassen-Umschalten, kein Inhalt wird hier erzeugt. */}
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
window.setTimeout(end,1150);
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
        {/* CRT-Schichten ganz zuletzt: liegen als reines Dekor über allem (z-30,
            pointer-events:none), dürfen aber nie zwischen Nutzer und Bedienelemente geraten —
            deshalb kein z-Index oberhalb der fixierten Nav/Logo-Chrome. */}
        <CrtOverlay />
      </body>
    </html>
  );
}
