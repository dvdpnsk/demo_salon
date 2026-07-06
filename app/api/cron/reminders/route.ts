import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail } from "@/lib/email";

// Läuft einmal täglich (siehe vercel.json) und verschickt Erinnerungsmails
// für alle bestätigten Termine, die morgen (Kalendertag, Server-Zeitzone)
// stattfinden. reminderSentAt verhindert Doppelversand.
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const tomorrowStart = new Date();
  tomorrowStart.setHours(0, 0, 0, 0);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dayAfterTomorrowStart = new Date(tomorrowStart);
  dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSentAt: null,
      startTime: { gte: tomorrowStart, lt: dayAfterTomorrowStart },
    },
    include: { service: true, staff: true, customer: true },
  });

  let sent = 0;
  for (const booking of bookings) {
    try {
      await sendBookingReminderEmail({
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        serviceName: booking.service.name,
        staffName: booking.staff.name,
        startTime: booking.startTime,
        priceCents: booking.service.priceCents,
        managementToken: booking.managementToken,
      });
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSentAt: new Date() },
      });
      sent += 1;
    } catch (error) {
      console.error(
        `[cron/reminders] Erinnerung für Buchung ${booking.id} fehlgeschlagen:`,
        error
      );
    }
  }

  return NextResponse.json({ checked: bookings.length, sent });
}
