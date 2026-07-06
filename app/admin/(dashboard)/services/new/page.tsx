import { ServiceForm } from "@/app/admin/_components/service-form";
import { createService } from "@/lib/actions/services";

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">Neuer Service</h1>
      <ServiceForm action={createService} submitLabel="Service anlegen" />
    </div>
  );
}
