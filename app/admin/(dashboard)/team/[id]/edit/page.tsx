import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StaffForm } from "@/app/admin/_components/staff-form";
import { updateStaff } from "@/lib/actions/staff";

interface EditStaffPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params;

  const [staffMember, services] = await Promise.all([
    prisma.staff.findUnique({ where: { id }, include: { services: true } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!staffMember) {
    notFound();
  }

  const updateWithId = updateStaff.bind(null, staffMember.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">
        Teammitglied bearbeiten
      </h1>
      <StaffForm
        action={updateWithId}
        submitLabel="Änderungen speichern"
        services={services}
        initial={{
          name: staffMember.name,
          role: staffMember.role,
          bio: staffMember.bio,
          serviceIds: staffMember.services.map((s) => s.serviceId),
          imageUrl: staffMember.imageUrl,
        }}
      />
    </div>
  );
}
