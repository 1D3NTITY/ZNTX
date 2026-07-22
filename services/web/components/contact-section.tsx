import { ContactForm } from "@/components/contact-form";
import { SectionNumber } from "@/components/section-number";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="contact-heading"
    >
      <div className="relative overflow-hidden">
        <SectionNumber n="04" />
        <p className="font-mono text-xs uppercase tracking-widest text-accent">§04</p>
        <h2
          id="contact-heading"
          className="mt-1 font-serif text-3xl font-semibold sm:text-4xl"
        >
          Kontakt
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
          Kurze Einordnung des Anliegens genügt — Rückmeldung erfolgt zeitnah.
        </p>
      </div>

      {/* Terminal-Fenster-Chrome — eigene visuelle Behandlung statt des
          schlichten Formular-Blocks aus den anderen Sections. */}
      <div className="mt-8 max-w-xl overflow-hidden rounded-md border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-status-paper/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-status-online/60" />
          <span className="ml-2 font-mono text-[11px] text-foreground-muted">
            kontakt.sh
          </span>
        </div>
        <div className="bg-surface p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
