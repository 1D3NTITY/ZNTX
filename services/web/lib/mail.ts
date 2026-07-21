import nodemailer from "nodemailer";

export type ContactNotification = {
  name: string;
  email: string;
  message: string;
};

// Best-effort: schlägt der Mailversand fehl, bleibt die Anfrage trotzdem in der
// DB gespeichert (siehe route.ts) — eine kaputte SMTP-Verbindung darf niemals
// dazu führen, dass eine echte Anfrage als Fehler beim Absender ankommt.
export async function sendContactNotification(
  data: ContactNotification
): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_EMAIL_TO || "kontakt@zntx.de";

  if (!host || !user || !password) {
    console.warn(
      "SMTP nicht konfiguriert (SMTP_HOST/SMTP_USER/SMTP_PASSWORD fehlen) — Benachrichtigungsmail übersprungen."
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  try {
    await transporter.sendMail({
      from: `"zntx Kontaktformular" <${user}>`,
      to,
      replyTo: data.email,
      subject: `Neue Kontaktanfrage von ${data.name}`,
      text: `Name: ${data.name}\nE-Mail: ${data.email}\n\n${data.message}`,
    });
    return true;
  } catch (err) {
    console.error("contact notification email failed", err);
    return false;
  }
}
