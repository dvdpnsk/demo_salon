import { prisma } from "@/lib/prisma";
import {
  ServiceCategories,
  type ServiceCategoryData,
} from "@/app/_components/service-categories";

const CATEGORY_ORDER = ["HAARE", "NAILS", "BROWS", "PFLEGE"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  HAARE: "Haare",
  NAILS: "Nails",
  BROWS: "Brows & Lashes",
  PFLEGE: "Pflege",
};

function formatPrice(cents: number) {
  const euros = cents / 100;
  return Number.isInteger(euros) ? `ab ${euros} €` : `ab ${euros.toFixed(2)} €`;
}

export default async function Leistungen() {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  const categories: ServiceCategoryData[] = CATEGORY_ORDER.map(
    (key, index) => ({
      key,
      number: String(index + 1).padStart(2, "0"),
      title: CATEGORY_LABELS[key],
      items: services
        .filter((service) => service.category === key)
        .map((service) => ({
          name: service.name,
          price: formatPrice(service.priceCents),
        })),
    })
  ).filter((category) => category.items.length > 0);

  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-4xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Preise & Leistungen
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground hyphens-auto sm:text-4xl lg:text-5xl">
          Transparent, fair, ohne Überraschungen.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground-muted">
          Alle Preise verstehen sich als Richtwert — je nach Haarlänge und
          Aufwand beraten wir dich individuell vor jedem Termin.
        </p>

        <div className="mt-16">
          <ServiceCategories categories={categories} />
        </div>

        <div className="mt-16 text-center">
          <a
            href="/buchen"
            className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Termin buchen
          </a>
        </div>
      </div>
    </main>
  );
}
