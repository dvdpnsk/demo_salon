"use client";

import { useMemo, useState } from "react";
import { createBookingByAdmin } from "@/lib/actions/bookings";
import { NAME_PATTERN, PHONE_PATTERN } from "@/lib/validation";

interface ServiceOption {
  id: string;
  name: string;
  durationMinutes: number;
}

interface StaffOption {
  id: string;
  name: string;
  serviceIds: string[];
}

interface NewBookingFormProps {
  services: ServiceOption[];
  staff: StaffOption[];
}

export function NewBookingForm({ services, staff }: NewBookingFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");

  const eligibleStaff = useMemo(
    () => staff.filter((member) => member.serviceIds.includes(serviceId)),
    [staff, serviceId]
  );

  return (
    <form
      action={createBookingByAdmin}
      className="flex max-w-lg flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="serviceId"
          className="text-sm font-medium text-foreground"
        >
          Service
        </label>
        <select
          id="serviceId"
          name="serviceId"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.durationMinutes} Min.)
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="staffId"
          className="text-sm font-medium text-foreground"
        >
          Mitarbeiter:in
        </label>
        <select
          id="staffId"
          name="staffId"
          required
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        >
          {eligibleStaff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="startTime"
          className="text-sm font-medium text-foreground"
        >
          Datum & Uhrzeit
        </label>
        <input
          id="startTime"
          name="startTime"
          type="datetime-local"
          required
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name der Kundin
        </label>
        <input
          id="name"
          name="name"
          required
          pattern={NAME_PATTERN.source}
          title="Bitte Vor- und Nachnamen eingeben"
          placeholder="Anna Meyer"
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="name@beispiel.de"
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-foreground"
        >
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          pattern={PHONE_PATTERN.source}
          title="Bitte eine gültige Telefonnummer eingeben"
          placeholder="0176 12345678"
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Termin anlegen
      </button>
    </form>
  );
}
