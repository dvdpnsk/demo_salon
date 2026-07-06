import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteService } from "@/lib/actions/services";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  HAARE: "Haare",
  NAILS: "Nägel",
  BROWS: "Augenbrauen & Wimpern",
  PFLEGE: "Pflege",
};

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Services</h1>
          <p className="mt-1 text-foreground-muted">
            Leistungen, Preise und Dauer verwalten.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          + Neuer Service
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Kategorie</th>
              <th className="px-4 py-3 font-medium">Dauer</th>
              <th className="px-4 py-3 font-medium">Preis</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-border last:border-none"
              >
                <td className="px-4 py-3 text-foreground">{service.name}</td>
                <td className="px-4 py-3 text-foreground-muted">
                  {CATEGORY_LABELS[service.category] ?? service.category}
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {service.durationMinutes} Min.
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {(service.priceCents / 100).toFixed(2)} €
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      Bearbeiten
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={service.id} />
                      <ConfirmSubmitButton
                        label="Löschen"
                        confirmMessage={`Service "${service.name}" wirklich löschen?`}
                        className="text-sm font-medium text-red-600 hover:underline"
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
