import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const value = "admin";
  return `${value}.${sign(value)}`;
}

export function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (!value || !signature) return false;

  const expected = sign(value);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) return false;
  return timingSafeEqual(provided, expectedBuffer);
}
