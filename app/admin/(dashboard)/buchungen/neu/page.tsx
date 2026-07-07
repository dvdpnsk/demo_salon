import { prisma } from "@/lib/prisma";
import { NewBookingForm } from "@/app/admin/_components/new-booking-form";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const [services, staff] = await Promise.all([
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.staff.findMany({
      include: { services: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.name,
    durationMinutes: service.durationMinutes,
  }));

  const staffOptions = staff.map((member) => ({
    id: member.id,
    name: member.name,
    serviceIds: member.services.map((s) => s.serviceId),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">Neuer Termin</h1>
      <NewBookingForm services={serviceOptions} staff={staffOptions} />
    </div>
  );
}
