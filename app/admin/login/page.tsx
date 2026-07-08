import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

// Max. 10 Login-Versuche pro IP in 5 Minuten.
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_SECONDS = 60 * 5;

function passwordsMatch(provided: string, expected: string) {
  // sha256 normalisiert die Länge, damit timingSafeEqual nicht wirft und
  // der Vergleich keinen Längen-/Timing-Seitenkanal öffnet.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password");

    const ip = await getClientIp();
    const rate = checkRateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_SECONDS);
    if (!rate.allowed) {
      redirect("/admin/login?error=locked");
    }

    const expected = process.env.ADMIN_PASSWORD;
    if (
      typeof password !== "string" ||
      !expected ||
      !passwordsMatch(password, expected)
    ) {
      redirect("/admin/login?error=1");
    }

    // Erfolgreicher Login: Zähler für diese IP zurücksetzen.
    resetRateLimit(`login:${ip}`);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl text-foreground">
          Admin-Anmeldung
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Nur für die Salon-Leitung.
        </p>

        <form action={login} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>

          {error === "locked" ? (
            <p className="text-sm text-red-600">
              Zu viele Versuche. Bitte in einigen Minuten erneut versuchen.
            </p>
          ) : error ? (
            <p className="text-sm text-red-600">
              Falsches Passwort. Bitte nochmal versuchen.
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Einloggen
          </button>
        </form>
      </div>
    </main>
  );
}
