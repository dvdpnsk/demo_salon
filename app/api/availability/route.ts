import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serviceId = searchParams.get("serviceId");
  const dateParam = searchParams.get("date");
  const staffId = searchParams.get("staffId");

  if (!serviceId || !dateParam) {
    return NextResponse.json(
      { error: "serviceId und date sind erforderlich" },
      { status: 400 }
    );
  }

  const date = new Date(dateParam);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Ungültiges Datum" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });
  if (!service) {
    return NextResponse.json(
      { error: "Service nicht gefunden" },
      { status: 404 }
    );
  }

  const staffList = await prisma.staff.findMany({
    where: {
      services: { some: { serviceId } },
      ...(staffId ? { id: staffId } : {}),
    },
  });

  if (staffList.length === 0) {
    return NextResponse.json([]);
  }

  const weekday = date.getDay();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const results = await Promise.all(
    staffList.map(async (staff) => {
      const [workingHours, bookings] = await Promise.all([
        prisma.workingHours.findUnique({
          where: { staffId_weekday: { staffId: staff.id, weekday } },
        }),
        prisma.booking.findMany({
          where: {
            staffId: staff.id,
            status: "CONFIRMED",
            startTime: { gte: dayStart, lt: dayEnd },
          },
          select: { startTime: true, endTime: true },
        }),
      ]);

      const slots = getAvailableSlots({
        date,
        durationMinutes: service.durationMinutes,
        workingHours: workingHours
          ? {
              startMinute: workingHours.startMinute,
              endMinute: workingHours.endMinute,
            }
          : null,
        existingBookings: bookings,
      });

      return {
        staffId: staff.id,
        staffName: staff.name,
        slots: slots.map((slot) => slot.toISOString()),
      };
    })
  );

  return NextResponse.json(results.filter((result) => result.slots.length > 0));
}
