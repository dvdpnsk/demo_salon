import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isValidEmail, isValidName, isValidPhone } from "@/lib/validation";

interface BookingRequestBody {
  serviceId: string;
  staffId: string;
  startTime: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

class SlotUnavailableError extends Error {}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<BookingRequestBody>;

  if (
    !body.serviceId ||
    !body.staffId ||
    !body.startTime ||
    !body.customer?.name ||
    !body.customer?.email ||
    !body.customer?.phone
  ) {
    return NextResponse.json(
      { error: "serviceId, staffId, startTime und Kundendaten sind erforderlich" },
      { status: 400 }
    );
  }

  if (!isValidName(body.customer.name)) {
    return NextResponse.json(
      { error: "Bitte einen gültigen Vor- und Nachnamen angeben." },
      { status: 400 }
    );
  }
  if (!isValidEmail(body.customer.email)) {
    return NextResponse.json(
      { error: "Bitte eine gültige E-Mail-Adresse angeben." },
      { status: 400 }
    );
  }
  if (!isValidPhone(body.customer.phone)) {
    return NextResponse.json(
      { error: "Bitte eine gültige Telefonnummer angeben." },
      { status: 400 }
    );
  }

  const startTime = new Date(body.startTime);
  if (Number.isNaN(startTime.getTime())) {
    return NextResponse.json({ error: "Ungültige Startzeit" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id: body.serviceId },
  });
  if (!service) {
    return NextResponse.json(
      { error: "Service nicht gefunden" },
      { status: 404 }
    );
  }

  const staffOffersService = await prisma.staffService.findUnique({
    where: {
      staffId_serviceId: { staffId: body.staffId, serviceId: body.serviceId },
    },
  });
  if (!staffOffersService) {
    return NextResponse.json(
      { error: "Dieser Mitarbeiter bietet diesen Service nicht an" },
      { status: 400 }
    );
  }

  const endTime = new Date(
    startTime.getTime() + service.durationMinutes * 60_000
  );
  const staffId = body.staffId;
  const serviceId = body.serviceId;
  const customerInput = body.customer;

  try {
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

        const customer = await tx.customer.upsert({
          where: { email: customerInput.email },
          update: {
            name: customerInput.name,
            phone: customerInput.phone,
          },
          create: {
            name: customerInput.name,
            email: customerInput.email,
            phone: customerInput.phone,
          },
        });

        return tx.booking.create({
          data: {
            customerId: customer.id,
            staffId,
            serviceId,
            startTime,
            endTime,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json(
        { error: "Dieser Termin ist leider nicht mehr verfügbar." },
        { status: 409 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        { error: "Dieser Termin wurde gerade von jemand anderem gebucht." },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen." },
      { status: 500 }
    );
  }
}
