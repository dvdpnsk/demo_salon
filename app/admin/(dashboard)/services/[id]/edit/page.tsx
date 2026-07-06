import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/app/admin/_components/service-form";
import { updateService } from "@/lib/actions/services";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  const updateWithId = updateService.bind(null, service.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">
        Service bearbeiten
      </h1>
      <ServiceForm
        action={updateWithId}
        submitLabel="Änderungen speichern"
        initial={{
          name: service.name,
          category: service.category,
          durationMinutes: service.durationMinutes,
          priceCents: service.priceCents,
        }}
      />
    </div>
  );
}
