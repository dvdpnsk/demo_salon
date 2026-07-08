import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "admin_session";

// Gültigkeitsdauer einer Session (7 Tage). Der Ablauf ist Teil des
// signierten Payloads, sodass ein kopiertes Cookie serverseitig abläuft –
// anders als bei einem statischen Token.
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET ist nicht gesetzt");
  }
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [value, expiresAtRaw, signature] = parts;
  if (value !== "admin" || !expiresAtRaw || !signature) return false;

  const payload = `${value}.${expiresAtRaw}`;
  if (!safeEqualHex(signature, sign(payload))) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  return true;
}

// In Server-Actions/-Components aufrufen, um Admin-Zugriff zu erzwingen.
// Verlässt sich NICHT allein auf die Middleware-Pfadregel, da Server-Actions
// über beliebige Routen aufgerufen werden können.
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }
}
