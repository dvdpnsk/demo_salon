import { prisma } from "@/lib/prisma";
import {
  addDaysToDateKey,
  getWeekdayForDateKey,
  getZonedDateKey,
  getZonedDayStart,
  SALON_TIMEZONE,
} from "@/lib/timezone";

export const dynamic = "force-dynamic";

const DATETIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  timeZone: SALON_TIMEZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminOverviewPage() {
  const now = new Date();
  const todayKey = getZonedDateKey(now);
  const startOfToday = getZonedDayStart(todayKey);
  const endOfToday = getZonedDayStart(addDaysToDateKey(todayKey, 1));

  const weekStartKey = addDaysToDateKey(todayKey, -getWeekdayForDateKey(todayKey));
  const startOfWeek = getZonedDayStart(weekStartKey);
  const endOfWeek = getZonedDayStart(addDaysToDateKey(weekStartKey, 7));

  const [todayCount, weekCount, customerCount, upcomingBookings] =
    await Promise.all([
      prisma.booking.count({
        where: {
          startTime: { gte: startOfToday, lt: endOfToday },
          status: "CONFIRMED",
        },
      }),
      prisma.booking.count({
        where: {
          startTime: { gte: startOfWeek, lt: endOfWeek },
          status: "CONFIRMED",
        },
      }),
      prisma.customer.count(),
      prisma.booking.findMany({
        where: { startTime: { gte: now }, status: "CONFIRMED" },
        orderBy: { startTime: "asc" },
        take: 10,
        include: { service: true, staff: true, customer: true },
      }),
    ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-foreground">Übersicht</h1>
        <p className="mt-1 text-foreground-muted">Willkommen zurück.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground-muted">Termine heute</p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {todayCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground-muted">Termine diese Woche</p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {weekCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground-muted">Kund:innen gesamt</p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {customerCount}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground">
          Nächste Termine
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-foreground-muted">
                <th className="px-4 py-3 font-medium">Wann</th>
                <th className="px-4 py-3 font-medium">Kundin</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Mitarbeiter</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-foreground-muted"
                  >
                    Keine anstehenden Termine.
                  </td>
                </tr>
              )}
              {upcomingBookings.map((booking) => (
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
                  <td className="px-4 py-3 text-foreground">
                    {booking.service.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.staff.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
