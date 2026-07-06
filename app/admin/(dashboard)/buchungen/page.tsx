import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRENCY_FORMATTER } from "@/lib/format";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { SALON_TIMEZONE } from "@/lib/timezone";

const DATETIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  timeZone: SALON_TIMEZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Bestätigt",
  CANCELLED: "Storniert",
  COMPLETED: "Abgeschlossen",
};

const FILTERS = [
  { value: "ALL", label: "Alle" },
  { value: "CONFIRMED", label: "Bestätigt" },
  { value: "CANCELLED", label: "Storniert" },
] as const;

interface BuchungenPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function BuchungenPage({
  searchParams,
}: BuchungenPageProps) {
  const { status } = await searchParams;
  const activeFilter =
    status === "CONFIRMED" || status === "CANCELLED" ? status : "ALL";

  const bookings = await prisma.booking.findMany({
    where: activeFilter === "ALL" ? {} : { status: activeFilter },
    orderBy: { startTime: "asc" },
    include: { service: true, staff: true, customer: true },
  });

  async function cancelBooking(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id !== "string") return;
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    revalidatePath("/admin/buchungen");
    revalidatePath("/admin");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            Buchungen
          </h1>
          <p className="mt-1 text-foreground-muted">
            Alle Termine im Überblick.
          </p>
        </div>
        <Link
          href="/admin/buchungen/neu"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          + Neuer Termin
        </Link>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? "/admin/buchungen"
                : `/admin/buchungen?status=${filter.value}`
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-accent text-white"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="px-4 py-3 font-medium">Wann</th>
              <th className="px-4 py-3 font-medium">Kundin</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Preis</th>
              <th className="px-4 py-3 font-medium">Mitarbeiter</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-foreground-muted"
                >
                  Keine Buchungen gefunden.
                </td>
              </tr>
            )}
            {bookings.map((booking) => {
              const canCancel =
                booking.status === "CONFIRMED" &&
                booking.startTime.getTime() > Date.now();
              return (
                <tr
                  key={booking.id}
                  className="border-b border-border last:border-none"
                >
                  <td className="px-4 py-3 text-foreground">
                    {DATETIME_FORMATTER.format(booking.startTime)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.customer.name}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    <div>{booking.customer.email}</div>
                    <div>{booking.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.service.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {CURRENCY_FORMATTER.format(booking.service.priceCents / 100)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.staff.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </td>
                  <td className="px-4 py-3">
                    {canCancel && (
                      <form action={cancelBooking}>
                        <input type="hidden" name="id" value={booking.id} />
                        <ConfirmSubmitButton
                          label="Stornieren"
                          confirmMessage={`Termin von ${booking.customer.name} wirklich stornieren?`}
                          className="text-sm font-medium text-red-600 hover:underline"
                        />
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
