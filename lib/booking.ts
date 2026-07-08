import { randomBytes } from "crypto";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { getAvailableSlots } from "@/lib/availability";
import {
  addDaysToDateKey,
  getWeekdayForDateKey,
  getZonedDateKey,
  getZonedDayStart,
} from "@/lib/timezone";

export class SlotUnavailableError extends Error {}
export class ServiceNotFoundError extends Error {}
export class StaffServiceMismatchError extends Error {}

interface CreateBookingInput {
  serviceId: string;
  staffId: string;
  startTime: Date;
  customer: { name: string; email: string; phone: string };
  // Öffentliche Buchungen (true) müssen einem real angebotenen Slot
  // entsprechen. Admin-Buchungen (false) dürfen bewusst außerhalb der
  // Öffnungszeiten liegen.
  enforceAvailability?: boolean;
}

function generateManagementToken() {
  // Kryptografisch zufälliger, unvorhersehbarer Token – dient als einzige
  // Zugriffskontrolle für die Terminverwaltung, daher kein cuid/sequentieller Wert.
  return randomBytes(32).toString("base64url");
}

async function assertSlotIsOffered(
  staffId: string,
  serviceDurationMinutes: number,
  startTime: Date
) {
  const dateKey = getZonedDateKey(startTime);
  const weekday = getWeekdayForDateKey(dateKey);
  const dayStart = getZonedDayStart(dateKey);
  const dayEnd = getZonedDayStart(addDaysToDateKey(dateKey, 1));

  const [workingHours, existingBookings] = await Promise.all([
    prisma.workingHours.findUnique({
      where: { staffId_weekday: { staffId, weekday } },
    }),
    prisma.booking.findMany({
      where: {
        staffId,
        status: "CONFIRMED",
        startTime: { gte: dayStart, lt: dayEnd },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const slots = getAvailableSlots({
    dayStart,
    durationMinutes: serviceDurationMinutes,
    workingHours: workingHours
      ? {
          startMinute: workingHours.startMinute,
          endMinute: workingHours.endMinute,
        }
      : null,
    existingBookings,
  });

  const requested = startTime.getTime();
  if (!slots.some((slot) => slot.getTime() === requested)) {
    throw new SlotUnavailableError();
  }
}

export async function createBooking({
  serviceId,
  staffId,
  startTime,
  customer,
  enforceAvailability = false,
}: CreateBookingInput) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new ServiceNotFoundError();

  const staffOffersService = await prisma.staffService.findUnique({
    where: { staffId_serviceId: { staffId, serviceId } },
  });
  if (!staffOffersService) throw new StaffServiceMismatchError();

  if (enforceAvailability) {
    await assertSlotIsOffered(staffId, service.durationMinutes, startTime);
  }

  const endTime = new Date(
    startTime.getTime() + service.durationMinutes * 60_000
  );

  const booking = await prisma.$transaction(
    async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          staffId,
          status: "CONFIRMED",
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (conflict) {
        throw new SlotUnavailableError();
      }

      const customerRecord = await tx.customer.upsert({
        where: { email: customer.email },
        update: { name: customer.name, phone: customer.phone },
        create: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      });

      return tx.booking.create({
        data: {
          customerId: customerRecord.id,
          staffId,
          serviceId,
          startTime,
          endTime,
          managementToken: generateManagementToken(),
        },
        include: { service: true, staff: true, customer: true },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  try {
    await sendBookingConfirmationEmail({
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      serviceName: booking.service.name,
      staffName: booking.staff.name,
      startTime: booking.startTime,
      priceCents: booking.service.priceCents,
      managementToken: booking.managementToken,
    });
  } catch (error) {
    console.error("[booking] Bestätigungsmail konnte nicht gesendet werden:", error);
  }

  return booking;
}
