import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";

export class SlotUnavailableError extends Error {}
export class ServiceNotFoundError extends Error {}
export class StaffServiceMismatchError extends Error {}

interface CreateBookingInput {
  serviceId: string;
  staffId: string;
  startTime: Date;
  customer: { name: string; email: string; phone: string };
}

export async function createBooking({
  serviceId,
  staffId,
  startTime,
  customer,
}: CreateBookingInput) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new ServiceNotFoundError();

  const staffOffersService = await prisma.staffService.findUnique({
    where: { staffId_serviceId: { staffId, serviceId } },
  });
  if (!staffOffersService) throw new StaffServiceMismatchError();

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
