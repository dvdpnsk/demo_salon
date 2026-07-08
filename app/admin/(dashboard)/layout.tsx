import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { AdminNav } from "@/app/admin/_components/admin-nav";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-lg text-foreground">
            Admin — Amara Studio
          </span>
          <AdminNav />
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
