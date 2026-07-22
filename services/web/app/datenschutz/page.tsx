import Link from "next/link";

export const metadata = { title: "Datenschutz — zntx" };

export default function DatenschutzPage() {
  return (
    <article className="mx-auto w-full max-w-2xl space-y-8 px-6 py-24 text-sm leading-relaxed text-foreground-muted">
      <Link
        href="/"
        className="inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        ← Zurück zur Startseite
      </Link>
      <h1 className="text-2xl font-semibold text-foreground">
        Datenschutzerklärung
      </h1>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Verantwortlicher
        </h2>
        <p className="mt-2">
          Verantwortlich für die Datenverarbeitung auf dieser Website ist der
          Betreiber laut{" "}
          <a
            href="https://mein.online-impressum.de/zentrix-solutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Impressum
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Server-Logfiles / Hosting
        </h2>
        <p className="mt-2">
          Beim Besuch dieser Website erhebt der Hosting-Provider automatisch
          Informationen in Server-Logfiles, die der Browser übermittelt
          (IP-Adresse, Datum/Uhrzeit der Anfrage, aufgerufene Seite,
          verwendeter Browser). Diese Daten dienen dem sicheren und stabilen
          Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes
          Interesse) und werden nicht mit anderen Datenquellen
          zusammengeführt.
        </p>
        <p className="mt-2">
          Diese Website nutzt Cloudflare als DNS-/DDoS-Schutz vor dem
          eigentlichen Server. Cloudflare verarbeitet dabei technisch
          notwendige Verbindungsdaten (u. a. IP-Adresse) als
          Auftragsverarbeiter.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Kontaktformular
        </h2>
        <p className="mt-2">
          Bei Nutzung des Kontaktformulars werden die eingegebenen Daten (Name,
          E-Mail-Adresse, Nachricht) sowie der Zeitpunkt der Anfrage
          gespeichert, um die Anfrage zu bearbeiten und bei Rückfragen darauf
          zurückgreifen zu können (Art. 6 Abs. 1 lit. b DSGVO, vorvertragliche
          Maßnahme bzw. Anbahnung eines Kontakts). Die Daten werden in einer
          eigenen, ausschließlich für diesen Zweck genutzten Datenbank
          gespeichert und zusätzlich per E-Mail an den Betreiber weitergeleitet,
          um eine zeitnahe Rückmeldung zu ermöglichen. Eine Weitergabe an
          Dritte darüber hinaus erfolgt nicht. Die Löschung erfolgt, sobald die
          Anfrage abschließend bearbeitet ist und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
        <p className="mt-2">
          Zum Schutz vor automatisiertem Spam-Missbrauch wird Cloudflare
          Turnstile eingesetzt. Dabei werden technische Daten (u. a.
          Browser-Merkmale, IP-Adresse) an Cloudflare als Auftragsverarbeiter
          übermittelt, um automatisierte Formular-Einreichungen zu erkennen.
          Turnstile setzt dabei keine Tracking-Cookies für
          Werbe-/Analysezwecke ein. Rechtsgrundlage ist unser berechtigtes
          Interesse an einem funktionsfähigen, missbrauchsgeschützten
          Formular (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen:{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Cloudflare Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Cookies</h2>
        <p className="mt-2">
          Diese Website setzt keine Tracking- oder Analyse-Cookies. Es kommen
          ausschließlich technisch notwendige Mechanismen zum Einsatz (u. a.
          im Rahmen der Turnstile-Spam-Prüfung beim Absenden des
          Kontaktformulars).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Deine Rechte
        </h2>
        <p className="mt-2">
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art.
          16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung
          (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie
          Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Zudem besteht
          ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.
        </p>
        <p className="mt-2">
          Für Anfragen zum Datenschutz:{" "}
          <a
            href="mailto:kontakt@zntx.de"
            className="text-accent hover:underline"
          >
            kontakt@zntx.de
          </a>
        </p>
      </section>
    </article>
  );
}
