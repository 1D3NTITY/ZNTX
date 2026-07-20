import { ContactForm } from "@/components/contact-form";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl px-6 py-24"
      aria-labelledby="contact-heading"
    >
      <header className="mb-10 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// kontakt"}
        </p>
        <h2 id="contact-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">
          Terminal öffnen
        </h2>
      </header>

      <ContactForm />
    </section>
  );
}
