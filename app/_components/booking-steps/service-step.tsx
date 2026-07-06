"use client";

import type { ServiceOption } from "../booking-wizard";

const CATEGORY_LABELS: Record<string, string> = {
  HAARE: "Haare",
  NAILS: "Nägel",
  BROWS: "Augenbrauen & Wimpern",
  PFLEGE: "Pflege",
};

interface ServiceStepProps {
  services: ServiceOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ServiceStep({ services, selectedId, onSelect }: ServiceStepProps) {
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-display text-2xl text-foreground">
        Welchen Service möchtest du buchen?
      </h2>

      {categories.map((category) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-foreground-muted">
            {CATEGORY_LABELS[category] ?? category}
          </h3>
          <div className="flex flex-col gap-3">
            {services
              .filter((service) => service.category === category)
              .map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onSelect(service.id)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                    selectedId === service.id
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-surface hover:border-accent"
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {service.name}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {service.durationMinutes} Min.
                    </p>
                  </div>
                  <span className="whitespace-nowrap font-medium text-foreground">
                    {(service.priceCents / 100).toFixed(2)} €
                  </span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
