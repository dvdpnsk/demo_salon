import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import {
  createBooking,
  ServiceNotFoundError,
  SlotUnavailableError,
  StaffServiceMismatchError,
} from "@/lib/booking";
import { isValidEmail, isValidName, isValidPhone } from "@/lib/validation";
import { checkRateLimit, getClientIpFromRequest } from "@/lib/rate-limit";

// Max. 8 Buchungsversuche pro IP in 10 Minuten (gegen Spam / E-Mail-Bombing).
const BOOKING_LIMIT = 8;
const BOOKING_WINDOW_SECONDS = 60 * 10;

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

export async function POST(request: NextRequest) {
  const ip = getClientIpFromRequest(request);
  const rate = checkRateLimit(`booking:${ip}`, BOOKING_LIMIT, BOOKING_WINDOW_SECONDS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

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

  try {
    const booking = await createBooking({
      serviceId: body.serviceId,
      staffId: body.staffId,
      startTime,
      customer: body.customer,
      enforceAvailability: true,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceNotFoundError) {
      return NextResponse.json(
        { error: "Service nicht gefunden" },
        { status: 404 }
      );
    }

    if (error instanceof StaffServiceMismatchError) {
      return NextResponse.json(
        { error: "Dieser Mitarbeiter bietet diesen Service nicht an" },
        { status: 400 }
      );
    }

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
