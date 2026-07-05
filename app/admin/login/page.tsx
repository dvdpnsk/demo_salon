import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/admin-auth";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password");

    if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
      redirect("/admin/login?error=1");
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl text-foreground">Admin-Login</h1>
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

          {error && (
            <p className="text-sm text-red-600">
              Falsches Passwort. Bitte nochmal versuchen.
            </p>
          )}

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
