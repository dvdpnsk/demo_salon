"use client";

import type { ServiceOption, CustomerInput } from "../booking-wizard";
import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from "@/lib/validation";

const DATETIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

interface ContactStepProps {
  service: ServiceOption;
  staffName: string;
  slot: string;
  customer: CustomerInput;
  onChange: (customer: CustomerInput) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}

export function ContactStep({
  service,
  staffName,
  slot,
  customer,
  onChange,
  onSubmit,
  onBack,
  submitting,
  error,
}: ContactStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-foreground">
        Fast geschafft — deine Kontaktdaten
      </h2>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="font-medium text-foreground">{service.name}</p>
        <p className="mt-1 text-sm text-foreground-muted">
          bei {staffName} · {DATETIME_FORMATTER.format(new Date(slot))}
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            required
            pattern={NAME_PATTERN.source}
            title="Bitte Vor- und Nachnamen eingeben (z. B. Anna Meyer)"
            placeholder="Anna Meyer"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            required
            pattern={EMAIL_PATTERN.source}
            title="Bitte eine gültige E-Mail-Adresse eingeben (z. B. name@beispiel.de)"
            placeholder="name@beispiel.de"
            value={customer.email}
            onChange={(e) => onChange({ ...customer, email: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            required
            pattern={PHONE_PATTERN.source}
            title="Bitte eine gültige Telefonnummer eingeben (z. B. 0176 12345678 oder +49 176 12345678)"
            placeholder="0176 12345678"
            value={customer.phone}
            onChange={(e) => onChange({ ...customer, phone: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "Wird gebucht…" : "Termin verbindlich buchen"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-foreground-muted hover:text-foreground"
          >
            ← Zurück
          </button>
        </div>
      </form>
    </div>
  );
}
