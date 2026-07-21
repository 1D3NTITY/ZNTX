import { NextResponse } from "next/server";
import { validateContactInput, verifyTurnstile } from "@/lib/contact";
import { isRateLimited } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { sendContactNotification } from "@/lib/mail";

function getClientIp(request: Request): string {
  // Caddy hat trusted_proxies für Cloudflare konfiguriert — CF-Connecting-IP ist die
  // echte Client-IP, X-Forwarded-For als Fallback (siehe /etc/caddy/Caddyfile).
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  const validation = validateContactInput(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: "Eingabe ungültig.", fieldErrors: validation.errors },
      { status: 400 }
    );
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY ?? "";
  let turnstileVerified = false;
  if (secretKey) {
    const token =
      typeof (body as Record<string, unknown>).turnstileToken === "string"
        ? ((body as Record<string, unknown>).turnstileToken as string)
        : "";
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Sicherheitsprüfung fehlgeschlagen." },
        { status: 400 }
      );
    }
    turnstileVerified = await verifyTurnstile(token, secretKey);
    if (!turnstileVerified) {
      return NextResponse.json(
        { ok: false, error: "Sicherheitsprüfung fehlgeschlagen." },
        { status: 400 }
      );
    }
  }
  // Kein secretKey konfiguriert (noch nicht eingerichtet) → Verifikation wird
  // übersprungen, analog ravepuls-Muster (infra/docker-compose.yml-Kommentar dort).

  try {
    await db.insert(contactMessages).values({
      name: validation.data.name,
      email: validation.data.email,
      message: validation.data.message,
      turnstileVerified,
    });
  } catch (err) {
    console.error("contact insert failed", err);
    return NextResponse.json(
      { ok: false, error: "Serverfehler. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }

  // Best-effort: die Anfrage ist bereits sicher in der DB, ein Mail-Fehler darf
  // den Absender nicht als Fehlschlag erreichen.
  void sendContactNotification(validation.data);

  return NextResponse.json({ ok: true });
}
