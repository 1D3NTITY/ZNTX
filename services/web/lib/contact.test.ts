import { describe, it, expect, vi } from "vitest";
import { validateContactInput, verifyTurnstile } from "./contact";

describe("validateContactInput", () => {
  it("akzeptiert gültige Eingaben und trimmt Whitespace", () => {
    const result = validateContactInput({
      name: "  Luis  ",
      message: "  Hallo, das ist eine Testnachricht.  ",
      honeypot: "",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Luis");
      expect(result.data.message).toBe("Hallo, das ist eine Testnachricht.");
    }
  });

  it("lehnt fehlenden Namen ab", () => {
    const result = validateContactInput({
      name: "",
      message: "Eine ausreichend lange Nachricht.",
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("lehnt Namen ab, der nur aus Whitespace besteht", () => {
    const result = validateContactInput({
      name: "   ",
      message: "Eine ausreichend lange Nachricht.",
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("lehnt zu langen Namen ab (> 200 Zeichen)", () => {
    const result = validateContactInput({
      name: "a".repeat(201),
      message: "Eine ausreichend lange Nachricht.",
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("lehnt fehlende Nachricht ab", () => {
    const result = validateContactInput({
      name: "Luis",
      message: "",
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("lehnt zu kurze Nachricht ab (< 10 Zeichen)", () => {
    const result = validateContactInput({
      name: "Luis",
      message: "zu kurz",
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("lehnt zu lange Nachricht ab (> 5000 Zeichen)", () => {
    const result = validateContactInput({
      name: "Luis",
      message: "a".repeat(5001),
      honeypot: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("lehnt ausgefülltes Honeypot-Feld ab (Bot-Falle)", () => {
    const result = validateContactInput({
      name: "Luis",
      message: "Eine ausreichend lange Nachricht.",
      honeypot: "ich bin ein bot",
    });
    expect(result.ok).toBe(false);
  });

  it("lehnt non-object Input ab statt zu crashen", () => {
    const result = validateContactInput(null);
    expect(result.ok).toBe(false);
  });
});

describe("verifyTurnstile", () => {
  it("gibt true zurück bei success:true", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });
    const ok = await verifyTurnstile("token", "secret", fetchImpl as unknown as typeof fetch);
    expect(ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("gibt false zurück bei success:false", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
    });
    const ok = await verifyTurnstile("token", "secret", fetchImpl as unknown as typeof fetch);
    expect(ok).toBe(false);
  });

  it("fail-closed: gibt false zurück bei Netzwerkfehler statt zu werfen", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network down"));
    const ok = await verifyTurnstile("token", "secret", fetchImpl as unknown as typeof fetch);
    expect(ok).toBe(false);
  });
});
