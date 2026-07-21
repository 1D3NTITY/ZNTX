import { ContactForm } from "@/components/contact-form";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="contact-heading"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">§04</p>
      <h2
        id="contact-heading"
        className="mt-1 font-serif text-3xl font-semibold sm:text-4xl"
      >
        Kontakt
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        Kein Kontaktformular-Standardtext — schreib, worum es geht, ich melde mich zurück.
      </p>

      <div className="mt-8 max-w-xl">
        <ContactForm />
      </div>
    </section>
  );
}
