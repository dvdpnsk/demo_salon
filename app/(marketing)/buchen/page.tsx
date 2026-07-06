import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/app/_components/booking-wizard";

export const metadata: Metadata = {
  title: "Termin buchen",
  description:
    "Sichere dir in wenigen Schritten deinen Wunschtermin bei Amara Studio — ganz ohne Anruf.",
};

export const dynamic = "force-dynamic";

export default async function Buchen() {
  const [services, staff] = await Promise.all([
    prisma.service.findMany({ orderBy: { category: "asc" } }),
    prisma.staff.findMany({ include: { services: true } }),
  ]);

  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.name,
    category: service.category as string,
    durationMinutes: service.durationMinutes,
    priceCents: service.priceCents,
  }));

  const staffOptions = staff.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    serviceIds: member.services.map((s) => s.serviceId),
  }));

  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Termin buchen
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground hyphens-auto sm:text-4xl lg:text-5xl">
          In wenigen Schritten zu deinem Wunschtermin.
        </h1>

        <div className="mt-12">
          <BookingWizard services={serviceOptions} staff={staffOptions} />
        </div>
      </div>
    </main>
  );
}
