import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
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
      name: "Luis B.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        <Logo />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
