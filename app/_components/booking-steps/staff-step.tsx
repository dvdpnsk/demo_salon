"use client";

import type { StaffOption } from "../booking-wizard";

interface StaffStepProps {
  staff: StaffOption[];
  selectedId: string | "any" | null;
  onSelect: (id: string | "any") => void;
  onBack: () => void;
}

export function StaffStep({ staff, selectedId, onSelect, onBack }: StaffStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-foreground">
        Bei wem möchtest du deinen Termin?
      </h2>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelect("any")}
          className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
            selectedId === "any"
              ? "border-accent bg-accent-soft"
              : "border-border bg-surface hover:border-accent"
          }`}
        >
          <p className="font-medium text-foreground">Egal, Hauptsache schnell</p>
          <p className="text-sm text-foreground-muted">
            Wir zeigen dir den frühesten freien Termin über unser ganzes Team.
          </p>
        </button>

        {staff.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(member.id)}
            className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
              selectedId === member.id
                ? "border-accent bg-accent-soft"
                : "border-border bg-surface hover:border-accent"
            }`}
          >
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-sm text-foreground-muted">{member.role}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-foreground-muted hover:text-foreground"
      >
        ← Zurück
      </button>
    </div>
  );
}
