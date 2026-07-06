import { prisma } from "@/lib/prisma";
import { StaffForm } from "@/app/admin/_components/staff-form";
import { createStaff } from "@/lib/actions/staff";

export default async function NewStaffPage() {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">
        Neues Teammitglied
      </h1>
      <StaffForm
        action={createStaff}
        submitLabel="Anlegen"
        services={services}
      />
    </div>
  );
}
