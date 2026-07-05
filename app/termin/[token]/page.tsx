import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const DATETIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
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

interface TerminPageProps {
  params: Promise<{ token: string }>;
}

export default async function TerminPage({ params }: TerminPageProps) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { managementToken: token },
    include: { service: true, staff: true },
  });

  if (!booking) {
    notFound();
  }

  const isPast = booking.startTime.getTime() < Date.now();
  const canCancel = booking.status === "CONFIRMED" && !isPast;

  async function cancelBooking() {
    "use server";
    await prisma.booking.update({
      where: { managementToken: token },
      data: { status: "CANCELLED" },
    });
    revalidatePath(`/termin/${token}`);
  }

  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-lg">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Dein Termin
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          {booking.service.name}
        </h1>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
              Wann
            </p>
            <p className="mt-1 text-foreground">
              {DATETIME_FORMATTER.format(booking.startTime)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
              Bei
            </p>
            <p className="mt-1 text-foreground">{booking.staff.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
              Status
            </p>
            <p className="mt-1 text-foreground">
              {STATUS_LABELS[booking.status] ?? booking.status}
            </p>
          </div>
        </div>

        {canCancel && (
          <form action={cancelBooking} className="mt-8">
            <button
              type="submit"
              className="rounded-full border border-red-300 px-6 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Termin stornieren
            </button>
          </form>
        )}

        {!canCancel && booking.status === "CANCELLED" && (
          <p className="mt-8 text-sm text-foreground-muted">
            Dieser Termin wurde storniert.
          </p>
        )}

        {!canCancel && booking.status === "CONFIRMED" && isPast && (
          <p className="mt-8 text-sm text-foreground-muted">
            Dieser Termin liegt in der Vergangenheit.
          </p>
        )}
      </div>
    </main>
  );
}
