import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail } from "@/lib/email";
import {
  addDaysToDateKey,
  getZonedDateKey,
  getZonedDayStart,
} from "@/lib/timezone";

// Läuft einmal täglich (siehe vercel.json) und verschickt Erinnerungsmails
// für alle bestätigten Termine, die morgen (Kalendertag in der
// Salon-Zeitzone, nicht der Server-Zeitzone) stattfinden. reminderSentAt
// verhindert Doppelversand.
function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  // Fail closed: ohne konfiguriertes Secret wird der Endpunkt nicht offen.
  if (!secret) return false;

  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayKey = getZonedDateKey(new Date());
  const tomorrowKey = addDaysToDateKey(todayKey, 1);
  const tomorrowStart = getZonedDayStart(tomorrowKey);
  const dayAfterTomorrowStart = getZonedDayStart(addDaysToDateKey(tomorrowKey, 1));

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
