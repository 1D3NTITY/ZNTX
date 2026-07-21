const NAME_MAX = 200;
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

// Bewusst simpel (kein RFC-5322-Vollparser) — reicht, um Tippfehler/offensichtlichen
// Unsinn abzufangen, ohne gültige, aber ungewöhnliche Adressen abzulehnen.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactData = {
  name: string;
  email: string;
  message: string;
};

type ContactErrors = Partial<Record<"name" | "email" | "message" | "honeypot", string>>;

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; errors: ContactErrors };

// Honeypot: verstecktes Feld, das echte Nutzer nie ausfüllen (per CSS versteckt),
// Bots füllen oft blind alle Felder aus. Einfache, kostenlose Bot-Falle zusätzlich
// zu Turnstile — Defense in Depth statt Einzelmaßnahme.
export function validateContactInput(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: { name: "Ungültige Eingabe" } };
  }

  const raw = input as Record<string, unknown>;
  const errors: ContactErrors = {};

  const honeypot = typeof raw.honeypot === "string" ? raw.honeypot : "";
  if (honeypot.trim() !== "") {
    // Bot-Falle ausgelöst — kein spezifisches Feedback, einfach ablehnen.
    return { ok: false, errors: { honeypot: "Ungültige Eingabe" } };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (name.length === 0) {
    errors.name = "Name darf nicht leer sein";
  } else if (name.length > NAME_MAX) {
    errors.name = `Name darf maximal ${NAME_MAX} Zeichen lang sein`;
  }

  if (email.length === 0) {
    errors.email = "E-Mail-Adresse darf nicht leer sein";
  } else if (email.length > EMAIL_MAX) {
    errors.email = `E-Mail-Adresse darf maximal ${EMAIL_MAX} Zeichen lang sein`;
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "E-Mail-Adresse ist ungültig";
  }

  if (message.length === 0) {
    errors.message = "Nachricht darf nicht leer sein";
  } else if (message.length < MESSAGE_MIN) {
    errors.message = `Nachricht muss mindestens ${MESSAGE_MIN} Zeichen lang sein`;
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Nachricht darf maximal ${MESSAGE_MAX} Zeichen lang sein`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, email, message } };
}

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

// fail-closed: bei jedem Fehler (Netzwerk, Parsing, ...) false zurückgeben statt zu
// werfen — eine kaputte Verbindung zu Cloudflare darf niemals versehentlich
// Spam durchlassen.
export async function verifyTurnstile(
  token: string,
  secretKey: string,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  try {
    const response = await fetchImpl(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: secretKey, response: token }),
      }
    );
    const data = (await response.json()) as TurnstileResponse;
    return data.success === true;
  } catch {
    return false;
  }
}
