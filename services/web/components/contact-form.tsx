"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import Link from "next/link";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !SITE_KEY || !turnstileRef.current || !window.turnstile) {
      return;
    }
    widgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: SITE_KEY,
      callback: (t) => setToken(t),
      "error-callback": () => setToken(""),
      "expired-callback": () => setToken(""),
    });
  }, [scriptLoaded]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const honeypot = String(formData.get("website") ?? "");

    if (!consent) {
      setErrorMessage("Bitte der Datenschutzerklärung zustimmen.");
      return;
    }
    if (SITE_KEY && !token) {
      setErrorMessage("Bitte Sicherheitsprüfung abschließen.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot, turnstileToken: token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMessage(data.error ?? "Etwas ist schiefgelaufen.");
        setStatus("error");
        if (SITE_KEY && window.turnstile && widgetId.current) {
          window.turnstile.reset(widgetId.current);
          setToken("");
        }
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("Netzwerkfehler. Bitte später erneut versuchen.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded border border-status-online/40 p-4 font-mono text-sm text-status-online">
        {"> Nachricht gesendet. Danke — melde mich zeitnah zurück."}
      </div>
    );
  }

  return (
    <>
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          onLoad={() => setScriptLoaded(true)}
        />
      )}
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 font-mono text-sm"
      >
        {/* Honeypot: für echte Nutzer per CSS versteckt, Bots füllen oft blind alles aus */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-foreground-muted">{"> name"}</span>
          <input
            name="name"
            required
            maxLength={200}
            className="rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-foreground-muted">{"> email"}</span>
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            className="rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-foreground-muted">{"> message"}</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            className="rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>

        {SITE_KEY && <div ref={turnstileRef} />}

        <label className="flex items-start gap-2 text-xs text-foreground-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Ich habe die{" "}
            <Link href="/datenschutz" className="text-accent hover:underline">
              Datenschutzerklärung
            </Link>{" "}
            gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung
            dieser Anfrage einverstanden.
          </span>
        </label>

        {errorMessage && <p className="text-xs text-red-400">{`> ${errorMessage}`}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="self-start rounded border border-accent-dim px-4 py-2 uppercase tracking-widest text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
        >
          {status === "submitting" ? "sende..." : "senden →"}
        </button>
      </form>
    </>
  );
}
